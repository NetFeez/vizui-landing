/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Clickable logo component with text, image and an optional URL.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
import Utilities from '../Utilities.js';
export class Logo extends Component {
    static { this.css.load('Logo.css', import.meta); }
    eText = Element.new('p').setClass('text');
    eImage = Element.new('img').setClass('image');
    root = Element.new('button')
        .setClass('Logo')
        .append(this.eImage, this.eText)
        .on('click', (e) => this.emit('click', this.vLocation, e))
        .on('mouseover', (e) => this.emit('hover', this.vLocation, e));
    vLocation;
    /**
     * Create a logo component with text, an image, and an optional URL.
     * @param options - The options for the logo component.
     */
    constructor(props = {}) {
        super();
        const { text = 'Logo', icon = 'favicon.ico', location = null, children = null } = props;
        this.vLocation = location;
        this.eImage.root.src = icon;
        this.eText.text = children ?? text;
        Utilities.setIdentity(this, props);
        this.setEventProps(props);
    }
    get text() { return this.eText.text; }
    set text(text) { this.eText.text = text; }
    get url() { return this.vLocation; }
    set url(url) { this.vLocation = url || null; }
    get image() { return this.eImage.root.src; }
    set image(image) { this.eImage.setAttribute('src', image); }
}
(function (Logo) {
    ;
})(Logo || (Logo = {}));
export default Logo;
//# sourceMappingURL=Logo.js.map