/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Wraps a DOM Node with a fluent, typed API.
 * @license Apache-2.0
 */
import { DESTROYABLE, NODE } from '../../support/symbols.js';
import { APPENDABLE, IsAppendable } from '../../support/Contracts.js';
import LiveStorage from '../LiveStorage.js';
import Ownership from '../../support/Ownership.js';
import EventTracker from './EventTracker.js';
import NodeGroup from '../reactive/NodeGroup.js';
import Store from '../../state/Store.js';
export class Node extends Ownership {
    [DESTROYABLE] = true;
    [APPENDABLE] = true;
    [NODE] = true;
    /** The wrapped DOM node. **/
    root;
    /** The live bindings of this node: event tracker and reactive pool. **/
    live;
    /**
     * Wraps an existing DOM node.
     * @param node - The node to wrap.
     */
    constructor(node) {
        super();
        if (!Node.isNative(node))
            throw new Error('the node is not a Node');
        this.root = node;
        this.live = LiveStorage.of(this.root);
    }
    /** Whether the node is attached to the document. **/
    get isConnected() { return this.root.isConnected; }
    /** The parent node of this node. **/
    get parent() { return this.root.parentNode; }
    /** The child nodes of this node. **/
    get childNodes() { return this.root.childNodes; }
    /** The first child node of this node. **/
    get firstChild() { return this.root.firstChild; }
    /** The last child node of this node. **/
    get lastChild() { return this.root.lastChild; }
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
    append(...childList) {
        for (const child of childList) {
            if (IsAppendable(child)) {
                this.root.appendChild(Node.getNativeNode(child));
                continue;
            }
            if (child instanceof Store) {
                const group = new NodeGroup(child);
                group.appendTo(this.root);
                this.trackReactive(group);
                continue;
            }
            this.root.appendChild(new Text(String(child)));
        }
        return this;
    }
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
    appendTo(parent) {
        const raw = Node.getNativeNode(parent);
        raw.appendChild(this.root);
        return this;
    }
    /**
     * Replaces this node with another node.
     * @param newNode - The node that will replace this one.
     * @returns This node, for chaining.
     */
    replaceWith(newNode) {
        if (!this.root.parentNode)
            throw new Error('the node has no parent');
        if (newNode instanceof Store) {
            const group = new NodeGroup(newNode);
            const parent = this.root.parentNode;
            const reference = this.root.nextSibling;
            parent.removeChild(this.root);
            group.appendTo(parent, reference);
            this.trackReactive(group);
            return this;
        }
        let raw;
        if (IsAppendable(newNode))
            raw = Node.getNativeNode(newNode);
        else
            raw = new Text(String(newNode));
        this.root.parentNode.replaceChild(raw, this.root);
        return this;
    }
    /**
     * Removes this node from the DOM.
     * @returns This node, for chaining.
     */
    remove() {
        if (!this.root.parentNode)
            return this;
        this.root.parentNode.removeChild(this.root);
        return this;
    }
    /**
     * Removes one or more children from this node.
     * @param childList - The nodes to remove.
     * @returns This node, for chaining.
     */
    removeChild(...childList) {
        const rawList = childList.map(Node.getNativeNode);
        for (const child of rawList)
            this.root.removeChild(child);
        return this;
    }
    /**
     * Checks whether this node contains another node.
     * @param child - The node to check.
     * @returns True if this node contains the given node, false otherwise.
     */
    contains(child) {
        const raw = Node.getNativeNode(child);
        return this.root.contains(raw);
    }
    /**
     * Adds an event listener to this node and tracks it for teardown.
     * @param name - The name of the event.
     * @param listener - The callback to execute.
     * @param options - The listener options.
     * @returns This node, for chaining.
     */
    on(name, listener, options) {
        const wrapped = this.wrapListener(listener);
        this.live.tracker.add({ name: name, listener, wrapped, options });
        this.root.addEventListener(name, wrapped, options);
        return this;
    }
    /**
     * Adds a one-time event listener to this node and tracks it for teardown.
     * @param name - The name of the event.
     * @param listener - The callback to execute.
     * @param options - The listener options.
     * @returns This node, for chaining.
     */
    once(name, listener, options) {
        const listenerOptions = !options || typeof options === 'boolean'
            ? { once: true }
            : { ...options, once: true };
        const wrapped = this.wrapListener(listener);
        this.live.tracker.add({ name: name, listener, wrapped, options: listenerOptions });
        this.root.addEventListener(name, wrapped, listenerOptions);
        return this;
    }
    /**
     * Removes a previously added event listener.
     * @param name - The name of the event.
     * @param listener - The listener to remove.
     * @param options - The listener options.
     * @returns This node, for chaining.
     */
    off(name, listener, options) {
        const entry = this.live.tracker.find({ name, listener, options });
        if (!entry)
            return this;
        this.root.removeEventListener(name, entry.wrapped || entry.listener, options);
        this.live.tracker.delete(entry);
        return this;
    }
    /**
     * Removes a previously added one-time event listener.
     * @param name - The name of the event.
     * @param listener - The listener to remove.
     * @param options - The listener options.
     * @returns This node, for chaining.
     */
    offOnce(name, listener, options) {
        const listenerOptions = !options || typeof options === 'boolean'
            ? { once: true }
            : { ...options, once: true };
        this.off(name, listener, listenerOptions);
        return this;
    }
    /**
     * Removes all tracked event listeners registered on this node.
     * @returns This node, for chaining.
     *
     * @remarks
     * This removes every listener added through {@link on} or {@link once}.
     */
    unbindAll() {
        for (const entry of this.live.tracker.entries)
            this.root.removeEventListener(entry.name, entry.wrapped || entry.listener, entry.options);
        this.live.tracker.delete();
        return this;
    }
    /**
     * Unbinds the reactive bindings of a store, removing matching subscriptions.
     * @param store - The store to unbind.
     * @param filter - Optional type or predicate to select which bindings to detach.
     * @returns This node, for chaining.
     */
    offReactive(store, filter) {
        this.live.unregister(store, filter);
        return this;
    }
    /**
     * Removes all reactive subscriptions from this node.
     * @returns This node, for chaining.
     */
    wrapListener(listener) {
        if (typeof listener === 'function')
            return (...args) => listener.call(this, ...args);
        return {
            ...listener,
            handleEvent: (event) => listener.handleEvent.call(this, event)
        };
    }
    /**
     * Registers a reactive group under its store for teardown.
     * @param group - The reactive group to track.
     * @returns This node, for chaining.
     */
    trackReactive(group) {
        this.live.register(group);
        return this;
    }
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
    async destroy() {
        await this.live.destroy();
        await super.destroy();
    }
    /**
     * Checks whether a given object is a Node wrapper.
     * @param object - The object to check.
     * @returns True if the object is a Node wrapper, false otherwise.
     */
    static isNode(object) {
        return object instanceof Node;
    }
    /**
     * Checks whether a given object is a DOM node.
     * @param object - The object to check.
     * @returns True if the object is a DOM node, false otherwise.
     */
    static isNative(object) {
        return object instanceof globalThis.Node;
    }
    /**
     * Gets the native DOM node from a Node wrapper or appendable object.
     * @param node - The node to unwrap.
     * @returns The raw DOM node.
     */
    static getNativeNode(node) {
        if (Node.isNative(node))
            return node;
        if (Node.isNode(node))
            return node.root;
        if (IsAppendable(node))
            return Node.getNativeNode(node.root);
        throw new Error('The node is not a valid DOM node.');
    }
}
(function (Node) {
    Node.Tracker = EventTracker;
})(Node || (Node = {}));
export default Node;
//# sourceMappingURL=Node.js.map