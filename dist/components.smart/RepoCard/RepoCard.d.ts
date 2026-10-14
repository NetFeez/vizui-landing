/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Project card — fetches the vizui repository metadata and renders it reactively.
 * @license Apache-2.0
 */
import { Component, type Element } from 'vizui';
export declare class RepoCard extends Component<'div', RepoCard.EventMap> {
    private static readonly OWNER;
    private static readonly REPO;
    readonly root: Element<Element.Type['div']>;
    private readonly vItems;
    private vAlive;
    constructor();
    /**
     * Loads the repository metadata and renders it, or a failure row when the request rejects.
     */
    private vLoad;
    /**
     * Detects a 404-style failure, the usual sign of a non-public repository.
     * @param error - The thrown value.
     * @returns Whether the repository was not found.
     */
    private vIsPrivate;
    /**
     * Builds the metadata layout of the repository.
     * @param repo - The fetched metadata.
     * @returns The card body.
     */
    private vMeta;
    /**
     * Formats an unknown failure into a readable message.
     * @param error - The thrown value.
     * @returns The message to show.
     */
    private vMessage;
    /**
     * Builds a status message row.
     * @param message - The text of the row.
     * @param error - Whether the row advertises a failure.
     * @returns The message element.
     */
    private vMessageRow;
    /** Marks the card dead and destroys the reactive rows. **/
    private vDispose;
}
export declare namespace RepoCard {
    type EventMap = {
        [key: string]: never;
    };
}
export default RepoCard;
