import { jsx as _jsx, jsxs as _jsxs } from "vizui/jsx-runtime";
/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Features page — the design principles of vizui, an honest mental-model comparison and the FAQ.
 * @license Apache-2.0
 */
import { View } from 'vizui';
import Card from '../../components/Card/Card.js';
import PageHeader from '../../components/PageHeader/PageHeader.js';
const MENTAL_MODEL = [
    { dimension: 'Virtual DOM', common: 'reconcilia un árbol sintético', vizui: 'no existe: el coste es el DOM que tocas' },
    { dimension: 'JSX', common: 'obligatorio', vizui: 'opcional — Element.new es la misma API' },
    { dimension: 'Build step', common: 'impuesto por el framework', vizui: 'tuyo: tsc + importmap, como esta página' },
    { dimension: 'Estado global', common: 'a menudo implícito o con magia', vizui: 'Stores tipados y composición explícita' },
    { dimension: 'Dependencias en runtime', common: 'con frecuencia decenas', vizui: 'cero' },
    { dimension: 'Renderizado', common: 'componentes → patch al DOM', vizui: 'componentes → el DOM' },
];
const FAQ = [
    {
        question: '¿Sin virtual DOM? ¿Y el rendimiento?',
        answer: 'El modelo común difiere todo el trabajo para minimizar cambios. vizui en su lugar actualiza el nodo exacto que enlazaste a un Store: el coste de cada actualización es el del DOM que tocas. Es una elección de trazabilidad, no una promesa mágica. Si tu lista es gigante y muy dinámica, mide: aquí cada cambio cuesta lo que cuesta.',
    },
    {
        question: '¿Necesito un build step?',
        answer: 'El framework no impone ninguno. Esta página se publica con tsconfig, tsc y un importmap plano — sin bundler. Si tu proyecto ya usa uno, vizui no se interpone.',
    },
    {
        question: '¿JSX o sin JSX?',
        answer: 'Ambos, hasta por componente. Los widgets de vizui.components se instancian sin JSX, y el contador ImperativeCounter.ts de la portada está escrito sin una sola etiqueta JSX.',
    },
    {
        question: '¿Cuándo NO elegir esto?',
        answer: 'Si quieres un framework que decida la arquitectura por ti, o si necesitas encajar estrictamente en el ecosistema de un framework concreto. vizui entrega la capa; la organización del proyecto es tuya.',
    },
    {
        question: '¿En qué se diferencia de React?',
        answer: 'En el modelo mental: sin árbol sintético, sin reconciliación global, sin render por difusión. Lo que escribes es el DOM. No afirmamos que sea mejor para tu caso; afirmamos que lo que ves es lo que hay.',
    },
];
export class FeaturesPage extends View {
    static { this.css.load('FeaturesPage.css', import.meta); }
    root;
    constructor() {
        super();
        const grid = (_jsxs("div", { class: "fp-grid", children: [_jsx(Card, { title: "Sin magia", children: _jsx("p", { children: "JSX directo sobre el DOM real. Un componente es un componente: sin decoradores, sin hooks, sin servicios globales que mutan la ejecuci\u00F3n." }) }), _jsx(Card, { title: "Stores reactivos", children: _jsxs("p", { children: [_jsx("code", { children: "Store.create" }), ", ", _jsx("code", { children: "select" }), ", ", _jsx("code", { children: "subscribe" }), ": estado tipado y derivado que se observa, no se adivina. Los Stores derivados se destruyen y liberan sus suscripciones."] }) }), _jsx(Card, { title: "Componentes nativos", children: _jsxs("p", { children: [_jsx("code", { children: "Component" }), ", ", _jsx("code", { children: "Layout" }), " y ", _jsx("code", { children: "View" }), " se componen por herencia y composici\u00F3n, nunca por clases fantasma. El ciclo de vida es expl\u00EDcito: ", _jsx("code", { children: "observer.on('remove', \u2026)" }), "."] }) }), _jsx(Card, { title: "CSS junto al componente", children: _jsxs("p", { children: ["Cada componente carga su hoja con ", _jsx("code", { children: "CSS.load" }), "; la cascada se organiza en capas declaradas y estilos que viven al lado de su c\u00F3digo."] }) }), _jsx(Card, { title: "Arquitectura expl\u00EDcita", children: _jsx("p", { children: "Composici\u00F3n ra\u00EDz, router, p\u00E1ginas y capas de componentes con responsabilidades separadas y trazables. La p\u00E1gina de Arquitectura lo muestra con el propio proyecto." }) }), _jsx(Card, { title: "TypeScript de dise\u00F1o", children: _jsx("p", { children: "Tipos significativos, uniones discriminadas y stores invariantes: el compilador expresa los l\u00EDmites de la arquitectura en el momento de escribir." }) })] }));
        const notIncluded = (_jsx(Card, { title: "Lo que vizui no incluye, a prop\u00F3sito", children: _jsxs("ul", { class: "list", children: [_jsxs("li", { children: [_jsx("strong", { children: "No inventa un DSL:" }), " JSX est\u00E1ndar y DOM real. Lo que pintas es lo que hay."] }), _jsxs("li", { children: [_jsx("strong", { children: "No promete rendimiento m\u00E1gico:" }), " el coste de cada actualizaci\u00F3n es el coste del DOM que tocas."] }), _jsxs("li", { children: [_jsx("strong", { children: "No tiene build propio:" }), " usas tu `tsc`, tu bundler o, como esta p\u00E1gina, un importmap plano."] }), _jsxs("li", { children: [_jsx("strong", { children: "No impone state management:" }), " recomienda Stores y composici\u00F3n, pero la organizaci\u00F3n es tuya."] }), _jsxs("li", { children: [_jsx("strong", { children: "No trae magia global:" }), " lo global es una decisi\u00F3n expl\u00EDcita del proyecto, no un default."] })] }) }));
        const model = (_jsxs(Card, { title: "Cambio de mentalidad", children: [_jsx("p", { class: "note", children: "Una comparaci\u00F3n arquitect\u00F3nica, no una guerra de benchmarks. Hechos que puedes comprobar en el c\u00F3digo y en esta misma p\u00E1gina." }), _jsxs("table", { class: "fp-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { scope: "col" }), _jsx("th", { scope: "col", children: "El modelo com\u00FAn" }), _jsx("th", { scope: "col", children: "vizui" })] }) }), _jsx("tbody", { children: MENTAL_MODEL.map(row => (_jsxs("tr", { children: [_jsx("th", { scope: "row", children: _jsx("code", { children: row.dimension }) }), _jsx("td", { children: row.common }), _jsx("td", { children: row.vizui })] }))) })] })] }));
        const faq = (_jsx(Card, { title: "Preguntas que nos har\u00EDan", children: _jsx("div", { class: "faq", children: FAQ.map(entry => (_jsxs("details", { class: "fp-faq-item", children: [_jsx("summary", { children: entry.question }), _jsx("p", { children: entry.answer })] }))) }) }));
        this.root = (_jsxs("div", { class: "FeaturesPage", children: [_jsx(PageHeader, { title: "Caracter\u00EDsticas", description: "Los principios de dise\u00F1o de vizui, no sus accidentes." }), grid, model, notIncluded, faq] }));
    }
}
export default FeaturesPage;
//# sourceMappingURL=FeaturesPage.js.map