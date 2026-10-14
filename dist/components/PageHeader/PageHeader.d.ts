/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Stateless page heading with an optional description.
 * @license Apache-2.0
 */
import { type Element } from 'vizui';
import type { JSX } from 'vizui/jsx-runtime';
export declare function PageHeader(props: JSX.Attributes<PageHeader.Props>): Element<Element.Type['header']>;
export default PageHeader;
export declare namespace PageHeader {
    /** The props of a page header. **/
    interface Props {
        title: string;
        description?: string;
    }
}
