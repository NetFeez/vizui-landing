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

export class SandBox extends View<'div', SandBox.EventMap> {
    static { this.css.load('SandBox.css', import.meta); }

    private static readonly RUN_ICON = '<svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.14v13.72L19 12 8 5.14z"></path></svg>';
    private static readonly RESET_ICON = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M4 4v6h6M20 20v-6h-6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path><path d="M20 9a8 8 0 00-14.9-3M4 15a8 8 0 0014.9 3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>';

    public readonly root: Element<Element.Type['div']>;
    private readonly cModule: CodeEditor;
    private readonly cStyle: CodeEditor;
    private readonly eStyleTag: Element<HTMLStyleElement>;
    private readonly eStage: Element<Element.Type['div']>;
    private readonly eError: Element<Element.Type['p']>;
    private readonly vStatus = Store.create('sin ejecutar');
    private readonly vMounted = Store.create<Element.ElementType[]>([]);
    private vCurrent: Element | null = null;
    private vTimer = 0;
    private vRunning = false;
    private vQueued = false;
    private vAlive = true;

    public constructor() { super();
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

        this.eStage = (
            <div class="stage" data-purpose="sandbox-preview">
                {this.vMounted}
            </div>
        );

        this.eError = <p class="error" role="alert"></p>;

        const eEditor = (
            <section class="panel" aria-label="Editor del módulo">
                <div class="bar">
                    <span class="dots" aria-hidden="true">
                        <span class="dot dot--rose"></span>
                        <span class="dot dot--amber"></span>
                        <span class="dot dot--emerald"></span>
                    </span>
                    <span class="file">sandbox/MyComponent.jsx</span>
                    <span class="status">{this.vStatus}</span>
                </div>
                {this.cModule}
                <div class="panel-actions">
                    <button type="button" class="action action--ghost" on:click={() => this.vReset()}>
                        {Element.new('span', { html: SandBox.RESET_ICON })}
                        <span>Reset</span>
                    </button>
                    <button type="button" class="action action--primary" on:click={() => this.vRun(true)}>
                        {Element.new('span', { html: SandBox.RUN_ICON })}
                        <span>Ejecutar</span>
                    </button>
                </div>
            </section>
        );

        const eCss = (
            <section class="panel panel--css" aria-label="Estilos del módulo">
                <div class="bar">
                    <span class="file">sandbox/MyComponent.css</span>
                </div>
                {this.cStyle}
            </section>
        );

        const ePreview = (
            <section class="panel panel--preview">
                <div class="bar">
                    <span class="file">
                        <span class="live"></span>
                        Preview · new MyComponent()
                    </span>
                    <span class="chip">export default</span>
                </div>
                {this.eStage}
                {this.eError}
            </section>
        );

        this.root = (
            <div class="SandBox">
                <PageHeader
                    title="Sandbox"
                    description="Escribe un módulo de vizui con JSX a la izquierda: se transforma a jsx-runtime y se ejecuta al instante. Lo que exportes como default se instancia con `new` y se monta a la derecha, sobre el DOM real."
                />
                <div class="grid">
                    <div class="column">{eEditor}{eCss}</div>
                    {ePreview}
                </div>
                {this.eStyleTag}
            </div>
        );

        this.root.observer.on('remove', () => {
            this.vAlive = false;
            this.vClear();
            this.vStatus.destroy();
            this.vMounted.destroy();
        });

        this.vRun();
    }

    /** Schedules a debounced run for the given delay. **/
    private vSchedule(delay: number): void {
        if (!this.vAlive) return;
        clearTimeout(this.vTimer);
        this.vTimer = window.setTimeout(() => this.vRun(), delay);
    }

    /**
     * Evaluates the module, swaps the preview mount and reports status or failure.
     * @param force - Whether to skip the short-circuit when an equal run is pending.
     */
    private async vRun(force = false): Promise<void> {
        if (!this.vAlive) return;
        if (force) { clearTimeout(this.vTimer); }

        if (this.vRunning) { this.vQueued = true; return; }
        this.vRunning = true;
        this.vStatus.set('ejecutando…');

        const result = await Runner.load(this.cModule.text);

        if (this.vAlive && result.ok) {
            try { this.vMount(result.value); }
            catch (error) {
                this.vFail(error instanceof Error ? error.message : 'La instancia falló al montarse.', false);
            }
        }
        else if (this.vAlive) {
            this.vFail(result.error ?? 'Error desconocido.', result.incomplete === true);
        }

        this.vRunning = false;
        if (this.vQueued) { this.vQueued = false; void this.vRun(); }
    }

    /**
     * Mounts the evaluation result into the stage: constructs classes, calls factories
     * and appends ready Elements.
     * @param value - The default export of the evaluated module.
     */
    private vMount(value: unknown): void {
        if (typeof value === 'function') value = new (value as new() => unknown)();
        const node = Element.isElement(value)
            ? value
            : Element.isElement((value as { root?: unknown })?.root) ? (value as { root: Element }).root : null;

        if (!node) throw new Error('El default export debe ser un Component, un Element o una función que devuelva uno.');
        this.vClear();
        this.vCurrent = node;
        this.vMounted.set([node]);
        this.eError.setText('');
        this.eError.toggleClass('visible', false);
        this.eStage.toggleClass('empty', false);
        this.vStatus.set('en vivo');
    }

    /** Tears down the currently mounted instance. **/
    private vClear(): void {
        this.vCurrent?.remove();
        this.vCurrent = null;
    }

    /**
     * Paints a failure and marks the status. Transient stalls (partial JSX while
     * typing) keep the last mounted preview; only dead runs clear the stage.
     * @param message - The failure message.
     * @param incomplete - Whether the source is merely unfinished.
     */
    private vFail(message: string, incomplete: boolean): void {
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
    private vReset(): void {
        if (!this.vAlive) return;
        this.cModule.setText(DEFAULT_MODULE);
        this.cStyle.setText(DEFAULT_CSS);
        this.eStyleTag.setText(DEFAULT_CSS);
        void this.vRun(true);
    }
}

export namespace SandBox {
    export type EventMap = {
        [key: string]: never;
    };
}

export default SandBox;
