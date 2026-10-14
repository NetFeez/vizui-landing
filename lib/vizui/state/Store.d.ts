/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Typed reactive store with subscription and derived selection.
 * @license Apache-2.0
 */
export declare class Store<State> implements Store.IsReadOnly<State> {
    /** The current state of the store. **/
    private vState;
    private vEmitter;
    private vWeakEmitter;
    /** Whether the store was destroyed and can no longer be used. **/
    private vDestroyed;
    /** Whether the store is an intermediate store. **/
    private vIntermediate;
    /**
     * Creates a store holding an initial state.
     * @param initialState - The initial state.
     * @param internal - Whether the store is an intermediate store.
     */
    constructor(initialState: State, internal?: boolean);
    /** The current state. **/
    get state(): Readonly<State>;
    /**
     * Sets a new state, notifying subscribers.
     * @param state - The new state.
     * @returns This store, for chaining.
     */
    set(state: State): this;
    /**
     * Sets a new state only if it differs from the current state, notifying subscribers.
     * @param state - The action producing the new state from the previous one.
     * @returns This store, for chaining.
     */
    smartSet(state: Store.StateAction<State>): this;
    /**
     * Updates the state with a deep partial patch, merging it into the current state.
     * @param patch - The partial state to merge.
     * @returns This store, for chaining.
     */
    deepUpdate(patch: Store.DeepPartial<State>): this;
    /**
     * Subscribes to state changes.
     * @param listener - The listener invoked with the new state.
     * @returns An unsubscribe function.
     */
    subscribe(listener: Store.Listener<State>): Store.Unsubscribe;
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
    subscribeWeak(listener: Store.Listener<State>): Store.Unsubscribe;
    /**
     * Derives a store that projects a slice of this store's state.
     * @param selector - The projection function.
     * @param equal - The equality function to determine if the selected value has changed.
     * @returns A derived store.
     */
    select<Selected>(selector: Store.Selector<State, Selected>, equal?: Store.Equal<Selected>): Store<Selected>;
    /**
     * Creates a derived store that can update the parent store based on changes to the selected slice.
     * @param selector - The projection function to select a slice of the state.
     * @param updater - The function to update the parent state based on the selected slice.
     * @param equal - The equality function to determine if the selected value has changed.
     * @returns A derived store that can update the parent store.
     */
    bind<Selected>(selector: Store.Selector<State, Selected>, updater: Store.Updater<State, Selected>, equal?: Store.Equal<Selected>): Store<Selected>;
    /** Destroys this store, notifying subscribers and preventing further use. **/
    destroy(): void;
    /**
     * Asserts that this store is not destroyed.
     * @throws When the store is destroyed.
     */
    private assertNotDestroyed;
    /**
     * Creates a store holding an initial state.
     * @param initialState - The initial state.
     * @returns A new store.
     */
    static create<State>(initialState: State): Store<State>;
    /**
     * Merges a deep partial source into a target without mutating either, producing a new value.
     * @param target - The value to merge into.
     * @param source - The partial patch to merge.
     * @returns The merged value.
     */
    private static deepMerge;
}
export declare namespace Store {
    /** The events emitted by a store. **/
    type EventMap<State> = {
        /** The state changed. **/
        change: [state: State, last: State];
        'internal:change': [state: State, last: State];
        /** The store was destroyed. **/
        destroy: [];
    };
    interface IsReadOnly<State> {
        readonly state: State;
        subscribe(listener: Store.Listener<State>): Store.Unsubscribe;
        select<Selected>(selector: Store.Selector<State, Selected>, equal?: Store.Equal<Selected>): Store<Selected>;
    }
    /** A recursive partial of a value. **/
    type DeepPartial<Value> = Value extends Function ? Value : Value extends object ? {
        [Key in keyof Value]?: DeepPartial<Value[Key]>;
    } : Value;
    /** The equality function used to compare derived values. **/
    type Equal<State> = (a: State, b: State) => boolean;
    /** The function returned by subscriptions to stop listening. **/
    type Unsubscribe = () => void;
    /** The projection of a store state into a slice. **/
    type Selector<State, Selected> = (state: State) => Selected;
    type Updater<State, Selected> = (selected: Selected, state: State) => State;
    /** The listener notified on state changes. **/
    type Listener<State> = (state: State) => void;
    /** The action producing a new state from the previous one. **/
    type StateAction<State> = (prev: State) => State;
}
export default Store;
