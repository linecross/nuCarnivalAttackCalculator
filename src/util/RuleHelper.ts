import { Rule, RuleTarget, Condition } from '../CardRule.js';
import { RuleType } from '../Constants.js';
import { Float32 } from './Float32.js';
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
	static hasShield(rules: Rule[]) : boolean{
		return rules.filter(e=>e.type == RuleType.shieldState).length > 0;
	}
	static getBuffRules(rules: Rule[], ruleType: RuleType) : Rule[]{
		return rules.filter(e=>e.type == ruleType);
	}
	static hasBuff(rules: Rule[], ruleType: RuleType) : boolean{
		return rules.filter(e=>e.type == ruleType).length > 0;
	}
	static getBuffTotalValue(rules: Rule[], ruleType: RuleType) : number{
		var targetRules = rules.filter(e=>e.type == ruleType);
		if (targetRules.length == 0) return 0;
		var result : Float32 = new Float32(0);
		for (var r of targetRules){
			result.add(Util.getFloat32(r.value));
		}
		return result.getValue();
	}
}