/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description QR code generator component with preview and download support.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
import QR from 'qrcode';
import Utilities from '../Utilities.js';
export class QRGenerator extends Component {
    static { this.css.load('QRGenerator.css', import.meta); }
    root = Element.new('div').setClass('QRGenerator');
    eError = Element.new('p').setClass('QRGenerator-Error');
    eViewer = Element.new('img').setClass('QRGenerator-Viewer');
    vShowing = null;
    constructor(props = {}) {
        super();
        const { children = null } = props;
        const eDownloadButton = Element.new('button')
            .setText('Download')
            .setClass('Button QRGenerator-Download');
        eDownloadButton.on('click', async () => {
            const url = this.eViewer.getAttribute('src');
            if (url == null)
                return;
            const eLink = Element.new('a');
            eLink.setAttribute('download', 'QR.png');
            eLink.setAttribute('href', url);
            eLink.root.click();
        });
        Utilities.setIdentity(this, props);
        this.root.append(this.eViewer, this.eError, eDownloadButton);
        if (children)
            void this.generate(children);
    }
    async generate(data, options = {}) {
        const { correctionLevel = 'L', style = {} } = options;
        const eccLevel = QR.isSupportedEccLevel(correctionLevel) ? correctionLevel : 'L';
        const qr = new QR(data, { eccLevel });
        const drawer = qr.imageDrawer;
        if (drawer == null) {
            const errorMessage = 'Posible browser incompatible with Canvas API';
            this.eError.text = errorMessage;
            throw new Error(errorMessage);
        }
        await this.show(drawer, style);
    }
    async show(drawer, style = {}) {
        if (this.vShowing)
            await this.vShowing;
        this.vShowing = this.loadQrImage(drawer, style);
        await this.vShowing;
        this.vShowing = null;
    }
    async loadQrImage(drawer, style = {}) {
        const { activeModule = null, inactiveModule = null, moduleMargin = null, moduleRadius = null, background = null, icon = null, size = null } = style;
        const styleManager = drawer.style;
        if (moduleMargin)
            styleManager.moduleMargin = moduleMargin;
        if (moduleRadius)
            styleManager.moduleRadius = moduleRadius;
        if (background)
            styleManager.background = background;
        if (activeModule)
            styleManager.activeColor = activeModule;
        if (inactiveModule)
            styleManager.inactiveColor = inactiveModule;
        if (icon)
            await drawer.addImage(icon);
        const dataUrl = await drawer.dataUrl(style.size);
        this.eViewer.setAttribute('src', dataUrl);
    }
}
export default QRGenerator;
//# sourceMappingURL=QRGenerator.js.map