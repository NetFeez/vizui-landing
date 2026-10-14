/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Architecture page — the responsibility split of an application built with vizui.
 * @license Apache-2.0
 */

import { Store, View, type Element } from 'vizui';

import Card from '../../components/Card/Card.js';
import CodeBlock from '../../components/Markdown/CodeBlock/CodeBlock.js';
import PageHeader from '../../components/PageHeader/PageHeader.js';
import Toc from '../../components/Toc/Toc.js';

const ARCHITECTURE_SECTIONS: readonly Toc.Section[] = [
    { id: 'flujo', label: 'Flujo' },
    { id: 'un-proyecto-tipico', label: 'Un proyecto típico' },
    { id: 'regla-de-oro', label: 'Regla de oro' },
];

export class ArchitecturePage extends View<'div', ArchitecturePage.EventMap> {
    static { this.css.load('ArchitecturePage.css', import.meta); }

    public readonly root: Element<Element.Type['div']>;
    private readonly vTreeCode = Store.create<Element.ElementType[]>([]);

    public constructor() { super();
        this.root = (
            <div class="ArchitecturePage">
                <PageHeader title="Arquitectura" description="Cada capa sabe qué hace; la dependencia se puede seguir en el código." />
                <div class="body">
                    <aside class="toc">{new Toc(ARCHITECTURE_SECTIONS)}</aside>
                    <div class="content">
                        <section id="flujo">
                            <Card title="Flujo">
                                <p>
                                    <code>app.ts</code> compone el <code>App</code>, el router y los servicios.
                                    <code>renderer.tsx</code> registra rutas. Cada ruta construye una vista,
                                    que se sirve de componentes con estado y de funciones JSX que no conocen el dominio.
                                </p>
                            </Card>
                        </section>
                        <section id="un-proyecto-tipico">
                            <Card title="Un proyecto típico">
                                {this.vTreeCode}
                            </Card>
                        </section>
                        <section id="regla-de-oro">
                            <Card title="Regla de oro">
                                <p>
                                    El estado vive donde nace la responsabilidad, se inyecta por composición
                                    y se destruye cuando el nodo deja el árbol. Nada espera a un global.
                                </p>
                            </Card>
                        </section>
                    </div>
                </div>
            </div>
        );

        this.root.observer.on('remove', () => this.vTreeCode.destroy());
    }

    /**
     * Paints the project tree delivered by the route loader.
     * @param data - The downloaded tree, or null when it could not be fetched.
     */
    public render(data?: unknown): void {
        this.vTreeCode.set(typeof data === 'string' ? [CodeBlock({ code: data })] : [this.vErrorRow('No se pudo cargar el árbol.')]);
    }

    /**
     * Builds the row shown when the tree cannot be downloaded.
     * @param message - The failure message.
     * @returns The error row element.
     */
    private vErrorRow(message: string): Element<Element.Type['p']> {
        return <p class="error">{message}</p>;
    }
}

export namespace ArchitecturePage {
    export type EventMap = {
        [key: string]: never;
    };
}

export default ArchitecturePage;