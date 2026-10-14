// Detrás de la página de Componentes (excerpt autocontenido)
// Misma API que esa página: widgets de vizui.components sin una sola etiqueta JSX.
import { Component, Element, Store } from 'vizui';
import { Button } from 'vizui.components/Button/Button.js';
import { TextInput } from 'vizui.components/TextInput/TextInput.js';

export class Behind extends Component<'div', Behind.EventMap> {
    static { this.css.load('Behind.css', import.meta); }

    public readonly root: Element<Element.Type['div']>;
    private readonly vLog = Store.create<string[]>([]);

    public constructor() { super();
        this.root = Element.new('div', { class: 'Behind' });

        const button = new Button({ text: 'Botón', class: 'btn--primary' });
        button.on('click', () => this.vLog.smartSet(prev => [...prev, 'botón']));

        const input = new TextInput({ input: { placeholder: 'Texto…' } });
        input.on('submit', text => this.vLog.smartSet(prev => [...prev, text]));

        this.root.append(button, input, this.vLog);
    }
}

export namespace Behind {
    export type EventMap = {
        [key: string]: never;
    };
}

export default Behind;