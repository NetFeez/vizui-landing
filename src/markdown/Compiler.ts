/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Markdown compiler — parses raw content, renders it to vizui Elements, dumps it back to text and synchronizes against a JSON-AST form.
 * @license Apache-2.0
 */

import { Element } from 'vizui';

import _AST from './AST.js';
import _Parser from './Parser.js';
import _Renderer from './Renderer.js';
import _Serializer from './Serializer.js';
import _Synchronizer from './Synchronizer.js';

import { DocumentNode } from './AST.js';

export * from './AST.js';

export import Parser = _Parser;
export import Renderer = _Renderer;
export import Serializer = _Serializer;
export import Synchronizer = _Synchronizer;


export class Compiler {
    private static readonly parser = new Parser();
    private static readonly renderer = new Renderer();

    /**
     * Parse a markdown string into its AST representation without rendering.
     * @param content - The raw markdown text to parse.
     * @returns The root `DocumentNode` of the AST.
     */
    public static parse(content: string): DocumentNode {
        return this.parser.parse(content);
    }

    /**
     * Render a document AST into a vizui Element tree.
     * @param doc - The AST document to render.
     * @returns The compiled Element tree, or null if the document has no blocks.
     */
    public static compile(doc: DocumentNode): Element.ElementType | null {
        if (doc.children.length === 0) return null;
        return this.renderer.render(doc);
    }

    /**
     * Dump a document AST back to markdown text.
     * Untouched blocks re-emit their source verbatim; edited blocks are re-rendered.
     * @param doc - The AST document to dump.
     * @returns The markdown text.
     */
    public static dump(doc: DocumentNode): string {
        return Serializer.dump(doc);
    }

    /**
     * Synchronize the document blocks against a plain JSON-AST form.
     * Untouched blocks keep their source formatting; changed positions are rebuilt.
     * @param doc - The AST document to update in place.
     * @param json - The target block list in JSON-AST form.
     */
    public static apply(doc: DocumentNode, json: Compiler.JsonValue): void {
        Synchronizer.apply(doc, json);
    }
}

export namespace Compiler {
    export import AST = _AST;

    export type JsonValue = AST.JsonNode[];
}

export default Compiler;
