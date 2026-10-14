import { jsx as _jsx, jsxs as _jsxs } from "vizui/jsx-runtime";
/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Stateless editor panel — window chrome (traffic lights), file name, mode tag and a highlighted code listing.
 * @license Apache-2.0
 */
import { CSS } from 'vizui';
import CodeBlock from '../Markdown/CodeBlock/CodeBlock.js';
CSS.load('IdePanel.css', import.meta);
export function IdePanel(props) {
    return (_jsxs("div", { class: `IdePanel --${props.tone ?? 'accent'}`, children: [_jsxs("div", { class: "bar", children: [_jsxs("span", { class: "dots", children: [_jsx("span", { class: "dot --rose" }), _jsx("span", { class: "dot --amber" }), _jsx("span", { class: "dot --emerald" })] }), _jsx("span", { class: "file", children: props.filename }), _jsx("span", { class: "mode", children: props.mode })] }), _jsx("div", { class: "body", children: CodeBlock({ code: props.code }) })] }));
}
export default IdePanel;
//# sourceMappingURL=IdePanel.js.map