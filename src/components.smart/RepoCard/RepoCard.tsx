/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Project card — fetches the vizui repository metadata and renders it reactively.
 * @license Apache-2.0
 */

import { Component, Store, type Element } from 'vizui';

import { github, type GithubClient } from '../../api/GithubClient.js';

export class RepoCard extends Component<'div', RepoCard.EventMap> {
    static { this.css.load('RepoCard.css', import.meta); }

    private static readonly OWNER = 'NetFeez';
    private static readonly REPO = 'vizui';

    public readonly root: Element<Element.Type['div']>;
    private readonly vItems = Store.create<Element[]>([]);
    private vAlive = true;

    public constructor() { super();
        this.root = <div class="RepoCard">{this.vItems}</div>;
        this.vItems.set([this.vMessageRow('Cargando el repositorio…', false)]);
        void this.vLoad();

        this.root.observer.on('remove', () => this.vDispose());
    }

    /**
     * Loads the repository metadata and renders it, or a failure row when the request rejects.
     */
    private async vLoad(): Promise<void> {
        try {
            const repo = await github.repository(RepoCard.OWNER, RepoCard.REPO);
            if (!this.vAlive) return;
            this.vItems.set([this.vMeta(repo)]);
        }
        catch (error) {
            if (!this.vAlive) return;
            const message = this.vIsPrivate(error)
                ? 'El repositorio no es público desde GitHub.'
                : this.vMessage(error);
            this.vItems.set([this.vMessageRow(message, true)]);
        }
    }

    /**
     * Detects a 404-style failure, the usual sign of a non-public repository.
     * @param error - The thrown value.
     * @returns Whether the repository was not found.
     */
    private vIsPrivate(error: unknown): boolean {
        return typeof error === 'object' && error !== null
            && 'kind' in error && (error as { status?: unknown }).status === 404;
    }

    /**
     * Builds the metadata layout of the repository.
     * @param repo - The fetched metadata.
     * @returns The card body.
     */
    private vMeta(repo: GithubClient.Repository): Element<Element.Type['div']> {
        return (
            <div class="body">
                <div class="ident">
                    <strong>{repo.name}</strong>
                    <span class="full">github.com/{repo.full_name}</span>
                </div>
                <p class="description">{repo.description ?? 'Sin descripción.'}</p>
                <div class="foot">
                    <div class="meta">
                        <span class="lang"><span class="dot"></span>{repo.language ?? '—'}</span>
                        <span>• {repo.stargazers_count} estrellas</span>
                        <span>• {repo.forks_count} forks</span>
                        <span>• {repo.open_issues_count} issues</span>
                    </div>
                    <span class="license">{repo.license?.spdx_id ?? 'Sin licencia'}</span>
                </div>
            </div>
        );
    }

    /**
     * Formats an unknown failure into a readable message.
     * @param error - The thrown value.
     * @returns The message to show.
     */
    private vMessage(error: unknown): string {
        return error instanceof Error ? error.message : 'No se pudo cargar el repositorio.';
    }

    /**
     * Builds a status message row.
     * @param message - The text of the row.
     * @param error - Whether the row advertises a failure.
     * @returns The message element.
     */
    private vMessageRow(message: string, error: boolean): Element<Element.Type['p']> {
        return <p class={error ? 'message is-error' : 'message'}>{message}</p>;
    }

    /** Marks the card dead and destroys the reactive rows. **/
    private vDispose(): void {
        this.vAlive = false;
        this.vItems.destroy();
    }
}

export namespace RepoCard {
    export type EventMap = {
        [key: string]: never;
    };
}

export default RepoCard;