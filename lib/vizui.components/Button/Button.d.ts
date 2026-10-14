/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Button component with label text and an optional leading image.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
import Utilities from '../Utilities.js';
export declare class Button extends Component<'button', Button.EventMap> {
    readonly root: Element<HTMLButtonElement>;
    protected eText: Element<Element.Type['span']> | null;
    protected eIcon: Element<Element.Type['img']> | null;
    protected eContainer: Element<Element.Type['div']> | null;
    /**
     * Create a button component with text and an optional image.
     * @param props - Optional configuration for the button, including id, class, and image.
     */
    constructor(props?: Button.Props);
    text(value: string | null): this;
    icon(value: string | null): this;
    /**
     * Resets the button's text and image, removing them from the DOM.
     * This method is useful for clearing the button's content before setting new text or image.
     */
    private resetText;
    /**
     * Resets the button's image, removing it from the DOM.
     * This method is useful for clearing the button's image before setting a new one.
     */
    private resetImage;
}
export declare namespace Button {
    type EventMap = {
        click: [e: Event];
        hover: [e: Event];
    };
    interface Options extends Omit<Utilities.Identity, 'for'> {
        children?: string | null;
        text?: string;
        icon?: string;
    }
    type EventProps = Component.EventProps<EventMap>;
    type Props = Options & EventProps;
}
export default Button;
