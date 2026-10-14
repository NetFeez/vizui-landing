/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Guards intercept navigations between the URL and the mounted
 * content. A guard may inspect the entry/state, call `next()` to continue, or
 * short-circuit the navigation by returning a control result. Mirror of the
 * Vortez Middleware architecture: an abstract base discriminated by symbol
 * with two channels — Navigation (entry flow) and Error (error-boundary).
 * @license Apache-2.0
 */
import { GUARD } from '../../../support/symbols.js';
export class Guard {
    [GUARD.BASE] = true;
    /** The function executed by this guard (mirrors Vortez `Middleware.action`). **/
    action;
    /**
     * Creates a guard around an action.
     * @param action - The function executed by this guard.
     */
    constructor(action) {
        this.action = action;
    }
    /**
     * Executes the guard's action with the supplied arguments.
     * @param args - The arguments passed to the action.
     * @returns The control result produced by the action, if any.
     */
    run(...args) {
        return this.action(...args);
    }
}
(function (Guard) {
    class Navigation extends Guard {
        [GUARD.NAVIGATION] = true;
        /** The channel this guard belongs to. **/
        identifier = 'navigation';
    }
    Guard.Navigation = Navigation;
    class Error extends Guard {
        [GUARD.ERROR] = true;
        /** The channel this guard belongs to. **/
        identifier = 'error';
    }
    Guard.Error = Error;
})(Guard || (Guard = {}));
export default Guard;
//# sourceMappingURL=Guard.js.map