/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Serializer that re-emits untouched AST blocks verbatim and renders modified blocks back to markdown text.
 * @license Apache-2.0
 */
import { DocumentNode } from './AST.js';
export declare class Serializer {
    /**
     * Dumps the given AST document to markdown text.
     * Untouched blocks re-emit their captured source lines byte-for-byte;
     * dirty blocks are rendered from the tree.
     * @param doc - The AST document to dump.
     * @returns The markdown text.
     */
    static dump(doc: DocumentNode): string;
    private static emitBlock;
    private static emitList;
    private static emitItem;
    private static emitCodeBlock;
    private static emitTable;
    private static emitCell;
    private static emitInline;
    private static renderInline;
    private static renderCode;
}
export declare namespace Serializer { }
export default Serializer;
