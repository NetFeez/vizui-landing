import { jsx as _jsx, jsxs as _jsxs } from "vizui/jsx-runtime";
/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Live sandbox — an editable layer whose children ARE the highlighted tokens
 *              (what you edit and what you see is the same DOM), so the code and the style
 *              editors align by construction. The module is evaluated on every edit and whatever
 *              it exports as default is mounted next to the editor: a Component, a factory
 *              or a ready Element. The evaluation runs through a throwaway object-url module,
 *              so imports resolve over the same import map as the page itself, and the JSX is
 *              transformed to jsx-runtime calls at that point.
 * @license Apache-2.0
 */
import { Element, Store, View } from 'vizui';
import PageHeader from '../../components/PageHeader/PageHeader.js';
import CodeEditor from './Editor.js';
import Runner from './Runner.js';
import { DEFAULT_CSS, DEFAULT_MODULE } from './Snippet.js';
export class SandBox extends View {
    static { this.css.load('SandBox.css', import.meta); }
    static RUN_ICON = '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v13.72L19 12 8 5.14z"></path></svg>';
    static RESET_ICON = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M4 4v6h6M20 20v-6h-6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><path d="M20 9a8 8 0 00-14.9-3M4 15a8 8 0 0014.9 3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>';
    root;
    cModule;
    cStyle;
    eStyleTag;
    eStage;
    eError;
    vStatus = Store.create('sin ejecutar');
    vMounted = Store.create([]);
    vCurrent = null;
    vTimer = 0;
    vRunning = false;
    vQueued = false;
    vAlive = true;
    constructor() {
        super();
        this.cModule = new CodeEditor({
            label: 'Código del módulo',
            value: DEFAULT_MODULE,
            onInput: () => this.vSchedule(600),
            onRun: () => this.vRun(true),
        });
        this.cStyle = new CodeEditor({
            mode: 'css',
            label: 'Estilos del módulo',
            value: DEFAULT_CSS,
            onInput: text => this.eStyleTag.setText(text),
        });
        this.eStyleTag = Element.new('style');
        this.eStyleTag.setText(DEFAULT_CSS);
        this.eStage = (_jsx("div", { class: "stage", "data-purpose": "sandbox-preview", children: this.vMounted }));
        this.eError = _jsx("p", { class: "error", role: "alert" });
        const eEditor = (_jsxs("section", { class: "panel", "aria-label": "Editor del m\u00F3dulo", children: [_jsxs("div", { class: "bar", children: [_jsxs("span", { class: "dots", "aria-hidden": "true", children: [_jsx("span", { class: "dot dot--rose" }), _jsx("span", { class: "dot dot--amber" }), _jsx("span", { class: "dot dot--emerald" })] }), _jsx("span", { class: "file", children: "sandbox/MyComponent.jsx" }), _jsx("span", { class: "status", children: this.vStatus })] }), this.cModule, _jsxs("div", { class: "panel-actions", children: [_jsxs("button", { type: "button", class: "action action--ghost", "on:click": () => this.vReset(), children: [Element.new('span', { html: SandBox.RESET_ICON }), _jsx("span", { children: "Reset" })] }), _jsxs("button", { type: "button", class: "action action--primary", "on:click": () => this.vRun(true), children: [Element.new('span', { html: SandBox.RUN_ICON }), _jsx("span", { children: "Ejecutar" })] })] })] }));
        const eCss = (_jsxs("section", { class: "panel panel--css", "aria-label": "Estilos del m\u00F3dulo", children: [_jsx("div", { class: "bar", children: _jsx("span", { class: "file", children: "sandbox/MyComponent.css" }) }), this.cStyle] }));
        const ePreview = (_jsxs("section", { class: "panel panel--preview", children: [_jsxs("div", { class: "bar", children: [_jsxs("span", { class: "file", children: [_jsx("span", { class: "live" }), "Preview \u00B7 new MyComponent()"] }), _jsx("span", { class: "chip", children: "export default" })] }), this.eStage, this.eError] }));
        this.root = (_jsxs("div", { class: "SandBox", children: [_jsx(PageHeader, { title: "Sandbox", description: "Escribe un m\u00F3dulo de vizui con JSX a la izquierda: se transforma a jsx-runtime y se ejecuta al instante. Lo que exportes como default se instancia con `new` y se monta a la derecha, sobre el DOM real." }), _jsxs("div", { class: "grid", children: [_jsxs("div", { class: "column", children: [eEditor, eCss] }), ePreview] }), this.eStyleTag] }));
        this.root.observer.on('remove', () => {
            this.vAlive = false;
            this.vClear();
            this.vStatus.destroy();
            this.vMounted.destroy();
        });
        this.vRun();
    }
    /** Schedules a debounced run for the given delay. **/
    vSchedule(delay) {
        if (!this.vAlive)
            return;
        clearTimeout(this.vTimer);
        this.vTimer = window.setTimeout(() => this.vRun(), delay);
    }
    /**
     * Evaluates the module, swaps the preview mount and reports status or failure.
     * @param force - Whether to skip the short-circuit when an equal run is pending.
     */
    async vRun(force = false) {
        if (!this.vAlive)
            return;
        if (force) {
            clearTimeout(this.vTimer);
        }
        if (this.vRunning) {
            this.vQueued = true;
            return;
        }
        this.vRunning = true;
        this.vStatus.set('ejecutando…');
        const result = await Runner.load(this.cModule.text);
        if (this.vAlive && result.ok) {
            try {
                this.vMount(result.value);
            }
            catch (error) {
                this.vFail(error instanceof Error ? error.message : 'La instancia falló al montarse.', false);
            }
        }
        else if (this.vAlive) {
            this.vFail(result.error ?? 'Error desconocido.', result.incomplete === true);
        }
        this.vRunning = false;
        if (this.vQueued) {
            this.vQueued = false;
            void this.vRun();
        }
    }
    /**
     * Mounts the evaluation result into the stage: constructs classes, calls factories
     * and appends ready Elements.
     * @param value - The default export of the evaluated module.
     */
    vMount(value) {
        if (typeof value === 'function')
            value = new value();
        const node = Element.isElement(value)
            ? value
            : Element.isElement(value?.root) ? value.root : null;
        if (!node)
            throw new Error('El default export debe ser un Component, un Element o una función que devuelva uno.');
        this.vClear();
        this.vCurrent = node;
        this.vMounted.set([node]);
        this.eError.setText('');
        this.eError.toggleClass('visible', false);
        this.eStage.toggleClass('empty', false);
        this.vStatus.set('en vivo');
    }
    /** Tears down the currently mounted instance. **/
    vClear() {
        this.vCurrent?.remove();
        this.vCurrent = null;
    }
    /**
     * Paints a failure and marks the status. Transient stalls (partial JSX while
     * typing) keep the last mounted preview; only dead runs clear the stage.
     * @param message - The failure message.
     * @param incomplete - Whether the source is merely unfinished.
     */
    vFail(message, incomplete) {
        if (!incomplete) {
            this.vClear();
            this.vMounted.set([]);
            this.eStage.toggleClass('empty', true);
        }
        this.eError.setText(message);
        this.eError.toggleClass('visible', true);
        this.vStatus.set(incomplete ? 'incompleto' : 'error');
    }
    /** Restores the seed sources and runs them immediately. **/
    vReset() {
        if (!this.vAlive)
            return;
        this.cModule.setText(DEFAULT_MODULE);
        this.cStyle.setText(DEFAULT_CSS);
        this.eStyleTag.setText(DEFAULT_CSS);
        void this.vRun(true);
    }
}
export default SandBox;
//# sourceMappingURL=SandBox.js.map