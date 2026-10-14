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
export declare class CodeEditor extends Component<'div', CodeEditor.EventMap> {
    readonly root: Element<Element.Type['div']>;
    private readonly vMarkup;
    private readonly vOnInput?;
    private readonly vOnRun?;
    private vComposing;
    private vScheduled;
    private vPainted;
    private vPending;
    constructor(props?: Partial<CodeEditor.Props>);
    /** The current text of the editor. **/
    get text(): string;
    /**
     * Replaces the content, without notifying (resets and programmatic loads).
     * @param value - The new source text.
     */
    setText(value: string): void;
    /** Repaints tokens and restores the caret of the current selection. **/
    private vInput;
    /** Rebuilds the tokens and re-establishes the selection by global text offsets. **/
    private vRepaint;
    /**
     * Computes the global start/end text offsets of the browser selection
     * against the whole editor text.
     * @returns The collapsed or spanning offsets.
     */
    private vOffsets;
    /**
     * Places the selection at two global text offsets, clamped to the current text length.
     * @param startOf - The start offset.
     * @param end - The end offset; collapsed when equal to the start.
     */
    private vPlace;
    /**
     * Handles editor keys: Ctrl/⌘+Enter runs the sandbox, Tab inserts spaces, Enter
     * inserts a real newline instead of letting the browser restructure the block.
     * @param event - The keyboard event of the editor.
     */
    private vKey;
    /**
     * Replaces the paste payload with plain text through the editable layer.
     * @param event - The clipboard event of the editor.
     */
    private vPaste;
    /**
     * Inserts text at the selection through execCommand so the native undo and
     * caret machinery stay intact; falls back to a manual splice.
     * @param text - The text to insert.
     */
    private vInsert;
}
export declare namespace CodeEditor {
    /** The shapes of the sandbox editors. **/
    type Mode = 'module' | 'css';
    /** A position inside the raw subtree of the editor. **/
    interface Position {
        /** The text/element node that contains the position. **/
        node: Node;
        /** The offset inside that node. **/
        offset: number;
    }
    /**
     * Walks the editor's text nodes and maps a global offset to a caret position.
     * @param container - The root element of the editor.
     * @param offset - The global text offset.
     * @returns The containing node and its local offset, or null when the tree is empty.
     */
    function offsetToPosition(container: HTMLElement, offset: number): Position | null;
    /** The props of an editor. **/
    interface Props {
        mode: Mode;
        label: string;
        value?: string;
        /** Notified after every committed content change. **/
        onInput?: (text: string) => void;
        /** Fired for Ctrl/⌘+Enter, to run the module from the page. **/
        onRun?: () => void;
    }
    type EventMap = {
        [key: string]: never;
    };
}
export default CodeEditor;
