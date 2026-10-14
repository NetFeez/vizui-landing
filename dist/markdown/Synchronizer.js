/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Synchronizes a markdown document tree against its plain JSON-AST form, preserving untouched blocks verbatim.
 * @license Apache-2.0
 */
import Adapter from './Adapter.js';
export class Synchronizer {
    /**
     * Synchronizes the document blocks against a plain JSON-AST form.
     * Blocks whose JSON representation is unchanged keep their raw source lines;
     * changed, missing and extra positions are rebuilt from the plain value.
     * @param doc - The document tree to update in place.
     * @param json - The target block list in JSON-AST form.
     */
    static apply(doc, json) {
        const common = Math.min(doc.children.length, json.length);
        for (let i = 0; i < common; i++) {
            if (Synchronizer.matches(doc.children[i], json[i]))
                continue;
            doc.children[i] = Adapter.fromValue(json[i]);
        }
        if (doc.children.length > json.length)
            doc.children = doc.children.slice(0, json.length);
        else
            for (let i = doc.children.length; i < json.length; i++)
                doc.children.push(Adapter.fromValue(json[i]));
    }
    static matches(node, json) {
        return Synchronizer.deepEqual(Adapter.toJson(node), json);
    }
    static deepEqual(a, b) {
        if (a === b)
            return true;
        if (a === undefined && Array.isArray(b) && b.length === 0)
            return true;
        if (b === undefined && Array.isArray(a) && a.length === 0)
            return true;
        if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null)
            return false;
        if (Array.isArray(a) || Array.isArray(b)) {
            if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length)
                return false;
            return a.every((value, index) => Synchronizer.deepEqual(value, b[index]));
        }
        const left = a;
        const right = b;
        for (const key of new Set([...Object.keys(left), ...Object.keys(right)])) {
            if (!Synchronizer.deepEqual(left[key], right[key]))
                return false;
        }
        return true;
    }
}
export default Synchronizer;
//# sourceMappingURL=Synchronizer.js.map