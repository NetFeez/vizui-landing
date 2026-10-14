/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description VizUI composition root. Owns the application outlet and wires
 * the router, shared state and application configuration.
 * @license Apache-2.0
 */
import Events from '../events/Events.js';
import Element from './element/Element.js';
import Component from './component/Component.js';
import Config from './Config.js';
import Router from './router/Router.js';
import { IsComponent } from '../support/Contracts.js';
export class App extends Events {
    /** The outlet element the application mounts into. **/
    root;
    /** The application configuration. **/
    config;
    /** The router driving the application. **/
    router;
    /** The shared store, when one was provided. **/
    store;
    /** The pending initialization promise, once started. **/
    vInit = null;
    /**
     * Creates the application composition root.
     * @param options - The application options: root outlet, config, router and store.
     */
    constructor(options) {
        super();
        this.root = App.resolveRoot(options.root);
        this.config = options.config instanceof Config
            ? options.config
            : new Config(options.config);
        this.router = options.router ?? new Router({
            base: this.config.base,
            outlet: this.root,
        });
        this.router.outlet = this.root;
        this.store = options.store ?? null;
    }
    /** Whether the application has already been initialized. **/
    get initialized() { return this.vInit !== null; }
    /** Initializes the router against the application's root outlet. **/
    start() {
        if (!this.vInit) {
            this.vInit = this.router.init().then(() => { this.emit('start'); });
        }
        return this.vInit;
    }
    /**
     * Appends auxiliary content into the application root without engaging the
     * router. The router owns the outlet and replaces the root content on the
     * next navigation; use this only for shell content mounted around routing.
     * @param content - The components, elements or HTMLElements to append.
     * @returns This app, for chaining.
     */
    render(...content) {
        for (const child of content) {
            if (typeof child !== 'object')
                this.root.append(child);
            else if (IsComponent(child))
                this.root.append(child.root);
            else
                this.root.append(child);
        }
        return this;
    }
    /**
     * Resolves the root outlet from the supported source kinds.
     * @param source - The element, component, HTMLElement or selector to resolve.
     * @returns The resolved root element.
     * @throws When a selector source does not match any element in the document.
     */
    static resolveRoot(source) {
        if (source instanceof Element)
            return source;
        if (source instanceof Component)
            return source.root;
        if (typeof HTMLElement !== 'undefined' && source instanceof HTMLElement)
            return new Element(source);
        if (typeof source === 'string') {
            const root = Element.get(source);
            if (root)
                return root;
        }
        throw new Error('[App] The root element was not found.');
    }
}
export default App;
//# sourceMappingURL=App.js.map