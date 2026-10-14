/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Route that mounts a View. The mount is performed by the router
 * renderer (inherited through the guard state) using the view content and the
 * optional declarative loader. Its `exec` runs the route pipeline and then mounts.
 * @license Apache-2.0
 */
import { RULE } from '../../../support/symbols.js';
import Pipeline from '../pipeline/Pipeline.js';
import type Guard from '../pipeline/Guard.js';
import type Router from '../Router.js';
import Element from '../../element/Element.js';
import View from '../../component/View.js';
import Rule from './Rule.js';
export declare class ShowRule<C extends ShowRule.Content = ShowRule.Content> extends Rule<C> {
    [RULE.SHOW]: boolean;
    readonly identifier = "show";
    /** The declarative loader declared with `load`, typed with the view data of the route. **/
    protected vLoader: ShowRule.Loader<ShowRule.DataOf<C>> | null;
    /**
     * Creates a show route.
     * @param template - The url template of the route.
     * @param content - The view, or a factory producing it.
     * @param pipeline - The per-route pipeline.
     */
    constructor(template: string, content: C, pipeline?: Pipeline);
    /** The declarative loader declared with `.load(...)` when present. **/
    get loader(): ShowRule.Loader<ShowRule.DataOf<C>> | null;
    /**
     * Declares a loader for this route. When present it wins over `View.load`.
     * The loader return type is inferred from the data painted by the view of the route.
     * @param loader - The loader producing the data delivered to `View.render`.
     * @returns This route, for chaining.
     */
    load(loader: ShowRule.Loader<ShowRule.DataOf<C>>): this;
    /**
     * Resolves the view or element tree, instantiating lazy factories.
     * @returns The resolved view or element tree.
     * @throws When the content does not produce a View or Element.
     */
    resolve(): Promise<View<any, any, ShowRule.DataOf<C>> | Element>;
    exec(entry: Router.Entry, state: Guard.State, target: Element): Promise<Guard.Result | undefined>;
}
export declare namespace ShowRule {
    type ContentObject = View | Element;
    /** The content kinds a show route accepts: views, element trees or lazy factories. **/
    type Content = ContentObject | (() => ContentObject | Promise<ContentObject>);
    /** The data painted by the view of a show route, inferred from the view's
     * `render` signature or, failing that, its `RenderData` type argument. **/
    type DataOf<V> = V extends {
        render?(data: infer D, ...rest: never[]): unknown;
    } ? D | undefined : V extends View<infer T, infer E, infer D> ? D | undefined : V extends (...args: never[]) => infer R ? DataOf<Awaited<R>> : unknown;
    /** The loader producing the data delivered to the view of the route. **/
    type Loader<D> = (entry: Router.Entry) => D | Promise<D>;
}
export default ShowRule;
