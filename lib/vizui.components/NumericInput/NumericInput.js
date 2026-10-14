/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Numeric input component with validation and submit/invalid events.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
import Utilities from '../Utilities.js';
export class NumericInput extends Component {
    static { this.css.load('NumericInput.css', import.meta); }
    root = Element.new('div').setClass('NumericInput');
    eInput;
    eButton;
    vValidator;
    constructor(props = {}) {
        super();
        const { placeholder = 'number', name = 'number', value, validator = () => true, button = null } = props;
        this.vValidator = validator;
        this.eInput = Element.new('input').setAttributes({
            type: 'number', name, placeholder,
        });
        Utilities.setIdentity(this, props);
        this.setEventProps(props);
        this.root.append(this.eInput);
        this.eInput.on('input', (e) => this.emit('input', this.value, e));
        this.eInput.on('keypress', (event) => {
            if (event.key == 'Enter')
                this.submit(event);
        });
        if (value !== undefined)
            this.eInput.root.value = value.toString();
        if (button) {
            this.eButton = Element.new('button').setText(button);
            this.root.append(this.eButton);
            this.eButton.on('click', () => this.submit());
        }
    }
    get value() {
        const value = this.eInput.root.value || '0';
        const number = parseFloat(value);
        return isNaN(number) ? 0 : number;
    }
    set value(value) { this.eInput.root.value = value.toString(); }
    clear() { this.eInput.root.value = ''; }
    submit(event) {
        const value = this.value;
        if (this.vValidator(value))
            this.emit('submit', value, event);
        else
            this.emit('invalid', value, event);
    }
}
export default NumericInput;
//# sourceMappingURL=NumericInput.js.map