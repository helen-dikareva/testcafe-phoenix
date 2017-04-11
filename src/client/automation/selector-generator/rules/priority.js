import RULE_TYPE from './type';

export const SELECTOR_INDEX_INDENT               = 100;
const ANCESTOR_AND_TAGS_TREE_RULE_VALIDITY_BOUND = 10;
const TAGS_TREE_RULE_VALIDITY_BOUND              = 20;

export var RULE_PRIORITY = {
    [RULE_TYPE.byTag]:      1,
    [RULE_TYPE.byId]:       2,
    [RULE_TYPE.byNameAttr]: 3,
    [RULE_TYPE.byAttr]:     5,
    [RULE_TYPE.byText]:     7,


    [RULE_TYPE.byForm]:               1,
    [RULE_TYPE.byAncestorAndTagTree]: SELECTOR_INDEX_INDENT * ANCESTOR_AND_TAGS_TREE_RULE_VALIDITY_BOUND,
    [RULE_TYPE.byTagTree]:            SELECTOR_INDEX_INDENT * TAGS_TREE_RULE_VALIDITY_BOUND
};

export function calculateRulesPriority (selectorObject) {
    var ancestorRulePriority = selectorObject.ancestorSelector ? RULE_PRIORITY[selectorObject.ancestorSelector.ruleType] : 0;

    return RULE_PRIORITY[selectorObject.ruleType] + ancestorRulePriority;
}
export function calculateSelectorPriority (selectorObject, elements) {
    return calculateRulesPriority(selectorObject) + SELECTOR_INDEX_INDENT * elements.length;
}
