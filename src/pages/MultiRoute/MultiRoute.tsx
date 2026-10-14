/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Route demo — the same view mounted on several routes: each route declares its own loader
 *              and the resolved data arrives to `render`. Route of testing, not linked from the navigation.
 * @license Apache-2.0
 */

import { Store, View, type Element } from 'vizui';

import Card from '../../components/Card/Card.js';
import CodeBlock from '../../components/Markdown/CodeBlock/CodeBlock.js';
import PageHeader from '../../components/PageHeader/PageHeader.js';

export class MultiRoute extends View<'div', MultiRoute.EventMap> {
    static { this.css.load('MultiRoute.css', import.meta); }

    public readonly root: Element<Element.Type['div']>;
    private readonly vCode = Store.create<Element.ElementType[]>([]);

    public constructor() { super();
        this.root = (
            <div class="MultiRoute">
                <PageHeader
                    title="MultiRoute (prueba)"
                    description="La misma clase de vista, montada en varias rutas. Cada ruta declara su loader y entrega datos distintos a render(data)."
                />
                <section class="section">
                    <Card title="Datos recibidos">
                        {this.vCode}
                    </Card>
                </section>
            </div>
        );

        this.root.observer.on('remove', () => this.vCode.destroy());
    }

    /**
     * Paints the payload of whichever route mounted this view.
     * @param data - The produced data (string), or null when the loader could not produce it.
     */
    public render(data?: unknown): void {
        this.vCode.set(typeof data === 'string' ? [CodeBlock({ code: data })] : [this.vErrorRow('El loader devolvió nada en esta ruta.')]);
    }

    /**
     * Builds the row shown when the loader produced nothing.
     * @param message - The failure message.
     * @returns The error row element.
     */
    private vErrorRow(message: string): Element<Element.Type['p']> {
        return <p class="error">{message}</p>;
    }
}

export namespace MultiRoute {
    export type EventMap = {
        [key: string]: never;
    };
}

export default MultiRoute;