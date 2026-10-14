/**
 * @author NetFeez <netfeez.dev@gmail.com>
 * @description Tag input component supporting free text or predefined options.
 * @license Apache-2.0
 */
import { Component, Element } from 'vizui';
import TextInput from '../TextInput/TextInput.js';
import SelectInput from '../SelectInput/SelectInput.js';
import Utilities from '../Utilities.js';
export class MultiTagInput extends Component {
    static { this.css.load('MultiTagInput.css', import.meta); }
    root = Element.new('div').setClass('MultiTagInput');
    eContainer;
    cInput;
    vLimit;
    vMinim;
    vTags;
    vValidator;
    constructor(props = {}) {
        super();
        const { optionList: optionsList = [], placeholder = 'tag', limit = -1, minim = -1, validator = (tag) => true, ...rootIdentity } = props;
        this.vLimit = limit;
        this.vMinim = minim;
        this.vTags = new Set();
        this.vValidator = validator;
        this.eContainer = Element.new('div').setClass('container');
        if (optionsList.length <= 0) {
            this.cInput = new TextInput({
                input: { type: 'text', placeholder, validator: this.vValidator },
                button: { text: 'add' },
                class: 'input',
            });
            this.cInput.on('submit', (tag, e) => { this.addTag(tag, e); });
        }
        else {
            this.cInput = new SelectInput({ optionList: optionsList, placeholder, class: 'input' });
            this.cInput.on('submit', (tag, e) => { this.addTag(tag, e); });
        }
        Utilities.setIdentity(this, rootIdentity);
        this.setEventProps(props);
        this.root.append(this.eContainer, this.cInput);
    }
    newTag(tag) {
        const eTag = Element.new('span').setText(tag)
            .setClass('tag')
            .on('click', () => this.deleteTag(tag, eTag));
        return eTag;
    }
    deleteTag(tag, eTag) {
        this.vTags.delete(tag);
        eTag.remove();
    }
    addTag(tag, event) {
        if (this.vTags.has(tag))
            return;
        if (this.vLimit !== -1 && this.vTags.size >= this.vLimit)
            return this.emit('limit', tag, event);
        if (tag.length < 1 || !this.vValidator(tag))
            return this.emit('invalid', tag, event);
        this.vTags.add(tag);
        const eNewTag = this.newTag(tag);
        this.eContainer.append(eNewTag);
        if (this.cInput instanceof TextInput)
            this.cInput.clear();
        this.emit('add', tag, event);
        return eNewTag;
    }
    getTags() {
        return [...this.vTags];
    }
}
export default MultiTagInput;
//# sourceMappingURL=MultiTagInput.js.map