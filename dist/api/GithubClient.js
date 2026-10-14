/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Minimal GitHub API client built on the vizui HttpClient.
 * @license Apache-2.0
 */
import { HttpClient } from 'vizui';
/**
 * Reads public GitHub data for a login or a repository.
 * Thin by design: only what the presentation page shows.
 */
export class GithubClient {
    vHttp;
    /**
     * @param base - The API base url, defaults to the public GitHub api.
     */
    constructor(base = 'https://api.github.com') {
        this.vHttp = new HttpClient(base, {
            headers: { Accept: 'application/vnd.github+json' },
            timeout: 8000,
        });
    }
    /**
     * Fetches the public profile of a user.
     * @param login - The GitHub login to look up.
     * @returns The public profile fields.
     * @remarks Rejects with a `NetworkError` for non-OK responses or network failures.
     */
    async user(login) {
        return this.vHttp.getJson(`/users/${encodeURIComponent(login)}`);
    }
    /**
     * Fetches the public metadata of a repository.
     * @param owner - The owner of the repository.
     * @param repo - The repository name.
     * @returns The repository metadata.
     * @remarks Rejects with a `NetworkError` (HTTP 404 when private or missing) for non-OK responses.
     */
    async repository(owner, repo) {
        return this.vHttp.getJson(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
    }
}
export const github = new GithubClient();
export default GithubClient;
//# sourceMappingURL=GithubClient.js.map