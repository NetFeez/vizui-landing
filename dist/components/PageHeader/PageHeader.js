import { jsx as _jsx } from "vizui/jsx-runtime";
/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Stateless page heading with an optional description.
 * @license Apache-2.0
 */
import { CSS } from 'vizui';
CSS.load('PageHeader.css', import.meta);
export function PageHeader(props) {
    const root = (_jsx("header", { class: "PageHeader", children: _jsx("h1", { class: "title", children: props.title }) }));
    if (props.description)
        root.append(_jsx("p", { class: "description", children: props.description }));
    return root;
}
export default PageHeader;
//# sourceMappingURL=PageHeader.js.map