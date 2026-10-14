import { jsx as _jsx, jsxs as _jsxs } from "vizui/jsx-runtime";
/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Philosophy page — vizui's principles and what the project seeks, downloaded by the route loader and painted by the view.
 * @license Apache-2.0
 */
import { Store, View } from 'vizui';
import Markdown from '../../components/Markdown/Markdown.js';
import PageHeader from '../../components/PageHeader/PageHeader.js';
import Toc from '../../components/Toc/Toc.js';
export class PhilosophyPage extends View {
    static { this.css.load('PhilosophyPage.css', import.meta); }
    root;
    vItems = Store.create([]);
    constructor() {
        super();
        const eContent = _jsx("div", { class: "content", children: this.vItems });
        this.root = (_jsxs("div", { class: "PhilosophyPage", children: [_jsx(PageHeader, { title: "Filosof\u00EDa", description: "Lo que vizui es, lo que no es, y lo que buscamos construir." }), _jsxs("div", { class: "body", children: [_jsx("aside", { class: "PhilosophyPage-toc", children: new Toc(eContent) }), eContent] })] }));
        this.root.observer.on('remove', () => this.vItems.destroy());
    }
    /**
     * Paints the manifesto delivered by the route loader.
     * @param data - The downloaded markdown, or null when it could not be fetched.
     */
    render(data) {
        this.vItems.set(typeof data === 'string' ? [
            _jsx(Markdown, { content: data })
        ] : [this.vErrorRow('No se pudo cargar el documento.')]);
    }
    /**
     * Builds the failure row.
     * @param message - The failure message.
     * @returns The error row element.
     */
    vErrorRow(message) {
        return (_jsx("div", { class: "error", children: _jsx("p", { children: message }) }));
    }
}
export default PhilosophyPage;
//# sourceMappingURL=PhilosophyPage.js.map