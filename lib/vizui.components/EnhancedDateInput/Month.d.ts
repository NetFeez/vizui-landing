/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Monthly calendar grid component emitting day selection events.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
export declare class Month extends Component<'div', Month.EventMap> {
    readonly root: Element<HTMLDivElement>;
    protected readonly eBody: Element<HTMLDivElement>;
    protected readonly vDays: Map<number, Month.EntryDay>;
    constructor(props?: Month.Props);
    show(year: number, month: number): void;
    getDay(day: number): Month.EntryDay | undefined;
    protected newWeek(): Element<Element.Type['div']>;
    protected newEmptyDay(): Element<Element.Type['span']>;
    protected newDay(day: number, date: Date): Element<Element.Type['span']>;
}
export declare namespace Month {
    interface Options {
    }
    interface EntryDay {
        date: Date;
        element: Element<Element.Type['span']>;
    }
    type EventMap = {
        select: [date: Date];
        show: [year: number, month: number];
    };
    type EventProps = Component.EventProps<EventMap>;
    type Props = Options & EventProps;
}
export default Month;
