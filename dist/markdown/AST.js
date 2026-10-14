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
};
export class Node {
    static symbol = Symbols.node;
    symbol = Symbols.node;
    children;
    dirty;
    raw;
    constructor(children = [], dirty = false, raw = []) {
        this.children = children;
        this.dirty = dirty;
        this.raw = raw;
    }
    /** Reads the node at a dot-separated child path (numeric indices into each children list). */
    get(path) {
        let current = this;
        for (const part of path.split('.')) {
            if (!/^\d+$/.test(part))
                return null;
            const child = current.children[Number(part)];
            if (!child)
                return null;
            current = child;
        }
        return current;
    }
    /**
     * Sets the node at a dot-separated child path, padding gaps with empty paragraphs.
     * A node argument replaces the target structurally; a JSON-AST value builds a fresh node from it.
     */
    set(path, value) {
        const parts = path.split('.');
        let current = this;
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!/^\d+$/.test(part))
                return;
            const index = Number(part);
            let child = current.children[index];
            if (!child) {
                while (current.children.length <= index)
                    current.children.push(new ParagraphNode());
                child = current.children[index];
            }
            current = child;
        }
        const key = parts[parts.length - 1];
        if (!/^\d+$/.test(key))
            return;
        const index = Number(key);
        while (current.children.length <= index)
            current.children.push(new ParagraphNode());
        const node = value instanceof Node ? value : AST.fromValue(value);
        node.dirty = true;
        current.children[index] = node;
        current.dirty = true;
    }
    /** Deletes the node at a dot-separated child path, returning whether anything was removed. */
    delete(path) {
        let current = this;
        const parts = path.split('.');
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!/^\d+$/.test(part))
                return false;
            const child = current.children[Number(part)];
            if (!child)
                return false;
            current = child;
        }
        const key = parts[parts.length - 1];
        if (!/^\d+$/.test(key))
            return false;
        const index = Number(key);
        if (index >= current.children.length)
            return false;
        current.children.splice(index, 1);
        current.dirty = true;
        return true;
    }
}
export class DocumentNode extends Node {
    static symbol = Symbols.document;
    symbol = Symbols.document;
    constructor(children = []) { super(children); }
}
export class HeadingNode extends Node {
    static symbol = Symbols.heading;
    symbol = Symbols.heading;
    level;
    constructor(level, children = []) {
        super(children);
        this.level = level;
    }
}
export class ParagraphNode extends Node {
    static symbol = Symbols.paragraph;
    symbol = Symbols.paragraph;
    constructor(children = []) { super(children); }
}
export class TextNode extends Node {
    static symbol = Symbols.text;
    symbol = Symbols.text;
    value;
    constructor(value) { super([]); this.value = value; }
}
export class StrongNode extends Node {
    static symbol = Symbols.strong;
    symbol = Symbols.strong;
    constructor(children = []) { super(children); }
}
export class EmphasisNode extends Node {
    static symbol = Symbols.emphasis;
    symbol = Symbols.emphasis;
    constructor(children = []) { super(children); }
}
export class CodeNode extends Node {
    static symbol = Symbols.code;
    symbol = Symbols.code;
    value;
    constructor(value) { super([]); this.value = value; }
}
export class LinkNode extends Node {
    static symbol = Symbols.link;
    symbol = Symbols.link;
    href;
    title;
    constructor(href, children = [], title) {
        super(children);
        this.href = href;
        this.title = title;
    }
}
export class ImageNode extends Node {
    static symbol = Symbols.image;
    symbol = Symbols.image;
    src;
    alt;
    title;
    constructor(src, alt, title) {
        super([]);
        this.src = src;
        this.alt = alt;
        this.title = title;
    }
}
export class ListNode extends Node {
    static symbol = Symbols.list;
    symbol = Symbols.list;
    ordered;
    start;
    constructor(ordered, children = [], start) {
        super(children);
        this.ordered = ordered;
        this.start = start;
    }
}
export class ListItemNode extends Node {
    static symbol = Symbols.listItem;
    symbol = Symbols.listItem;
    checked;
    constructor(children = [], checked) {
        super(children);
        this.checked = checked;
    }
}
export class BlockquoteNode extends Node {
    static symbol = Symbols.blockquote;
    symbol = Symbols.blockquote;
    constructor(children = []) { super(children); }
}
export class CodeBlockNode extends Node {
    static symbol = Symbols.codeBlock;
    symbol = Symbols.codeBlock;
    value;
    language;
    constructor(value, language) {
        super([]);
        this.value = value;
        this.language = language;
    }
}
export class ThematicBreakNode extends Node {
    static symbol = Symbols.thematicBreak;
    symbol = Symbols.thematicBreak;
    constructor() { super([]); }
}
export class TableNode extends Node {
    static symbol = Symbols.table;
    symbol = Symbols.table;
    head;
    body;
    constructor(head, body = []) {
        super([head, ...body]);
        this.head = head;
        this.body = body;
    }
}
export class TableRowNode extends Node {
    static symbol = Symbols.tableRow;
    symbol = Symbols.tableRow;
    constructor(children = []) { super(children); }
}
export class TableCellNode extends Node {
    static symbol = Symbols.tableCell;
    symbol = Symbols.tableCell;
    header;
    align;
    constructor(children = [], header, align) {
        super(children);
        this.header = header;
        this.align = align;
    }
}
export class AST {
    static fromValue(json) {
        const children = () => (json.children ?? []).map(child => AST.fromValue(child));
        const text = (fallback = '') => typeof json.value === 'string' ? json.value : fallback;
        let node;
        switch (json.type) {
            case 'heading':
                node = new HeadingNode(typeof json.level === 'number' ? json.level : 1, children());
                break;
            case 'text':
                node = new TextNode(text());
                break;
            case 'strong':
                node = new StrongNode(children());
                break;
            case 'emphasis':
                node = new EmphasisNode(children());
                break;
            case 'code':
                node = new CodeNode(text());
                break;
            case 'link':
                node = new LinkNode(typeof json.href === 'string' ? json.href : '', children(), typeof json.title === 'string' ? json.title : undefined);
                break;
            case 'image':
                node = new ImageNode(typeof json.src === 'string' ? json.src : '', typeof json.alt === 'string' ? json.alt : undefined, typeof json.title === 'string' ? json.title : undefined);
                break;
            case 'list':
                node = new ListNode(json.ordered === true, children(), typeof json.start === 'number' ? json.start : undefined);
                break;
            case 'listItem':
                node = new ListItemNode(children(), typeof json.checked === 'boolean' ? json.checked : undefined);
                break;
            case 'blockquote':
                node = new BlockquoteNode(children());
                break;
            case 'codeBlock':
                node = new CodeBlockNode(text(), typeof json.language === 'string' ? json.language : undefined);
                break;
            case 'thematicBreak':
                node = new ThematicBreakNode();
                break;
            case 'table': {
                const head = json.head ? AST.fromValue(json.head) : new TableRowNode();
                const body = (json.body ?? []).map(row => AST.fromValue(row));
                node = new TableNode(head, body);
                break;
            }
            case 'tableRow':
                node = new TableRowNode(children());
                break;
            case 'tableCell':
                node = new TableCellNode(children(), json.header === true, typeof json.align === 'string' ? json.align : undefined);
                break;
            default: node = new ParagraphNode(children());
        }
        node.dirty = true;
        return node;
    }
}
export default AST;
//# sourceMappingURL=AST.js.map