/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Minimal GitHub API client built on the vizui HttpClient.
 * @license Apache-2.0
 */
/**
 * Reads public GitHub data for a login or a repository.
 * Thin by design: only what the presentation page shows.
 */
export declare class GithubClient {
    private readonly vHttp;
    /**
     * @param base - The API base url, defaults to the public GitHub api.
     */
    constructor(base?: string);
    /**
     * Fetches the public profile of a user.
     * @param login - The GitHub login to look up.
     * @returns The public profile fields.
     * @remarks Rejects with a `NetworkError` for non-OK responses or network failures.
     */
    user(login: string): Promise<GithubClient.User>;
    /**
     * Fetches the public metadata of a repository.
     * @param owner - The owner of the repository.
     * @param repo - The repository name.
     * @returns The repository metadata.
     * @remarks Rejects with a `NetworkError` (HTTP 404 when private or missing) for non-OK responses.
     */
    repository(owner: string, repo: string): Promise<GithubClient.Repository>;
}
export declare namespace GithubClient {
    /** The public profile fields the page renders. **/
    interface User {
        login: string;
        name: string | null;
        avatar_url: string;
        html_url: string;
        bio: string | null;
        location: string | null;
        followers: number;
        following: number;
        public_repos: number;
    }
    /** The repository metadata the page renders. **/
    interface Repository {
        name: string;
        full_name: string;
        description: string | null;
        html_url: string;
        homepage: string | null;
        language: string | null;
        default_branch: string;
        stargazers_count: number;
        forks_count: number;
        open_issues_count: number;
        watchers_count: number;
        license: Repository.License | null;
    }
    namespace Repository {
        /** The license of the repository. **/
        interface License {
            key: string;
            name: string;
            spdx_id: string;
        }
    }
}
export declare const github: GithubClient;
export default GithubClient;
