/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Markdown abstract syntax tree model as a hierarchical class hierarchy.
 * @license Apache-2.0
 */
export declare const Symbols: {
    readonly node: symbol;
    readonly document: symbol;
    readonly heading: symbol;
    readonly paragraph: symbol;
    readonly text: symbol;
    readonly strong: symbol;
    readonly emphasis: symbol;
    readonly code: symbol;
    readonly link: symbol;
    readonly image: symbol;
    readonly list: symbol;
    readonly listItem: symbol;
    readonly blockquote: symbol;
    readonly codeBlock: symbol;
    readonly thematicBreak: symbol;
    readonly table: symbol;
    readonly tableRow: symbol;
    readonly tableCell: symbol;
};
export declare abstract class Node {
    static readonly symbol: symbol;
    readonly symbol: symbol;
    children: AST.Node[];
    dirty: boolean;
    raw: string[];
    constructor(children?: AST.Node[], dirty?: boolean, raw?: string[]);
    /** Reads the node at a dot-separated child path (numeric indices into each children list). */
    get(path: string): AST.Node | null;
    /**
     * Sets the node at a dot-separated child path, padding gaps with empty paragraphs.
     * A node argument replaces the target structurally; a JSON-AST value builds a fresh node from it.
     */
    set(path: string, value: AST.JsonNode | AST.Node): void;
    /** Deletes the node at a dot-separated child path, returning whether anything was removed. */
    delete(path: string): boolean;
}
export declare class DocumentNode extends Node {
    static readonly symbol: symbol;
    readonly symbol: symbol;
    constructor(children?: AST.Node[]);
}
export declare class HeadingNode extends Node {
    static readonly symbol: symbol;
    readonly symbol: symbol;
    level: Node.HeadingLevel;
    constructor(level: Node.HeadingLevel, children?: AST.Node[]);
}
export declare class ParagraphNode extends Node {
    static readonly symbol: symbol;
    readonly symbol: symbol;
    constructor(children?: AST.Node[]);
}
export declare class TextNode extends Node {
    static readonly symbol: symbol;
    readonly symbol: symbol;
    value: string;
    constructor(value: string);
}
export declare class StrongNode extends Node {
    static readonly symbol: symbol;
    readonly symbol: symbol;
    constructor(children?: AST.Node[]);
}
export declare class EmphasisNode extends Node {
    static readonly symbol: symbol;
    readonly symbol: symbol;
    constructor(children?: AST.Node[]);
}
export declare class CodeNode extends Node {
    static readonly symbol: symbol;
    readonly symbol: symbol;
    value: string;
    constructor(value: string);
}
export declare class LinkNode extends Node {
    static readonly symbol: symbol;
    readonly symbol: symbol;
    href: string;
    title?: string;
    constructor(href: string, children?: AST.Node[], title?: string);
}
export declare class ImageNode extends Node {
    static readonly symbol: symbol;
    readonly symbol: symbol;
    src: string;
    alt?: string;
    title?: string;
    constructor(src: string, alt?: string, title?: string);
}
export declare class ListNode extends Node {
    static readonly symbol: symbol;
    readonly symbol: symbol;
    ordered: boolean;
    start?: number;
    constructor(ordered: boolean, children?: AST.Node[], start?: number);
}
export declare class ListItemNode extends Node {
    static readonly symbol: symbol;
    readonly symbol: symbol;
    checked?: boolean;
    constructor(children?: AST.Node[], checked?: boolean);
}
export declare class BlockquoteNode extends Node {
    static readonly symbol: symbol;
    readonly symbol: symbol;
    constructor(children?: AST.Node[]);
}
export declare class CodeBlockNode extends Node {
    static readonly symbol: symbol;
    readonly symbol: symbol;
    value: string;
    language?: string;
    constructor(value: string, language?: string);
}
export declare class ThematicBreakNode extends Node {
    static readonly symbol: symbol;
    readonly symbol: symbol;
    constructor();
}
export declare class TableNode extends Node {
    static readonly symbol: symbol;
    readonly symbol: symbol;
    head: TableRowNode;
    body: TableRowNode[];
    constructor(head: TableRowNode, body?: TableRowNode[]);
}
export declare class TableRowNode extends Node {
    static readonly symbol: symbol;
    readonly symbol: symbol;
    constructor(children?: TableCellNode[]);
}
export declare class TableCellNode extends Node {
    static readonly symbol: symbol;
    readonly symbol: symbol;
    header?: boolean;
    align?: Node.Alignment;
    constructor(children?: AST.Node[], header?: boolean, align?: Node.Alignment);
}
export declare namespace Node {
    type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
    type Alignment = 'left' | 'center' | 'right';
}
export declare class AST {
    static fromValue(json: AST.JsonNode): AST.Node;
}
export declare namespace AST {
    type Node = DocumentNode | HeadingNode | ParagraphNode | TextNode | StrongNode | EmphasisNode | CodeNode | LinkNode | ImageNode | ListNode | ListItemNode | BlockquoteNode | CodeBlockNode | ThematicBreakNode | TableNode | TableRowNode | TableCellNode;
    interface JsonNode {
        type: string;
        children?: JsonNode[];
        [key: string]: unknown;
    }
}
export default AST;
