/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Shared helpers to apply identity attributes and detect element kinds.
 * @license Apache-2.0
 */
import { Element } from 'vizui';
import { Component } from 'vizui';
export declare class Utilities {
    /**
     * Sets the identity attributes available in the provided element or component.
     * The identity attributes include id, class, and for. The for attribute is only applicable to label and input elements.
     * @param target The Element or Component to set the identity for.
     * @param identity An object containing the identity attributes to set.
     */
    static setIdentity(target: Element<any> | Component<any>, identity?: Utilities.Identity): void;
    /**
     * Checks if the provided target is a label element.
     * @param target The Element to check.
     * @returns True if the target is a label element, false otherwise.
     */
    static isLabel(target: Element): target is Element<Element.Type['label']>;
    /**
     * Checks if the provided target is an input or textarea element.
     * @param target The Element to check.
     * @returns True if the target is an input or textarea element, false otherwise.
     */
    static isInput(target: Element): target is Element<Element.Type['input'] | Element.Type['textarea']>;
}
export declare namespace Utilities {
    interface Identity {
        id?: string;
        name?: string;
        class?: string;
        for?: string;
    }
}
export default Utilities;
