/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Numeric input component with validation and submit/invalid events.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
import Utilities from '../Utilities.js';
export declare class NumericInput extends Component<'div', NumericInput.EventMap> {
    readonly root: Element<HTMLDivElement>;
    protected readonly eInput: Element<Element.Type['input']>;
    protected eButton?: Element<Element.Type['button']>;
    protected readonly vValidator: NumericInput.Validator;
    constructor(props?: NumericInput.Props);
    get value(): number;
    set value(value: number);
    clear(): void;
    private submit;
}
export declare namespace NumericInput {
    interface Options extends Omit<Utilities.Identity, 'for'> {
        placeholder?: string;
        value?: number;
        name?: string;
        button?: string;
        validator?: Validator;
    }
    type Validator = (value: number) => boolean;
    type EventMap = {
        submit: [value: number, event?: Event];
        input: [value: number, event?: Event];
        invalid: [value: number, event?: Event];
    };
    type EventProps = Component.EventProps<EventMap>;
    type Props = Options & EventProps;
}
export default NumericInput;
