/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Navigation tracker for the SPA router. Tracks a single navigation
 * chain (programmatic + redirect hops), its matched rule, lifecycle status and
 * duration. Adapts the Vortez request tracker to the client navigation flow.
 * @license Apache-2.0
 */
import type Rule from './rule/Rule.js';
import type RouterRule from './rule/RouterRule.js';
import type Router from './Router.js';
export declare class Tracker {
    /** The unique identifier of the navigation. **/
    readonly id: string;
    /** The monotonic start time of the navigation. **/
    readonly startTime: number;
    /** The raw target value of the navigation. **/
    readonly value: string;
    /** The history action of the navigation. **/
    protected vAction: 'push' | 'replace';
    /** The current lifecycle status of the navigation. **/
    protected vStatus: Tracker.Status;
    /** The rule matched by the navigation, when present. **/
    protected vRule: Rule | RouterRule | null;
    /** The entries of the navigation chain. **/
    protected vEntries: Tracker.Entry[];
    /** The cursor pointing at the current chain entry. **/
    protected vIndex: number;
    /** The error that failed the navigation, when present. **/
    protected vError: unknown | null;
    /** The reason of an intentional abort, when present. **/
    protected vAbortReason: unknown | null;
    /** Whether the failure was already offered to an error boundary. **/
    protected vErrorOffered: boolean;
    /**
     * Creates a navigation tracker.
     * @param value - The raw target value of the navigation.
     * @param action - The history action of the navigation.
     */
    constructor(value: string, action?: 'push' | 'replace');
    /** The history action of the navigation. **/
    get action(): 'push' | 'replace';
    /** The current lifecycle status of the navigation. **/
    get status(): Tracker.Status;
    /** The rule matched by the navigation, when present. **/
    get rule(): Rule | RouterRule | null;
    /**
     * Assigns the rule matched by the navigation.
     * @param rule - The matched rule, or null to clear it.
     */
    set rule(rule: Rule | RouterRule | null);
    /** The entries of the navigation chain. **/
    get entries(): Tracker.Entry[];
    /** The cursor pointing at the current chain entry. **/
    get index(): number;
    /** The current chain entry, or null when the chain is empty. **/
    get current(): Tracker.Entry | null;
    /** Whether there is an entry before the current one. **/
    get hasPrevious(): boolean;
    /** Whether there is an entry after the current one. **/
    get hasNext(): boolean;
    /** The elapsed time of the navigation in milliseconds. **/
    get duration(): number;
    /** Marks the navigation as matched by a rule. **/
    markRouted(): void;
    /** Marks the navigation as executing. **/
    markExecuting(): void;
    /** Marks the navigation as applied to the application and history. **/
    markApplied(): void;
    /** Marks the navigation as completed. **/
    complete(): void;
    /**
     * Marks the navigation as failed (an error). Terminal: a failed or aborted
     * transaction can never transition again.
     * @param error - The error that failed the navigation.
     */
    fail(error: unknown): void;
    /**
     * Marks the navigation as cancelled intentionally (an abort). Terminal:
     * a failed or aborted transaction can never transition again.
     * @param reason - The reason of the abort, when provided.
     */
    abort(reason?: unknown): void;
    /**
     * Adds an entry to the navigation chain.
     * @param entry - The entry to push.
     */
    push(entry: Tracker.Entry): void;
    /**
     * Replaces the current entry of the navigation chain.
     * @param entry - The entry to write.
     */
    replace(entry: Tracker.Entry): void;
    /**
     * Moves one entry back in the navigation chain.
     * @returns The entry now current, or null at the beginning of the chain.
     */
    back(): Tracker.Entry | null;
    /**
     * Moves one entry forward in the navigation chain.
     * @returns The entry now current, or null at the end of the chain.
     */
    forward(): Tracker.Entry | null;
    /** The error that failed the navigation, when present. **/
    get error(): unknown | null;
    /** The reason of an intentional abort, when present. **/
    get abortReason(): unknown | null;
    /** Whether the failing transaction was already offered to an error boundary. **/
    get errorOffered(): boolean;
    /** Records that an error boundary ran for this transaction (idempotent). **/
    markErrorOffered(): void;
    /** Whether the transaction reached a terminal state (failed or aborted). **/
    protected get terminal(): boolean;
    /**
     * Generates a unique identifier for a tracker.
     * @returns A random uuid, or a fallback when the platform lacks crypto.
     */
    static uuid(): string;
}
export declare namespace Tracker {
    /** A parsed entry of the navigation chain. **/
    interface Entry {
        path: string;
        search: string;
        hash: string;
        query: URLSearchParams;
        params: Router.Params;
    }
    /** The lifecycle statuses of a navigation. **/
    type Status = 'initialized' | 'routed' | 'executing' | 'applied' | 'completed' | 'failed' | 'aborted';
}
export default Tracker;
