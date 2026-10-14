/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Stateless content card with a title and a body region.
 * @license Apache-2.0
 */
import { type Element } from 'vizui';
import type { JSX } from 'vizui/jsx-runtime';
export declare function Card(props: JSX.Attributes<Card.Props>): Element<Element.Type['div']>;
export default Card;
export declare namespace Card {
    /** The props of a card. **/
    interface Props {
        title: string;
    }
}
