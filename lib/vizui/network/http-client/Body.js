/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Cached response body reader for browser HTTP responses.
 * @license Apache-2.0
 */
export class Body {
    vResponse;
    vArrayBuffer;
    vBlob;
    vText;
    vJson;
    constructor(response) { this.vResponse = response; }
    /** Reads the response body as an ArrayBuffer. **/
    arrayBuffer() { return this.vArrayBuffer ??= this.vResponse.arrayBuffer(); }
    /** Reads the response body as a Blob. **/
    blob() {
        return this.vBlob ??= this.arrayBuffer().then((buffer) => new Blob([buffer], {
            type: this.vResponse.headers.get('content-type') ?? '',
        }));
    }
    /** Reads the response body as text. **/
    text() {
        return this.vText ??= this.arrayBuffer().then((buffer) => new TextDecoder().decode(buffer));
    }
    /** Reads and parses the response body as JSON. **/
    async json() {
        this.vJson ??= this.text().then((text) => JSON.parse(text));
        return await this.vJson;
    }
}
export default Body;
//# sourceMappingURL=Body.js.map