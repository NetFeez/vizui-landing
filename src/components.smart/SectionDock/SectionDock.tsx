/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Floating quick-nav dock for the landing page — a vertical column of section shortcuts with scroll-spy highlighting.
 * @license Apache-2.0
 */

import { Component, Element } from 'vizui';

import app from '../../app.js';

export class SectionDock extends Component<'aside', SectionDock.EventMap> {
    static { this.css.load('SectionDock.css', import.meta); }

    private static readonly ICON_HOME = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>';
    private static readonly ICON_JSX = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>';
    private static readonly ICON_BOLT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>';
    private static readonly ICON_TERMINAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>';
    private static readonly ICON_BOOK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>';

    private static readonly ITEMS: readonly SectionDock.Item[] = [
        { id: 'inicio', label: 'Inicio', icon: SectionDock.ICON_HOME },
        { id: 'jsx', label: 'JSX es azúcar', icon: SectionDock.ICON_JSX },
        { id: 'reactividad', label: 'Reactividad', icon: SectionDock.ICON_BOLT },
        { id: 'empezar', label: 'Empezar', icon: SectionDock.ICON_TERMINAL },
        { id: 'filosofia', label: 'Filosofía', icon: SectionDock.ICON_BOOK },
    ];

    public readonly root: Element<Element.Type['aside']>;
    private readonly vLinks = new Map<string, Element<HTMLAnchorElement>>();
    private readonly vOnScroll = (): void => this.vSchedule();
    private vRaf = 0;
    private vAlive = true;

    public constructor() { super();
        const eDock: Element<Element.Type['aside']> = <aside class="SectionDock" aria-label="Navegación de la página"></aside>;

        for (const item of SectionDock.ITEMS) {
            const eIcon = Element.new('span', { attributes: { class: 'icon' }, html: item.icon });
            const link = (
                <a class="link" href={`#${item.id}`} title={item.label}>
                    {eIcon}
                    <span class="tip">{item.label}</span>
                </a>
            );
            link.on('click', (event: MouseEvent) => { event.preventDefault(); this.vSection(item.id); });
            this.vLinks.set(item.id, link);
            eDock.append(link);
        }

        this.root = eDock;
        window.addEventListener('scroll', this.vOnScroll, { passive: true });
        this.root.observer.on('remove', () => {
            this.vAlive = false;
            window.removeEventListener('scroll', this.vOnScroll);
            if (this.vRaf) cancelAnimationFrame(this.vRaf);
        });
        this.vTrack();
    }

    /**
     * Scrolls the landing to the requested section.
     * @param id - The id of the section to reveal.
     */
    private vSection(id: string): void {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * Highlights the shortcut of the section currently crossing the top of the viewport.
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
    }

    /** Coalesces scroll bursts into one highlight pass per frame. **/
    private vSchedule(): void {
        if (!this.vAlive) return;
        cancelAnimationFrame(this.vRaf);
        this.vRaf = requestAnimationFrame(() => this.vTrack());
    }
}

export namespace SectionDock {
    /** A section shortcut of the dock. **/
    export interface Item {
        id: string;
        label: string;
        icon: string;
    }

    export type EventMap = {
        [key: string]: never;
    };
}

export default SectionDock;
