/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Soft loading overlay — dual-tone spinner ring with optional mascot icon.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
export declare class Loading extends Component<'div'> {
    readonly root: Element<HTMLDivElement>;
    private readonly eRing;
    private readonly eIcon;
    private vSpawned;
    private vAnimation;
    constructor(props?: Loading.Props);
    spawn(parent: Element, duration?: number, solid?: boolean): void;
    finish(duration?: number): void;
}
export declare namespace Loading {
    interface Options {
        icon?: string | null;
    }
    type Props = Options;
}
export default Loading;
