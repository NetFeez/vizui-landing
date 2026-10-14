/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Network error contract shared by http and socket clients.
 * @license Apache-2.0
 */
export declare class NetworkError extends Error {
    readonly kind: NetworkError.Kind;
    readonly status?: number | undefined;
    readonly body?: unknown;
    readonly response?: unknown;
    readonly cause?: unknown;
    /**
     * Creates a network error.
     * @param message - The error message.
     * @param kind - The category of the failure.
     * @param status - The http status, when the failure came from a response.
     */
    constructor(message: string, kind: NetworkError.Kind, status?: number | undefined, body?: unknown, response?: unknown, cause?: unknown);
    /** Whether the failure was a timeout. **/
    get isTimeout(): boolean;
    /** Whether the failure was an abort. **/
    get isAbort(): boolean;
    /** Whether the failure was an http error response. **/
    get isHttp(): boolean;
}
export declare namespace NetworkError {
    /** The categories of network failures. **/
    enum Kind {
        NETWORK = "network",
        TIMEOUT = "timeout",
        ABORT = "abort",
        HTTP = "http",
        PARSE = "parse"
    }
}
export default NetworkError;
