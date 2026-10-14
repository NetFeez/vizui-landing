/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Stateless section heading with an optional eyebrow tag and description.
 * @license Apache-2.0
 */

import { CSS, type Element } from 'vizui';
import type { JSX } from 'vizui/jsx-runtime';

CSS.load('SectionHeader.css', import.meta);

export function SectionHeader(props: JSX.Attributes<SectionHeader.Props>): Element<Element.Type['div']> {
    const root: Element<Element.Type['div']> = <div class="SectionHeader"></div>;
    if (props.eyebrow) root.append(<span class={`eyebrow --${props.tone ?? 'accent'}`}>{props.eyebrow}</span>);
    root.append(<h2 class="title">{props.title}</h2>);
    if (props.description) root.append(<p class="description">{props.description}</p>);
    return root;
}

export default SectionHeader;

export namespace SectionHeader {
    /** The supported eyebrow tones. **/
    export type Tone = 'accent' | 'violet' | 'ok';

    /** The props of a section header. **/
    export interface Props {
        title: string;
        eyebrow?: string;
        description?: string;
        tone?: Tone;
    }
}
