/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Minimal TypeScript/TSX tokenizer used to highlight code blocks without dependencies.
 * @license Apache-2.0
 */

const PATTERN = /(?<comment>\/\*[\s\S]*?\*\/|\/\/[^\n]*)|(?<string>"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(?<keyword>\b(?:import|from|export|const|let|var|class|extends|implements|new|return|if|else|for|while|do|switch|case|break|continue|function|async|await|interface|type|enum|typeof|instanceof|in|of|public|private|protected|static|readonly|default|void|null|undefined|true|false|this|super|throw|try|catch|finally|get|set|yield|declare|as|satisfies|namespace|abstract|is|keyof)\b)|(?<number>\b\d[\d_]*(?:\.\d+)?(?:[eE][+-]?\d+)?\b)|(?<tag><>|<\/>|<(?:\/)?[A-Za-z][\w.-]*)|(?<type>\b[A-Z][A-Za-z0-9_]*(?:\.[A-Za-z0-9_]+)*\b)/g;

/**
 * Tokenizes TypeScript/TSX source into highlightable spans.
 * @param code - The source code to tokenize.
 * @returns The ordered tokens; untokenized text falls back to `plain`.
 */
export function highlight(code: string): Syntax.Token[] {
    const tokens: Syntax.Token[] = [];
    let last = 0;
    for (const match of code.matchAll(PATTERN)) {
        if (!match.groups) continue;
        const start = match.index;
        const text = match[0];
        const type = Syntax.TOKEN_ORDER.find(key => match.groups?.[key] !== undefined) ?? 'plain';
        if (start > last) tokens.push({ type: 'plain', text: code.slice(last, start) });
        tokens.push({ type, text });
        last = start + text.length;
    }
    if (last < code.length) tokens.push({ type: 'plain', text: code.slice(last) });
    return tokens;
}

export namespace Syntax {
    /** The kinds of tokens the tokenizer can produce. **/
    export type TokenType = 'plain' | 'keyword' | 'string' | 'number' | 'comment' | 'tag' | 'type';

    /** A single highlighted chunk of source code. **/
    export interface Token {
        type: TokenType;
        text: string;
    }

    /** The capture order used to resolve a token kind. **/
    export const TOKEN_ORDER: readonly TokenType[] = ['comment', 'string', 'keyword', 'number', 'tag', 'type'];
}

export default highlight;