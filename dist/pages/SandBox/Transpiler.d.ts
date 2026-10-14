/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Dependency-free JSX transform for the sandbox: rewrites JSX regions into
 *              `jsx-runtime` factory calls, mirroring the exact emission of tsc react-jsx
 *              (`__jsx(tag, props, ...children)`), then prepends a single runtime import.
 *              Contract: JavaScript-runnable sources (no TS type annotations), like the rest of the runner.
 * @license Apache-2.0
 */
export declare class Transpiler {
    /**
     * Transforms the JSX regions of a source into jsx-runtime calls.
     * @param code - The module source written in the editor.
     * @returns The transformed source, with the runtime import prepended when JSX was found.
     * @throws Transpiler.Error with line/column context when the JSX is malformed.
     */
    static transform(code: string): string;
    /**
     * Rewrites the top source: walks the module code, finds viable JSX starts and
     * delegates their parsing to {@link Transpiler.parseElement}.
     * @param src - The source to rewrite.
     * @returns The rewritten source and the amount of elements transformed.
     */
    private static scan;
    /**
     * Attempts to parse an element or fragment starting at a `<` candidate.
     * @param src - The enclosing source.
     * @param i - The index of the `<`.
     * @returns The transformed code plus the index after the element, or null when the `<` is not JSX.
     * @throws TranspilerSyntaxError when the region is JSX but malformed.
     */
    private static tryElement;
    /**
     * Parses one element: attributes, self-close or children with the matching close tag.
     * @param src - The enclosing source.
     * @param i - The first index after the tag name.
     * @param name - The tag name, `''` for fragments.
     * @returns The emitted call and the index just past the element.
     * @throws TranspilerSyntaxError when the element does not close cleanly.
     */
    private static parseElement;
    /**
     * Reads an attribute value: a quoted string or a balanced brace expression.
     * @param src - The enclosing source.
     * @param i - The first index of the value.
     * @returns The raw value source and the index just past it.
     * @throws TranspilerSyntaxError when the value is missing or unsupported.
     */
    private static readAttrValue;
    /**
     * Reads a balanced `{…}` expression respecting nested braces, strings, templates and comments.
     * @param src - The enclosing source.
     * @param i - The index of the opening `{`.
     * @returns The inner text and the index just past the closing brace.
     * @throws TranspilerSyntaxError when the braces never close.
     */
    private static readBraces;
    /**
     * Steps past a quoted string with escape handling.
     * @param src - The enclosing source.
     * @param i - The index of the opening quote.
     * @returns The index just past the closing quote.
     * @throws TranspilerSyntaxError when the string never closes.
     */
    private static skipString;
    /**
     * Steps past a template literal, including nested `${…}` code regions.
     * @param src - The enclosing source.
     * @param i - The index of the opening backtick.
     * @returns The index just past the closing backtick.
     * @throws TranspilerSyntaxError when the template never closes.
     */
    private static skipTemplate;
    /** Index of the first non-whitespace char at or after `i`. **/
    private static skipWhitespace;
    /**
     * Next index where a JSX marker (`<` or `{`) starts.
     * @param src - The enclosing source.
     * @param i - The start index of a text run.
     */
    private static nextMarker;
    /**
     * Collapses a JSX text child per the JSX whitespace rules.
     * @param raw - The raw text run.
     * @returns The emitted text, `''` when the run is pure whitespace between elements.
     */
    private static collapseText;
    /** Positions an index as a readable `línea N, col M` label. **/
    static position(src: string, index: number): string;
}
export declare namespace Transpiler {
    /** The rewritten source before the runtime import is injected. **/
    interface Scan {
        out: string;
        count: number;
    }
    /** A parsed element: its emitted code and the index just past it. **/
    interface Parse {
        code: string;
        end: number;
    }
    /** The malformed-JSX failure carrying the index where it was detected. **/
    class Error extends globalThis.Error {
        constructor(message: string, source: string, index: number);
    }
}
export default Transpiler;
