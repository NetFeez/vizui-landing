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
export declare class History extends Events<History.EventMap> {
    /** The navigation mode derived from the host or the options. **/
    readonly mode: History.Mode;
    /** The navigation host backing this history. **/
    readonly host: History.Host;
    /** The parsed entries of the navigation stack. **/
    protected vEntries: History.Entry[];
    /** The cursor pointing at the current entry. **/
    protected vIndex: number;
    /** The last host location merged, used to detect real changes. **/
    protected vPath: string | null;
    /**
     * Creates a history bound to a navigation host.
     * @param host - The navigation host, DOM or memory.
     * @param options - The history options.
     */
    constructor(host: History.Host, options?: History.Options);
    /** The parsed entries of the navigation stack. **/
    get entries(): History.Entry[];
    /** The cursor pointing at the current entry. **/
    get index(): number;
    /** The current entry, or null when the stack is empty. **/
    get current(): History.Entry | null;
    /** Whether there is an entry before the current one. **/
    get hasPrevious(): boolean;
    /** Whether there is an entry after the current one. **/
    get hasNext(): boolean;
    /**
     * Registers a navigation on the stack and pushes/replaces it on the host.
     * Does not emit `change` (the router drives its own routing for programmatic
     * navigation`s); emits `navigate` with the parsed entry.
     * @param value - The target url.
     * @param action - Whether the navigation pushes or replaces the current entry.
     * @param state - Optional custom state persisted with the history entry.
     * @returns The parsed entry registered on the stack.
     */
    navigate(value: string, action?: History.Action, state?: unknown): History.Entry;
    /** Asks the host to go back (hashchange/popstate → `change`). **/
    back(): void;
    /** Asks the host to go forward (hashchange/popstate → `change`). **/
    forward(): void;
    /** Re-reads the host location, merging it into the current stack. **/
    refresh(): void;
    /**
     * Merges an external host location change (back/forward/refresh) into the stack.
     * @param state - The custom state delivered by the host, when present.
     */
    protected handleHostChange(state?: unknown): void;
    /**
     * Finds the stack index holding a path, starting at a cursor and probing
     * outwards in both directions.
     * @param path - The path to locate.
     * @param from - The cursor to start from.
     * @returns The index holding the path, or -1 when absent.
     */
    protected findPath(path: string, from: number): number;
    /**
     * Splits a raw navigation value into path, search and hash parts.
     * @param value - The raw navigation value.
     * @returns The parsed parts.
     */
    static split(value: string): History.Parts;
    /**
     * Normalizes a path: guarantees a single leading slash and no trailing one.
     * @param path - The raw path.
     * @returns The normalized path.
     */
    static normalize(path: string): string;
    /**
     * Parses a raw navigation value into a history entry.
     * @param value - The raw navigation value.
     * @param state - The custom state persisted with the entry.
     * @returns The parsed entry.
     */
    static parse(value: string, state?: unknown): History.Entry;
    /**
     * Normalizes the path portion of a raw navigation value (query/hash stripped).
     * @param value - The raw navigation value.
     * @returns The normalized path.
     */
    static path(value: string): string;
    /**
     * Serializes a history entry back into a navigation value.
     * @param entry - The entry to serialize.
     * @returns The serialized value.
     */
    static stringify(entry: History.Entry): string;
    /**
     * Derives the navigation mode from a raw location value.
     * @param path - The raw location value.
     * @returns The navigation mode.
     */
    static modeOf(path: string): History.Mode;
    /**
     * Creates the browser history host.
     * @param options - The adapter options.
     * @returns The browser history host.
     */
    static dom(options?: History.Adapter.Options): History.Host;
    /**
     * Creates an in-memory history host.
     * @param initial - The initial path of the stack.
     * @returns The in-memory history host.
     */
    static memory(initial?: string): History.Host;
}
export declare namespace History {
    /** The navigation modes of a history. **/
    type Mode = 'path' | 'hash';
    /** The host actions a navigation can perform. **/
    type Action = 'push' | 'replace';
    /** The options of a history. **/
    interface Options {
        mode?: History.Mode;
    }
    /** The raw parts of a navigation value. **/
    interface Parts {
        path: string;
        search: string;
        hash: string;
    }
    /** A parsed navigation entry of the stack. **/
    interface Entry {
        path: string;
        /** Raw query string including a leading `?` when present, otherwise ''. **/
        search: string;
        /** Fragment without the leading `#`, otherwise ''. **/
        hash: string;
        /** Custom state persisted with the entry, when present. **/
        state?: unknown;
    }
    /** The contract a navigation host implements: DOM or memory. **/
    interface Host {
        /** The current location of the host. **/
        readonly location: Host.Location;
        /** The navigation mode, when the host declares one. **/
        readonly mode?: History.Mode;
        /** Pushes a url onto the host history. **/
        push(url: string, state?: unknown): void;
        /** Replaces the current url of the host history. **/
        replace(url: string, state?: unknown): void;
        /** Goes back in the host history. **/
        back(): void;
        /** Goes forward in the host history. **/
        forward(): void;
        /** Subscribes to host location changes; returns the unsubscribe function. **/
        onChanged(listener: (state?: unknown) => void): () => void;
    }
    namespace Host {
        /** The location value a host exposes. **/
        interface Location {
            path: string;
        }
    }
    /** The events emitted by a history. **/
    type EventMap = {
        /** A programmatic navigation was registered on the stack. **/
        navigate: [entry: History.Entry];
        /** The host location changed externally (back/forward/refresh). **/
        change: [entry: History.Entry];
    };
    class Adapter implements History.Host {
        /** The navigation mode resolved at construction time. **/
        readonly mode: History.Mode;
        /** The domain path under which the hash lives in hash mode. **/
        protected vBase: string;
        /** The listeners notified on host location changes. **/
        protected vListeners: Set<(state?: unknown) => void>;
        /**
         * Creates the browser host. `path` mode reads/writes `location.pathname`;
         * `hash` mode reads/writes the fragment, falling back to a path-mode deep
         * link when the hash is empty (historyApiFallback).
         * @param options - The adapter options.
         */
        constructor(options?: History.Adapter.Options);
        /** The current location of the host. **/
        get location(): History.Host.Location;
        /**
         * Pushes a url onto the host history.
         * @param url - The url to push.
         * @param state - The custom state persisted with the entry.
         */
        push(url: string, state?: unknown): void;
        /**
         * Replaces the current url of the host history.
         * @param url - The url to write.
         * @param state - The custom state persisted with the entry.
         */
        replace(url: string, state?: unknown): void;
        /** Goes back in the host history. **/
        back(): void;
        /** Goes forward in the host history. **/
        forward(): void;
        /**
         * Subscribes to host location changes.
         * @param listener - The listener notified with the host state.
         * @returns The unsubscribe function.
         */
        onChanged(listener: (state?: unknown) => void): () => void;
        /** Notifies every subscribed listener with the host state. **/
        protected handle: () => void;
        /**
         * Reads the current location from the browser.
         * @returns The raw location value.
         */
        protected resolve(): string;
    }
    namespace Adapter {
        /** The options of the browser host. **/
        interface Options {
            /** The navigation mode; derived from the location when omitted. **/
            mode?: History.Mode;
            /** Domain path under which the hash lives in hash mode (e.g. '/app'). **/
            base?: string;
        }
    }
    class Memory implements History.Host {
        /** The current location of the host. **/
        readonly location: History.Host.Location;
        /** The listeners notified on host location changes. **/
        protected vListeners: Set<(state?: unknown) => void>;
        /** The url stack. **/
        protected vStack: string[];
        /** The custom state of each stack entry. **/
        protected vStates: unknown[];
        /** The cursor pointing at the current stack entry. **/
        protected vCursor: number;
        /**
         * Creates an in-memory host for tests and non-DOM environments.
         * @param initial - The initial path of the stack.
         */
        constructor(initial?: string);
        /** The navigation mode; always `path` in memory. **/
        get mode(): History.Mode;
        /**
         * Pushes a url onto the host history.
         * @param url - The url to push.
         * @param state - The custom state persisted with the entry.
         */
        push(url: string, state?: unknown): void;
        /**
         * Replaces the current url of the host history.
         * @param url - The url to write.
         * @param state - The custom state persisted with the entry.
         */
        replace(url: string, state?: unknown): void;
        /** Goes back in the host history. **/
        back(): void;
        /** Goes forward in the host history. **/
        forward(): void;
        /**
         * Subscribes to host location changes.
         * @param listener - The listener notified with the host state.
         * @returns The unsubscribe function.
         */
        onChanged(listener: (state?: unknown) => void): () => void;
        /**
         * Notifies every subscribed listener with the host state.
         * @param state - The custom state to deliver.
         */
        protected notify(state?: unknown): void;
    }
}
export default History;
