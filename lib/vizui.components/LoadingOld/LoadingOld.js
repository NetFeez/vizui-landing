/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Legacy multi-ring animated loading overlay, kept for backwards compatibility.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
export class LoadingOld extends Component {
    static { this.css.load('LoadingOld.css', import.meta); }
    root = Element.new('div').setClass('LoadingOld LoadingOld-spawning');
    vAnimation = null;
    constructor(props = {}) {
        super();
        const { icon = null } = props;
        const eRings = Element.new('div');
        if (icon)
            eRings.append(Element.new('img').setAttribute('src', icon));
        eRings.append(Element.new('span'), Element.new('span'));
        this.root.append(eRings);
    }
    spawn(parent, duration = 500, solid = false) {
        this.vAnimation?.cancel();
        if (solid)
            this.root.setAttribute('solid', '');
        parent.append(this.root);
        this.vAnimation = this.root.animate([
            { opacity: 0 },
            { opacity: 1 }
        ], { duration, iterations: 1 });
    }
    finish(duration = 500) {
        this.vAnimation?.cancel();
        const animation = this.root.animate([
            { opacity: 1 },
            { opacity: 0 }
        ], { duration, iterations: 1 });
        this.vAnimation = animation;
        animation.addEventListener('finish', () => {
            if (this.vAnimation !== animation)
                return;
            this.vAnimation = null;
            this.root.remove();
            this.root.removeAttribute('solid');
        });
    }
}
export default LoadingOld;
//# sourceMappingURL=LoadingOld.js.map