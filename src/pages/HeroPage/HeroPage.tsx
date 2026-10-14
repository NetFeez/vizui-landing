/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Home page — the vizui pitch as a single landing: hero with the direct-to-DOM diagram, the two-API reveal with live counters,
 *              the reactivity/quickstart bento with live project data and the architectural manifesto.
 *              The code samples are downloaded by the route loader and painted by `render`.
 * @license Apache-2.0
 */

import { Element, Store, View } from 'vizui';

import Badge from '../../components/Badge/Badge.js';
import IdePanel from '../../components/IdePanel/IdePanel.js';
import SectionHeader from '../../components/SectionHeader/SectionHeader.js';
import CodeBlock from '../../components/Markdown/CodeBlock/CodeBlock.js';

import HeroDiagram from '../../components.smart/HeroDiagram/HeroDiagram.js';
import RepoCard from '../../components.smart/RepoCard/RepoCard.js';
import SectionDock from '../../components.smart/SectionDock/SectionDock.js';

import app from '../../app.js';

import clockService from '../../services/clock.js';

export class HeroPage extends View<'div', HeroPage.EventMap> {
    static { this.css.load('HeroPage.css', import.meta); }

    private static readonly ARROW_ICON = '<svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>';
    private static readonly COPY_ICON = '<svg class="copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>';

    public readonly root: Element<Element.Type['div']>;
    private readonly vClock: Store<string>;
    private readonly vOutput = Store.create(0);
    private readonly vGreeting = Store.create('vizui');
    private readonly vCopyLabel = Store.create('Copiar');
    private readonly vSampleJsx = Store.create<Element.ElementType[]>([]);
    private readonly vSampleImperative = Store.create<Element.ElementType[]>([]);
    private readonly vSampleApp = Store.create<Element.ElementType[]>([]);
    private vAppRaw = '';
    private vAlive = true;

    public constructor() { super();
        this.vClock = clockService.now.select(date => date.toLocaleTimeString());

        const cHero = (
            <header class="hero" id="inicio">
                <div class="hero-copy">
                    <div class="ribbon">
                        <Badge label="TypeScript" tone="ok" dot />
                        <Badge label="Apache-2.0" tone="neutral" />
                        <Badge label="Hecho con vizui" tone="accent" />
                    </div>
                    <div class="headline">
                        <h1 class="hp-title">vizui</h1>
                        <h2 class="hp-tagline">
                            Tu DOM. Tu arquitectura. <span class="tagline-accent">Nada enfrente.</span>
                        </h2>
                    </div>
                    <p class="lead">
                        Un framework de UI para TypeScript: JSX directo sobre el DOM real,
                        stores reactivos tipados y componentes sin magia. Sin capas que impidan
                        entender qué se pinta — ni indicarlo en tu código.
                    </p>
                    <div class="hp-facts">
                        <span class="fact fact--accent"><strong>0</strong> dependencias de runtime</span>
                        <span class="fact fact--ok"><strong>2.6kb gzip</strong> <span class="fact-dim">(Element.js)</span></span>
                        <span class="fact">Sin bundler: <code>tsc</code> + importmap</span>
                        <span class="fact">Sin virtual DOM</span>
                    </div>
                    <div class="actions">
                        <button type="button" class="btn btn--primary" on:click={() => this.vGo('/docs')}>
                            <span>Leer la documentación</span>
                            {Element.new('span', { html: HeroPage.ARROW_ICON })}
                        </button>
                        <button type="button" class="btn" on:click={() => this.vGo('/components')}>Ver componentes</button>
                        <button type="button" class="btn btn--ghost" on:click={() => this.vOpenGitHub()}>GitHub</button>
                    </div>
                </div>
                <div class="hero-diagram" id="arquitectura"><HeroDiagram count={this.vOutput} /></div>
            </header>
        );

        const cOutput = (
            <div class="live">
                <span class="live-label"><span class="live-dot"></span>Output en vivo</span>
                <div class="live-box">
                    <span class="live-key">Count:</span>
                    <span class="live-value">{this.vOutput}</span>
                    <span class="live-steps">
                        <button type="button" class="step" on:click={() => this.vOutput.smartSet(prev => Math.max(0, prev - 1))}>-1</button>
                        <button type="button" class="step step--accent" on:click={() => this.vOutput.smartSet(prev => prev + 1)}>+1</button>
                    </span>
                </div>
            </div>
        );

        const cSuite = (
            <section class="section" id="jsx">
                <div class="section-head">
                    <SectionHeader
                        eyebrow="Componentes limpios"
                        title="JSX es azúcar"
                        description="El mismo componente, dos formas de escribirlo. Esta página los muestra uno al lado del otro: el de la derecha es un fichero .ts real que no contiene una sola etiqueta JSX. Tú decides hasta dónde llega el azúcar."
                    />
                    {cOutput}
                </div>
                <div class="panes">
                    <div class="pane">{this.vSampleJsx}</div>
                    <div class="pane">{this.vSampleImperative}</div>
                </div>
            </section>
        );

        const cProject = (
            <article class="bento-card bento-card--primary">
                <div class="bento-head">
                    <h3 class="bento-title">El proyecto en GitHub</h3>
                    <a class="bento-link" href="https://github.com/NetFeez/vizui" target="_blank" rel="noopener noreferrer">Ver en GitHub →</a>
                </div>
                <RepoCard />
            </article>
        );

        const cLive = (
            <article class="bento-card bento-card--accent" data-purpose="reactivity-demo">
                <div class="bento-head">
                    <h3 class="bento-title">Reactividad en vivo</h3>
                    <Badge label="Store reactivo" tone="accent" />
                </div>
                <p class="bento-copy">Un <code>select</code> derivado avanza con el reloj:</p>
                <div class="ticker">
                    <span class="ticker-key">Timestamp reactivo:</span>
                    <span class="ticker-value">{this.vClock}</span>
                </div>
                <p class="note">
                    Sin reconciliación, sin virtual DOM: un Store cambia y el texto del nodo se
                    actualiza de forma atómica y quirúrgica.
                </p>
            </article>
        );

        const cSample = (
            <article class="bento-card bento-card--violet" id="empezar">
                <div class="bento-head">
                    <h3 class="bento-title">Así de pequeño es empezar</h3>
                    <button type="button" class="copy" on:click={() => this.vCopy()}>
                        {Element.new('span', { html: HeroPage.COPY_ICON })}
                        <span>{this.vCopyLabel}</span>
                    </button>
                </div>
                <p class="bento-copy">Todo lo necesario para iniciar tu aplicación autónoma con vizui:</p>
                <div class="quickstart">{this.vSampleApp}</div>
                <div class="hp-mini">
                    <span class="mini-label">patrón montado</span>
                    <span class="mini-line">Hello, <strong>{this.vGreeting}</strong> — nodo reactivo</span>
                    <button type="button" class="hp-btn" on:click={() => this.vHello()}>Saludar</button>
                </div>
            </article>
        );

        const cBento = (
            <section class="section" id="reactividad">
                <SectionHeader
                    eyebrow="Ecosistema y ejecución"
                    tone="violet"
                    title="Reactividad y arranque instantáneo"
                />
                <div class="bento">{cLive}{cProject}{cSample}</div>
            </section>
        );

        const cQuote = (
            <section class="section section--plain" id="filosofia">
                <div class="manifesto">
                    <span class="manifesto-eyebrow">Manifiesto arquitectónico</span>
                    <p class="manifesto-quote">«El objetivo no es que el código parezca "buen código" según un estándar genérico. El objetivo es que el código sea intrínsecamente coherente con la arquitectura del proyecto.»</p>
                    <a class="manifesto-link" href="#" on:click={(event: MouseEvent) => { event.preventDefault(); this.vGo('/philosophy'); }}>
                        Nuestra filosofía <span class="manifesto-arrow">→</span>
                    </a>
                </div>
            </section>
        );

        this.root = (
            <div class="HeroPage">
                {new SectionDock()}
                {cHero}
                {cSuite}
                {cBento}
                {cQuote}
            </div>
        );

        this.root.observer.on('remove', () => {
            this.vAlive = false;
            this.vClock.destroy();
            this.vOutput.destroy();
            this.vGreeting.destroy();
            this.vCopyLabel.destroy();
            this.vSampleJsx.destroy();
            this.vSampleImperative.destroy();
            this.vSampleApp.destroy();
        });
    }

    /**
     * Paints the samples delivered by the route loader.
     * @param data - The downloaded source files, or null when they could not be fetched.
     */
    public render(data?: unknown): void {
        if (!HeroPage.isSources(data)) {
            const row = this.vErrorRow('No se pudieron cargar los ejemplos.');
            this.vSampleJsx.set([row]);
            this.vSampleImperative.set([row]);
            this.vSampleApp.set([row]);
            return;
        }
        this.vAppRaw = data.app;
        this.vSampleJsx.set([IdePanel({
            filename: 'src/components/Counter/JsxCounter.tsx',
            mode: 'JSX Mode',
            code: data.jsx,
            tone: 'accent',
        })]);
        this.vSampleImperative.set([IdePanel({
            filename: 'src/components/Counter/ImperativeCounter.ts',
            mode: 'Pure TS',
            code: data.imperative,
            tone: 'ok',
        })]);
        this.vSampleApp.set([CodeBlock({ code: data.app })]);
    }

    /**
     * Checks whether the loader delivered the three code samples.
     * @param value - The data handed to render.
     * @returns Whether the value is a complete sample set.
     */
    private static isSources(value: unknown): value is HeroPage.Sources {
        if (typeof value !== 'object' || value === null) return false;
        const sources = value as Record<string, unknown>;
        return typeof sources.jsx === 'string'
            && typeof sources.imperative === 'string'
            && typeof sources.app === 'string';
    }

    /**
     * Builds the row shown when a sample cannot be downloaded.
     * @param message - The failure message.
     * @returns The error row element.
     */
    private vErrorRow(message: string): Element<Element.Type['p']> {
        return <p class="sample-error">{message}</p>;
    }

    /** Cycles the greeting shown by the mounted mini-app. **/
    private vHello(): void {
        this.vGreeting.smartSet(prev => (prev === 'vizui' ? 'mundo' : prev === 'mundo' ? 'usuaria' : 'vizui'));
    }

    /** Copies the quickstart snippet and confirms it briefly. **/
    private vCopy(): void {
        void navigator.clipboard?.writeText(this.vAppRaw).catch(() => undefined);
        this.vCopyLabel.set('¡Copiado!');
        setTimeout(() => { if (this.vAlive) this.vCopyLabel.set('Copiar'); }, 1800);
    }

    /**
     * Navigates to a route through the application router.
     * @param path - The route path to navigate to.
     */
    private vGo(path: string): void {
        app.router.navigate(path);
    }

    /** Opens the project repository. **/
    private vOpenGitHub(): void {
        window.open('https://github.com/NetFeez/vizui', '_blank', 'noopener');
    }
}

export namespace HeroPage {
    /** The three code samples downloaded from docs/samples. **/
    export interface Sources {
        jsx: string;
        imperative: string;
        app: string;
    }

    export type EventMap = {
        [key: string]: never;
    };
}

export default HeroPage;
