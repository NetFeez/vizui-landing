/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Stateless preformatted code listing with dependency-free TypeScript/TSX highlighting.
 * @license Apache-2.0
 */

import { CSS, type Element } from 'vizui';
import type { JSX } from 'vizui/jsx-runtime';

import { highlight } from './Syntax.js';

CSS.load('CodeBlock.css', import.meta);

export function CodeBlock(props: JSX.Attributes<CodeBlock.Props>): Element<Element.Type['pre']> {
    const tokens = highlight(props.code);
    return (
        <pre class={props.class ?? 'CodeBlock'}>
            <code>
                {tokens.map(token => (
                    token.type === 'plain'
                        ? token.text
                        : <span class={`CodeBlock-token CodeBlock-token--${token.type}`}>{token.text}</span>
                ))}
            </code>
        </pre>
    );
}

export default CodeBlock;

export namespace CodeBlock {
    /** The props of a code block. **/
    export interface Props {
        code: string;
        class?: string;
    }
}