/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Components page — live showcase of vizui.components widgets.
 * @license Apache-2.0
 */

import { Store, View, type Element } from 'vizui';

import Button from 'vizui.components/Button/Button.js';
import Loading from 'vizui.components/Loading/Loading.js';
import NumericInput from 'vizui.components/NumericInput/NumericInput.js';
import SelectInput from 'vizui.components/SelectInput/SelectInput.js';
import SwitchInput from 'vizui.components/SwitchInput/SwitchInput.js';
import TextInput from 'vizui.components/TextInput/TextInput.js';
import Window from 'vizui.components/Window/Window.js';

import Card from '../../components/Card/Card.js';
import CodeBlock from '../../components/Markdown/CodeBlock/CodeBlock.js';
import PageHeader from '../../components/PageHeader/PageHeader.js';

export class ComponentsPage extends View<'div', ComponentsPage.EventMap> {
    static { this.css.load('ComponentsPage.css', import.meta); }

    public readonly root: Element<Element.Type['div']>;
    private readonly eHost: Element<Element.Type['div']>;
    private readonly eLog: Element<Element.Type['ul']>;
    private readonly cLoading = new Loading();
    private readonly vLog = Store.create<Element[]>([]);
    private readonly vBehindCode = Store.create<Element.ElementType[]>([]);
    private vLoadingShown = false;

    public constructor() { super();
        this.eLog = <ul class="log">{this.vLog}</ul>;
        this.eHost = <div class="host"></div>;

        const eButtons = <div class="row"></div>;
        for (const variant of ['primary', 'ghost', 'outline', 'danger'] as const) {
            const cButton = new Button({ text: `Botón ${variant}`, class: `btn--${variant}` });
            cButton.on('click', () => this.vLogEvent('botón', variant));
            eButtons.append(cButton);
        }

        const cText = new TextInput({
            input: { placeholder: 'Escribe un texto…' },
            button: { text: 'Enviar' },
        });
        cText.on('submit', text => this.vLogEvent('texto', text));
        cText.on('invalid', () => this.vLogEvent('texto', 'inválido'));

        const cNumeric = new NumericInput({ placeholder: 'Importe', value: 42, button: 'Calcular' });
        cNumeric.on('submit', value => this.vLogEvent('número', String(value)));

        const cSwitch = new SwitchInput({ label: 'Modo seguro', defaultState: false });
        cSwitch.on('change', state => this.vLogEvent('interruptor', state ? 'ON' : 'OFF'));

        const cSelect = new SelectInput({ optionList: ['Plaga', 'Ender', 'Wither', 'Allay'], placeholder: 'Modelo' });
        cSelect.on('submit', model => this.vLogEvent('modelo', model || '—'));

        const cWindow = new Button({ text: 'Abrir ventana', class: 'btn--outline' });
        cWindow.on('click', () => this.vOpenWindow());

        const cLoadingToggle = new Button({ text: 'Cargando', class: 'btn--ghost' });
        cLoadingToggle.on('click', () => this.vToggleLoading());

        const formGrid = (
            <div class="grid">
                <div class="field">{cText}</div>
                <div class="field">{cNumeric}</div>
                <div class="field">{cSwitch}</div>
                <div class="field">{cSelect}</div>
            </div>
        );

        const actions = <div class="row">{cWindow}{cLoadingToggle}</div>;

        const behind = (
            <Card title="Detrás de esta página">
                <p class="note">
                    Ninguno de los componentes de arriba necesita JSX: se instancian y se
                    componen con <code>new</code> y <code>on</code>, y se montan como nodos.
                </p>
                {this.vBehindCode}
            </Card>
        );

        this.root = (
            <div class="ComponentsPage">
                <PageHeader title="Componentes" description="Ejemplos en vivo de los componentes reutilizables de vizui.components." />
                <Card title="Botones">
                    {eButtons}
                </Card>
                <Card title="Entradas">
                    {formGrid}
                </Card>
                <Card title="Ventana y carga">
                    {actions}
                    <div class="host-wrap">{this.eHost}{this.cLoading}</div>
                </Card>
                <Card title="Registro de eventos">
                    {this.eLog}
                </Card>
                {behind}
            </div>
        );

        this.root.observer.on('remove', () => {
            this.vLog.destroy();
            this.vBehindCode.destroy();
        });
    }

    /**
     * Paints the behind-the-scenes sample delivered by the route loader.
     * @param data - The downloaded sample, or null when it could not be fetched.
     */
    public render(data?: unknown): void {
        this.vBehindCode.set(typeof data === 'string' ? [CodeBlock({ code: data })] : [this.vErrorRow('No se pudo cargar el ejemplo.')]);
    }

    /**
     * Builds the row shown when the sample cannot be downloaded.
     * @returns The error row element.
     */
    private vErrorRow(message: string): Element<Element.Type['p']> {
        return <p class="sample-error">{message}</p>;
    }

    /**
     * Prepedhes an entry in the event log, keeping at most six entries.
     * @param kind - The kind of the emitter.
     * @param value - The value produced by the event.
     */
    private vLogEvent(kind: string, value: string): void {
        this.vLog.smartSet(prev => [
            <li class="log-entry">
                <span class="log-kind">{kind}</span>
                <span class="log-value">{value}</span>
            </li>,
            ...prev,
        ].slice(0, 6));
    }

    /** Opens a draggable and resizable window inside the host. **/
    private vOpenWindow(): void {
        const content = <p class="window-text">Ventana arrastrable y redimensionable de vizui.components.</p>;
        const cWindow = new Window({ title: 'Ventana de muestra', width: 320, height: 180, x: 24, y: 24, children: [content] });
        cWindow.on('close', () => cWindow.remove());
        cWindow.appendTo(this.eHost);
    }

    /** Toggles the loading overlay inside the host. **/
    private vToggleLoading(): void {
        if (this.vLoadingShown) {
            this.vLoadingShown = false;
            this.cLoading.finish();
        }
        else {
            this.vLoadingShown = true;
            this.cLoading.spawn(this.eHost);
        }
    }
}

export namespace ComponentsPage {
    export type EventMap = {
        [key: string]: never;
    };
}

export default ComponentsPage;