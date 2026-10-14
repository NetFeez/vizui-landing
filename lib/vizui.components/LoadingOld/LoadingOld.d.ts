/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Legacy multi-ring animated loading overlay, kept for backwards compatibility.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
export declare class LoadingOld extends Component<'div'> {
    readonly root: Element<HTMLDivElement>;
    private vAnimation;
    constructor(props?: LoadingOld.Props);
    spawn(parent: Element, duration?: number, solid?: boolean): void;
    finish(duration?: number): void;
}
export declare namespace LoadingOld {
    interface Options {
        icon?: string | null;
    }
    type Props = Options;
}
export default LoadingOld;
