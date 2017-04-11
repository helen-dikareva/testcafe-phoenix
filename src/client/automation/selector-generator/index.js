import { find, findIndex, sortBy } from 'lodash';
import testCafeCore from '../deps/testcafe-core';
import rules from './rules';
import RULE_TYPE from './rules/type';
import { FILTER_OPTIONS_TYPES, FilterOption, SelectorObject } from './selector-object';
import {
    SELECTOR_INDEX_INDENT,
    calculateSelectorPriority,
    calculateRulesPriority
} from './rules/priority';
import { getAncestorByRule, isSimpleElementRule } from './rules/utils';

var domUtils   = testCafeCore.domUtils;
var arrayUtils = testCafeCore.arrayUtils;

const ELEMENT_RULES = [
    rules.byTagRule,
    rules.byNameAttr,
    rules.byIdRule,
    rules.byTextRule,
    rules.byAttrRule
];

const ANCESTOR_RULES = [rules.byIdRule, rules.byAttrRule, rules.byTextRule];

export default class SelectorGenerator {
    constructor () {
        this.selectorObjects              = [];
        this.simpleElementSelectorObjects = [];
        this.resultSelectorObject         = null;
    }

    static _filterOptionsToString (filterOptions = []) {
        var string = '';

        for (var option of filterOptions) {
            if (option.type === FILTER_OPTIONS_TYPES.text)
                string += `.withText('${option.value}')`;
            else if (option.type === FILTER_OPTIONS_TYPES.index)
                string += `.nth(${option.value})`;
            else if (option.type === FILTER_OPTIONS_TYPES.tag)
                string += `.find('${option.value}')`;
            else if (option.type === FILTER_OPTIONS_TYPES.attr) {
                var attrValueString = option.value.attrValueRe ? `, ${option.value.attrValueRe}` : ``;

                string += `.withAttr('${option.value.attrName}'${attrValueString})`;
            }
        }

        return string;
    }

    static _selectorObjectToString (selectorObject) {
        var string = '';

        if (selectorObject.ancestorSelector) {
            string = SelectorGenerator._selectorObjectToString(selectorObject.ancestorSelector);

            if (selectorObject.selector)
                string += `.find('${selectorObject.selector}')`;
        }
        else
            string = `Selector('${selectorObject.selector}')`;

        return string + SelectorGenerator._filterOptionsToString(selectorObject.filterOptions);
    }

    static _getElementsBySelector ({ element, selector, filter }, baseElement) {
        baseElement = baseElement || domUtils.findDocument(element);

        var elements = selector ? arrayUtils.toArray(baseElement.querySelectorAll(selector)) : [baseElement];

        elements = elements.length && filter ? filter(elements) : elements;

        var elementIndex = elements.indexOf(element);

        if (elements.length === 0 || elementIndex === -1)
            return [];

        return elements;
    }

    static _makeSelectorUnique (selectorObject, elements) {
        var elementIndex = elements.indexOf(selectorObject.element);

        if (elements.length !== 1 && elementIndex !== 0)
            selectorObject.filterOptions.push(new FilterOption(FILTER_OPTIONS_TYPES.index, elementIndex));
    }

    static _getAncestorSelector (el, ancestorRule) {
        var ancestor         = getAncestorByRule(el, ancestorRule);
        var ancestorSelector = ancestor ? ancestorRule.generate(ancestor) : null;
        var elements         = ancestorSelector ? SelectorGenerator._getElementsBySelector(ancestorSelector) : [];

        if (!elements.length)
            return null;

        SelectorGenerator._makeSelectorUnique(ancestorSelector, elements);

        return ancestorSelector;
    }

    _storeSelectorObject (selectorObject, elements) {
        if (!selectorObject.ancestorSelector && isSimpleElementRule(selectorObject.ruleType))
            this.simpleElementSelectorObjects.push(selectorObject);

        //TODO
        var selectorObjectCopy = new SelectorObject(selectorObject);

        SelectorGenerator._makeSelectorUnique(selectorObjectCopy, elements);

        this.selectorObjects.push({
            selectorString: SelectorGenerator._selectorObjectToString(selectorObjectCopy),
            priority:       calculateSelectorPriority(selectorObject, elements)
        });
    }

    checkSelectorObject (selectorObject) {
        var ancestor = selectorObject.ancestorSelector ? selectorObject.ancestorSelector.element : null;
        var elements = SelectorGenerator._getElementsBySelector(selectorObject, ancestor);

        if (!elements.length)
            return;

        var rulesPriority = calculateRulesPriority(selectorObject);

        if (elements.length === 1 && rulesPriority < SELECTOR_INDEX_INDENT) {
            this.resultSelectorObject = selectorObject;
            return;
        }

        this._storeSelectorObject(selectorObject, elements);
    }

    generateByAncestor (el, ancestorRules, elementSelectorObjects) {
        for (var ancestorRule of ancestorRules) {
            var ancestorSelectorObject = SelectorGenerator._getAncestorSelector(el, ancestorRule);

            if (!ancestorSelectorObject)
                continue;

            for (var elementSelectorObject of elementSelectorObjects) {
                //TODO
                var selectorObject = new SelectorObject(elementSelectorObject);

                selectorObject.ancestorSelector = ancestorSelectorObject;

                this.checkSelectorObject(selectorObject);

                if (this.resultSelectorObject)
                    break;
            }

            if (this.resultSelectorObject)
                break;

            this.generateByRules(el, rules.byAncestorAndTagTreeRule, ancestorSelectorObject);
        }
    }

    generateByFormAncestor (el) {
        var selectorByNameObject = find(this.simpleElementSelectorObjects, { ruleType: RULE_TYPE.byNameAttr });

        if (selectorByNameObject)
            this.generateByAncestor(el, [rules.byFormRule], [selectorByNameObject]);
    }

    generateByRules (el, rules, ancestorSelector) {
        var selectorRules = [].concat(rules);

        for (var rule of selectorRules) {
            var selectorObject = rule.generate(el, ancestorSelector);

            if (selectorObject) {
                this.checkSelectorObject(selectorObject);

                if (this.resultSelectorObject)
                    break;
            }
        }
    }

    generate (el) {
        if (!el || !domUtils.isDomElement(el))
            return '';

        this.selectorObjects              = [];
        this.simpleElementSelectorObjects = [];
        this.resultSelectorObject         = null;

        this.generateByRules(el, ELEMENT_RULES);

        if (!this.resultSelectorObject)
            this.generateByFormAncestor(el);

        if (!this.resultSelectorObject)
            this.generateByAncestor(el, ANCESTOR_RULES, this.simpleElementSelectorObjects);

        if (!this.resultSelectorObject)
            this.generateByRules(el, rules.byTagTreeRule);

        if (this.resultSelectorObject)
            return SelectorGenerator._selectorObjectToString(this.resultSelectorObject);

        return sortBy(this.selectorObjects, 'priority')[0].selectorString;
    }
}
