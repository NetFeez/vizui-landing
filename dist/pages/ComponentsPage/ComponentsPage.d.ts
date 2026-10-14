/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Components page — live showcase of vizui.components widgets.
 * @license Apache-2.0
 */
import { View, type Element } from 'vizui';
export declare class ComponentsPage extends View<'div', ComponentsPage.EventMap> {
    readonly root: Element<Element.Type['div']>;
    private readonly eHost;
    private readonly eLog;
    private readonly cLoading;
    private readonly vLog;
    private readonly vBehindCode;
    private vLoadingShown;
    constructor();
    /**
     * Paints the behind-the-scenes sample delivered by the route loader.
     * @param data - The downloaded sample, or null when it could not be fetched.
     */
    render(data?: unknown): void;
    /**
     * Builds the row shown when the sample cannot be downloaded.
     * @returns The error row element.
     */
    private vErrorRow;
    /**
     * Prepedhes an entry in the event log, keeping at most six entries.
     * @param kind - The kind of the emitter.
     * @param value - The value produced by the event.
     */
    private vLogEvent;
    /** Opens a draggable and resizable window inside the host. **/
    private vOpenWindow;
    /** Toggles the loading overlay inside the host. **/
    private vToggleLoading;
}
export declare namespace ComponentsPage {
    type EventMap = {
        [key: string]: never;
    };
}
export default ComponentsPage;
