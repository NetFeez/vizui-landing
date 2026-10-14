/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Stateless content card with a title and a body region.
 * @license Apache-2.0
 */

import { CSS, type Element } from 'vizui';
import type { JSX } from 'vizui/jsx-runtime';

CSS.load('Card.css', import.meta);

export function Card(props: JSX.Attributes<Card.Props>): Element<Element.Type['div']> {
    return (
        <div class="Card">
            <h3 class="title">{props.title}</h3>
            <div class="body">{props.children}</div>
        </div>
    );
}

export default Card;

export namespace Card {
    /** The props of a card. **/
    export interface Props {
        title: string;
    }
}