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
import Component from '../../component/Component.js';
import Layout from '../../component/Layout.js';
import Rule from './Rule.js';
export class LayoutRule extends Rule {
    [RULE.LAYOUT] = true;
    identifier = 'layout';
    /**
     * Creates a layout route, suffixing the template with `/*` when missing.
     * @param template - The url template of the layout.
     * @param content - The layout component, or a factory producing it.
     * @param pipeline - The per-route pipeline.
     */
    constructor(template, content, pipeline = new Pipeline()) {
        template = template.endsWith('/*') ? template : template + '/*';
        super(template, content, pipeline);
    }
    /** The optional outlet of the layout: a selector, element or component. **/
    get outletSelector() {
        return this.vContent instanceof Layout || typeof this.vContent === 'function'
            ? undefined : this.vContent.outlet;
    }
    /**
     * Resolves the layout component instance, instantiating lazy factories.
     * @returns The resolved layout component.
     * @throws When the content does not produce a Component.
     */
    async resolve() {
        const content = this.vContent;
        const component = content instanceof Layout
            ? content
            : typeof content === 'function' ? content() : content.component;
        const resolved = typeof component === 'function' ? await component() : component;
        if (!(resolved instanceof Component))
            throw new Error(`[LayoutRule] Invalid layout for template "${this.vTemplate}": expected a Component, got ${typeof resolved}.`);
        return resolved;
    }
    /**
     * Guards against dispatching layouts as rules; layouts mount through the
     * router layout chain instead.
     * @throws Always, layouts are never executed as rules.
     */
    async exec() {
        throw new Error(`[LayoutRule] The layout for template "${this.vTemplate}" is mounted through the router layout chain, not executed as a rule.`);
    }
}
export default LayoutRule;
//# sourceMappingURL=LayoutRule.js.map