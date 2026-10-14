/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Author card — fetches the NetFeez GitHub profile and renders it reactively.
 * @license Apache-2.0
 */

import { Component, Store, type Element } from 'vizui';

import { github, type GithubClient } from '../../api/GithubClient.js';

export class GithubCard extends Component<'div', GithubCard.EventMap> {
    static { this.css.load('GithubCard.css', import.meta); }

    private static readonly USERNAME = 'NetFeez';

    public readonly root: Element<Element.Type['div']>;
    private readonly vItems = Store.create<Element[]>([]);
    private vAlive = true;

    public constructor() { super();
        this.root = <div class="GithubCard">{this.vItems}</div>;
        this.vItems.set([this.vStateRow('Cargando perfil de GitHub…')]);
        void this.vLoad();

        this.root.observer.on('remove', () => this.vDispose());
    }

    /**
     * Loads the profile and renders it, or a failure row when the request rejects.
     */
    private async vLoad(): Promise<void> {
        try {
            const user = await github.user(GithubCard.USERNAME);
            if (!this.vAlive) return;
            this.vItems.set(this.vProfile(user));
        }
        catch (error) {
            if (!this.vAlive) return;
            this.vItems.set([this.vStateRow(this.vMessage(error))]);
        }
    }

    /**
     * Builds the profile rows.
     * @param user - The fetched profile.
     * @returns The reactive rows of the card.
     */
    private vProfile(user: GithubClient.User): Element[] {
        return [
            <div class="row">
                <img class="avatar" src={user.avatar_url} alt={`Avatar de ${user.login}`} />
                <div class="meta">
                    <strong class="name">{user.name ?? user.login}</strong>
                    <span class="login">@{user.login}</span>
                    <p class="bio">{user.bio ?? 'Sin biografía.'}</p>
                </div>
            </div>,
            <div class="stats">
                <span><strong>{user.followers}</strong> seguidores</span>
                <span><strong>{user.following}</strong> siguiendo</span>
                <span><strong>{user.public_repos}</strong> repos públicos</span>
                <a href={user.html_url} rel="noopener">github.com/{user.login}</a>
            </div>,
        ];
    }

    /**
     * Formats an unknown failure into a readable message.
     * @param error - The thrown value.
     * @returns The message to show.
     */
    private vMessage(error: unknown): string {
        return error instanceof Error ? error.message : 'No se pudo cargar el perfil.';
    }

    /**
     * Builds a status row (loading or error).
     * @param message - The text of the row.
     * @returns The row element.
     */
    private vStateRow(message: string): Element<Element.Type['p']> {
        return <p class="state">{message}</p>;
    }

    /** Marks the card dead and destroys the reactive rows. **/
    private vDispose(): void {
        this.vAlive = false;
        this.vItems.destroy();
    }
}

export namespace GithubCard {
    export type EventMap = {
        [key: string]: never;
    };
}

export default GithubCard;