/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Text input component with validation and submit/invalid events.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
import Button from '../Button/Button.js';
import Utilities from '../Utilities.js';
export declare class TextInput extends Component<'div', TextInput.EventMap> {
    readonly root: Element<HTMLDivElement>;
    protected readonly eInput: Element<Element.Type['input'] | Element.Type['textarea']>;
    protected readonly cButton?: Button;
    protected readonly vValidator: TextInput.Validator;
    constructor(props?: TextInput.Props);
    get value(): string;
    set value(value: string);
    /** Clears the text input, setting its value to an empty string. */
    clear(): void;
    /** Sends the current text value, emitting a 'submit' event if the value is valid according to the validator, or an 'invalid' event if it is not. */
    protected handle(event?: Event): void;
}
export declare namespace TextInput {
    type EventMap = {
        submit: [text: string, event?: Event];
        input: [text: string, event?: Event];
        invalid: [text: string, event?: Event];
    };
    type Validator = (text: string) => boolean;
    interface InputOptions extends Omit<Utilities.Identity, 'for'> {
        placeholder?: string;
        type?: 'text' | 'textarea' | 'email' | 'password';
        value?: string;
        validator?: Validator;
    }
    interface ButtonOptions extends Omit<Utilities.Identity, 'for'> {
        text?: string;
        icon?: string;
    }
    interface Options extends Omit<Utilities.Identity, 'for'> {
        input?: InputOptions;
        button?: ButtonOptions;
    }
    type EventProps = Component.EventProps<EventMap>;
    type Props = Options & EventProps;
}
export default TextInput;
