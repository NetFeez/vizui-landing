/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Adapts the Markdown AST to and from its plain JSON-AST representation.
 * @license Apache-2.0
 */
import { AST } from './AST.js';
export declare class Adapter {
    /** Renders a node (and its children) as plain JSON-AST data. */
    static toJson(node: AST.Node): AST.JsonNode;
    /** Builds a fresh node from its JSON-AST form (delegates to the AST factory). */
    static fromValue(json: AST.JsonNode): AST.Node;
    private static typeOf;
}
export declare namespace Adapter { }
export default Adapter;
