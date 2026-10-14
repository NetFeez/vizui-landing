/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Markdown parser — builds an abstract syntax tree directly from raw markdown text.
 * @license Apache-2.0
 */

import { AST } from './AST.js';
import {
    DocumentNode, HeadingNode, ParagraphNode, TextNode, StrongNode, EmphasisNode, CodeNode,
    LinkNode, ImageNode, ListNode, ListItemNode, BlockquoteNode, CodeBlockNode, ThematicBreakNode,
    TableNode, TableRowNode, TableCellNode,
} from './AST.js';

const CODE_FENCE_OPEN = /^ {0,3}(`{3,}|~{3,})(.*)$/;
const HEADING = /^ {0,3}(#{1,6})[ \t]+(.+?)\s*#*\s*$/;
const THEMATIC_BREAK_STAR = /^ {0,3}((\*\s*){3,})$/;
const THEMATIC_BREAK_DASH = /^ {0,3}((-\s*){3,})$/;
const THEMATIC_BREAK_UNDERSCORE = /^ {0,3}((_\s*){3,})$/;
const BLOCKQUOTE = /^ {0,3}>/;
const BLOCKQUOTE_STRIP = /^ {0,3}>\s?/;
const LIST_UNORDERED = /^ {0,3}[-+*][ \t]+(.+)$/;
const LIST_ORDERED = /^ {0,3}(\d+)[.)][ \t]+(.+)$/;
const TABLE_SEPARATOR = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/;
const TASK_CHECK = /^(\[[ xX]\])\s+(.+)$/;
const MEDIA_LINE = /^(!?)\[([^\]]+)\]\(([^)]+)\)$/;
const INLINE_PATTERN =
    /(\*\*(.+?)\*\*|__(.+?)__|\*(.+?)\*|_(.+?)_|`(.+?)`|(!?)\[([^\]]+)\]\(([^)]+)\))/g;

export class Parser {
    /**
     * Parse a raw markdown string into a `DocumentNode` AST.
     * This is the main entry point of the parser. It walks the content
     * line by line recognizing block structures, and parses inline content
     * on demand, building tree nodes directly.
     *
     * @example `const ast = new Parser().parse('# Hello\\n\\nWorld');`
     * @param content - The raw markdown text to parse.
     * @returns The root `DocumentNode` containing all parsed block nodes.
     */
    public parse(content: string): DocumentNode {
        const lines = content.replace(/\r\n?/g, '\n').split('\n');
        const blocks = this.parseBlocks(lines);
        const document = new DocumentNode(blocks);

        if (blocks.length === 0) document.raw = lines;

        return document;
    }

    /**
     * Walk the content lines and produce the array of block-level AST nodes.
     * Skips blank lines and delegates each position to `parseBlock`.
     * Every block captures the raw source lines it spans — including the blank
     * lines that precede it — so the serializer can re-emit untouched blocks verbatim.
     *
     * @param lines - The full array of content lines.
     * @returns An array of block-level nodes.
     */
    private parseBlocks(lines: string[]): AST.Node[] {
        const nodes: AST.Node[] = [];
        let blanks: string[] = [];
        let index = 0;

        while (index < lines.length) {
            if (!lines[index].trim()) { blanks.push(lines[index]); index++; continue; }

            const result = this.parseBlock(lines, index);

            result.node.raw = [...blanks, ...lines.slice(index, result.newIndex)];
            nodes.push(result.node);
            blanks = [];
            index = result.newIndex;
        }

        if (blanks.length > 0 && nodes.length > 0) nodes[nodes.length - 1].raw = [...nodes[nodes.length - 1].raw, ...blanks];

        return nodes;
    }

    /**
     * Dispatch the line at the given index to the appropriate block parser.
     * Performs a single pattern match per branch and forwards the match,
     * avoiding double executions of the same regular expression.
     *
     * @param lines - The full array of content lines.
     * @param index - The index of the line to parse.
     * @returns The parsed node and the next unconsumed index.
     */
    private parseBlock(lines: string[], index: number): Parser.ParseResult {
        const line = lines[index];

        const fence = CODE_FENCE_OPEN.exec(line);
        if (fence) return this.parseCodeBlock(lines, index, fence);

        const heading = HEADING.exec(line);
        if (heading) return this.parseHeading(heading, index);

        if (this.isThematicBreak(line)) return { node: new ThematicBreakNode(), newIndex: index + 1 };
        if (BLOCKQUOTE.test(line)) return this.parseBlockquote(lines, index);
        if (this.isListStart(line)) return this.parseList(lines, index);
        if (this.isTableStart(lines, index)) return this.parseTable(lines, index);

        return this.parseParagraph(lines, index);
    }

    /**
     * Parse a fenced code block starting at the given index.
     * Consumes lines until a matching closing fence is found.
     *
     * @param lines - The full array of content lines.
     * @param index - The index of the opening fence line.
     * @param match - The opening fence match provided by the dispatcher.
     * @returns The code-block node and the index past the closing fence.
     */
    private parseCodeBlock(lines: string[], index: number, match: RegExpExecArray): Parser.ParseResult {
        const fence = match[1];
        const info = match[2].trim();
        const closing = new RegExp(`^ {0,3}${fence[0]}{${fence.length},}\\s*$`);
        const code: string[] = [];

        index++;

        while (index < lines.length && !closing.test(lines[index])) { code.push(lines[index]); index++; }

        const node = new CodeBlockNode(code.join('\n'));

        if (info) node.language = info.split(/\s+/)[0];

        return { node, newIndex: index + 1 };
    }

    /**
     * Parse a heading line into a `HeadingNode`.
     * The heading level comes straight from the number of `#` characters,
     * and the value is parsed for inline content.
     *
     * @param match - The heading match provided by the dispatcher.
     * @param index - The current line index.
     * @returns The heading node and the next index.
     */
    private parseHeading(match: RegExpExecArray, index: number): Parser.ParseResult {
        return {
            node: new HeadingNode(match[1].length as Parser.HeadingLevel, this.parseInline(match[2])),
            newIndex: index + 1
        };
    }

    /**
     * Parse a blockquote block, collecting consecutive `>`-prefixed lines.
     * The stripped content is wrapped in a single paragraph node.
     *
     * @param lines - The full array of content lines.
     * @param index - The index of the first blockquote line.
     * @returns The blockquote node and the index past all consumed lines.
     */
    private parseBlockquote(lines: string[], index: number): Parser.ParseResult {
        const block: string[] = [];

        while (index < lines.length && BLOCKQUOTE.test(lines[index])) { block.push(lines[index].replace(BLOCKQUOTE_STRIP, '')); index++; }

        return {
            node: new BlockquoteNode([
                new ParagraphNode(this.parseInline(block.join('\n')))
            ]),
            newIndex: index
        };
    }

    /**
     * Parse a list block (ordered or unordered), consuming all consecutive items.
     * Task item prefixes (`[ ]`/`[x]`) are detected per item and exposed as
     * the `checked` field of each list-item node.
     *
     * @param lines - The full array of content lines.
     * @param index - The index of the first list item line.
     * @returns The list node and the index past all consumed lines.
     */
    private parseList(lines: string[], index: number): Parser.ParseResult {
        const ordered = LIST_ORDERED.test(lines[index]);
        const pattern = ordered ? LIST_ORDERED : LIST_UNORDERED;
        const values: string[] = [];

        while (index < lines.length) {
            const match = pattern.exec(lines[index]);

            if (!match) break;

            values.push(ordered ? match[2] : match[1]);
            index++;
        }

        return {
            node: new ListNode(ordered, values.map(value => this.parseListItem(value))),
            newIndex: index
        };
    }

    /**
     * Parse a single list item value into a `ListItemNode`.
     * Task items (`[ ]`/`[x]`) expose their checked state directly and keep
     * their inline content as children; regular items wrap it in a paragraph.
     *
     * @param value - The raw list item value.
     * @returns A `ListItemNode` with parsed children.
     */
    private parseListItem(value: string): ListItemNode {
        const task = TASK_CHECK.exec(value);

        if (!task) return new ListItemNode([new ParagraphNode(this.parseInline(value))]);

        return new ListItemNode(this.parseInline(task[2]), task[1].toLowerCase() === '[x]');
    }

    /**
     * Parse a table block, consuming header, separator, and body rows.
     * The separator row determines the column alignments, shared by the
     * header row and every body row.
     *
     * @param lines - The full array of content lines.
     * @param index - The index of the header line.
     * @returns The table node and the index past all consumed rows.
     */
    private parseTable(lines: string[], index: number): Parser.ParseResult {
        const alignments = this.parseTableAlignments(lines[index + 1]);
        let cursor = index + 2;
        const rows: string[] = [];

        while (cursor < lines.length && lines[cursor].includes('|') && lines[cursor].trim()) { rows.push(lines[cursor]); cursor++; }

        return {
            node: new TableNode(
                this.parseTableRow(lines[index], alignments),
                rows.map(row => this.parseTableRow(row, alignments))
            ),
            newIndex: cursor
        };
    }

    /**
     * Parse a table row into a `TableRowNode`, applying the column
     * alignments to each cell and parsing cell values as inline content.
     *
     * @param row - The raw table row string (e.g. `| a | b | c |`).
     * @param alignments - The alignment for each column.
     * @returns A `TableRowNode` with parsed cells.
     */
    private parseTableRow(row: string, alignments: Array<Parser.Alignment | undefined>): TableRowNode {
        return new TableRowNode(
            this.parseTableCells(row).map((value, column) =>
                new TableCellNode(this.parseInline(value), undefined, alignments[column]),
            )
        );
    }

    /**
     * Split a table row string into individual cell values.
     * Strips leading/trailing `|` delimiters before splitting.
     *
     * @param value - The raw table row string (e.g. `| a | b | c |`).
     * @returns An array of trimmed cell values.
     */
    private parseTableCells(value: string): string[] {
        let content = value.trim();

        if (content.startsWith('|')) content = content.slice(1);
        if (content.endsWith('|')) content = content.slice(0, -1);

        return content
            .split('|')
            .map(cell => cell.trim());
    }

    /**
     * Parse a table separator row to determine column alignments.
     * Recognizes `:---` (left), `:---:` (center), and `---:` (right).
     *
     * @param separator - The raw separator row string.
     * @returns An array of alignment values (or `undefined` for default).
     */
    private parseTableAlignments(separator: string): Array<Parser.Alignment | undefined> {
        return this.parseTableCells(separator)
            .map(cell => {
                if (cell.startsWith(':') && cell.endsWith(':')) return 'center';
                if (cell.startsWith(':')) return 'left';
                if (cell.endsWith(':')) return 'right';

                return undefined;
            });
    }

    /**
     * Parse a paragraph block, consuming consecutive non-blank, non-block-start lines.
     * A single line that is exactly a link or image construct is elevated to a
     * standalone block node instead of being wrapped in a paragraph.
     *
     * @param lines - The full array of content lines.
     * @param index - The index of the first paragraph line.
     * @returns The paragraph (or media) node and the index past all consumed lines.
     */
    private parseParagraph(lines: string[], index: number): Parser.ParseResult {
        const media = MEDIA_LINE.exec(lines[index]);

        if (media) return { node: this.createMedia(media), newIndex: index + 1 };

        const content: string[] = [lines[index]];
        let cursor = index + 1;

        while (cursor < lines.length && lines[cursor].trim() && !this.isBlockStart(lines[cursor])) { content.push(lines[cursor]); cursor++; }

        return {
            node: new ParagraphNode(this.parseInline(content.join('\n'))),
            newIndex: cursor
        };
    }

    /**
     * Build a standalone link or image node from a full-line match.
     * A leading `!` marks an image; otherwise the line is a plain link.
     * The label is parsed for inline content, allowing nested markup.
     *
     * @param match - The media line match provided by `parseParagraph`.
     * @returns A `LinkNode` or `ImageNode` representing the whole line.
     */
    private createMedia(match: RegExpExecArray): LinkNode | ImageNode {
        const [, image, label, target] = match;

        if (image) return new ImageNode(target, label);

        return new LinkNode(target, this.parseInline(label));
    }

    /**
     * Map inline markdown content into an array of inline AST nodes.
     * Supports bold (`**`/`__`), italic (`*`/`_`), inline code, links,
     * and images. Text between matches is emitted as `TextNode`s.
     *
     * @param content - The inline markdown string to map.
     * @returns An array of inline nodes (text, strong, emphasis, code, link, image).
     */
    private parseInline(content: string): AST.Node[] {
        const nodes: AST.Node[] = [];
        let position = 0;

        for (const match of content.matchAll(INLINE_PATTERN)) {
            const start = match.index ?? 0;

            if (start > position) nodes.push(this.createText(content.slice(position, start)));

            nodes.push(this.parseInlineMatch(match));
            position = start + match[0].length;
        }

        if (position < content.length) nodes.push(this.createText(content.slice(position)));

        return nodes;
    }

    /**
     * Convert a single inline pattern match into its corresponding AST node.
     * Group order mirrors `INLINE_PATTERN`: strong (`**`/`__`),
     * emphasis (`*`/`_`), code, and link/image (optional `!`, label + href).
     *
     * @param match - The match object produced by `INLINE_PATTERN`.
     * @returns The inline node represented by the match.
     */
    private parseInlineMatch(match: RegExpMatchArray): AST.Node {
        const [, , strongStar, strongUnderscore, emphasisStar, emphasisUnderscore, code, image, label, href] = match;

        if (strongStar !== undefined || strongUnderscore !== undefined) return new StrongNode([this.createText(strongStar ?? strongUnderscore)]);
        if (emphasisStar !== undefined || emphasisUnderscore !== undefined) return new EmphasisNode([this.createText(emphasisStar ?? emphasisUnderscore)]);
        if (code !== undefined) return new CodeNode(code);
        if (image) return new ImageNode(href, label);

        return new LinkNode(href, [this.createText(label)]);
    }

    /**
     * Create a text node from a raw string value.
     *
     * @param value - The raw text value.
     * @returns A `TextNode` wrapping the value.
     */
    private createText(value: string): TextNode {
        return new TextNode(value);
    }

    /**
     * Check whether a line marks the start of a new block-level element.
     *
     * @param line - The line to test.
     * @returns `true` if the line starts a heading, blockquote, list, or code fence.
     */
    private isBlockStart(line: string): boolean {
        return (
            HEADING.test(line) ||
            BLOCKQUOTE.test(line) ||
            LIST_UNORDERED.test(line) ||
            LIST_ORDERED.test(line) ||
            CODE_FENCE_OPEN.test(line)
        );
    }

    /**
     * Check whether a line is a thematic break (star, dash, or underscore variant).
     *
     * @param line - The line to test.
     * @returns `true` if the line matches any thematic break pattern.
     */
    private isThematicBreak(line: string): boolean {
        return (
            THEMATIC_BREAK_STAR.test(line) ||
            THEMATIC_BREAK_DASH.test(line) ||
            THEMATIC_BREAK_UNDERSCORE.test(line)
        );
    }

    /**
     * Check whether a line starts a list (ordered or unordered).
     *
     * @param line - The line to test.
     * @returns `true` if the line matches a list item pattern.
     */
    private isListStart(line: string): boolean {
        return LIST_UNORDERED.test(line) || LIST_ORDERED.test(line);
    }

    /**
     * Determine whether the current position begins a markdown table.
     *
     * @param lines - The full array of content lines.
     * @param index - The current line index to check.
     * @returns `true` if lines at `index` and `index + 1` form a valid table header.
     */
    private isTableStart(lines: string[], index: number): boolean {
        if (index + 1 >= lines.length) return false;
        if (!lines[index].includes('|')) return false;

        return TABLE_SEPARATOR.test(lines[index + 1]);
    }
}

export namespace Parser {
    export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

    export type Alignment = 'left' | 'center' | 'right';

    export interface ParseResult {
        node: AST.Node;
        newIndex: number;
    }
}

export default Parser;
