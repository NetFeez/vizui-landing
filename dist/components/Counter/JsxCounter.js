import { jsx as _jsx, jsxs as _jsxs } from "vizui/jsx-runtime";
/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Counter component written with JSX — the twin of ImperativeCounter, same behaviour and same state.
 * @license Apache-2.0
 */
import { Component, Store } from 'vizui';
export class JsxCounter extends Component {
    static { this.css.load('Counter.css', import.meta); }
    root;
    vCount = Store.create(0);
    constructor() {
        super();
        this.root = (_jsxs("div", { class: "JsxCounter", children: [_jsx("span", { class: "Counter-value", children: this.vCount }), _jsx("button", { type: "button", class: "Counter-button", "on:click": () => this.vCount.smartSet(prev => prev + 1), children: "+1" })] }));
        this.root.observer.on('remove', () => this.vCount.destroy());
    }
}
export default JsxCounter;
//# sourceMappingURL=JsxCounter.js.map