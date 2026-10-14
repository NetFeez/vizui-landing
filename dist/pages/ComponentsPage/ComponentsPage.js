import { jsx as _jsx, jsxs as _jsxs } from "vizui/jsx-runtime";
/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Components page — live showcase of vizui.components widgets.
 * @license Apache-2.0
 */
import { Store, View } from 'vizui';
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
export class ComponentsPage extends View {
    static { this.css.load('ComponentsPage.css', import.meta); }
    root;
    eHost;
    eLog;
    cLoading = new Loading();
    vLog = Store.create([]);
    vBehindCode = Store.create([]);
    vLoadingShown = false;
    constructor() {
        super();
        this.eLog = _jsx("ul", { class: "log", children: this.vLog });
        this.eHost = _jsx("div", { class: "host" });
        const eButtons = _jsx("div", { class: "row" });
        for (const variant of ['primary', 'ghost', 'outline', 'danger']) {
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
        const formGrid = (_jsxs("div", { class: "grid", children: [_jsx("div", { class: "field", children: cText }), _jsx("div", { class: "field", children: cNumeric }), _jsx("div", { class: "field", children: cSwitch }), _jsx("div", { class: "field", children: cSelect })] }));
        const actions = _jsxs("div", { class: "row", children: [cWindow, cLoadingToggle] });
        const behind = (_jsxs(Card, { title: "Detr\u00E1s de esta p\u00E1gina", children: [_jsxs("p", { class: "note", children: ["Ninguno de los componentes de arriba necesita JSX: se instancian y se componen con ", _jsx("code", { children: "new" }), " y ", _jsx("code", { children: "on" }), ", y se montan como nodos."] }), this.vBehindCode] }));
        this.root = (_jsxs("div", { class: "ComponentsPage", children: [_jsx(PageHeader, { title: "Componentes", description: "Ejemplos en vivo de los componentes reutilizables de vizui.components." }), _jsx(Card, { title: "Botones", children: eButtons }), _jsx(Card, { title: "Entradas", children: formGrid }), _jsxs(Card, { title: "Ventana y carga", children: [actions, _jsxs("div", { class: "host-wrap", children: [this.eHost, this.cLoading] })] }), _jsx(Card, { title: "Registro de eventos", children: this.eLog }), behind] }));
        this.root.observer.on('remove', () => {
            this.vLog.destroy();
            this.vBehindCode.destroy();
        });
    }
    /**
     * Paints the behind-the-scenes sample delivered by the route loader.
     * @param data - The downloaded sample, or null when it could not be fetched.
     */
    render(data) {
        this.vBehindCode.set(typeof data === 'string' ? [CodeBlock({ code: data })] : [this.vErrorRow('No se pudo cargar el ejemplo.')]);
    }
    /**
     * Builds the row shown when the sample cannot be downloaded.
     * @returns The error row element.
     */
    vErrorRow(message) {
        return _jsx("p", { class: "sample-error", children: message });
    }
    /**
     * Prepedhes an entry in the event log, keeping at most six entries.
     * @param kind - The kind of the emitter.
     * @param value - The value produced by the event.
     */
    vLogEvent(kind, value) {
        this.vLog.smartSet(prev => [
            _jsxs("li", { class: "log-entry", children: [_jsx("span", { class: "log-kind", children: kind }), _jsx("span", { class: "log-value", children: value })] }),
            ...prev,
        ].slice(0, 6));
    }
    /** Opens a draggable and resizable window inside the host. **/
    vOpenWindow() {
        const content = _jsx("p", { class: "window-text", children: "Ventana arrastrable y redimensionable de vizui.components." });
        const cWindow = new Window({ title: 'Ventana de muestra', width: 320, height: 180, x: 24, y: 24, children: [content] });
        cWindow.on('close', () => cWindow.remove());
        cWindow.appendTo(this.eHost);
    }
    /** Toggles the loading overlay inside the host. **/
    vToggleLoading() {
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
export default ComponentsPage;
//# sourceMappingURL=ComponentsPage.js.map