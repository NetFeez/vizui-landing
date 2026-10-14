/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description QR code generator component with preview and download support.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
import { Drawer } from 'qrcode';
import Style from 'qrcode/Style.js';
import Utilities from '../Utilities.js';
export declare class QRGenerator extends Component<'div'> {
    readonly root: Element<HTMLDivElement>;
    protected readonly eError: Element<HTMLParagraphElement>;
    protected readonly eViewer: Element<HTMLImageElement>;
    protected vShowing: Promise<void> | null;
    constructor(props?: QRGenerator.Props);
    generate(data: string, options?: QRGenerator.GenerateOptions): Promise<void>;
    protected show(drawer: Drawer, style?: QRGenerator.CustomizeOptions): Promise<void>;
    protected loadQrImage(drawer: Drawer, style?: QRGenerator.CustomizeOptions): Promise<void>;
}
export declare namespace QRGenerator {
    interface Options extends Omit<Utilities.Identity, 'for'> {
        children?: string;
    }
    type Props = Options;
    interface GenerateOptions {
        correctionLevel?: string;
        style?: CustomizeOptions;
    }
    interface CustomizeOptions {
        moduleMargin?: Style.SizeValue;
        moduleRadius?: Style.SizeValue;
        background?: Style.ColorValue | Style.gradient;
        activeModule?: Style.ColorValue | Style.gradient;
        inactiveModule?: Style.ColorValue | Style.gradient;
        size?: number;
        icon?: string;
    }
}
export default QRGenerator;
