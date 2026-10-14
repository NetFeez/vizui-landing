/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Documentation page — the guide downloaded by the route loader, painted by the view, plus the merged About section.
 * @license Apache-2.0
 */
import { View, type Element } from 'vizui';
export declare class DocsPage extends View<'div', DocsPage.EventMap> {
    readonly root: Element<Element.Type['div']>;
    private readonly vItems;
    constructor();
    /**
     * Paints the guide delivered by the route loader.
     * @param data - The downloaded markdown, or null when it could not be fetched.
     */
    render(data?: unknown): void;
    /**
     * Builds the failure row.
     * @param message - The failure message.
     * @returns The error row element.
     */
    private vErrorRow;
}
export declare namespace DocsPage {
    type EventMap = {
        [key: string]: never;
    };
}
export default DocsPage;
