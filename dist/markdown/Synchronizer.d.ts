/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Synchronizes a markdown document tree against its plain JSON-AST form, preserving untouched blocks verbatim.
 * @license Apache-2.0
 */
import { AST } from './AST.js';
import { DocumentNode } from './AST.js';
export declare class Synchronizer {
    /**
     * Synchronizes the document blocks against a plain JSON-AST form.
     * Blocks whose JSON representation is unchanged keep their raw source lines;
     * changed, missing and extra positions are rebuilt from the plain value.
     * @param doc - The document tree to update in place.
     * @param json - The target block list in JSON-AST form.
     */
    static apply(doc: DocumentNode, json: AST.JsonNode[]): void;
    private static matches;
    private static deepEqual;
}
export declare namespace Synchronizer { }
export default Synchronizer;
