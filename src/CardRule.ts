import { Class, RuleType, AttackType, ConditionType, TargetType, SkillType, RuleValueByType, TurnActionType, OperatorType, ConditionHPStatus } from './Constants.js';
import { Card, Team } from './Card.js';
import { Util } from './util/Util.js';


export class Rule{
	id: number;
	parentCardName: string;

	isPassive: boolean;  // star3 / star6 / pot6 passive skill indicator
	type: RuleType;
	skillType: SkillType = SkillType.none;
	value: string | Rule;
	valueBy: RuleValueByType;
	turn: number ;
	poisonTurn: number;
	maxCount: number | null = null;
	target: RuleTarget | null = null;
	condition: Condition[] | null = null ;
	isCounterAttack: boolean = false;
	isFollowUpAttack: boolean = false;

	static idCounter: number = 0;

	static BATTLE_INIT_RULE_ID: number = 10000;
	static CHILD_RULE_ID_INCREMENT: number = 300000;
	static ALWAYS_EFFECTIVE: number = 99;

	static createId(){
		return Rule.idCounter++;
	}

	constructor({id = null, parentCardName = "", isPassive=false, type=RuleType.attack as RuleType as string, value, 
		valueBy = RuleValueByType.atk as RuleValueByType, turn=50, poisonTurn=1, maxCount=null, skillType=SkillType.none as SkillType, 
		condition=null, target=null, isCounterAttack=false, isFollowUpAttack=false}){

		this.id = id == null ? Rule.createId() : id;
		this.parentCardName = parentCardName;
		this.isPassive = isPassive;
		if (typeof type == 'string'){
			var idx = Object.values(RuleType).indexOf(type as RuleType);
			this.type = RuleType[Object.keys(RuleType)[idx]];
		}
		else{
			this.type = type;
		}
		this.value = value;
		this.valueBy = valueBy;
		this.turn = turn;
		this.poisonTurn = poisonTurn;
		this.maxCount = maxCount;
		this.skillType = skillType;
		if (condition == null || Array.isArray(condition)){
			this.condition = condition;
		}
		else{
			this.condition = [condition];
		}
		this.target = target;
		this.isCounterAttack = isCounterAttack;
		this.isFollowUpAttack = isFollowUpAttack;
	}

	public toString() : string{
		var s = this.type + ' ' + this.value;
		if (this.turn < 50 && this.turn > 1){
			s += '（'+this.turn+'回合）'
		}
		if (this.maxCount > 1){
			s += '（最多'+this.maxCount+'層）'
		}
		return s;
	}

	// Exact clone including rule ID
	public clone(){
		var cloneRule = new Rule({id: this.id, parentCardName: this.parentCardName, isPassive: this.isPassive, type: this.type, value: this.value, valueBy: this.valueBy,
			turn: this.turn, poisonTurn: this.poisonTurn, maxCount: this.maxCount, skillType: this.skillType, condition: this.condition, target: this.target, 
			isCounterAttack: this.isCounterAttack, isFollowUpAttack: this.isFollowUpAttack});
		if (this.condition != null){
			cloneRule.condition = this.condition;
		}
		return cloneRule;
	}

	// rule ID increment
	public cloneSimpleChild(){
		var cloneRule = this.clone();
		cloneRule.id += Rule.CHILD_RULE_ID_INCREMENT;
		return cloneRule;
	}

	// Not passive
	public cloneSimple(){
		var cloneRule = this.clone();
		cloneRule.isPassive = false;
		return cloneRule;
	}

	getMaxCount(){
		if (this.maxCount == null) return 1;
		return this.maxCount;
	}

	isConditionsFulfilled(card: Card, team: Team, turnAction: TurnActionType, attackType : AttackType, turn: number) : boolean{
		if (this.condition == null || this.condition.length == 0){
			return true;
		}
		var isFulfilled = true;
		for (var condition of this.condition){
			isFulfilled = isFulfilled && condition.isFulfilled(card, team, turnAction, attackType, turn);
		}
		return isFulfilled;
	}

	getConditionFulfillTimes(card: Card, team: Team, turnAction: TurnActionType, attackType : AttackType, turn: number){
		if (this.condition == null || this.condition.length == 0 || this.maxCount == null){
			return 1;
		}
		var count = this.maxCount;
		for (var condition of this.condition){
			count = Math.min(count, condition.getFulfillTimes(card, team, turnAction, attackType, turn));
		}
		return count;
	}

	isRuleCheckInBattle(){
		if (this.condition == null || this.condition.length == 0){
			return false;
		}
		for (var condition of this.condition){
			if (Condition.CHECK_IN_BATTLE_LIST.includes(condition.type)){
				return true;
			}
		}
		return false;
	}

	isPostAttackRule(){
		if (this.type == RuleType.basicAtkFollowupSkill){
			return true;
		}
		if (this.condition == null || this.condition.length == 0){
			return false;
		}
		var types : ConditionType[] = [ConditionType.isAttack, ConditionType.isAttackType, 
			ConditionType.enemyIsAttacked];
		for (var condition of this.condition){
			if (types.includes(condition.type)){
				return true;
			}
		}
		return false;
	}

	isBeforeRoundRule(){
		if (this.condition != null){
			for (var condition of this.condition){
				if (condition.type == ConditionType.atTurn || condition.type == ConditionType.everyTurn){
					return true;
				}
			}
		}
		return false;
	}

	isPreAttackRule(){
		if (this.condition == null || this.condition.length == 0){
			if (this.type == RuleType.appendRule || this.type == RuleType.enemyAppendRule){
				return true;
			}
		}
		return false;
	}

	isTriggerSkill(attackType: string = AttackType.BasicAttack){
		if (this.isCounterAttack || this.skillType == SkillType.trigger){
			return true;
		}
		// FIXME: 現時假設 「必殺技」+「攻擊時/被攻擊時」+「攻擊/治療」 = 觸發技，日後可能要移除
		if (attackType == AttackType.SkillAttack && (this.type == RuleType.attack || this.type == RuleType.heal)){
			if (this.condition != null){
				for (var condition of this.condition){
					if (condition.type == ConditionType.isAttack || condition.type == ConditionType.isAttackType){
						return true;
					}
				}
			}
		}
		return false;
	}

	isNoOverlayRule(){
		return this.turn != Rule.ALWAYS_EFFECTIVE && this.maxCount != null;
	}

	getRuleApplyTarget(team: Team, card: Card) : string[] {
		var cardNames = [];
		if (this.target == null){
			cardNames.push(card.name); //self
		}
		else{
			cardNames = this.target.getTargetCard(team, card);
		}
		return cardNames;
	}

	static loadRule({isPassive=false, type=RuleType.attack as RuleType as string, value, valueBy=RuleValueByType.atk as RuleValueByType, turn=null, poisonTurn=1, maxCount=null, skillType=SkillType.none as SkillType, condition=null, target=null}, isPermRule = false) : Rule{
		// Default values setup
		if (isPermRule) {
			isPassive = true;
			if (turn == null) turn = Rule.ALWAYS_EFFECTIVE;
		}
		else{
			isPassive = false;
			if (turn == null) turn = 1;
		}

		// Load append rule
		if (type == RuleType.appendRule || type == RuleType.enemyAppendRule){
			value = Rule.loadRule(value);
		}

		// Load condition
		var conditionArr = null;
		if (condition != null){
			conditionArr = [];
			if (Array.isArray(condition)){
				for (var item of condition){
					conditionArr.push(new Condition(item.type, item.value, item.operator, item.minCount));
				}
			}
			else if (typeof condition == 'string'){
				conditionArr.push(new Condition(condition as ConditionType, null, null, null));
			}
			else{
				conditionArr.push(new Condition(condition.type, condition.value, condition.operator, condition.minCount));
			}
		}

		// Load Target
		var targetItem = null;
		if (target != null){
			if (typeof target == 'string'){
				target = {type: target};
			}
			targetItem = RuleTarget.loadTarget(target);
		}

		var rule = new Rule({isPassive: isPassive, type: type, value:value, valueBy: valueBy, turn: turn, poisonTurn: poisonTurn, maxCount: maxCount, skillType: skillType, condition: conditionArr, target: targetItem});
		return rule;
	}
}

export class RuleTarget{
	type : TargetType;
	value : string[] | Class[] | number[] | null;
	exceptType : TargetType | null;
	exceptValue : string[] | Class[] | number[] | null;
	
	constructor(type = TargetType.self, value = null, exceptType = null, exceptValue = null){
		this.type = type;
		this.exceptType = exceptType;

		if (Array.isArray(value) || value == null){
			this.value = value;
		}
		else{
			this.value = [value];
		}

		if (Array.isArray(exceptValue) || exceptValue == null){
			this.exceptValue = exceptValue;
		}
		else{
			this.exceptValue = [exceptValue];
		}
	}

	static loadTarget({type = TargetType.self, value = null, exceptType = null, exceptValue = null}){
		var target = new RuleTarget(type, value, exceptType, exceptValue);
		return target;
	}

	private getTarget(type : TargetType, value : string[] | Class[] | number[] | null, team: Team, card: Card){
		var cardNames = [];
		if (type == null){
			// do nothing
		}
		else if (type == TargetType.self){
			cardNames.push(card.name);
		}
		else if (type == TargetType.all){
			cardNames = Object.values(team.cards).map(e=>e.name);
		}
		else if (type == TargetType.isClass){
			var targetClasses = value as Class[];
			cardNames = Object.values(team.cards).filter(e=>targetClasses.includes(e.class)).map(e=>e.name);
		}
		else if (type == TargetType.isChar){
			var targetChars = value as string[];
			cardNames = Object.values(team.cards).filter(e=>targetChars.includes(e.char)).map(e=>e.name);
		}
		else if (type == TargetType.isPosition){
			var targetPos = value as number[];
			var targetCards = team.getCardByPos(targetPos);
			cardNames = targetCards.map(e=>e.name);
		}
		return cardNames;
	}

	getIncludeTarget(team: Team, card: Card) : string[] {
		return this.getTarget(this.type, this.value, team, card);
	}

	getExcludeTarget(team: Team, card: Card) : string[] {
		return this.getTarget(this.exceptType, this.exceptValue, team, card);
	}

	getTargetCard(team: Team, card: Card) : string[] {
		var includeNames = this.getIncludeTarget(team, card);
		var excludeNames = this.getExcludeTarget(team, card);
		return includeNames.filter(e=>!excludeNames.includes(e));
	}

	public toString() : string{
		var type = this.type;
		var value = '';
		if (this.value != null){
			value = this.value.toString();
		}
		if (type == TargetType.isPosition){
			value = '第' + value + '位';
		}
		var exceptStr = this.exceptType != null ? this.exceptValue != null ? this.exceptValue : this.exceptType : '';
		if (this.exceptType == TargetType.isPosition){
			exceptStr = '第' + exceptStr + '位';
		}
		if (exceptStr.length > 0) exceptStr = '（除了' + exceptStr + '）';
		if (this.value == null){
			return type + exceptStr;
		}
		return value.toString() + exceptStr;
	}
}

export class Condition{
	type: ConditionType;
	value: number | number[] | string | Class | AttackType;
	operator: OperatorType;
	minCount: number;

	// can only check after battle start
	static CHECK_IN_BATTLE_LIST : ConditionType[] = [ConditionType.isAttackType, ConditionType.isAttack, ConditionType.everyTurn, ConditionType.atTurn];

	static HP_STATUS : ConditionHPStatus = ConditionHPStatus.fulfill;

	constructor(type: ConditionType, value: number | number[] | string | Class | AttackType, operator: OperatorType = null, minCount: number = 1){
		this.type = type;
		this.value = value;
		this.operator = operator;
		if (minCount != null){
			this.minCount = minCount;
		}
	}
	
	isFulfilled(card: Card, team: Team, turnAction: TurnActionType, charAttackType : AttackType, currentTurn: number) : boolean{
		if (this.type == ConditionType.hasChar){
			return team.getCharCount(this.value.toString()) >= this.minCount;
		}
		else if (this.type == ConditionType.charCount){
			if (this.operator == null || this.operator == OperatorType.moreOrEq || this.operator == OperatorType.more){
				return team.getCharCount(this.value.toString()) >= this.minCount;
			}
			else{
				return team.getCharCount(this.value.toString()) <= this.minCount;
			}
		}
		else if (this.type == ConditionType.hasClass){
			return team.getClassCount(this.value as Class) >= this.minCount;
		}
		else if (this.type == ConditionType.classCount){
			if (this.operator == null || this.operator == OperatorType.moreOrEq || this.operator == OperatorType.more){
				return team.getClassCount(this.value as Class) >= this.minCount;
			}
			else{
				return team.getClassCount(this.value as Class) <= this.minCount;
			}
		}
		else if (this.type == ConditionType.hasElement){
			return team.getElementCount(this.value.toString()) >= this.minCount;
		}
		else if (this.type == ConditionType.elementCount){
			if (this.operator == null || this.operator == OperatorType.moreOrEq || this.operator == OperatorType.more){
				return team.getElementCount(this.value.toString()) >= this.minCount;
			}
			else{
				return team.getElementCount(this.value.toString()) <= this.minCount;
			}
		}
		else if (this.type == ConditionType.hpHigher || this.type == ConditionType.hpLower){
			if (Condition.HP_STATUS == ConditionHPStatus.fulfill){
				return true;
			}
			if (Condition.HP_STATUS == ConditionHPStatus.notFulfill){
				return false;
			}
			var condHpPercent = Util.getPercentNumber(this.value.toString());
			if (this.type == ConditionType.hpHigher && card.currentHp > condHpPercent){
				return true;
			}
			if (this.type == ConditionType.hpLower && card.currentHp < condHpPercent){
				return true;
			}

			return false;
		}
		else if (this.type == ConditionType.isAttackType){
			return (this.value as AttackType) == charAttackType;
		}
		else if (this.type == ConditionType.isAttack){
			return charAttackType == AttackType.BasicAttack || charAttackType == AttackType.SkillAttack;
		}
		else if (this.type == ConditionType.everyTurn){
			if (Array.isArray(this.value)){
				var numValArr = this.value as number[];
				return ((currentTurn - numValArr[1]) % numValArr[0]) == 0;
			}
			else{
				return ((currentTurn-1) % (this.value as number)) == 0;
			}
		}
		else if (this.type == ConditionType.atTurn){
			if (Array.isArray(this.value)){
				return (this.value as number[]).includes(currentTurn);
			}
			else{
				return (this.value as number) == currentTurn;
			}
		}
		else if (this.type == ConditionType.enemyIsAttacked){
			if (turnAction == TurnActionType.afterAttack){
				return charAttackType == AttackType.BasicAttack || charAttackType == AttackType.SkillAttack;
			}
		}
		else if (this.type == ConditionType.enemyIsAttackByChar){
			if (turnAction == TurnActionType.attack){
				let valArr: string[] = Array.isArray(this.value) ? (this.value as unknown as string[]) : [this.value as unknown as string];
				return valArr.includes(card.char);
			}
		}
		else if (this.type == ConditionType.enemyIsAttackByClass){
			if (turnAction == TurnActionType.attack){
				let valArr: string[] = Array.isArray(this.value) ? (this.value as unknown as string[]) : [this.value as unknown as string];
				return valArr.includes(card.class);
			}
		}
		else if (this.type == ConditionType.enemyIsAttackByElement){
			if (turnAction == TurnActionType.attack){
				let valArr: string[] = Array.isArray(this.value) ? (this.value as unknown as string[]) : [this.value as unknown as string];
				return valArr.includes(card.element);
			}
		}
		else if (this.type == ConditionType.enemyHpTrigger){  // Boss專用：血量機制
			if (!card.isEnemy) return false;
			var condHpPercentArr = Array.isArray(this.value) ? (this.value as unknown as string[]) : [this.value as unknown as string];
			if (condHpPercentArr.length == 1){
				condHpPercentArr.unshift("0%");
			}
			var condLowerHp = Util.getPercentNumber(condHpPercentArr[0]);
			var condUpperHp = Util.getPercentNumber(condHpPercentArr[1]);
			if (condLowerHp < card.currentHp*100 && card.currentHp*100 <= condUpperHp){
				return true;
			}
			return false;
		}
		return false;
	}

	getFulfillTimes(card: Card, team: Team, turnAction: TurnActionType, charAttackType : AttackType, currentTurn: number): number{
		if (this.type == ConditionType.charCount && (this.operator == null || this.operator == OperatorType.moreOrEq || this.operator == OperatorType.more)){
			return team.getCharCount(this.value.toString());
		}
		else if (this.type == ConditionType.classCount && (this.operator == null || this.operator == OperatorType.moreOrEq || this.operator == OperatorType.more)){
			return team.getClassCount(this.value as Class);
		}
		else if (this.type == ConditionType.elementCount && (this.operator == null || this.operator == OperatorType.moreOrEq || this.operator == OperatorType.more)){
			return team.getElementCount(this.value.toString());
		}
		else if (this.isFulfilled(card, team, turnAction, charAttackType, currentTurn)){
			return 1;
		}
		return 0;
	}

	public toString() : string{
		var type = this.type;
		var value = this.value;
		var operator = this.operator == null ? '' : this.operator;
		var minCount = this.minCount > 1 ? this.minCount + '名' : '';
		if (type == ConditionType.charCount){
			return type.replace('角色', operator + '1名「'+value.toString() + '」');
		}
		else if (type == ConditionType.classCount){
			return type.replace('定位', operator + '1名「'+value.toString() + '」');
		}
		else if (type == ConditionType.elementCount){
			return type.replace('屬性', operator + '1名「'+value.toString() + '」');
		}
		else if (type == ConditionType.hasChar){
			return type.replace('角色', minCount+'「'+value.toString()+'」') + '時';
		}
		else if (type == ConditionType.hasClass){
			return type.replace('定位', minCount+'定位'+value.toString()) + '時';
		}
		else if (type == ConditionType.hasElement){
			return type.replace('屬性', minCount+'屬性'+value.toString()) + '時';
		}
		else if (type == ConditionType.atTurn){
			return type.replace('n', value.toString()) + '時';
		}
		else if (type == ConditionType.everyTurn){
			return '每經過' + value.toString() + '回合';
		}
		else if (type == ConditionType.isAttackType){
			return value.toString() + '時';
		}
		else if (type == ConditionType.isAttack){
			return type;
		}
		else if (type == ConditionType.hpHigher || type == ConditionType.hpLower){
			return '當前' + type + value + '時';
		}
		
		return type + value;
	}
}