/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Fluent browser HTTP request builder backed by fetch.
 * @license Apache-2.0
 */
import Response from './Response.js';
export declare class Request implements PromiseLike<Response> {
    protected vUrl: string;
    protected vMethod: Request.Method;
    protected vHeaders: Record<string, string>;
    protected vSearchParams: URLSearchParams;
    protected vBody?: Request.Body;
    protected vTimeout?: number;
    protected vSignal?: AbortSignal;
    protected vFetchOptions: RequestInit;
    constructor(url: string, options?: Request.Options);
    protected applyOptions(options: Request.Options): this;
    method(method: Request.Method): this;
    header(name: string, value: string): this;
    headers(headers: Record<string, string>): this;
    search(name: string, value: Request.SearchValue): this;
    searchParams(params: Record<string, Request.SearchValue>): this;
    body(body: Request.Body): this;
    json(value: unknown): this;
    timeout(timeout: number): this;
    signal(signal: AbortSignal): this;
    /** Sends the request and preserves non-successful HTTP responses. */
    send(): Promise<Response>;
    then<TResult1 = Response, TResult2 = never>(onfulfilled?: ((value: Response) => TResult1 | PromiseLike<TResult1>) | null, onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null): Promise<TResult1 | TResult2>;
    protected vUrlWithSearch(): string;
    protected fetchBody(): BodyInit | undefined;
}
export declare namespace Request {
    type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'TRACE';
    type SearchValue = string | number | boolean;
    type Body = string | FormData | Record<string, unknown> | Blob | ArrayBuffer | null;
    interface Options {
        method?: Method;
        headers?: Record<string, string>;
        searchParams?: Record<string, SearchValue>;
        body?: Body;
        json?: unknown;
        timeout?: number;
        signal?: AbortSignal;
        fetch?: RequestInit;
    }
}
export default Request;
