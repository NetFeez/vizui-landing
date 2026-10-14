/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Counter component written without JSX — the twin of JsxCounter, built with `Element.new` and stores: the value is appended as a Store child and the accessible attribute is bound to a derived Store.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
export declare class ImperativeCounter extends Component<'div', ImperativeCounter.EventMap> {
    readonly root: Element<HTMLDivElement>;
    private readonly vCount;
    private readonly vAttribute;
    private readonly eValue;
    constructor();
}
export declare namespace ImperativeCounter {
    type EventMap = {
        [key: string]: never;
    };
}
export default ImperativeCounter;
