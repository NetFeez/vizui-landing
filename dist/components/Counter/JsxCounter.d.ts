/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Counter component written with JSX — the twin of ImperativeCounter, same behaviour and same state.
 * @license Apache-2.0
 */
import { Component, type Element } from 'vizui';
export declare class JsxCounter extends Component<'div', JsxCounter.EventMap> {
    readonly root: Element<Element.Type['div']>;
    private readonly vCount;
    constructor();
}
export declare namespace JsxCounter {
    type EventMap = {
        [key: string]: never;
    };
}
export default JsxCounter;
