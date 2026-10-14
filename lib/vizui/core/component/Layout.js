/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Base class for layout components mounted by the router layout chain,
 * exposing the outlet region where routed content mounts.
 * @license Apache-2.0
 */
import { LAYOUT } from '../../support/Contracts.js';
import Component from './Component.js';
/**
 * Base class for layout components that expose the outlet region inside their
 * root where the router mounts the routed content.
 * @template T - The root element type of the layout.
 * @template EventMap - The event map of the layout.
 */
export class Layout extends Component {
    [LAYOUT] = true;
}
export default Layout;
//# sourceMappingURL=Layout.js.map