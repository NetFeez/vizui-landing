/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Wraps a DOM Node with a fluent, typed API.
 * @license Apache-2.0
 */
import type Reactive from '../reactive/Reactive.js';
import { DESTROYABLE, NODE } from '../../support/symbols.js';
import { APPENDABLE, IsAppendable, IsDestroyable } from '../../support/Contracts.js';
import LiveStorage from '../LiveStorage.js';
import Ownership from '../../support/Ownership.js';
import EventTracker from './EventTracker.js';
import Store from '../../state/Store.js';
export declare class Node<T extends globalThis.Node = globalThis.Node> extends Ownership implements IsDestroyable, IsAppendable {
    readonly [DESTROYABLE] = true;
    readonly [APPENDABLE] = true;
    readonly [NODE] = true;
    /** The wrapped DOM node. **/
    readonly root: T;
    /** The live bindings of this node: event tracker and reactive pool. **/
    protected readonly live: LiveStorage;
    /**
     * Wraps an existing DOM node.
     * @param node - The node to wrap.
     */
    constructor(node: T);
    /** Whether the node is attached to the document. **/
    get isConnected(): boolean;
    /** The parent node of this node. **/
    get parent(): globalThis.Node | null;
    /** The child nodes of this node. **/
    get childNodes(): NodeListOf<globalThis.ChildNode>;
    /** The first child node of this node. **/
    get firstChild(): globalThis.Node | null;
    /** The last child node of this node. **/
    get lastChild(): globalThis.Node | null;
    /**
     * Appends one or more children to this node.
     * @param childList - The nodes to append.
     * @returns This node, for chaining.
     *
     * @example
     * ```ts
     * const parent = new Node(document.createElement('div'));
     * const child = new Node(document.createElement('span'));
     *
     * parent.append(child);
     * ```
     */
    append(...childList: Node.ValueType[]): this;
    /**
     * Appends this node to a parent.
     * @param parent - The parent node.
     * @returns This node, for chaining.
     *
     * @example
     * ```ts
     * const parent = new Node(document.createElement('div'));
     * const child = new Node(document.createElement('span'));
     *
     * child.appendTo(parent);
     * ```
     */
    appendTo(parent: Node.NodeType): this;
    /**
     * Replaces this node with another node.
     * @param newNode - The node that will replace this one.
     * @returns This node, for chaining.
     */
    replaceWith(newNode: Node.ValueType): this;
    /**
     * Removes this node from the DOM.
     * @returns This node, for chaining.
     */
    remove(): this;
    /**
     * Removes one or more children from this node.
     * @param childList - The nodes to remove.
     * @returns This node, for chaining.
     */
    removeChild(...childList: Node.NodeType[]): this;
    /**
     * Checks whether this node contains another node.
     * @param child - The node to check.
     * @returns True if this node contains the given node, false otherwise.
     */
    contains(child: Node.NodeType): boolean;
    /**
     * Adds an event listener to this node and tracks it for teardown.
     * @param name - The name of the event.
     * @param listener - The callback to execute.
     * @param options - The listener options.
     * @returns This node, for chaining.
     */
    on(name: string, listener: Node.Listener<T>, options?: EventTracker.Options): this;
    /**
     * Adds a one-time event listener to this node and tracks it for teardown.
     * @param name - The name of the event.
     * @param listener - The callback to execute.
     * @param options - The listener options.
     * @returns This node, for chaining.
     */
    once(name: string, listener: Node.Listener<T>, options?: EventTracker.Options): this;
    /**
     * Removes a previously added event listener.
     * @param name - The name of the event.
     * @param listener - The listener to remove.
     * @param options - The listener options.
     * @returns This node, for chaining.
     */
    off(name: string, listener: Node.Listener<T>, options?: EventTracker.Options): this;
    /**
     * Removes a previously added one-time event listener.
     * @param name - The name of the event.
     * @param listener - The listener to remove.
     * @param options - The listener options.
     * @returns This node, for chaining.
     */
    offOnce(name: string, listener: Node.Listener<T>, options?: EventTracker.Options): this;
    /**
     * Removes all tracked event listeners registered on this node.
     * @returns This node, for chaining.
     *
     * @remarks
     * This removes every listener added through {@link on} or {@link once}.
     */
    unbindAll(): this;
    /**
     * Unbinds the reactive bindings of a store, removing matching subscriptions.
     * @param store - The store to unbind.
     * @param filter - Optional type or predicate to select which bindings to detach.
     * @returns This node, for chaining.
     */
    offReactive(store: Store<any>, filter?: Reactive.Type | Reactive.Filter): this;
    /**
     * Removes all reactive subscriptions from this node.
     * @returns This node, for chaining.
     */
    private wrapListener;
    /**
     * Registers a reactive group under its store for teardown.
     * @param group - The reactive group to track.
     * @returns This node, for chaining.
     */
    private trackReactive;
    /**
     * Destroys the current resources and lifecycle of this node: detaches its event
     * listeners, destroys its live bindings (reactives) and releases its owned objects.
     *
     * @remarks `destroy()` terminates the current lifecycle resources of the node. It does not modify
     * the DOM; use {@link remove} for that. After `destroy()`, the node may receive new listeners,
     * reactives and owned objects. Note that DOM containment (`append`/`appendTo`) does not imply
     * ownership: appended children are neither owned nor destroyed automatically.
     * @returns A promise resolving once the live state and the owned resources are destroyed.
     */
    destroy(): Promise<void>;
    /**
     * Checks whether a given object is a Node wrapper.
     * @param object - The object to check.
     * @returns True if the object is a Node wrapper, false otherwise.
     */
    static isNode(object: unknown): object is Node<any>;
    /**
     * Checks whether a given object is a DOM node.
     * @param object - The object to check.
     * @returns True if the object is a DOM node, false otherwise.
     */
    static isNative(object: unknown): object is globalThis.Node;
    /**
     * Gets the native DOM node from a Node wrapper or appendable object.
     * @param node - The node to unwrap.
     * @returns The raw DOM node.
     */
    static getNativeNode(node: Node.NodeType): globalThis.Node;
}
export declare namespace Node {
    export import Tracker = EventTracker;
    namespace Listener {
        interface Listener<T extends globalThis.Node = globalThis.Node> {
            (this: Node<globalThis.Node>, event: Event): void;
        }
        interface ListenerObject<T extends globalThis.Node = globalThis.Node> {
            handleEvent: (this: Node<globalThis.Node>, event: Event) => void;
        }
    }
    type Listener<T extends globalThis.Node> = Listener.Listener<T> | Listener.ListenerObject<T>;
    /** The values accepted as children by a Node. **/
    type NodeType = Node<any> | IsAppendable | globalThis.Node;
    type ValueType = NodeType | Store<any> | string | number;
}
export default Node;
