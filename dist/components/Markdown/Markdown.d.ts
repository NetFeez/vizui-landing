/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Markdown component — renders markdown content using Vizui Elements.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
import { CodeNode, Renderer } from '../../markdown/Compiler.js';
export declare class CustomRenderer extends Renderer {
    renderCodeBlock(node: CodeNode): Element<HTMLPreElement>;
}
export declare class Markdown extends Component<'div', Markdown.EventMap> {
    readonly root: Element<HTMLDivElement>;
    private vContent;
    constructor({ content }: {
        content?: string | undefined;
    });
    get content(): string;
    set content(value: string);
}
export declare namespace Markdown {
    type EventMap = {
        [key: string]: never;
    };
}
export default Markdown;
