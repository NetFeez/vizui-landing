/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Guards intercept navigations between the URL and the mounted
 * content. A guard may inspect the entry/state, call `next()` to continue, or
 * short-circuit the navigation by returning a control result. Mirror of the
 * Vortez Middleware architecture: an abstract base discriminated by symbol
 * with two channels — Navigation (entry flow) and Error (error-boundary).
 * @license Apache-2.0
 */
import { GUARD } from '../../../support/symbols.js';
import type Router from '../Router.js';
import type Tracker from '../Tracker.js';
import type Renderer from '../Renderer.js';
export declare abstract class Guard<Action extends (...args: any[]) => Guard.Result | Promise<Guard.Result> = Guard.Navigation.Action> {
    [GUARD.BASE]: boolean;
    /** The channel this guard belongs to. **/
    abstract readonly identifier: Guard.Identifier;
    /** The function executed by this guard (mirrors Vortez `Middleware.action`). **/
    readonly action: Action;
    /**
     * Creates a guard around an action.
     * @param action - The function executed by this guard.
     */
    constructor(action: Action);
    /**
     * Executes the guard's action with the supplied arguments.
     * @param args - The arguments passed to the action.
     * @returns The control result produced by the action, if any.
     */
    run(...args: Parameters<Action>): Guard.Result | Promise<Guard.Result>;
}
export declare namespace Guard {
    /** The guard channels: navigation flow and error boundary. **/
    type Identifier = 'navigation' | 'error';
    /**
     * Mutable context shared across the guard chain of a single navigation.
     * Guards may attach arbitrary values (mirrors Vortez `Middleware.State`).
     */
    interface State extends Record<string, unknown> {
        /** The router handling the navigation. **/
        router: Router;
        /** Tracker of the navigation being intercepted, when present. **/
        tracker?: Tracker;
        /** Renderer inherited from the delegating parent router, when present. **/
        renderer?: Renderer;
        /** The redirect set by a guard, applied after the pipeline resolves. **/
        redirect?: Guard.Redirect;
    }
    /** The redirect a guard can schedule after the pipeline resolves. **/
    interface Redirect {
        /** The target url of the redirect. **/
        value: string;
        /** The history action of the redirect. **/
        action: 'push' | 'replace';
    }
    /**
     * Control result of a guard. Returning a value halts the pipeline:
     * redirect navigates to another URL, abort silently cancels the navigation
     * and error fails the navigation with the given reason.
     */
    type Result = void | {
        redirect: string;
    } | {
        abort?: unknown;
    } | {
        error?: unknown;
    };
    /** The continuation function a guard receives to keep the chain going. **/
    type Next = () => Promise<Result | undefined>;
    class Navigation extends Guard<Navigation.Action> {
        [GUARD.NAVIGATION]: boolean;
        /** The channel this guard belongs to. **/
        readonly identifier: Guard.Identifier;
    }
    namespace Navigation {
        /**
         * Navigation guard action. Receives the entry, `next` and the shared
         * state; mirrors Vortez `Middleware.Http` with the client removed.
         * Plain guard functions passed to `use()` are auto-wrapped into
         * `Guard.Navigation`.
         */
        type Action = (entry: Router.Entry, next: Guard.Next, state: Guard.State) => Result | Promise<Result>;
    }
    class Error extends Guard<Error.Action> {
        [GUARD.ERROR]: boolean;
        /** The channel this guard belongs to. **/
        readonly identifier: Guard.Identifier;
    }
    namespace Error {
        /**
         * Error guard action (error-boundary). Runs when a navigation fails;
         * mirrors Vortez `Middleware.HttpError`: a guard handles the error by
         * returning without calling `next()` (or returning a control result),
         * forwards it by calling `next()`, and an exhausted chain re-throws so
         * the router re-emits the failed navigation through its `error` event.
         */
        type Action = (error: unknown, entry: Router.Entry, next: Guard.Next, state: Guard.State) => Result | Promise<Result>;
    }
    /** The plain navigation guard function accepted by `use()` and auto-wrapped. **/
    type Function = Navigation.Action;
    /** The action signature of any guard channel. **/
    type Action = Navigation.Action | Error.Action;
    /** Any guard instance, of either channel. **/
    type Type = Navigation | Error;
}
export default Guard;
