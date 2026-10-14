/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Global navigation bar — brand, section links that scroll the landing, GitHub call to action and documentation shortcut.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
export declare class Navbar extends Component<'nav', Navbar.EventMap> {
    private static readonly ITEMS;
    private static readonly GITHUB_ICON;
    private static readonly CHEVRON_ICON;
    readonly root: Element<Element.Type['nav']>;
    private readonly vLinks;
    private readonly vRouteLinks;
    private readonly vOnScroll;
    private readonly vOnRoute;
    private readonly eStar;
    private vRaf;
    private vAlive;
    constructor();
    /** Paints the real star count of the repository, keeping the dash on failure. **/
    private vStars;
    /**
     * Navigates to a route through the application router.
     * @param path - The route path to navigate to.
     */
    private vGo;
    /**
     * Scrolls to a landing section, returning to the landing first when needed.
     * @param id - The id of the section to reveal.
     */
    private vSection;
    /**
     * Highlights the link of the section currently crossing the top of the viewport.
     */
    private vTrack;
    /** Coalesces scroll bursts into one highlight pass per frame. **/
    private vSchedule;
}
export declare namespace Navbar {
    /** A navigation entry of the navbar: a landing section, or a route when `route` is set. **/
    interface Item {
        id: string;
        label: string;
        route?: string;
    }
    type EventMap = {
        [key: string]: never;
    };
}
export default Navbar;
