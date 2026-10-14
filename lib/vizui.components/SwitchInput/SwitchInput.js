/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Toggle switch input component emitting change events.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
import Utilities from '../Utilities.js';
export class SwitchInput extends Component {
    static { this.css.load('SwitchInput.css', import.meta); }
    root = Element.new('div').setClass('SwitchInput');
    vState;
    constructor(props = {}) {
        super();
        const { defaultState = true, label = '' } = props;
        const id = 'switchInput-' + Math.random().toString(36).substring(2, 9);
        this.vState = defaultState;
        const eLabel = Element.new('label')
            .setText(label)
            .setAttribute('for', id)
            .on('click', (e) => this.toggleState(e));
        const eTrack = Element.new('div')
            .setAttributes({ id, class: 'switch-track' })
            .append(Element.new('div').setClass('switch-knob'))
            .on('click', (e) => this.toggleState(e));
        Utilities.setIdentity(this, props);
        this.setEventProps(props);
        this.root.append(eLabel, eTrack).toggleClass('active', this.vState);
    }
    toggleState(event) {
        this.vState = !this.vState;
        this.root.toggleClass('active', this.vState);
        this.emit('change', this.vState, event);
    }
    getState() {
        return this.vState;
    }
    get value() { return this.vState; }
    set value(value) {
        if (value === this.vState)
            return;
        this.toggleState();
    }
}
export default SwitchInput;
//# sourceMappingURL=SwitchInput.js.map