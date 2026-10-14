import { jsx as _jsx } from "vizui/jsx-runtime";
/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Stateless preformatted code listing with dependency-free TypeScript/TSX highlighting.
 * @license Apache-2.0
 */
import { CSS } from 'vizui';
import { highlight } from './Syntax.js';
CSS.load('CodeBlock.css', import.meta);
export function CodeBlock(props) {
    const tokens = highlight(props.code);
    return (_jsx("pre", { class: props.class ?? 'CodeBlock', children: _jsx("code", { children: tokens.map(token => (token.type === 'plain'
                ? token.text
                : _jsx("span", { class: `CodeBlock-token CodeBlock-token--${token.type}`, children: token.text }))) }) }));
}
export default CodeBlock;
//# sourceMappingURL=CodeBlock.js.map