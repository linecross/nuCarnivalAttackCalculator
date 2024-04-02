import { Rule, RuleTarget, Condition } from '../CardRule.js';

export class RuleHelper{
	static hasCounterAttack(rules: Rule[]){
		return rules.filter(e=>e.isCounterAttack).length > 0;
	}
	static hasTriggerAttack(rules: Rule[]){
		return rules.filter(e=>e.isTriggerSkill()).length > 0;
	}
}