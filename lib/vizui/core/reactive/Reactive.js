/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Abstract reactive contract: a store subscription that renders new values into a target.
 * @license Apache-2.0
 */
import { DESTROYABLE } from '../../support/Contracts.js';
export class Reactive {
    [DESTROYABLE] = true;
    store;
    vUnsubscribe = null;
    vListener = null;
    constructor(store) {
        this.store = store.select(s => s);
    }
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
    subscribe() {
        if (this.vUnsubscribe)
            return;
        const target = new WeakRef(this);
        this.vListener = (value) => target.deref()?.render(value);
        this.vUnsubscribe = this.store.subscribeWeak(this.vListener);
    }
    /**
     * Detaches the reactive from the store, stopping future updates.
     *
     * @remarks Can be overridden to add custom cleanup logic, but should call `super.unsubscribe()` to ensure the store subscription is removed.
     *
     * Unlike {@link destroy}, this is a detach operation: the derived store is kept, so the reactive
     * can later {@link subscribe} again to resume the binding.
     */
    unsubscribe() {
        if (!this.vUnsubscribe)
            return;
        this.vUnsubscribe();
        this.vListener = this.vUnsubscribe = null;
    }
    /**
     * Destroys the reactive, unsubscribing it from the store and destroying its derived store.
     *
     * @remarks Can be overridden to add custom cleanup logic, but should call `super.destroy()` to ensure both the store subscription and the derived store are released.
     *
     * `destroy()` terminates the current lifecycle of the reactive. Destroying the derived store also
     * detaches it from the source store, completing the teardown cascade. The previous subscription is
     * neither restored nor preserved.
     */
    destroy() {
        this.unsubscribe();
        this.store.destroy();
    }
}
export default Reactive;
//# sourceMappingURL=Reactive.js.map