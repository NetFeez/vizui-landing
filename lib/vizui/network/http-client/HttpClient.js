/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description HTTP client factory with shared defaults and JSON conveniences.
 * @license Apache-2.0
 */
import Request from './Request.js';
export { Request } from './Request.js';
export { Response } from './Response.js';
export { Body } from './Body.js';
export class HttpClient {
    vBase;
    vDefaults;
    constructor(base = '', defaults = {}) {
        this.vBase = base.replace(/\/$/, '');
        this.vDefaults = { ...defaults, headers: { ...defaults.headers } };
    }
    request(url, options = {}) {
        return new Request(this.buildUrl(url), {
            ...this.vDefaults,
            ...options,
            headers: { ...this.vDefaults.headers, ...options.headers },
        });
    }
    get(url, options = {}) { return this.request(url, { ...options, method: 'GET' }); }
    post(url, options = {}) { return this.request(url, { ...options, method: 'POST' }); }
    put(url, options = {}) { return this.request(url, { ...options, method: 'PUT' }); }
    patch(url, options = {}) { return this.request(url, { ...options, method: 'PATCH' }); }
    delete(url, options = {}) { return this.request(url, { ...options, method: 'DELETE' }); }
    head(url, options = {}) { return this.request(url, { ...options, method: 'HEAD' }); }
    options(url, options = {}) { return this.request(url, { ...options, method: 'OPTIONS' }); }
    async getJson(url, options = {}) { return this.json(this.get(url, options)); }
    async postJson(url, body, options = {}) { return this.json(this.post(url, { ...options, json: body })); }
    async putJson(url, body, options = {}) { return this.json(this.put(url, { ...options, json: body })); }
    async patchJson(url, body, options = {}) { return this.json(this.patch(url, { ...options, json: body })); }
    async deleteJson(url, options = {}) { return this.json(this.delete(url, options)); }
    async json(request) {
        const response = await request;
        if (!response.ok)
            throw await response.toError();
        return response.json();
    }
    buildUrl(url) {
        if (!this.vBase || /^https?:\/\//i.test(url))
            return url;
        return `${this.vBase}/${url.replace(/^\//, '')}`;
    }
}
export default HttpClient;
//# sourceMappingURL=HttpClient.js.map