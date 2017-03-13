import { escapeRegExp as escapeRe } from 'lodash';
import filterNodeCollectionByText from '../../../driver/command-executors/client-functions/selector-executor/filter-by-text';
import { FILTER_OPTIONS_TYPES } from '../selector-object';

export function getAttributeRegExpFilter ({ attrName, attrValueRe }) {
    return elements => {
        var res = [];

        for (var el of elements) {
            var attributes = el.attributes;
            var attr       = null;

            for (var i = 0; i < attributes.length; i++) {
                attr = attributes[i];

                if (attrName === attr.nodeName && (!attrValueRe || attrValueRe.test(attr.nodeValue)))
                    res.push(el);
            }
        }

        return res;
    };
}

export function getTagTreeFilter (filterOptions) {
    return elements => {
        var resElements = elements;

        for (var filterOption of filterOptions) {
            if (filterOption.type === FILTER_OPTIONS_TYPES.tag)
                resElements = resElements[0].querySelectorAll(filterOption.value);
            else if (filterOption.type === FILTER_OPTIONS_TYPES.index)
                resElements = [resElements[filterOption.value]];
        }

        return resElements;
    };
}

export function getTextFilter (text) {
    return elements => filterNodeCollectionByText(elements, new RegExp(escapeRe(text)));
}
