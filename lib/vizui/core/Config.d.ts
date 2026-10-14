/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Typed application configuration shared by the VizUI composition root.
 * @license Apache-2.0
 */
export declare class Config {
    /** The base path every route is prefixed with. **/
    readonly base: string;
    /**
     * Creates the application configuration.
     * @param options - The raw configuration options.
     */
    constructor(options?: Config.Options);
    /**
     * Normalizes a base path: guarantees a single leading slash and no trailing one.
     * @param base - The raw base path.
     * @returns The normalized base path.
     */
    protected static normalizeBase(base?: string): string;
}
export declare namespace Config {
    interface Options {
        /** The base path routes are prefixed with. **/
        base?: string;
    }
}
export default Config;
