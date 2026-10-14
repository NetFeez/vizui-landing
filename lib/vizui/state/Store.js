/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Typed reactive store with subscription and derived selection.
 * @license Apache-2.0
 */
import { EventsEmitter } from '../events/Events.js';
import { WeakEvents } from '../support/WeakEvents.js';
export class Store {
    /** The current state of the store. **/
    vState;
    vEmitter;
    vWeakEmitter;
    /** Whether the store was destroyed and can no longer be used. **/
    vDestroyed = false;
    /** Whether the store is an intermediate store. **/
    vIntermediate;
    /**
     * Creates a store holding an initial state.
     * @param initialState - The initial state.
     * @param internal - Whether the store is an intermediate store.
     */
    constructor(initialState, internal = false) {
        this.vState = initialState;
        this.vIntermediate = internal;
        this.vEmitter = new EventsEmitter();
        this.vWeakEmitter = new WeakEvents();
    }
    /** The current state. **/
    get state() { return this.vState; }
    /**
     * Sets a new state, notifying subscribers.
     * @param state - The new state.
     * @returns This store, for chaining.
     */
    set(state) {
        this.assertNotDestroyed();
        const last = this.vState;
        this.vState = state;
        const event = this.vIntermediate ? 'internal:change' : 'change';
        this.vEmitter.emit(event, this.vState, last);
        this.vWeakEmitter.emit(event, this.vState, last);
        return this;
    }
    /**
     * Sets a new state only if it differs from the current state, notifying subscribers.
     * @param state - The action producing the new state from the previous one.
     * @returns This store, for chaining.
     */
    smartSet(state) {
        this.assertNotDestroyed();
        const value = state(this.vState);
        if (!Object.is(value, this.vState))
            this.set(value);
        return this;
    }
    /**
     * Updates the state with a deep partial patch, merging it into the current state.
     * @param patch - The partial state to merge.
     * @returns This store, for chaining.
     */
    deepUpdate(patch) {
        this.assertNotDestroyed();
        return this.smartSet((previous) => Store.deepMerge(previous, patch));
    }
    /**
     * Subscribes to state changes.
     * @param listener - The listener invoked with the new state.
     * @returns An unsubscribe function.
     */
    subscribe(listener) {
        this.assertNotDestroyed();
        this.vEmitter.on('change', listener);
        return () => this.vEmitter.off('change', listener);
    }
    /**
     * Subscribes to state changes without keeping the listener alive from the store side.
     * @param listener - The listener invoked with the new state.
     * @returns An unsubscribe function.
     *
     * @remarks
     * The listener is stored in a `WeakRef`. The store never holds it strongly, so the
     * subscription disappears as soon as nothing else references the listener (and, with it,
     * whatever it closes over). The caller therefore owns the listener's lifetime and must keep
     * it reachable for as long as it wants to receive events; a listener referenced only by this
     * subscription is eligible for collection immediately. Dead entries are pruned lazily on the
     * next emission of the channel.
     */
    subscribeWeak(listener) {
        this.assertNotDestroyed();
        return this.vWeakEmitter.on('change', listener);
    }
    /**
     * Derives a store that projects a slice of this store's state.
     * @param selector - The projection function.
     * @param equal - The equality function to determine if the selected value has changed.
     * @returns A derived store.
     */
    select(selector, equal = Object.is) {
        this.assertNotDestroyed();
        const derived = Store.create(selector(this.vState));
        const handler = (state) => {
            const selected = selector(state);
            if (!equal(selected, derived.state))
                derived.set(selected);
        };
        this.subscribe(handler);
        this.vEmitter.once('destroy', () => derived.destroy());
        derived.vEmitter.once('destroy', () => this.vEmitter.off('change', handler));
        return derived;
    }
    /**
     * Creates a derived store that can update the parent store based on changes to the selected slice.
     * @param selector - The projection function to select a slice of the state.
     * @param updater - The function to update the parent state based on the selected slice.
     * @param equal - The equality function to determine if the selected value has changed.
     * @returns A derived store that can update the parent store.
     */
    bind(selector, updater, equal = Object.is) {
        const derived = new Store(selector(this.vState), true);
        const parentHandler = (state) => {
            const selected = selector(state);
            if (!equal(selected, derived.state))
                derived.set(selected);
        };
        const derivedHandler = (selected) => {
            this.smartSet((state) => updater(selected, state));
        };
        this.subscribe(parentHandler);
        derived.vEmitter.on('internal:change', derivedHandler);
        this.vEmitter.once('destroy', () => derived.destroy());
        derived.vEmitter.once('destroy', () => this.vEmitter.off('change', parentHandler));
        return derived;
    }
    /** Destroys this store, notifying subscribers and preventing further use. **/
    destroy() {
        if (this.vDestroyed)
            throw new Error('Store is already destroyed');
        this.vDestroyed = true;
        this.vEmitter.emit('destroy');
        this.vWeakEmitter.emit('destroy');
        this.vEmitter.offAll('change');
        this.vEmitter.offAll('internal:change');
        this.vWeakEmitter.clear();
    }
    /**
     * Asserts that this store is not destroyed.
     * @throws When the store is destroyed.
     */
    assertNotDestroyed() { if (this.vDestroyed)
        throw new Error('Store is destroyed'); }
    /**
     * Creates a store holding an initial state.
     * @param initialState - The initial state.
     * @returns A new store.
     */
    static create(initialState) { return new Store(initialState); }
    /**
     * Merges a deep partial source into a target without mutating either, producing a new value.
     * @param target - The value to merge into.
     * @param source - The partial patch to merge.
     * @returns The merged value.
     */
    static deepMerge(target, source) {
        const patch = source;
        const result = Array.isArray(target) ? [...target] : { ...target };
        const record = result;
        for (const key in patch) {
            const value = patch[key];
            if (value && typeof value === 'object') {
                const current = record[key];
                record[key] = Store.deepMerge(current && typeof current === 'object' ? current : {}, value);
            }
            else
                record[key] = value;
        }
        return result;
    }
}
export default Store;
//# sourceMappingURL=Store.js.map