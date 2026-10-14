/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description HTTP response wrapper exposing metadata and cached body readers.
 * @license Apache-2.0
 */
import Body from './Body.js';
import NetworkError from './NetworkError.js';
export class Response {
    vResponse;
    body;
    headers;
    status;
    statusText;
    url;
    redirected;
    constructor(vResponse) {
        this.vResponse = vResponse;
        this.body = new Body(vResponse);
        this.headers = vResponse.headers;
        this.status = vResponse.status;
        this.statusText = vResponse.statusText;
        this.url = vResponse.url;
        this.redirected = vResponse.redirected;
    }
    get ok() { return this.vResponse.ok; }
    get type() { return this.vResponse.type; }
    /** Reads the response as JSON. **/
    json() {
        return this.status === 204 ? Promise.resolve(undefined) : this.body.json();
    }
    /** Reads the response as text. **/
    text() { return this.body.text(); }
    /** Converts a non-successful response into a typed network error. **/
    async toError() {
        let body;
        try {
            body = await this.json();
        }
        catch {
            try {
                body = await this.text();
            }
            catch {
                body = undefined;
            }
        }
        return new NetworkError(`Request failed with status ${this.status}`, NetworkError.Kind.HTTP, this.status, body, this);
    }
}
export default Response;
//# sourceMappingURL=Response.js.map