/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Markdown parser — builds an abstract syntax tree directly from raw markdown text.
 * @license Apache-2.0
 */
import { AST } from './AST.js';
import { DocumentNode } from './AST.js';
export declare class Parser {
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
    parse(content: string): DocumentNode;
    /**
     * Walk the content lines and produce the array of block-level AST nodes.
     * Skips blank lines and delegates each position to `parseBlock`.
     * Every block captures the raw source lines it spans — including the blank
     * lines that precede it — so the serializer can re-emit untouched blocks verbatim.
     *
     * @param lines - The full array of content lines.
     * @returns An array of block-level nodes.
     */
    private parseBlocks;
    /**
     * Dispatch the line at the given index to the appropriate block parser.
     * Performs a single pattern match per branch and forwards the match,
     * avoiding double executions of the same regular expression.
     *
     * @param lines - The full array of content lines.
     * @param index - The index of the line to parse.
     * @returns The parsed node and the next unconsumed index.
     */
    private parseBlock;
    /**
     * Parse a fenced code block starting at the given index.
     * Consumes lines until a matching closing fence is found.
     *
     * @param lines - The full array of content lines.
     * @param index - The index of the opening fence line.
     * @param match - The opening fence match provided by the dispatcher.
     * @returns The code-block node and the index past the closing fence.
     */
    private parseCodeBlock;
    /**
     * Parse a heading line into a `HeadingNode`.
     * The heading level comes straight from the number of `#` characters,
     * and the value is parsed for inline content.
     *
     * @param match - The heading match provided by the dispatcher.
     * @param index - The current line index.
     * @returns The heading node and the next index.
     */
    private parseHeading;
    /**
     * Parse a blockquote block, collecting consecutive `>`-prefixed lines.
     * The stripped content is wrapped in a single paragraph node.
     *
     * @param lines - The full array of content lines.
     * @param index - The index of the first blockquote line.
     * @returns The blockquote node and the index past all consumed lines.
     */
    private parseBlockquote;
    /**
     * Parse a list block (ordered or unordered), consuming all consecutive items.
     * Task item prefixes (`[ ]`/`[x]`) are detected per item and exposed as
     * the `checked` field of each list-item node.
     *
     * @param lines - The full array of content lines.
     * @param index - The index of the first list item line.
     * @returns The list node and the index past all consumed lines.
     */
    private parseList;
    /**
     * Parse a single list item value into a `ListItemNode`.
     * Task items (`[ ]`/`[x]`) expose their checked state directly and keep
     * their inline content as children; regular items wrap it in a paragraph.
     *
     * @param value - The raw list item value.
     * @returns A `ListItemNode` with parsed children.
     */
    private parseListItem;
    /**
     * Parse a table block, consuming header, separator, and body rows.
     * The separator row determines the column alignments, shared by the
     * header row and every body row.
     *
     * @param lines - The full array of content lines.
     * @param index - The index of the header line.
     * @returns The table node and the index past all consumed rows.
     */
    private parseTable;
    /**
     * Parse a table row into a `TableRowNode`, applying the column
     * alignments to each cell and parsing cell values as inline content.
     *
     * @param row - The raw table row string (e.g. `| a | b | c |`).
     * @param alignments - The alignment for each column.
     * @returns A `TableRowNode` with parsed cells.
     */
    private parseTableRow;
    /**
     * Split a table row string into individual cell values.
     * Strips leading/trailing `|` delimiters before splitting.
     *
     * @param value - The raw table row string (e.g. `| a | b | c |`).
     * @returns An array of trimmed cell values.
     */
    private parseTableCells;
    /**
     * Parse a table separator row to determine column alignments.
     * Recognizes `:---` (left), `:---:` (center), and `---:` (right).
     *
     * @param separator - The raw separator row string.
     * @returns An array of alignment values (or `undefined` for default).
     */
    private parseTableAlignments;
    /**
     * Parse a paragraph block, consuming consecutive non-blank, non-block-start lines.
     * A single line that is exactly a link or image construct is elevated to a
     * standalone block node instead of being wrapped in a paragraph.
     *
     * @param lines - The full array of content lines.
     * @param index - The index of the first paragraph line.
     * @returns The paragraph (or media) node and the index past all consumed lines.
     */
    private parseParagraph;
    /**
     * Build a standalone link or image node from a full-line match.
     * A leading `!` marks an image; otherwise the line is a plain link.
     * The label is parsed for inline content, allowing nested markup.
     *
     * @param match - The media line match provided by `parseParagraph`.
     * @returns A `LinkNode` or `ImageNode` representing the whole line.
     */
    private createMedia;
    /**
     * Map inline markdown content into an array of inline AST nodes.
     * Supports bold (`**`/`__`), italic (`*`/`_`), inline code, links,
     * and images. Text between matches is emitted as `TextNode`s.
     *
     * @param content - The inline markdown string to map.
     * @returns An array of inline nodes (text, strong, emphasis, code, link, image).
     */
    private parseInline;
    /**
     * Convert a single inline pattern match into its corresponding AST node.
     * Group order mirrors `INLINE_PATTERN`: strong (`**`/`__`),
     * emphasis (`*`/`_`), code, and link/image (optional `!`, label + href).
     *
     * @param match - The match object produced by `INLINE_PATTERN`.
     * @returns The inline node represented by the match.
     */
    private parseInlineMatch;
    /**
     * Create a text node from a raw string value.
     *
     * @param value - The raw text value.
     * @returns A `TextNode` wrapping the value.
     */
    private createText;
    /**
     * Check whether a line marks the start of a new block-level element.
     *
     * @param line - The line to test.
     * @returns `true` if the line starts a heading, blockquote, list, or code fence.
     */
    private isBlockStart;
    /**
     * Check whether a line is a thematic break (star, dash, or underscore variant).
     *
     * @param line - The line to test.
     * @returns `true` if the line matches any thematic break pattern.
     */
    private isThematicBreak;
    /**
     * Check whether a line starts a list (ordered or unordered).
     *
     * @param line - The line to test.
     * @returns `true` if the line matches a list item pattern.
     */
    private isListStart;
    /**
     * Determine whether the current position begins a markdown table.
     *
     * @param lines - The full array of content lines.
     * @param index - The current line index to check.
     * @returns `true` if lines at `index` and `index + 1` form a valid table header.
     */
    private isTableStart;
}
export declare namespace Parser {
    type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
    type Alignment = 'left' | 'center' | 'right';
    interface ParseResult {
        node: AST.Node;
        newIndex: number;
    }
}
export default Parser;
