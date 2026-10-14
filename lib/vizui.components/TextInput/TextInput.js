/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Text input component with validation and submit/invalid events.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
import Button from '../Button/Button.js';
import Utilities from '../Utilities.js';
export class TextInput extends Component {
    static { this.css.load('TextInput.css', import.meta); }
    root = Element.new('div').setClass('TextInput');
    eInput;
    cButton;
    vValidator;
    constructor(props = {}) {
        super();
        const { input = {}, button = null } = props;
        const { placeholder = '', type = 'text', value = '', validator = () => true, ...inputIdentity } = input;
        this.vValidator = validator;
        Utilities.setIdentity(this, props);
        this.setEventProps(props);
        this.eInput = type === 'textarea'
            ? Element.new('textarea').setAttributes({ class: 'input', placeholder })
            : Element.new('input').setAttributes({ class: 'input', type, placeholder });
        Utilities.setIdentity(this.eInput, inputIdentity);
        if (value)
            this.eInput.root.value = value;
        this.root.append(this.eInput);
        this.eInput.on('input', (e) => this.emit('input', this.value, e));
        this.eInput.on('keypress', (event) => {
            if (event.key == 'Enter')
                this.handle(event);
        });
        if (button) {
            const { text, icon, ...identity } = button;
            this.cButton = new Button({ text: text || '', icon, class: 'button' });
            Utilities.setIdentity(this.cButton, identity);
            this.cButton.on('click', () => this.handle());
            this.root.append(this.cButton);
        }
    }
    get value() { return this.eInput.root.value; }
    set value(value) { this.eInput.root.value = value; }
    /** Clears the text input, setting its value to an empty string. */
    clear() { this.eInput.root.value = ''; }
    /** Sends the current text value, emitting a 'submit' event if the value is valid according to the validator, or an 'invalid' event if it is not. */
    handle(event) {
        const text = this.eInput.root.value;
        if (this.vValidator(text))
            this.emit('submit', text, event);
        else
            this.emit('invalid', text, event);
    }
}
export default TextInput;
//# sourceMappingURL=TextInput.js.map