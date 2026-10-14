/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Discrimination symbols used to identify VizUI types without instanceof.
 * @license Apache-2.0
 */
/** Marks an object as appendable. **/
export declare const APPENDABLE: unique symbol;
/** Marks an object as destroyable. **/
export declare const DESTROYABLE: unique symbol;
/** Marks an object as a View. **/
export declare const VIEW: unique symbol;
/** Marks an object as a Layout. **/
export declare const LAYOUT: unique symbol;
/** The contract discrimination symbols, grouped. **/
export declare const CONTRACTS: {
    APPENDABLE: typeof APPENDABLE;
    DESTROYABLE: typeof DESTROYABLE;
    VIEW: typeof VIEW;
    LAYOUT: typeof LAYOUT;
};
/** Marks an object as a Node. **/
export declare const NODE: unique symbol;
/** Marks an object as an Element. **/
export declare const ELEMENT: unique symbol;
/** Marks an object as a Component. **/
export declare const COMPONENT: unique symbol;
/** The core discrimination symbols, grouped. **/
export declare const CORE: {
    NODE: typeof NODE;
    ELEMENT: typeof ELEMENT;
    COMPONENT: typeof COMPONENT;
};
/** Marks an object as a rule. **/
export declare const RULE_BASE: unique symbol;
/** Marks a rule as a show rule. **/
export declare const RULE_SHOW: unique symbol;
/** Marks a rule as a layout rule. **/
export declare const RULE_LAYOUT: unique symbol;
/** Marks a rule as a socket rule. **/
export declare const RULE_SOCKET: unique symbol;
/** Marks a rule as a delegating router rule. **/
export declare const RULE_ROUTER: unique symbol;
/** Marks a rule as a custom rule. **/
export declare const RULE_CUSTOM: unique symbol;
/** The route discrimination symbols, grouped. **/
export declare const RULE: {
    BASE: typeof RULE_BASE;
    SHOW: typeof RULE_SHOW;
    LAYOUT: typeof RULE_LAYOUT;
    SOCKET: typeof RULE_SOCKET;
    ROUTER: typeof RULE_ROUTER;
    CUSTOM: typeof RULE_CUSTOM;
};
/** Marks an object as a guard. **/
export declare const GUARD_BASE: unique symbol;
/** Marks a guard as a navigation guard. **/
export declare const GUARD_NAVIGATION: unique symbol;
/** Marks a guard as an error guard. **/
export declare const GUARD_ERROR: unique symbol;
/** The guard discrimination symbols, grouped. **/
export declare const GUARD: {
    BASE: typeof GUARD_BASE;
    NAVIGATION: typeof GUARD_NAVIGATION;
    ERROR: typeof GUARD_ERROR;
};
/** Every discrimination symbol of VizUI, grouped by concept. **/
export declare const symbols: {
    CONTRACTS: typeof CONTRACTS;
    CORE: typeof CORE;
    RULE: typeof RULE;
    GUARD: typeof GUARD;
};
export default symbols;
