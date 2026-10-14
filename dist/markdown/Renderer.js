/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Markdown renderer — walks an AST and produces vizui Element trees.
 * @license Apache-2.0
 */
import { Element } from 'vizui';
import { DocumentNode, HeadingNode, ParagraphNode, TextNode, StrongNode, EmphasisNode, CodeNode, LinkNode, ImageNode, ListNode, ListItemNode, BlockquoteNode, CodeBlockNode, ThematicBreakNode, TableNode, TableRowNode, } from './AST.js';
export class Renderer {
    /**
     * Render an AST node into a vizui Element.
     * Dispatches to the appropriate rendering method based on the node's type.
     * This is the main entry point for rendering.
     *
     * @example `const element = new Renderer().render(ast);`
     * @param node - The AST node to render.
     * @returns The Element for the given node, or `null` for unknown types.
     */
    render(node) {
        if (node instanceof DocumentNode)
            return this.renderDocument(node);
        if (node instanceof HeadingNode)
            return this.renderHeading(node);
        if (node instanceof ParagraphNode)
            return this.renderParagraph(node);
        if (node instanceof TextNode)
            return this.renderText(node);
        if (node instanceof StrongNode)
            return this.renderStrong(node);
        if (node instanceof EmphasisNode)
            return this.renderEmphasis(node);
        if (node instanceof CodeNode)
            return this.renderCode(node);
        if (node instanceof LinkNode)
            return this.renderLink(node);
        if (node instanceof ImageNode)
            return this.renderImage(node);
        if (node instanceof ListNode)
            return this.renderList(node);
        if (node instanceof ListItemNode)
            return this.renderListItem(node);
        if (node instanceof BlockquoteNode)
            return this.renderBlockquote(node);
        if (node instanceof CodeBlockNode)
            return this.renderCodeBlock(node);
        if (node instanceof ThematicBreakNode)
            return this.renderThematicBreak();
        if (node instanceof TableNode)
            return this.renderTable(node);
        if (node instanceof TableRowNode)
            return this.renderRow(node);
        return this.renderCell(node);
    }
    /**
     * Render a document node as a wrapper `div` containing all its children.
     *
     * @param node - The document node to render.
     * @returns The wrapper `div` element.
     */
    renderDocument(node) {
        return Element.new('div', { childList: this.renderChildren(node.children) });
    }
    /**
     * Render a heading node as its matching `h1`–`h6` element, with an anchor id
     * derived from its text so it can be reached by a table of contents.
     *
     * @param node - The heading node to render.
     * @returns The heading element with rendered children.
     */
    renderHeading(node) {
        const heading = Element.new(`h${node.level}`, { childList: this.renderChildren(node.children) });
        const title = node.children.map(child => this.extractText(child)).join(' ').trim();
        if (title)
            heading.setAttribute('id', Renderer.slugify(title));
        return heading;
    }
    /**
     * Extracts the plain text of a node and its descendants.
     * @param node - The AST node to read.
     * @returns The concatenated text content.
     */
    extractText(node) {
        if (node instanceof TextNode || node instanceof CodeNode)
            return node.value;
        if (node.children.length === 0)
            return '';
        return node.children.map(child => this.extractText(child)).join(' ').trim();
    }
    /**
     * Render a paragraph node as a `p` element.
     *
     * @param node - The paragraph node to render.
     * @returns The `p` element with rendered children.
     */
    renderParagraph(node) {
        return Element.new('p', { childList: this.renderChildren(node.children) });
    }
    /**
     * Render a text node as a `span` holding its raw value.
     *
     * @param node - The text node to render.
     * @returns The `span` element with the text content.
     */
    renderText(node) {
        return Element.new('span', { text: node.value });
    }
    /**
     * Render a strong node as a `strong` element.
     *
     * @param node - The strong node to render.
     * @returns The `strong` element with rendered children.
     */
    renderStrong(node) {
        return Element.new('strong', { childList: this.renderChildren(node.children) });
    }
    /**
     * Render an emphasis node as an `em` element.
     *
     * @param node - The emphasis node to render.
     * @returns The `em` element with rendered children.
     */
    renderEmphasis(node) {
        return Element.new('em', { childList: this.renderChildren(node.children) });
    }
    /**
     * Render an inline code node as a `code` element.
     *
     * @param node - The code node to render.
     * @returns The `code` element with the raw code value.
     */
    renderCode(node) {
        return Element.new('code', { text: node.value });
    }
    /**
     * Render a link node as an anchor element.
     * The optional title is added as an attribute when present.
     *
     * @param node - The link node to render.
     * @returns The `a` element with rendered children.
     */
    renderLink(node) {
        const attribs = { href: Renderer.isSafeHref(node.href) ? node.href : '#' };
        if (node.title)
            attribs.title = node.title;
        return Element.new('a', { attributes: attribs, childList: this.renderChildren(node.children) });
    }
    /**
     * Render an image node as a void `img` element.
     * The optional alt and title are added as attributes when present.
     *
     * @param node - The image node to render.
     * @returns The `img` element with source and alternative text.
     */
    renderImage(node) {
        const attribs = { src: node.src };
        if (node.alt)
            attribs.alt = node.alt;
        if (node.title)
            attribs.title = node.title;
        return Element.new('img', { attributes: attribs });
    }
    /**
     * Render a list node as an ordered or unordered list element.
     *
     * @param node - The list node to render.
     * @returns The `ol`/`ul` element with rendered items.
     */
    renderList(node) {
        return Element.new(node.ordered ? 'ol' : 'ul', { childList: this.renderChildren(node.children) });
    }
    /**
     * Render a list-item node as an `li` element.
     * Task items (checked state present) prepend a disabled checkbox input.
     *
     * @param node - The list-item node to render.
     * @returns The `li` element with rendered children.
     */
    renderListItem(node) {
        if (node.checked === undefined)
            return Element.new('li', { childList: this.renderChildren(node.children) });
        const attribs = { type: 'checkbox', disabled: '' };
        if (node.checked)
            attribs.checked = '';
        return Element.new('li', { childList: [
                Element.new('input', { text: '', attributes: attribs }),
                ...this.renderChildren(node.children)
            ] });
    }
    /**
     * Render a blockquote node as a `blockquote` element.
     *
     * @param node - The blockquote node to render.
     * @returns The `blockquote` element with rendered children.
     */
    renderBlockquote(node) {
        return Element.new('blockquote', { childList: this.renderChildren(node.children) });
    }
    /**
     * Render a code-block node as a `pre` wrapping a `code` element.
     * The optional language is exposed as a `language-*` class.
     *
     * @param node - The code-block node to render.
     * @returns The `pre` element containing the code element.
     */
    renderCodeBlock(node) {
        const attribs = {};
        if (node.language)
            attribs.class = `language-${node.language}`;
        return Element.new('pre', { childList: [
                Element.new('code', { text: node.value, attributes: attribs })
            ] });
    }
    /**
     * Render a thematic-break node as an `hr` element.
     *
     * @returns The `hr` element.
     */
    renderThematicBreak() {
        return Element.new('hr');
    }
    /**
     * Render a table node as a `table` element with a single header row
     * followed by every body row.
     *
     * @param node - The table node to render.
     * @returns The `table` element with all its rows.
     */
    renderTable(node) {
        return Element.new('table', { childList: [
                this.renderRow(node.head),
                ...node.body.map(row => this.renderRow(row))
            ] });
    }
    /**
     * Render a table-row node as a `tr` element.
     * Shared by the header row and every body row of a table.
     *
     * @param node - The table-row node to render.
     * @returns The `tr` element with rendered cells.
     */
    renderRow(node) {
        return Element.new('tr', { childList: this.renderChildren(node.children) });
    }
    /**
     * Render a table-cell node as a header (`th`) or data (`td`) cell.
     * The optional alignment is added as an attribute when present.
     *
     * @param node - The table-cell node to render.
     * @returns The cell element with rendered children.
     */
    renderCell(node) {
        const tag = node.header ? 'th' : 'td';
        const attribs = {};
        if (node.align)
            attribs.align = node.align;
        return Element.new(tag, { attributes: attribs, childList: this.renderChildren(node.children) });
    }
    /**
     * Render an array of child nodes, discarding any node that yields no element.
     *
     * @param nodes - The array of child nodes to render.
     * @returns The array of rendered child elements.
     */
    renderChildren(nodes) {
        return nodes
            .map(node => this.render(node))
            .filter(Renderer.isRendered);
    }
    /**
     * Type guard that filters out `null` results from `render`.
     *
     * @param element - The rendered element candidate.
     * @returns `true` when the element is not `null`.
     */
    static isRendered(element) {
        return element !== null;
    }
    /**
     * Check if a link href is safe to use in an anchor element.
     * Only allows relative paths, absolute paths, and `http`, `https`, or `mailto` schemes.
     */
    static isSafeHref(href) {
        const normalized = href.trim().toLowerCase();
        if (normalized.startsWith('#') || normalized.startsWith('/') || normalized.startsWith('./') || normalized.startsWith('../'))
            return true;
        return /^(https?|mailto):/.test(normalized);
    }
    /**
     * Normalizes heading text into an anchor id: lowercase, unaccented, hyphenated.
     * @param text - The raw heading text.
     * @returns The id usable in `href="#id"`.
     */
    static slugify(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
}
export default Renderer;
//# sourceMappingURL=Renderer.js.map