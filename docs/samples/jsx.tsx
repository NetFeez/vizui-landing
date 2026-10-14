// src/components/Counter/JsxCounter.tsx
import { Component, Store, type Element } from 'vizui';

export class JsxCounter extends Component<'div', JsxCounter.EventMap> {
    static { this.css.load('Counter.css', import.meta); }

    public readonly root: Element<Element.Type['div']>;
    private readonly vCount = Store.create(0);

    public constructor() { super();
        this.root = (
            <div class="JsxCounter">
                <span class="Counter-value">{this.vCount}</span>
                <button type="button" class="Counter-button" on:click={() => this.vCount.smartSet(prev => prev + 1)}>+1</button>
            </div>
        );
        this.root.observer.on('remove', () => this.vCount.destroy());
    }
}

export namespace JsxCounter {
    export type EventMap = {
        [key: string]: never;
    };
}

export default JsxCounter;