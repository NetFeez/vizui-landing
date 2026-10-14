/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Composition root of the page: owns the application outlet, the hash router and eager services.
 * @license Apache-2.0
 */
import { App, Router } from 'vizui';
import clockService from './services/clock.js';
export const app = new App({
    root: '#app',
    router: new Router({ mode: 'hash' }),
});
export const router = app.router;
clockService.connect();
export default app;
//# sourceMappingURL=app.js.map