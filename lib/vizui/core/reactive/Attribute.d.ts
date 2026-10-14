/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Renders a store into a single attribute of an element.
 * @license Apache-2.0
 */
import Store from '../../state/Store.js';
import Reactive from './Reactive.js';
export declare class Attribute extends Reactive<string | null> {
    /** The subscription type, used by reactive filters. **/
    readonly type: 'attribute';
    /** The instance id of this attribute binding. **/
    readonly id: string;
    /** The element the attribute belongs to. **/
    private readonly vTarget;
    /** The attribute name. **/
    private readonly vName;
    /**
     * Binds a store to an attribute of an element.
     * @param store - The store providing the attribute value.
     * @param target - The element the attribute belongs to.
     * @param name - The attribute name.
     */
    constructor(store: Store<string | null>, target: HTMLElement, name: string);
    /**
     * Writes the attribute value to the element, removing it when absent.
     * @param value - The new attribute value.
     */
    render(value: string | null): void;
}
export declare namespace Attribute {
}
export default Attribute;
