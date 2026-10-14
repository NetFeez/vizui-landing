/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Stateless editor panel — window chrome (traffic lights), file name, mode tag and a highlighted code listing.
 * @license Apache-2.0
 */
import { type Element } from 'vizui';
import type { JSX } from 'vizui/jsx-runtime';
export declare function IdePanel(props: JSX.Attributes<IdePanel.Props>): Element<Element.Type['div']>;
export default IdePanel;
export declare namespace IdePanel {
    /** The supported panel accents. **/
    type Tone = 'accent' | 'ok';
    /** The props of an editor panel. **/
    interface Props {
        filename: string;
        mode: string;
        code: string;
        tone?: Tone;
    }
}
