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
import Store from '../state/Store.js';
export declare class App<State = unknown> extends Events<App.EventMap> {
    /** The outlet element the application mounts into. **/
    readonly root: Element;
    /** The application configuration. **/
    readonly config: Config;
    /** The router driving the application. **/
    readonly router: Router;
    /** The shared store, when one was provided. **/
    readonly store: Store<State> | null;
    /** The pending initialization promise, once started. **/
    protected vInit: Promise<void> | null;
    /**
     * Creates the application composition root.
     * @param options - The application options: root outlet, config, router and store.
     */
    constructor(options: App.Options<State>);
    /** Whether the application has already been initialized. **/
    get initialized(): boolean;
    /** Initializes the router against the application's root outlet. **/
    start(): Promise<void>;
    /**
     * Appends auxiliary content into the application root without engaging the
     * router. The router owns the outlet and replaces the root content on the
     * next navigation; use this only for shell content mounted around routing.
     * @param content - The components, elements or HTMLElements to append.
     * @returns This app, for chaining.
     */
    render(...content: Component.ValueType[]): this;
    /**
     * Resolves the root outlet from the supported source kinds.
     * @param source - The element, component, HTMLElement or selector to resolve.
     * @returns The resolved root element.
     * @throws When a selector source does not match any element in the document.
     */
    protected static resolveRoot(source: App.RootSource): Element;
}
export declare namespace App {
    interface Options<State = unknown> {
        /** The outlet the application mounts into. **/
        root: RootSource;
        /** The application configuration, or its raw options. **/
        config?: Config | Config.Options;
        /** A custom router, when the default one must be replaced. **/
        router?: Router;
        /** The shared store, when the application uses global state. **/
        store?: Store<State>;
    }
    /** The supported kinds of root outlet sources. **/
    type RootSource = Element | Component | HTMLElement | string;
    /** The events emitted by the application lifecycle. **/
    type EventMap = {
        /** The router finished initializing against the root outlet. **/
        start: [];
    };
}
export default App;
