/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Shared GitHub repository metadata service — one request, shared by every consumer (navbar stars, repo card).
 * @license Apache-2.0
 */
import { github } from '../api/GithubClient.js';
export class RepoService {
    static OWNER = 'NetFeez';
    static REPO = 'vizui';
    static vRequest = null;
    /**
     * Resolves the vizui repository metadata, caching the in-flight request so
     * every consumer shares a single network call.
     * @returns The repository metadata promise; rejects like the underlying client.
     */
    static get repository() {
        RepoService.vRequest ??= github.repository(RepoService.OWNER, RepoService.REPO);
        return RepoService.vRequest;
    }
}
export default RepoService;
//# sourceMappingURL=repo.js.map