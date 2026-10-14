/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Markdown abstract syntax tree model as a hierarchical class hierarchy.
 * @license Apache-2.0
 */

export const Symbols = {
    node: Symbol.for('md.node'),
    document: Symbol.for('md.document'),
    heading: Symbol.for('md.heading'),
    paragraph: Symbol.for('md.paragraph'),
    text: Symbol.for('md.text'),
    strong: Symbol.for('md.strong'),
    emphasis: Symbol.for('md.emphasis'),
    code: Symbol.for('md.code'),
    link: Symbol.for('md.link'),
    image: Symbol.for('md.image'),
    list: Symbol.for('md.list'),
    listItem: Symbol.for('md.list-item'),
    blockquote: Symbol.for('md.blockquote'),
    codeBlock: Symbol.for('md.code-block'),
    thematicBreak: Symbol.for('md.thematic-break'),
    table: Symbol.for('md.table'),
    tableRow: Symbol.for('md.table-row'),
    tableCell: Symbol.for('md.table-cell'),
} as const;

export abstract class Node {
    public static readonly symbol = Symbols.node;
    public readonly symbol = Symbols.node;
    public children: AST.Node[];
    public dirty: boolean;
    public raw: string[];
    public constructor(children: AST.Node[] = [], dirty = false, raw: string[] = []) {
        this.children = children;
        this.dirty = dirty;
        this.raw = raw;
    }

    /** Reads the node at a dot-separated child path (numeric indices into each children list). */
    public get(path: string): AST.Node | null {
        let current: Node = this;
        for (const part of path.split('.')) {
            if (!/^\d+$/.test(part)) return null;
            const child = current.children[Number(part)];
            if (!child) return null;
            current = child;
        }
        return current;
    }

    /**
     * Sets the node at a dot-separated child path, padding gaps with empty paragraphs.
     * A node argument replaces the target structurally; a JSON-AST value builds a fresh node from it.
     */
    public set(path: string, value: AST.JsonNode | AST.Node): void {
        const parts = path.split('.');
        let current: Node = this;
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!/^\d+$/.test(part)) return;
            const index = Number(part);
            let child = current.children[index];
            if (!child) {
                while (current.children.length <= index) current.children.push(new ParagraphNode());
                child = current.children[index];
            }
            current = child;
        }
        const key = parts[parts.length - 1];
        if (!/^\d+$/.test(key)) return;
        const index = Number(key);
        while (current.children.length <= index) current.children.push(new ParagraphNode());
        const node = value instanceof Node ? value : AST.fromValue(value);
        node.dirty = true;
        current.children[index] = node;
        current.dirty = true;
    }

    /** Deletes the node at a dot-separated child path, returning whether anything was removed. */
    public delete(path: string): boolean {
        let current: Node = this;
        const parts = path.split('.');
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!/^\d+$/.test(part)) return false;
            const child = current.children[Number(part)];
            if (!child) return false;
            current = child;
        }
        const key = parts[parts.length - 1];
        if (!/^\d+$/.test(key)) return false;
        const index = Number(key);
        if (index >= current.children.length) return false;
        current.children.splice(index, 1);
        current.dirty = true;
        return true;
    }
}

export class DocumentNode extends Node {
    public static readonly symbol = Symbols.document;
    public readonly symbol = Symbols.document;
    public constructor(children: AST.Node[] = []) { super(children); }
}

export class HeadingNode extends Node {
    public static readonly symbol = Symbols.heading;
    public readonly symbol = Symbols.heading;
    public level: Node.HeadingLevel;
    public constructor(level: Node.HeadingLevel, children: AST.Node[] = []) {
        super(children);
        this.level = level;
    }
}

export class ParagraphNode extends Node {
    public static readonly symbol = Symbols.paragraph;
    public readonly symbol = Symbols.paragraph;
    public constructor(children: AST.Node[] = []) { super(children); }
}

export class TextNode extends Node {
    public static readonly symbol = Symbols.text;
    public readonly symbol = Symbols.text;
    public value: string;
    public constructor(value: string) { super([]); this.value = value; }
}

export class StrongNode extends Node {
    public static readonly symbol = Symbols.strong;
    public readonly symbol = Symbols.strong;
    public constructor(children: AST.Node[] = []) { super(children); }
}

export class EmphasisNode extends Node {
    public static readonly symbol = Symbols.emphasis;
    public readonly symbol = Symbols.emphasis;
    public constructor(children: AST.Node[] = []) { super(children); }
}

export class CodeNode extends Node {
    public static readonly symbol = Symbols.code;
    public readonly symbol = Symbols.code;
    public value: string;
    public constructor(value: string) { super([]); this.value = value; }
}

export class LinkNode extends Node {
    public static readonly symbol = Symbols.link;
    public readonly symbol = Symbols.link;
    public href: string;
    public title?: string;
    public constructor(href: string, children: AST.Node[] = [], title?: string) {
        super(children);
        this.href = href;
        this.title = title;
    }
}

export class ImageNode extends Node {
    public static readonly symbol = Symbols.image;
    public readonly symbol = Symbols.image;
    public src: string;
    public alt?: string;
    public title?: string;
    public constructor(src: string, alt?: string, title?: string) {
        super([]);
        this.src = src;
        this.alt = alt;
        this.title = title;
    }
}

export class ListNode extends Node {
    public static readonly symbol = Symbols.list;
    public readonly symbol = Symbols.list;
    public ordered: boolean;
    public start?: number;
    public constructor(ordered: boolean, children: AST.Node[] = [], start?: number) {
        super(children);
        this.ordered = ordered;
        this.start = start;
    }
}

export class ListItemNode extends Node {
    public static readonly symbol = Symbols.listItem;
    public readonly symbol = Symbols.listItem;
    public checked?: boolean;
    public constructor(children: AST.Node[] = [], checked?: boolean) {
        super(children);
        this.checked = checked;
    }
}

export class BlockquoteNode extends Node {
    public static readonly symbol = Symbols.blockquote;
    public readonly symbol = Symbols.blockquote;
    public constructor(children: AST.Node[] = []) { super(children); }
}

export class CodeBlockNode extends Node {
    public static readonly symbol = Symbols.codeBlock;
    public readonly symbol = Symbols.codeBlock;
    public value: string;
    public language?: string;
    public constructor(value: string, language?: string) {
        super([]);
        this.value = value;
        this.language = language;
    }
}

export class ThematicBreakNode extends Node {
    public static readonly symbol = Symbols.thematicBreak;
    public readonly symbol = Symbols.thematicBreak;
    public constructor() { super([]); }
}

export class TableNode extends Node {
    public static readonly symbol = Symbols.table;
    public readonly symbol = Symbols.table;
    public head: TableRowNode;
    public body: TableRowNode[];
    public constructor(head: TableRowNode, body: TableRowNode[] = []) {
        super([head, ...body]);
        this.head = head;
        this.body = body;
    }
}

export class TableRowNode extends Node {
    public static readonly symbol = Symbols.tableRow;
    public readonly symbol = Symbols.tableRow;
    public constructor(children: TableCellNode[] = []) { super(children); }
}

export class TableCellNode extends Node {
    public static readonly symbol = Symbols.tableCell;
    public readonly symbol = Symbols.tableCell;
    public header?: boolean;
    public align?: Node.Alignment;
    public constructor(children: AST.Node[] = [], header?: boolean, align?: Node.Alignment) {
        super(children);
        this.header = header;
        this.align = align;
    }
}

export namespace Node {
    export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
    export type Alignment = 'left' | 'center' | 'right';
}

export class AST {
    public static fromValue(json: AST.JsonNode): AST.Node {
        const children = () => (json.children ?? []).map(child => AST.fromValue(child));
        const text = (fallback = '') => typeof json.value === 'string' ? json.value : fallback;
        let node: AST.Node;
        switch (json.type) {
            case 'heading': node = new HeadingNode(typeof json.level === 'number' ? json.level as Node.HeadingLevel : 1, children()); break;
            case 'text': node = new TextNode(text()); break;
            case 'strong': node = new StrongNode(children()); break;
            case 'emphasis': node = new EmphasisNode(children()); break;
            case 'code': node = new CodeNode(text()); break;
            case 'link': node = new LinkNode(typeof json.href === 'string' ? json.href : '', children(), typeof json.title === 'string' ? json.title : undefined); break;
            case 'image': node = new ImageNode(typeof json.src === 'string' ? json.src : '', typeof json.alt === 'string' ? json.alt : undefined, typeof json.title === 'string' ? json.title : undefined); break;
            case 'list': node = new ListNode(json.ordered === true, children() as ListItemNode[], typeof json.start === 'number' ? json.start : undefined); break;
            case 'listItem': node = new ListItemNode(children(), typeof json.checked === 'boolean' ? json.checked : undefined); break;
            case 'blockquote': node = new BlockquoteNode(children()); break;
            case 'codeBlock': node = new CodeBlockNode(text(), typeof json.language === 'string' ? json.language : undefined); break;
            case 'thematicBreak': node = new ThematicBreakNode(); break;
            case 'table': {
                const head = json.head ? AST.fromValue(json.head as AST.JsonNode) as TableRowNode : new TableRowNode();
                const body = ((json.body ?? []) as AST.JsonNode[]).map(row => AST.fromValue(row) as TableRowNode);
                node = new TableNode(head, body);
                break;
            }
            case 'tableRow': node = new TableRowNode(children() as TableCellNode[]); break;
            case 'tableCell': node = new TableCellNode(children(), json.header === true, typeof json.align === 'string' ? json.align as Node.Alignment : undefined); break;
            default: node = new ParagraphNode(children());
        }
        node.dirty = true;
        return node;
    }
}

export namespace AST {
    export type Node =
        | DocumentNode
        | HeadingNode
        | ParagraphNode
        | TextNode
        | StrongNode
        | EmphasisNode
        | CodeNode
        | LinkNode
        | ImageNode
        | ListNode
        | ListItemNode
        | BlockquoteNode
        | CodeBlockNode
        | ThematicBreakNode
        | TableNode
        | TableRowNode
        | TableCellNode;
    export interface JsonNode {
        type: string;
        children?: JsonNode[];
        [key: string]: unknown;
    }
}

export default AST;
