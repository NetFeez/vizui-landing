/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Scoped context for providing shared values down a tree.
 * @license Apache-2.0
 */
export declare class Context<Value> {
    private readonly vDefault?;
    /** The unique key the context reads and writes on scopes. **/
    private readonly vKey;
    /**
     * Creates a new context key with an optional default value.
     * @param defaultValue - The value used when no provider is present.
     * @returns The created context.
     */
    static create<Value>(defaultValue?: Value): Context<Value>;
    /**
     * Creates a context with an optional default value.
     * @param vDefault - The value used when no provider is present.
     */
    constructor(vDefault?: Value | undefined);
    /**
     * Creates a provider scope that supplies a value.
     * @param value - The value to provide.
     * @returns A scope handle.
     */
    provide(value: Value): Context.Scope<Value>;
    /**
     * Reads the value provided by a given scope, falling back to the default.
     * @param scope - The scope from which to read.
     * @returns The provided or default value.
     */
    consume(scope: Context.Scope<Value>): Value;
}
export declare namespace Context {
    /** The record a scope uses to expose provided values. **/
    interface Provider<Value> {
        [key: symbol]: Value;
    }
    /** A provider scope with an explicit close handle. **/
    interface Scope<Value> extends Provider<Value> {
        /** Removes the provided value from the scope. **/
        close(): void;
    }
}
export default Context;
