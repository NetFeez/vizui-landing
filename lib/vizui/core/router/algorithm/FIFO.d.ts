/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description FIFO matching: rules are tested in registration order. Default
 * algorithm for the SPA router. Port of Vortez FIFO (no Http/Ws split).
 * @license Apache-2.0
 */
import type RouterRule from '../rule/RouterRule.js';
import Algorithm from './Algorithm.js';
import type Rule from '../rule/Rule.js';
export declare class FIFO extends Algorithm {
    /** The plain rules in registration order. **/
    protected routes: Rule[];
    /** The router rules in registration order. **/
    protected routerRules: RouterRule[];
    /** All rules registered in the algorithm, in registration order. **/
    get rules(): Algorithm.ruleType[];
    /**
     * Adds rules to the algorithm, splitting them by kind.
     * @param rules - The rules to add.
     */
    add(...rules: Algorithm.ruleType[]): void;
    /** Removes every rule from the algorithm. **/
    clear(): void;
    /**
     * Finds the first rule matching a URL, in registration order.
     * @param url - The url to match.
     * @returns The matching rule, or null when none matches.
     */
    find(url: string): Algorithm.ruleType | null;
}
export declare namespace FIFO { }
export default FIFO;
