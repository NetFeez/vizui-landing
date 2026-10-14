/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Base Route for the SPA router: URL matching engine (port of Vortez Rule),
 * per-rule guard pipeline and mount execution. Each concrete route implements `exec`
 * to run its own pipeline and mount its content, mirroring `Rule.exec` of Vortez.
 * @license Apache-2.0
 */
import { RULE } from '../../../support/symbols.js';
import Pipeline from '../pipeline/Pipeline.js';
import type Element from '../../element/Element.js';
import type Guard from '../pipeline/Guard.js';
import type Tracker from '../Tracker.js';
import type Router from '../Router.js';
import type RouterRule from './RouterRule.js';
export declare abstract class Rule<Content = unknown> {
    /** Collapses duplicate slashes when normalizing templates. **/
    protected static readonly MULTI_SLASH_REPLACER: RegExp;
    /** Trims a single leading and trailing slash when normalizing templates. **/
    protected static readonly RULE_NORMALIZER: RegExp;
    [RULE.BASE]: boolean;
    /** The mount kind of the rule. **/
    abstract readonly identifier: Rule.Identifier;
    /** The per-rule guard pipeline. **/
    readonly pipeline: Pipeline;
    /** The normalized url template. **/
    protected vTemplate: string;
    /** The compiled matching expression. **/
    protected vExpression: RegExp;
    /** The mount content of the rule. **/
    protected vContent: Content;
    /**
     * Creates a route.
     * @param template - The url template of the route.
     * @param content - The mount content of the route.
     * @param pipeline - The per-route pipeline.
     */
    constructor(template: string, content: Content, pipeline?: Pipeline);
    /** The normalized URL template (includes the router base when prefixed). **/
    get template(): string;
    /**
     * Replaces the url template, recompiling the matching expression.
     * @param template - The new template.
     */
    set template(template: string);
    /** The compiled template expression. **/
    get expression(): RegExp;
    /** The mount content associated with the route. **/
    get content(): Content;
    /**
     * Adds guards to this route's pipeline. They run after parent/global guards and
     * before the route is mounted. Mirrors `Rule.use` of Vortez.
     * @param items - The guards or pipelines to add.
     * @returns This route, for chaining.
     */
    use(...items: (Guard.Type | Guard.Function | Pipeline)[]): this;
    /**
     * Tests whether the URL matches this route's template.
     * @param url - The url to match.
     * @returns Whether the url matches the template.
     */
    test(url: string): boolean;
    /**
     * Extracts the named parameters from a matched URL.
     * @param path - The path to extract from.
     * @returns The extracted parameters.
     */
    params(path: string): Rule.Params;
    /**
     * Extracts the surplus (the `$surplus` group) from a matched URL.
     * @param path - The path to extract from.
     * @returns The surplus path, or an empty string.
     */
    surplus(path: string): string;
    /**
     * Executes this rule's guard pipeline and mounts its content. Mirrors `Rule.exec`
     * of Vortez: the router runs the global pipeline and calls `exec` as its destination.
     * @param entry - The route entry being navigated (carries inherited params).
     * @param state - The shared guard state.
     * @param target - The outlet where the route mounts its content.
     * @param tracker - The navigation tracker, when present.
     * @param path - The path level to match (the surplus inside delegations).
     * @returns A control result produced by the pipeline or content, if any.
     */
    abstract exec(entry: Router.Entry, state: Guard.State, target: Element, tracker?: Tracker, path?: string): Promise<Guard.Result | undefined>;
    /**
     * Normalizes a template: collapses duplicate slashes and guarantees a single
     * leading and no trailing slash.
     * @param template - The raw template.
     * @returns The normalized template.
     */
    protected static normalize(template: string): string;
    /**
     * Compiles a template into a matching RegExp. Supports `$param` / `:param`
     * (required), `$?param` / `:?param` (optional), `*` (wildcard/surplus) and
     * escaped special characters. Port verbatim from Vortez v6 Rule.create.
     * @param template - The normalized template.
     * @returns The compiled expression.
     */
    protected static create(template: string): RegExp;
}
export declare namespace Rule {
    /** The mount kinds a rule can declare. **/
    type Identifier = 'show' | 'layout' | 'socket' | 'router' | `custom-${string}`;
    /** The route parameters extracted from a url. **/
    interface Params {
        [name: string]: string | undefined;
    }
    /** Any rule kind, plain or delegating. **/
    type Any = Rule | RouterRule;
}
export default Rule;
