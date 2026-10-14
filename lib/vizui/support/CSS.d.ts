/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Dynamic CSS loader with caching.
 * @license Apache-2.0
 */
import Element from '../core/element/Element.js';
export declare class CSS {
    private static FINALIZER;
    private static live;
    private static cache;
    /**
     * Loads a stylesheet from a URL and caches it, replacing any previous entry for the same URL.
     * @param url - The URL of the stylesheet to load.
     * @param reference - The base URL or import meta to resolve against.
     */
    static load(url: string | URL, reference: string | URL | ImportMeta): void;
    /**
     * Unloads a stylesheet entry from the cache and removes its link element from the document.
     * @param entry - The stylesheet entry to unload.
     */
    private static unload;
    /**
     * Creates a new link element for a stylesheet URL, with load and error handlers.
     * @param url - The stylesheet URL to load.
     * @returns A link element for the stylesheet.
     */
    private static create;
    /**
     * Normalizes a stylesheet URL relative to a reference.
     * @param url - The stylesheet URL to normalize.
     * @param reference - The base URL or import meta to resolve against.
     * @returns A normalized URL object.
     */
    private static normalize;
    /**
     * Generates a unique hash for a stylesheet URL.
     * @param url - The stylesheet URL to hash.
     * @returns A unique string representing the URL.
     */
    private static hash;
}
export declare namespace CSS {
    type Link = Element<HTMLLinkElement>;
    interface Entry {
        url: string;
        loaded: boolean;
        element: WeakRef<CSS.Link>;
    }
}
export default CSS;
