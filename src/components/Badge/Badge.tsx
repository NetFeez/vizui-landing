/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Stateless inline badge with a visual tone.
 * @license Apache-2.0
 */

import { CSS, type Element } from 'vizui';
import type { JSX } from 'vizui/jsx-runtime';

CSS.load('Badge.css', import.meta);

export function Badge(props: JSX.Attributes<Badge.Props>): Element<Element.Type['span']> {
    const tone = props.tone ?? 'neutral';
    const root: Element<Element.Type['span']> = <span class={`Badge --${tone}`}></span>;
    if (props.dot) root.append(<span class="dot"></span>);
    root.append(<span class="label">{props.label}</span>);
    return root;
}

export default Badge;

export namespace Badge {
    /** The supported badge tones. **/
    export type Tone = 'neutral' | 'accent' | 'ok' | 'warn' | 'danger';

    /** The props of the badge. **/
    export interface Props {
        label: string;
        tone?: Tone;
        /** Whether to render a pulsing status dot before the label. **/
        dot?: boolean;
    }
}