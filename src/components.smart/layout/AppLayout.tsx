/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Application shell — ambient background, sticky navbar, the routed content outlet and the four-column footer.
 * @license Apache-2.0
 */

import { Layout, type Element } from 'vizui';

import Navbar from './Navbar.js';

import app from '../../app.js';

export class AppLayout extends Layout<'div', AppLayout.EventMap> {
    static { this.css.load('AppLayout.css', import.meta); }

    private readonly cNavbar = new Navbar();

    /** The region where routed content mounts. **/
    public readonly outlet: Element<Element.Type['main']>;

    /** The layout root. **/
    public readonly root: Element<Element.Type['div']>;

    public constructor() { super();
        this.outlet = <main class="outlet"></main>;

        const eRoute = (label: string, path: string): Element<HTMLAnchorElement> => {
            const link = <a href={`#${path}`}>{label}</a>;
            link.on('click', (event: MouseEvent) => { event.preventDefault(); app.router.navigate(path); });
            return link;
        };

        const eFooter = (
            <footer class="footer">
                <div class="footer-grid">
                    <div class="footer-brand">
                        <div class="footer-brandrow">
                            <span class="footer-mark">v</span>
                            <span class="footer-word">vizui</span>
                            <span class="footer-version">v0.9</span>
                        </div>
                        <p>Un framework de UI para TypeScript, hecho con lo que vendo. Directo al DOM, tipado estricto y cero sobrecargas abstractas.</p>
                    </div>
                    <nav class="footer-col">
                        <span class="footer-heading">Navegación</span>
                        {eRoute('Inicio & Características', '/')}
                        {eRoute('Componentes', '/components')}
                        {eRoute('Sandbox', '/sandbox')}
                        {eRoute('Documentación', '/docs')}
                        {eRoute('Filosofía', '/philosophy')}
                        {eRoute('Arquitectura', '/architecture')}
                    </nav>
                    <nav class="footer-col">
                        <span class="footer-heading">Comunidad</span>
                        <a href="https://github.com/NetFeez/vizui" target="_blank" rel="noopener noreferrer">github.com/NetFeez/vizui</a>
                        <a href="mailto:netfeez.dev@gmail.com">netfeez.dev@gmail.com</a>
                        <a href="https://github.com/NetFeez/vizui/issues" target="_blank" rel="noopener noreferrer">Reportar issues</a>
                        <a href="https://github.com/NetFeez/vizui/discussions" target="_blank" rel="noopener noreferrer">Discusiones</a>
                    </nav>
                    <nav class="footer-col">
                        <span class="footer-heading">Recursos &amp; Legal</span>
                        <span class="footer-note">Licencia Apache-2.0</span>
                        {eRoute('Arquitectura', '/architecture')}
                        {eRoute('Componentes', '/components')}
                        {eRoute('Documentación', '/docs')}
                    </nav>
                </div>
                <div class="footer-bottom">
                    <div class="footer-tagline">
                        <strong>vizui</strong>
                        <span>— Tu DOM. Tu arquitectura. Nada enfrente.</span>
                    </div>
                    <span>© {new Date().getFullYear()} NetFeez.</span>
                </div>
            </footer>
        );

        this.root = (
            <div class="AppLayout">
                <div class="ambient" aria-hidden="true">
                    <span class="glow --a"></span>
                    <span class="glow --b"></span>
                    <span class="glow --c"></span>
                </div>
                {this.cNavbar}
                <div class="body">{this.outlet}</div>
                {eFooter}
            </div>
        );
    }
}

export namespace AppLayout {
    export type EventMap = {
        [key: string]: never;
    };
}

export default AppLayout;
