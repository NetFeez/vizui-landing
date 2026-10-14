/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Tree matching: rules are indexed by segment into a trie, with
 * static, parameter and wildcard nodes. Port of Vortez Tree extended to `:param`
 * and `$?param`/`:?param` required/optional params.
 * @license Apache-2.0
 */
import Algorithm from './Algorithm.js';
import FIFO from './FIFO.js';
declare class RouteNode {
    statics: Map<string, RouteNode>;
    params: RouteNode.Param | null;
    wildcard: RouteNode | null;
    fifo: FIFO;
    constructor();
    /** All rules reachable from this node, depth first. **/
    get rules(): Algorithm.ruleType[];
}
declare namespace RouteNode {
    /** A parameter branch of the trie. **/
    interface Param {
        /** The name of the parameter. **/
        name: string;
        /** Whether the parameter may be absent from the url. **/
        isOptional: boolean;
        /** The node matching the segment after the parameter. **/
        node: RouteNode;
    }
}
export declare class Tree extends Algorithm {
    /** The root node of the trie. **/
    private vRoot;
    constructor();
    /** All rules registered in the algorithm. **/
    get rules(): Algorithm.ruleType[];
    /**
     * Adds rules to the algorithm, indexing them by path segment.
     * @param rules - The rules to add.
     */
    add(...rules: Algorithm.ruleType[]): void;
    /** Removes every rule from the algorithm. **/
    clear(): void;
    /**
     * Finds the first rule matching a URL.
     * @param url - The url to match.
     * @returns The matching rule, or null when none matches.
     */
    find(url: string): Algorithm.ruleType | null;
    /**
     * Walks the trie for a URL and returns the deepest matching node.
     * @param url - The url to navigate.
     * @returns The matching node, or null when no branch matches.
     */
    protected navigate(url: string): RouteNode | null;
    /**
     * Splits a path into its non-empty segments.
     * @param path - The path to split.
     * @returns The path segments.
     */
    protected splitPath(path: string): string[];
}
export declare namespace Tree { }
export default Tree;
