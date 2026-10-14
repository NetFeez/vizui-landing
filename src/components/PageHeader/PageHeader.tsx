/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Stateless page heading with an optional description.
 * @license Apache-2.0
 */

import { CSS, type Element } from 'vizui';
import type { JSX } from 'vizui/jsx-runtime';

CSS.load('PageHeader.css', import.meta);

export function PageHeader(props: JSX.Attributes<PageHeader.Props>): Element<Element.Type['header']> {
    const root = (
        <header class="PageHeader">
            <h1 class="title">{props.title}</h1>
        </header>
    );
    if (props.description) root.append(<p class="description">{props.description}</p>);
    return root;
}

export default PageHeader;

export namespace PageHeader {
    /** The props of a page header. **/
    export interface Props {
        title: string;
        description?: string;
    }
}