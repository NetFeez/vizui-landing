/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description General-purpose utilities.
 * @license Apache-2.0
 */
export declare class Utilities {
    /**
     * Create a debounced function to prevent multiple calls in a short period of time.
     * @param func - The function to debounce.
     * @param delay - The delay in milliseconds.
     * @returns The debounced function.
     */
    static debounce<FN extends Utilities.debounceFunction>(func: FN, delay?: number): Utilities.debounceResult<FN>;
}
export declare namespace Utilities {
    /** The signature a debounced function accepts. **/
    type debounceFunction = (...args: any) => void;
    /** The debounced result, preserving the parameter types of the source function. **/
    type debounceResult<FN extends debounceFunction> = (...args: Parameters<FN>) => void;
}
export default Utilities;
