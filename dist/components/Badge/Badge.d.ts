/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Stateless inline badge with a visual tone.
 * @license Apache-2.0
 */
import { type Element } from 'vizui';
import type { JSX } from 'vizui/jsx-runtime';
export declare function Badge(props: JSX.Attributes<Badge.Props>): Element<Element.Type['span']>;
export default Badge;
export declare namespace Badge {
    /** The supported badge tones. **/
    type Tone = 'neutral' | 'accent' | 'ok' | 'warn' | 'danger';
    /** The props of the badge. **/
    interface Props {
        label: string;
        tone?: Tone;
        /** Whether to render a pulsing status dot before the label. **/
        dot?: boolean;
    }
}
