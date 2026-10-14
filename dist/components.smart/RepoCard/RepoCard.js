import { jsx as _jsx, jsxs as _jsxs } from "vizui/jsx-runtime";
/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Project card — fetches the vizui repository metadata and renders it reactively.
 * @license Apache-2.0
 */
import { Component, Store } from 'vizui';
import { github } from '../../api/GithubClient.js';
export class RepoCard extends Component {
    static { this.css.load('RepoCard.css', import.meta); }
    static OWNER = 'NetFeez';
    static REPO = 'vizui';
    root;
    vItems = Store.create([]);
    vAlive = true;
    constructor() {
        super();
        this.root = _jsx("div", { class: "RepoCard", children: this.vItems });
        this.vItems.set([this.vMessageRow('Cargando el repositorio…', false)]);
        void this.vLoad();
        this.root.observer.on('remove', () => this.vDispose());
    }
    /**
     * Loads the repository metadata and renders it, or a failure row when the request rejects.
     */
    async vLoad() {
        try {
            const repo = await github.repository(RepoCard.OWNER, RepoCard.REPO);
            if (!this.vAlive)
                return;
            this.vItems.set([this.vMeta(repo)]);
        }
        catch (error) {
            if (!this.vAlive)
                return;
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
    vIsPrivate(error) {
        return typeof error === 'object' && error !== null
            && 'kind' in error && error.status === 404;
    }
    /**
     * Builds the metadata layout of the repository.
     * @param repo - The fetched metadata.
     * @returns The card body.
     */
    vMeta(repo) {
        return (_jsxs("div", { class: "body", children: [_jsxs("div", { class: "ident", children: [_jsx("strong", { children: repo.name }), _jsxs("span", { class: "full", children: ["github.com/", repo.full_name] })] }), _jsx("p", { class: "description", children: repo.description ?? 'Sin descripción.' }), _jsxs("div", { class: "foot", children: [_jsxs("div", { class: "meta", children: [_jsxs("span", { class: "lang", children: [_jsx("span", { class: "dot" }), repo.language ?? '—'] }), _jsxs("span", { children: ["\u2022 ", repo.stargazers_count, " estrellas"] }), _jsxs("span", { children: ["\u2022 ", repo.forks_count, " forks"] }), _jsxs("span", { children: ["\u2022 ", repo.open_issues_count, " issues"] })] }), _jsx("span", { class: "license", children: repo.license?.spdx_id ?? 'Sin licencia' })] })] }));
    }
    /**
     * Formats an unknown failure into a readable message.
     * @param error - The thrown value.
     * @returns The message to show.
     */
    vMessage(error) {
        return error instanceof Error ? error.message : 'No se pudo cargar el repositorio.';
    }
    /**
     * Builds a status message row.
     * @param message - The text of the row.
     * @param error - Whether the row advertises a failure.
     * @returns The message element.
     */
    vMessageRow(message, error) {
        return _jsx("p", { class: error ? 'message is-error' : 'message', children: message });
    }
    /** Marks the card dead and destroys the reactive rows. **/
    vDispose() {
        this.vAlive = false;
        this.vItems.destroy();
    }
}
export default RepoCard;
//# sourceMappingURL=RepoCard.js.map