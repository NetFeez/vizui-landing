/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Wraps an HTMLElement with a fluent, typed API.
 * @license Apache-2.0
 */
import { ELEMENT } from '../../support/symbols.js';
import Node from './Node.js';
import Store from '../../state/Store.js';
import Attribute from '../reactive/Attribute.js';
import DomObserver from './DomObserver.js';
const OBSERVER_MAP = Symbol('vizui.element/observer');
export class Element extends Node {
    static [OBSERVER_MAP] = new WeakMap();
    static body = new Element(document.body);
    static head = new Element(document.head);
    [ELEMENT] = true;
    /** The mutation/intersection observer bound to this element. **/
    observer;
    /**
     * Wraps an existing HTMLElement.
     * @param element - The element to wrap.
     * @throws When the value is not an HTMLElement.
     */
    constructor(element) {
        if (!(element instanceof HTMLElement))
            throw new Error('the element is not a HTMLElement');
        super(element);
        let observer = Element[OBSERVER_MAP].get(this.root);
        if (!observer)
            Element[OBSERVER_MAP].set(this.root, observer = new DomObserver(this.root));
        this.observer = observer;
    }
    /** The scroll height of the element in pixels. **/
    get scrollHeight() { return this.root.scrollHeight; }
    /** The scroll width of the element in pixels. **/
    get scrollWidth() { return this.root.scrollWidth; }
    /** The vertical scroll position in pixels. **/
    get scrollTop() { return this.root.scrollTop; }
    /** The vertical scroll position in pixels. **/
    set scrollTop(value) { this.root.scrollTop = value; }
    /** The visible height of the element in pixels. **/
    get clientHeight() { return this.root.clientHeight; }
    /** The visible width of the element in pixels. **/
    get clientWidth() { return this.root.clientWidth; }
    /** The layout height of the element in pixels. **/
    get offsetHeight() { return this.root.offsetHeight; }
    /** The layout width of the element in pixels. **/
    get offsetWidth() { return this.root.offsetWidth; }
    /** The class list of the element. **/
    get classList() { return this.root.classList; }
    /** The class attribute of the element. **/
    get class() { return this.root.className; }
    /** The class attribute of the element. **/
    set class(value) { this.root.className = value; }
    /** The inline style declaration of the element. **/
    get style() { return this.root.style; }
    /** The id attribute of the element. **/
    get id() { return this.root.id; }
    /** The id attribute of the element. **/
    set id(value) { this.root.id = value; }
    /** The text content of the element. **/
    get text() { return this.root.textContent ?? ''; }
    /** The text content of the element. **/
    set text(value) { this.root.textContent = value; }
    /** The HTML content of the element. **/
    get html() { return this.root.innerHTML; }
    /** The HTML content of the element. **/
    set html(value) { this.root.innerHTML = value; }
    /**
     * Sets the text content of the element.
     * @param text - The text to set.
     * @returns This element, for chaining.
     */
    setText(text) { this.root.textContent = text; return this; }
    /**
     * Sets the HTML content of the element.
     * @param html - The HTML to set.
     * @returns This element, for chaining.
     */
    setHtml(html) { this.root.innerHTML = html; return this; }
    /**
     * Sets the class attribute of the element.
     * @param className - The class to set.
     * @returns This element, for chaining.
     */
    setClass(className) { this.root.className = className; return this; }
    /**
     * Adds one or more classes to the element.
     * @param classList - The classes to add.
     * @returns This element, for chaining.
     */
    addClass(...classList) {
        classList = Element.sanitizeClassList(classList);
        this.root.classList.add(...classList);
        return this;
    }
    /**
     * Removes one or more classes from the element.
     * @param classList - The classes to remove.
     * @returns This element, for chaining.
     */
    removeClass(...classList) {
        classList = Element.sanitizeClassList(classList);
        this.root.classList.remove(...classList);
        return this;
    }
    /**
     * Toggles a class on the element.
     * @param className - The class to toggle.
     * @param force - Whether to force the class on or off.
     * @returns This element, for chaining.
     */
    toggleClass(className, force) { this.root.classList.toggle(className, force); return this; }
    /**
     * Animates the element with the Web Animations API.
     * @param keyframes - The keyframes of the animation.
     * @param options - The options of the animation.
     * @returns The animation created for the element.
     */
    animate(keyframes, options) {
        return this.root.animate(keyframes, options);
    }
    /**
     * Sets a single attribute.
     * @param name - The name of the attribute.
     * @param value - The value of the attribute.
     * @returns This element, for chaining.
     */
    setAttribute(name, value) {
        if (value instanceof Store)
            return this.bindAttribute(name, value);
        this.root.setAttribute(name, value);
        return this;
    }
    /**
     * Binds a reactive attribute to the element.
     * @param name - The name of the attribute.
     * @param store - The store to bind to the attribute.
     * @returns This element, for chaining.
     */
    bindAttribute(name, store) {
        this.live.register(new Attribute(store, this.root, name));
        return this;
    }
    /**
     * Unbinds a reactive attribute from the element.
     * @param store - The store to unbind from the attribute.
     * @returns This element, for chaining.
     */
    unbindAttribute(store) {
        this.live.unregister(store, 'attribute');
        return this;
    }
    /**
     * Gets the value of an attribute.
     * @param name - The name of the attribute.
     * @returns The value of the attribute, or null if it does not exist.
     */
    getAttribute(name) {
        return this.root.getAttribute(name);
    }
    /**
     * Sets multiple attributes at once.
     * @param attributes - The attributes to set.
     * @returns This element, for chaining.
     */
    setAttributes(attributes) {
        for (const [name, value] of Object.entries(attributes)) {
            this.setAttribute(name, String(value));
        }
        return this;
    }
    /**
     * Removes one or more attributes from this element.
     * @param names - The names of the attributes to remove.
     * @returns This element, for chaining.
     */
    removeAttribute(...names) {
        for (const name of names)
            this.root.removeAttribute(name);
        return this;
    }
    /**
     * Removes all child nodes of this element.
     * @returns This element, for chaining.
     */
    clean() {
        this.root.replaceChildren();
        return this;
    }
    /**
     * Gets a child element by its CSS selector.
     * @param selector - The CSS selector to use.
     * @returns The matching element, or null if none is found.
     */
    get(selector) {
        const element = this.root.querySelector(selector);
        return element ? new Element(element) : null;
    }
    /**
     * Gets all child elements matching a CSS selector.
     * @param selector - The CSS selector to use.
     * @returns An array of matching elements, or an empty array if none are found.
     */
    getAll(selector) {
        const elements = this.root.querySelectorAll(selector);
        return Array.from(elements).map((element) => new Element(element));
    }
    on(name, listener, options) {
        return super.on(name, listener, options);
    }
    once(name, listener, options) {
        return super.once(name, listener, options);
    }
    off(name, listener, options) {
        return super.off(name, listener, options);
    }
    offOnce(name, listener, options) {
        return super.offOnce(name, listener, options);
    }
    /**
     * Checks whether a given object is an Element wrapper.
     * @param object - The object to check.
     * @returns True if the object is an Element wrapper, false otherwise.
     */
    static isElement(object) {
        return object instanceof Element;
    }
    /**
     * Checks whether a given object is an HTML element.
     * @param object - The object to check.
     * @returns True if the object is an HTML element, false otherwise.
     */
    static isHtmlElement(object) {
        return object instanceof HTMLElement;
    }
    /**
     * Assigns creation options to an element.
     * @param element - The element to assign options to.
     * @param options - The options to assign.
     *
     * @remarks
     * Used internally by {@link Element.new}.
     */
    static assignCreationOptions(element, options) {
        if (Object.keys(options).length === 0)
            return;
        if (options.text !== undefined)
            element.text = options.text;
        if (options.html !== undefined)
            element.html = options.html;
        if (options.attributes)
            element.setAttributes(options.attributes);
        if (options.events)
            this.addEvents(element, options.events);
        if (options.childList)
            element.append(...options.childList);
    }
    static addEvents(element, events) {
        for (const [name, listener] of Object.entries(events)) {
            if (!listener)
                throw new Error('the event has no listener.');
            element.on(name, listener);
        }
    }
    static sanitizeClassList(classList) {
        return classList.map((entry) => entry.trim().split(/\s+/)).flat();
    }
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
    static get(selector) {
        const selection = document.querySelector(selector);
        return selection ? new Element(selection) : null;
    }
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
    static getAll(selector) {
        const selection = document.querySelectorAll(selector);
        return Array.from(selection).map((element) => new Element(element));
    }
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
    static new(tag, options = {}) {
        const root = document.createElement(tag);
        const element = new Element(root);
        this.assignCreationOptions(element, options);
        return element;
    }
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
    static create(tag, options = {}) {
        return this.new(tag, options);
    }
    /**
     * Creates a new element from a structure.
     * @param structure - The structure of the element.
     * @returns The new element.
     * @deprecated Use {@link Element.new} instead.
     */
    static structure(structure) {
        return this.new(structure.tag, { ...structure });
    }
}
export default Element;
//# sourceMappingURL=Element.js.map