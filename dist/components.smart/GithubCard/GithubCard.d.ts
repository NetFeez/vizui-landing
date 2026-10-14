/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Author card — fetches the NetFeez GitHub profile and renders it reactively.
 * @license Apache-2.0
 */
import { Component, type Element } from 'vizui';
export declare class GithubCard extends Component<'div', GithubCard.EventMap> {
    private static readonly USERNAME;
    readonly root: Element<Element.Type['div']>;
    private readonly vItems;
    private vAlive;
    constructor();
    /**
     * Loads the profile and renders it, or a failure row when the request rejects.
     */
    private vLoad;
    /**
     * Builds the profile rows.
     * @param user - The fetched profile.
     * @returns The reactive rows of the card.
     */
    private vProfile;
    /**
     * Formats an unknown failure into a readable message.
     * @param error - The thrown value.
     * @returns The message to show.
     */
    private vMessage;
    /**
     * Builds a status row (loading or error).
     * @param message - The text of the row.
     * @returns The row element.
     */
    private vStateRow;
    /** Marks the card dead and destroys the reactive rows. **/
    private vDispose;
}
export declare namespace GithubCard {
    type EventMap = {
        [key: string]: never;
    };
}
export default GithubCard;
