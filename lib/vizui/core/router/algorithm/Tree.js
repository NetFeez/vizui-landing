/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Tree matching: rules are indexed by segment into a trie, with
 * static, parameter and wildcard nodes. Port of Vortez Tree extended to `:param`
 * and `$?param`/`:?param` required/optional params.
 * @license Apache-2.0
 */
import Algorithm from './Algorithm.js';
import FIFO from './FIFO.js';
class RouteNode {
    statics;
    params;
    wildcard;
    fifo;
    constructor() {
        this.statics = new Map();
        this.params = null;
        this.wildcard = null;
        this.fifo = new FIFO();
    }
    /** All rules reachable from this node, depth first. **/
    get rules() {
        const rules = [...this.fifo.rules];
        if (this.wildcard)
            rules.push(...this.wildcard.rules);
        if (this.params)
            rules.push(...this.params.node.rules);
        for (const node of this.statics.values())
            rules.push(...node.rules);
        return rules;
    }
}
export class Tree extends Algorithm {
    /** The root node of the trie. **/
    vRoot;
    constructor() { super(); this.vRoot = new RouteNode(); }
    /** All rules registered in the algorithm. **/
    get rules() { return this.vRoot.rules; }
    /**
     * Adds rules to the algorithm, indexing them by path segment.
     * @param rules - The rules to add.
     */
    add(...rules) {
        for (const rule of rules) {
            const segments = this.splitPath(rule.template);
            let currentNode = this.vRoot;
            for (let index = 0; index < segments.length; index++) {
                const segment = segments[index];
                if (segment === '*') {
                    currentNode.wildcard ??= new RouteNode();
                    currentNode = currentNode.wildcard;
                }
                else if (segment.startsWith('$') || segment.startsWith(':')) {
                    const isOptional = segment.startsWith('$?') || segment.startsWith(':?');
                    const paramName = segment.replace(/^[\$:]\??/, '');
                    if (isOptional && index === segments.length - 1) {
                        currentNode.fifo.add(rule);
                        break;
                    }
                    currentNode.params ??= { name: paramName, isOptional, node: new RouteNode() };
                    currentNode = currentNode.params.node;
                }
                else {
                    if (!currentNode.statics.has(segment)) {
                        currentNode.statics.set(segment, new RouteNode());
                    }
                    currentNode = currentNode.statics.get(segment);
                }
            }
            currentNode.fifo.add(rule);
        }
    }
    /** Removes every rule from the algorithm. **/
    clear() {
        this.vRoot = new RouteNode();
    }
    /**
     * Finds the first rule matching a URL.
     * @param url - The url to match.
     * @returns The matching rule, or null when none matches.
     */
    find(url) {
        const node = this.navigate(url);
        return node ? node.fifo.find(url) : null;
    }
    /**
     * Walks the trie for a URL and returns the deepest matching node.
     * @param url - The url to navigate.
     * @returns The matching node, or null when no branch matches.
     */
    navigate(url) {
        const segments = this.splitPath(url);
        let currentNode = this.vRoot;
        for (const segment of segments) {
            if (currentNode.statics.has(segment)) {
                currentNode = currentNode.statics.get(segment);
            }
            else if (currentNode.params) {
                currentNode = currentNode.params.node;
            }
            else if (currentNode.wildcard) {
                currentNode = currentNode.wildcard;
                break;
            }
            else if (currentNode.fifo.rules.some((rule) => rule.test(url))) {
                return currentNode;
            }
            else
                return null;
        }
        return currentNode;
    }
    /**
     * Splits a path into its non-empty segments.
     * @param path - The path to split.
     * @returns The path segments.
     */
    splitPath(path) {
        return path.split('/').filter(p => p.length > 0);
    }
}
export default Tree;
//# sourceMappingURL=Tree.js.map