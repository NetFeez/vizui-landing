/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Runtime for the sandbox — relaxes the editor text, transforms its JSX into
 *              jsx-runtime calls and evaluates it as a throwaway ES module
 *              (object url + dynamic import), handing back its default export.
 * @license Apache-2.0
 */
export declare class Runner {
    /** The evaluation budget in milliseconds before the watchdog reports a stall. **/
    private static readonly TIME_LIMIT;
    /**
     * Evaluates a module source and resolves its default export.
     * @param code - The module source written in the editor. Imports resolve through the page import map.
     * @returns The evaluation outcome: the default export, or a formatted failure message.
     */
    static load(code: string): Promise<Runner.Result>;
    /**
     * The watchdog of the evaluation: a run that takes longer than the budget is
     * reported as a failure instead of leaving the pipeline stalled.
     * @returns A rejection with the timeout message.
     */
    private static timeout;
    /**
     * Relaxes the source so the common TS-only sugars that are not JS do not hard-fail.
     * @param code - The raw editor source.
     * @returns The sanitized source.
     */
    private static sanitize;
    /**
     * Whether the failure is a partial-input state rather than a dead run:
     * partial JSX while typing does not discard the last mounted preview.
     * @param error - The thrown value.
     * @returns Whether the failure is transient.
     */
    private static isTransient;
    /**
     * Formats an unknown failure into a readable single-line message.
     * @param error - The thrown value.
     * @returns The message to show.
     */
    private static format;
}
export declare namespace Runner {
    /** The outcome of evaluating a sandbox module. **/
    interface Result {
        ok: boolean;
        value?: unknown;
        error?: string;
        /** Whether the failure only means the source is still being written. **/
        incomplete?: boolean;
    }
}
export default Runner;
