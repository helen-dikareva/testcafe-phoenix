import hammerhead from '../../deps/hammerhead';
import testCafeCore from '../../deps/testcafe-core';
import { FilterOption, SelectorObject, FILTER_OPTIONS_TYPES } from '../selector-object';
import { escapeAttrValue, escapeSpecifiedSymbols, escapeValueForSelectorWithRegExp } from './escape-utils';
import { getAttributeRegExpFilter } from './filters';


const ASP_AUTOGENERATED_ID_PART_RE = /_ctl\d+|ctl\d+_|^ctl\d+$/g;

const ELEMENTS_WITH_TEXT_RE       = /^i$|^b$|^big$|^small$|^em$|^strong$|^dfn$|^code$|^samp$|^kbd$|^var$|^cite$|^abbr$|^acronym$|^sub$|^sup$|span$|^bdo$|^address$|^div$|^a$|^object$|^p$|^h\d$|^pre$|^q$|^ins$|^del$|^dt$|^dd$|^li$|^label$|^option$|^textarea$|^fieldset$|^legend$|^button$|^caption$|^td$|^th$|^title$/;
const ALLOWED_TEXT_SYMBOL_RE      = '[a-z0-9а-я \xC0-\xFF]+'; //\xC0-\xFF - latin letters;
const PROHIBITED_TEXT_SYMBOL_RE   = '[^a-z0-9а-я \xC0-\xFF]+';
const MAX_TEXT_LENGTH_IN_SELECTOR = 50;

const ALLOWED_ATTRIBUTE_NAMES_RE = /(^alt$|^name$|^class$|^title$|^data-\S+)/;
const ASP_AUTOGENERATED_ATTR_RE  = /\$ctl\d+|ctl\d+\$|_ctl\d+|ctl\d+_|^ctl\d+$/g;
const SEPARATOR_CONST            = '!!!!!separator!!!!!';
const ANY_NUMBER_CONST           = '!!!!!anyNumber!!!!!';
const SEPARATOR_RE               = new RegExp(SEPARATOR_CONST, 'g');
const ANY_NUMBER_RE              = new RegExp(ANY_NUMBER_CONST, 'g');
const SOME_SPACES_RE             = /\s{2,}/g;


var trim       = hammerhead.utils.trim;
var domUtils   = testCafeCore.domUtils;
var arrayUtils = testCafeCore.arrayUtils;

//ByIdRule
export function getIdSelector (el, idAttr) {
    if (ASP_AUTOGENERATED_ID_PART_RE.test(idAttr)) {
        var idRegExp = escapeValueForSelectorWithRegExp(idAttr);

        idRegExp = idRegExp.replace(ASP_AUTOGENERATED_ID_PART_RE, substr => substr.replace(/\d+/, '\\d+'));

        var tagName     = domUtils.getTagName(el);
        var filterValue = { attrName: 'id', attrValueRe: new RegExp(idRegExp) };

        return getRegExpAttributeSelector(el, tagName, filterValue);
    }

    return new SelectorObject({ element: el, selector: '#' + escapeSpecifiedSymbols(idAttr) });
}


//ByTextRule
function getTextPart (text) {
    var startMatch = new RegExp(ALLOWED_TEXT_SYMBOL_RE, 'i').exec(text);

    if (!startMatch)
        return '';

    text = text.substring(startMatch.index, text.length);

    var endMatch = new RegExp(PROHIBITED_TEXT_SYMBOL_RE, 'i').exec(text);
    var endIndex = endMatch ? endMatch.index : text.length;

    return trim(text.substring(0, Math.min(endIndex, MAX_TEXT_LENGTH_IN_SELECTOR)));
}

export function hasOwnTextForSelector (el, elementText) {
    if (!ELEMENTS_WITH_TEXT_RE.test(domUtils.getTagName(el)))
        return '';

    elementText = trim(elementText.replace(/\s+/g, ' '));

    return /\S/.test(elementText);
}

export function getOwnTextForSelector (el) {
    var textForSelector = '';
    var node            = null;
    var text            = '';

    for (var i = 0; i < el.childNodes.length; i++) {
        node = el.childNodes[i];

        if (domUtils.isTextNode(node) && node.data) {
            text = getTextPart(node.data);

            if (text.length > textForSelector.length)
                textForSelector = text;
        }
    }

    return textForSelector;
}


//ByAttrRule
function isAttributeAcceptableForSelector (attribute) {
    if (!attribute.value)
        return false;

    // NOTE: we don't take into account attributes added by TestCafe
    return ALLOWED_ATTRIBUTE_NAMES_RE.test(attribute.name) && !domUtils.isHammerheadAttr(attribute.name);
}

function getRegExpAttributeSelector (el, selector, filterRegExpValue, ancestorSelector) {
    return new SelectorObject({
        element:          el,
        ancestorSelector: ancestorSelector,
        selector:         selector,
        filterOptions:    new FilterOption(FILTER_OPTIONS_TYPES.attr, filterRegExpValue),
        filter:           getAttributeRegExpFilter(filterRegExpValue)
    });
}

export function getAttributeNamesForSelector (element) {
    var attributesForSelector = [];
    var attributes            = element.attributes;
    var attribute             = null;

    for (var i = 0; i < attributes.length; i++) {
        attribute = { name: attributes[i].nodeName, value: attributes[i].nodeValue };

        if (isAttributeAcceptableForSelector(attribute))
            attributesForSelector.push(attribute);
    }

    return attributesForSelector;
}

export function getAttributesSelector (el, attributes, ancestorSelector) {
    var tagName         = domUtils.getTagName(el);
    var selector        = '';
    var attrRegExpValue = '';

    attributes.forEach(({ name, value }) => {
        var valueWasCut        = false;
        var selectorWithRegExp = false;

        if (value.replace(SOME_SPACES_RE, ' ').length > MAX_TEXT_LENGTH_IN_SELECTOR) {
            value       = value.substr(0, MAX_TEXT_LENGTH_IN_SELECTOR);
            valueWasCut = true;
        }

        if (ASP_AUTOGENERATED_ATTR_RE.test(value)) {
            selectorWithRegExp = true;

            value = value.replace(ASP_AUTOGENERATED_ATTR_RE, substr => substr.replace(/\d+/, ANY_NUMBER_CONST));
        }

        if (SOME_SPACES_RE.test(value)) {
            selectorWithRegExp = true;

            value = value.replace(SOME_SPACES_RE, SEPARATOR_CONST);
        }

        if (!selectorWithRegExp) {
            if (name === 'class') {
                value = escapeSpecifiedSymbols(value);
                selector += `.${value.replace(/ +/g, '.')}`;
            }
            else {
                value = escapeAttrValue(value);
                selector += `[${name}${valueWasCut ? `^` : ``}="${value}"]`;
            }
        }
        else if (!attrRegExpValue) {
            value = escapeValueForSelectorWithRegExp(value);
            value = value.replace(ANY_NUMBER_RE, '\\d+').replace(SEPARATOR_RE, '\\s+');

            attrRegExpValue = { attrName: name, attrValueRe: new RegExp(value) };
        }
    });

    if (attrRegExpValue)
        return getRegExpAttributeSelector(el, selector || tagName, attrRegExpValue, ancestorSelector);

    return new SelectorObject({ element: el, ancestorSelector, selector });
}


//ByTagTreeRule
var getNthFilterOptions = function (el) {
    var parent = el.parentElement;
    var index  = domUtils.getElementIndexInParent(parent, el);

    var tagFilterOption   = new FilterOption(FILTER_OPTIONS_TYPES.tag, domUtils.getTagName(el));
    var indexFilterOption = new FilterOption(FILTER_OPTIONS_TYPES.index, index);

    return [tagFilterOption, indexFilterOption];
};

export function getTagTreeFilterOptions (element, lastAncestor) {
    var parents       = domUtils.getParentsUntil(element, lastAncestor);
    var filterOptions = arrayUtils.reverse(getNthFilterOptions(element));

    parents.forEach(parent => {
        var [tagOption, indexOption] = getNthFilterOptions(parent);

        filterOptions.push(indexOption);
        filterOptions.push(tagOption);
    });

    return arrayUtils.reverse(filterOptions);
}


//CompositeRule
export function getAncestorWithId (el) {
    var parent = el.parentElement;

    if (!parent)
        return null;

    return domUtils.closest(parent, '[id]');
}

export function getAncestorByRule (el, ancestorRule) {
    var body    = domUtils.findDocument(el).body;
    var parents = domUtils.getParentsUntil(el, body);

    for (var parent of parents) {
        ancestorRule._init(parent);

        if (ancestorRule._shouldGenerate(parent))
            return parent;
    }

    return null;
}

