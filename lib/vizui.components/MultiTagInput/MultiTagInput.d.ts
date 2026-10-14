/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Tag input component supporting free text or predefined options.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
import TextInput from '../TextInput/TextInput.js';
import SelectInput from '../SelectInput/SelectInput.js';
import Utilities from '../Utilities.js';
export declare class MultiTagInput extends Component<'div', MultiTagInput.EventMap> {
    readonly root: Element<HTMLDivElement>;
    protected readonly eContainer: Element<Element.Type['div']>;
    protected readonly cInput: TextInput | SelectInput;
    protected readonly vLimit: number;
    protected readonly vMinim: number;
    protected vTags: Set<string>;
    protected readonly vValidator: MultiTagInput.Validator;
    constructor(props?: MultiTagInput.Props);
    protected newTag(tag: string): Element<Element.Type['span']>;
    protected deleteTag(tag: string, eTag: Element<Element.Type['span']>): void;
    protected addTag(tag: string, event?: Event): Element<Element.Type['span']> | void;
    getTags(): string[];
}
export declare namespace MultiTagInput {
    interface Options extends Omit<Utilities.Identity, 'for'> {
        limit?: number;
        minim?: number;
        optionList?: string[];
        placeholder?: string;
        validator?: Validator;
    }
    type Validator = (tag: string) => boolean;
    type EventMap = {
        add: [tag: string, event?: Event];
        invalid: [tag: string, event?: Event];
        limit: [tag: string, event?: Event];
    };
    type EventProps = Component.EventProps<EventMap>;
    type Props = Options & EventProps;
}
export default MultiTagInput;
