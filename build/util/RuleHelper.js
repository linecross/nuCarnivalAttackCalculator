import { Rule } from '../CardRule.js';
import { RuleType } from '../Constants.js';
import { Util } from './Util.js';
export class RuleHelper {
    static hasCounterAttack(rules) {
        return rules.filter(e => e.isCounterAttack).length > 0;
    }
    static hasTriggerAttack(rules) {
        return rules.filter(e => e.isTriggerSkill()).length > 0;
    }
    static isRuleExceedMaxCount(rule, rules) {
        if (rule.turn == Rule.ALWAYS_EFFECTIVE || rule.maxCount != null) {
            var currentCount = rules.filter(r => r.id == rule.id).length;
            if (currentCount < rule.getMaxCount()) {
                return false;
            }
        }
        else {
            return false;
        }
        return true;
    }
    static getShieldRules(rules) {
        return rules.filter(e => e.type == RuleType.shieldState);
    }
    static hasShield(rules) {
        return rules.filter(e => e.type == RuleType.shieldState).length > 0;
    }
    static getShieldValue(rules) {
        var shieldRules = rules.filter(e => e.type == RuleType.shieldState);
        if (shieldRules.length == 0)
            return -1;
        var result = 0;
        for (var r of shieldRules) {
            result += Util.getNumber(r.value);
        }
        return result;
    }
}
//# sourceMappingURL=RuleHelper.js.map