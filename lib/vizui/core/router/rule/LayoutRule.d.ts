/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Route that mounts a layout Component. Layout templates are automatically
 * suffixed with `/*` so the layout covers every nested child path (RouterRule-style).
 * Layouts are matched by the router through the layout chain; they are never dispatched
 * as rules, so `exec` is a defensive guard.
 * @license Apache-2.0
 */
import { RULE } from '../../../support/symbols.js';
import Pipeline from '../pipeline/Pipeline.js';
import type Element from '../../element/Element.js';
import type Guard from '../pipeline/Guard.js';
import Component from '../../component/Component.js';
import Layout from '../../component/Layout.js';
import Rule from './Rule.js';
export declare class LayoutRule extends Rule<LayoutRule.Content> {
    [RULE.LAYOUT]: boolean;
    readonly identifier = "layout";
    /**
     * Creates a layout route, suffixing the template with `/*` when missing.
     * @param template - The url template of the layout.
     * @param content - The layout component, or a factory producing it.
     * @param pipeline - The per-route pipeline.
     */
    constructor(template: string, content: LayoutRule.Content, pipeline?: Pipeline);
    /** The optional outlet of the layout: a selector, element or component. **/
    get outletSelector(): string | Element | Component | undefined;
    /**
     * Resolves the layout component instance, instantiating lazy factories.
     * @returns The resolved layout component.
     * @throws When the content does not produce a Component.
     */
    resolve(): Promise<Component<any>>;
    /**
     * Guards against dispatching layouts as rules; layouts mount through the
     * router layout chain instead.
     * @throws Always, layouts are never executed as rules.
     */
    exec(): Promise<Guard.Result | undefined>;
}
export declare namespace LayoutRule {
    type ComponentFactory = () => Component | Promise<Component>;
    type LayoutFactory = () => Layout | Promise<Layout>;
    type Content = Layout | Configuration | LayoutFactory | ComponentFactory;
    /** The layout kinds a layout route accepts. **/
    interface Configuration {
        /** The layout component, or a factory producing it. **/
        component: Component | LayoutFactory | ComponentFactory;
        /** The layout outlet: a selector to resolve inside the root, or a direct element or component. **/
        outlet?: string | Element | Component;
    }
}
export default LayoutRule;
