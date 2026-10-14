/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Table of contents — builds navigation chips either from the sections it receives or by scanning the headings of a scope
 *              (a selector string or an Element). Clicking scrolls to the section; the one crossing the viewport stays highlighted.
 *              When given a scope it reacts to content changes, so chips never drift from the document.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
export class Toc extends Component {
    static { this.css.load('Toc.css', import.meta); }
    root;
    vLinks = new Map();
    vOnScroll = () => this.vTrack();
    vScope;
    vSelector;
    vRawScope = null;
    vObserver = null;
    vRaf = 0;
    /**
     * @param source - Explicit sections, or a scope to scan for headings: a selector string or an Element.
     * @param selector - The heading selector used when `source` is a scope.
     */
    constructor(source, selector = 'h2') {
        super();
        this.vScope = source;
        this.vSelector = selector;
        this.root = Element.new('nav').setClass('Toc');
        if (Array.isArray(source)) {
            for (const section of source) {
                const link = this.vCreateLink(section.id, section.label);
                this.vLinks.set(section.id, link);
                this.root.append(link);
            }
        }
        else {
            this.vScan();
            const scope = this.vResolveScope();
            if (scope && typeof MutationObserver !== 'undefined') {
                const observer = new MutationObserver(() => this.vScheduleScan());
                observer.observe(scope, { childList: true, subtree: true });
                this.vObserver = observer;
            }
        }
        window.addEventListener('scroll', this.vOnScroll, { passive: true });
        this.root.observer.on('remove', () => {
            window.removeEventListener('scroll', this.vOnScroll);
            this.vObserver?.disconnect();
            if (this.vRaf)
                cancelAnimationFrame(this.vRaf);
        });
        this.vTrack();
    }
    /**
     * Resolves the scope source to its raw DOM node.
     * @returns The raw node to scan, or null when it cannot be found yet.
     */
    vResolveScope() {
        if (this.vRawScope)
            return this.vRawScope;
        const source = this.vScope;
        if (Array.isArray(source))
            return null;
        if (typeof source === 'string')
            return (this.vRawScope = document.querySelector(source));
        if (source instanceof Element)
            return (this.vRawScope = source.root);
        return (this.vRawScope = source);
    }
    /**
     * Synchronizes the chips with the headings currently present in the scope.
     */
    vScan() {
        const scope = this.vResolveScope();
        if (!scope)
            return;
        const seen = new Set();
        for (const heading of Array.from(scope.querySelectorAll(this.vSelector))) {
            if (!heading.id || seen.has(heading.id))
                continue;
            seen.add(heading.id);
            const label = (heading.textContent ?? heading.id).trim();
            const existing = this.vLinks.get(heading.id);
            if (existing) {
                existing.setText(label);
                continue;
            }
            const link = this.vCreateLink(heading.id, label);
            this.vLinks.set(heading.id, link);
            this.root.append(link);
        }
        for (const [id, link] of this.vLinks) {
            if (!seen.has(id)) {
                link.remove();
                this.vLinks.delete(id);
            }
        }
    }
    /**
     * Schedules a scan for the next frame, coalescing bursts of mutations.
     */
    vScheduleScan() {
        cancelAnimationFrame(this.vRaf);
        this.vRaf = requestAnimationFrame(() => this.vScan());
    }
    /**
     * Builds the chip link for a section.
     * @param id - The section id to jump to.
     * @param label - The text of the chip.
     * @returns The link element.
     */
    vCreateLink(id, label) {
        return Element.new('a')
            .setClass('Toc-link')
            .setAttribute('href', `#${id}`)
            .setText(label)
            .on('click', (event) => this.vGo(id, event));
    }
    /**
     * Scrolls to the section and marks its chip as active.
     * @param id - The section id to jump to.
     * @param event - The click event that triggered the navigation.
     */
    vGo(id, event) {
        event.preventDefault();
        const target = document.getElementById(id);
        if (target && typeof target.scrollIntoView === 'function')
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.vHighlight(id);
    }
    /**
     * Sets the chip of the section currently crossing the top of the viewport.
     */
    vTrack() {
        const threshold = (window.innerHeight ?? 0) * 0.35;
        let current = null;
        for (const id of this.vLinks.keys()) {
            const target = document.getElementById(id);
            if (!target || typeof target.getBoundingClientRect !== 'function')
                continue;
            if (target.getBoundingClientRect().top <= threshold)
                current = id;
        }
        if (current)
            this.vHighlight(current);
    }
    /**
     * Marks one chip as active and clears the rest.
     * @param id - The id of the active section.
     */
    vHighlight(id) {
        for (const [key, link] of this.vLinks)
            link.toggleClass('active', key === id);
    }
}
export default Toc;
//# sourceMappingURL=Toc.js.map