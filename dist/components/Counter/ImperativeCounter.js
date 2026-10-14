/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Counter component written without JSX — the twin of JsxCounter, built with `Element.new` and stores: the value is appended as a Store child and the accessible attribute is bound to a derived Store.
 * @license Apache-2.0
 */
import { Component, Element, Store } from 'vizui';
export class ImperativeCounter extends Component {
    static { this.css.load('Counter.css', import.meta); }
    root = Element.new('div').setClass('ImperativeCounter');
    vCount = Store.create(0);
    vAttribute = this.vCount.select(n => n.toString());
    eValue = Element.new('span')
        .setClass('Counter-value')
        .append(this.vCount)
        .setAttribute('aria-valuenow', this.vAttribute);
    constructor() {
        super();
        const eButton = Element.new('button', {
            text: '+1',
            attributes: { type: 'button', class: 'Counter-button' },
        });
        eButton.on('click', () => this.vCount.smartSet(prev => prev + 1));
        this.root.append(this.eValue, eButton);
        this.root.observer.on('remove', () => this.vCount.destroy());
    }
}
export default ImperativeCounter;
//# sourceMappingURL=ImperativeCounter.js.map