/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Abstract reactive contract: a store subscription that renders new values into a target.
 * @license Apache-2.0
 */
import { DESTROYABLE, IsDestroyable } from '../../support/Contracts.js';
import Store from '../../state/Store.js';
export declare abstract class Reactive<T> implements IsDestroyable {
    readonly [DESTROYABLE] = true;
    /** The kind of target the reactive renders into. **/
    abstract readonly type: Reactive.Type;
    /** The instance id of the reactive, unique per binding. **/
    abstract readonly id: string;
    readonly store: Store<T>;
    private vUnsubscribe;
    private vListener;
    protected constructor(store: Store<T>);
    /**
     * Re-renders the reactive from a new state.
     * @param value - The new state to render.
     */
    abstract render(value: T): void;
    /**
     * Subscribes the reactive to the store, triggering future updates.
     *
     * @remarks Can be overridden to add custom subscription logic, but should call `super.subscribe()` to ensure the store subscription is added. Calling it while already subscribed is a no-op.
     *
     * The store holds the subscription weakly (see {@link Store.subscribeWeak}): it stores a
     * `WeakRef` to the listener, so the reactive is never retained by the store. The listener does
     * not capture this reactive strongly either: it references it through a `WeakRef`, so the
     * reactive remains collectable even when an engine keeps the listener closure alive. Once the
     * reactive is unreachable, the store drops the subscription on the next emission.
     */
    subscribe(): void;
    /**
     * Detaches the reactive from the store, stopping future updates.
     *
     * @remarks Can be overridden to add custom cleanup logic, but should call `super.unsubscribe()` to ensure the store subscription is removed.
     *
     * Unlike {@link destroy}, this is a detach operation: the derived store is kept, so the reactive
     * can later {@link subscribe} again to resume the binding.
     */
    unsubscribe(): void;
    /**
     * Destroys the reactive, unsubscribing it from the store and destroying its derived store.
     *
     * @remarks Can be overridden to add custom cleanup logic, but should call `super.destroy()` to ensure both the store subscription and the derived store are released.
     *
     * `destroy()` terminates the current lifecycle of the reactive. Destroying the derived store also
     * detaches it from the source store, completing the teardown cascade. The previous subscription is
     * neither restored nor preserved.
     */
    destroy(): void;
}
export declare namespace Reactive {
    /** The kind of target a reactive renders into. **/
    type Type = 'child' | 'attribute' | (string & {});
    /** A predicate selecting reactives for teardown. **/
    type Filter = (reactive: Reactive<any>) => boolean;
}
export default Reactive;
