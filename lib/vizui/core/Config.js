/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Typed application configuration shared by the VizUI composition root.
 * @license Apache-2.0
 */
export class Config {
    /** The base path every route is prefixed with. **/
    base;
    /**
     * Creates the application configuration.
     * @param options - The raw configuration options.
     */
    constructor(options = {}) {
        this.base = Config.normalizeBase(options.base);
    }
    /**
     * Normalizes a base path: guarantees a single leading slash and no trailing one.
     * @param base - The raw base path.
     * @returns The normalized base path.
     */
    static normalizeBase(base = '') {
        if (!base)
            return '';
        const normalized = base.startsWith('/') ? base : `/${base}`;
        return normalized.length > 1 && normalized.endsWith('/')
            ? normalized.slice(0, -1)
            : normalized;
    }
}
export default Config;
//# sourceMappingURL=Config.js.map