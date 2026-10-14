/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Base class to create typed components with lifecycle and teardown.
 * @license Apache-2.0
 */
import { APPENDABLE, COMPONENT, DESTROYABLE, IsComponent } from '../../support/Contracts.js';
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
export class Component extends Events {
    /** The shared stylesheet loader available to subclasses. **/
    static css = CSS;
    [COMPONENT] = true;
    [APPENDABLE] = true;
    [DESTROYABLE] = true;
    /** Whether the root element is attached to the document. **/
    get isConnected() { return this.root.isConnected; }
    /**
     * Appends and mounts the component into a parent, running the mount lifecycle.
     * @param parent - The parent to append to.
     * @returns This component, for chaining.
     */
    async appendTo(parent) {
        if (this.willMount)
            await this.willMount();
        this.root.appendTo(parent);
        if (this.onMount)
            await this.onMount();
        return this;
    }
    /**
     * Replaces this component with another element or component, running the
     * unmount lifecycle of this one and the mount lifecycle of the replacement.
     * @param element - The element or component to mount in place of this one.
     * @returns This component, for chaining.
     */
    async replaceWith(element) {
        if (this.onUnmount)
            await this.onUnmount();
        if (IsComponent(element)) {
            if (element.willMount)
                await element.willMount();
            this.root.replaceWith(element.root);
            if (element.onMount)
                await element.onMount();
        }
        else
            this.root.replaceWith(element);
        return this;
    }
    /**
     * Removes the component from the DOM and runs its unmount lifecycle.
     * @returns This component, for chaining.
     */
    async remove() {
        if (this.onUnmount)
            await this.onUnmount();
        this.root.remove();
        return this;
    }
    /**
     * Sets event listeners on the component based on an object of event props.
     * @param eventProps - An object where keys are event names prefixed with 'on:'
     * and values are the corresponding event listener functions.
     * @returns void
     */
    setEventProps(eventProps) {
        for (const [name, listener] of Object.entries(eventProps)) {
            if (!name.startsWith('on:'))
                continue;
            const event = name.slice(3);
            this.on(event, listener);
        }
    }
    /**
     * Destroys the component, cleaning up its resources and removing it from the DOM.
     * @returns void or a Promise resolving when the component is fully destroyed.
     */
    async destroy() {
        await this.root.destroy();
    }
    /**
     * Unmounts a component, running its unmount lifecycle and removing it from the DOM.
     * @param component - The component to unmount.
     * @returns void
     */
    static async unmount(component) {
        if (component.onUnmount)
            await component.onUnmount();
        component.root.remove();
    }
}
export default Component;
//# sourceMappingURL=Component.js.map