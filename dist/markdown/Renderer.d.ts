/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Markdown renderer — walks an AST and produces vizui Element trees.
 * @license Apache-2.0
 */
import { Element } from 'vizui';
import { AST } from './AST.js';
import { DocumentNode, HeadingNode, ParagraphNode, TextNode, StrongNode, EmphasisNode, CodeNode, LinkNode, ImageNode, ListNode, ListItemNode, BlockquoteNode, CodeBlockNode, TableNode, TableRowNode, TableCellNode } from './AST.js';
export declare class Renderer {
    /**
     * Render an AST node into a vizui Element.
     * Dispatches to the appropriate rendering method based on the node's type.
     * This is the main entry point for rendering.
     *
     * @example `const element = new Renderer().render(ast);`
     * @param node - The AST node to render.
     * @returns The Element for the given node, or `null` for unknown types.
     */
    render(node: AST.Node): Element.ElementType | null;
    /**
     * Render a document node as a wrapper `div` containing all its children.
     *
     * @param node - The document node to render.
     * @returns The wrapper `div` element.
     */
    protected renderDocument(node: DocumentNode): Element<HTMLDivElement>;
    /**
     * Render a heading node as its matching `h1`–`h6` element, with an anchor id
     * derived from its text so it can be reached by a table of contents.
     *
     * @param node - The heading node to render.
     * @returns The heading element with rendered children.
     */
    protected renderHeading(node: HeadingNode): Element.ElementType;
    /**
     * Extracts the plain text of a node and its descendants.
     * @param node - The AST node to read.
     * @returns The concatenated text content.
     */
    protected extractText(node: AST.Node): string;
    /**
     * Render a paragraph node as a `p` element.
     *
     * @param node - The paragraph node to render.
     * @returns The `p` element with rendered children.
     */
    protected renderParagraph(node: ParagraphNode): Element<HTMLParagraphElement>;
    /**
     * Render a text node as a `span` holding its raw value.
     *
     * @param node - The text node to render.
     * @returns The `span` element with the text content.
     */
    protected renderText(node: TextNode): Element<HTMLSpanElement>;
    /**
     * Render a strong node as a `strong` element.
     *
     * @param node - The strong node to render.
     * @returns The `strong` element with rendered children.
     */
    protected renderStrong(node: StrongNode): Element<HTMLElement>;
    /**
     * Render an emphasis node as an `em` element.
     *
     * @param node - The emphasis node to render.
     * @returns The `em` element with rendered children.
     */
    protected renderEmphasis(node: EmphasisNode): Element<HTMLElement>;
    /**
     * Render an inline code node as a `code` element.
     *
     * @param node - The code node to render.
     * @returns The `code` element with the raw code value.
     */
    protected renderCode(node: CodeNode): Element<HTMLElement>;
    /**
     * Render a link node as an anchor element.
     * The optional title is added as an attribute when present.
     *
     * @param node - The link node to render.
     * @returns The `a` element with rendered children.
     */
    protected renderLink(node: LinkNode): Element<HTMLAnchorElement>;
    /**
     * Render an image node as a void `img` element.
     * The optional alt and title are added as attributes when present.
     *
     * @param node - The image node to render.
     * @returns The `img` element with source and alternative text.
     */
    protected renderImage(node: ImageNode): Element<HTMLImageElement>;
    /**
     * Render a list node as an ordered or unordered list element.
     *
     * @param node - The list node to render.
     * @returns The `ol`/`ul` element with rendered items.
     */
    protected renderList(node: ListNode): Element.ElementType;
    /**
     * Render a list-item node as an `li` element.
     * Task items (checked state present) prepend a disabled checkbox input.
     *
     * @param node - The list-item node to render.
     * @returns The `li` element with rendered children.
     */
    protected renderListItem(node: ListItemNode): Element<HTMLLIElement>;
    /**
     * Render a blockquote node as a `blockquote` element.
     *
     * @param node - The blockquote node to render.
     * @returns The `blockquote` element with rendered children.
     */
    protected renderBlockquote(node: BlockquoteNode): Element<HTMLQuoteElement>;
    /**
     * Render a code-block node as a `pre` wrapping a `code` element.
     * The optional language is exposed as a `language-*` class.
     *
     * @param node - The code-block node to render.
     * @returns The `pre` element containing the code element.
     */
    protected renderCodeBlock(node: CodeBlockNode): Element<HTMLPreElement>;
    /**
     * Render a thematic-break node as an `hr` element.
     *
     * @returns The `hr` element.
     */
    protected renderThematicBreak(): Element<HTMLHRElement>;
    /**
     * Render a table node as a `table` element with a single header row
     * followed by every body row.
     *
     * @param node - The table node to render.
     * @returns The `table` element with all its rows.
     */
    protected renderTable(node: TableNode): Element<HTMLTableElement>;
    /**
     * Render a table-row node as a `tr` element.
     * Shared by the header row and every body row of a table.
     *
     * @param node - The table-row node to render.
     * @returns The `tr` element with rendered cells.
     */
    protected renderRow(node: TableRowNode): Element<HTMLTableRowElement>;
    /**
     * Render a table-cell node as a header (`th`) or data (`td`) cell.
     * The optional alignment is added as an attribute when present.
     *
     * @param node - The table-cell node to render.
     * @returns The cell element with rendered children.
     */
    protected renderCell(node: TableCellNode): Element.ElementType;
    /**
     * Render an array of child nodes, discarding any node that yields no element.
     *
     * @param nodes - The array of child nodes to render.
     * @returns The array of rendered child elements.
     */
    protected renderChildren(nodes: AST.Node[]): Element.ElementType[];
    /**
     * Type guard that filters out `null` results from `render`.
     *
     * @param element - The rendered element candidate.
     * @returns `true` when the element is not `null`.
     */
    protected static isRendered(element: Element.ElementType | null): element is Element.ElementType;
    /**
     * Check if a link href is safe to use in an anchor element.
     * Only allows relative paths, absolute paths, and `http`, `https`, or `mailto` schemes.
     */
    protected static isSafeHref(href: string): boolean;
    /**
     * Normalizes heading text into an anchor id: lowercase, unaccented, hyphenated.
     * @param text - The raw heading text.
     * @returns The id usable in `href="#id"`.
     */
    protected static slugify(text: string): string;
}
export declare namespace Renderer { }
export default Renderer;
