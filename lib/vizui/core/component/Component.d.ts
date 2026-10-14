/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Base class to create typed components with lifecycle and teardown.
 * @license Apache-2.0
 */
import { APPENDABLE, COMPONENT, DESTROYABLE, IsComponent } from '../../support/Contracts.js';
import Element from '../element/Element.js';
import Events from '../../events/Events.js';
import CSS from '../../support/CSS.js';
/**
 * Base class to create typed components with lifecycle and teardown.
 * @template T - The type of the root element of the component. Can be either
 * an HTMLElement type or an `Element.Type` key.
 * @template EventMap - The type of the event map for the component.
 *
 * @example
 * ```ts
 * // Create a new component
 * //
 * // Method 1. Auto inferred
 * class MyComponent extends Component<'div'> {
 *     static { this.css.load('my-component.css', import.meta); }
 *     public root = Element.new('div');
 * }
 *
 * // Method 2. Explicit type
 * class MyComponent extends Component<'div'> {
 *     static { this.css.load('my-component.css', import.meta); }
 *
 *     public root: Element<Element.Type['div']>;                 // 1. Element.Type
 *     public root: Element<HTMLDivElement>;                      // 2. HTMLElement
 *     public root: Element<Component.ComponentElement<'div'>>;   // 3. ComponentElement
 *
 *     public constructor() {
 *         super();
 *         this.root = Element.new('div');
 *     }
 * }
 *
 * // `ComponentElement<E>` normalizes both supported forms of `E`
 * // to the corresponding HTMLElement type:
 * //
 * // Component<'div'>
 * //   -> ComponentElement<'div'>
 * //   -> Element.Type['div']
 * //   -> HTMLDivElement
 * //
 * // Component<HTMLDivElement>
 * //   -> ComponentElement<HTMLDivElement>
 * //   -> HTMLDivElement
 * //
 * // Therefore, both forms produce the same root type:
 * //
 * // Component<'div'>          -> root: Element<HTMLDivElement>
 * // Component<HTMLDivElement> -> root: Element<HTMLDivElement>
 * ```
 */
export declare abstract class Component<T extends HTMLElement | keyof Element.Type = HTMLElement, EventMap extends Events.EventMap = Events.EventMap> extends Events<EventMap> implements IsComponent {
    /** The shared stylesheet loader available to subclasses. **/
    protected static readonly css: typeof CSS;
    readonly [COMPONENT] = true;
    readonly [APPENDABLE] = true;
    readonly [DESTROYABLE] = true;
    /** The root element of the component. **/
    abstract readonly root: Element<Component.ComponentElement<T>>;
    /** Whether the root element is attached to the document. **/
    get isConnected(): boolean;
    willMount?(): void | Promise<void>;
    onMount?(): void | Promise<void>;
    onUnmount?(): void | Promise<void>;
    /**
     * Appends and mounts the component into a parent, running the mount lifecycle.
     * @param parent - The parent to append to.
     * @returns This component, for chaining.
     */
    appendTo(parent: Component.ComponentType): Promise<this>;
    /**
     * Replaces this component with another element or component, running the
     * unmount lifecycle of this one and the mount lifecycle of the replacement.
     * @param element - The element or component to mount in place of this one.
     * @returns This component, for chaining.
     */
    replaceWith(element: Component.ComponentType): Promise<this>;
    /**
     * Removes the component from the DOM and runs its unmount lifecycle.
     * @returns This component, for chaining.
     */
    remove(): Promise<this>;
    /**
     * Sets event listeners on the component based on an object of event props.
     * @param eventProps - An object where keys are event names prefixed with 'on:'
     * and values are the corresponding event listener functions.
     * @returns void
     */
    protected setEventProps(eventProps: Component.EventProps<EventMap>): void;
    /**
     * Destroys the component, cleaning up its resources and removing it from the DOM.
     * @returns void or a Promise resolving when the component is fully destroyed.
     */
    destroy(): Promise<void>;
    /**
     * Unmounts a component, running its unmount lifecycle and removing it from the DOM.
     * @param component - The component to unmount.
     * @returns void
     */
    static unmount(component: Component<any>): Promise<void>;
}
export declare namespace Component {
    type EventProps<E extends Events.EventMap> = {
        [name in keyof E as name extends string ? `on:${name}` : never]?: Events.Listener<E[name]>;
    };
    type Type = keyof Element.Type | HTMLElement;
    /** Normalizes the supported root element declarations to their HTMLElement type. **/
    type ComponentElement<E extends Component.Type> = E extends HTMLElement ? E : E extends keyof Element.Type ? Element.Type[E] : never;
    /** The types of components and elements that can be used as the root of a component. **/
    type ComponentType = Component<any> | Element.ElementType;
    /** The child kinds a component accepts: other components, elements or HTMLElements. **/
    type ValueType = Component | Element.ValueType;
}
export default Component;
