/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Live diagram of the direct-to-DOM architecture: a real reactive node and an interactive button node.
 *              It mirrors the shared counter of the page when one is provided, so every reactive node shows the same Store.
 * @license Apache-2.0
 */

import { Component, Store, type Element } from 'vizui';

export class HeroDiagram extends Component<'div', HeroDiagram.EventMap> {
    static { this.css.load('HeroDiagram.css', import.meta); }

    public readonly root: Element<Element.Type['div']>;
    private readonly vCount: Store<number>;
    private readonly vOwnsStore: boolean;

    public constructor(props: HeroDiagram.Props = {}) { super();
        this.vOwnsStore = !props.count;
        this.vCount = props.count ?? Store.create(0);

        const eValue = (
            <div class="node --value">
                <span class="tag">&lt;span.val&gt;</span>
                <span class="value">{this.vCount}</span>
            </div>
        );

        const eButton = (
            <button type="button" class="node --button" title="Incrementar el Store">
                <span class="tag">&lt;button.inc&gt;</span>
                <span class="plus">+1</span>
            </button>
        );
        eButton.on('click', () => this.vCount.smartSet(prev => prev + 1));

        this.root = (
            <div class="HeroDiagram">
                <div class="head">
                    <span class="legend"><span class="pulse"></span>Arquitectura directa al DOM real</span>
                    <span class="badge">Zero Virtual Layer</span>
                </div>
                <div class="tree">
                    <div class="root">
                        <span class="tag">&lt;div#app&gt;</span>
                        <span class="chip">Native DOM</span>
                    </div>
                    <span class="connector"></span>
                    <div class="component">
                        <span class="tag">&lt;CounterComponent&gt;</span>
                        <span class="chip">Reactive Store</span>
                    </div>
                    <div class="fork-group">
                        <span class="fork"></span>
                        <div class="children">
                            <div class="branch">
                                <span class="stem"></span>
                                {eValue}
                            </div>
                            <div class="branch">
                                <span class="stem"></span>
                                {eButton}
                            </div>
                        </div>
                    </div>
                </div>
                <p class="caption">
                    Las mutaciones impactan directamente los nodos sin diffing ni reconciliación sintética.
                </p>
            </div>
        );

        this.root.observer.on('remove', () => {
            if (this.vOwnsStore) this.vCount.destroy();
        });
    }
}

export namespace HeroDiagram {
    /** The props of the diagram: an optional shared counter Store mirrored by the reactive node. **/
    export interface Props {
        /** When set, the diagram mirrors that Store instead of owning one. **/
        count?: Store<number>;
    }

    export type EventMap = {
        [key: string]: never;
    };
}

export default HeroDiagram;
