/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Shared GitHub repository metadata service — one request, shared by every consumer (navbar stars, repo card).
 * @license Apache-2.0
 */
import { type GithubClient } from '../api/GithubClient.js';
export declare class RepoService {
    private static readonly OWNER;
    private static readonly REPO;
    private static vRequest;
    /**
     * Resolves the vizui repository metadata, caching the in-flight request so
     * every consumer shares a single network call.
     * @returns The repository metadata promise; rejects like the underlying client.
     */
    static get repository(): Promise<GithubClient.Repository>;
}
export default RepoService;
