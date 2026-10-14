/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Calendar-based date picker supporting multi-select with limits.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
import SelectInput from '../SelectInput/SelectInput.js';
import Month from './Month.js';
import Utilities from '../Utilities.js';
export declare class EnhancedDateInput extends Component<'div', EnhancedDateInput.EventMap> {
    protected static readonly MONTHS: string[];
    readonly root: Element<HTMLDivElement>;
    protected readonly cMonthSelect: SelectInput;
    protected readonly cYearSelect: SelectInput;
    protected readonly cMonth: Month;
    protected readonly vSelectedDates: Map<number, Element<Element.Type['span']>>;
    protected readonly vLimit: number;
    protected readonly vYearRange: number;
    protected readonly vYearFillMode: EnhancedDateInput.YearFillMode;
    constructor(props?: EnhancedDateInput.Props);
    protected newSelectContainer(): Element<Element.Type['div']>;
    protected newMonthSelect(): SelectInput;
    protected newYearSelect(): SelectInput;
    protected updateCalendar(event?: Event): void;
    protected restoreSelections(): void;
    protected toggleDate(date: Date, event?: Event): void;
    getSelected(): Date[];
    initialize(year: number, month: number, days: number[], event?: Event): void;
}
export declare namespace EnhancedDateInput {
    type YearFillMode = 'both' | 'backWard' | 'forWard';
    interface Options extends Omit<Utilities.Identity, 'for'> {
        limit?: number;
        yearRange?: number;
        yearFillMode?: YearFillMode;
    }
    type EventMap = {
        dateChange: [dates: Date[], event?: Event];
        addDate: [date: Date, event?: Event];
        removeDate: [date: Date, event?: Event];
        initialize: [event?: Event];
        update: [year: number, month: number, event?: Event];
    };
    type EventProps = Component.EventProps<EventMap>;
    type Props = Options & EventProps;
}
export default EnhancedDateInput;
