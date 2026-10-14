/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Weekday header row for calendar components.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
export class WeekHeader extends Component {
    static { this.css.load('WeekHeader.css', import.meta); }
    static WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    root = Element.new('div').setClass('WeekHeader');
    constructor() {
        super();
        WeekHeader.WEEKDAYS.forEach(day => {
            const eDay = Element.new('span').setText(day).setClass('weekDay');
            this.root.append(eDay);
        });
    }
}
export default WeekHeader;
//# sourceMappingURL=WeekHeader.js.map