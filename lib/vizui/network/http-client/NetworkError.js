/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Network error contract shared by http and socket clients.
 * @license Apache-2.0
 */
export class NetworkError extends Error {
    kind;
    status;
    body;
    response;
    cause;
    /**
     * Creates a network error.
     * @param message - The error message.
     * @param kind - The category of the failure.
     * @param status - The http status, when the failure came from a response.
     */
    constructor(message, kind, status, body, response, cause) {
        super(message, { cause });
        this.kind = kind;
        this.status = status;
        this.body = body;
        this.response = response;
        this.cause = cause;
    }
    /** Whether the failure was a timeout. **/
    get isTimeout() { return this.kind === NetworkError.Kind.TIMEOUT; }
    /** Whether the failure was an abort. **/
    get isAbort() { return this.kind === NetworkError.Kind.ABORT; }
    /** Whether the failure was an http error response. **/
    get isHttp() { return this.kind === NetworkError.Kind.HTTP; }
}
(function (NetworkError) {
    /** The categories of network failures. **/
    let Kind;
    (function (Kind) {
        Kind["NETWORK"] = "network";
        Kind["TIMEOUT"] = "timeout";
        Kind["ABORT"] = "abort";
        Kind["HTTP"] = "http";
        Kind["PARSE"] = "parse";
    })(Kind = NetworkError.Kind || (NetworkError.Kind = {}));
})(NetworkError || (NetworkError = {}));
export default NetworkError;
//# sourceMappingURL=NetworkError.js.map