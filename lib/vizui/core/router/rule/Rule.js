/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Base Route for the SPA router: URL matching engine (port of Vortez Rule),
 * per-rule guard pipeline and mount execution. Each concrete route implements `exec`
 * to run its own pipeline and mount its content, mirroring `Rule.exec` of Vortez.
 * @license Apache-2.0
 */
import { RULE } from '../../../support/symbols.js';
import Pipeline from '../pipeline/Pipeline.js';
export class Rule {
    /** Collapses duplicate slashes when normalizing templates. **/
    static MULTI_SLASH_REPLACER = /\/+/g;
    /** Trims a single leading and trailing slash when normalizing templates. **/
    static RULE_NORMALIZER = /^\/?(.+?)\/?$/;
    [RULE.BASE] = true;
    /** The per-rule guard pipeline. **/
    pipeline;
    /** The normalized url template. **/
    vTemplate;
    /** The compiled matching expression. **/
    vExpression;
    /** The mount content of the rule. **/
    vContent;
    /**
     * Creates a route.
     * @param template - The url template of the route.
     * @param content - The mount content of the route.
     * @param pipeline - The per-route pipeline.
     */
    constructor(template, content, pipeline = new Pipeline()) {
        this.vTemplate = template = Rule.normalize(template);
        this.vExpression = Rule.create(template);
        this.vContent = content;
        this.pipeline = pipeline;
    }
    /** The normalized URL template (includes the router base when prefixed). **/
    get template() { return this.vTemplate; }
    /**
     * Replaces the url template, recompiling the matching expression.
     * @param template - The new template.
     */
    set template(template) {
        this.vTemplate = template = Rule.normalize(template);
        this.vExpression = Rule.create(template);
    }
    /** The compiled template expression. **/
    get expression() { return this.vExpression; }
    /** The mount content associated with the route. **/
    get content() { return this.vContent; }
    /**
     * Adds guards to this route's pipeline. They run after parent/global guards and
     * before the route is mounted. Mirrors `Rule.use` of Vortez.
     * @param items - The guards or pipelines to add.
     * @returns This route, for chaining.
     */
    use(...items) {
        this.pipeline.use(...items);
        return this;
    }
    /**
     * Tests whether the URL matches this route's template.
     * @param url - The url to match.
     * @returns Whether the url matches the template.
     */
    test(url) { return this.vExpression.test(url); }
    /**
     * Extracts the named parameters from a matched URL.
     * @param path - The path to extract from.
     * @returns The extracted parameters.
     */
    params(path) {
        const match = this.vExpression.exec(path);
        return match?.groups ? { ...match.groups } : {};
    }
    /**
     * Extracts the surplus (the `$surplus` group) from a matched URL.
     * @param path - The path to extract from.
     * @returns The surplus path, or an empty string.
     */
    surplus(path) {
        const { $surplus = '' } = this.params(path);
        return $surplus;
    }
    /**
     * Normalizes a template: collapses duplicate slashes and guarantees a single
     * leading and no trailing slash.
     * @param template - The raw template.
     * @returns The normalized template.
     */
    static normalize(template) {
        const normalized = template
            .replace(this.MULTI_SLASH_REPLACER, '/')
            .replace(this.RULE_NORMALIZER, '/$1');
        return normalized === '//' ? '/' : normalized;
    }
    /**
     * Compiles a template into a matching RegExp. Supports `$param` / `:param`
     * (required), `$?param` / `:?param` (optional), `*` (wildcard/surplus) and
     * escaped special characters. Port verbatim from Vortez v6 Rule.create.
     * @param template - The normalized template.
     * @returns The compiled expression.
     */
    static create(template) {
        const validators = {
            paramRequired: /^(?:\:|\$)(?<param>(?!\$).+)$/,
            paramOptional: /^(?:\:|\$)\?(?<param>(?!\$).+)$/,
            escape: /\\(?![\$\[\]\*\+\?\.\(\)\{\}\^\|\-])|(?<!\\)[\$\[\]\*\+\?\.\(\)\{\}\^\|\-]/gi,
        };
        const zones = template.split('/').slice(1);
        let generated = '^';
        for (let index = 0; index < zones.length; index++) {
            const zone = zones[index];
            if (zone == '*') {
                const isLast = index == (zones.length - 1);
                generated += isLast ? '(?<$surplus>/.+)?' : '(?:/[^/]+)';
                continue;
            }
            const optional = zone.match(validators.paramOptional);
            if (optional && optional.groups) {
                const param = optional.groups['param'].replace(validators.escape, '');
                generated += `(?:/(?<${param}>[^/]+))?`;
                continue;
            }
            const required = zone.match(validators.paramRequired);
            if (required && required.groups) {
                const param = required.groups['param'].replace(validators.escape, '');
                generated += `/(?<${param}>[^/]+)`;
                continue;
            }
            generated += `/${zone}`;
        }
        return new RegExp(`${generated}/?$`);
    }
}
export default Rule;
//# sourceMappingURL=Rule.js.map