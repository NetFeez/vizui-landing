/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description SPA router mirroring the Vortez router public API: guards
 * (global + per rule), route matching (FIFO/Tree), nested routers/layouts,
 * loaders, 404 fallback, base path, injectable history host and DOM renderer.
 * URLs are base-inclusive (navigate('/app/users/42') when base is '/app').
 * @license Apache-2.0
 */
import { IsView } from '../../support/Contracts.js';
import Events from '../../events/Events.js';
import Element from '../element/Element.js';
import Component from '../component/Component.js';
import _Algorithm from './algorithm/Algorithm.js';
import _FIFO from './algorithm/FIFO.js';
import _Tree from './algorithm/Tree.js';
import _Guard from './pipeline/Guard.js';
import _Pipeline from './pipeline/Pipeline.js';
import _History from './navigator/History.js';
import _Tracker from './Tracker.js';
import _LayoutManager from './LayoutManager.js';
import { DomRenderer } from './Renderer.js';
import _Rule from './rule/Rule.js';
import _ShowRule from './rule/ShowRule.js';
import _LayoutRule from './rule/LayoutRule.js';
import _ActionRule from './rule/ActionRule.js';
import _RouterRule from './rule/RouterRule.js';
export class Router extends Events {
    /** The built-in matching algorithms, by name. **/
    static AlgorithmMap = {
        fifo: _FIFO,
        tree: _Tree,
    };
    /** The matching algorithm of the router. **/
    vAlgorithm;
    /** The global guard pipeline of the router. **/
    vPipeline;
    /** The layout chain manager of the router. **/
    vLayoutManager;
    /** The renderer stack; the last one is active. **/
    vRenderers = [];
    /** The history backing the router. **/
    vHistory;
    /** The base path every template is prefixed with. **/
    vBase;
    /** The outlet the router mounts into. **/
    vOutlet;
    /** The fallback content mounted when no route matches. **/
    vNotFound = null;
    /** The last committed navigation entry. **/
    vCurrent = null;
    /** The queue serializing concurrent navigations. **/
    vExec = Promise.resolve();
    /** Whether the router already routed its initial location. **/
    vInitialized = false;
    /**
     * Creates the router.
     * @param options - The router options: base, algorithm, pipeline, renderer,
     * history, mode and outlet.
     */
    constructor(options = {}) {
        super();
        this.vLayoutManager = new _LayoutManager();
        this.vBase = options.base ? _History.path(options.base) : '';
        this.vAlgorithm = Router.resolveAlgorithm(options.algorithm);
        this.vPipeline = options.pipeline ?? new _Pipeline();
        this.vRenderers = options.renderer ? [options.renderer] : [new DomRenderer()];
        this.vHistory = options.history ?? new _History(options.host ?? Router.defaultHost(), { mode: options.mode });
        this.vOutlet = Router.widen(Router.resolveOutlet(options.outlet) ?? this.renderer.outlet ?? Element.new('div'));
        this.vHistory.on('change', (entry) => { void this.synchronize(entry); });
    }
    // ========== State ==========
    /** The matching algorithm of the router. **/
    get algorithm() { return this.vAlgorithm; }
    /**
     * Replaces the matching algorithm, migrating the registered rules onto it (mirrors Vortez).
     * @param algorithm - The algorithm instance or the name of a built-in algorithm.
     */
    set algorithm(algorithm) {
        const rules = this.vAlgorithm.rules;
        this.vAlgorithm = Router.resolveAlgorithm(algorithm);
        this.vAlgorithm.add(...rules);
    }
    /** The base path every template is prefixed with. **/
    get base() { return this.vBase; }
    /**
     * Sets the base path every template is prefixed with.
     * @param base - The base path.
     * @throws When routes were already registered; the base is fixed after registration.
     */
    set base(base) {
        if (this.vAlgorithm.rules.length > 0)
            throw new Error('[Router] The base cannot be changed after routes were registered.');
        this.vBase = base ? _History.path(base) : '';
    }
    /** The active renderer, the last one of the stack. **/
    get renderer() { return this.vRenderers[this.vRenderers.length - 1] ?? this.vRenderers[0]; }
    /** The outlet the router mounts into. **/
    get outlet() { return this.vOutlet; }
    /**
     * Replaces the outlet the router mounts into.
     * @param outlet - The new outlet source.
     */
    set outlet(outlet) {
        this.vOutlet = Router.resolveOutlet(outlet) ?? this.vOutlet;
    }
    /** The history backing the router. **/
    get history() { return this.vHistory; }
    /** The last committed navigation entry. **/
    get current() { return this.vCurrent; }
    /** The params of the current entry. **/
    get params() { return this.vCurrent?.params ?? {}; }
    /** The query of the current entry. **/
    get query() { return this.vCurrent?.query ?? new URLSearchParams(); }
    /** Whether the history has a previous entry. **/
    get hasPrevious() { return this.vHistory.hasPrevious; }
    /** Whether the history has a next entry. **/
    get hasNext() { return this.vHistory.hasNext; }
    // ========== Registration ==========
    /**
     * Appends guards to this router's global pipeline. Plain functions become
     * Navigation guards; pass `new Guard.Error(...)` for the error-boundary.
     * @param items - The guards, guard functions or pipelines to add.
     * @returns This router, for chaining.
     */
    use(...items) {
        this.vPipeline.use(...items);
        return this;
    }
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
    action(kind, template, content, pipeline = new _Pipeline()) {
        const route = new _ActionRule(kind, this.prefix(template), content, pipeline);
        this.addRule(route);
        return route;
    }
    /**
     * Registers a route that mounts a view.
     * @param template - The url template of the route.
     * @param content - The view, or a factory producing it.
     * @param pipeline - The per-route pipeline.
     * @returns The registered route. Its loader is typed with the data painted by the view.
     */
    show(template, content, pipeline = new _Pipeline()) {
        const route = new _ShowRule(this.prefix(template), content, pipeline);
        this.addRule(route);
        return route;
    }
    /**
     * Registers a layout covering every nested path of its template.
     * @param template - The url template of the layout.
     * @param content - The layout component, or a factory producing it.
     * @returns The registered layout.
     */
    layout(template, content) {
        const route = new _LayoutRule(this.prefix(template), content);
        this.vLayoutManager.register(route);
        return route;
    }
    /**
     * Registers a nested router under a template prefix.
     * @param template - The url template prefix of the sub-router.
     * @param content - An existing sub-router, or its options.
     * @returns The sub-router.
     */
    router(template, content = {}) {
        let subRouter;
        if (content instanceof Router) {
            subRouter = content;
        }
        else {
            subRouter = new Router({ algorithm: content.algorithm });
            if (content.pipeline)
                subRouter.vPipeline.use(content.pipeline);
        }
        const rule = new _RouterRule(this.prefix(template), subRouter);
        this.addRule(rule);
        return subRouter;
    }
    /**
     * Declares the fallback content mounted when no route matches.
     * @param content - The fallback component, or a factory producing it.
     * @returns This router, for chaining.
     */
    notFound(content) {
        this.vNotFound = content;
        return this;
    }
    /**
     * Registers multiple pre-built routes at once, prefixing those without the base.
     * @param rules - The routes to register.
     * @returns This router, for chaining.
     */
    multiple(...rules) {
        for (const rule of rules) {
            if (!this.hasPrefix(rule.template))
                rule.template = this.prefix(rule.template);
            this.addRule(rule);
        }
        return this;
    }
    /**
     * Tests whether any registered route matches a URL (base-inclusive).
     * @param url - The url to match.
     * @returns Whether any route matches the url.
     */
    test(url) {
        return this.find(_History.path(url)) !== null;
    }
    // ========== Navigation ==========
    /**
     * Navigates to a URL and commits it to the history host. The navigation is
     * serialized behind any in-flight navigation.
     * @param value - The target URL (base-inclusive).
     * @param options - Navigation options: replace the current entry, persist
     * custom state, or suppress the automatic scroll-to-top.
     */
    navigate(value, options = {}) {
        const path = _History.path(value);
        const action = options.replace ? 'replace' : 'push';
        const task = () => this.exec(value, action, undefined, options).catch(() => undefined);
        this.vExec = this.vExec.then(task, task);
        this.emit('navigate', path);
    }
    /**
     * Navigates to a URL replacing the current history entry.
     * @param value - The target URL (base-inclusive).
     */
    replace(value) { this.navigate(value, { replace: true }); }
    /** Asks the history to go back. **/
    back() { this.vHistory.back(); }
    /** Asks the history to go forward. **/
    forward() { this.vHistory.forward(); }
    /** Routes the current host location once, without committing history. **/
    async init() {
        if (this.vInitialized)
            return;
        this.vInitialized = true;
        if (!this.vOutlet.isConnected && typeof document !== 'undefined')
            this.vOutlet.appendTo(Element.body);
        const entry = this.vHistory.current ?? _History.parse(this.vHistory.host.location.path);
        await this.exec(_History.stringify(entry), 'replace', undefined, { state: entry.state });
    }
    /**
     * Internal entry point: resolves a full navigation including redirect hops.
     * @param value - The target url.
     * @param action - The history action of the navigation.
     * @param tracker - The navigation tracker, when present.
     * @param options - The navigation options.
     */
    async exec(value, action, tracker, options = {}) {
        const navigation = tracker ?? new _Tracker(value, action);
        navigation.markExecuting();
        const state = { router: this, tracker: navigation };
        const entry = this.parseToEntry(value, options.state);
        try {
            navigation.push(entry);
            const redirect = await this.resolve(entry, state, navigation);
            if (redirect) {
                await this.exec(redirect.value, redirect.action, navigation, options);
                return;
            }
            if (navigation.status === 'failed' || navigation.status === 'aborted')
                return;
            this.vHistory.navigate(value, action, options.state);
            if (options.scroll !== false)
                this.scrollToTop();
            navigation.markApplied();
            navigation.complete();
            this.emit('change', this.vCurrent);
        }
        catch (error) {
            await this.settleError(error, entry, state, navigation);
        }
    }
    /**
     * Runs the pipeline then resolves the commit decision for a navigation,
     * applying the redirect and abort controls produced by guards.
     * @param entry - The entry being navigated.
     * @param state - The shared guard state.
     * @param tracker - The navigation tracker, when present.
     * @returns The pending redirect, when a guard scheduled one.
     */
    async resolve(entry, state, tracker) {
        const control = await this.route(entry, state, tracker, entry.path);
        if (control && 'redirect' in control)
            return { value: control.redirect, action: state.redirect?.action ?? 'push' };
        if (control && 'abort' in control) {
            tracker?.abort(control.abort);
            this.emit('abort', this.vCurrent, control.abort);
            return null;
        }
        if (state.redirect)
            return state.redirect;
        return null;
    }
    /**
     * Re-routes on an external host change (browser back/forward/refresh).
     * The host has already moved, so a failed navigation cannot be undone:
     * the URL shows the new path while the application keeps the previous
     * content mounted. This is the expected policy — the error/abort channel
     * reports the failure and `current` keeps the last committed entry.
     * @param historyEntry - The entry parsed from the host location.
     */
    async synchronize(historyEntry) {
        const value = _History.stringify(historyEntry);
        const tracker = new _Tracker(value, 'replace');
        const entry = this.parseToEntry(value, historyEntry.state);
        tracker.push(entry);
        const state = { router: this, tracker };
        try {
            const redirect = await this.resolve(entry, state, tracker);
            if (redirect) {
                await this.exec(redirect.value, redirect.action);
                return;
            }
            if (tracker.status === 'failed' || tracker.status === 'aborted')
                return;
            tracker.markApplied();
            tracker.complete();
            this.emit('change', this.vCurrent);
        }
        catch (error) {
            await this.settleError(error, entry, state, tracker);
        }
    }
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
    async route(entry, state, tracker, path = entry.path, outlet = null) {
        const anchor = outlet ?? this.vOutlet;
        state.renderer = state.renderer ?? this.renderer;
        const rule = this.find(path);
        try {
            const target = await this.vLayoutManager.sync(path, anchor, this.rendererFor(state), this.vOutlet);
            if (!rule) {
                await this.handleNotFound(entry, state, target);
                tracker?.markRouted();
                return undefined;
            }
            entry.route = rule;
            this.mergeParams(entry, rule, path);
            if (tracker)
                tracker.rule = rule;
            const destination = async (pipeState) => rule.exec(entry, pipeState, target, tracker, path);
            const control = await this.vPipeline.run(entry, state, destination);
            if (control && 'error' in control) {
                await this.handleError(control.error, entry, state, tracker);
                return undefined;
            }
            if (control)
                return control;
            if (tracker && (tracker.status === 'failed' || tracker.status === 'aborted'))
                return undefined;
            this.vCurrent = entry;
            return undefined;
        }
        catch (error) {
            await this.handleError(error, entry, state, tracker);
            return undefined;
        }
    }
    /**
     * Mounts the fallback content and emits `404` for an unmatched navigation.
     * @param entry - The entry being navigated.
     * @param state - The shared guard state.
     * @param target - The outlet to mount the fallback into.
     */
    async handleNotFound(entry, state, target = this.vOutlet) {
        if (this.vNotFound) {
            const content = this.vNotFound;
            const component = typeof content === 'function' ? await content() : content;
            if (IsView(component)) {
                if (component.load)
                    await component.load(entry);
                if (component.render)
                    await component.render();
            }
            this.rendererFor(state).mount(component, target);
        }
        this.vCurrent = entry;
        this.emit('404', entry);
    }
    // ========== Internals ==========
    /**
     * Finds the rule matching a path.
     * @param path - The path to match.
     * @returns The matching rule, or null when none matches.
     */
    find(path) {
        return this.vAlgorithm.find(_History.path(path));
    }
    /**
     * Registers a rule on the matching algorithm.
     * @param rule - The rule to register.
     */
    addRule(rule) {
        this.vAlgorithm.add(rule);
    }
    /**
     * Merges the params extracted by a rule into a navigation entry.
     * @param entry - The entry to enrich.
     * @param rule - The matched rule.
     * @param path - The path level the rule matched.
     */
    mergeParams(entry, rule, path) {
        const extracted = rule.params(path);
        delete extracted.$surplus;
        entry.params = { ...entry.params, ...extracted };
    }
    /**
     * Picks the renderer for a navigation, preferring the inherited one.
     * @param state - The shared guard state.
     * @returns The renderer to mount with.
     */
    rendererFor(state) {
        return state.renderer ?? this.renderer;
    }
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
    async handleError(error, entry, state, tracker) {
        tracker?.fail(error);
        tracker?.markErrorOffered();
        const control = await this.vPipeline.runError(error, entry, state);
        if (control === undefined)
            return;
        if ('redirect' in control) {
            this.navigate(control.redirect, { replace: true });
            return;
        }
        if ('abort' in control) {
            this.emit('abort', this.vCurrent, control.abort);
            return;
        }
        if ('error' in control)
            throw control.error;
    }
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
    async settleError(error, entry, state, tracker) {
        tracker?.fail(error);
        if (!tracker?.errorOffered) {
            try {
                return void await this.handleError(error, entry, state, tracker);
            }
            catch (unhandled) {
                return void this.emit('error', unhandled);
            }
        }
        this.emit('error', error);
    }
    /**
     * Parses a raw navigation value into a router entry.
     * @param value - The raw navigation value.
     * @param state - The custom state persisted with the entry.
     * @returns The parsed entry.
     */
    parseToEntry(value, state) {
        const parts = _History.parse(value);
        return {
            path: parts.path,
            search: parts.search,
            hash: parts.hash,
            query: new URLSearchParams(parts.search),
            params: {},
            route: null,
            state,
        };
    }
    /**
     * Prefixes a template with the router base.
     * @param template - The template to prefix.
     * @returns The prefixed template.
     */
    prefix(template) {
        return `${this.vBase}${_History.normalize(template)}`;
    }
    /**
     * Tests whether a template already carries a prefix.
     * @param template - The template to check.
     * @param prefix - The prefix to look for, defaulting to the router base.
     * @returns Whether the template starts with the prefix.
     */
    hasPrefix(template, prefix = this.vBase) {
        if (!prefix)
            return false;
        return template === prefix || template.startsWith(`${prefix}/`);
    }
    /** Scrolls the window back to the top after a committed navigation. **/
    scrollToTop() {
        if (typeof window !== 'undefined')
            window.scrollTo(0, 0);
    }
    /**
     * Resolves a matching algorithm from a name or instance.
     * @param algorithm - The algorithm instance, the name of a built-in one, or undefined.
     * @returns The algorithm instance.
     * @throws When the name does not match a built-in algorithm.
     */
    static resolveAlgorithm(algorithm) {
        if (algorithm instanceof _Algorithm)
            return algorithm;
        const name = (algorithm ?? 'fifo').toLowerCase();
        const AlgorithmClass = Router.AlgorithmMap[name];
        if (!AlgorithmClass)
            throw new Error(`[Router] Unknown algorithm "${algorithm}". Supported: ${Object.keys(Router.AlgorithmMap).join(', ')}.`);
        return new AlgorithmClass();
    }
    /**
     * Resolves an outlet source into an Element.
     * @param outlet - The outlet source to resolve.
     * @returns The resolved element, or null when the source is not one.
     */
    static resolveOutlet(outlet) {
        if (outlet instanceof Element)
            return outlet;
        if (typeof HTMLElement !== 'undefined' && outlet instanceof HTMLElement)
            return new Element(outlet);
        if (outlet instanceof Component)
            return outlet.root;
        return null;
    }
    /**
     * Widens a concrete Element to its base type for storage in base-typed fields.
     * @param element - The element to widen.
     * @returns The widened element.
     */
    static widen(element) {
        return element;
    }
    /**
     * Picks the default host for the current environment.
     * @returns The DOM host in browsers, the memory host otherwise.
     */
    static defaultHost() {
        return typeof window !== 'undefined' ? _History.dom() : _History.memory('/');
    }
}
(function (Router) {
    Router.Algorithm = _Algorithm;
    Router.FIFO = _FIFO;
    Router.Tree = _Tree;
    Router.Guard = _Guard;
    Router.Pipeline = _Pipeline;
    Router.Route = _Rule;
    Router.Tracker = _Tracker;
})(Router || (Router = {}));
export { DomRenderer } from './Renderer.js';
export default Router;
//# sourceMappingURL=Router.js.map