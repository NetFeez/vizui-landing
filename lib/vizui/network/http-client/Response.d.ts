/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description HTTP response wrapper exposing metadata and cached body readers.
 * @license Apache-2.0
 */
import Body from './Body.js';
import NetworkError from './NetworkError.js';
export declare class Response {
    protected readonly vResponse: globalThis.Response;
    readonly body: Body;
    readonly headers: Headers;
    readonly status: number;
    readonly statusText: string;
    readonly url: string;
    readonly redirected: boolean;
    constructor(vResponse: globalThis.Response);
    get ok(): boolean;
    get type(): Response.Type;
    /** Reads the response as JSON. **/
    json<T = unknown>(): Promise<T>;
    /** Reads the response as text. **/
    text(): Promise<string>;
    /** Converts a non-successful response into a typed network error. **/
    toError(): Promise<NetworkError>;
}
export declare namespace Response {
    type Type = globalThis.Response['type'];
}
export default Response;
