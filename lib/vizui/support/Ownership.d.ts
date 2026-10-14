/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Ownership management for destroyable objects.
 * @license Apache-2.0
 */
import { DESTROYABLE, IsDestroyable } from "./Contracts.js";
export declare class Ownership implements IsDestroyable {
    readonly [DESTROYABLE] = true;
    private vOwned;
    /** The owned targets of this instance, as a read-only view of the internal set. **/
    get owned(): ReadonlySet<Ownership.Target>;
    /**
     * Owns a destroyable object, either directly or via a WeakRef. The owned object will be destroyed when this Ownership instance is destroyed.
     * Passing the destroyable object directly establishes a strong ownership: the owner retains the target.
     * Passing a WeakRef establishes a weak ownership: the owner never retains the target, so the target must be kept alive elsewhere; if it is garbage collected before destruction, it is skipped.
     * @param target - The destroyable object or WeakRef to own.
     *
     * @remarks Dead WeakRef entries are pruned lazily on each {@link own} call, so a long-lived ownership instance does not accumulate collected targets.
     */
    own(target: Ownership.Target): void;
    /**
     * Unowns a destroyable object, either directly or via a WeakRef. The unowned object will not be destroyed when this Ownership instance is destroyed.
     * @param target - The destroyable object or WeakRef to unown.
     *
     * @remarks The target must be the exact reference previously passed to {@link own}: entries are matched by identity.
     */
    unown(target: Ownership.Target): void;
    /**
     * Destroys all owned objects. If an owned object is a WeakRef, it will be dereferenced before calling destroy().
     * If the WeakRef has been garbage collected, it will be skipped.
     * The set is emptied before the targets are destroyed, so cyclic ownership or destruction chains that mutate ownership cannot produce infinite iterations.
     * After calling this method, the instance remains usable and may receive new owned objects.
     * @returns A promise resolving once every owned target has been destroyed.
     */
    destroy(): Promise<void>;
    /** Drops the owned WeakRef entries whose target has already been collected. */
    private prune;
}
export declare namespace Ownership {
    /** A destroyable object or a weak reference to one. **/
    type Target = IsDestroyable | WeakRef<IsDestroyable>;
    /** The internal set of targets owned by an Ownership instance. **/
    type Owned = Set<Target>;
}
export default Ownership;
