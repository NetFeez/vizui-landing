/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Serializer that re-emits untouched AST blocks verbatim and renders modified blocks back to markdown text.
 * @license Apache-2.0
 */
import { HeadingNode, ParagraphNode, TextNode, StrongNode, EmphasisNode, CodeNode, LinkNode, ImageNode, ListNode, ListItemNode, BlockquoteNode, CodeBlockNode, ThematicBreakNode, TableNode, TableCellNode, } from './AST.js';
export class Serializer {
    /**
     * Dumps the given AST document to markdown text.
     * Untouched blocks re-emit their captured source lines byte-for-byte;
     * dirty blocks are rendered from the tree.
     * @param doc - The AST document to dump.
     * @returns The markdown text.
     */
    static dump(doc) {
        if (doc.children.length === 0)
            return doc.raw.join('\n');
        const lines = doc.children.flatMap(block => block.dirty ? Serializer.emitBlock(block) : block.raw);
        return lines.join('\n');
    }
    static emitBlock(node) {
        if (node instanceof HeadingNode)
            return [`${'#'.repeat(node.level)} ${Serializer.emitInline(node.children)}`];
        if (node instanceof ListNode)
            return Serializer.emitList(node);
        if (node instanceof BlockquoteNode)
            return node.children.flatMap(child => Serializer.emitBlock(child)).map(line => `> ${line}`);
        if (node instanceof CodeBlockNode)
            return Serializer.emitCodeBlock(node);
        if (node instanceof TableNode)
            return Serializer.emitTable(node);
        if (node instanceof ThematicBreakNode)
            return ['---'];
        if (node instanceof LinkNode || node instanceof ImageNode)
            return [Serializer.renderInline(node)];
        if (node instanceof ParagraphNode)
            return Serializer.emitInline(node.children).split('\n');
        return [Serializer.emitInline(node.children)];
    }
    static emitList(node) {
        const lines = [];
        let number = node.start ?? 1;
        for (const child of node.children) {
            if (!(child instanceof ListItemNode))
                continue;
            const marker = node.ordered ? `${number++}. ` : '- ';
            const task = child.checked === undefined ? '' : child.checked ? '[x] ' : '[ ] ';
            lines.push(...Serializer.emitItem(child, marker, task));
        }
        return lines;
    }
    static emitItem(item, marker, task) {
        const lines = [];
        const [first, ...rest] = item.children;
        const head = first instanceof ParagraphNode ? Serializer.emitInline(first.children) : first ? Serializer.emitBlock(first).join('\n') : '';
        lines.push(marker + task + head);
        const pad = ' '.repeat(marker.length);
        for (const child of rest) {
            const rendered = child instanceof ListNode ? Serializer.emitList(child) : Serializer.emitBlock(child);
            lines.push(...rendered.map(line => pad + line));
        }
        return lines;
    }
    static emitCodeBlock(node) {
        const runs = node.value.match(/`+/g);
        const fence = '`'.repeat(runs ? Math.max(3, ...runs.map(run => run.length)) + 1 : 3);
        return [fence + (node.language ?? ''), ...node.value.split('\n'), fence];
    }
    static emitTable(node) {
        const aligns = node.head.children.map(cell => cell instanceof TableCellNode ? cell.align : undefined);
        const separator = aligns.map(align => align === 'left' ? ':---' : align === 'center' ? ':---:' : align === 'right' ? '---:' : '---');
        const lines = [
            `| ${node.head.children.map(cell => Serializer.emitCell(cell)).join(' | ')} |`,
            `| ${separator.join(' | ')} |`
        ];
        for (const row of node.body)
            lines.push(`| ${row.children.map(cell => Serializer.emitCell(cell)).join(' | ')} |`);
        return lines;
    }
    static emitCell(cell) {
        return Serializer.emitInline(cell.children).replace(/\|/g, '\\|');
    }
    static emitInline(nodes) {
        return nodes.map(child => Serializer.renderInline(child)).join('');
    }
    static renderInline(node) {
        if (node instanceof TextNode)
            return node.value;
        if (node instanceof StrongNode)
            return `**${Serializer.emitInline(node.children)}**`;
        if (node instanceof EmphasisNode)
            return `*${Serializer.emitInline(node.children)}*`;
        if (node instanceof CodeNode)
            return Serializer.renderCode(node.value);
        if (node instanceof LinkNode)
            return `[${Serializer.emitInline(node.children)}](${node.href}${node.title ? ` "${node.title}"` : ''})`;
        if (node instanceof ImageNode)
            return `![${node.alt ?? ''}](${node.src}${node.title ? ` "${node.title}"` : ''})`;
        return '';
    }
    static renderCode(value) {
        const runs = value.match(/`+/g);
        if (!runs)
            return `\`${value}\``;
        const fence = '`'.repeat(Math.max(...runs.map(run => run.length)) + 1);
        const padded = value.startsWith('`') || value.endsWith('`') ? ` ${value} ` : value;
        return `${fence}${padded}${fence}`;
    }
}
export default Serializer;
//# sourceMappingURL=Serializer.js.map