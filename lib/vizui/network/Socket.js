/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description WebSocket client wrapper with automatic reconnection.
 * @license Apache-2.0
 */
import Events from '../events/Events.js';
export class Socket extends Events {
    url;
    vOptions;
    /** The underlying websocket, when connected. **/
    vSocket = null;
    /** The number of consecutive failed connections. **/
    vAttempts = 0;
    /** Whether the socket was closed on purpose and must not reconnect. **/
    vClosed = false;
    /** The pending reconnection timer, when scheduled. **/
    vTimer = null;
    /**
     * Creates a socket and starts connecting immediately.
     * @param url - The websocket url.
     * @param options - The connection options.
     */
    constructor(url, vOptions = {}) {
        super();
        this.url = url;
        this.vOptions = vOptions;
        this.connect();
    }
    /** Whether the socket is currently open. **/
    get connected() { return this.vSocket?.readyState === WebSocket.OPEN; }
    /** The number of consecutive reconnection attempts performed. **/
    get attempts() { return this.vAttempts; }
    /** The current connection status. **/
    get status() {
        switch (this.vSocket?.readyState) {
            case WebSocket.OPEN: return 'open';
            case WebSocket.CONNECTING: return 'connecting';
            default: return 'closed';
        }
    }
    /** Whether the connection has been closed. **/
    get isClosed() { return this.status === 'closed'; }
    /**
     * Creates a socket and starts connecting immediately.
     * @param url - The websocket url.
     * @param options - The connection options.
     * @returns The socket.
     */
    static connect(url, options) { return new Socket(url, options); }
    /**
     * Sends data through the socket when open.
     * @param data - The data to send.
     * @returns Whether the data was sent.
     */
    send(data) {
        if (!this.connected)
            return false;
        this.vSocket.send(data);
        return true;
    }
    /**
     * Sends a JSON-serializable value through the socket as a text frame.
     * @param data - The value to serialize and send.
     * @returns Whether the data was sent.
     */
    sendJson(data) {
        return this.send(JSON.stringify(data));
    }
    /** Closes the socket and stops reconnecting. **/
    close() {
        this.vClosed = true;
        this.clearTimer();
        this.vSocket?.close();
        this.vSocket = null;
        this.emit('close');
    }
    /** Establishes the underlying websocket connection. **/
    connect() {
        if (this.vClosed)
            return;
        this.vSocket = new WebSocket(this.url);
        this.vSocket.addEventListener('open', () => {
            this.vAttempts = 0;
            this.emit('open');
        });
        this.vSocket.addEventListener('message', (event) => this.handleMessage(event.data));
        this.vSocket.addEventListener('error', (event) => {
            const error = 'error' in event && event.error instanceof Error
                ? event.error
                : new Error('WebSocket error.');
            this.emit('error', error);
        });
        this.vSocket.addEventListener('close', () => {
            this.vSocket = null;
            if (this.vClosed)
                return;
            this.emit('close');
            this.scheduleReconnect();
        });
    }
    /**
     * Routes an incoming message to the matching events.
     * @param data - The raw message payload.
     */
    handleMessage(data) {
        this.emit('message', data);
        if (typeof data === 'string')
            this.emit('message:text', data);
        else
            this.emit('message:binary', data);
    }
    /** Schedules a reconnection attempt after the configured delay. **/
    scheduleReconnect() {
        const options = this.vOptions;
        if (options.autoReconnect === false)
            return;
        const max = options.maxAttempts ?? Number.POSITIVE_INFINITY;
        if (this.vAttempts >= max)
            return;
        this.clearTimer();
        const delay = options.delay ?? 1000;
        this.vTimer = window.setTimeout(() => {
            this.vAttempts += 1;
            this.connect();
        }, delay);
    }
    /** Clears any pending reconnection timer. **/
    clearTimer() {
        if (this.vTimer !== null) {
            window.clearTimeout(this.vTimer);
            this.vTimer = null;
        }
    }
}
export default Socket;
//# sourceMappingURL=Socket.js.map