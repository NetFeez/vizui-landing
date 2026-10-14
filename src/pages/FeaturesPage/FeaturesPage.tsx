/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Features page — the design principles of vizui, an honest mental-model comparison and the FAQ.
 * @license Apache-2.0
 */

import { View, type Element } from 'vizui';

import Card from '../../components/Card/Card.js';
import PageHeader from '../../components/PageHeader/PageHeader.js';

const MENTAL_MODEL: readonly FeaturesPage.Row[] = [
    { dimension: 'Virtual DOM', common: 'reconcilia un árbol sintético', vizui: 'no existe: el coste es el DOM que tocas' },
    { dimension: 'JSX', common: 'obligatorio', vizui: 'opcional — Element.new es la misma API' },
    { dimension: 'Build step', common: 'impuesto por el framework', vizui: 'tuyo: tsc + importmap, como esta página' },
    { dimension: 'Estado global', common: 'a menudo implícito o con magia', vizui: 'Stores tipados y composición explícita' },
    { dimension: 'Dependencias en runtime', common: 'con frecuencia decenas', vizui: 'cero' },
    { dimension: 'Renderizado', common: 'componentes → patch al DOM', vizui: 'componentes → el DOM' },
];

const FAQ: readonly FeaturesPage.FaqEntry[] = [
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

export class FeaturesPage extends View<'div', FeaturesPage.EventMap> {
    static { this.css.load('FeaturesPage.css', import.meta); }

    public readonly root: Element<Element.Type['div']>;

    public constructor() { super();
        const grid = (
            <div class="fp-grid">
                <Card title="Sin magia">
                    <p>JSX directo sobre el DOM real. Un componente es un componente: sin decoradores, sin hooks, sin servicios globales que mutan la ejecución.</p>
                </Card>
                <Card title="Stores reactivos">
                    <p><code>Store.create</code>, <code>select</code>, <code>subscribe</code>: estado tipado y derivado que se observa, no se adivina. Los Stores derivados se destruyen y liberan sus suscripciones.</p>
                </Card>
                <Card title="Componentes nativos">
                    <p><code>Component</code>, <code>Layout</code> y <code>View</code> se componen por herencia y composición, nunca por clases fantasma. El ciclo de vida es explícito: <code>observer.on('remove', …)</code>.</p>
                </Card>
                <Card title="CSS junto al componente">
                    <p>Cada componente carga su hoja con <code>CSS.load</code>; la cascada se organiza en capas declaradas y estilos que viven al lado de su código.</p>
                </Card>
                <Card title="Arquitectura explícita">
                    <p>Composición raíz, router, páginas y capas de componentes con responsabilidades separadas y trazables. La página de Arquitectura lo muestra con el propio proyecto.</p>
                </Card>
                <Card title="TypeScript de diseño">
                    <p>Tipos significativos, uniones discriminadas y stores invariantes: el compilador expresa los límites de la arquitectura en el momento de escribir.</p>
                </Card>
            </div>
        );

        const notIncluded = (
            <Card title="Lo que vizui no incluye, a propósito">
                <ul class="list">
                    <li><strong>No inventa un DSL:</strong> JSX estándar y DOM real. Lo que pintas es lo que hay.</li>
                    <li><strong>No promete rendimiento mágico:</strong> el coste de cada actualización es el coste del DOM que tocas.</li>
                    <li><strong>No tiene build propio:</strong> usas tu `tsc`, tu bundler o, como esta página, un importmap plano.</li>
                    <li><strong>No impone state management:</strong> recomienda Stores y composición, pero la organización es tuya.</li>
                    <li><strong>No trae magia global:</strong> lo global es una decisión explícita del proyecto, no un default.</li>
                </ul>
            </Card>
        );

        const model = (
            <Card title="Cambio de mentalidad">
                <p class="note">Una comparación arquitectónica, no una guerra de benchmarks. Hechos que puedes comprobar en el código y en esta misma página.</p>
                <table class="fp-table">
                    <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">El modelo común</th>
                            <th scope="col">vizui</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MENTAL_MODEL.map(row => (
                            <tr>
                                <th scope="row"><code>{row.dimension}</code></th>
                                <td>{row.common}</td>
                                <td>{row.vizui}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        );

        const faq = (
            <Card title="Preguntas que nos harían">
                <div class="faq">
                    {FAQ.map(entry => (
                        <details class="fp-faq-item">
                            <summary>{entry.question}</summary>
                            <p>{entry.answer}</p>
                        </details>
                    ))}
                </div>
            </Card>
        );

        this.root = (
            <div class="FeaturesPage">
                <PageHeader title="Características" description="Los principios de diseño de vizui, no sus accidentes." />
                {grid}
                {model}
                {notIncluded}
                {faq}
            </div>
        );
    }
}

export namespace FeaturesPage {
    /** A row of the mental-model comparison. **/
    export interface Row {
        dimension: string;
        common: string;
        vizui: string;
    }

    /** An entry of the frequently asked questions. **/
    export interface FaqEntry {
        question: string;
        answer: string;
    }

    export type EventMap = {
        [key: string]: never;
    };
}

export default FeaturesPage;