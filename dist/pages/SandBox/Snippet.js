/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Seed sources of the sandbox: a runnable module that exports MyComponent and its stylesheet.
 * @license Apache-2.0
 */
export const DEFAULT_MODULE = `import { Component, Store } from 'vizui';

export class MyComponent extends Component {
    constructor() { super();
        this.vCount = Store.create(0);

        this.root = (
            <div class="MyComponent-root">
                <span class="MyComponent-value">{this.vCount}</span>
                <button type="button" class="MyComponent-button" on:click={() => this.vCount.smartSet(prev => prev + 1)}>+1</button>
            </div>
        );
    }
}

export default MyComponent;
// Nota: el sandbox ejecuta módulos ESM reales: el JSX se transforma a jsx-runtime al vuelo.
// Las anotaciones de tipo TS no son ejecutables aquí — eso queda para tu build con tsc.`;
export const DEFAULT_CSS = `.MyComponent-root {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    border: 1px solid var(--line);
    border-radius: 12px;
    background: var(--surface-sunken);
    font-family: var(--font-mono);
}

.MyComponent-value {
    color: #60a5fa;
    font-size: 20px;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
}

.MyComponent-button {
    padding: 6px 14px;
    border: none;
    border-radius: 8px;
    background: #2563eb;
    color: #ffffff;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
    transition: background 120ms ease, transform 100ms ease;
}

.MyComponent-button:hover { background: #3b82f6; }
.MyComponent-button:active { transform: scale(0.94); }`;
//# sourceMappingURL=Snippet.js.map