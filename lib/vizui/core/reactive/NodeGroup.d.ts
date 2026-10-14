/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Renders a store as a contiguous group of DOM nodes kept between stable anchors.
 * @license Apache-2.0
 */
import type Store from '../../state/Store.js';
import Reactive from './Reactive.js';
export declare class NodeGroup<T = unknown> extends Reactive<T> {
    /** The subscription type, used by reactive filters. **/
    readonly type: 'child';
    /** The instance id of this group, embedded in its anchor markers. **/
    readonly id: string;
    /** The opening anchor marking the group boundary. **/
    private vStart;
    /** The closing anchor marking the group boundary. **/
    private vEnd;
    /** The current content nodes of the group. **/
    private vNodes;
    /**
     * Creates a reactive node group bound to a store.
     * @param store - The store providing the group state.
     *
     * @remarks
     * The group owns a pair of stable `Comment` anchors with a set of contiguous
     * siblings between them; the content is fully re-rendered whenever the store
     * changes (no keyed diffing: update the whole state with `set()`). The anchors
     * preserve the group's slot even when the content is empty, so an emptied
     * group refills in place. The group is mounted with {@link NodeGroup.appendTo}.
     */
    constructor(store: Store<T>);
    /** The current content nodes of the group, anchors excluded. **/
    get nodes(): readonly globalThis.Node[];
    /**
     * Mounts the group into a parent, before an optional reference sibling.
     * @param parent - The parent node to mount into.
     * @param reference - The node to insert before; defaults to appending at the end.
     * @returns This group, for chaining.
     */
    appendTo(parent: globalThis.Node, reference?: globalThis.Node | null): this;
    /**
     * Re-renders the group content from a new state.
     * @param value - The new state to render.
     */
    render(value: T): void;
    /**
     * Removes the group content and anchors from the DOM.
     * @returns This group, for chaining.
     */
    remove(): this;
    /**
     * Converts a value into an array of DOM nodes, flattening arrays and wrapping non-nodes in `Text` nodes.
     * @param value - The value to convert.
     * @returns An array of DOM nodes.
     */
    private static toNodes;
}
export declare namespace NodeGroup {
}
export default NodeGroup;
