/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Calendar-based date picker supporting multi-select with limits.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
import SelectInput from '../SelectInput/SelectInput.js';
import Month from './Month.js';
import Utilities from '../Utilities.js';
export class EnhancedDateInput extends Component {
    static { this.css.load('EnhancedDateInput.css', import.meta); }
    static MONTHS = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];
    root = Element.new('div').setClass('EnhancedDateInput');
    cMonthSelect;
    cYearSelect;
    cMonth;
    vSelectedDates;
    vLimit;
    vYearRange;
    vYearFillMode;
    constructor(props = {}) {
        super();
        const { limit = 1, yearRange = 10, yearFillMode = 'both' } = props;
        this.vLimit = limit;
        this.vYearRange = yearRange;
        this.vYearFillMode = yearFillMode;
        this.vSelectedDates = new Map();
        this.cMonthSelect = this.newMonthSelect();
        this.cYearSelect = this.newYearSelect();
        this.cMonth = new Month();
        this.root.append(this.newSelectContainer(), this.cMonth);
        Utilities.setIdentity(this, props);
        this.setEventProps(props);
        this.cMonthSelect.on('submit', (_selected, event) => this.updateCalendar(event));
        this.cYearSelect.on('submit', (_selected, event) => this.updateCalendar(event));
        this.cMonth.on('select', (date) => this.toggleDate(date));
        this.updateCalendar();
    }
    newSelectContainer() {
        return Element.new('div').setClass('selects').append(this.cMonthSelect, this.cYearSelect);
    }
    newMonthSelect() {
        return new SelectInput({
            optionList: EnhancedDateInput.MONTHS,
            placeholder: 'Month'
        });
    }
    newYearSelect() {
        const currentYear = new Date().getFullYear();
        const length = ['backWard', 'forWard'].includes(this.vYearFillMode)
            ? this.vYearRange + 1
            : (this.vYearRange * 2) + 1;
        const startYear = this.vYearFillMode === 'forWard'
            ? currentYear
            : currentYear - this.vYearRange;
        const years = Array.from({ length }, (_, i) => (startYear + i).toString());
        return new SelectInput({
            optionList: years,
            placeholder: 'Year'
        });
    }
    updateCalendar(event) {
        const month = this.cMonthSelect.getSelected();
        const year = parseInt(this.cYearSelect.getSelected(), 10);
        if (month === '' || isNaN(year))
            return;
        const monthIndex = EnhancedDateInput.MONTHS.indexOf(month);
        this.cMonth.show(year, monthIndex);
        this.restoreSelections();
        this.emit('update', year, monthIndex + 1, event);
    }
    restoreSelections() {
        for (const [timestamp] of this.vSelectedDates) {
            const date = new Date(timestamp);
            const currentMonth = EnhancedDateInput.MONTHS.indexOf(this.cMonthSelect.getSelected());
            const currentYear = parseInt(this.cYearSelect.getSelected(), 10);
            if (date.getMonth() !== currentMonth || date.getFullYear() !== currentYear)
                continue;
            const entry = this.cMonth.getDay(date.getDate());
            if (!entry)
                continue;
            entry.element.root.classList.add('selected');
            this.vSelectedDates.set(timestamp, entry.element);
        }
    }
    toggleDate(date, event) {
        const key = date.getTime();
        const entry = this.cMonth.getDay(date.getDate());
        if (!entry)
            return;
        if (this.vSelectedDates.has(key)) {
            const selected = this.vSelectedDates.get(key);
            selected?.root.classList.remove('selected');
            this.vSelectedDates.delete(key);
            this.emit('removeDate', date, event);
        }
        else {
            if (this.vLimit >= 1 && this.vSelectedDates.size >= this.vLimit) {
                const [[oldKey, oldElement]] = this.vSelectedDates.entries();
                oldElement.root.classList.remove('selected');
                this.vSelectedDates.delete(oldKey);
                this.emit('removeDate', new Date(oldKey), event);
            }
            entry.element.root.classList.add('selected');
            this.vSelectedDates.set(key, entry.element);
            this.emit('addDate', date, event);
        }
        this.emit('dateChange', this.getSelected(), event);
    }
    getSelected() {
        return [...this.vSelectedDates.keys()]
            .map(timestamp => new Date(timestamp));
    }
    initialize(year, month, days, event) {
        this.cYearSelect.setSelected(year.toString());
        this.cMonthSelect.setSelected(EnhancedDateInput.MONTHS[month - 1]);
        this.updateCalendar(event);
        for (const day of days) {
            const date = new Date(year, month - 1, day);
            this.toggleDate(date, event);
        }
        this.emit('initialize', event);
    }
}
export default EnhancedDateInput;
//# sourceMappingURL=EnhancedDateInput.js.map