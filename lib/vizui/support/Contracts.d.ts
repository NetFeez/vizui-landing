/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Contracts and type guards for VizUI objects.
 * @license Apache-2.0
 */
import { APPENDABLE, DESTROYABLE, LAYOUT, VIEW, COMPONENT } from "./symbols.js";
export { APPENDABLE };
export interface IsAppendable {
    readonly [APPENDABLE]: true;
    root: IsAppendable | Node;
}
export declare function IsAppendable<T>(object: T): object is Extract<T, IsAppendable>;
export { DESTROYABLE };
export interface IsDestroyable {
    readonly [DESTROYABLE]: true;
    destroy(): void | Promise<void>;
}
export declare function IsDestroyable<T>(object: T): object is Extract<T, IsDestroyable>;
export { COMPONENT };
export interface IsComponent extends IsAppendable, IsDestroyable {
    readonly [COMPONENT]: true;
    willMount?(): void | Promise<void>;
    onMount?(): void | Promise<void>;
    onUnmount?(): void | Promise<void>;
}
export declare function IsComponent<T>(object: T): object is Extract<T, IsComponent>;
export { LAYOUT };
export interface IsLayout extends IsComponent {
    readonly [LAYOUT]: true;
    readonly outlet: IsAppendable | Node;
}
export declare function IsLayout<T>(object: T): object is Extract<T, IsLayout>;
export { VIEW };
export interface IsView<Data extends unknown = unknown> extends IsComponent {
    readonly [VIEW]: true;
    load?(entry: IsView.Entry): void | Promise<void>;
    render?(data?: Data): void | Promise<void>;
}
export declare namespace IsView {
    interface Entry {
        /** The normalized path of the navigation. **/
        path: string;
        /** The route parameters extracted by the matched rule. **/
        params: Record<string, string | undefined>;
        /** The query string of the navigation. **/
        query: URLSearchParams;
    }
}
export declare function IsView<T>(object: T): object is Extract<T, IsView>;
