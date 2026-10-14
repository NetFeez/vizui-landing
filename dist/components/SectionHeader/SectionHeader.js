import { jsx as _jsx } from "vizui/jsx-runtime";
/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Stateless section heading with an optional eyebrow tag and description.
 * @license Apache-2.0
 */
import { CSS } from 'vizui';
CSS.load('SectionHeader.css', import.meta);
export function SectionHeader(props) {
    const root = _jsx("div", { class: "SectionHeader" });
    if (props.eyebrow)
        root.append(_jsx("span", { class: `eyebrow --${props.tone ?? 'accent'}`, children: props.eyebrow }));
    root.append(_jsx("h2", { class: "title", children: props.title }));
    if (props.description)
        root.append(_jsx("p", { class: "description", children: props.description }));
    return root;
}
export default SectionHeader;
//# sourceMappingURL=SectionHeader.js.map