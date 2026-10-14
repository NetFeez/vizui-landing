/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Tracks event listeners for a Node, allowing for bulk unbinding.
 * @license Apache-2.0
 */
export declare class EventTracker {
    /** The list of tracked event listeners. **/
    private listeners;
    get entries(): readonly EventTracker.Entry[];
    /**
     * Adds a tracked event listener entry to the tracker.
     * @param entry - The event listener entry to add.
     * @returns This tracker, for chaining.
     */
    add(entry: EventTracker.Entry): this;
    /**
     * Removes a tracked event listener entry.
     * @param filter - The filter to match against.
     * @returns This tracker, for chaining.
     */
    delete(filter?: Partial<EventTracker.Entry>): this;
    /**
     * Finds a tracked event listener entry that matches the provided filter.
     * @param filter - The filter to match against.
     * @returns The first matching event listener entry, or undefined if none found.
     */
    find(filter?: Partial<EventTracker.Entry>): EventTracker.Entry | undefined;
    /**
     * Checks whether two event listener entries match in terms of name, listener, and capture options.
     * @param entry - The event listener entry to check.
     * @param filter - The filter to match against.
     * @returns True if the entry matches the filter, false otherwise.
     */
    static matches(entry: EventTracker.Entry, filter: Partial<EventTracker.Entry>): boolean;
    /**
     * Determines the capture option from the event listener options.
     * @param options - The event listener options.
     * @returns True if the listener is set to capture, false otherwise.
     */
    static capture(options?: EventTracker.Options): boolean;
}
export declare namespace EventTracker {
    /** A tracked event listener. **/
    interface Entry {
        name: string;
        listener: EventListenerOrEventListenerObject;
        wrapped?: EventListenerOrEventListenerObject;
        options?: Options;
    }
    /** The options accepted by event listener methods. **/
    type Options = boolean | AddEventListenerOptions;
}
export default EventTracker;
