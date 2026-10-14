/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Scoped context for providing shared values down a tree.
 * @license Apache-2.0
 */
export class Context {
    vDefault;
    /** The unique key the context reads and writes on scopes. **/
    vKey;
    /**
     * Creates a new context key with an optional default value.
     * @param defaultValue - The value used when no provider is present.
     * @returns The created context.
     */
    static create(defaultValue) { return new Context(defaultValue); }
    /**
     * Creates a context with an optional default value.
     * @param vDefault - The value used when no provider is present.
     */
    constructor(vDefault) {
        this.vDefault = vDefault;
        this.vKey = Symbol('vizui.context');
    }
    /**
     * Creates a provider scope that supplies a value.
     * @param value - The value to provide.
     * @returns A scope handle.
     */
    provide(value) {
        const scope = {
            [this.vKey]: value,
            close: () => { delete scope[this.vKey]; }
        };
        return scope;
    }
    /**
     * Reads the value provided by a given scope, falling back to the default.
     * @param scope - The scope from which to read.
     * @returns The provided or default value.
     */
    consume(scope) {
        return scope[this.vKey] ?? this.vDefault;
    }
}
export default Context;
//# sourceMappingURL=Context.js.map