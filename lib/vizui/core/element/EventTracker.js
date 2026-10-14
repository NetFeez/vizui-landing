/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Tracks event listeners for a Node, allowing for bulk unbinding.
 * @license Apache-2.0
 */
export class EventTracker {
    /** The list of tracked event listeners. **/
    listeners = [];
    get entries() { return [...this.listeners]; }
    /**
     * Adds a tracked event listener entry to the tracker.
     * @param entry - The event listener entry to add.
     * @returns This tracker, for chaining.
     */
    add(entry) {
        this.listeners.push(entry);
        return this;
    }
    /**
     * Removes a tracked event listener entry.
     * @param filter - The filter to match against.
     * @returns This tracker, for chaining.
     */
    delete(filter = {}) {
        if (Object.keys(filter).length === 0) {
            this.listeners = [];
            return this;
        }
        this.listeners = this.listeners.filter((entry) => {
            return !EventTracker.matches(entry, filter);
        });
        return this;
    }
    /**
     * Finds a tracked event listener entry that matches the provided filter.
     * @param filter - The filter to match against.
     * @returns The first matching event listener entry, or undefined if none found.
     */
    find(filter = {}) {
        return this.listeners.find((entry) => EventTracker.matches(entry, filter));
    }
    /**
     * Checks whether two event listener entries match in terms of name, listener, and capture options.
     * @param entry - The event listener entry to check.
     * @param filter - The filter to match against.
     * @returns True if the entry matches the filter, false otherwise.
     */
    static matches(entry, filter) {
        if (filter.name && entry.name !== filter.name)
            return false;
        if (filter.listener && entry.listener !== filter.listener)
            return false;
        return EventTracker.capture(filter.options) === EventTracker.capture(entry.options);
    }
    /**
     * Determines the capture option from the event listener options.
     * @param options - The event listener options.
     * @returns True if the listener is set to capture, false otherwise.
     */
    static capture(options) {
        return typeof options === 'boolean' ? options : !!options?.capture;
    }
}
export default EventTracker;
//# sourceMappingURL=EventTracker.js.map