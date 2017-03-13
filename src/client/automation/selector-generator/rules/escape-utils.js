export function escapeAttrValue (text) {
    return text.replace(/'|"|\\/g, '\\$&');
}

export function escapeSpecifiedSymbols (text) {
    return text.replace(/(\!|#|"|'|\\|\$|%|&|\(|\||\)|\*|\+|,|\.|\/|:|;|<|=|>|\?|@|\[|\]|\^|`|{|\||}|~)/g, '\\$&');
}

export function escapeValueForSelectorWithRegExp (text) {
    return text
        .replace(/'|"|\\|\||\-|\*|\?|\+|\^|\$|\[|\]/g, '\\$&')
        .replace(/\(|\)/g, '\\S');
}
