/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Image file input with instant preview and loading feedback.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
import Loading from '../Loading/Loading.js';
import Utilities from '../Utilities.js';
export declare class LiveImageInput extends Component<'div', LiveImageInput.EventMap> {
    protected readonly ePreview: Element<HTMLImageElement>;
    protected readonly eLabel: Element<HTMLLabelElement>;
    protected readonly eInputFile: Element<HTMLInputElement>;
    protected readonly cLoading: Loading;
    readonly root: Element<HTMLDivElement>;
    protected readonly vDefaultSrc: string;
    protected readonly vAccept: LiveImageInput.Formats[];
    protected readonly vId: string;
    constructor(props?: LiveImageInput.Props);
    get src(): string;
    set src(src: string);
    protected loadPreview(event?: Event): void;
    get file(): File | null;
    set file(file: File | null);
}
export declare namespace LiveImageInput {
    type Formats = 'jpg' | 'jpeg' | 'png' | 'gif';
    interface Options extends Omit<Utilities.Identity, 'for'> {
        accept?: Formats[];
        src?: string;
    }
    type EventMap = {
        select: [file: File, event?: Event];
    };
    type EventProps = Component.EventProps<EventMap>;
    type Props = Options & EventProps;
}
export default LiveImageInput;
