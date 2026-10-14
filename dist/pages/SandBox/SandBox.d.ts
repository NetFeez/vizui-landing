/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Live sandbox — an editable layer whose children ARE the highlighted tokens
 *              (what you edit and what you see is the same DOM), so the code and the style
 *              editors align by construction. The module is evaluated on every edit and whatever
 *              it exports as default is mounted next to the editor: a Component, a factory
 *              or a ready Element. The evaluation runs through a throwaway object-url module,
 *              so imports resolve over the same import map as the page itself, and the JSX is
 *              transformed to jsx-runtime calls at that point.
 * @license Apache-2.0
 */
import { Element, View } from 'vizui';
export declare class SandBox extends View<'div', SandBox.EventMap> {
    private static readonly RUN_ICON;
    private static readonly RESET_ICON;
    readonly root: Element<Element.Type['div']>;
    private readonly cModule;
    private readonly cStyle;
    private readonly eStyleTag;
    private readonly eStage;
    private readonly eError;
    private readonly vStatus;
    private readonly vMounted;
    private vCurrent;
    private vTimer;
    private vRunning;
    private vQueued;
    private vAlive;
    constructor();
    /** Schedules a debounced run for the given delay. **/
    private vSchedule;
    /**
     * Evaluates the module, swaps the preview mount and reports status or failure.
     * @param force - Whether to skip the short-circuit when an equal run is pending.
     */
    private vRun;
    /**
     * Mounts the evaluation result into the stage: constructs classes, calls factories
     * and appends ready Elements.
     * @param value - The default export of the evaluated module.
     */
    private vMount;
    /** Tears down the currently mounted instance. **/
    private vClear;
    /**
     * Paints a failure and marks the status. Transient stalls (partial JSX while
     * typing) keep the last mounted preview; only dead runs clear the stage.
     * @param message - The failure message.
     * @param incomplete - Whether the source is merely unfinished.
     */
    private vFail;
    /** Restores the seed sources and runs them immediately. **/
    private vReset;
}
export declare namespace SandBox {
    type EventMap = {
        [key: string]: never;
    };
}
export default SandBox;
