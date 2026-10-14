/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Minimal TypeScript/TSX tokenizer used to highlight code blocks without dependencies.
 * @license Apache-2.0
 */
/**
 * Tokenizes TypeScript/TSX source into highlightable spans.
 * @param code - The source code to tokenize.
 * @returns The ordered tokens; untokenized text falls back to `plain`.
 */
export declare function highlight(code: string): Syntax.Token[];
export declare namespace Syntax {
    /** The kinds of tokens the tokenizer can produce. **/
    type TokenType = 'plain' | 'keyword' | 'string' | 'number' | 'comment' | 'tag' | 'type';
    /** A single highlighted chunk of source code. **/
    interface Token {
        type: TokenType;
        text: string;
    }
    /** The capture order used to resolve a token kind. **/
    const TOKEN_ORDER: readonly TokenType[];
}
export default highlight;
