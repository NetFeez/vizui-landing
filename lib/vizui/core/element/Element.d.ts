/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Wraps an HTMLElement with a fluent, typed API.
 * @license Apache-2.0
 */
import { ELEMENT } from '../../support/symbols.js';
import Node from './Node.js';
import Store from '../../state/Store.js';
import DomObserver from './DomObserver.js';
declare const OBSERVER_MAP: unique symbol;
export declare class Element<T extends Element.ExtendedHtmlElement = HTMLElement> extends Node<T> {
    static [OBSERVER_MAP]: Element.Storage.Observer;
    static body: Element<HTMLElement>;
    static head: Element<HTMLHeadElement>;
    readonly [ELEMENT] = true;
    /** The mutation/intersection observer bound to this element. **/
    readonly observer: DomObserver<T>;
    /**
     * Wraps an existing HTMLElement.
     * @param element - The element to wrap.
     * @throws When the value is not an HTMLElement.
     */
    constructor(element: T);
    /** The scroll height of the element in pixels. **/
    get scrollHeight(): number;
    /** The scroll width of the element in pixels. **/
    get scrollWidth(): number;
    /** The vertical scroll position in pixels. **/
    get scrollTop(): number;
    /** The vertical scroll position in pixels. **/
    set scrollTop(value: number);
    /** The visible height of the element in pixels. **/
    get clientHeight(): number;
    /** The visible width of the element in pixels. **/
    get clientWidth(): number;
    /** The layout height of the element in pixels. **/
    get offsetHeight(): number;
    /** The layout width of the element in pixels. **/
    get offsetWidth(): number;
    /** The class list of the element. **/
    get classList(): DOMTokenList;
    /** The class attribute of the element. **/
    get class(): string;
    /** The class attribute of the element. **/
    set class(value: string);
    /** The inline style declaration of the element. **/
    get style(): CSSStyleDeclaration;
    /** The id attribute of the element. **/
    get id(): string;
    /** The id attribute of the element. **/
    set id(value: string);
    /** The text content of the element. **/
    get text(): string;
    /** The text content of the element. **/
    set text(value: string);
    /** The HTML content of the element. **/
    get html(): string;
    /** The HTML content of the element. **/
    set html(value: string);
    /**
     * Sets the text content of the element.
     * @param text - The text to set.
     * @returns This element, for chaining.
     */
    setText(text: string): this;
    /**
     * Sets the HTML content of the element.
     * @param html - The HTML to set.
     * @returns This element, for chaining.
     */
    setHtml(html: string): this;
    /**
     * Sets the class attribute of the element.
     * @param className - The class to set.
     * @returns This element, for chaining.
     */
    setClass(className: string): this;
    /**
     * Adds one or more classes to the element.
     * @param classList - The classes to add.
     * @returns This element, for chaining.
     */
    addClass(...classList: string[]): this;
    /**
     * Removes one or more classes from the element.
     * @param classList - The classes to remove.
     * @returns This element, for chaining.
     */
    removeClass(...classList: string[]): this;
    /**
     * Toggles a class on the element.
     * @param className - The class to toggle.
     * @param force - Whether to force the class on or off.
     * @returns This element, for chaining.
     */
    toggleClass(className: string, force?: boolean): this;
    /**
     * Animates the element with the Web Animations API.
     * @param keyframes - The keyframes of the animation.
     * @param options - The options of the animation.
     * @returns The animation created for the element.
     */
    animate(keyframes: Keyframe[] | PropertyIndexedKeyframes, options?: KeyframeAnimationOptions): Animation;
    /**
     * Sets a single attribute.
     * @param name - The name of the attribute.
     * @param value - The value of the attribute.
     * @returns This element, for chaining.
     */
    setAttribute(name: string, value: string | Store<string | null>): this;
    /**
     * Binds a reactive attribute to the element.
     * @param name - The name of the attribute.
     * @param store - The store to bind to the attribute.
     * @returns This element, for chaining.
     */
    bindAttribute(name: string, store: Store<string | null>): this;
    /**
     * Unbinds a reactive attribute from the element.
     * @param store - The store to unbind from the attribute.
     * @returns This element, for chaining.
     */
    unbindAttribute(store: Store<string | null>): this;
    /**
     * Gets the value of an attribute.
     * @param name - The name of the attribute.
     * @returns The value of the attribute, or null if it does not exist.
     */
    getAttribute(name: string): string | null;
    /**
     * Sets multiple attributes at once.
     * @param attributes - The attributes to set.
     * @returns This element, for chaining.
     */
    setAttributes(attributes: Element.Attributes): this;
    /**
     * Removes one or more attributes from this element.
     * @param names - The names of the attributes to remove.
     * @returns This element, for chaining.
     */
    removeAttribute(...names: string[]): this;
    /**
     * Removes all child nodes of this element.
     * @returns This element, for chaining.
     */
    clean(): this;
    /**
     * Gets a child element by its CSS selector.
     * @param selector - The CSS selector to use.
     * @returns The matching element, or null if none is found.
     */
    get<T extends Element.Query.Extended>(selector: T): Element<Element.Query.Result<T>> | null;
    /**
     * Gets all child elements matching a CSS selector.
     * @param selector - The CSS selector to use.
     * @returns An array of matching elements, or an empty array if none are found.
     */
    getAll<T extends Element.Query.Extended>(selector: T): Element<Element.Query.Result<T>>[];
    /**
     * Adds an event listener to this element and tracks it for teardown.
     * @param name - The name of the event.
     * @param listener - The callback to execute.
     * @param options - The listener options.
     * @returns This element, for chaining.
     */
    on<E extends keyof Element.EventMap<T>>(name: E, listener: Element.EventMap<T>[E], options?: Node.Tracker.Options): this;
    on(name: string, listener: Node.Listener<T>, options?: Node.Tracker.Options): this;
    /**
     * Adds a one-time event listener to this element and tracks it for teardown.
     * @param name - The name of the event.
     * @param listener - The callback to execute.
     * @param options - The listener options.
     * @returns This element, for chaining.
     */
    once<E extends keyof Element.EventMap<T>>(name: E, listener: Element.EventMap<T>[E], options?: Node.Tracker.Options): this;
    once(name: string, listener: Node.Listener<T>, options?: Node.Tracker.Options): this;
    /**
     * Removes a previously added event listener.
     * @param name - The name of the event.
     * @param listener - The listener to remove.
     * @param options - The listener options.
     * @returns This element, for chaining.
     */
    off<E extends keyof Element.EventMap<T>>(name: E, listener: Element.EventMap<T>[E], options?: Node.Tracker.Options): this;
    off(name: string, listener: Node.Listener<T>, options?: Node.Tracker.Options): this;
    /**
     * Removes a previously added one-time event listener.
     * @param name - The name of the event.
     * @param listener - The listener to remove.
     * @param options - The listener options.
     * @returns This element, for chaining.
     */
    offOnce<E extends keyof Element.EventMap<T>>(name: E, listener: Element.EventMap<T>[E], options?: Node.Tracker.Options): this;
    offOnce(name: string, listener: Node.Listener<T>, options?: Node.Tracker.Options): this;
    /**
     * Checks whether a given object is an Element wrapper.
     * @param object - The object to check.
     * @returns True if the object is an Element wrapper, false otherwise.
     */
    static isElement(object: unknown): object is Element<any>;
    /**
     * Checks whether a given object is an HTML element.
     * @param object - The object to check.
     * @returns True if the object is an HTML element, false otherwise.
     */
    static isHtmlElement(object: unknown): object is HTMLElement;
    /**
     * Assigns creation options to an element.
     * @param element - The element to assign options to.
     * @param options - The options to assign.
     *
     * @remarks
     * Used internally by {@link Element.new}.
     */
    private static assignCreationOptions;
    /**
     * Adds multiple event listeners to an element.
     * @param element - The element to add events to.
     * @param events - The events to add.
     *
     * @remarks
     * Used internally by {@link Element.new}; not intended for direct use.
     */
    private static addEvents;
    private static sanitizeClassList;
    /**
     * Gets an element from the DOM by selector.
     * @param selector - The selector to use.
     * @returns The element, or null if not found.
     *
     * @example
     * ```ts
     * const div = Element.get<HTMLDivElement>('div#my-div');
     * const input = Element.get<HTMLInputElement>('input[name="my-input"]');
     * ```
     */
    static get<T extends Element.Query.Extended>(selector: T): Element<Element.Query.Result<T>> | null;
    /**
     * Gets all elements from the DOM by selector.
     * @param selector - The selector to use.
     * @returns An array of elements, or an empty array if none are found.
     *
     * @example
     * ```ts
     * const divs = Element.getAll<HTMLDivElement>('div.my-class');
     * const inputs = Element.getAll<HTMLInputElement>('input[type="text"]');
     * ```
     */
    static getAll<T extends Element.Query.Extended>(selector: T): Element<Element.Query.Result<T>>[];
    /**
     * Creates a new element.
     * @param tag - The type of element to create.
     * @param options - The options to apply to the element.
     * @returns The new element.
     *
     * @example
     * ```ts
     * const div = Element.new('div', {
     *     text: 'Hello, world!',
     *     attributes: {
     *         id: 'my-div',
     *         class: 'my-class',
     *         other: 'value'
     *     }
     * });
     * ```
     */
    static new<T extends keyof Element.Type>(tag: T, options?: Element.CreationOptions<Element.Type[T]>): Element<Element.Type[T]>;
    /**
     * Creates a new element.
     * @param tag - The type of element to create.
     * @param options - The options to apply to the element.
     * @returns The new element.
     *
     * @example
     * ```ts
     * const div = Element.create('div', {
     *     text: 'Hello, world!',
     *     attributes: {
     *         id: 'my-div',
     *         class: 'my-class',
     *         other: 'value'
     *     }
     * });
     * ```
     */
    static create<T extends keyof Element.Type>(tag: T, options?: Element.CreationOptions<Element.Type[T]>): Element<Element.Type[T]>;
    /**
     * Creates a new element from a structure.
     * @param structure - The structure of the element.
     * @returns The new element.
     * @deprecated Use {@link Element.new} instead.
     */
    static structure<T extends keyof Element.Type>(structure: Element.Structure<T>): Element<Element.Type[T]>;
}
export declare namespace Element {
    namespace Storage {
        type Observer = WeakMap<HTMLElement, DomObserver<any>>;
    }
    interface ExtendedHtmlElement extends HTMLElement {
    }
    /** The typed event listener map of an HTMLElement. **/
    type EventMap<T extends HTMLElement> = {
        [Key in keyof HTMLElementEventMap]: (this: Element<T>, event: HTMLElementEventMap[Key]) => void;
    };
    namespace EventMap {
        /** Untyped listeners keyed by arbitrary event names. **/
        interface Generics<T extends HTMLElement> {
            [key: string]: Node.Listener<T>;
        }
    }
    /** Attribute values keyed by name. **/
    interface Attributes {
        [key: string]: string | number | boolean;
    }
    /** Maps a tag name to its concrete HTMLElement type. **/
    type Type = HTMLElementTagNameMap;
    namespace Query {
        type Selector = keyof Type;
        type Extended = Selector | (string & {});
        type Result<T extends Extended> = T extends Selector ? Type[T] : HTMLElement;
    }
    /** The children accepted by an Element. **/
    type ElementType = Element<any> | Node.NodeType;
    /** The values that can be assigned to an Element. **/
    type ValueType = Element<any> | Node.ValueType;
    /** The options applied to an element at creation time. **/
    interface CreationOptions<T extends HTMLElement> {
        /**
         * The text content of the element.
         * @default undefined
         * @remarks If html is set, text will be ignored.
         */
        text?: string;
        /**
         * The HTML content of the element.
         * @default undefined
         * @remarks If html is set, text will be ignored.
         */
        html?: string;
        /**
         * The attributes to set on the element.
         * @default undefined
         */
        attributes?: Element.Attributes;
        /**
         * The events to add to the element.
         * @default undefined
         */
        events?: Partial<Element.EventMap<T>>;
        /**
         * The children to append to the element.
         * @default undefined
         */
        childList?: Array<Element.ElementType>;
    }
    /** The deprecated structural declaration of an element. **/
    interface Structure<T extends keyof Element.Type> extends CreationOptions<Element.Type[T]> {
        tag: T;
    }
}
export default Element;
