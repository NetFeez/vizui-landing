/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Global navigation bar — brand, section links that scroll the landing, GitHub call to action and documentation shortcut.
 * @license Apache-2.0
 */

import { Component, Element } from 'vizui';
import Logo from 'vizui.components/Logo/Logo.js';

import app from '../../app.js';
import repoService from '../../services/repo.js';

export class Navbar extends Component<'nav', Navbar.EventMap> {
    static { this.css.load('Navbar.css', import.meta); }

    private static readonly ITEMS: readonly Navbar.Item[] = [
        { id: 'inicio', label: 'Inicio' },
        { id: 'jsx', label: 'JSX es azúcar' },
        { id: 'reactividad', label: 'Reactividad' },
        { id: 'empezar', label: 'Empezar' },
        { id: 'filosofia', label: 'Filosofía', route: '/philosophy' },
        { id: 'arquitectura', label: 'Arquitectura', route: '/architecture' },
        { id: 'sandbox', label: 'Sandbox', route: '/sandbox' },
    ];

    private static readonly GITHUB_ICON = '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path></svg>';
    private static readonly CHEVRON_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2"></path></svg>';

    public readonly root: Element<Element.Type['nav']>;
    private readonly vLinks = new Map<string, Element<HTMLAnchorElement>>();
    private readonly vRouteLinks = new Map<string, Element<HTMLAnchorElement>>();
    private readonly vOnScroll = (): void => this.vSchedule();
    private readonly vOnRoute = (): void => this.vTrack();
    private readonly eStar: Element<HTMLSpanElement>;
    private vRaf = 0;
    private vAlive = true;

    public constructor() { super();
        const cBrand = new Logo({ text: 'vizui', location: '/' });
        cBrand.on('click', () => this.vGo('/'));

        const eBrand = (
            <div class="brand">
                {cBrand}
                <span class="version">v0.9</span>
            </div>
        );

        const eNav: Element<Element.Type['div']> = <div class="links"></div>;
        for (const item of Navbar.ITEMS) {
            const link = <a class="Navbar-link" href={item.route ? `#${item.route}` : `#${item.id}`}>{item.label}</a>;
            link.on('click', (event: MouseEvent) => {
                event.preventDefault();
                if (item.route) this.vGo(item.route);
                else this.vSection(item.id);
            });
            if (item.route) this.vRouteLinks.set(item.route, link);
            else this.vLinks.set(item.id, link);
            eNav.append(link);
        }

        const eGitHubIcon = Element.new('span', { html: Navbar.GITHUB_ICON });
        const eDocIcon = Element.new('span', { html: Navbar.CHEVRON_ICON });

        this.eStar = <span class="star">★ —</span>;

        const eGitHub = (
            <a class="github" href="https://github.com/NetFeez/vizui" target="_blank" rel="noopener noreferrer">
                {eGitHubIcon}
                <span>GitHub</span>
                <span class="sep"></span>
                {this.eStar}
            </a>
        );

        const eDoc = (
            <a class="doc" href="#/docs" on:click={(event: MouseEvent) => { event.preventDefault(); this.vGo('/docs'); }}>
                <span>Doc</span>
                {eDocIcon}
            </a>
        );

        this.root = (
            <nav class="Navbar">
                <div class="inner">
                    {eBrand}
                    {eNav}
                    <div class="actions">{eGitHub}{eDoc}</div>
                </div>
            </nav>
        );

        window.addEventListener('scroll', this.vOnScroll, { passive: true });
        app.router.on('change', this.vOnRoute);
        this.root.observer.on('remove', () => {
            this.vAlive = false;
            window.removeEventListener('scroll', this.vOnScroll);
            app.router.off('change', this.vOnRoute);
            if (this.vRaf) cancelAnimationFrame(this.vRaf);
        });
        this.vTrack();
        this.vStars();
    }

    /** Paints the real star count of the repository, keeping the dash on failure. **/
    private vStars(): void {
        void repoService.repository
            .then(repo => {
                if (this.vAlive) this.eStar.setText(`★ ${repo.stargazers_count.toLocaleString('es')}`);
            })
            .catch(() => undefined);
    }

    /**
     * Navigates to a route through the application router.
     * @param path - The route path to navigate to.
     */
    private vGo(path: string): void {
        app.router.navigate(path);
    }

    /**
     * Scrolls to a landing section, returning to the landing first when needed.
     * @param id - The id of the section to reveal.
     */
    private vSection(id: string): void {
        const scroll = (): void => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
        if (app.router.current?.path === '/') scroll();
        else {
            app.router.navigate('/');
            window.setTimeout(scroll, 80);
        }
    }

    /**
     * Highlights the link of the section currently crossing the top of the viewport.
     */
    private vTrack(): void {
        const threshold = (window.innerHeight ?? 0) * 0.32;
        let current: string | null = null;
        for (const id of this.vLinks.keys()) {
            const target = document.getElementById(id);
            if (!target || typeof target.getBoundingClientRect !== 'function') continue;
            if (target.getBoundingClientRect().top <= threshold) current = id;
        }
        if (app.router.current?.path !== '/') current = null;
        for (const [id, link] of this.vLinks) link.toggleClass('active', id === current);

        const path = app.router.current?.path ?? '/';
        for (const [route, link] of this.vRouteLinks) link.toggleClass('active', route === path);
    }

    /** Coalesces scroll bursts into one highlight pass per frame. **/
    private vSchedule(): void {
        if (!this.vAlive) return;
        cancelAnimationFrame(this.vRaf);
        this.vRaf = requestAnimationFrame(() => this.vTrack());
    }
}

export namespace Navbar {
    /** A navigation entry of the navbar: a landing section, or a route when `route` is set. **/
    export interface Item {
        id: string;
        label: string;
        route?: string;
    }

    export type EventMap = {
        [key: string]: never;
    };
}

export default Navbar;
