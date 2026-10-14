/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Renders a store into a single attribute of an element.
 * @license Apache-2.0
 */
import Reactive from './Reactive.js';
export class Attribute extends Reactive {
    /** The subscription type, used by reactive filters. **/
    type = 'attribute';
    /** The instance id of this attribute binding. **/
    id;
    /** The element the attribute belongs to. **/
    vTarget;
    /** The attribute name. **/
    vName;
    /**
     * Binds a store to an attribute of an element.
     * @param store - The store providing the attribute value.
     * @param target - The element the attribute belongs to.
     * @param name - The attribute name.
     */
    constructor(store, target, name) {
        super(store);
        this.vTarget = target;
        this.vName = name;
        this.id = `${name}:${Math.random().toString(36).slice(2, 9)}`;
        this.render(store.state);
        this.subscribe();
    }
    /**
     * Writes the attribute value to the element, removing it when absent.
     * @param value - The new attribute value.
     */
    render(value) {
        if (value === null || value === undefined)
            this.vTarget.removeAttribute(this.vName);
        else
            this.vTarget.setAttribute(this.vName, value);
    }
}
export default Attribute;
//# sourceMappingURL=Attribute.js.map