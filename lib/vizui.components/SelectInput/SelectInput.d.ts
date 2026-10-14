/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Select dropdown input component emitting submit events.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
import Utilities from '../Utilities.js';
export declare class SelectInput<TOption extends string[] = string[]> extends Component<'select', SelectInput.EventMap<TOption>> {
    readonly root: Element<HTMLSelectElement>;
    protected vPlaceholder: string;
    constructor(props?: SelectInput.Props<TOption>);
    getSelected(): TOption[number];
    setSelected(option: TOption[number]): void;
}
export declare namespace SelectInput {
    type EventMap<TOption extends string[] = string[]> = {
        submit: [selected: TOption[number], event: Event];
    };
    interface Options<TOption extends string[] = string[]> extends Omit<Utilities.Identity, 'for'> {
        optionList?: TOption;
        placeholder?: string;
    }
    type EventProps<TOption extends string[] = string[]> = Component.EventProps<EventMap<TOption>>;
    type Props<TOption extends string[] = string[]> = Options<TOption> & EventProps<TOption>;
}
export default SelectInput;
