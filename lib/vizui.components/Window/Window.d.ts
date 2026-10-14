/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Draggable, resizable window component with minimize/maximize controls.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
import Utilities from '../Utilities.js';
export declare class Window extends Component<'div', Window.EventMap> {
    protected readonly eTitle: Element<HTMLHeadingElement>;
    protected readonly eHeader: Element<HTMLDivElement>;
    protected readonly eContent: Element<HTMLDivElement>;
    readonly root: Element<HTMLDivElement>;
    private readonly vBinds;
    constructor(props?: Window.Props);
    get title(): string;
    set title(value: string);
    /**
     * Sets the content of the window. This will remove all previous content and replace it with the new items.
     * @param items The new content items to set in the window.
     */
    content(...items: Element.ValueType[]): this;
    /**
     * Clears the content of the window, removing all child elements from the content area.
     * @returns The current instance of the Window component for method chaining.
     */
    clear(): this;
    /**
     * Resizes the window to the specified width and height.
     * @param width The new width (in pixels) for the window.
     * @param height The new height (in pixels) for the window.
     * @returns The current instance of the Window component for method chaining.
     */
    resize(width: number, height: number, event?: Event): this;
    /**
     * Moves the window to the specified (x, y) coordinates on the screen.
     * @param x The new x-coordinate (in pixels) for the window's position.
     * @param y The new y-coordinate (in pixels) for the window's position.
     * @returns The current instance of the Window component for method chaining.
     */
    move(x: number, y: number, event?: Event): this;
    /**
     * Sets up the resize functionality for the window component.
     * This allows the user to resize the window by dragging its edges or corners.
     * The resize behavior is implemented using pointer events, and it adjusts the width and height of the window based on the user's mouse movements.
     * The window can be resized from the right edge, bottom edge, or both edges simultaneously (for corner resizing).
     * The minimum width and height of the window are set to 150px and 100px, respectively.
     * This method is called during the construction of the Window component to enable resizing functionality.
     */
    private resizeManager;
    private moveManager;
    private resizeCaptureHandler;
    private resizeHandler;
    private moveHandler;
}
export declare namespace Window {
    type EventMap = {
        'close': [event: Event];
        'resize': [{
            width: number;
            height: number;
            event?: Event;
        }];
        'move': [{
            x: number;
            y: number;
            event?: Event;
        }];
    };
    interface Options extends Omit<Utilities.Identity, 'for'> {
        aspectRatio?: `${number}/${number}` | null;
        children?: Element.ValueType | Element.ValueType[];
        height?: number;
        title?: string;
        width?: number;
        x?: number;
        y?: number;
    }
    type EventProps = Component.EventProps<EventMap>;
    type Props = Options & EventProps;
}
export default Window;
