import { Rule } from '../CardRule.js';
import { RuleType } from '../Constants.js';
import { Float32 } from './Float32.js';
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
    static hasShield(rules) {
        return rules.filter(e => e.type == RuleType.shieldState).length > 0;
    }
    static getBuffRules(rules, ruleType) {
        return rules.filter(e => e.type == ruleType);
    }
    static hasBuff(rules, ruleType) {
        return rules.filter(e => e.type == ruleType).length > 0;
    }
    static getBuffTotalValue(rules, ruleType) {
        var targetRules = rules.filter(e => e.type == ruleType);
        if (targetRules.length == 0)
            return 0;
        var result = new Float32(0);
        for (var r of targetRules) {
            result.add(Util.getFloat32(r.value));
        }
        return result.getValue();
    }
}
//# sourceMappingURL=RuleHelper.js.map