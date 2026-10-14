/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Philosophy page — vizui's principles and what the project seeks, downloaded by the route loader and painted by the view.
 * @license Apache-2.0
 */
import { View, type Element } from 'vizui';
export declare class PhilosophyPage extends View<'div', PhilosophyPage.EventMap> {
    readonly root: Element<Element.Type['div']>;
    private readonly vItems;
    constructor();
    /**
     * Paints the manifesto delivered by the route loader.
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
export declare namespace PhilosophyPage {
    type EventMap = {
        [key: string]: never;
    };
}
export default PhilosophyPage;
