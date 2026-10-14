import { jsx as _jsx, jsxs as _jsxs } from "vizui/jsx-runtime";
/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Architecture page — the responsibility split of an application built with vizui.
 * @license Apache-2.0
 */
import { Store, View } from 'vizui';
import Card from '../../components/Card/Card.js';
import CodeBlock from '../../components/Markdown/CodeBlock/CodeBlock.js';
import PageHeader from '../../components/PageHeader/PageHeader.js';
import Toc from '../../components/Toc/Toc.js';
const ARCHITECTURE_SECTIONS = [
    { id: 'flujo', label: 'Flujo' },
    { id: 'un-proyecto-tipico', label: 'Un proyecto típico' },
    { id: 'regla-de-oro', label: 'Regla de oro' },
];
export class ArchitecturePage extends View {
    static { this.css.load('ArchitecturePage.css', import.meta); }
    root;
    vTreeCode = Store.create([]);
    constructor() {
        super();
        this.root = (_jsxs("div", { class: "ArchitecturePage", children: [_jsx(PageHeader, { title: "Arquitectura", description: "Cada capa sabe qu\u00E9 hace; la dependencia se puede seguir en el c\u00F3digo." }), _jsxs("div", { class: "body", children: [_jsx("aside", { class: "toc", children: new Toc(ARCHITECTURE_SECTIONS) }), _jsxs("div", { class: "content", children: [_jsx("section", { id: "flujo", children: _jsx(Card, { title: "Flujo", children: _jsxs("p", { children: [_jsx("code", { children: "app.ts" }), " compone el ", _jsx("code", { children: "App" }), ", el router y los servicios.", _jsx("code", { children: "renderer.tsx" }), " registra rutas. Cada ruta construye una vista, que se sirve de componentes con estado y de funciones JSX que no conocen el dominio."] }) }) }), _jsx("section", { id: "un-proyecto-tipico", children: _jsx(Card, { title: "Un proyecto t\u00EDpico", children: this.vTreeCode }) }), _jsx("section", { id: "regla-de-oro", children: _jsx(Card, { title: "Regla de oro", children: _jsx("p", { children: "El estado vive donde nace la responsabilidad, se inyecta por composici\u00F3n y se destruye cuando el nodo deja el \u00E1rbol. Nada espera a un global." }) }) })] })] })] }));
        this.root.observer.on('remove', () => this.vTreeCode.destroy());
    }
    /**
     * Paints the project tree delivered by the route loader.
     * @param data - The downloaded tree, or null when it could not be fetched.
     */
    render(data) {
        this.vTreeCode.set(typeof data === 'string' ? [CodeBlock({ code: data })] : [this.vErrorRow('No se pudo cargar el árbol.')]);
    }
    /**
     * Builds the row shown when the tree cannot be downloaded.
     * @param message - The failure message.
     * @returns The error row element.
     */
    vErrorRow(message) {
        return _jsx("p", { class: "error", children: message });
    }
}
export default ArchitecturePage;
//# sourceMappingURL=ArchitecturePage.js.map