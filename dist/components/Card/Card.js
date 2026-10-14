import { jsx as _jsx, jsxs as _jsxs } from "vizui/jsx-runtime";
/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Stateless content card with a title and a body region.
 * @license Apache-2.0
 */
import { CSS } from 'vizui';
CSS.load('Card.css', import.meta);
export function Card(props) {
    return (_jsxs("div", { class: "Card", children: [_jsx("h3", { class: "title", children: props.title }), _jsx("div", { class: "body", children: props.children })] }));
}
export default Card;
//# sourceMappingURL=Card.js.map