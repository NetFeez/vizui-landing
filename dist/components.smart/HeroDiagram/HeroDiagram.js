import { jsx as _jsx, jsxs as _jsxs } from "vizui/jsx-runtime";
/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Live diagram of the direct-to-DOM architecture: a real reactive node and an interactive button node.
 *              It mirrors the shared counter of the page when one is provided, so every reactive node shows the same Store.
 * @license Apache-2.0
 */
import { Component, Store } from 'vizui';
export class HeroDiagram extends Component {
    static { this.css.load('HeroDiagram.css', import.meta); }
    root;
    vCount;
    vOwnsStore;
    constructor(props = {}) {
        super();
        this.vOwnsStore = !props.count;
        this.vCount = props.count ?? Store.create(0);
        const eValue = (_jsxs("div", { class: "node --value", children: [_jsx("span", { class: "tag", children: "<span.val>" }), _jsx("span", { class: "value", children: this.vCount })] }));
        const eButton = (_jsxs("button", { type: "button", class: "node --button", title: "Incrementar el Store", children: [_jsx("span", { class: "tag", children: "<button.inc>" }), _jsx("span", { class: "plus", children: "+1" })] }));
        eButton.on('click', () => this.vCount.smartSet(prev => prev + 1));
        this.root = (_jsxs("div", { class: "HeroDiagram", children: [_jsxs("div", { class: "head", children: [_jsxs("span", { class: "legend", children: [_jsx("span", { class: "pulse" }), "Arquitectura directa al DOM real"] }), _jsx("span", { class: "badge", children: "Zero Virtual Layer" })] }), _jsxs("div", { class: "tree", children: [_jsxs("div", { class: "root", children: [_jsx("span", { class: "tag", children: "<div#app>" }), _jsx("span", { class: "chip", children: "Native DOM" })] }), _jsx("span", { class: "connector" }), _jsxs("div", { class: "component", children: [_jsx("span", { class: "tag", children: "<CounterComponent>" }), _jsx("span", { class: "chip", children: "Reactive Store" })] }), _jsxs("div", { class: "fork-group", children: [_jsx("span", { class: "fork" }), _jsxs("div", { class: "children", children: [_jsxs("div", { class: "branch", children: [_jsx("span", { class: "stem" }), eValue] }), _jsxs("div", { class: "branch", children: [_jsx("span", { class: "stem" }), eButton] })] })] })] }), _jsx("p", { class: "caption", children: "Las mutaciones impactan directamente los nodos sin diffing ni reconciliaci\u00F3n sint\u00E9tica." })] }));
        this.root.observer.on('remove', () => {
            if (this.vOwnsStore)
                this.vCount.destroy();
        });
    }
}
export default HeroDiagram;
//# sourceMappingURL=HeroDiagram.js.map