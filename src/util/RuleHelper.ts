import { Rule, RuleTarget, Condition } from '../CardRule.js';
import { RuleType } from '../Constants.js';
import { Util } from './Util.js';

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
	static getShieldRules(rules: Rule[]) : Rule[]{
		return rules.filter(e=>e.type == RuleType.shieldState);
	}
	static hasShield(rules: Rule[]) : boolean{
		return rules.filter(e=>e.type == RuleType.shieldState).length > 0;
	}
	static getShieldValue(rules: Rule[]) : number{
		var shieldRules = rules.filter(e=>e.type == RuleType.shieldState);
		if (shieldRules.length == 0) return -1;
		var result = 0;
		for (var r of shieldRules){
			result += Util.getNumber(r.value);
		}
		return result;
	}
}