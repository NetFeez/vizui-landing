/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Weekday header row for calendar components.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
export declare class WeekHeader extends Component<'div'> {
    protected static readonly WEEKDAYS: string[];
    readonly root: Element<HTMLDivElement>;
    constructor();
}
export declare namespace WeekHeader {
    interface Options {
    }
    type Props = Options;
}
export default WeekHeader;
