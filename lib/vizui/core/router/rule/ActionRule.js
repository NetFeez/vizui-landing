/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Route for custom mount kinds. The general form behind `action()`, the
 * typed shortcuts and any developer-defined mount kind. Its content runs after the
 * route pipeline and may return a control result (redirect/abort/error).
 * @license Apache-2.0
 */
import { RULE } from '../../../support/symbols.js';
import Pipeline from '../pipeline/Pipeline.js';
import Rule from './Rule.js';
export class ActionRule extends Rule {
    kind;
    [RULE.CUSTOM] = true;
    /**
     * Creates a custom route.
     * @param kind - The custom mount kind.
     * @param template - The url template of the route.
     * @param content - The content executed when the route matches.
     * @param pipeline - The per-route pipeline.
     */
    constructor(
    /** The custom mount kind of the rule. **/
    kind, template, content, pipeline = new Pipeline()) {
        super(template, content, pipeline);
        this.kind = kind;
    }
    /** The mount kind of the rule. **/
    get identifier() { return `custom-${this.kind}`; }
    async exec(entry, state) {
        return await this.pipeline.run(entry, state, async () => {
            return await this.vContent(entry, state);
        });
    }
}
export default ActionRule;
//# sourceMappingURL=ActionRule.js.map