/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description SPA router mirroring the Vortez router public API: guards
 * (global + per rule), route matching (FIFO/Tree), nested routers/layouts,
 * loaders, 404 fallback, base path, injectable history host and DOM renderer.
 * URLs are base-inclusive (navigate('/app/users/42') when base is '/app').
 * @license Apache-2.0
 */
import Events from '../../events/Events.js';
import Element from '../element/Element.js';
import Component from '../component/Component.js';
import View from '../component/View.js';
import _Algorithm from './algorithm/Algorithm.js';
import _FIFO from './algorithm/FIFO.js';
import _Tree from './algorithm/Tree.js';
import _Guard from './pipeline/Guard.js';
import _Pipeline from './pipeline/Pipeline.js';
import _History from './navigator/History.js';
import _Tracker from './Tracker.js';
import _LayoutManager from './LayoutManager.js';
import type { Renderer } from './Renderer.js';
import _Rule from './rule/Rule.js';
import _ShowRule from './rule/ShowRule.js';
import _LayoutRule from './rule/LayoutRule.js';
import _ActionRule from './rule/ActionRule.js';
import _RouterRule from './rule/RouterRule.js';
export declare class Router extends Events<Router.EventMap> {
    /** The built-in matching algorithms, by name. **/
    static readonly AlgorithmMap: Router.AlgorithmMap;
    /** The matching algorithm of the router. **/
    protected vAlgorithm: _Algorithm;
    /** The global guard pipeline of the router. **/
    protected vPipeline: _Pipeline;
    /** The layout chain manager of the router. **/
    protected vLayoutManager: _LayoutManager;
    /** The renderer stack; the last one is active. **/
    protected vRenderers: Renderer[];
    /** The history backing the router. **/
    protected vHistory: _History;
    /** The base path every template is prefixed with. **/
    protected vBase: string;
    /** The outlet the router mounts into. **/
    protected vOutlet: Element;
    /** The fallback content mounted when no route matches. **/
    protected vNotFound: Router.NotFoundContent | null;
    /** The last committed navigation entry. **/
    protected vCurrent: Router.Entry | null;
    /** The queue serializing concurrent navigations. **/
    protected vExec: Promise<void>;
    /** Whether the router already routed its initial location. **/
    protected vInitialized: boolean;
    /**
     * Creates the router.
     * @param options - The router options: base, algorithm, pipeline, renderer,
     * history, mode and outlet.
     */
    constructor(options?: Router.Options);
    /** The matching algorithm of the router. **/
    get algorithm(): _Algorithm;
    /**
     * Replaces the matching algorithm, migrating the registered rules onto it (mirrors Vortez).
     * @param algorithm - The algorithm instance or the name of a built-in algorithm.
     */
    set algorithm(algorithm: Router.AlgorithmName | _Algorithm);
    /** The base path every template is prefixed with. **/
    get base(): string;
    /**
     * Sets the base path every template is prefixed with.
     * @param base - The base path.
     * @throws When routes were already registered; the base is fixed after registration.
     */
    set base(base: string);
    /** The active renderer, the last one of the stack. **/
    get renderer(): Renderer;
    /** The outlet the router mounts into. **/
    get outlet(): Element;
    /**
     * Replaces the outlet the router mounts into.
     * @param outlet - The new outlet source.
     */
    set outlet(outlet: Element | Component | HTMLElement);
    /** The history backing the router. **/
    get history(): _History;
    /** The last committed navigation entry. **/
    get current(): Router.Entry | null;
    /** The params of the current entry. **/
    get params(): Router.Params;
    /** The query of the current entry. **/
    get query(): URLSearchParams;
    /** Whether the history has a previous entry. **/
    get hasPrevious(): boolean;
    /** Whether the history has a next entry. **/
    get hasNext(): boolean;
    /**
     * Appends guards to this router's global pipeline. Plain functions become
     * Navigation guards; pass `new Guard.Error(...)` for the error-boundary.
     * @param items - The guards, guard functions or pipelines to add.
     * @returns This router, for chaining.
     */
    use(...items: (_Guard.Type | _Guard.Function | _Pipeline)[]): this;
    /**
     * Registers a custom mount kind. The general form behind the typed
     * shortcuts; content receives the entry and guard state and may return a
     * control result (redirect/abort/error).
     * @param kind - The custom mount kind.
     * @param template - The url template of the route.
     * @param content - The content executed when the route matches.
     * @param pipeline - The per-route pipeline.
     * @returns The registered route.
     */
    action<Kind extends string>(kind: Kind, template: string, content: _ActionRule.Content, pipeline?: _Pipeline): _ActionRule;
    /**
     * Registers a route that mounts a view.
     * @param template - The url template of the route.
     * @param content - The view, or a factory producing it.
     * @param pipeline - The per-route pipeline.
     * @returns The registered route. Its loader is typed with the data painted by the view.
     */
    show<C extends _ShowRule.Content>(template: string, content: C, pipeline?: _Pipeline): _ShowRule<C>;
    /**
     * Registers a layout covering every nested path of its template.
     * @param template - The url template of the layout.
     * @param content - The layout component, or a factory producing it.
     * @returns The registered layout.
     */
    layout(template: string, content: _LayoutRule.Content): _LayoutRule;
    /**
     * Registers a nested router under a template prefix.
     * @param template - The url template prefix of the sub-router.
     * @param content - An existing sub-router, or its options.
     * @returns The sub-router.
     */
    router(template: string, content?: Router | Router.SubRouterOptions): Router;
    /**
     * Declares the fallback content mounted when no route matches.
     * @param content - The fallback component, or a factory producing it.
     * @returns This router, for chaining.
     */
    notFound(content: Router.NotFoundContent): this;
    /**
     * Registers multiple pre-built routes at once, prefixing those without the base.
     * @param rules - The routes to register.
     * @returns This router, for chaining.
     */
    multiple(...rules: Router.Mountable[]): this;
    /**
     * Tests whether any registered route matches a URL (base-inclusive).
     * @param url - The url to match.
     * @returns Whether any route matches the url.
     */
    test(url: string): boolean;
    /**
     * Navigates to a URL and commits it to the history host. The navigation is
     * serialized behind any in-flight navigation.
     * @param value - The target URL (base-inclusive).
     * @param options - Navigation options: replace the current entry, persist
     * custom state, or suppress the automatic scroll-to-top.
     */
    navigate(value: string, options?: Router.NavigateOptions): void;
    /**
     * Navigates to a URL replacing the current history entry.
     * @param value - The target URL (base-inclusive).
     */
    replace(value: string): void;
    /** Asks the history to go back. **/
    back(): void;
    /** Asks the history to go forward. **/
    forward(): void;
    /** Routes the current host location once, without committing history. **/
    init(): Promise<void>;
    /**
     * Internal entry point: resolves a full navigation including redirect hops.
     * @param value - The target url.
     * @param action - The history action of the navigation.
     * @param tracker - The navigation tracker, when present.
     * @param options - The navigation options.
     */
    protected exec(value: string, action: 'push' | 'replace', tracker?: _Tracker, options?: Router.NavigateOptions): Promise<void>;
    /**
     * Runs the pipeline then resolves the commit decision for a navigation,
     * applying the redirect and abort controls produced by guards.
     * @param entry - The entry being navigated.
     * @param state - The shared guard state.
     * @param tracker - The navigation tracker, when present.
     * @returns The pending redirect, when a guard scheduled one.
     */
    protected resolve(entry: Router.Entry, state: _Guard.State, tracker?: _Tracker): Promise<_Guard.Redirect | null>;
    /**
     * Re-routes on an external host change (browser back/forward/refresh).
     * The host has already moved, so a failed navigation cannot be undone:
     * the URL shows the new path while the application keeps the previous
     * content mounted. This is the expected policy — the error/abort channel
     * reports the failure and `current` keeps the last committed entry.
     * @param historyEntry - The entry parsed from the host location.
     */
    protected synchronize(historyEntry: _History.Entry): Promise<void>;
    /**
     * Core matching + guard + mount flow. Also the delegation surface used by
     * child routers through RouterRule.
     * @param entry - The entry being navigated (carries inherited params).
     * @param state - The shared guard state.
     * @param tracker - The navigation tracker, when present.
     * @param path - The path level to match (surplus inside delegations).
     * @param outlet - The outlet to mount into.
     * @returns A control result produced by the pipeline, if any.
     */
    route(entry: Router.Entry, state: _Guard.State, tracker?: _Tracker, path?: string, outlet?: Router.Outlet): Promise<_Guard.Result | undefined>;
    /**
     * Mounts the fallback content and emits `404` for an unmatched navigation.
     * @param entry - The entry being navigated.
     * @param state - The shared guard state.
     * @param target - The outlet to mount the fallback into.
     */
    protected handleNotFound(entry: Router.Entry, state: _Guard.State, target?: Element): Promise<void>;
    /**
     * Finds the rule matching a path.
     * @param path - The path to match.
     * @returns The matching rule, or null when none matches.
     */
    protected find(path: string): _Algorithm.ruleType | null;
    /**
     * Registers a rule on the matching algorithm.
     * @param rule - The rule to register.
     */
    protected addRule(rule: _Algorithm.ruleType): void;
    /**
     * Merges the params extracted by a rule into a navigation entry.
     * @param entry - The entry to enrich.
     * @param rule - The matched rule.
     * @param path - The path level the rule matched.
     */
    protected mergeParams(entry: Router.Entry, rule: _Rule, path: string): void;
    /**
     * Picks the renderer for a navigation, preferring the inherited one.
     * @param state - The shared guard state.
     * @returns The renderer to mount with.
     */
    protected rendererFor(state: _Guard.State): Renderer;
    /**
     * Runs a failed navigation through this router's global error-boundary
     * guards (mirrors the Vortez error pipeline). Handled errors are consumed
     * or translated at this level. Unhandled errors are re-thrown so they
     * climb to the enclosing router boundary — delegated sub-routers handle
     * first — and are finally emitted once by the root `error` event.
     * Mirrors Vortez Pipeline.run: each router level offers the shared failure
     * to its own error middleware and the re-thrown error keeps travelling up.
     * @param error - The error that failed the navigation.
     * @param entry - The entry that was being navigated.
     * @param state - The shared guard state.
     * @param tracker - The navigation tracker, when present.
     * @throws When no error guard handled the error.
     */
    protected handleError(error: unknown, entry: Router.Entry, state: _Guard.State, tracker?: _Tracker): Promise<void>;
    /**
     * Root fallback for the navigation launchers (exec and synchronize). A
     * transaction is offered to an error boundary at most once: errors that
     * climbed from lower boundaries were already offered, so the root only
     * emits the single `error` event that surfaces the failure to consumers.
     * @param error - The error that failed the navigation.
     * @param entry - The entry that was being navigated.
     * @param state - The shared guard state.
     * @param tracker - The navigation tracker, when present.
     */
    protected settleError(error: unknown, entry: Router.Entry, state: _Guard.State, tracker?: _Tracker): Promise<void>;
    /**
     * Parses a raw navigation value into a router entry.
     * @param value - The raw navigation value.
     * @param state - The custom state persisted with the entry.
     * @returns The parsed entry.
     */
    protected parseToEntry(value: string, state?: unknown): Router.Entry;
    /**
     * Prefixes a template with the router base.
     * @param template - The template to prefix.
     * @returns The prefixed template.
     */
    protected prefix(template: string): string;
    /**
     * Tests whether a template already carries a prefix.
     * @param template - The template to check.
     * @param prefix - The prefix to look for, defaulting to the router base.
     * @returns Whether the template starts with the prefix.
     */
    protected hasPrefix(template: string, prefix?: string): boolean;
    /** Scrolls the window back to the top after a committed navigation. **/
    protected scrollToTop(): void;
    /**
     * Resolves a matching algorithm from a name or instance.
     * @param algorithm - The algorithm instance, the name of a built-in one, or undefined.
     * @returns The algorithm instance.
     * @throws When the name does not match a built-in algorithm.
     */
    protected static resolveAlgorithm(algorithm: Router.AlgorithmName | _Algorithm | undefined): _Algorithm;
    /**
     * Resolves an outlet source into an Element.
     * @param outlet - The outlet source to resolve.
     * @returns The resolved element, or null when the source is not one.
     */
    protected static resolveOutlet(outlet: Router.OutletSource | undefined): Element | null;
    /**
     * Widens a concrete Element to its base type for storage in base-typed fields.
     * @param element - The element to widen.
     * @returns The widened element.
     */
    protected static widen(element: Element<any>): Element;
    /**
     * Picks the default host for the current environment.
     * @returns The DOM host in browsers, the memory host otherwise.
     */
    protected static defaultHost(): _History.Host;
}
export declare namespace Router {
    export import Algorithm = _Algorithm;
    export import FIFO = _FIFO;
    export import Tree = _Tree;
    export import Guard = _Guard;
    export import Pipeline = _Pipeline;
    export import Route = _Rule;
    export import Tracker = _Tracker;
    interface Options {
        /** The base path every template is prefixed with. **/
        base?: string;
        /** The matching algorithm, or its built-in name. **/
        algorithm?: AlgorithmName | Algorithm;
        /** The global guard pipeline, when one must be shared. **/
        pipeline?: Pipeline;
        /** The renderer mounting the routes. **/
        renderer?: Renderer;
        /** The navigation host, when the default one must be replaced. **/
        host?: _History.Host;
        /** A pre-built history, when the host must be shared. **/
        history?: _History;
        /** The navigation mode of the history. **/
        mode?: _History.Mode;
        /** The outlet the router mounts into. **/
        outlet?: OutletSource;
    }
    /** The options used to spawn a sub-router under a prefix. **/
    interface SubRouterOptions {
        /** The matching algorithm of the sub-router. **/
        algorithm?: AlgorithmName | Algorithm;
        /** The pipeline of the sub-router. **/
        pipeline?: Pipeline;
    }
    /** The built-in matching algorithms, by name. **/
    interface AlgorithmMap {
        fifo: typeof FIFO;
        tree: typeof Tree;
    }
    /** The options of a programmatic navigation. **/
    interface NavigateOptions {
        /** Whether the navigation replaces the current history entry. **/
        replace?: boolean;
        /** Custom state persisted with the history entry, delivered on back/forward. **/
        state?: unknown;
        /** Whether the window scrolls to the top after committing. **/
        scroll?: boolean;
    }
    /** The names of the built-in matching algorithms. **/
    type AlgorithmName = 'fifo' | 'tree' | 'FIFO' | 'Tree';
    /** The route kinds a router can mount in bulk. **/
    type Mountable = _ShowRule | _ActionRule | _RouterRule;
    /** The source kinds an outlet can be resolved from. **/
    type OutletSource = Element | Component | HTMLElement;
    /** The outlet a route mounts into. **/
    type Outlet = Element | null;
    /** The route parameters extracted from a url. **/
    type Params = {
        [name: string]: string | undefined;
    };
    /** Arbitrary data attached to a navigation. **/
    type State = Record<string, unknown>;
    type Content = View | Component | Element;
    /** The fallback content kinds mounted when no route matches. **/
    type NotFoundContent = Content | (() => Content | Promise<Content>);
    /** A fully parsed navigation entry. **/
    interface Entry {
        /** The normalized path of the navigation. **/
        path: string;
        /** The raw query string, including a leading `?` when present. **/
        search: string;
        /** The fragment without the leading `#`. **/
        hash: string;
        /** The parsed query of the navigation. **/
        query: URLSearchParams;
        /** The params extracted by the matched rule, including inherited ones. **/
        params: Params;
        /** The rule that matched the entry, when one did. **/
        route: Route | null;
        /** Custom state persisted with the entry (history API), when present. **/
        state?: unknown;
    }
    /** The events emitted by the router. **/
    type EventMap = {
        /** A programmatic navigation was requested. **/
        navigate: [path: string];
        /** A navigation was committed. **/
        change: [current: Entry | null];
        /** No route matched the navigation. **/
        '404': [entry: Entry];
        /** A guard aborted the navigation. **/
        abort: [current: Entry | null, reason?: unknown];
        /** A navigation failed without an error boundary handling it. **/
        error: [error: unknown];
    };
}
export type { Renderer } from './Renderer.js';
export { DomRenderer } from './Renderer.js';
export default Router;
