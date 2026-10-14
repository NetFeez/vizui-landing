/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Stateless section heading with an optional eyebrow tag and description.
 * @license Apache-2.0
 */
import { type Element } from 'vizui';
import type { JSX } from 'vizui/jsx-runtime';
export declare function SectionHeader(props: JSX.Attributes<SectionHeader.Props>): Element<Element.Type['div']>;
export default SectionHeader;
export declare namespace SectionHeader {
    /** The supported eyebrow tones. **/
    type Tone = 'accent' | 'violet' | 'ok';
    /** The props of a section header. **/
    interface Props {
        title: string;
        eyebrow?: string;
        description?: string;
        tone?: Tone;
    }
}
