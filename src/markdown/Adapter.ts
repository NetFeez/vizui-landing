/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Adapts the Markdown AST to and from its plain JSON-AST representation.
 * @license Apache-2.0
 */

import { AST } from './AST.js';
import {
    DocumentNode, HeadingNode, ParagraphNode, TextNode, StrongNode, EmphasisNode, CodeNode,
    LinkNode, ImageNode, ListNode, ListItemNode, BlockquoteNode, CodeBlockNode, ThematicBreakNode,
    TableNode, TableRowNode, TableCellNode,
} from './AST.js';

export class Adapter {
    /** Renders a node (and its children) as plain JSON-AST data. */
    public static toJson(node: AST.Node): AST.JsonNode {
        const json: AST.JsonNode = { type: Adapter.typeOf(node) };
        if (node instanceof HeadingNode) json.level = node.level;
        if (node instanceof TextNode || node instanceof CodeNode) json.value = node.value;
        if (node instanceof CodeBlockNode) {
            json.value = node.value;
            if (node.language) json.language = node.language;
        }
        if (node instanceof LinkNode) {
            json.href = node.href;
            if (node.title) json.title = node.title;
        }
        if (node instanceof ImageNode) {
            json.src = node.src;
            if (node.alt) json.alt = node.alt;
            if (node.title) json.title = node.title;
        }
        if (node instanceof ListNode) {
            json.ordered = node.ordered;
            if (node.start !== undefined) json.start = node.start;
        }
        if (node instanceof ListItemNode && node.checked !== undefined) json.checked = node.checked;
        if (node instanceof TableCellNode) {
            if (node.header) json.header = node.header;
            if (node.align) json.align = node.align;
        }
        if (node instanceof TableNode) {
            json.head = Adapter.toJson(node.head);
            json.body = node.body.map(row => Adapter.toJson(row));
            return json;
        }
        if (node.children.length > 0) json.children = node.children.map(child => Adapter.toJson(child));
        return json;
    }

    /** Builds a fresh node from its JSON-AST form (delegates to the AST factory). */
    public static fromValue(json: AST.JsonNode): AST.Node {
        return AST.fromValue(json);
    }

    private static typeOf(node: AST.Node): string {
        if (node instanceof DocumentNode) return 'document';
        if (node instanceof HeadingNode) return 'heading';
        if (node instanceof ParagraphNode) return 'paragraph';
        if (node instanceof TextNode) return 'text';
        if (node instanceof StrongNode) return 'strong';
        if (node instanceof EmphasisNode) return 'emphasis';
        if (node instanceof CodeNode) return 'code';
        if (node instanceof LinkNode) return 'link';
        if (node instanceof ImageNode) return 'image';
        if (node instanceof ListNode) return 'list';
        if (node instanceof ListItemNode) return 'listItem';
        if (node instanceof BlockquoteNode) return 'blockquote';
        if (node instanceof CodeBlockNode) return 'codeBlock';
        if (node instanceof ThematicBreakNode) return 'thematicBreak';
        if (node instanceof TableNode) return 'table';
        if (node instanceof TableRowNode) return 'tableRow';
        return 'tableCell';
    }
}

export namespace Adapter {}

export default Adapter;