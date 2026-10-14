/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Markdown compiler — parses raw content, renders it to vizui Elements, dumps it back to text and synchronizes against a JSON-AST form.
 * @license Apache-2.0
 */
import _AST from './AST.js';
import _Parser from './Parser.js';
import _Renderer from './Renderer.js';
import _Serializer from './Serializer.js';
import _Synchronizer from './Synchronizer.js';
export * from './AST.js';
export var Parser = _Parser;
export var Renderer = _Renderer;
export var Serializer = _Serializer;
export var Synchronizer = _Synchronizer;
export class Compiler {
    static parser = new Parser();
    static renderer = new Renderer();
    /**
     * Parse a markdown string into its AST representation without rendering.
     * @param content - The raw markdown text to parse.
     * @returns The root `DocumentNode` of the AST.
     */
    static parse(content) {
        return this.parser.parse(content);
    }
    /**
     * Render a document AST into a vizui Element tree.
     * @param doc - The AST document to render.
     * @returns The compiled Element tree, or null if the document has no blocks.
     */
    static compile(doc) {
        if (doc.children.length === 0)
            return null;
        return this.renderer.render(doc);
    }
    /**
     * Dump a document AST back to markdown text.
     * Untouched blocks re-emit their source verbatim; edited blocks are re-rendered.
     * @param doc - The AST document to dump.
     * @returns The markdown text.
     */
    static dump(doc) {
        return Serializer.dump(doc);
    }
    /**
     * Synchronize the document blocks against a plain JSON-AST form.
     * Untouched blocks keep their source formatting; changed positions are rebuilt.
     * @param doc - The AST document to update in place.
     * @param json - The target block list in JSON-AST form.
     */
    static apply(doc, json) {
        Synchronizer.apply(doc, json);
    }
}
(function (Compiler) {
    Compiler.AST = _AST;
})(Compiler || (Compiler = {}));
export default Compiler;
//# sourceMappingURL=Compiler.js.map