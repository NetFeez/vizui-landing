/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Algorithm abstraction for route matching. Separates the router
 * from how rules are stored/searched (FIFO linear vs Tree). Port of Vortez Algorithm.
 * @license Apache-2.0
 */
import type Rule from '../rule/Rule.js';
import type RouterRule from '../rule/RouterRule.js';
export declare abstract class Algorithm {
    /** All rules registered in the algorithm. **/
    abstract get rules(): Algorithm.ruleType[];
    /**
     * Adds rules to the algorithm.
     * @param rules - The rules to add.
     */
    abstract add(...rules: Algorithm.ruleType[]): Promise<void> | void;
    /** Removes every rule from the algorithm. **/
    abstract clear(): Promise<void> | void;
    /**
     * Finds the first rule matching a URL.
     * @param url - The url to match.
     * @returns The matching rule, or null when none matches.
     */
    abstract find(url: string): Algorithm.ruleType | null;
    /**
     * Tests whether any rule matches a URL.
     * @param url - The url to match.
     * @returns Whether any rule matches the url.
     */
    test(url: string): boolean;
}
export declare namespace Algorithm {
    /** The rule kinds an algorithm can store. **/
    type ruleType = Rule | RouterRule;
}
export default Algorithm;
