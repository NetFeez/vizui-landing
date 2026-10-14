/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Button component with label text and an optional leading image.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
import Utilities from '../Utilities.js';
export class Button extends Component {
    static { this.css.load('Button.css', import.meta); }
    root = Element.new('button').setClass('Button')
        .on('click', (e) => this.emit('click', e))
        .on('mouseover', (e) => this.emit('hover', e));
    eText = null;
    eIcon = null;
    eContainer = null;
    /**
     * Create a button component with text and an optional image.
     * @param props - Optional configuration for the button, including id, class, and image.
     */
    constructor(props = { text: 'button' }) {
        super();
        const { text = null, icon = null, children = null } = props;
        let label = children ?? text;
        if (!label && !icon)
            label = 'button';
        this.icon(icon).text(label);
        Utilities.setIdentity(this, props);
        this.setEventProps(props);
    }
    text(value) {
        if (!value) {
            this.resetText();
            return this;
        }
        if (this.eText) {
            this.eText.text = value;
            return this;
        }
        this.eText = Element.new('span').append(value);
        this.eContainer = Element.new('div')
            .setClass('text')
            .append(this.eText);
        this.root.append(this.eContainer);
        return this;
    }
    icon(value) {
        if (!value) {
            this.resetImage();
            return this;
        }
        if (this.eIcon) {
            this.eIcon.root.src = value;
            return this;
        }
        this.eIcon = Element.new('img').setAttributes({ class: 'image', src: value });
        this.root.append(this.eIcon);
        return this;
    }
    /**
     * Resets the button's text and image, removing them from the DOM.
     * This method is useful for clearing the button's content before setting new text or image.
     */
    resetText() {
        if (this.eContainer)
            this.eContainer.remove();
        this.eContainer = this.eText = null;
    }
    /**
     * Resets the button's image, removing it from the DOM.
     * This method is useful for clearing the button's image before setting a new one.
     */
    resetImage() {
        if (this.eIcon)
            this.eIcon.remove();
        this.eIcon = null;
    }
}
(function (Button) {
    ;
})(Button || (Button = {}));
export default Button;
//# sourceMappingURL=Button.js.map