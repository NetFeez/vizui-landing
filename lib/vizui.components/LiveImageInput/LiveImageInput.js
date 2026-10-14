/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Image file input with instant preview and loading feedback.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
import Loading from '../Loading/Loading.js';
import Utilities from '../Utilities.js';
export class LiveImageInput extends Component {
    static { this.css.load('LiveImageInput.css', import.meta); }
    ePreview = Element.new('img').setClass('liveImageInput-preview');
    eLabel = Element.new('label')
        .setClass('liveImageInput-label')
        .append(this.ePreview);
    eInputFile = Element.new('input')
        .setClass('liveImageInput-input')
        .on('change', event => this.loadPreview(event));
    cLoading = new Loading();
    root = Element.new('div')
        .setClass('LiveImageInput')
        .append(this.eLabel, this.eInputFile);
    vDefaultSrc;
    vAccept;
    vId = 'liveImageInput-' + Math.random().toString(36).substring(2, 9);
    constructor(props = {}) {
        super();
        const { accept, src } = props;
        this.vAccept = accept ?? ['jpg', 'jpeg', 'png', 'gif'];
        this.vDefaultSrc = src ?? '';
        this.ePreview.setAttribute('src', this.vDefaultSrc);
        this.eLabel.setAttribute('for', this.vId);
        this.eInputFile.setAttributes({
            type: 'file',
            accept: this.vAccept.map(format => '.' + format).join(','),
            required: '',
            name: 'image',
            placeholder: 'image',
            id: this.vId
        });
        Utilities.setIdentity(this, props);
        this.setEventProps(props);
    }
    get src() { return this.ePreview.getAttribute('src') ?? ''; }
    set src(src) {
        this.ePreview.setAttribute('src', src);
    }
    loadPreview(event) {
        const file = this.eInputFile.root.files?.[0];
        if (!file) {
            this.ePreview.setAttribute('src', this.vDefaultSrc);
            return;
        }
        this.cLoading.spawn(this.eLabel);
        const reader = new FileReader();
        reader.onload = () => {
            this.ePreview.setAttribute('src', reader.result);
            this.cLoading.finish();
            this.emit('select', file, event);
        };
        reader.readAsDataURL(file);
    }
    get file() { return this.eInputFile.root.files?.[0] ?? null; }
    set file(file) {
        const dataTransfer = new DataTransfer();
        if (file)
            dataTransfer.items.add(file);
        this.eInputFile.root.files = dataTransfer.files;
        this.loadPreview();
    }
}
export default LiveImageInput;
//# sourceMappingURL=LiveImageInput.js.map