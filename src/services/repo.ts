/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Shared GitHub repository metadata service — one request, shared by every consumer (navbar stars, repo card).
 * @license Apache-2.0
 */

import { github, type GithubClient } from '../api/GithubClient.js';

export class RepoService {
    private static readonly OWNER = 'NetFeez';
    private static readonly REPO = 'vizui';

    private static vRequest: Promise<GithubClient.Repository> | null = null;

    /**
     * Resolves the vizui repository metadata, caching the in-flight request so
     * every consumer shares a single network call.
     * @returns The repository metadata promise; rejects like the underlying client.
     */
    public static get repository(): Promise<GithubClient.Repository> {
        RepoService.vRequest ??= github.repository(RepoService.OWNER, RepoService.REPO);
        return RepoService.vRequest;
    }
}

export default RepoService;
