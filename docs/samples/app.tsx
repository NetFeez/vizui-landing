import { App } from 'vizui';
import { view } from 'vizui/jsx-runtime';

const Hello = view({
    root: <h1>Hello, vizui</h1>,
});

const app = new App({ root: '#app' });

app.router.show('/', () => Hello);
void app.start();