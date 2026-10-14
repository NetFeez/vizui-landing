/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Features page — the design principles of vizui, an honest mental-model comparison and the FAQ.
 * @license Apache-2.0
 */
import { View, type Element } from 'vizui';
export declare class FeaturesPage extends View<'div', FeaturesPage.EventMap> {
    readonly root: Element<Element.Type['div']>;
    constructor();
}
export declare namespace FeaturesPage {
    /** A row of the mental-model comparison. **/
    interface Row {
        dimension: string;
        common: string;
        vizui: string;
    }
    /** An entry of the frequently asked questions. **/
    interface FaqEntry {
        question: string;
        answer: string;
    }
    type EventMap = {
        [key: string]: never;
    };
}
export default FeaturesPage;
