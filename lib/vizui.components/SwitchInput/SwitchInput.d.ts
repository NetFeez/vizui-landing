/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Toggle switch input component emitting change events.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
import Utilities from '../Utilities.js';
export declare class SwitchInput extends Component<'div', SwitchInput.EventMap> {
    readonly root: Element<HTMLDivElement>;
    protected vState: boolean;
    constructor(props?: SwitchInput.Props);
    toggleState(event?: Event): void;
    getState(): boolean;
    get value(): boolean;
    set value(value: boolean);
}
export declare namespace SwitchInput {
    interface Options extends Omit<Utilities.Identity, 'for'> {
        defaultState?: boolean;
        label?: string;
    }
    type EventMap = {
        change: [state: boolean, event?: Event];
    };
    type EventProps = Component.EventProps<EventMap>;
    type Props = Options & EventProps;
}
export default SwitchInput;
