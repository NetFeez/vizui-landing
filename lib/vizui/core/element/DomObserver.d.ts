/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Observes mutation and intersection events on an element.
 * @license Apache-2.0
 */
import Events from '../../events/Events.js';
export declare class DomObserver<T extends HTMLElement = HTMLElement> extends Events<DomObserver.EventMap<T>> {
    readonly root: T;
    private static vShared;
    private vMutationRegistered;
    private vIntersectionRegistered;
    private vWasConnected;
    /**
     * Returns or creates the shared state container.
     * @returns The shared state.
     */
    private static get shared();
    /**
     * Returns the shared MutationObserver, creating it lazily on first use.
     * @returns The MutationObserver.
     */
    private static getMutationObserver;
    /**
     * Processes a childList mutation record, discovering affected observers via direct lookup or subtree scan.
     * @param shared - The shared observer state.
     * @param record - The mutation record to process.
     *
     * @remarks
     * Affected observers are collected into a Set before processing to avoid
     * duplicates and to decouple discovery from emission. The `vWasConnected`
     * flag on each observer is then compared against `root.isConnected` to
     * detect add/remove transitions.
     */
    private static processChildList;
    /**
     * Discovers observers affected by a NodeList of added or removed nodes.
     * @param shared - The shared observer state.
     * @param nodes - The NodeList to scan (addedNodes or removedNodes).
     * @param affected - The Set to collect affected observers into.
     *
     * @remarks
     * For each element node: O(1) direct root lookup via `Map.get()`, then a
     * subtree fallback that checks `node.contains(root)` for every registered
     * root. The Set guarantees no observer is processed more than once.
     *
     * The direct lookup does NOT short-circuit the subtree scan because a node
     * that is itself a registered root may also contain other registered roots.
     */
    private static collectAffected;
    /**
     * Checks the connection state of an observer's root and emits add/remove on transition.
     * @param observer - The observer to update.
     */
    private static updateConnection;
    /**
     * Returns the shared IntersectionObserver, creating it lazily on first use.
     * @returns The IntersectionObserver.
     */
    private static getIntersectionObserver;
    /**
     * Creates an observer bound to a root element.
     * @param root - The observed element.
     */
    constructor(root: T);
    /**
     * Counts the total of mutation event listeners.
     * @returns The number of mutation event listeners.
     */
    private get mutationCount();
    /**
     * Counts the total of intersection event listeners.
     * @returns The number of intersection event listeners.
     */
    private get intersectionCount();
    /**
     * Registers the root element with the shared mutation observer.
     */
    private registerMutation;
    /**
     * Unregisters the root element from the shared mutation observer when no listeners remain.
     */
    private unregisterMutation;
    /**
     * Registers the root element with the shared intersection observer.
     */
    private registerIntersection;
    /**
     * Unregisters the root element from the shared intersection observer when no listeners remain.
     */
    private unregisterIntersection;
    /**
     * Forcefully unregisters from the shared mutation observer regardless of listener count.
     */
    private forceUnregisterMutation;
    /**
     * Forcefully unregisters from the shared intersection observer regardless of listener count.
     */
    private forceUnregisterIntersection;
    /**
     * Initializes the appropriate shared observer for the given event type.
     * @param type - The event type.
     */
    private initObserver;
    /**
     * Unregisters from the appropriate shared observer when listeners drop to zero.
     * @param type - The event type.
     */
    private checkAndUnregister;
    /**
     * Checks whether the event type is a mutation event.
     * @param type - The type of event.
     * @returns Whether the type belongs to the mutation channel.
     */
    private isMutationEvent;
    /**
     * Checks whether the event type is an intersection event.
     * @param type - The type of event.
     * @returns Whether the type belongs to the intersection channel.
     */
    private isIntersectionEvent;
    /** Overrides emit to check for unregistration after once listeners fire. **/
    protected emit<E extends string & keyof DomObserver.EventMap<T>>(...event: [name: E, ...args: DomObserver.EventMap<T>[E]]): void;
    on<E extends DomObserver.EventNames<T>>(type: E, listener: DomObserver.EventListener<T, E>): this;
    once<E extends DomObserver.EventNames<T>>(type: E, listener: DomObserver.EventListener<T, E>): this;
    off<E extends DomObserver.EventNames<T>>(type: E, listener: DomObserver.EventListener<T, E>): this;
    offOnce<E extends DomObserver.EventNames<T>>(type: E, listener: DomObserver.EventListener<T, E>): this;
    offAll(type: DomObserver.EventNames<T>): this;
    offAllOnce(type: DomObserver.EventNames<T>): this;
    /**
     * Disconnects all observers and clears all listeners.
     */
    destroy(): void;
}
export declare namespace DomObserver {
    type MutationEventMap<T extends HTMLElement> = {
        add: [root: T];
        remove: [root: T];
        attribute: [root: T, name: string, value: string | null, old: string | null];
    };
    type IntersectionEventMap<T extends HTMLElement> = {
        visible: [root: T];
        hidden: [root: T];
    };
    type EventMap<T extends HTMLElement> = MutationEventMap<T> & IntersectionEventMap<T>;
    type EventNames<T extends HTMLElement> = keyof EventMap<T>;
    type EventListener<T extends HTMLElement, E extends EventNames<T>> = Events.Listener<EventMap<T>[E]>;
    interface Shared {
        mutation: MutationObserver | null;
        intersection: IntersectionObserver | null;
        mutationObservers: Map<HTMLElement, Set<DomObserver<any>>>;
        intersectionObservers: Map<Element, Set<DomObserver<any>>>;
    }
}
export default DomObserver;
