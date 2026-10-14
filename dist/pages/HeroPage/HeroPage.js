import { jsx as _jsx, jsxs as _jsxs } from "vizui/jsx-runtime";
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
export class HeroPage extends View {
    static { this.css.load('HeroPage.css', import.meta); }
    static ARROW_ICON = '<svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>';
    static COPY_ICON = '<svg class="copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>';
    root;
    vClock;
    vOutput = Store.create(0);
    vGreeting = Store.create('vizui');
    vCopyLabel = Store.create('Copiar');
    vSampleJsx = Store.create([]);
    vSampleImperative = Store.create([]);
    vSampleApp = Store.create([]);
    vAppRaw = '';
    vAlive = true;
    constructor() {
        super();
        this.vClock = clockService.now.select(date => date.toLocaleTimeString());
        const cHero = (_jsxs("header", { class: "hero", id: "inicio", children: [_jsxs("div", { class: "hero-copy", children: [_jsxs("div", { class: "ribbon", children: [_jsx(Badge, { label: "TypeScript", tone: "ok", dot: true }), _jsx(Badge, { label: "Apache-2.0", tone: "neutral" }), _jsx(Badge, { label: "Hecho con vizui", tone: "accent" })] }), _jsxs("div", { class: "headline", children: [_jsx("h1", { class: "hp-title", children: "vizui" }), _jsxs("h2", { class: "hp-tagline", children: ["Tu DOM. Tu arquitectura. ", _jsx("span", { class: "tagline-accent", children: "Nada enfrente." })] })] }), _jsx("p", { class: "lead", children: "Un framework de UI para TypeScript: JSX directo sobre el DOM real, stores reactivos tipados y componentes sin magia. Sin capas que impidan entender qu\u00E9 se pinta \u2014 ni indicarlo en tu c\u00F3digo." }), _jsxs("div", { class: "hp-facts", children: [_jsxs("span", { class: "fact fact--accent", children: [_jsx("strong", { children: "0" }), " dependencias de runtime"] }), _jsxs("span", { class: "fact fact--ok", children: [_jsx("strong", { children: "2.6kb gzip" }), " ", _jsx("span", { class: "fact-dim", children: "(Element.js)" })] }), _jsxs("span", { class: "fact", children: ["Sin bundler: ", _jsx("code", { children: "tsc" }), " + importmap"] }), _jsx("span", { class: "fact", children: "Sin virtual DOM" })] }), _jsxs("div", { class: "actions", children: [_jsxs("button", { type: "button", class: "btn btn--primary", "on:click": () => this.vGo('/docs'), children: [_jsx("span", { children: "Leer la documentaci\u00F3n" }), Element.new('span', { html: HeroPage.ARROW_ICON })] }), _jsx("button", { type: "button", class: "btn", "on:click": () => this.vGo('/components'), children: "Ver componentes" }), _jsx("button", { type: "button", class: "btn btn--ghost", "on:click": () => this.vOpenGitHub(), children: "GitHub" })] })] }), _jsx("div", { class: "hero-diagram", id: "arquitectura", children: _jsx(HeroDiagram, { count: this.vOutput }) })] }));
        const cOutput = (_jsxs("div", { class: "live", children: [_jsxs("span", { class: "live-label", children: [_jsx("span", { class: "live-dot" }), "Output en vivo"] }), _jsxs("div", { class: "live-box", children: [_jsx("span", { class: "live-key", children: "Count:" }), _jsx("span", { class: "live-value", children: this.vOutput }), _jsxs("span", { class: "live-steps", children: [_jsx("button", { type: "button", class: "step", "on:click": () => this.vOutput.smartSet(prev => Math.max(0, prev - 1)), children: "-1" }), _jsx("button", { type: "button", class: "step step--accent", "on:click": () => this.vOutput.smartSet(prev => prev + 1), children: "+1" })] })] })] }));
        const cSuite = (_jsxs("section", { class: "section", id: "jsx", children: [_jsxs("div", { class: "section-head", children: [_jsx(SectionHeader, { eyebrow: "Componentes limpios", title: "JSX es az\u00FAcar", description: "El mismo componente, dos formas de escribirlo. Esta p\u00E1gina los muestra uno al lado del otro: el de la derecha es un fichero .ts real que no contiene una sola etiqueta JSX. T\u00FA decides hasta d\u00F3nde llega el az\u00FAcar." }), cOutput] }), _jsxs("div", { class: "panes", children: [_jsx("div", { class: "pane", children: this.vSampleJsx }), _jsx("div", { class: "pane", children: this.vSampleImperative })] })] }));
        const cProject = (_jsxs("article", { class: "bento-card bento-card--primary", children: [_jsxs("div", { class: "bento-head", children: [_jsx("h3", { class: "bento-title", children: "El proyecto en GitHub" }), _jsx("a", { class: "bento-link", href: "https://github.com/NetFeez/vizui", target: "_blank", rel: "noopener noreferrer", children: "Ver en GitHub \u2192" })] }), _jsx(RepoCard, {})] }));
        const cLive = (_jsxs("article", { class: "bento-card bento-card--accent", "data-purpose": "reactivity-demo", children: [_jsxs("div", { class: "bento-head", children: [_jsx("h3", { class: "bento-title", children: "Reactividad en vivo" }), _jsx(Badge, { label: "Store reactivo", tone: "accent" })] }), _jsxs("p", { class: "bento-copy", children: ["Un ", _jsx("code", { children: "select" }), " derivado avanza con el reloj:"] }), _jsxs("div", { class: "ticker", children: [_jsx("span", { class: "ticker-key", children: "Timestamp reactivo:" }), _jsx("span", { class: "ticker-value", children: this.vClock })] }), _jsx("p", { class: "note", children: "Sin reconciliaci\u00F3n, sin virtual DOM: un Store cambia y el texto del nodo se actualiza de forma at\u00F3mica y quir\u00FArgica." })] }));
        const cSample = (_jsxs("article", { class: "bento-card bento-card--violet", id: "empezar", children: [_jsxs("div", { class: "bento-head", children: [_jsx("h3", { class: "bento-title", children: "As\u00ED de peque\u00F1o es empezar" }), _jsxs("button", { type: "button", class: "copy", "on:click": () => this.vCopy(), children: [Element.new('span', { html: HeroPage.COPY_ICON }), _jsx("span", { children: this.vCopyLabel })] })] }), _jsx("p", { class: "bento-copy", children: "Todo lo necesario para iniciar tu aplicaci\u00F3n aut\u00F3noma con vizui:" }), _jsx("div", { class: "quickstart", children: this.vSampleApp }), _jsxs("div", { class: "hp-mini", children: [_jsx("span", { class: "mini-label", children: "patr\u00F3n montado" }), _jsxs("span", { class: "mini-line", children: ["Hello, ", _jsx("strong", { children: this.vGreeting }), " \u2014 nodo reactivo"] }), _jsx("button", { type: "button", class: "hp-btn", "on:click": () => this.vHello(), children: "Saludar" })] })] }));
        const cBento = (_jsxs("section", { class: "section", id: "reactividad", children: [_jsx(SectionHeader, { eyebrow: "Ecosistema y ejecuci\u00F3n", tone: "violet", title: "Reactividad y arranque instant\u00E1neo" }), _jsxs("div", { class: "bento", children: [cLive, cProject, cSample] })] }));
        const cQuote = (_jsx("section", { class: "section section--plain", id: "filosofia", children: _jsxs("div", { class: "manifesto", children: [_jsx("span", { class: "manifesto-eyebrow", children: "Manifiesto arquitect\u00F3nico" }), _jsx("p", { class: "manifesto-quote", children: "\u00ABEl objetivo no es que el c\u00F3digo parezca \"buen c\u00F3digo\" seg\u00FAn un est\u00E1ndar gen\u00E9rico. El objetivo es que el c\u00F3digo sea intr\u00EDnsecamente coherente con la arquitectura del proyecto.\u00BB" }), _jsxs("a", { class: "manifesto-link", href: "#", "on:click": (event) => { event.preventDefault(); this.vGo('/philosophy'); }, children: ["Nuestra filosof\u00EDa ", _jsx("span", { class: "manifesto-arrow", children: "\u2192" })] })] }) }));
        this.root = (_jsxs("div", { class: "HeroPage", children: [new SectionDock(), cHero, cSuite, cBento, cQuote] }));
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
    render(data) {
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
    static isSources(value) {
        if (typeof value !== 'object' || value === null)
            return false;
        const sources = value;
        return typeof sources.jsx === 'string'
            && typeof sources.imperative === 'string'
            && typeof sources.app === 'string';
    }
    /**
     * Builds the row shown when a sample cannot be downloaded.
     * @param message - The failure message.
     * @returns The error row element.
     */
    vErrorRow(message) {
        return _jsx("p", { class: "sample-error", children: message });
    }
    /** Cycles the greeting shown by the mounted mini-app. **/
    vHello() {
        this.vGreeting.smartSet(prev => (prev === 'vizui' ? 'mundo' : prev === 'mundo' ? 'usuaria' : 'vizui'));
    }
    /** Copies the quickstart snippet and confirms it briefly. **/
    vCopy() {
        void navigator.clipboard?.writeText(this.vAppRaw).catch(() => undefined);
        this.vCopyLabel.set('¡Copiado!');
        setTimeout(() => { if (this.vAlive)
            this.vCopyLabel.set('Copiar'); }, 1800);
    }
    /**
     * Navigates to a route through the application router.
     * @param path - The route path to navigate to.
     */
    vGo(path) {
        app.router.navigate(path);
    }
    /** Opens the project repository. **/
    vOpenGitHub() {
        window.open('https://github.com/NetFeez/vizui', '_blank', 'noopener');
    }
}
export default HeroPage;
//# sourceMappingURL=HeroPage.js.map