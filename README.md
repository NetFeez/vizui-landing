# vizui — landing page

Presentation page for [vizui](https://github.com/NetFeez/vizui), a UI framework for TypeScript.

This is not just marketing: the page is **built with vizui itself**. Everything it advertises — router, typed reactive stores, HTTP client, markdown pipeline, reusable components — it also uses. It is the framework's living demo.

## Pitch

- JSX straight onto the **real DOM**: no virtual DOM, no reconciliation.
- Typed **reactive stores** with derived `select` and `subscribe`.
- `Component`, `Layout` and `View` with an explicit lifecycle (`observer.on('remove', …)`).
- A **router** (hash mode), a fluent **HTTP client** over `fetch`, and the `vizui.components` library.
- **Zero runtime dependencies**, ~2.6kb gzip, no bundler: `tsc` + `importmap`.

> The goal is not to make code look like "good code" by some generic standard, but to be **intrinsically coherent with the project's architecture**. The framework steps aside once your architecture is running. See `docs/filosofia.md`.

## Routes

| Route | View | Content |
| --- | --- | --- |
| `/` | `HeroPage` | Hero, diagram, JSX vs pure-TS counters, reactive bento and manifesto |
| `/features` | `FeaturesPage` | Principles, comparison table and FAQ |
| `/philosophy` | `PhilosophyPage` | Markdown from `docs/filosofia.md` |
| `/architecture` | `ArchitecturePage` | Project tree (`docs/samples/architecture.txt`) |
| `/components` | `ComponentsPage` | Live showcase of `vizui.components` |
| `/sandbox` | `SandBox` | Editor that transpiles JSX to `jsx-runtime` and mounts the result |
| `/docs` | `DocsPage` | Markdown from `docs/vizui.md` + About and license |
| `/mr-test`, `/mr-test/:slug` | `MultiRoute` | Same view on different routes with distinct loaders (not linked) |
| `404` | `NotFound` | Router fallback |

## Architecture

The same layout the framework recommends:

- `src/app.ts` — composition root: `App`, `Router` and services.
- `src/renderer.tsx` — which route mounts which view; loaders download content.
- `src/pages/` — the views.
- `src/components.smart/` — components with state and domain (Navbar, RepoCard, GithubCard, HeroDiagram, SectionDock, AppLayout).
- `src/components/` — stateless JSX functions.
- `src/services/` — global state and connected services (`clock`, `repo`).
- `src/markdown/` — the markdown pipeline *of this page* (not part of vizui).
- `src/api/` — GitHub client.

Each component loads its CSS with `CSS.load(...)`, resolved by [depflow](https://github.com/NetFeez/depflow). The `vizui` and `vizui.components` dependencies are cloned and built into `lib/` during the build.

## Requirements

- Node.js 24+
- A static server to preview (ES modules and the `importmap` do not work over `file://`).

## Development

```bash
npm install          # build dependencies
npm run build        # fetches lib/, extracts CSS and compiles with tsc
npm run dev          # tsc in watch mode
```

To preview, serve the repository root with any static server:

```bash
npx serve .
# or
python -m http.server
```

The build produces `dist/` (ES modules and CSS) and `lib/` (resolved dependencies). `index.html` defines the `importmap` pointing at both folders.

## Deployment

GitHub Actions publishes the landing to the `gh-pages` branch on every push to `main` (`.github/workflows/deploy.yml`):

1. Install and build (`npm run build`).
2. Copy to the root of `gh-pages`: `index.html`, `favicon.ico`, `dist/`, `docs/` and `lib/`.
3. Clone `index.html` as `404.html` for the client-side route fallback.
4. Add `.nojekyll` so GitHub Pages serves the files as-is.

## Documentation

- `docs/vizui.md` — full framework guide, served by the `/docs` route.
- `docs/filosofia.md` — principles and maintenance stance.
- `docs/samples/` — code samples shown across the pages.

## Need help?

You can write to me on:

- Discord: **`@NetFeez`**
- [Email](mailto:netfeez.dev@gmail.com?subject=Vizui%20landing)
- [GitHub](https://github.com/NetFeez)

## License

Apache-2.0. NetFeez <netfeez.dev@gmail.com>.
