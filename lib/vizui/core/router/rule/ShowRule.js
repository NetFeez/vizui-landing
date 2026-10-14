/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Route that mounts a View. The mount is performed by the router
 * renderer (inherited through the guard state) using the view content and the
 * optional declarative loader. Its `exec` runs the route pipeline and then mounts.
 * @license Apache-2.0
 */
import { ELEMENT, RULE } from '../../../support/symbols.js';
import { IsComponent, IsView } from '../../../support/Contracts.js';
import Pipeline from '../pipeline/Pipeline.js';
import Rule from './Rule.js';
export class ShowRule extends Rule {
    [RULE.SHOW] = true;
    identifier = 'show';
    /** The declarative loader declared with `load`, typed with the view data of the route. **/
    vLoader = null;
    /**
     * Creates a show route.
     * @param template - The url template of the route.
     * @param content - The view, or a factory producing it.
     * @param pipeline - The per-route pipeline.
     */
    constructor(template, content, pipeline = new Pipeline()) {
        super(template, content, pipeline);
    }
    /** The declarative loader declared with `.load(...)` when present. **/
    get loader() { return this.vLoader; }
    /**
     * Declares a loader for this route. When present it wins over `View.load`.
     * The loader return type is inferred from the data painted by the view of the route.
     * @param loader - The loader producing the data delivered to `View.render`.
     * @returns This route, for chaining.
     */
    load(loader) {
        this.vLoader = loader;
        return this;
    }
    /**
     * Resolves the view or element tree, instantiating lazy factories.
     * @returns The resolved view or element tree.
     * @throws When the content does not produce a View or Element.
     */
    async resolve() {
        const content = this.vContent;
        const resolved = typeof content === 'function' ? await content() : content;
        if (IsComponent(resolved) || ELEMENT in resolved)
            return resolved;
        throw new Error(`[ShowRule] The content of "${this.vTemplate}" must be a View, Element or lazy factory.`);
    }
    async exec(entry, state, target) {
        return await this.pipeline.run(entry, state, async (pipeState) => {
            const renderer = pipeState.renderer;
            if (!renderer)
                throw new Error(`[ShowRule] No renderer available to mount "${this.vTemplate}".`);
            const view = await this.resolve();
            if (IsView(view)) {
                if (this.vLoader) {
                    const data = await this.vLoader(entry);
                    if (view.render)
                        await view.render(data);
                }
                else if (view.load) {
                    await view.load(entry);
                    if (view.render)
                        await view.render();
                }
                else if (view.render)
                    await view.render();
            }
            renderer.mount(view, target);
        });
    }
}
export default ShowRule;
//# sourceMappingURL=ShowRule.js.map