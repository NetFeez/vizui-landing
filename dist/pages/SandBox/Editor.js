/**
 * @author NetFeez <netfeez.dev@gmail.com>.
 * @description Editable layer of the sandbox — a contenteditable div whose children ARE the
 *              highlighted tokens, so what you edit and what you see is the same DOM and the
 *              overlay-vs-textarea metric war disappears by construction.
 *              On every input the content is re-normalized into fresh tokens with the caret
 *              restored from its global text offset. Composition (IME) is never normalized
 *              mid-flight, and Enter/Tab/paste splice plain text.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
import { moduleHtml, styleHtml } from './Highlight.js';
export class CodeEditor extends Component {
    root;
    vMarkup;
    vOnInput;
    vOnRun;
    vComposing = false;
    vScheduled = false;
    vPainted = '';
    vPending = null;
    constructor(props = {}) {
        super();
        this.vMarkup = props.mode === 'css' ? styleHtml : moduleHtml;
        this.vOnInput = props.onInput;
        this.vOnRun = props.onRun;
        this.root = Element.new('div', {
            attributes: {
                class: 'editor' + (props.mode === 'css' ? ' editor--css' : ''),
                contenteditable: 'true',
                spellcheck: 'false',
                autocomplete: 'off',
                autocapitalize: 'off',
                translate: 'no',
                'aria-label': props.label ?? 'Editor',
                role: 'textbox',
            },
        });
        this.root.root.innerHTML = this.vMarkup(props.value ?? '');
        this.root.on('input', () => this.vInput());
        this.root.on('keydown', (event) => this.vKey(event));
        this.root.on('paste', (event) => this.vPaste(event));
        this.root.on('compositionstart', () => { this.vComposing = true; });
        this.root.on('compositionend', () => { this.vComposing = false; this.vInput(); });
    }
    /** The current text of the editor. **/
    get text() {
        return this.root.root.textContent ?? '';
    }
    /**
     * Replaces the content, without notifying (resets and programmatic loads).
     * @param value - The new source text.
     */
    setText(value) {
        this.root.root.innerHTML = this.vMarkup(value);
        this.vPending = null;
        this.vPainted = value;
    }
    /** Repaints tokens and restores the caret of the current selection. **/
    vInput() {
        if (this.vComposing)
            return;
        // The selection is captured at the input moment, while the caret is exactly
        // where the user left it: a later frame could mutate first and lose it.
        this.vPending = { offsets: this.vOffsets(), text: this.root.root.textContent ?? '' };
        // Coalesced paint: N inputs inside the same frame become a single repaint,
        // with a timeout fallback so a starving frame cannot stall the layer.
        if (this.vScheduled)
            return;
        this.vScheduled = true;
        requestAnimationFrame(() => { this.vScheduled = false; this.vRepaint(); });
    }
    /** Rebuilds the tokens and re-establishes the selection by global text offsets. **/
    vRepaint() {
        this.vScheduled = false;
        try {
            const pending = this.vPending;
            this.vPending = null;
            if (!pending)
                return;
            if (pending.text === this.vPainted)
                return;
            this.root.root.innerHTML = this.vMarkup(pending.text);
            this.vPainted = pending.text;
            this.vPlace(pending.offsets[0], pending.offsets[1]);
            this.vOnInput?.(this.root.root.textContent ?? '');
        }
        catch (error) {
            // A dead repaint must never take the whole typing pipeline down with it.
            console.error('[vizui] sandbox editor repaint failed:', error);
        }
    }
    /**
     * Computes the global start/end text offsets of the browser selection
     * against the whole editor text.
     * @returns The collapsed or spanning offsets.
     */
    vOffsets() {
        try {
            const rawSelection = window.getSelection();
            if (!rawSelection || rawSelection.rangeCount === 0)
                return [0, 0];
            const range = rawSelection.getRangeAt(0);
            const measure = document.createRange();
            measure.selectNodeContents(this.root.root);
            measure.setEnd(range.startContainer, range.startOffset);
            const start = measure.toString().length;
            if (range.collapsed)
                return [start, start];
            measure.setEnd(range.endContainer, range.endOffset);
            return [start, measure.toString().length];
        }
        catch {
            return [0, 0];
        }
    }
    /**
     * Places the selection at two global text offsets, clamped to the current text length.
     * @param startOf - The start offset.
     * @param end - The end offset; collapsed when equal to the start.
     */
    vPlace(start, end) {
        try {
            const limit = (this.root.root.textContent ?? '').length;
            const from = Math.max(0, Math.min(start, limit));
            const to = Math.max(0, Math.min(Math.max(end, start), limit));
            const anchor = CodeEditor.offsetToPosition(this.root.root, from);
            const focus = CodeEditor.offsetToPosition(this.root.root, to);
            if (!anchor || !focus)
                return;
            const range = document.createRange();
            range.setStart(anchor.node, anchor.offset);
            range.setEnd(focus.node, focus.offset);
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(range);
        }
        catch { /* a failed restore leaves the default caret; typing still works. */ }
    }
    /**
     * Handles editor keys: Ctrl/⌘+Enter runs the sandbox, Tab inserts spaces, Enter
     * inserts a real newline instead of letting the browser restructure the block.
     * @param event - The keyboard event of the editor.
     */
    vKey(event) {
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            this.vOnRun?.();
            return;
        }
        if (event.key === 'Tab') {
            event.preventDefault();
            this.vInsert('  ');
            return;
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            this.vInsert('\n');
        }
    }
    /**
     * Replaces the paste payload with plain text through the editable layer.
     * @param event - The clipboard event of the editor.
     */
    vPaste(event) {
        event.preventDefault();
        const text = event.clipboardData?.getData('text/plain');
        if (text !== undefined && text !== null)
            this.vInsert(text.replace(/\r\n?/g, '\n'));
    }
    /**
     * Inserts text at the selection through execCommand so the native undo and
     * caret machinery stay intact; falls back to a manual splice.
     * @param text - The text to insert.
     */
    vInsert(text) {
        if (!text.includes('\n')) {
            try {
                document.execCommand('insertText', false, text);
                return;
            }
            catch { /* fall through */ }
        }
        const [start, end] = this.vOffsets();
        const value = this.root.root.textContent ?? '';
        const next = `${value.slice(0, start)}${text}${value.slice(end)}`;
        this.root.root.innerHTML = this.vMarkup(next);
        this.vPainted = next;
        this.vPlace(start + text.length, start + text.length);
        this.vPending = null;
        this.vOnInput?.(next);
    }
}
(function (CodeEditor) {
    /**
     * Walks the editor's text nodes and maps a global offset to a caret position.
     * @param container - The root element of the editor.
     * @param offset - The global text offset.
     * @returns The containing node and its local offset, or null when the tree is empty.
     */
    function offsetToPosition(container, offset) {
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
        let current;
        let acc = 0;
        let last = null;
        while ((current = walker.nextNode())) {
            const text = current;
            const length = text.data.length;
            if (offset <= acc + length)
                return { node: current, offset: offset - acc };
            acc += length;
            last = text;
        }
        if (last)
            return { node: last, offset: last.data.length };
        return { node: container, offset: 0 };
    }
    CodeEditor.offsetToPosition = offsetToPosition;
})(CodeEditor || (CodeEditor = {}));
export default CodeEditor;
//# sourceMappingURL=Editor.js.map