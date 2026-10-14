/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Markdown component — renders markdown content using Vizui Elements.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
import Compiler, { Renderer } from '../../markdown/Compiler.js';
import CodeBlock from './CodeBlock/CodeBlock.js';
export class CustomRenderer extends Renderer {
    renderCodeBlock(node) {
        return CodeBlock({ code: node.value });
    }
}
export class Markdown extends Component {
    static { this.css.load('Markdown.css', import.meta); }
    root = Element.new('div').setClass('Markdown');
    vContent;
    constructor({ content = '' }) {
        super();
        this.vContent = '';
        this.content = content;
    }
    get content() { return this.vContent; }
    set content(value) {
        this.vContent = value;
        this.root.clean();
        if (!value)
            return;
        const ast = Compiler.parse(value);
        const element = new CustomRenderer().render(ast);
        if (element)
            this.root.append(element);
    }
}
export default Markdown;
//# sourceMappingURL=Markdown.js.map