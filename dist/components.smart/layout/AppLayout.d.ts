/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Application shell — ambient background, sticky navbar, the routed content outlet and the four-column footer.
 * @license Apache-2.0
 */
import { Layout, type Element } from 'vizui';
export declare class AppLayout extends Layout<'div', AppLayout.EventMap> {
    private readonly cNavbar;
    /** The region where routed content mounts. **/
    readonly outlet: Element<Element.Type['main']>;
    /** The layout root. **/
    readonly root: Element<Element.Type['div']>;
    constructor();
}
export declare namespace AppLayout {
    type EventMap = {
        [key: string]: never;
    };
}
export default AppLayout;
