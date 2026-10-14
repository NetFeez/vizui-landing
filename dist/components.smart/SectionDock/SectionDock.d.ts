/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Floating quick-nav dock for the landing page — a vertical column of section shortcuts with scroll-spy highlighting.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
export declare class SectionDock extends Component<'aside', SectionDock.EventMap> {
    private static readonly ICON_HOME;
    private static readonly ICON_JSX;
    private static readonly ICON_BOLT;
    private static readonly ICON_TERMINAL;
    private static readonly ICON_BOOK;
    private static readonly ITEMS;
    readonly root: Element<Element.Type['aside']>;
    private readonly vLinks;
    private readonly vOnScroll;
    private vRaf;
    private vAlive;
    constructor();
    /**
     * Scrolls the landing to the requested section.
     * @param id - The id of the section to reveal.
     */
    private vSection;
    /**
     * Highlights the shortcut of the section currently crossing the top of the viewport.
     */
    private vTrack;
    /** Coalesces scroll bursts into one highlight pass per frame. **/
    private vSchedule;
}
export declare namespace SectionDock {
    /** A section shortcut of the dock. **/
    interface Item {
        id: string;
        label: string;
        icon: string;
    }
    type EventMap = {
        [key: string]: never;
    };
}
export default SectionDock;
