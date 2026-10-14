/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Editors highlight — renders code text as HTML fragments for the editable layer.
 *              TS/JSX reuses the shared Syntax tokenizer; CSS gets its own minimal walker.
 *              Chunks are escaped: the resulting markup is safe against the user's own input.
 * @license Apache-2.0
 */
/** The classified chunk contract shared by both tokenizers. **/
export interface Chunk {
    /** The tone of the chunk: a Syntax kind, or one of the CSS-specific tones. **/
    type: string;
    /** The raw text of the chunk. **/
    text: string;
}
export declare function moduleHtml(code: string): string;
export declare function styleHtml(code: string): string;
declare const _default: {
    moduleHtml: typeof moduleHtml;
    styleHtml: typeof styleHtml;
};
export default _default;
