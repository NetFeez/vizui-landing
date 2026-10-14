/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Stateless preformatted code listing with dependency-free TypeScript/TSX highlighting.
 * @license Apache-2.0
 */
import { type Element } from 'vizui';
import type { JSX } from 'vizui/jsx-runtime';
export declare function CodeBlock(props: JSX.Attributes<CodeBlock.Props>): Element<Element.Type['pre']>;
export default CodeBlock;
export declare namespace CodeBlock {
    /** The props of a code block. **/
    interface Props {
        code: string;
        class?: string;
    }
}
