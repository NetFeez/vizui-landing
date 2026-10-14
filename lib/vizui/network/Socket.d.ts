/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description WebSocket client wrapper with automatic reconnection.
 * @license Apache-2.0
 */
import Events from '../events/Events.js';
export declare class Socket extends Events<Socket.EventMap> {
    readonly url: string;
    private readonly vOptions;
    /** The underlying websocket, when connected. **/
    private vSocket;
    /** The number of consecutive failed connections. **/
    private vAttempts;
    /** Whether the socket was closed on purpose and must not reconnect. **/
    private vClosed;
    /** The pending reconnection timer, when scheduled. **/
    private vTimer;
    /**
     * Creates a socket and starts connecting immediately.
     * @param url - The websocket url.
     * @param options - The connection options.
     */
    constructor(url: string, vOptions?: Socket.Options);
    /** Whether the socket is currently open. **/
    get connected(): boolean;
    /** The number of consecutive reconnection attempts performed. **/
    get attempts(): number;
    /** The current connection status. **/
    get status(): Socket.Status;
    /** Whether the connection has been closed. **/
    get isClosed(): boolean;
    /**
     * Creates a socket and starts connecting immediately.
     * @param url - The websocket url.
     * @param options - The connection options.
     * @returns The socket.
     */
    static connect(url: string, options?: Socket.Options): Socket;
    /**
     * Sends data through the socket when open.
     * @param data - The data to send.
     * @returns Whether the data was sent.
     */
    send(data: string | Blob | ArrayBuffer): boolean;
    /**
     * Sends a JSON-serializable value through the socket as a text frame.
     * @param data - The value to serialize and send.
     * @returns Whether the data was sent.
     */
    sendJson(data: unknown): boolean;
    /** Closes the socket and stops reconnecting. **/
    close(): void;
    /** Establishes the underlying websocket connection. **/
    private connect;
    /**
     * Routes an incoming message to the matching events.
     * @param data - The raw message payload.
     */
    private handleMessage;
    /** Schedules a reconnection attempt after the configured delay. **/
    private scheduleReconnect;
    /** Clears any pending reconnection timer. **/
    private clearTimer;
}
export declare namespace Socket {
    /** The connection options of a socket. **/
    interface Options {
        /** Whether failed connections reconnect automatically. **/
        autoReconnect?: boolean;
        /** The milliseconds between reconnection attempts. **/
        delay?: number;
        /** The maximum number of reconnection attempts. **/
        maxAttempts?: number;
    }
    /** The connection status of a socket. **/
    type Status = 'connecting' | 'open' | 'closed';
    /** The events emitted by a socket. **/
    type EventMap = {
        /** The connection was established. **/
        open: [];
        /** The connection was closed. **/
        close: [];
        /** A message arrived in any format. **/
        message: [data: string | Blob | ArrayBuffer];
        /** A text message arrived. **/
        'message:text': [data: string];
        /** A binary message arrived. **/
        'message:binary': [data: Blob | ArrayBuffer];
        /** A connection error occurred. **/
        error: [error: Error];
    };
}
export default Socket;
