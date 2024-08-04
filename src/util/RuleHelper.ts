import { Rule, RuleTarget, Condition } from '../CardRule.js';

export class RuleHelper{
	static hasCounterAttack(rules: Rule[]){
		return rules.filter(e=>e.isCounterAttack).length > 0;
	}
	static hasTriggerAttack(rules: Rule[]){
		return rules.filter(e=>e.isTriggerSkill()).length > 0;
	}
	static isRuleExceedMaxCount(rule, rules: Rule[]){
		if (rule.turn == Rule.ALWAYS_EFFECTIVE || rule.maxCount != null){
			var currentCount = rules.filter(r=>r.id == rule.id).length;
			if (currentCount < rule.getMaxCount()){
				return false;
			}
		}
		else{
			return false;
		}
		
		return true;
	}
}