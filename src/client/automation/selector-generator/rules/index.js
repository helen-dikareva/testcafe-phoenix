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
    getIdSelector
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

    generate (el, ancestorSelector) {
        this._init(el);

        if (this._shouldGenerate(el))
            return this._getSelector(el, ancestorSelector);

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
        return new SelectorObject({ ruleType: this.type, element: el, selector: this.tagName });
    }
}

class ByNameAttr extends BaseRule {
    constructor () {
        super(RULE_TYPE.byNameAttr);

        this.nameAttr = null;
    }

    _init (el) {
        this.nameAttr = el.getAttribute('name');
    }

    _shouldGenerate (el) {
        return domUtils.isInputElement(el) && !!this.nameAttr;
    }

    _getSelector (el) {
        var attributes = [{ name: 'name', value: this.nameAttr }];

        return getAttributesSelector(this.type, el, attributes);
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
            ruleType:      this.type,
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
        return getAttributesSelector(this.type, el, this.attributes);
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
            ruleType:      this.type,
            element:       el,
            selector:      'body',
            filterOptions: filterOptions,
            filter:        getTagTreeFilter(filterOptions)
        });
    }
}

class ByFormRule extends BaseRule {
    constructor () {
        super(RULE_TYPE.byForm);
    }

    _shouldGenerate (el) {
        return domUtils.isFormElement(el);
    }

    _getSelector (el) {
        return rules.byIdRule.generate(el) || rules.byAttrRule.generate(el);
    }
}

class ByAncestorAndTagTreeRule extends BaseRule {
    constructor () {
        super(RULE_TYPE.byAncestorAndTagTree);
    }

    _shouldGenerate (el) {
        return !TAG_NAME_SELECTOR_ELEMENTS_RE.test(domUtils.getTagName(el));
    }

    _getSelector (el, ancestorSelector) {
        var filterOptions = getTagTreeFilterOptions(el, ancestorSelector.element);

        return new SelectorObject({
            ruleType:         this.type,
            element:          el,
            ancestorSelector: ancestorSelector,
            filterOptions:    filterOptions,
            filter:           getTagTreeFilter(filterOptions)
        });
    }
}


var rules = {
    byTagRule:                new ByTagRule(),
    byNameAttr:               new ByNameAttr(),
    byIdRule:                 new ByIdRule(),
    byTextRule:               new ByTextRule(),
    byAttrRule:               new ByAttrRule(),
    byTagTreeRule:            new ByTagTreeRule(),
    byFormRule:               new ByFormRule(),
    byAncestorAndTagTreeRule: new ByAncestorAndTagTreeRule()
    /*byFormAndInputRule:           new ByFormAndInputRule(),
    byAncestorIdAndTextRule:      new ByAncestorIdAndTextRule(),
    byAncestorIdAndAttrRule:      new ByAncestorIdAndAttrRule(),
    byAncestorIdAndTagTreeRule:   new ByAncestorIdAndTagTreeRule(),
    byAncestorAttrAndTagTreeRule: new ByAncestorAttrAndTagTreeRule(),
    byAncestorTextAndTagTreeRule: new ByAncestorTextAndTagTreeRule()*/
};

export default rules;
