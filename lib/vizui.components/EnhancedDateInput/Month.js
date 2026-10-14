/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Monthly calendar grid component emitting day selection events.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
import WeekHeader from './WeekHeader.js';
export class Month extends Component {
    static { this.css.load('Month.css', import.meta); }
    root = Element.new('div').setClass('Month');
    eBody = Element.new('div').setClass('body');
    vDays;
    constructor(props = {}) {
        super();
        this.vDays = new Map();
        this.setEventProps(props);
        this.root.append(new WeekHeader(), this.eBody);
    }
    show(year, month) {
        this.eBody.clean();
        this.vDays.clear();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
        let eWeek = this.newWeek();
        for (let i = 0; i < adjustedFirstDay; i++) {
            const eDay = this.newEmptyDay();
            eWeek.append(eDay);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            if (eWeek.root.childNodes.length >= 7) {
                this.eBody.append(eWeek);
                eWeek = this.newWeek();
            }
            const date = new Date(year, month, day);
            const eDate = this.newDay(day, date);
            eWeek.append(eDate);
            this.vDays.set(day, { date, element: eDate });
        }
        while (eWeek.root.childNodes.length < 7) {
            eWeek.append(this.newEmptyDay());
        }
        this.eBody.append(eWeek);
        this.emit('show', year, month + 1);
    }
    getDay(day) {
        return this.vDays.get(day);
    }
    newWeek() {
        return Element.new('div').setClass('week');
    }
    newEmptyDay() {
        return Element.new('span').setClass('day empty');
    }
    newDay(day, date) {
        const eDay = Element.new('span').setText(`${day}`).setClass('day');
        eDay.on('click', () => this.emit('select', date));
        return eDay;
    }
}
export default Month;
//# sourceMappingURL=Month.js.map