import testCafeCore from '../../deps/testcafe-core';
import RULE_TYPE from './type';
import { RULE_PRIORITY } from './priority';
import { FILTER_OPTIONS_TYPES, FilterOption, SelectorObject } from '../selector-object';
import {
    hasOwnTextForSelector,
    getOwnTextForSelector,
    getTagTreeFilterOptions,
    getAttributeNamesForSelector,
    getAttributesSelector,
    getIdSelector,
    getAncestorWithId,
    getAncestorByRule
} from './utils';
import { getTagTreeFilter, getTextFilter } from './filters';

var domUtils = testCafeCore.domUtils;

const TAG_NAME_SELECTOR_ELEMENTS_RE = /html|body/;


class BaseRule {
    constructor (type) {
        this.type     = type;
        this.priority = RULE_PRIORITY[type];
    }

    _init () {
        //Not implemented
    }

    _shouldGenerate () {
        //Not implemented
    }

    _getSelector () {
        //Not implemented
    }

    generateSelector (el) {
        this._init(el);

        if (this._shouldGenerate(el))
            return this._getSelector(el);

        return null;
    }
}

class CompositeRule extends BaseRule {
    constructor (type, AncestorRuleType) {
        super(type);

        this.ancestorRule     = AncestorRuleType ? new AncestorRuleType() : null;
        this.ancestor         = null;
        this.ancestorSelector = null;
    }

    _generateAncestorSelector () {
        //Not implemented
    }

    generateSelector (el) {
        this._init(el);

        if (this._shouldGenerate(el)) {
            this._generateAncestorSelector(el);

            if (this.ancestorSelector)
                return this._getSelector(el);
        }

        return null;
    }
}

class ByTagRule extends BaseRule {
    constructor () {
        super(RULE_TYPE.byTag);

        this.tagName = null;
    }

    _init (el) {
        this.tagName = domUtils.getTagName(el);
    }

    _shouldGenerate () {
        return TAG_NAME_SELECTOR_ELEMENTS_RE.test(this.tagName);
    }

    _getSelector (el) {
        return new SelectorObject({ element: el, selector: this.tagName });
    }
}

class ByIdRule extends BaseRule {
    constructor () {
        super(RULE_TYPE.byId);

        this.idAttr = null;
    }

    _init (el) {
        this.idAttr = el.getAttribute('id');
    }

    _shouldGenerate () {
        return !!this.idAttr;
    }

    _getSelector (el) {
        return getIdSelector(el, this.idAttr);
    }
}

class ByTextRule extends BaseRule {
    constructor () {
        super(RULE_TYPE.byText);

        this.text = null;
    }

    _init (el) {
        this.text = getOwnTextForSelector(el);
    }

    _shouldGenerate (el) {
        return hasOwnTextForSelector(el, this.text);
    }

    _getSelector (el) {
        return new SelectorObject({
            element:       el,
            selector:      domUtils.getTagName(el),
            filterOptions: new FilterOption(FILTER_OPTIONS_TYPES.text, this.text),
            filter:        getTextFilter(this.text)
        });
    }
}

class ByAttrRule extends BaseRule {
    constructor () {
        super(RULE_TYPE.byAttr);

        this.attributes = null;
    }

    _init (el) {
        this.attributes = getAttributeNamesForSelector(el);
    }

    _shouldGenerate () {
        return !!this.attributes.length;
    }

    _getSelector (el) {
        return getAttributesSelector(el, this.attributes);
    }
}

class ByTagTreeRule extends BaseRule {
    constructor () {
        super(RULE_TYPE.byTagTree);
    }

    _shouldGenerate (el) {
        return !TAG_NAME_SELECTOR_ELEMENTS_RE.test(domUtils.getTagName(el));
    }

    _getSelector (el) {
        var body          = domUtils.findDocument(el).body;
        var filterOptions = getTagTreeFilterOptions(el, body);

        return new SelectorObject({
            element:       el,
            selector:      'body',
            filterOptions: filterOptions,
            filter:        getTagTreeFilter(filterOptions)
        });
    }
}

class ByFormAndInputRule extends CompositeRule {
    constructor () {
        super(RULE_TYPE.byFormAndInput);

        this.nameAttr = null;
    }

    _init (el) {
        this.ancestor = domUtils.closest(el, 'form');
        this.nameAttr = el.getAttribute('name');
    }

    _shouldGenerate (el) {
        return domUtils.isInputElement(el) && !!this.nameAttr && this.ancestor;
    }

    _generateAncestorSelector () {
        var byIdRule   = new ByIdRule();
        var byAttrRule = new ByAttrRule();

        this.ancestorSelector = byIdRule.generateSelector(this.ancestor) || byAttrRule.generateSelector(this.ancestor);
    }

    _getSelector (el) {
        var attributes = [{ name: 'name', value: this.nameAttr }];

        return getAttributesSelector(el, attributes, this.ancestorSelector);
    }
}

class ByAncestorIdAndTextRule extends CompositeRule {
    constructor () {
        super(RULE_TYPE.byIdAndText, ByIdRule);

        this.text = null;
    }

    _init (el) {
        this.ancestor = getAncestorWithId(el);
        this.text     = getOwnTextForSelector(el);
    }

    _shouldGenerate (el) {
        return hasOwnTextForSelector(el, this.text) && this.ancestor;
    }

    _generateAncestorSelector () {
        this.ancestorSelector = this.ancestorRule.generateSelector(this.ancestor);
    }

    _getSelector (el) {
        return new SelectorObject({
            element:          el,
            ancestorSelector: this.ancestorSelector,
            selector:         domUtils.getTagName(el),
            filterOptions:    new FilterOption(FILTER_OPTIONS_TYPES.text, this.text),
            filter:           getTextFilter(this.text)
        });
    }
}

class ByAncestorIdAndAttrRule extends CompositeRule {
    constructor () {
        super(RULE_TYPE.byIdAndAttr, ByIdRule);

        this.attributes = null;
    }

    _init (el) {
        this.ancestor   = getAncestorWithId(el);
        this.attributes = getAttributeNamesForSelector(el);
    }

    _shouldGenerate () {
        return !!this.attributes.length && this.ancestor;
    }

    _generateAncestorSelector () {
        this.ancestorSelector = this.ancestorRule.generateSelector(this.ancestor);
    }

    _getSelector (el) {
        return getAttributesSelector(el, this.attributes, this.ancestorSelector);
    }
}

class ByAncestorIdAndTagTreeRule extends CompositeRule {
    constructor () {
        super(RULE_TYPE.byIdAndTagTree, ByIdRule);
    }

    _init (el) {
        this.ancestor = getAncestorWithId(el);
    }

    _shouldGenerate () {
        return !!this.ancestor;
    }

    _generateAncestorSelector () {
        this.ancestorSelector = this.ancestorRule.generateSelector(this.ancestor);
    }

    _getSelector (el) {
        var filterOptions = getTagTreeFilterOptions(el, this.ancestor);

        return new SelectorObject({
            element:          el,
            ancestorSelector: this.ancestorSelector,
            filterOptions:    filterOptions,
            filter:           getTagTreeFilter(filterOptions)
        });
    }
}

class ByAncestorAttrAndTagTreeRule extends CompositeRule {
    constructor () {
        super(RULE_TYPE.byAttrAndTagTree, ByAttrRule);
    }

    _init (el) {
        this.ancestor = getAncestorByRule(el, this.ancestorRule);
    }

    _shouldGenerate (el) {
        return !TAG_NAME_SELECTOR_ELEMENTS_RE.test(domUtils.getTagName(el)) && this.ancestor;
    }

    _generateAncestorSelector () {
        this.ancestorSelector = this.ancestorRule.generateSelector(this.ancestor);
    }

    _getSelector (el) {
        var filterOptions = getTagTreeFilterOptions(el, this.ancestorSelector.element);

        return new SelectorObject({
            element:          el,
            ancestorSelector: this.ancestorSelector,
            filterOptions:    filterOptions,
            filter:           getTagTreeFilter(filterOptions)
        });
    }
}

class ByAncestorTextAndTagTreeRule extends CompositeRule {
    constructor () {
        super(RULE_TYPE.byTextAndTagTree, ByTextRule);
    }

    _init (el) {
        this.ancestor = getAncestorByRule(el, this.ancestorRule);
    }

    _shouldGenerate (el) {
        return !TAG_NAME_SELECTOR_ELEMENTS_RE.test(domUtils.getTagName(el)) && this.ancestor;
    }

    _generateAncestorSelector () {
        this.ancestorSelector = this.ancestorRule.generateSelector(this.ancestor);
    }

    _getSelector (el) {
        var filterOptions = getTagTreeFilterOptions(el, this.ancestorSelector.element);

        return new SelectorObject({
            element:          el,
            ancestorSelector: this.ancestorSelector,
            filterOptions:    filterOptions,
            filter:           getTagTreeFilter(filterOptions)
        });
    }
}

export default {
    byTagRule:                    new ByTagRule(),
    byIdRule:                     new ByIdRule(),
    byTextRule:                   new ByTextRule(),
    byAttrRule:                   new ByAttrRule(),
    byTagTreeRule:                new ByTagTreeRule(),
    byFormAndInputRule:           new ByFormAndInputRule(),
    byAncestorIdAndTextRule:      new ByAncestorIdAndTextRule(),
    byAncestorIdAndAttrRule:      new ByAncestorIdAndAttrRule(),
    byAncestorIdAndTagTreeRule:   new ByAncestorIdAndTagTreeRule(),
    byAncestorAttrAndTagTreeRule: new ByAncestorAttrAndTagTreeRule(),
    byAncestorTextAndTagTreeRule: new ByAncestorTextAndTagTreeRule()
};
