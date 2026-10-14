/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Contracts and type guards for VizUI objects.
 * @license Apache-2.0
 */
import { APPENDABLE, DESTROYABLE, LAYOUT, VIEW, COMPONENT } from "./symbols.js";
//
// ======== Appendable objects ==========
//
export { APPENDABLE };
export function IsAppendable(object) {
    if (typeof object !== 'object' || object === null)
        return false;
    if (!(APPENDABLE in object))
        return false;
    if (object[APPENDABLE] !== true)
        return false;
    if (!('root' in object))
        return false;
    return object.root instanceof Node || IsAppendable(object.root);
}
//
// ======== Destroyable objects ==========
//
export { DESTROYABLE };
export function IsDestroyable(object) {
    if (typeof object !== 'object' || object === null)
        return false;
    if (!(DESTROYABLE in object))
        return false;
    if (object[DESTROYABLE] !== true)
        return false;
    if (!('destroy' in object))
        return false;
    return typeof object.destroy === 'function';
}
//
// ======== Component objects ==========
//
export { COMPONENT };
export function IsComponent(object) {
    if (typeof object !== 'object' || object === null)
        return false;
    if (!(COMPONENT in object))
        return false;
    if (object[COMPONENT] !== true)
        return false;
    return IsAppendable(object) && IsDestroyable(object);
}
//
// ======== Layout objects ==========
//
export { LAYOUT };
export function IsLayout(object) {
    if (typeof object !== 'object' || object === null)
        return false;
    if (!(LAYOUT in object))
        return false;
    if (object[LAYOUT] !== true)
        return false;
    return IsComponent(object);
}
//
// ======== View objects ==========
//
export { VIEW };
export function IsView(object) {
    if (typeof object !== 'object' || object === null)
        return false;
    if (!(VIEW in object))
        return false;
    if (object[VIEW] !== true)
        return false;
    return IsComponent(object);
}
//# sourceMappingURL=Contracts.js.map