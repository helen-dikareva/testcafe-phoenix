import { findIndex, sortBy } from 'lodash';
import testCafeCore from '../deps/testcafe-core';
import rules from './rules';
import { FILTER_OPTIONS_TYPES } from './selector-object';
import { SELECTOR_INDEX_INDENT, calculateSelectorPriority } from './rules/priority';

var domUtils   = testCafeCore.domUtils;
var arrayUtils = testCafeCore.arrayUtils;

export default class SelectorGenerator {
    constructor () {
        this.rules = [
            rules.byTagRule,
            rules.byFormAndInputRule,
            rules.byIdRule,
            rules.byTextRule,
            rules.byAttrRule,
            rules.byAncestorIdAndTextRule,
            rules.byAncestorIdAndAttrRule,
            rules.byAncestorIdAndTagTreeRule,
            rules.byAncestorAttrAndTagTreeRule,
            rules.byAncestorTextAndTagTreeRule,
            rules.byTagTreeRule
        ];

        this.selectorObjects = [];
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

    static _getElementsBySelector (baseElement, { element, selector, filter }) {
        var elements = selector ? arrayUtils.toArray(baseElement.querySelectorAll(selector)) : [baseElement];

        elements = elements.length && filter ? filter(elements) : elements;

        var elementIndex = elements.indexOf(element);

        if (elements.length === 0 || elementIndex === -1)
            return [];

        return elements;
    }

    static _makeSelectorUnique (selectorObject, elements) {
        var elementIndex = elements.indexOf(selectorObject.element);

        if (elements.length !== 1 && elementIndex !== 0) {
            selectorObject.filterOptions.push({
                type:  FILTER_OPTIONS_TYPES.index,
                value: elementIndex
            });
        }
    }

    _addSelectorObject (selectorObject, priority) {
        var selectorString    = SelectorGenerator._selectorObjectToString(selectorObject);
        var selector          = { selectorString, priority };
        var prevSelectorIndex = findIndex(this.selectorObjects, { selectorString });

        if (prevSelectorIndex !== -1 && this.selectorObjects[prevSelectorIndex].priority > priority)
            this.selectorObjects[prevSelectorIndex] = selector;
        else
            this.selectorObjects.push(selector);
    }

    generate (el) {
        if (!el || !domUtils.isDomElement(el))
            return '';

        this.selectorObjects = [];

        for (var rule of this.rules) {
            var selectorObject = rule.generateSelector(el);

            if (selectorObject) {
                var document        = domUtils.findDocument(el);
                var ancestorElement = document;
                var elements        = null;

                if (selectorObject.ancestorSelector) {
                    elements = SelectorGenerator._getElementsBySelector(document, selectorObject.ancestorSelector);

                    if (!elements.length)
                        continue;

                    SelectorGenerator._makeSelectorUnique(selectorObject.ancestorSelector, elements);

                    ancestorElement = selectorObject.ancestorSelector.element;
                }

                elements = SelectorGenerator._getElementsBySelector(ancestorElement, selectorObject);

                if (!elements.length)
                    continue;

                SelectorGenerator._makeSelectorUnique(selectorObject, elements);

                if (elements.length === 1 && rule.priority < SELECTOR_INDEX_INDENT)
                    return SelectorGenerator._selectorObjectToString(selectorObject);

                this._addSelectorObject(selectorObject, calculateSelectorPriority(rule, elements));
            }
        }

        this.selectorObjects = sortBy(this.selectorObjects, 'priority');

        return this.selectorObjects[0].selectorString;
    }
}
