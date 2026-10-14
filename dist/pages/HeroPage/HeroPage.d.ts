/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Home page — the vizui pitch as a single landing: hero with the direct-to-DOM diagram, the two-API reveal with live counters,
 *              the reactivity/quickstart bento with live project data and the architectural manifesto.
 *              The code samples are downloaded by the route loader and painted by `render`.
 * @license Apache-2.0
 */
import { Element, View } from 'vizui';
export declare class HeroPage extends View<'div', HeroPage.EventMap> {
    private static readonly ARROW_ICON;
    private static readonly COPY_ICON;
    readonly root: Element<Element.Type['div']>;
    private readonly vClock;
    private readonly vOutput;
    private readonly vGreeting;
    private readonly vCopyLabel;
    private readonly vSampleJsx;
    private readonly vSampleImperative;
    private readonly vSampleApp;
    private vAppRaw;
    private vAlive;
    constructor();
    /**
     * Paints the samples delivered by the route loader.
     * @param data - The downloaded source files, or null when they could not be fetched.
     */
    render(data?: unknown): void;
    /**
     * Checks whether the loader delivered the three code samples.
     * @param value - The data handed to render.
     * @returns Whether the value is a complete sample set.
     */
    private static isSources;
    /**
     * Builds the row shown when a sample cannot be downloaded.
     * @param message - The failure message.
     * @returns The error row element.
     */
    private vErrorRow;
    /** Cycles the greeting shown by the mounted mini-app. **/
    private vHello;
    /** Copies the quickstart snippet and confirms it briefly. **/
    private vCopy;
    /**
     * Navigates to a route through the application router.
     * @param path - The route path to navigate to.
     */
    private vGo;
    /** Opens the project repository. **/
    private vOpenGitHub;
}
export declare namespace HeroPage {
    /** The three code samples downloaded from docs/samples. **/
    interface Sources {
        jsx: string;
        imperative: string;
        app: string;
    }
    type EventMap = {
        [key: string]: never;
    };
}
export default HeroPage;
