/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Manages the intrinsic live state of a native DOM node: its event tracker and reactive pool.
 * @license Apache-2.0
 */
import EventTracker from './element/EventTracker.js';
import _Reactive from './reactive/Reactive.js';
import Store from '../state/Store.js';
declare const REGISTRY: unique symbol;
export declare class LiveStorage {
    private static [REGISTRY];
    /** The native DOM node owning the live bindings. **/
    private readonly vNode;
    private readonly vTracker;
    private readonly vReactive;
    private constructor();
    /** The event tracker of the node. **/
    get tracker(): EventTracker;
    /**
     * Registers a reactive under its store for teardown.
     * @param reactive - The reactive to register.
     */
    register(reactive: _Reactive<any>): void;
    /**
     * Unregisters the reactives bound to a store, detaching matching ones without destroying them.
     * @param store - The store the reactives are bound to.
     * @param filter - Optional type or predicate to select which reactives to detach.
     *
     * @remarks This is a detach operation: the matching reactives are unsubscribed and removed from the
     * pool. Their derived stores and lifecycle`s are not terminated; use {@link destroy} for that.
     */
    unregister(store: Store<any>, filter?: _Reactive.Type | _Reactive.Filter): void;
    /**
     * Destroys the live state of the node: detaches the tracked event listeners
     * and destroys every reactive in the pool.
     *
     * @remarks Each reactive is destroyed, not merely unsubscribed: {@link _Reactive.destroy} detaches
     * the binding and destroys the reactive's derived store, completing the teardown cascade from the
     * node down to the source stores. The reactive pool is then cleared.
     * @returns A promise resolving once every reactive has been destroyed.
     */
    destroy(): Promise<void>;
    /**
     * Gets the live storage of a DOM node, creating it on first use.
     * @param node - The native DOM node owning the live bindings.
     * @returns The live storage shared by every wrapper of the node.
     */
    static of(node: globalThis.Node): LiveStorage;
}
export declare namespace LiveStorage {
    /** The registry of live storages keyed by native DOM node. **/
    type Registry = WeakMap<globalThis.Node, LiveStorage>;
    /** The reactive pool of a node, grouped by store. **/
    type Reactive = Map<Store<any>, Set<_Reactive<any>>>;
}
export default LiveStorage;
