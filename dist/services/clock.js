/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Shared clock service: advances a reactive store of the current time once per second.
 * @license Apache-2.0
 */
import { Store } from 'vizui';
/**
 * A global clock that keeps the current time in a reactive store.
 * Connected eagerly from the composition root, like the client's `ServerEvents`.
 */
export class ClockService {
    /** The current wall-clock time. **/
    now = Store.create(new Date());
    vTimer = null;
    /** Whether the clock is ticking. **/
    get connected() { return this.vTimer !== null; }
    /** Starts ticking; a second call is a no-op. **/
    connect() {
        if (this.vTimer)
            return;
        this.vTimer = setInterval(() => this.now.set(new Date()), 1000);
    }
    /** Stops ticking; a second call is a no-op. **/
    disconnect() {
        if (this.vTimer === null)
            return;
        clearInterval(this.vTimer);
        this.vTimer = null;
    }
}
export const clockService = new ClockService();
export default clockService;
//# sourceMappingURL=clock.js.map