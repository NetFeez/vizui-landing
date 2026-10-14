/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Documentation page — the guide downloaded by the route loader, painted by the view, plus the merged About section.
 * @license Apache-2.0
 */

import { Store, View, type Element } from 'vizui';

import GithubCard from '../../components.smart/GithubCard/GithubCard.js';

import Card from '../../components/Card/Card.js';
import Markdown from '../../components/Markdown/Markdown.js';
import PageHeader from '../../components/PageHeader/PageHeader.js';
import Toc from '../../components/Toc/Toc.js';

export class DocsPage extends View<'div', DocsPage.EventMap> {
    static { this.css.load('DocsPage.css', import.meta); }

    public readonly root: Element<Element.Type['div']>;
    private readonly vItems = Store.create<Element.ElementType[]>([]);

    public constructor() { super();
        const eContent: Element<Element.Type['div']> = <div class="content">{this.vItems}</div>;
        this.root = (
            <div class="DocsPage">
                <PageHeader title="Documentación" description="Todo lo que hace vizui, explicado con el código que esta página misma usa." />
                <div class="body">
                    <aside class="DocsPage-toc">{new Toc(eContent)}</aside>
                    {eContent}
                </div>
                <section class="DocsPage-about">
                    <h2 class="about-title">Acerca</h2>
                    <div class="about-grid">
                        <Card title="Autor">
                            <GithubCard />
                            <p class="contact">Escríbele a <a href="mailto:netfeez.dev@gmail.com">netfeez.dev@gmail.com</a>.</p>
                        </Card>
                        <Card title="Licencia">
                            <p>
                                Distribuido bajo <strong>Apache-2.0</strong>: úsalo, modifícalo y
                                extiéndelo manteniendo el aviso de autoría.
                            </p>
                        </Card>
                    </div>
                </section>
            </div>
        );

        this.root.observer.on('remove', () => this.vItems.destroy());
    }

    /**
     * Paints the guide delivered by the route loader.
     * @param data - The downloaded markdown, or null when it could not be fetched.
     */
    public render(data?: unknown): void {
        this.vItems.set(typeof data === 'string' ? [
            <Markdown content={data} />
        ] : [this.vErrorRow('No se pudo cargar el documento.')]);
    }

    /**
     * Builds the failure row.
     * @param message - The failure message.
     * @returns The error row element.
     */
    private vErrorRow(message: string): Element<Element.Type['div']> {
        return (
            <div class="error">
                <p>{message}</p>
            </div>
        );
    }
}

export namespace DocsPage {
    export type EventMap = {
        [key: string]: never;
    };
}

export default DocsPage;