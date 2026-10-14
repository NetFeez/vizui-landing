import Element from './core/element/Element.js';
import Store from './state/Store.js';
import Component from './core/component/Component.js';
import View from './core/component/View.js';
import Layout from './core/component/Layout.js';
export class JSXRuntime {
    static jsx(tag, attributes, ...childrenList) {
        const children = JSXRuntime.normalizeChildren(childrenList, attributes?.children);
        if (typeof tag === 'function') {
            if (JSXRuntime.isComponentClass(tag))
                return JSXRuntime.createComponent(tag, { ...attributes, children });
            return tag({ ...attributes, children });
        }
        const element = Element.create(tag);
        if (attributes)
            JSXRuntime.setAttributes(element, attributes);
        element.append(...children);
        return element;
    }
    static Fragment(attributes, ...childrenList) {
        const children = [];
        if (attributes?.children !== undefined) {
            children.push(...(Array.isArray(attributes.children) ? attributes.children : [attributes.children]));
        }
        children.push(...childrenList);
        return children;
    }
    /** Whether a tag is a `Component` class (not a function component). **/
    static isComponentClass(tag) {
        return typeof tag === 'function'
            && tag.prototype instanceof Component;
    }
    /** Instantiates a `Component` class tag, passing the merged attributes as props. **/
    static createComponent(tag, props) {
        return new tag(props);
    }
    /** Whether a layout root contains its outlet region. **/
    static outletContains(root, outlet) {
        return root.contains(IsComponent(outlet) ? outlet.root : outlet);
    }
    static setAttributes(element, attributes) {
        const { style, children, ...rest } = attributes;
        if (style) {
            if (typeof style === 'string')
                element.setAttribute('style', style);
            else
                Object.assign(element.style, style);
        }
        for (const [key, value] of Object.entries(rest)) {
            if (JSXRuntime.isEventName(key)) {
                if (JSXRuntime.isEventListener(value))
                    element.on(key.slice(3), value);
                continue;
            }
            if (value instanceof Store) {
                element.bindAttribute(key, value);
                continue;
            }
            if (!JSXRuntime.isValidAttributeValue(value))
                throw new Error(`[vizui] attribute "${key}" received a ${typeof value} value, which is only supported on event ("on:") names or "style".`);
            if (value === null || value === undefined || value === false)
                element.removeAttribute(key);
            else if (value === true)
                element.setAttribute(key, '');
            else if (typeof value === 'number')
                element.setAttribute(key, String(value));
            else
                element.setAttribute(key, value);
        }
    }
    /** Resolves the children of an element: explicit children win over the `children` attribute, and nested arrays (fragments, mapped lists) are flattened. **/
    static normalizeChildren(childrenList, attributeChildren) {
        const source = childrenList.length > 0
            ? childrenList
            : attributeChildren === undefined
                ? []
                : Array.isArray(attributeChildren)
                    ? attributeChildren
                    : [attributeChildren];
        return JSXRuntime.flattenChildren(source);
    }
    /** Recursively collects nested child arrays into a single flat list. **/
    static flattenChildren(children, flat = []) {
        if (Array.isArray(children)) {
            for (const child of children)
                JSXRuntime.flattenChildren(child, flat);
            return flat;
        }
        flat.push(children);
        return flat;
    }
    static isEventListener(listener) {
        return typeof listener === 'function';
    }
    static isEventName(name) {
        return name.length > 3 && name.startsWith('on:');
    }
    static isValidAttributeValue(value) {
        if (value === null || value === undefined)
            return true;
        if (value instanceof Store)
            return true;
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')
            return true;
        return false;
    }
}
export default JSXRuntime;
export var jsx = JSXRuntime.jsx;
export var JSX = JSXRuntime.jsx;
export var Fragment = JSXRuntime.Fragment;
export var jsxs = JSXRuntime.jsx;
import { IsComponent } from './support/Contracts.js';
/**
 * A `View` without class syntax: pages with lifecycle hooks but no `extends`.
 * @template Root - The root tag of the view, inferred from `root` when possible.
 */
export function view(options) {
    return new AnonymousView(options);
}
/**
 * A `Layout` without class syntax: an outlet embedded positionally in the root,
 * or injected through the factory form. The outlet must be a descendant of the
 * layout root; the helper validates it and throws otherwise.
 * @template Root - The root tag of the layout.
 */
export function layout(options) {
    const injected = { outlet: Element.new('div') };
    const resolved = typeof options === 'function'
        ? { ...options(injected), outlet: injected.outlet }
        : options;
    const outlet = resolved.outlet ?? injected.outlet;
    if (!JSXRuntime.outletContains(resolved.root, outlet))
        throw new Error('[vizui] layout(): the outlet must be embedded inside the layout root.');
    return new AnonymousLayout({ ...resolved, outlet });
}
class AnonymousView extends View {
    root;
    constructor(options) {
        super();
        this.root = options.root;
        this.load = options.load;
        this.render = options.render;
        this.willMount = options.willMount;
        this.onMount = options.onMount;
        this.onUnmount = options.onUnmount;
    }
}
class AnonymousLayout extends Layout {
    root;
    outlet;
    constructor(options) {
        super();
        this.root = options.root;
        this.outlet = options.outlet;
        this.willMount = options.willMount;
        this.onMount = options.onMount;
        this.onUnmount = options.onUnmount;
    }
}
//# sourceMappingURL=jsx-runtime.js.map