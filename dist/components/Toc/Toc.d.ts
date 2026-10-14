/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Table of contents — builds navigation chips either from the sections it receives or by scanning the headings of a scope
 *              (a selector string or an Element). Clicking scrolls to the section; the one crossing the viewport stays highlighted.
 *              When given a scope it reacts to content changes, so chips never drift from the document.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
export declare class Toc extends Component<'nav', Toc.EventMap> {
    readonly root: Element<Element.Type['nav']>;
    private readonly vLinks;
    private readonly vOnScroll;
    private readonly vScope;
    private readonly vSelector;
    private vRawScope;
    private readonly vObserver;
    private vRaf;
    /**
     * @param source - Explicit sections, or a scope to scan for headings: a selector string or an Element.
     * @param selector - The heading selector used when `source` is a scope.
     */
    constructor(source: Toc.Source, selector?: string);
    /**
     * Resolves the scope source to its raw DOM node.
     * @returns The raw node to scan, or null when it cannot be found yet.
     */
    private vResolveScope;
    /**
     * Synchronizes the chips with the headings currently present in the scope.
     */
    private vScan;
    /**
     * Schedules a scan for the next frame, coalescing bursts of mutations.
     */
    private vScheduleScan;
    /**
     * Builds the chip link for a section.
     * @param id - The section id to jump to.
     * @param label - The text of the chip.
     * @returns The link element.
     */
    private vCreateLink;
    /**
     * Scrolls to the section and marks its chip as active.
     * @param id - The section id to jump to.
     * @param event - The click event that triggered the navigation.
     */
    private vGo;
    /**
     * Sets the chip of the section currently crossing the top of the viewport.
     */
    private vTrack;
    /**
     * Marks one chip as active and clears the rest.
     * @param id - The id of the active section.
     */
    private vHighlight;
}
export declare namespace Toc {
    /** A section reachable from the table of contents. **/
    interface Section {
        /** The id of the element to scroll to. **/
        id: string;
        /** The text shown by the navigation chip. **/
        label: string;
    }
    /** Explicit sections, or a scope to scan for headings: a selector string or an Element. **/
    type Source = readonly Section[] | string | Element;
    type EventMap = {
        [key: string]: never;
    };
}
export default Toc;
