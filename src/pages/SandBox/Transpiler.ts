/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Dependency-free JSX transform for the sandbox: rewrites JSX regions into
 *              `jsx-runtime` factory calls, mirroring the exact emission of tsc react-jsx
 *              (`__jsx(tag, props, ...children)`), then prepends a single runtime import.
 *              Contract: JavaScript-runnable sources (no TS type annotations), like the rest of the runner.
 * @license Apache-2.0
 */

const KEYWORDS = new Set([
    'return', 'throw', 'case', 'default', 'typeof', 'void', 'delete', 'in', 'of', 'new', 'do', 'else', 'yield', 'await',
]);

const STARTER_CHARS = new Set(['(', '=', ',', '[', '{', '?', ':', ';', '>', '&', '|', '/']);

const NAME_PATTERN = /^[A-Za-z_$][\w$]*(?:\.[\w$]+)*/;
const ATTR_PATTERN = /^[\w:@.$-]+/;

const PRELUDE = 'import { jsx as __jsx, jsxs as __jsxs, Fragment as __Fragment } from "vizui/jsx-runtime";\n';

export class Transpiler {
    /**
     * Transforms the JSX regions of a source into jsx-runtime calls.
     * @param code - The module source written in the editor.
     * @returns The transformed source, with the runtime import prepended when JSX was found.
     * @throws Transpiler.Error with line/column context when the JSX is malformed.
     */
    public static transform(code: string): string {
        try {
            const run = Transpiler.scan(code);
            return run.count > 0 ? PRELUDE + run.out : run.out;
        }
        catch (error) {
            if (error instanceof TranspilerSyntaxError) throw new Transpiler.Error(error.message, code, error.index);
            throw error;
        }
    }

    /**
     * Rewrites the top source: walks the module code, finds viable JSX starts and
     * delegates their parsing to {@link Transpiler.parseElement}.
     * @param src - The source to rewrite.
     * @returns The rewritten source and the amount of elements transformed.
     */
    private static scan(src: string): Transpiler.Scan {
        let out = '';
        let count = 0;
        let i = 0;
        let prevChar = '(';
        let prevWord = '';

        while (i < src.length) {
            const ch = src[i];

            if (ch === '/' && src[i + 1] === '/') {
                const end = src.indexOf('\n', i);
                const stop = end < 0 ? src.length : end;
                out += src.slice(i, stop);
                i = stop;
                continue;
            }

            if (ch === '/' && src[i + 1] === '*') {
                const end = src.indexOf('*/', i + 2);
                const stop = end < 0 ? src.length : end + 2;
                out += src.slice(i, stop);
                i = stop;
                continue;
            }

            if (ch === '"' || ch === '\'') {
                const end = Transpiler.skipString(src, i);
                out += src.slice(i, end);
                i = end;
                continue;
            }

            if (ch === '`') {
                const end = Transpiler.skipTemplate(src, i);
                out += src.slice(i, end);
                i = end;
                continue;
            }

            if (ch === '<' && src[i + 1] !== '=' && src[i + 1] !== '<' && src[i + 1] !== '/') {
                const candidate = STARTER_CHARS.has(prevChar) || KEYWORDS.has(prevWord);
                if (candidate && (/[A-Za-z_]/.test(src[i + 1]) || src[i + 1] === '>')) {
                    const parsed = Transpiler.tryElement(src, i);
                    if (parsed) {
                        out += parsed.code;
                        i = parsed.end;
                        count++;
                        prevChar = ')';
                        prevWord = '';
                        continue;
                    }
                }
            }

            if (/[A-Za-z_$]/.test(ch)) {
                const word = /^[A-Za-z_$][\w$]*/.exec(src.slice(i))![0];
                prevWord = word;
                prevChar = ch;
                out += word;
                i += word.length;
                continue;
            }

            if (!/\s/.test(ch)) {
                prevChar = ch;
                prevWord = '';
            }
            out += ch;
            i++;
        }

        return { out, count };
    }

    /**
     * Attempts to parse an element or fragment starting at a `<` candidate.
     * @param src - The enclosing source.
     * @param i - The index of the `<`.
     * @returns The transformed code plus the index after the element, or null when the `<` is not JSX.
     * @throws TranspilerSyntaxError when the region is JSX but malformed.
     */
    private static tryElement(src: string, i: number): Transpiler.Parse | null {
        let j = i + 1;
        let name = '';

        if (src[j] === '/') return null;
        if (src[j] === '>') { j++; name = ''; }
        else {
            const match = NAME_PATTERN.exec(src.slice(j));
            if (!match) return null;
            name = match[0];
            j += name.length;
        }

        return Transpiler.parseElement(src, j, name);
    }

    /**
     * Parses one element: attributes, self-close or children with the matching close tag.
     * @param src - The enclosing source.
     * @param i - The first index after the tag name.
     * @param name - The tag name, `''` for fragments.
     * @returns The emitted call and the index just past the element.
     * @throws TranspilerSyntaxError when the element does not close cleanly.
     */
    private static parseElement(src: string, i: number, name: string): Transpiler.Parse {
        const attrs: string[] = [];
        const children: string[] = [];
        const label = name === '' ? 'fragmento' : `<${name}>`;
        let selfClosed = false;

        while (true) {
            i = Transpiler.skipWhitespace(src, i);
            if (i >= src.length) throw new TranspilerSyntaxError(`el ${label} no se cierra`, i);
            if (src[i] === '>') { i++; break; }
            if (src[i] === '/' && src[i + 1] === '>') { i += 2; selfClosed = true; break; }
            if (src[i] === '/') throw new TranspilerSyntaxError(`"/" inesperado dentro de ${label}`, i);

            if (src[i] === '{') {
                const spread = Transpiler.readBraces(src, i);
                if (spread.body.trimStart().startsWith('...')) {
                    attrs.push(spread.body.trim());
                    i = spread.end;
                    continue;
                }
                throw new TranspilerSyntaxError(`atributo de ${label} sin nombre`, i);
            }

            const attr = ATTR_PATTERN.exec(src.slice(i));
            if (!attr) throw new TranspilerSyntaxError(`sintaxis de atributo no válida en ${label}`, i);
            const key = attr[0];
            i += key.length;
            i = Transpiler.skipWhitespace(src, i);

            if (src[i] === '=') {
                i++;
                i = Transpiler.skipWhitespace(src, i);
                if (i >= src.length) throw new TranspilerSyntaxError(`el atributo ${key} no tiene valor`, i);
                const [value, end] = Transpiler.readAttrValue(src, i);
                i = end;
                attrs.push(`${/^\w+$/.test(key) ? key : JSON.stringify(key)}: ${value}`);
            }
            else {
                attrs.push(`${/^\w+$/.test(key) ? key : JSON.stringify(key)}: true`);
            }
        }

        if (!selfClosed) {
            while (true) {
                i = Transpiler.skipWhitespace(src, i);
                if (i >= src.length) throw new TranspilerSyntaxError(`el ${label} no se cierra`, i);

                if (src[i] === '<') {
                    if (src[i + 1] === '/') {
                        if (name === '') {
                            if (src[i + 2] === '>') { i += 3; break; }
                            throw new TranspilerSyntaxError('el fragmento se cierra con </>', i);
                        }
                        const match = NAME_PATTERN.exec(src.slice(i + 2));
                        if (match?.[0] === name) {
                            i += 2 + match[0].length;
                            i = Transpiler.skipWhitespace(src, i);
                            if (src[i] !== '>') throw new TranspilerSyntaxError(`se esperaba ">" después de </${name}>`, i);
                            i++;
                            break;
                        }
                        throw new TranspilerSyntaxError(`cierre desalineado: se esperaba </${name}> y se encontró </${match?.[0] ?? ''}>`, i);
                    }
                    if (!/[A-Za-z_]/.test(src[i + 1]) && src[i + 1] !== '>') {
                        throw new TranspilerSyntaxError(`"<" inesperado en el cuerpo de ${label}`, i);
                    }
                    const nested = Transpiler.tryElement(src, i);
                    if (!nested) throw new TranspilerSyntaxError(`"<" inesperado en el cuerpo de ${label}`, i);
                    children.push(nested.code);
                    i = nested.end;
                    continue;
                }

                if (src[i] === '{') {
                    const braces = Transpiler.readBraces(src, i);
                    const body = braces.body.trim();
                    if (!body.startsWith('/*')) {
                        const inner = Transpiler.scan(body).out;
                        children.push(`(${inner})`);
                    }
                    i = braces.end;
                    continue;
                }

                const stop = Transpiler.nextMarker(src, i);
                const text = Transpiler.collapseText(src.slice(i, stop));
                if (text !== '') children.push(JSON.stringify(text));
                i = stop;
            }
        }

        const tag = name === ''
            ? '__Fragment'
            : /^[A-Z]/.test(name) || name.includes('.')
                ? name
                : JSON.stringify(name);

        const props = attrs.length === 0 ? 'null' : `{ ${attrs.join(', ')} }`;

        if (children.length === 0) return { code: `__jsx(${tag}, ${props})`, end: i };
        if (children.length === 1) return { code: `__jsx(${tag}, ${props}, ${children[0]})`, end: i };
        return { code: `__jsxs(${tag}, ${props}, ${children.join(', ')})`, end: i };
    }

    /**
     * Reads an attribute value: a quoted string or a balanced brace expression.
     * @param src - The enclosing source.
     * @param i - The first index of the value.
     * @returns The raw value source and the index just past it.
     * @throws TranspilerSyntaxError when the value is missing or unsupported.
     */
    private static readAttrValue(src: string, i: number): [value: string, end: number] {
        if (src[i] === '"' || src[i] === '\'') {
            const end = Transpiler.skipString(src, i);
            return [src.slice(i, end), end];
        }
        if (src[i] === '{') {
            const braces = Transpiler.readBraces(src, i);
            return [`(${braces.body.trim()})`, braces.end];
        }
        throw new TranspilerSyntaxError('valor de atributo no soportado: se esperaba una cadena o {expresión}', i);
    }

    /**
     * Reads a balanced `{…}` expression respecting nested braces, strings, templates and comments.
     * @param src - The enclosing source.
     * @param i - The index of the opening `{`.
     * @returns The inner text and the index just past the closing brace.
     * @throws TranspilerSyntaxError when the braces never close.
     */
    private static readBraces(src: string, i: number): { body: string; end: number } {
        const start = i;
        let depth = 1;
        i++;
        while (i < src.length) {
            const ch = src[i];
            if (ch === '"' || ch === '\'') { i = Transpiler.skipString(src, i); continue; }
            if (ch === '`') { i = Transpiler.skipTemplate(src, i); continue; }
            if (ch === '/' && src[i + 1] === '/') {
                const end = src.indexOf('\n', i);
                i = end < 0 ? src.length : end;
                continue;
            }
            if (ch === '/' && src[i + 1] === '*') {
                const end = src.indexOf('*/', i);
                i = end < 0 ? src.length : end + 2;
                continue;
            }
            if (ch === '{') { depth++; i++; continue; }
            if (ch === '}') {
                depth--;
                if (depth === 0) return { body: src.slice(start + 1, i), end: i + 1 };
                i++;
                continue;
            }
            i++;
        }
        throw new TranspilerSyntaxError('un bloque { } sin cerrar', start);
    }

    /**
     * Steps past a quoted string with escape handling.
     * @param src - The enclosing source.
     * @param i - The index of the opening quote.
     * @returns The index just past the closing quote.
     * @throws TranspilerSyntaxError when the string never closes.
     */
    private static skipString(src: string, i: number): number {
        const quote = src[i];
        let j = i + 1;
        while (j < src.length) {
            if (src[j] === '\\') { j += 2; continue; }
            if (src[j] === quote) return j + 1;
            j++;
        }
        throw new TranspilerSyntaxError('una cadena sin cerrar', i);
    }

    /**
     * Steps past a template literal, including nested `${…}` code regions.
     * @param src - The enclosing source.
     * @param i - The index of the opening backtick.
     * @returns The index just past the closing backtick.
     * @throws TranspilerSyntaxError when the template never closes.
     */
    private static skipTemplate(src: string, i: number): number {
        let j = i + 1;
        while (j < src.length) {
            const ch = src[j];
            if (ch === '\\') { j += 2; continue; }
            if (ch === '`') return j + 1;
            if (ch === '$' && src[j + 1] === '{') {
                let depth = 1;
                j += 2;
                while (j < src.length && depth > 0) {
                    const inner = src[j];
                    if (inner === '{') { depth++; j++; continue; }
                    if (inner === '}') { depth--; j++; continue; }
                    if (inner === '"' || inner === '\'') { j = Transpiler.skipString(src, j); continue; }
                    if (inner === '`') { j = Transpiler.skipTemplate(src, j); continue; }
                    j++;
                }
                continue;
            }
            j++;
        }
        throw new TranspilerSyntaxError('un template literal sin cerrar', i);
    }

    /** Index of the first non-whitespace char at or after `i`. **/
    private static skipWhitespace(src: string, i: number): number {
        while (i < src.length && /\s/.test(src[i])) i++;
        return i;
    }

    /**
     * Next index where a JSX marker (`<` or `{`) starts.
     * @param src - The enclosing source.
     * @param i - The start index of a text run.
     */
    private static nextMarker(src: string, i: number): number {
        let j = i;
        while (j < src.length && src[j] !== '<' && src[j] !== '{') j++;
        return j;
    }

    /**
     * Collapses a JSX text child per the JSX whitespace rules.
     * @param raw - The raw text run.
     * @returns The emitted text, `''` when the run is pure whitespace between elements.
     */
    private static collapseText(raw: string): string {
        if (raw.includes('\n')) {
            const text = raw.replace(/\s+/g, ' ').trim();
            return text;
        }
        if (raw.trim() === '') return '';
        return raw.replace(/ {2,}/g, ' ').trim();
    }

    /** Positions an index as a readable `línea N, col M` label. **/
    static position(src: string, index: number): string {
        const clamp = Math.min(index, src.length);
        const line = clamp >= 0 ? src.slice(0, clamp).split('\n').length : 1;
        const column = clamp >= 0 ? clamp - (src.lastIndexOf('\n', clamp - 1) + 1) + 1 : 1;
        return `línea ${line}, col ${column}`;
    }
}

export namespace Transpiler {
    /** The rewritten source before the runtime import is injected. **/
    export interface Scan {
        out: string;
        count: number;
    }

    /** A parsed element: its emitted code and the index just past it. **/
    export interface Parse {
        code: string;
        end: number;
    }

    /** The malformed-JSX failure carrying the index where it was detected. **/
    export class Error extends globalThis.Error {
        public constructor(message: string, source: string, index: number) {
            super(`[JSX] ${message} (${Transpiler.position(source, index)})`);
            this.name = 'Transpiler.Error';
        }
    }
}

class TranspilerSyntaxError extends Error {
    public constructor(message: string, public readonly index: number = -1) {
        super(message);
    }
}

export default Transpiler;
