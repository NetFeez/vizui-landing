/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Stateless editor panel — window chrome (traffic lights), file name, mode tag and a highlighted code listing.
 * @license Apache-2.0
 */

import { CSS, type Element } from 'vizui';
import type { JSX } from 'vizui/jsx-runtime';

import CodeBlock from '../Markdown/CodeBlock/CodeBlock.js';

CSS.load('IdePanel.css', import.meta);

export function IdePanel(props: JSX.Attributes<IdePanel.Props>): Element<Element.Type['div']> {
    return (
        <div class={`IdePanel --${props.tone ?? 'accent'}`}>
            <div class="bar">
                <span class="dots">
                    <span class="dot --rose"></span>
                    <span class="dot --amber"></span>
                    <span class="dot --emerald"></span>
                </span>
                <span class="file">{props.filename}</span>
                <span class="mode">{props.mode}</span>
            </div>
            <div class="body">{CodeBlock({ code: props.code })}</div>
        </div>
    );
}

export default IdePanel;

export namespace IdePanel {
    /** The supported panel accents. **/
    export type Tone = 'accent' | 'ok';

    /** The props of an editor panel. **/
    export interface Props {
        filename: string;
        mode: string;
        code: string;
        tone?: Tone;
    }
}
