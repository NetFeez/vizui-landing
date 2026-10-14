/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Architecture page — the responsibility split of an application built with vizui.
 * @license Apache-2.0
 */
import { View, type Element } from 'vizui';
export declare class ArchitecturePage extends View<'div', ArchitecturePage.EventMap> {
    readonly root: Element<Element.Type['div']>;
    private readonly vTreeCode;
    constructor();
    /**
     * Paints the project tree delivered by the route loader.
     * @param data - The downloaded tree, or null when it could not be fetched.
     */
    render(data?: unknown): void;
    /**
     * Builds the row shown when the tree cannot be downloaded.
     * @param message - The failure message.
     * @returns The error row element.
     */
    private vErrorRow;
}
export declare namespace ArchitecturePage {
    type EventMap = {
        [key: string]: never;
    };
}
export default ArchitecturePage;
