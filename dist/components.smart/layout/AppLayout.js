import { jsx as _jsx, jsxs as _jsxs } from "vizui/jsx-runtime";
/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Application shell — ambient background, sticky navbar, the routed content outlet and the four-column footer.
 * @license Apache-2.0
 */
import { Layout } from 'vizui';
import Navbar from './Navbar.js';
import app from '../../app.js';
export class AppLayout extends Layout {
    static { this.css.load('AppLayout.css', import.meta); }
    cNavbar = new Navbar();
    /** The region where routed content mounts. **/
    outlet;
    /** The layout root. **/
    root;
    constructor() {
        super();
        this.outlet = _jsx("main", { class: "outlet" });
        const eRoute = (label, path) => {
            const link = _jsx("a", { href: `#${path}`, children: label });
            link.on('click', (event) => { event.preventDefault(); app.router.navigate(path); });
            return link;
        };
        const eFooter = (_jsxs("footer", { class: "footer", children: [_jsxs("div", { class: "footer-grid", children: [_jsxs("div", { class: "footer-brand", children: [_jsxs("div", { class: "footer-brandrow", children: [_jsx("span", { class: "footer-mark", children: "v" }), _jsx("span", { class: "footer-word", children: "vizui" }), _jsx("span", { class: "footer-version", children: "v0.9" })] }), _jsx("p", { children: "Un framework de UI para TypeScript, hecho con lo que vendo. Directo al DOM, tipado estricto y cero sobrecargas abstractas." })] }), _jsxs("nav", { class: "footer-col", children: [_jsx("span", { class: "footer-heading", children: "Navegaci\u00F3n" }), eRoute('Inicio & Características', '/'), eRoute('Componentes', '/components'), eRoute('Sandbox', '/sandbox'), eRoute('Documentación', '/docs'), eRoute('Filosofía', '/philosophy'), eRoute('Arquitectura', '/architecture')] }), _jsxs("nav", { class: "footer-col", children: [_jsx("span", { class: "footer-heading", children: "Comunidad" }), _jsx("a", { href: "https://github.com/NetFeez/vizui", target: "_blank", rel: "noopener noreferrer", children: "github.com/NetFeez/vizui" }), _jsx("a", { href: "mailto:netfeez.dev@gmail.com", children: "netfeez.dev@gmail.com" }), _jsx("a", { href: "https://github.com/NetFeez/vizui/issues", target: "_blank", rel: "noopener noreferrer", children: "Reportar issues" }), _jsx("a", { href: "https://github.com/NetFeez/vizui/discussions", target: "_blank", rel: "noopener noreferrer", children: "Discusiones" })] }), _jsxs("nav", { class: "footer-col", children: [_jsx("span", { class: "footer-heading", children: "Recursos & Legal" }), _jsx("span", { class: "footer-note", children: "Licencia Apache-2.0" }), eRoute('Arquitectura', '/architecture'), eRoute('Componentes', '/components'), eRoute('Documentación', '/docs')] })] }), _jsxs("div", { class: "footer-bottom", children: [_jsxs("div", { class: "footer-tagline", children: [_jsx("strong", { children: "vizui" }), _jsx("span", { children: "\u2014 Tu DOM. Tu arquitectura. Nada enfrente." })] }), _jsxs("span", { children: ["\u00A9 ", new Date().getFullYear(), " NetFeez."] })] })] }));
        this.root = (_jsxs("div", { class: "AppLayout", children: [_jsxs("div", { class: "ambient", "aria-hidden": "true", children: [_jsx("span", { class: "glow --a" }), _jsx("span", { class: "glow --b" }), _jsx("span", { class: "glow --c" })] }), this.cNavbar, _jsx("div", { class: "body", children: this.outlet }), eFooter] }));
    }
}
export default AppLayout;
//# sourceMappingURL=AppLayout.js.map