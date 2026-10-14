/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Route demo — the same view mounted on several routes: each route declares its own loader
 *              and the resolved data arrives to `render`. Route of testing, not linked from the navigation.
 * @license Apache-2.0
 */
import { View, type Element } from 'vizui';
export declare class MultiRoute extends View<'div', MultiRoute.EventMap> {
    readonly root: Element<Element.Type['div']>;
    private readonly vCode;
    constructor();
    /**
     * Paints the payload of whichever route mounted this view.
     * @param data - The produced data (string), or null when the loader could not produce it.
     */
    render(data?: unknown): void;
    /**
     * Builds the row shown when the loader produced nothing.
     * @param message - The failure message.
     * @returns The error row element.
     */
    private vErrorRow;
}
export declare namespace MultiRoute {
    type EventMap = {
        [key: string]: never;
    };
}
export default MultiRoute;
