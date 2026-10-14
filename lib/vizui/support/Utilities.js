/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description General-purpose utilities.
 * @license Apache-2.0
 */
export class Utilities {
    /**
     * Create a debounced function to prevent multiple calls in a short period of time.
     * @param func - The function to debounce.
     * @param delay - The delay in milliseconds.
     * @returns The debounced function.
     */
    static debounce(func, delay = 500) {
        let timeOutID;
        function debounced(...args) {
            if (timeOutID)
                clearTimeout(timeOutID);
            function timeOut() {
                func(...args);
                clearTimeout(timeOutID);
            }
            timeOutID = setTimeout(timeOut, delay);
        }
        return debounced;
    }
}
export default Utilities;
//# sourceMappingURL=Utilities.js.map