/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Route for custom mount kinds. The general form behind `action()`, the
 * typed shortcuts and any developer-defined mount kind. Its content runs after the
 * route pipeline and may return a control result (redirect/abort/error).
 * @license Apache-2.0
 */
import { RULE } from '../../../support/symbols.js';
import Pipeline from '../pipeline/Pipeline.js';
import type Guard from '../pipeline/Guard.js';
import type Router from '../Router.js';
import Rule from './Rule.js';
export declare class ActionRule extends Rule<ActionRule.Content> {
    /** The custom mount kind of the rule. **/
    readonly kind: string;
    [RULE.CUSTOM]: boolean;
    /**
     * Creates a custom route.
     * @param kind - The custom mount kind.
     * @param template - The url template of the route.
     * @param content - The content executed when the route matches.
     * @param pipeline - The per-route pipeline.
     */
    constructor(
    /** The custom mount kind of the rule. **/
    kind: string, template: string, content: ActionRule.Content, pipeline?: Pipeline);
    /** The mount kind of the rule. **/
    get identifier(): Rule.Identifier;
    exec(entry: Router.Entry, state: Guard.State): Promise<Guard.Result | undefined>;
}
export declare namespace ActionRule {
    /** The custom content executed when the route matches. **/
    type Content = (entry: Router.Entry, state: Router.State) => Guard.Result | Promise<Guard.Result>;
}
export default ActionRule;
