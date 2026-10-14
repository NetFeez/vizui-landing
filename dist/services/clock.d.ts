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
export declare class ClockService {
    /** The current wall-clock time. **/
    readonly now: Store<Date>;
    private vTimer;
    /** Whether the clock is ticking. **/
    get connected(): boolean;
    /** Starts ticking; a second call is a no-op. **/
    connect(): void;
    /** Stops ticking; a second call is a no-op. **/
    disconnect(): void;
}
export declare const clockService: ClockService;
export default clockService;
