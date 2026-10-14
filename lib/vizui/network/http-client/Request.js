/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Fluent browser HTTP request builder backed by fetch.
 * @license Apache-2.0
 */
import Response from './Response.js';
import NetworkError from './NetworkError.js';
export class Request {
    vUrl;
    vMethod = 'GET';
    vHeaders = {};
    vSearchParams = new URLSearchParams();
    vBody;
    vTimeout;
    vSignal;
    vFetchOptions = {};
    constructor(url, options = {}) {
        this.vUrl = url;
        this.applyOptions(options);
    }
    applyOptions(options) {
        if (options.method)
            this.method(options.method);
        if (options.headers)
            this.headers(options.headers);
        if (options.searchParams)
            this.searchParams(options.searchParams);
        if (options.body !== undefined)
            this.body(options.body);
        if (options.json !== undefined)
            this.json(options.json);
        if (options.timeout !== undefined)
            this.timeout(options.timeout);
        if (options.signal)
            this.signal(options.signal);
        this.vFetchOptions = { ...options.fetch };
        return this;
    }
    method(method) { this.vMethod = method; return this; }
    header(name, value) { this.vHeaders[name] = value; return this; }
    headers(headers) { Object.assign(this.vHeaders, headers); return this; }
    search(name, value) { this.vSearchParams.set(name, String(value)); return this; }
    searchParams(params) {
        for (const [key, value] of Object.entries(params))
            this.search(key, value);
        return this;
    }
    body(body) { this.vBody = body; return this; }
    json(value) {
        this.header('content-type', 'application/json');
        this.vBody = JSON.stringify(value);
        return this;
    }
    timeout(timeout) { this.vTimeout = timeout; return this; }
    signal(signal) { this.vSignal = signal; return this; }
    /** Sends the request and preserves non-successful HTTP responses. */
    async send() {
        const controller = new AbortController();
        let timedOut = false;
        let timer;
        const abort = () => controller.abort();
        if (this.vSignal) {
            if (this.vSignal.aborted)
                controller.abort();
            else
                this.vSignal.addEventListener('abort', abort, { once: true });
        }
        if (this.vTimeout !== undefined)
            timer = setTimeout(() => { timedOut = true; controller.abort(); }, this.vTimeout);
        try {
            const response = await fetch(this.vUrlWithSearch(), {
                ...this.vFetchOptions,
                method: this.vMethod,
                headers: this.vHeaders,
                body: this.fetchBody(),
                signal: controller.signal,
            });
            return new Response(response);
        }
        catch (cause) {
            if (timedOut)
                throw new NetworkError('The request timed out', NetworkError.Kind.TIMEOUT, undefined, undefined, undefined, cause);
            if (controller.signal.aborted)
                throw new NetworkError('The request was aborted', NetworkError.Kind.ABORT, undefined, undefined, undefined, cause);
            throw new NetworkError('The request failed', NetworkError.Kind.NETWORK, undefined, undefined, undefined, cause);
        }
        finally {
            if (timer)
                clearTimeout(timer);
            this.vSignal?.removeEventListener('abort', abort);
        }
    }
    then(onfulfilled, onrejected) { return this.send().then(onfulfilled, onrejected); }
    vUrlWithSearch() {
        const url = new URL(this.vUrl, typeof window !== 'undefined' ? window.location.href : 'http://localhost/');
        for (const [key, value] of this.vSearchParams)
            url.searchParams.set(key, value);
        return this.vUrl.startsWith('/') || this.vUrl.startsWith('.') ? `${url.pathname}${url.search}${url.hash}` : url.toString();
    }
    fetchBody() {
        if (this.vBody === undefined || this.vBody === null)
            return undefined;
        if (typeof this.vBody === 'string' || this.vBody instanceof ArrayBuffer)
            return this.vBody;
        if (typeof Blob !== 'undefined' && this.vBody instanceof Blob)
            return this.vBody;
        if (typeof FormData !== 'undefined' && this.vBody instanceof FormData)
            return this.vBody;
        return JSON.stringify(this.vBody);
    }
}
export default Request;
//# sourceMappingURL=Request.js.map