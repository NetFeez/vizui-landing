/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Live diagram of the direct-to-DOM architecture: a real reactive node and an interactive button node.
 *              It mirrors the shared counter of the page when one is provided, so every reactive node shows the same Store.
 * @license Apache-2.0
 */
import { Component, Store, type Element } from 'vizui';
export declare class HeroDiagram extends Component<'div', HeroDiagram.EventMap> {
    readonly root: Element<Element.Type['div']>;
    private readonly vCount;
    private readonly vOwnsStore;
    constructor(props?: HeroDiagram.Props);
}
export declare namespace HeroDiagram {
    /** The props of the diagram: an optional shared counter Store mirrored by the reactive node. **/
    interface Props {
        /** When set, the diagram mirrors that Store instead of owning one. **/
        count?: Store<number>;
    }
    type EventMap = {
        [key: string]: never;
    };
}
export default HeroDiagram;
