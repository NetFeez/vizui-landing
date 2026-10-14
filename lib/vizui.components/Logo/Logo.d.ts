/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Clickable logo component with text, image and an optional URL.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
import Utilities from '../Utilities.js';
export declare class Logo extends Component<'button', Logo.EventMap> {
    protected readonly eText: Element<HTMLParagraphElement>;
    protected readonly eImage: Element<HTMLImageElement>;
    readonly root: Element<HTMLButtonElement>;
    protected vLocation: string | null;
    /**
     * Create a logo component with text, an image, and an optional URL.
     * @param options - The options for the logo component.
     */
    constructor(props?: Logo.Props);
    get text(): string;
    set text(text: string);
    get url(): string | null;
    set url(url: string | null);
    get image(): string;
    set image(image: string);
}
export declare namespace Logo {
    type EventMap = {
        click: [url: string | null, event: Event];
        hover: [url: string | null, event: Event];
    };
    interface Options extends Omit<Utilities.Identity, 'for'> {
        children?: string | null;
        text?: string;
        icon?: string;
        location?: string;
    }
    type EventProps = Component.EventProps<EventMap>;
    type Props = Options & EventProps;
}
export default Logo;
