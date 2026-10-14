import { jsx as _jsx, jsxs as _jsxs } from "vizui/jsx-runtime";
/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Author card — fetches the NetFeez GitHub profile and renders it reactively.
 * @license Apache-2.0
 */
import { Component, Store } from 'vizui';
import { github } from '../../api/GithubClient.js';
export class GithubCard extends Component {
    static { this.css.load('GithubCard.css', import.meta); }
    static USERNAME = 'NetFeez';
    root;
    vItems = Store.create([]);
    vAlive = true;
    constructor() {
        super();
        this.root = _jsx("div", { class: "GithubCard", children: this.vItems });
        this.vItems.set([this.vStateRow('Cargando perfil de GitHub…')]);
        void this.vLoad();
        this.root.observer.on('remove', () => this.vDispose());
    }
    /**
     * Loads the profile and renders it, or a failure row when the request rejects.
     */
    async vLoad() {
        try {
            const user = await github.user(GithubCard.USERNAME);
            if (!this.vAlive)
                return;
            this.vItems.set(this.vProfile(user));
        }
        catch (error) {
            if (!this.vAlive)
                return;
            this.vItems.set([this.vStateRow(this.vMessage(error))]);
        }
    }
    /**
     * Builds the profile rows.
     * @param user - The fetched profile.
     * @returns The reactive rows of the card.
     */
    vProfile(user) {
        return [
            _jsxs("div", { class: "row", children: [_jsx("img", { class: "avatar", src: user.avatar_url, alt: `Avatar de ${user.login}` }), _jsxs("div", { class: "meta", children: [_jsx("strong", { class: "name", children: user.name ?? user.login }), _jsxs("span", { class: "login", children: ["@", user.login] }), _jsx("p", { class: "bio", children: user.bio ?? 'Sin biografía.' })] })] }),
            _jsxs("div", { class: "stats", children: [_jsxs("span", { children: [_jsx("strong", { children: user.followers }), " seguidores"] }), _jsxs("span", { children: [_jsx("strong", { children: user.following }), " siguiendo"] }), _jsxs("span", { children: [_jsx("strong", { children: user.public_repos }), " repos p\u00FAblicos"] }), _jsxs("a", { href: user.html_url, rel: "noopener", children: ["github.com/", user.login] })] }),
        ];
    }
    /**
     * Formats an unknown failure into a readable message.
     * @param error - The thrown value.
     * @returns The message to show.
     */
    vMessage(error) {
        return error instanceof Error ? error.message : 'No se pudo cargar el perfil.';
    }
    /**
     * Builds a status row (loading or error).
     * @param message - The text of the row.
     * @returns The row element.
     */
    vStateRow(message) {
        return _jsx("p", { class: "state", children: message });
    }
    /** Marks the card dead and destroys the reactive rows. **/
    vDispose() {
        this.vAlive = false;
        this.vItems.destroy();
    }
}
export default GithubCard;
//# sourceMappingURL=GithubCard.js.map