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
            const currentCount = rules.filter(r => r.id == rule.id).length;
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
        const targetRules = rules.filter(e => e.type == ruleType);
        if (targetRules.length == 0)
            return 0;
        let result = new Float32(0);
        for (const r of targetRules) {
            result.add(Util.getFloat32(r.value));
        }
        return result.getValue();
    }
    static getRuleByUniqueName(rules, uniqueName) {
        for (const r of rules) {
            if (r.uniqueName == uniqueName) {
                return r;
            }
        }
        return null;
    }
    static isRulesHaveAllUniqueNames(rules, uniqueNames) {
        for (const uniqueName of uniqueNames) {
            if (!rules.some(r => r.uniqueName == uniqueName)) {
                return false;
            }
        }
        return true;
    }
}
//# sourceMappingURL=RuleHelper.js.map