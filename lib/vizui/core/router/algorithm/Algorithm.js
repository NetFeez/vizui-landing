/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Algorithm abstraction for route matching. Separates the router
 * from how rules are stored/searched (FIFO linear vs Tree). Port of Vortez Algorithm.
 * @license Apache-2.0
 */
export class Algorithm {
    /**
     * Tests whether any rule matches a URL.
     * @param url - The url to match.
     * @returns Whether any rule matches the url.
     */
    test(url) {
        return this.find(url) !== null;
    }
}
export default Algorithm;
//# sourceMappingURL=Algorithm.js.map