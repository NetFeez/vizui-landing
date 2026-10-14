import { jsx as _jsx, jsxs as _jsxs } from "vizui/jsx-runtime";
/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Route registration: shell layout, the presentation pages, the 404 fallback and the error boundary.
 *              Routes that need content declare a loader that downloads it; the resolved data is delivered to `View.render`.
 * @license Apache-2.0
 */
import { Guard, HttpClient } from 'vizui';
import { view } from 'vizui/jsx-runtime';
import { router } from './app.js';
import AppLayout from './components.smart/layout/AppLayout.js';
import HeroPage from './pages/HeroPage/HeroPage.js';
import SandBox from './pages/SandBox/SandBox.js';
import FeaturesPage from './pages/FeaturesPage/FeaturesPage.js';
import PhilosophyPage from './pages/PhilosophyPage/PhilosophyPage.js';
import ArchitecturePage from './pages/ArchitecturePage/ArchitecturePage.js';
import ComponentsPage from './pages/ComponentsPage/ComponentsPage.js';
import DocsPage from './pages/DocsPage/DocsPage.js';
import MultiRoute from './pages/MultiRoute/MultiRoute.js';
/**
 * Downloads a document, resolving to null instead of throwing so the view can paint a failure row.
 * @param url - The relative url of the document.
 * @returns The document contents, or null on failure.
 */
async function loadText(url) {
    try {
        return await new HttpClient().get(url).send().then(response => response.text());
    }
    catch {
        return null;
    }
}
router.layout('/', () => new AppLayout());
router.show('/', () => new HeroPage()).load(async () => {
    const [jsx, imperative, app] = await Promise.all([
        loadText('./docs/samples/jsx.tsx'),
        loadText('./docs/samples/imperative.ts'),
        loadText('./docs/samples/app.tsx'),
    ]);
    return { jsx, imperative, app };
});
router.show('/features', () => new FeaturesPage());
router.show('/philosophy', () => new PhilosophyPage()).load(() => loadText('./docs/filosofia.md'));
router.show('/architecture', () => new ArchitecturePage()).load(() => loadText('./docs/samples/architecture.txt'));
router.show('/components', () => new ComponentsPage()).load(() => loadText('./docs/samples/behind.ts'));
router.show('/sandbox', () => new SandBox());
router.show('/docs', () => new DocsPage()).load(() => loadText('./docs/vizui.md'));
router.show('/mr-test', () => new MultiRoute()).load(() => '// Ruta: /mr-test\n'
    + '// > La misma clase MultiRoute, pero un loader distinto por ruta.\n'
    + '// > Este loader no lee la entrada: la ruta está fija.');
router.show('/mr-test/:slug', () => new MultiRoute()).load(async (entry) => {
    const slug = entry.params.slug ?? '(sin slug)';
    return '// Ruta: /mr-test/:slug\n'
        + '// > El loader recibe la entrada y decide qué producir.\n'
        + `// > slug = "${slug}"`;
});
const NotFound = view({
    root: (_jsxs("section", { class: "NotFound", children: [_jsx("h1", { children: "404 \u2014 No encontrado" }), _jsx("p", { children: "Ninguna regla del enrutador coincide con la ruta actual." }), _jsx("button", { type: "button", "on:click": () => router.navigate('/'), children: "Volver al inicio" })] })),
});
router.notFound(() => NotFound);
router.use(new Guard.Error((error, entry) => {
    console.error('[vizui-page] Router error:', error, 'at entry:', entry);
}));
//# sourceMappingURL=renderer.js.map