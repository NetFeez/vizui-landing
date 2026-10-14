/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description HTTP client factory with shared defaults and JSON conveniences.
 * @license Apache-2.0
 */
import Request from './Request.js';
export { Request } from './Request.js';
export { Response } from './Response.js';
export { Body } from './Body.js';
export declare class HttpClient {
    protected readonly vBase: string;
    protected readonly vDefaults: HttpClient.Options;
    constructor(base?: string, defaults?: HttpClient.Options);
    request(url: string, options?: Request.Options): Request;
    get(url: string, options?: HttpClient.Options): Request;
    post(url: string, options?: HttpClient.Options): Request;
    put(url: string, options?: HttpClient.Options): Request;
    patch(url: string, options?: HttpClient.Options): Request;
    delete(url: string, options?: HttpClient.Options): Request;
    head(url: string, options?: HttpClient.Options): Request;
    options(url: string, options?: HttpClient.Options): Request;
    getJson<T = unknown>(url: string, options?: HttpClient.Options): Promise<T>;
    postJson<T = unknown>(url: string, body: unknown, options?: HttpClient.Options): Promise<T>;
    putJson<T = unknown>(url: string, body: unknown, options?: HttpClient.Options): Promise<T>;
    patchJson<T = unknown>(url: string, body: unknown, options?: HttpClient.Options): Promise<T>;
    deleteJson<T = unknown>(url: string, options?: HttpClient.Options): Promise<T>;
    protected json<T>(request: Request): Promise<T>;
    protected buildUrl(url: string): string;
}
export declare namespace HttpClient {
    type Options = Omit<Request.Options, 'method'>;
}
export default HttpClient;
