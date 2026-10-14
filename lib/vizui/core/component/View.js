/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Base class for page-level components (views) mountable by the router.
 * @license Apache-2.0
 */
import { VIEW } from '../../support/Contracts.js';
import Component from './Component.js';
/**
 * Base class for page-level components (views) mountable by the router.
 * @template T - The root element type of the view.
 * @template EventMap - The event map of the view.
 * @template RenderData - The data type painted by `render`, resolved through the
 * route loader. Defaults to `unknown` when the view declares no data.
 */
export class View extends Component {
    [VIEW] = true;
}
export default View;
//# sourceMappingURL=View.js.map