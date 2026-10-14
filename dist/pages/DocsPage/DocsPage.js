import { jsx as _jsx, jsxs as _jsxs } from "vizui/jsx-runtime";
/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Documentation page — the guide downloaded by the route loader, painted by the view, plus the merged About section.
 * @license Apache-2.0
 */
import { Store, View } from 'vizui';
import GithubCard from '../../components.smart/GithubCard/GithubCard.js';
import Card from '../../components/Card/Card.js';
import Markdown from '../../components/Markdown/Markdown.js';
import PageHeader from '../../components/PageHeader/PageHeader.js';
import Toc from '../../components/Toc/Toc.js';
export class DocsPage extends View {
    static { this.css.load('DocsPage.css', import.meta); }
    root;
    vItems = Store.create([]);
    constructor() {
        super();
        const eContent = _jsx("div", { class: "content", children: this.vItems });
        this.root = (_jsxs("div", { class: "DocsPage", children: [_jsx(PageHeader, { title: "Documentaci\u00F3n", description: "Todo lo que hace vizui, explicado con el c\u00F3digo que esta p\u00E1gina misma usa." }), _jsxs("div", { class: "body", children: [_jsx("aside", { class: "DocsPage-toc", children: new Toc(eContent) }), eContent] }), _jsxs("section", { class: "DocsPage-about", children: [_jsx("h2", { class: "about-title", children: "Acerca" }), _jsxs("div", { class: "about-grid", children: [_jsxs(Card, { title: "Autor", children: [_jsx(GithubCard, {}), _jsxs("p", { class: "contact", children: ["Escr\u00EDbele a ", _jsx("a", { href: "mailto:netfeez.dev@gmail.com", children: "netfeez.dev@gmail.com" }), "."] })] }), _jsx(Card, { title: "Licencia", children: _jsxs("p", { children: ["Distribuido bajo ", _jsx("strong", { children: "Apache-2.0" }), ": \u00FAsalo, modif\u00EDcalo y exti\u00E9ndelo manteniendo el aviso de autor\u00EDa."] }) })] })] })] }));
        this.root.observer.on('remove', () => this.vItems.destroy());
    }
    /**
     * Paints the guide delivered by the route loader.
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
export default DocsPage;
//# sourceMappingURL=DocsPage.js.map