/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Navigation tracker for the SPA router. Tracks a single navigation
 * chain (programmatic + redirect hops), its matched rule, lifecycle status and
 * duration. Adapts the Vortez request tracker to the client navigation flow.
 * @license Apache-2.0
 */
export class Tracker {
    /** The unique identifier of the navigation. **/
    id;
    /** The monotonic start time of the navigation. **/
    startTime;
    /** The raw target value of the navigation. **/
    value;
    /** The history action of the navigation. **/
    vAction;
    /** The current lifecycle status of the navigation. **/
    vStatus = 'initialized';
    /** The rule matched by the navigation, when present. **/
    vRule = null;
    /** The entries of the navigation chain. **/
    vEntries = [];
    /** The cursor pointing at the current chain entry. **/
    vIndex = -1;
    /** The error that failed the navigation, when present. **/
    vError = null;
    /** The reason of an intentional abort, when present. **/
    vAbortReason = null;
    /** Whether the failure was already offered to an error boundary. **/
    vErrorOffered = false;
    /**
     * Creates a navigation tracker.
     * @param value - The raw target value of the navigation.
     * @param action - The history action of the navigation.
     */
    constructor(value, action = 'push') {
        this.id = Tracker.uuid();
        this.startTime = globalThis.performance?.now() ?? Date.now();
        this.value = value;
        this.vAction = action;
    }
    /** The history action of the navigation. **/
    get action() { return this.vAction; }
    /** The current lifecycle status of the navigation. **/
    get status() { return this.vStatus; }
    /** The rule matched by the navigation, when present. **/
    get rule() { return this.vRule; }
    /**
     * Assigns the rule matched by the navigation.
     * @param rule - The matched rule, or null to clear it.
     */
    set rule(rule) {
        if (rule && !this.terminal)
            this.vStatus = 'routed';
        this.vRule = rule;
    }
    /** The entries of the navigation chain. **/
    get entries() { return [...this.vEntries]; }
    /** The cursor pointing at the current chain entry. **/
    get index() { return this.vIndex; }
    /** The current chain entry, or null when the chain is empty. **/
    get current() { return this.vIndex >= 0 ? this.vEntries[this.vIndex] ?? null : null; }
    /** Whether there is an entry before the current one. **/
    get hasPrevious() { return this.vIndex > 0; }
    /** Whether there is an entry after the current one. **/
    get hasNext() { return this.vIndex >= 0 && this.vIndex < this.vEntries.length - 1; }
    /** The elapsed time of the navigation in milliseconds. **/
    get duration() {
        const end = globalThis.performance?.now() ?? Date.now();
        return end - this.startTime;
    }
    /** Marks the navigation as matched by a rule. **/
    markRouted() { if (!this.terminal)
        this.vStatus = 'routed'; }
    /** Marks the navigation as executing. **/
    markExecuting() { if (!this.terminal)
        this.vStatus = 'executing'; }
    /** Marks the navigation as applied to the application and history. **/
    markApplied() { if (!this.terminal)
        this.vStatus = 'applied'; }
    /** Marks the navigation as completed. **/
    complete() { if (!this.terminal)
        this.vStatus = 'completed'; }
    /**
     * Marks the navigation as failed (an error). Terminal: a failed or aborted
     * transaction can never transition again.
     * @param error - The error that failed the navigation.
     */
    fail(error) {
        if (this.terminal)
            return;
        this.vStatus = 'failed';
        this.vError = error;
    }
    /**
     * Marks the navigation as cancelled intentionally (an abort). Terminal:
     * a failed or aborted transaction can never transition again.
     * @param reason - The reason of the abort, when provided.
     */
    abort(reason) {
        if (this.terminal)
            return;
        this.vStatus = 'aborted';
        this.vAbortReason = reason ?? null;
    }
    /**
     * Adds an entry to the navigation chain.
     * @param entry - The entry to push.
     */
    push(entry) {
        this.vEntries = [...this.vEntries.slice(0, this.vIndex + 1), entry];
        this.vIndex = this.vEntries.length - 1;
    }
    /**
     * Replaces the current entry of the navigation chain.
     * @param entry - The entry to write.
     */
    replace(entry) {
        const index = Math.max(this.vIndex, 0);
        this.vEntries[index] = entry;
        if (index === 0) {
            this.vIndex = 0;
        }
    }
    /**
     * Moves one entry back in the navigation chain.
     * @returns The entry now current, or null at the beginning of the chain.
     */
    back() {
        if (this.vIndex <= 0)
            return null;
        this.vIndex -= 1;
        return this.current;
    }
    /**
     * Moves one entry forward in the navigation chain.
     * @returns The entry now current, or null at the end of the chain.
     */
    forward() {
        if (this.vIndex >= this.vEntries.length - 1)
            return null;
        this.vIndex += 1;
        return this.current;
    }
    /** The error that failed the navigation, when present. **/
    get error() { return this.vError; }
    /** The reason of an intentional abort, when present. **/
    get abortReason() { return this.vAbortReason; }
    /** Whether the failing transaction was already offered to an error boundary. **/
    get errorOffered() { return this.vErrorOffered; }
    /** Records that an error boundary ran for this transaction (idempotent). **/
    markErrorOffered() { this.vErrorOffered = true; }
    /** Whether the transaction reached a terminal state (failed or aborted). **/
    get terminal() {
        return this.vStatus === 'failed' || this.vStatus === 'aborted';
    }
    /**
     * Generates a unique identifier for a tracker.
     * @returns A random uuid, or a fallback when the platform lacks crypto.
     */
    static uuid() {
        const crypto = globalThis.crypto;
        if (crypto?.randomUUID)
            return crypto.randomUUID();
        return `tracker-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
}
export default Tracker;
//# sourceMappingURL=Tracker.js.map