/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Runtime for the sandbox — relaxes the editor text, transforms its JSX into
 *              jsx-runtime calls and evaluates it as a throwaway ES module
 *              (object url + dynamic import), handing back its default export.
 * @license Apache-2.0
 */

import { Transpiler } from './Transpiler.js';

/**
 * A stalled-load marker; the format step translates it into user-facing text.
 **/
class TimeoutError extends globalThis.Error {
    public constructor() {
        super('Timeout');
        this.name = 'Runner.TimeoutError';
    }
}

export class Runner {
    /** The evaluation budget in milliseconds before the watchdog reports a stall. **/
    private static readonly TIME_LIMIT = 8000;

    /**
     * Evaluates a module source and resolves its default export.
     * @param code - The module source written in the editor. Imports resolve through the page import map.
     * @returns The evaluation outcome: the default export, or a formatted failure message.
     */
    public static async load(code: string): Promise<Runner.Result> {
        try {
            // Every transform can throw on partial input (a half-written <div tag),
            // so the whole evaluation is one guard: a rejection here would otherwise
            // escape before the caller's state can be released and stall the pipeline.
            const source = Transpiler.transform(Runner.sanitize(code));
            const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
            try {
                // A module with a top-level await that never settles would hold the
                // pipeline open forever (and silence every later run), so the load is
                // raced against a watchdog that reports the stall instead.
                const loader = import(/* @vite-ignore */ url);
                const module = await Promise.race([loader, this.timeout()]);
                return { ok: true, value: module.default ?? null };
            }
            finally {
                URL.revokeObjectURL(url);
            }
        }
        catch (error) {
            return { ok: false, error: Runner.format(error), incomplete: Runner.isTransient(error) };
        }
    }

    /**
     * The watchdog of the evaluation: a run that takes longer than the budget is
     * reported as a failure instead of leaving the pipeline stalled.
     * @returns A rejection with the timeout message.
     */
    private static timeout(): Promise<never> {
        const timer = new Promise<never>((_, reject) => {
            window.setTimeout(() => reject(new TimeoutError()), Runner.TIME_LIMIT);
        });
        // Silence the race loser: when the load wins, the late rejection still fires
        // and would surface as an unhandled rejection of an abandoned promise.
        timer.catch(() => undefined);
        return timer;
    }

    /**
     * Relaxes the source so the common TS-only sugars that are not JS do not hard-fail.
     * @param code - The raw editor source.
     * @returns The sanitized source.
     */
    private static sanitize(code: string): string {
        return code
            .replace(/^\s*export\s+namespace\s+\w+\s*\{\s*\}\s*$/gm, '')
            .replace(/^\s*export\s+type\s+\w+\s*=\s*[^;{]*;\s*$/gm, '');
    }

    /**
     * Whether the failure is a partial-input state rather than a dead run:
     * partial JSX while typing does not discard the last mounted preview.
     * @param error - The thrown value.
     * @returns Whether the failure is transient.
     */
    private static isTransient(error: unknown): boolean {
        return error instanceof Transpiler.Error || error instanceof TimeoutError;
    }

    /**
     * Formats an unknown failure into a readable single-line message.
     * @param error - The thrown value.
     * @returns The message to show.
     */
    private static format(error: unknown): string {
        if (error instanceof TimeoutError) return 'La evaluación pasa del límite de tiempo: revisa awaits top-level o importaciones que no resuelven.';
        if (error instanceof SyntaxError) return `SyntaxError — el sandbox ejecuta módulos ESM: ${error.message.split('\n')[0]}`;
        if (error instanceof Error) return error.message.split('\n')[0];
        return typeof error === 'string' ? error : 'Error desconocido.';
    }
}

export namespace Runner {
    /** The outcome of evaluating a sandbox module. **/
    export interface Result {
        ok: boolean;
        value?: unknown;
        error?: string;
        /** Whether the failure only means the source is still being written. **/
        incomplete?: boolean;
    }
}

export default Runner;
