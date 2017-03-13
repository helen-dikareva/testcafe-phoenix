import RULE_TYPE from './type';

export const SELECTOR_INDEX_INDENT               = 100;
const ANCESTOR_AND_TAGS_TREE_RULE_VALIDITY_BOUND = 10;
const TAGS_TREE_RULE_VALIDITY_BOUND              = 20;

export var RULE_PRIORITY = {
    [RULE_TYPE.byTag]:     1,
    [RULE_TYPE.byId]:      2,
    [RULE_TYPE.byText]:    4,
    [RULE_TYPE.byAttr]:    6,
    [RULE_TYPE.byTagTree]: SELECTOR_INDEX_INDENT * TAGS_TREE_RULE_VALIDITY_BOUND,


    [RULE_TYPE.byFormAndInput]:   3,
    [RULE_TYPE.byIdAndText]:      5,
    [RULE_TYPE.byIdAndAttr]:      7,
    [RULE_TYPE.byIdAndTagTree]:   SELECTOR_INDEX_INDENT * ANCESTOR_AND_TAGS_TREE_RULE_VALIDITY_BOUND,
    [RULE_TYPE.byAttrAndTagTree]: SELECTOR_INDEX_INDENT * ANCESTOR_AND_TAGS_TREE_RULE_VALIDITY_BOUND + 1,
    [RULE_TYPE.byTextAndTagTree]: SELECTOR_INDEX_INDENT * ANCESTOR_AND_TAGS_TREE_RULE_VALIDITY_BOUND + 2
};

export function calculateSelectorPriority (rule, elements) {
    return rule.priority + SELECTOR_INDEX_INDENT * elements.length;
}
