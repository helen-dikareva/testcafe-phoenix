import { domUtils } from '../../../deps/testcafe-core';
import { getInnerText, getTextContent } from './sandboxed-node-properties';

function hasText (node, textRe) {
    // Element
    if (node.nodeType === 1) {
        var text = getInnerText(node);

        // NOTE: In Firefox, <option> elements don't have `innerText`.
        // So, we fallback to `textContent` in that case (see GH-861).
        if (domUtils.isOptionElement(node)) {
            var textContent = getTextContent(node);

            if (!text && textContent)
                text = textContent;
        }

        return textRe.test(text);
    }

    // Document
    if (node.nodeType === 9) {
        // NOTE: latest version of Edge doesn't have `innerText` for `document`,
        // `html` and `body`. So we check their children instead.
        var head = node.querySelector('head');
        var body = node.querySelector('body');

        return hasChildrenWithText(head, textRe) || hasChildrenWithText(body, textRe);
    }

    // DocumentFragment
    if (node.nodeType === 11)
        return hasChildrenWithText(node, textRe);

    return textRe.test(getTextContent(node));
}

function hasChildrenWithText (node, textRe) {
    var cnCount = node.childNodes.length;

    for (var i = 0; i < cnCount; i++) {
        if (hasText(node.childNodes[i], textRe))
            return true;
    }

    return false;
}

export default function filterNodeCollectionByText (collection, textRe) {
    var count    = collection.length;
    var filtered = [];

    for (var i = 0; i < count; i++) {
        if (hasText(collection[i], textRe))
            filtered.push(collection[i]);
    }

    return filtered;
}
