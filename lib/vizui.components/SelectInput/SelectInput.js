/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Select dropdown input component emitting submit events.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
import Utilities from '../Utilities.js';
export class SelectInput extends Component {
    static { this.css.load('SelectInput.css', import.meta); }
    root = Element.new('select').setAttributes({ name: 'select', class: 'SelectInput' });
    vPlaceholder;
    constructor(props = {}) {
        super();
        const { optionList = [], placeholder = 'select', ...identity } = props;
        this.vPlaceholder = placeholder;
        const eOptions = [
            Element.new('option').setText(placeholder).setAttributes({ disabled: 'true', value: '' }),
            ...optionList.map(option => Element.new('option').setText(option)),
        ];
        this.root.append(...eOptions);
        Utilities.setIdentity(this, identity);
        this.setEventProps(props);
        this.root.on('change', (e) => this.emit('submit', this.getSelected(), e));
    }
    getSelected() {
        if (this.root.root.value === '')
            return '';
        return this.root.root.value;
    }
    setSelected(option) {
        this.root.root.value = option;
    }
}
export default SelectInput;
//# sourceMappingURL=SelectInput.js.map