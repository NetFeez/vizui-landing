/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Browser/in-memory navigation history for the SPA router. Keeps a
 * stack of parsed URL entries (path/search/hash) in parallel with the host
 * location, so hash mode stays correct even when a path-mode deep link lands on
 * the app (historyApiFallback scenario). Host changes (popstate/hashchange, or
 * in-memory back/forward) are merged back into the stack on `change`.
 * @license Apache-2.0
 */
import Events from '../../../events/Events.js';
export class History extends Events {
    /** The navigation mode derived from the host or the options. **/
    mode;
    /** The navigation host backing this history. **/
    host;
    /** The parsed entries of the navigation stack. **/
    vEntries = [];
    /** The cursor pointing at the current entry. **/
    vIndex = -1;
    /** The last host location merged, used to detect real changes. **/
    vPath = null;
    /**
     * Creates a history bound to a navigation host.
     * @param host - The navigation host, DOM or memory.
     * @param options - The history options.
     */
    constructor(host, options = {}) {
        super();
        this.host = host;
        this.mode = options.mode ?? host.mode ?? History.modeOf(host.location.path);
        host.onChanged((state) => this.handleHostChange(state));
    }
    /** The parsed entries of the navigation stack. **/
    get entries() { return [...this.vEntries]; }
    /** The cursor pointing at the current entry. **/
    get index() { return this.vIndex; }
    /** The current entry, or null when the stack is empty. **/
    get current() { return this.vIndex >= 0 ? this.vEntries[this.vIndex] ?? null : null; }
    /** Whether there is an entry before the current one. **/
    get hasPrevious() { return this.vIndex > 0; }
    /** Whether there is an entry after the current one. **/
    get hasNext() { return this.vIndex >= 0 && this.vIndex < this.vEntries.length - 1; }
    /**
     * Registers a navigation on the stack and pushes/replaces it on the host.
     * Does not emit `change` (the router drives its own routing for programmatic
     * navigation`s); emits `navigate` with the parsed entry.
     * @param value - The target url.
     * @param action - Whether the navigation pushes or replaces the current entry.
     * @param state - Optional custom state persisted with the history entry.
     * @returns The parsed entry registered on the stack.
     */
    navigate(value, action = 'push', state) {
        const entry = History.parse(value, state);
        if (action === 'replace') {
            if (this.vIndex === -1) {
                this.vEntries = [entry];
                this.vIndex = 0;
            }
            else
                this.vEntries[this.vIndex] = entry;
            this.host.replace(History.stringify(entry), state);
        }
        else {
            this.vEntries = [...this.vEntries.slice(0, this.vIndex + 1), entry];
            this.vIndex = this.vEntries.length - 1;
            this.host.push(History.stringify(entry), state);
        }
        this.emit('navigate', entry);
        return entry;
    }
    /** Asks the host to go back (hashchange/popstate → `change`). **/
    back() { this.host.back(); }
    /** Asks the host to go forward (hashchange/popstate → `change`). **/
    forward() { this.host.forward(); }
    /** Re-reads the host location, merging it into the current stack. **/
    refresh() { this.handleHostChange(); }
    /**
     * Merges an external host location change (back/forward/refresh) into the stack.
     * @param state - The custom state delivered by the host, when present.
     */
    handleHostChange(state) {
        const entry = History.parse(this.host.location.path, state);
        if (this.vPath === this.host.location.path)
            return;
        this.vPath = this.host.location.path;
        const index = this.findPath(entry.path, this.vIndex);
        if (index >= 0) {
            this.vEntries = this.vEntries.slice(0, index + 1);
            this.vEntries[index] = entry;
            this.vIndex = index;
        }
        else {
            this.vEntries = [...this.vEntries.slice(0, this.vIndex + 1), entry];
            this.vIndex = this.vEntries.length - 1;
        }
        this.emit('change', entry);
    }
    /**
     * Finds the stack index holding a path, starting at a cursor and probing
     * outwards in both directions.
     * @param path - The path to locate.
     * @param from - The cursor to start from.
     * @returns The index holding the path, or -1 when absent.
     */
    findPath(path, from) {
        if (from >= 0 && from < this.vEntries.length &&
            this.vEntries[from] && this.vEntries[from].path === path)
            return from;
        for (let index = from - 1; index >= 0; index--)
            if (this.vEntries[index]?.path === path)
                return index;
        for (let index = from + 1; index < this.vEntries.length; index++)
            if (this.vEntries[index]?.path === path)
                return index;
        return -1;
    }
    // ========== Parsing ==========
    /**
     * Splits a raw navigation value into path, search and hash parts.
     * @param value - The raw navigation value.
     * @returns The parsed parts.
     */
    static split(value) {
        const hashIndex = value.indexOf('#');
        const hash = hashIndex >= 0 ? value.slice(hashIndex + 1) : '';
        const origin = hashIndex >= 0 ? value.slice(0, hashIndex) : value;
        const queryIndex = origin.indexOf('?');
        const search = queryIndex >= 0 ? origin.slice(queryIndex) : '';
        const path = (queryIndex >= 0 ? origin.slice(0, queryIndex) : origin) || '/';
        return { path, search, hash };
    }
    /**
     * Normalizes a path: guarantees a single leading slash and no trailing one.
     * @param path - The raw path.
     * @returns The normalized path.
     */
    static normalize(path) {
        let normalized = path.startsWith('/') ? path : `/${path}`;
        normalized = normalized.replace(/\/+/g, '/');
        if (normalized.length > 1 && normalized.endsWith('/'))
            normalized = normalized.slice(0, -1);
        return normalized;
    }
    /**
     * Parses a raw navigation value into a history entry.
     * @param value - The raw navigation value.
     * @param state - The custom state persisted with the entry.
     * @returns The parsed entry.
     */
    static parse(value, state) {
        const { path, search, hash } = this.split(value);
        const entry = { path: this.normalize(path), search, hash };
        if (state !== undefined)
            entry.state = state;
        return entry;
    }
    /**
     * Normalizes the path portion of a raw navigation value (query/hash stripped).
     * @param value - The raw navigation value.
     * @returns The normalized path.
     */
    static path(value) {
        return this.normalize(this.split(value).path);
    }
    /**
     * Serializes a history entry back into a navigation value.
     * @param entry - The entry to serialize.
     * @returns The serialized value.
     */
    static stringify(entry) {
        return `${entry.path}${entry.search}${entry.hash ? `#${entry.hash}` : ''}`;
    }
    /**
     * Derives the navigation mode from a raw location value.
     * @param path - The raw location value.
     * @returns The navigation mode.
     */
    static modeOf(path) {
        return path.startsWith('#') ? 'hash' : 'path';
    }
    /**
     * Creates the browser history host.
     * @param options - The adapter options.
     * @returns The browser history host.
     */
    static dom(options) { return new History.Adapter(options); }
    /**
     * Creates an in-memory history host.
     * @param initial - The initial path of the stack.
     * @returns The in-memory history host.
     */
    static memory(initial = '/') { return new History.Memory(initial); }
}
(function (History) {
    class Adapter {
        /** The navigation mode resolved at construction time. **/
        mode;
        /** The domain path under which the hash lives in hash mode. **/
        vBase;
        /** The listeners notified on host location changes. **/
        vListeners = new Set();
        /**
         * Creates the browser host. `path` mode reads/writes `location.pathname`;
         * `hash` mode reads/writes the fragment, falling back to a path-mode deep
         * link when the hash is empty (historyApiFallback).
         * @param options - The adapter options.
         */
        constructor(options = {}) {
            if (typeof window === 'undefined')
                throw new Error('[History.Adapter] The DOM adapter requires a browser environment.');
            this.vBase = options.base ?? '';
            const hashPresent = window.location.hash.length > 1;
            this.mode = options.mode ?? (hashPresent ? 'hash' : 'path');
            window.addEventListener('popstate', this.handle);
            if (this.mode === 'hash')
                window.addEventListener('hashchange', this.handle);
        }
        /** The current location of the host. **/
        get location() {
            return { path: this.resolve() };
        }
        /**
         * Pushes a url onto the host history.
         * @param url - The url to push.
         * @param state - The custom state persisted with the entry.
         */
        push(url, state) {
            if (this.mode === 'hash') {
                const target = `${this.vBase}#${url}`;
                if (window.location.pathname + window.location.search !== this.vBase) {
                    window.history.replaceState(state ?? null, '', target);
                    return;
                }
                window.history.pushState(state ?? null, '', target);
                return;
            }
            window.history.pushState(state ?? null, '', url);
        }
        /**
         * Replaces the current url of the host history.
         * @param url - The url to write.
         * @param state - The custom state persisted with the entry.
         */
        replace(url, state) {
            window.history.replaceState(state ?? null, '', this.mode === 'hash' ? `${this.vBase}#${url}` : url);
        }
        /** Goes back in the host history. **/
        back() { window.history.back(); }
        /** Goes forward in the host history. **/
        forward() { window.history.forward(); }
        /**
         * Subscribes to host location changes.
         * @param listener - The listener notified with the host state.
         * @returns The unsubscribe function.
         */
        onChanged(listener) {
            this.vListeners.add(listener);
            return () => { this.vListeners.delete(listener); };
        }
        /** Notifies every subscribed listener with the host state. **/
        handle = () => {
            const state = window.history.state;
            for (const listener of Array.from(this.vListeners))
                listener(state);
        };
        /**
         * Reads the current location from the browser.
         * @returns The raw location value.
         */
        resolve() {
            if (this.mode === 'hash') {
                const hash = window.location.hash.slice(1);
                if (hash)
                    return hash;
            }
            return window.location.pathname + window.location.search;
        }
    }
    History.Adapter = Adapter;
    class Memory {
        /** The current location of the host. **/
        location;
        /** The listeners notified on host location changes. **/
        vListeners = new Set();
        /** The url stack. **/
        vStack;
        /** The custom state of each stack entry. **/
        vStates;
        /** The cursor pointing at the current stack entry. **/
        vCursor;
        /**
         * Creates an in-memory host for tests and non-DOM environments.
         * @param initial - The initial path of the stack.
         */
        constructor(initial = '/') {
            this.vStack = [initial];
            this.vStates = [];
            this.vCursor = 0;
            this.location = { path: initial };
        }
        /** The navigation mode; always `path` in memory. **/
        get mode() { return 'path'; }
        /**
         * Pushes a url onto the host history.
         * @param url - The url to push.
         * @param state - The custom state persisted with the entry.
         */
        push(url, state) {
            this.location.path = url;
            this.vStack = [...this.vStack.slice(0, this.vCursor + 1), url];
            this.vStates = [...this.vStates.slice(0, this.vCursor + 1), state];
            this.vCursor = this.vStack.length - 1;
        }
        /**
         * Replaces the current url of the host history.
         * @param url - The url to write.
         * @param state - The custom state persisted with the entry.
         */
        replace(url, state) {
            this.location.path = url;
            this.vStack[this.vCursor] = url;
            this.vStates[this.vCursor] = state;
        }
        /** Goes back in the host history. **/
        back() {
            if (this.vCursor <= 0)
                return;
            this.vCursor -= 1;
            this.location.path = this.vStack[this.vCursor];
            this.notify(this.vStates[this.vCursor]);
        }
        /** Goes forward in the host history. **/
        forward() {
            if (this.vCursor >= this.vStack.length - 1)
                return;
            this.vCursor += 1;
            this.location.path = this.vStack[this.vCursor];
            this.notify(this.vStates[this.vCursor]);
        }
        /**
         * Subscribes to host location changes.
         * @param listener - The listener notified with the host state.
         * @returns The unsubscribe function.
         */
        onChanged(listener) {
            this.vListeners.add(listener);
            return () => { this.vListeners.delete(listener); };
        }
        /**
         * Notifies every subscribed listener with the host state.
         * @param state - The custom state to deliver.
         */
        notify(state) { for (const listener of Array.from(this.vListeners))
            listener(state); }
    }
    History.Memory = Memory;
})(History || (History = {}));
export default History;
//# sourceMappingURL=History.js.map