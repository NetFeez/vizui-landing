/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Cached response body reader for browser HTTP responses.
 * @license Apache-2.0
 */
export declare class Body {
    protected vResponse: globalThis.Response;
    protected vArrayBuffer?: Promise<ArrayBuffer>;
    protected vBlob?: Promise<Blob>;
    protected vText?: Promise<string>;
    protected vJson?: Promise<unknown>;
    constructor(response: globalThis.Response);
    /** Reads the response body as an ArrayBuffer. **/
    arrayBuffer(): Promise<ArrayBuffer>;
    /** Reads the response body as a Blob. **/
    blob(): Promise<Blob>;
    /** Reads the response body as text. **/
    text(): Promise<string>;
    /** Reads and parses the response body as JSON. **/
    json<T = unknown>(): Promise<T>;
}
export default Body;
