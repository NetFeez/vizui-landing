import { jsx as _jsx } from "vizui/jsx-runtime";
/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Stateless inline badge with a visual tone.
 * @license Apache-2.0
 */
import { CSS } from 'vizui';
CSS.load('Badge.css', import.meta);
export function Badge(props) {
    const tone = props.tone ?? 'neutral';
    const root = _jsx("span", { class: `Badge --${tone}` });
    if (props.dot)
        root.append(_jsx("span", { class: "dot" }));
    root.append(_jsx("span", { class: "label", children: props.label }));
    return root;
}
export default Badge;
//# sourceMappingURL=Badge.js.map