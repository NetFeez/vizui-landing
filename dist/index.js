/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Page entry point: loads the global theme, boots the composition root and registers the routes.
 * @license Apache-2.0
 */
import { CSS } from 'vizui';
import app from './app.js';
import './renderer.js';
CSS.load('styles/theme.css', import.meta);
void app.start();
//# sourceMappingURL=index.js.map