/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Rendering contract between the router and the DOM. The router
 * decides *what* to mount (routes, layouts, delegation); the renderer decides
 * *how* a component is placed and torn down. Kept behind an interface so tests
 * and alternative hosts can inject a fake renderer.
 * @license Apache-2.0
 */
import Element from '../element/Element.js';
import Component from '../component/Component.js';
export interface Renderer {
    /** The root outlet of the renderer, when it owns one. **/
    readonly outlet: Element | null;
    /**
     * Mounts a component into an outlet, tearing down the previous mount there.
     * @param component - The component to mount.
     * @param outlet - The outlet element to mount into.
     * @returns The outlet.
     */
    mount(component: Component<any> | Element, outlet: Element): Element;
    /**
     * Mounts an element tree into an outlet, tearing down the previous mount there.
     * Elements mount without lifecycle hooks (teardown is handled by `outlet.clean()`).
     * @param element - The element tree to mount.
     * @param outlet - The outlet element to mount into.
     * @returns The outlet.
     */
    /**
     * Tears down and cleans whatever is mounted in an outlet.
     * @param outlet - The outlet element to unmount.
     */
    unmount(outlet: Element): void;
    /**
     * Mounts a layout component into an outlet and returns the child outlet
     * element where nested content will mount. Reusing a mounted layout keeps its
     * state across nested navigations.
     * @param layout - The layout component.
     * @param outlet - The outlet the layout is mounted into.
    * @param selector - Optional outlet of the nested region: a selector to resolve
    * inside the layout root, a direct element or a component root.
     * @returns The child outlet element.
     */
    layout(layout: Component, outlet: Element, selector?: string | Element | Component): Element;
}
export declare class DomRenderer implements Renderer {
    /** The components currently mounted, keyed by their outlet. **/
    protected vMounts: WeakMap<Element<HTMLElement>, Component<HTMLElement, import("../../index.js").Events.EventMap>>;
    /** Cached Element wrappers, keyed by their raw DOM node. **/
    protected static vWrappers: WeakMap<HTMLElement, Element<HTMLElement>>;
    /**
     * Creates a DOM renderer. Mounts are tracked per outlet in a WeakMap so
     * unmounting never leaks listeners and concurrent outlets stay independent.
     * @param outlet - The root element the renderer mounts into by default.
     */
    constructor(
    /** The root element the renderer mounts into by default. **/
    outlet?: Element);
    /** The root element the renderer mounts into by default. **/
    readonly outlet: Element;
    /**
     * Widens a concrete Element to its base type for storage in base-typed fields.
     * @param element - The element to widen.
     * @returns The widened element.
     */
    protected static widened<Specific extends HTMLElement>(element: Element<Specific>): Element;
    /**
     * Returns the singleton Element wrapper for a raw DOM node, so mount
     * tracking stays stable when the same node is resolved repeatedly.
     * @param node - The raw DOM node.
     * @returns The cached wrapper, or a new one stored for later reuse.
     */
    protected static wrap(node: HTMLElement): Element;
    /**
     * Mounts a component into an outlet, tearing down the previous mount there.
     * @param component - The component to mount.
     * @param outlet - The outlet element to mount into.
     * @returns The outlet.
     */
    mount(component: Component<any>, outlet: Element): Element;
    /**
     * Tears down and cleans whatever is mounted in an outlet.
     * @param outlet - The outlet element to unmount.
     */
    unmount(outlet: Element): void;
    /**
     * Mounts a layout component into an outlet and returns the child outlet
     * element where nested content will mount. Reusing a mounted layout keeps
     * its state across nested navigation`s.
     * @param layout - The layout component.
     * @param outlet - The outlet the layout is mounted into.
     * @param selector - Optional outlet: a selector to resolve inside the layout
     * root, a direct element, or none to fall back to the layout's own outlet.
     * @returns The child outlet element.
     */
    layout(layout: Component, outlet: Element, selector?: string | Element | Component): Element;
    /**
     * Resolves the region where routed content mounts: an explicitly provided
     * outlet element wins, then a selector inside the layout root, then the
     * outlet the layout itself exposes, falling back to the layout root.
     * @param layout - The mounted layout component.
     * @param selector - The explicit outlet element or selector, if any.
     * @returns The outlet region.
     */
    protected region(layout: Component, selector?: string | Element | Component): Element;
    /** Converts a component outlet to the element it exposes. **/
    protected asElement(outlet: Element | Component): Element;
    /**
     * Finds or creates the child outlet element inside a layout region.
     * @param region - The region to resolve the outlet inside.
     * @returns The child outlet element.
     */
    protected childOutlet(region: Element): Element;
    /**
     * Finds the existing child outlet element inside a layout region.
     * @param region - The region to search.
     * @returns The child outlet element, or null when absent.
     */
    protected child(region: Element): Element | null;
    /**
     * Resolves a selector against a layout root.
     * @param root - The layout root element.
     * @param selector - The selector of the nested region.
     * @returns The resolved region element.
     * @throws When the selector matches nothing inside the layout.
     */
    protected resolve(root: Element, selector: string): Element;
}
export declare namespace Renderer { }
export default Renderer;
