/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Synchronizes a markdown document tree against its plain JSON-AST form, preserving untouched blocks verbatim.
 * @license Apache-2.0
 */

import { AST } from './AST.js';
import { DocumentNode } from './AST.js';
import Adapter from './Adapter.js';

export class Synchronizer {
    /**
     * Synchronizes the document blocks against a plain JSON-AST form.
     * Blocks whose JSON representation is unchanged keep their raw source lines;
     * changed, missing and extra positions are rebuilt from the plain value.
     * @param doc - The document tree to update in place.
     * @param json - The target block list in JSON-AST form.
     */
    public static apply(doc: DocumentNode, json: AST.JsonNode[]): void {
        const common = Math.min(doc.children.length, json.length);
        for (let i = 0; i < common; i++) {
            if (Synchronizer.matches(doc.children[i], json[i])) continue;
            doc.children[i] = Adapter.fromValue(json[i]);
        }
        if (doc.children.length > json.length) doc.children = doc.children.slice(0, json.length);
        else for (let i = doc.children.length; i < json.length; i++) doc.children.push(Adapter.fromValue(json[i]));
    }

    private static matches(node: AST.Node, json: AST.JsonNode): boolean {
        return Synchronizer.deepEqual(Adapter.toJson(node), json);
    }

    private static deepEqual(a: unknown, b: unknown): boolean {
        if (a === b) return true;
        if (a === undefined && Array.isArray(b) && b.length === 0) return true;
        if (b === undefined && Array.isArray(a) && a.length === 0) return true;
        if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
        if (Array.isArray(a) || Array.isArray(b)) {
            if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
            return a.every((value, index) => Synchronizer.deepEqual(value, b[index]));
        }
        const left = a as Record<string, unknown>;
        const right = b as Record<string, unknown>;
        for (const key of new Set([...Object.keys(left), ...Object.keys(right)])) {
            if (!Synchronizer.deepEqual(left[key], right[key])) return false;
        }
        return true;
    }
}

export namespace Synchronizer {}

export default Synchronizer;