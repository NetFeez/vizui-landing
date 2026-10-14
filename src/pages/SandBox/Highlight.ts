/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Editors highlight — renders code text as HTML fragments for the editable layer.
 *              TS/JSX reuses the shared Syntax tokenizer; CSS gets its own minimal walker.
 *              Chunks are escaped: the resulting markup is safe against the user's own input.
 * @license Apache-2.0
 */

import { highlight, type Syntax } from '../../components/Markdown/CodeBlock/Syntax.js';

/** The classified chunk contract shared by both tokenizers. **/
export interface Chunk {
    /** The tone of the chunk: a Syntax kind, or one of the CSS-specific tones. **/
    type: string;
    /** The raw text of the chunk. **/
    text: string;
}

export function moduleHtml(code: string): string {
    return html(highlight(code));
}

export function styleHtml(code: string): string {
    return html(tokenizeCss(code));
}

/**
 * Escapes a chunk into the markup of the editable layer: plain text stays raw,
 * the rest becomes a classed span.
 * @param chunks - The classified chunks in source order.
 * @returns The HTML string.
 */
function html(chunks: Chunk[]): string {
    return chunks.map(chunk => (
        chunk.type === 'plain'
            ? escape(chunk.text)
            : `<span class="token token--${chunk.type}">${escape(chunk.text)}</span>`
    )).join('');
}

/**
 * Escapes a text run for innerHTML.
 * @param text - The raw source text.
 * @returns The escaped text.
 */
function escape(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Tokenizes CSS into renderable chunks: comments, strings, selectors outside blocks,
 * properties inside blocks, values (numbers/colors/keywords) and punctuation.
 * @param code - The stylesheet text.
 * @returns The classified chunks in source order.
 */
function tokenizeCss(code: string): Chunk[] {
    const tokens: Chunk[] = [];
    const push = (text: string, type: string): void => {
        if (!text) return;
        const last = tokens[tokens.length - 1];
        if (last && last.type === type) last.text += text;
        else tokens.push({ type, text });
    };

    let depth = 0;
    let i = 0;

    while (i < code.length) {
        const rest = code.slice(i);
        const comment = /^\/\*[\s\S]*?\*\//.exec(rest);
        if (comment) { push(comment[0], 'comment'); i += comment[0].length; continue; }

        const str = /^"[^"\n]*"|'[^'\n]*'/.exec(rest);
        if (str) { push(str[0], 'string'); i += str[0].length; continue; }

        const word = /^--[\w-]+|^@[\w-]+|^[-#.\w]+/.exec(rest);
        if (word) {
            const text = word[0];
            // The next meaningful char decides whether the word reads as a selector,
            // a property or a value.
            let j = i + text.length;
            while (j < code.length && /\s/.test(code[j])) j++;
            const next = code[j];

            if (depth > 0) {
                if (next === ':') push(text, 'property');
                else if (/^[-#.\d]/.test(text)) push(text, 'number');
                else push(text, 'value');
            }
            else {
                push(text, next === '{' ? 'selector' : 'plain');
            }
            i += text.length;
            continue;
        }

        const ch = code[i];
        if (ch === '{') depth++;
        else if (ch === '}') depth = Math.max(0, depth - 1);
        push(ch, 'plain');
        i++;
    }

    return tokens;
}

export default { moduleHtml, styleHtml };
