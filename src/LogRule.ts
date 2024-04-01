import { RuleType, TargetType} from './Constants.js';
import { Rule } from './CardRule.js';

export class LogRule extends Rule{
	applyCount: number = 1;

	constructor(rule: Rule){
		super(rule);

		if (rule.type == RuleType.attack){
			this.applyCount = rule.maxCount;
		}
	}

	addCount(){
		this.applyCount++;
	}

	public toString() : string{
		var s = '【'+this.parentCardName+'】';
		s += this.type + '：' + this.value;
		if (this.maxCount > 1 || this.applyCount > 1){
			if (this.type == RuleType.attack || this.type == RuleType.poisonAttack){
				s += '（'+this.applyCount+'次）'
			}
			else{
				s += '（'+this.applyCount+'層）'
			}
		}
		return s;
	}
	
	public getFullSkillInfo() : string{
		var s = this.type + this.value;
		if (this.value == null){
			s = this.type;
		}
		if (this.target != null && this.target.type != TargetType.self){
			s = this.target + s;
		}
		if (this.condition != null && this.condition.length > 0){
			s = this.condition.map(c=>c.toString()).join('，') + '，' + s;
		}
		if (this.turn < 50 && this.turn > 1){
			s += '（'+this.turn+'回合）'
		}
		if (this.maxCount > 1){
			s += '（最多'+this.maxCount+'層）'
		}
		return s;
	}
}