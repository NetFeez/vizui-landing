import Element from './core/element/Element.js';
import { Node } from './core/element/Node.js';
import Store from './state/Store.js';
import Component from './core/component/Component.js';
import View from './core/component/View.js';
import Layout from './core/component/Layout.js';
export declare class JSXRuntime {
    static jsx<T extends keyof Element.Type>(tag: T, attributes: JSXRuntime.jsx.IntrinsicElements[T] | null, ...childrenList: JSXRuntime.Child[]): Element<Element.Type[T]>;
    static jsx<Props, T extends Component>(tag: JSXRuntime.ComponentClass<Props, T>, attributes: JSXRuntime.Attributes<Props> | null, ...childrenList: JSXRuntime.Child[]): T;
    static jsx<Props>(tag: JSXRuntime.FunctionComponent<Props>, attributes: JSXRuntime.Attributes<Props> | null, ...childrenList: JSXRuntime.Child[]): Element<any>;
    static Fragment(attributes: JSXRuntime.Attributes | null, ...childrenList: JSXRuntime.Child[]): JSXRuntime.Child[];
    /** Whether a tag is a `Component` class (not a function component). **/
    static isComponentClass(tag: unknown): tag is JSXRuntime.ComponentClass;
    /** Instantiates a `Component` class tag, passing the merged attributes as props. **/
    static createComponent<Props, T extends Component>(tag: JSXRuntime.ComponentClass<Props, T>, props: JSXRuntime.Attributes<Props>): T;
    /** Whether a layout root contains its outlet region. **/
    static outletContains(root: Element<any>, outlet: Element<any> | Component): boolean;
    private static setAttributes;
    /** Resolves the children of an element: explicit children win over the `children` attribute, and nested arrays (fragments, mapped lists) are flattened. **/
    private static normalizeChildren;
    /** Recursively collects nested child arrays into a single flat list. **/
    private static flattenChildren;
    static isEventListener(listener: unknown): listener is EventListener;
    static isEventName<T extends HTMLElement>(name: string): name is keyof JSXRuntime.EventAttributes<T>;
    static isValidAttributeValue(value: unknown): value is JSXRuntime.AttributeValue;
}
export declare namespace JSXRuntime {
    type AttributeValue = Primitive | boolean | Store<string | null>;
    type Attributes<Props = Record<string, unknown>> = Props & {
        children?: Child | Child[];
    };
    type Primitive = string | number;
    type Child = Node.ValueType;
    type FunctionComponent<Props = Record<string, unknown>> = (props: Attributes<Props>) => Element<any>;
    type ComponentClass<Props = Record<string, unknown>, T extends Component = Component> = new (props?: Attributes<Props>) => T;
    type Tag = keyof jsx.IntrinsicElements | FunctionComponent | ComponentClass;
    type EventAttributes<T extends HTMLElement> = {
        [E in keyof HTMLElementEventMap as `on:${E}`]?: (this: T, event: HTMLElementEventMap[E]) => void;
    };
    type HTMLAttributes<T extends HTMLElement = HTMLElement> = EventAttributes<T> & {
        children?: Child | Child[];
        style?: string | Partial<CSSStyleDeclaration>;
        [attribute: string]: AttributeValue | Function | Partial<CSSStyleDeclaration> | Child | Child[] | null | undefined;
    };
    namespace jsx {
        type Child = JSXRuntime.Child;
        type Attributes<Props = Record<string, unknown>> = JSXRuntime.Attributes<Props>;
        type Primitive = JSXRuntime.Primitive;
        type Tag = JSXRuntime.Tag;
        type AttributeValue = JSXRuntime.AttributeValue;
        type EventAttributes<T extends HTMLElement> = JSXRuntime.EventAttributes<T>;
        type HTMLAttributes<T extends HTMLElement> = JSXRuntime.HTMLAttributes<T>;
        type ComponentClass<Props = Record<string, unknown>> = JSXRuntime.ComponentClass<Props>;
        type FunctionComponent<Props = Record<string, unknown>> = JSXRuntime.FunctionComponent<Props>;
        type Element = import('./core/element/Element.js').default<any>;
        type IntrinsicElements = {
            [tag in keyof HTMLElementTagNameMap]: HTMLAttributes<HTMLElementTagNameMap[tag]>;
        };
    }
}
export default JSXRuntime;
export import jsx = JSXRuntime.jsx;
export import JSX = JSXRuntime.jsx;
export import Fragment = JSXRuntime.Fragment;
export import jsxs = JSXRuntime.jsx;
import { IsView } from './support/Contracts.js';
/**
 * A `View` without class syntax: pages with lifecycle hooks but no `extends`.
 * @template Root - The root tag of the view, inferred from `root` when possible.
 */
export declare function view<Root extends Component.Type = 'div'>(options: view.Options<Root>): View<Root>;
export declare namespace view {
    interface Options<Root extends Component.Type = 'div'> {
        /** The root element of the view. **/
        root: Element<Component.ComponentElement<Root>>;
        load?(entry: IsView.Entry): void | Promise<void>;
        render?(data?: unknown): void | Promise<void>;
        willMount?(): void | Promise<void>;
        onMount?(): void | Promise<void>;
        onUnmount?(): void | Promise<void>;
    }
}
/**
 * A `Layout` without class syntax: an outlet embedded positionally in the root,
 * or injected through the factory form. The outlet must be a descendant of the
 * layout root; the helper validates it and throws otherwise.
 * @template Root - The root tag of the layout.
 */
export declare function layout<Root extends Component.Type = 'div'>(options: layout.Options<Root> | layout.Factory<Root>): Layout<Root>;
export declare namespace layout {
    interface Options<Root extends Component.Type = 'div'> {
        /** The root element of the layout. **/
        root: Element<Component.ComponentElement<Root>>;
        /** The region where routed content mounts; must be a child of `root`. **/
        outlet?: Element | Component;
        willMount?(): void | Promise<void>;
        onMount?(): void | Promise<void>;
        onUnmount?(): void | Promise<void>;
    }
    /** The context delivered to factory layouts, carrying the injected outlet. **/
    interface OutletContext {
        outlet: Element<any>;
    }
    /** Builds a layout from the injected outlet: `layout(({ outlet }) => ({ root: <div>{outlet}</div> }))`. **/
    type Factory<Root extends Component.Type = 'div'> = (context: OutletContext) => Options<Root>;
}
