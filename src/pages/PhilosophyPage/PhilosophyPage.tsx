/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Philosophy page — vizui's principles and what the project seeks, downloaded by the route loader and painted by the view.
 * @license Apache-2.0
 */

import { Store, View, type Element } from 'vizui';

import Markdown from '../../components/Markdown/Markdown.js';
import PageHeader from '../../components/PageHeader/PageHeader.js';
import Toc from '../../components/Toc/Toc.js';

export class PhilosophyPage extends View<'div', PhilosophyPage.EventMap> {
    static { this.css.load('PhilosophyPage.css', import.meta); }

    public readonly root: Element<Element.Type['div']>;
    private readonly vItems = Store.create<Element.ElementType[]>([]);

    public constructor() { super();
        const eContent: Element<Element.Type['div']> = <div class="content">{this.vItems}</div>;
        this.root = (
            <div class="PhilosophyPage">
                <PageHeader title="Filosofía" description="Lo que vizui es, lo que no es, y lo que buscamos construir." />
                <div class="body">
                    <aside class="PhilosophyPage-toc">{new Toc(eContent)}</aside>
                    {eContent}
                </div>
            </div>
        );

        this.root.observer.on('remove', () => this.vItems.destroy());
    }

    /**
     * Paints the manifesto delivered by the route loader.
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

export namespace PhilosophyPage {
    export type EventMap = {
        [key: string]: never;
    };
}

export default PhilosophyPage;