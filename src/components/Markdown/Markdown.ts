/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Markdown component — renders markdown content using Vizui Elements.
 * @license Apache-2.0
 */

import { Component, Element } from 'vizui';

import Compiler, { CodeNode, Renderer } from '../../markdown/Compiler.js';
import CodeBlock from './CodeBlock/CodeBlock.js';

export class CustomRenderer extends Renderer {
    public override renderCodeBlock(node: CodeNode): Element<HTMLPreElement> {
        return CodeBlock({ code: node.value });
    }
}

export class Markdown extends Component<'div', Markdown.EventMap> {
    static { this.css.load('Markdown.css', import.meta); }

    public readonly root = Element.new('div').setClass('Markdown');

    private vContent: string;

    public constructor({ content = '' }) { super();
        this.vContent = '';
        this.content = content;
    }

    public get content(): string { return this.vContent; }
    public set content(value: string) {
        this.vContent = value;
        this.root.clean();
        if (!value) return;
        const ast = Compiler.parse(value);
        const element = new CustomRenderer().render(ast);
        if (element) this.root.append(element);
    }
}

export namespace Markdown {
    export type EventMap = {
        [key: string]: never;
    };
}

export default Markdown;