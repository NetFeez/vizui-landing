import { jsx as _jsx, jsxs as _jsxs } from "vizui/jsx-runtime";
/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Route demo — the same view mounted on several routes: each route declares its own loader
 *              and the resolved data arrives to `render`. Route of testing, not linked from the navigation.
 * @license Apache-2.0
 */
import { Store, View } from 'vizui';
import Card from '../../components/Card/Card.js';
import CodeBlock from '../../components/Markdown/CodeBlock/CodeBlock.js';
import PageHeader from '../../components/PageHeader/PageHeader.js';
export class MultiRoute extends View {
    static { this.css.load('MultiRoute.css', import.meta); }
    root;
    vCode = Store.create([]);
    constructor() {
        super();
        this.root = (_jsxs("div", { class: "MultiRoute", children: [_jsx(PageHeader, { title: "MultiRoute (prueba)", description: "La misma clase de vista, montada en varias rutas. Cada ruta declara su loader y entrega datos distintos a render(data)." }), _jsx("section", { class: "section", children: _jsx(Card, { title: "Datos recibidos", children: this.vCode }) })] }));
        this.root.observer.on('remove', () => this.vCode.destroy());
    }
    /**
     * Paints the payload of whichever route mounted this view.
     * @param data - The produced data (string), or null when the loader could not produce it.
     */
    render(data) {
        this.vCode.set(typeof data === 'string' ? [CodeBlock({ code: data })] : [this.vErrorRow('El loader devolvió nada en esta ruta.')]);
    }
    /**
     * Builds the row shown when the loader produced nothing.
     * @param message - The failure message.
     * @returns The error row element.
     */
    vErrorRow(message) {
        return _jsx("p", { class: "error", children: message });
    }
}
export default MultiRoute;
//# sourceMappingURL=MultiRoute.js.map