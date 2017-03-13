export const FILTER_OPTIONS_TYPES = {
    text:  'text',
    index: 'index',
    tag:   'tag',
    attr:  'attr'
};

export class FilterOption {
    constructor (type, value) {
        this.type  = type;
        this.value = value;
    }
}

export class SelectorObject {
    constructor (obj) {
        this.element          = obj.element;
        this.ancestorSelector = obj.ancestorSelector;
        this.selector         = obj.selector;
        this.filterOptions    = [].concat(obj.filterOptions || []);
        this.filter           = obj.filter;
    }
}
