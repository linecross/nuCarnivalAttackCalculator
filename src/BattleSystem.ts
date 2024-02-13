import { Class, Element, Rarity, PotentialType, RuleType, AttackType, ConditionType, TargetType, ActionPattern, RuleValueByType, TurnActionType, CounterAttackMode } from './Constants.js';

const ALWAYS_EFFECTIVE : number = 99;

var GAME_CONFIG = {
	MAX_LEVEL: 60,
	POTTYPE:{
		'A': {
			hp: [
				[0, 0, 3, 3, 3, 3],
				[0, 0, 3.5, 3.5, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 3.5, 3.5, 3.5],
				[0, 0, 0, 3.5, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 0, 0, 4],
			],
			atk: [
				[2, 2, 0, 0, 0, 0],
				[2, 2, 0, 0, 0, 0],
				[2, 2, 2, 2, 0, 0],
				[2, 2, 2, 0, 0, 0],
				[2, 2, 2, 0, 0, 0],
				[0, 2, 2, 2, 0, 0],
				[2.5, 2.5, 2.5, 2.5, 0, 0],
				[2.5, 2.5, 2.5, 2.5, 0, 0],
				[2.5, 2.5, 2.5, 2.5, 0, 0],
				[3, 3, 3, 3, 0, 0],
				[3, 3, 3, 3, 0, 0],
				[0, 3, 3, 3, 3, 0],
			],
		},
		'B': {
			hp: [
				[2, 2, 0, 0, 0, 0],
				[2, 2, 0, 0, 0, 0],
				[2, 2, 2, 2, 0, 0],
				[2, 2, 2, 0, 0, 0],
				[2, 2, 2, 0, 0, 0],
				[0, 2, 2, 2, 0, 0],
				[2.5, 2.5, 2.5, 2.5, 0, 0],
				[2.5, 2.5, 2.5, 2.5, 0, 0],
				[2.5, 2.5, 2.5, 2.5, 0, 0],
				[3, 3, 3, 3, 0, 0],
				[3, 3, 3, 3, 0, 0],
				[0, 3, 3, 3, 3, 0],
			],
			atk: [
				[0, 0, 3, 3, 3, 3],
				[0, 0, 3.5, 3.5, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 3.5, 3.5, 3.5],
				[0, 0, 0, 3.5, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 0, 0, 4],
			],
		},
		'C': {
			hp: [
				[0, 0, 0, 0, 0, 0],
				[2.7, 2.7, 2.7, 2.7, 2.7, 2.7],
				[0, 2.7, 0, 2.7, 0, 2.7],
				[2.7, 0, 0, 0, 0, 0],
				[0, 2.8, 2.8, 2.8, 2.8, 2.8],
				[0, 2.8, 0, 2.8, 0, 2.8],
				[0, 2.8, 0, 2.8, 0, 3],
				[0, 3, 0, 3, 0, 3],
				[0, 3, 0, 3, 0, 3],
				[0, 3, 0, 3, 0, 3],
				[0, 3, 0, 3, 0, 3],
				[0, 0, 0, 3, 0, 3],
			],
			atk: [
				[2.7, 2.7, 2.7, 2.7, 2.7, 2.7],
				[0, 0, 0, 0, 0, 0],
				[2.7, 0, 2.7, 0, 2.7, 0],
				[0, 2.7, 2.8, 2.8, 2.8, 2.8],
				[2.8, 0, 0, 0, 0, 0],
				[0, 0, 2.8, 0, 2.8, 0],
				[2.8, 0, 2.8, 0, 2.8, 0],
				[3, 0, 3, 0, 3, 0],
				[3, 0, 3, 0, 3, 0],
				[3, 0, 3, 0, 3, 0],
				[3, 0, 3, 0, 3, 0],
				[0, 3, 3, 0, 3, 0],
			],
		},
		'D': {
			hp: [
				[0, 0, 0, 0, 0, 0],
				[2.7, 2.7, 2.8, 2.8, 3, 3],
				[0, 3, 0, 3, 0, 3],
				[0, 0, 0, 0, 0, 0],
				[3, 3, 3, 3, 3, 3],
				[0, 0, 3, 0, 3, 0],
			],
			atk: [
				[2.7, 2.7, 2.8, 2.8, 3, 3],
				[0, 0, 0, 0, 0, 0],
				[0, 0, 3, 0, 3, 0],
				[3, 3, 3, 3, 3, 3],
				[0, 0, 0, 0, 0, 0],
				[0, 3, 0, 3, 0, 3],
			],
		},
	},
};


export class CardCenter{
	private static cardData: {} = {};
	private static userCardData: {} = {};

	static setMainCardData(obj:{}){
		CardCenter.cardData = obj;
	}
	static addUserCardData(newObj:{}){
		CardCenter.concatData(CardCenter.userCardData, newObj);
	}

	private static concatData(o1:{}, o2:{}) : {}{
		for (var key of Object.keys(o2)){
			o1[key] = o2[key];
		}
		return o1;
	}

	static getCardData(){
		var fullCardData = JSON.parse(JSON.stringify(CardCenter.cardData));
		fullCardData = CardCenter.concatData(fullCardData, CardCenter.userCardData);
		return fullCardData;
	}

	static setupDefaultTeamStar(team: Team, ssrStar: number, srStar: number){
		for (var card of team.cards){
			if (card.rarity == Rarity.SSR){
				card.star = ssrStar;
			}
			else if (card.rarity == Rarity.SR){
				card.star = srStar;
			}
		}
	}

	static loadCard(name: string) : Card{
		if (CardCenter.getCardData()[name] == null){
			throw new Error('Card does not exists: ' + name);
		}
		return Card.loadCardFromJson(name, CardCenter.getCardData()[name]);
	}

	static getCardNameByChar(char: string) : string[]{
		var arr : string[] = [];
		var cardData = CardCenter.getCardData();
		for (var name of Object.keys(cardData)){
			if (cardData[name].char == char){
				arr.push(name);
			}
		}
		arr = arr.reverse();
		return arr;
	}
}

export class Card{
	name: string;
	fullname: string;
    char: string;
	rarity: Rarity;
	class: Class;
	element: Element;
	potType: PotentialType;

	baseHp: number ;
	baseAtk: number ;

	hp: number;
	atk: number;

	level: number = 60
	star: number = 5;
	bond: number = 5;
	potential: number = 12;
	coolDown: number;

	star3Rule: Rule[] = [];
	star5Rule: Rule[] = [];
	pot6Rule: Rule[] = [];

	attackRule: Rule[] = [];

	skillLv1Rule: Rule[] = [];
	skillLv2Rule: Rule[] = [];
	skillLv3Rule: Rule[] = [];

	skillRule: Rule[] = [];

	constructor(name?: string, char?: string, rarity?: Rarity){
		this.name = name;
		this.char = char;
		this.rarity = rarity;
	}

	initSkill(){
		if (this.star >= 4) this.skillRule = this.skillLv3Rule;
		else if (this.star >= 2) this.skillRule = this.skillLv2Rule;
		else this.skillRule = this.skillLv1Rule;
	}

	getPassiveRuleSummary(){
		var ruleArr : Rule[] = [];
		if (this.star >= 3) ruleArr.concat(this.star3Rule);
		if (this.star == 5)	ruleArr.concat(this.star5Rule);

		if ((this.rarity == Rarity.SSR || this.rarity == Rarity.SR)){
			if (this.potential >= 6){
				ruleArr.concat(this.pot6Rule);
			}
		}
		else if (this.potential >= 3){
			ruleArr.concat(this.pot6Rule);
		}
		return ruleArr;
	}

	getAttackRuleSummary(){
		this.initSkill();
		var ruleArr : Rule[] = [];
		ruleArr.concat(this.attackRule);
		ruleArr.concat(this.skillRule);
		return ruleArr;
	}

	private getCardVal(baseVal : number, potential : number) : number{
		var val : number = 0;
		val = Math.ceil(baseVal / Math.pow(1.05, 59)) * (0.5 + (0.1 * this.star));
		var bondVal = 0;
		if (this.bond > 0){
			if (this.rarity == Rarity.SSR){
				var bondVals = [5, 10, 20, 35, 60];
				bondVal = bondVals[this.bond-1];
			}
			else if (this.rarity == Rarity.SR || this.rarity == Rarity.R){
				var bondVals = [5, 10, 20, 30, 50];
				bondVal = bondVals[this.bond-1];
			}
		}
		val = Math.floor(val * Math.pow(1.05, this.level-1) * (1+bondVal/100) * (1+potential/100));

		return val;
	}

	getAtk() : number{
		if (this.atk != null){
			return this.atk;
		}
		return this.getCardVal(this.baseAtk, this.getAtkPotential());
	}

	getHp() : number{
		if (this.hp != null){
			return this.hp;
		}
		return this.getCardVal(this.baseHp, this.getHpPotential());
	}

	getHpPotential() : number{
		return this.getPotentialPercent('hp', this.potential);
	}

	getAtkPotential() : number{
		return this.getPotentialPercent('atk', this.potential);
	}

	getPotentialPercent(hpOrAtk: string, tier: number) : number{
		var potType = 'D';
		if (this.potType == PotentialType.A) potType = 'A';
		else if (this.potType == PotentialType.B) potType = 'B';
		else if (this.potType == PotentialType.C) potType = 'C';
		else if (this.potType == PotentialType.D) potType = 'D';

		if ((this.rarity == 'R' || this.rarity == 'N') && tier > 6){
			tier = 6;
		}

		tier = tier+1;
		let potArr = GAME_CONFIG.POTTYPE[potType][hpOrAtk];
		var sum = 0;
		for (let i = 0; i < tier-1; i++){
			sum += potArr[i].reduce((a, b) => a + b);
		}
		return sum;
	}

	static loadCard(data:Object) : Card {
		var card = new Card();
		for (var key of Object.keys(data)) {
			card[key] = data[key];
		}
		
		return card;
	}

	static loadCardFromJson(name: string, data:Object) : Card {
		var card = new Card();
		card.name = name;
		card = Card.updateCard(card, data);
		return card;
	}

	updateCard(data: Object) : Card{
		return Card.updateCard(this, data);
	}

	static updateCard(card: Card, data:Object) : Card {
		var simpleRules = ['attackRule', 'skillLv1Rule', 'skillLv2Rule', 'skillLv3Rule'];
		var permRules = ['star3Rule', 'star5Rule', 'pot6Rule'];
		for (var key of Object.keys(data)) {
			if (simpleRules.includes(key)){
				card[key] = [];
				for (var ruleItem of data[key]){
					var rule = Rule.loadSimpleRule(ruleItem);
					rule.parentCardName = card.name;
					card[key].push(rule);
				}
			}
			else if (permRules.includes(key)){
				card[key] = [];
				for (var ruleItem of data[key]){
					var rule = Rule.loadPermRule(ruleItem);
					rule.parentCardName = card.name;
					card[key].push(rule);
				}
			}
			else{
				card[key] = data[key];
			}
		}
		return card;
	}
}

export class BattleTurn{
	cardName: string;
	skillCD: number;
	action: AttackType[];
	actionPattern: string;
	outputs: number[][];
	enemyDamage: number[][];
	rules: Rule[];
	ruleLog: Rule[][];

	constructor(cardName: string){
		this.cardName = cardName;
		this.skillCD = 0;
		this.action = [];
		this.actionPattern = ActionPattern.Immediately;
		this.outputs = [];
		this.enemyDamage = [];
		this.rules = [];
		this.ruleLog = [];
	}

	addRule(newRule : Rule) : boolean{
		// Always effective rule: check max count allowed
		if (newRule.turn == ALWAYS_EFFECTIVE){
			var currentCount = this.rules.filter(rule=>rule.id == newRule.id).length;
			if (currentCount < newRule.maxCount){
				this.rules.push(newRule);
				return true;
			}
		}
		// Rule will be consumed over time
		else{
			this.rules.push(newRule);
			return true;
		}
		return false;
	}

	clearRulePerRound(){
		for (var rule of this.rules){
			if (!rule.isPassive && rule.turn != ALWAYS_EFFECTIVE){
				rule.turn = rule.turn - 1;
			}
		}
		
		this.rules = this.rules.filter(rule=>rule.turn > 0);
	}

	addRuleLog(turn: number, rule : Rule, applyCount = 1){
		if (turn >= this.ruleLog.length){
			return;
		}

		var existingRules = this.ruleLog[turn].filter(e=>e.id == rule.id);
		var attackTypes:RuleType[] = [RuleType.attack, RuleType.heal];
		var attackRules = this.ruleLog[turn].filter(e=>attackTypes.includes(e.type));
		// console.debug(turn+":["+rule.id+"]"+rule.type+rule.value+":"+rule.maxCount+"||"+existingRules.length);
		// Seperate buff before and after attack
		if (attackRules.length == 0 && existingRules.length > 0){
			for (var i=0; i<applyCount; i++){
				(existingRules[0] as LogRule).addCount();
			}
		}
		else{
			var logRule = new LogRule(rule.clone());
			logRule.condition = null;
			logRule.target = null;
			logRule.applyCount = applyCount;
			this.ruleLog[turn].push(logRule);
		}
	}

	countDownCDPerRound(){
		if (this.skillCD > 0){
			this.skillCD -= 1;
		}
	}

	isSkillAvailable(){
		if (this.skillCD == 0){
			return true;
		}
		return false;
	}

	private getLastSkillTurn() : number{
		if (!this.isSkillAvailable()){
			return -1;
		}
		var lastTurn = 0;
		
		for (var i=this.action.length-1; i>=0; i--){
			if (this.action[i] == AttackType.SkillAttack){
				lastTurn = i;
				break;
			}
		}

		return lastTurn;
	}

	getSkillDelayedTurn(currentTurn: number, cooldown: number) : number{
		var lastTurn = this.getLastSkillTurn();
		if (lastTurn == 0){ 
			lastTurn = 1;
		}
		return currentTurn - (lastTurn + cooldown);
	}

	isGuard(currentTurn: number, cooldown: number){
		if (this.actionPattern == ActionPattern.Manual){
			return this.action[currentTurn] == AttackType.Guard;
		}
		return false;
	}

	isReleaseSkill(currentTurn: number, cooldown: number){
		if (!this.isSkillAvailable()){
			return false;
		}

		if (this.actionPattern == ActionPattern.Immediately){
			return true;
		}
		else if (this.actionPattern == ActionPattern.Delay1Turn){
			if (this.getLastSkillTurn() == 0){
				return this.getSkillDelayedTurn(currentTurn, cooldown) >= 1;
			}
			else{
				return true;
			}
		}
		else if (this.actionPattern == ActionPattern.AddCD1){
			return (this.getSkillDelayedTurn(currentTurn, cooldown) == 1);
		}
		else if (this.actionPattern == ActionPattern.AddCD2){
			return (this.getSkillDelayedTurn(currentTurn, cooldown) == 2);
		}
		else if (this.actionPattern == ActionPattern.AddCD3){
			return (this.getSkillDelayedTurn(currentTurn, cooldown) == 3);
		}
		else if (this.actionPattern == ActionPattern.AddCD1Delay1Turn){
			if (this.getLastSkillTurn() == 0){
				return (this.getSkillDelayedTurn(currentTurn, cooldown) == 2);
			}
			else{
				return (this.getSkillDelayedTurn(currentTurn, cooldown) == 1);
			}
		}
		else if (this.actionPattern == ActionPattern.AddCD2Ahead1Turn){
			if (this.getLastSkillTurn() == 0){
				return (this.getSkillDelayedTurn(currentTurn, cooldown) == 1);
			}
			else{
				return (this.getSkillDelayedTurn(currentTurn, cooldown) == 2);
			}
		}
		else if (this.actionPattern == ActionPattern.Manual){
			return this.action[currentTurn] == AttackType.SkillAttack;
		}


		return false;
	}
}

export class Battle{
	turns : number = 13;
	currentTurn: number = 0;
	currentTurnAction: TurnActionType;
	team: Team;
	battleTurns : BattleTurn[] = [];
	enemyElement : Element = Element.NA;
	enemyBattleTurn : BattleTurn;

	counterAttackCount: number = 0;
	counterAttackMode: CounterAttackMode = CounterAttackMode.everyTurn;
	printOutputOption: string = Battle.PRINT_OUTPUT_OPTION.ALL;
	printEnemeyOption: boolean = false;

	static PRINT_OUTPUT_OPTION = {ALL : 'All', ONLY_DAMAGE: 'OnlyDamage', ONLY_ATTACK:'OnlyAttack', ONLY_SUPPORT:'OnlySupport', ONLY_HEAL:'OnlyHeal', ONLY_POISON:'OnlyPoison'}; 

	static OUTPUT_TYPES : RuleType[] = [RuleType.attack, RuleType.poisonAttack, RuleType.heal, RuleType.continueHeal, RuleType.support];
	static TEAM_BUFF_TYPES : RuleType[] = [RuleType.atkUp, RuleType.hpUp, RuleType.basicAtkUp, RuleType.skillAtkUp, RuleType.allAtkUp, RuleType.poisonAtkUp, RuleType.healUp, RuleType.continueHealUp, RuleType.partyHealUp, RuleType.partyContinueHealUp, RuleType.partyAllHealUp];
	static ENEMY_BUFF_TYPES : RuleType[] = [RuleType.enemyBasicAtkUp, RuleType.enemySkillAtkUp, RuleType.enemyElementAtkUp, RuleType.enemyAllAtkUp, RuleType.enemyPoisonAtkUp];

	constructor(team: Team, turns : number = 13){
		this.turns = turns;
		this.team = team;		
	}

	start(){
		this.init();
		this.startBattle();
	}

	init(){
		this.enemyBattleTurn = new BattleTurn('Boss');

		for (var card of this.team.cards){
			card.initSkill();
			this.battleTurns[card.name] = new BattleTurn(card.name);
			this.battleTurns[card.name].skillCD = card.coolDown;
			for (var key of Battle.OUTPUT_TYPES){
				this.battleTurns[card.name].outputs[key] = [];
				this.battleTurns[card.name].enemyDamage[key] = [];
			}
			for (var i=0; i<=this.turns; i++){
				this.battleTurns[card.name].ruleLog[i] = [];
			}
		}
		
		for (var card of this.team.cards){
			this.initBattleRules(this.team, card);
			// this.battleTurns[card.name].setActionPattern(this.turns, card);
		}
	}
	
	setActionPattern(cardName: string, pattern: ActionPattern){
		this.battleTurns[cardName].actionPattern = pattern;
	}

	setManualActionPattern(cardName: string, skillTurns : number[], guardTurns : number[] =[]){
		for (var i=1; i<=this.turns; i++){
			if (guardTurns.includes(i)){
				this.battleTurns[cardName].action[i] = AttackType.Guard;
			}
			else if (skillTurns.includes(i)){
				this.battleTurns[cardName].action[i] = AttackType.SkillAttack;
			}
		}
	}

	initBattleRules(team: Team, card: Card){
		var toAddRules : Rule[] = [];
		if (card.star >= 3) toAddRules = toAddRules.concat(card.star3Rule);
		if (card.star >= 5) toAddRules = toAddRules.concat(card.star5Rule);
		if (card.potential >= 6) toAddRules = toAddRules.concat(card.pot6Rule);

		for (var rule of toAddRules){
			// If rule only check in battle, only add to card but not targets
			if (rule.isRuleCheckInBattle()){
				this.battleTurns[card.name].addRule(rule.clone());
			}
			// Apply rule to all targets
			else{
				var targetNames = rule.getRuleApplyTarget(team, card);
				for (var targetName of targetNames){
					var newRule = rule.clone();
					newRule.parentCardName = targetName;
					if (newRule.target != null){
						newRule.target = new RuleTarget();
					}
					this.battleTurns[targetName].addRule(newRule);
				}
			}
		}
	}

	startBattle(){
		for (var turn=1; turn <= this.turns; turn++){
			this.currentTurn = turn;

			// Clear rules
			for (var card of this.team.getCardByActionOrder()){
				this.battleTurns[card.name].clearRulePerRound();
			}
			this.enemyBattleTurn.clearRulePerRound();

			// Before round
			this.beforeRound(AttackType.None, this.team.getCardByActionOrder());

			// Attack
			for (var card of this.team.getCardByActionOrder()){
				var attackType : AttackType = AttackType.BasicAttack;
				if (this.battleTurns[card.name].isReleaseSkill(turn, card.coolDown)){
					attackType = AttackType.SkillAttack;
				}
				else if (this.battleTurns[card.name].isGuard(turn, card.coolDown)){
					attackType = AttackType.Guard;
				}

				this.startRoundPerCard(attackType, card);
				if (attackType == AttackType.SkillAttack){
					this.battleTurns[card.name].skillCD = card.coolDown;
				}
			}

			// Before end turn (eg. counter-attack, poison, continuos heal...)
			this.endRound(AttackType.None, this.team.getCardByActionOrder());

			// Count down Skill CD
			for (var card of this.team.getCardByActionOrder()){
				this.battleTurns[card.name].countDownCDPerRound();
			}
		}
	}

	getPostAttackRules(rules : Rule[]) : Rule[]{
		var attackRules = rules.filter(r=>r.isPostAttackRule());
		return attackRules;
	}

	getPreAttackRules(rules : Rule[]) : Rule[]{
		var attackRules = rules.filter(r=>!r.isPostAttackRule());
		return attackRules;
	}

	beforeRound(attackType: AttackType, cards: Card[]){
		this.currentTurnAction = TurnActionType.beforeTurn;
		// ---------------------------每回合剛開始------------------------------------
		// 處理每個人各種回合開始被動，例：每n回合、第n回合
		for (var card of cards){
			var preAttackRules = this.battleTurns[card.name].rules.filter((e: Rule)=>e.isBeforeRoundRule());
			for (var rule of preAttackRules){
				this.addRuleToTargets(rule, card, attackType);
			}

			preAttackRules = this.battleTurns[card.name].rules.filter((e: Rule)=>e.isBeforeRoundRule());
			for (var rule of preAttackRules){
				this.processRule(rule, card, attackType);
				this.addBuffToTargets(rule, card, attackType);
			}
		}

		// 敵方
		preAttackRules = this.enemyBattleTurn.rules.filter((e: Rule)=>e.isBeforeRoundRule());
		for (var rule of preAttackRules){
			this.addRuleToTargets(rule, card, attackType);
			this.addBuffToTargets(rule, card, attackType);
		}
	}

	startRoundPerCard(attackType: AttackType, card: Card) : AttackType{
		this.currentTurnAction = TurnActionType.beforeTurn;

		// ---------------------------每個人攻擊前------------------------------------
		var preAttackRules = this.battleTurns[card.name].rules.filter((e: Rule)=>e.isPreAttackRule());
		for (var rule of preAttackRules){
			this.addRuleToTargets(rule, card, attackType);
		}

		preAttackRules = this.battleTurns[card.name].rules.filter((e: Rule)=>e.isPreAttackRule());
		for (var rule of preAttackRules){
			this.processRule(rule, card, attackType);
			this.addBuffToTargets(rule, card, attackType);
		}

		// 敵方
		preAttackRules = this.enemyBattleTurn.rules.filter((e: Rule)=>e.isPreAttackRule());
		for (var rule of preAttackRules){
			this.addRuleToTargets(rule, card, attackType);
			this.addBuffToTargets(rule, card, attackType);
		}
		
		// ---------------------------正式攻擊------------------------------------
		if (attackType == AttackType.Guard){
			this.battleTurns[card.name].action[this.currentTurn] = attackType;
			return attackType;
		}

		this.currentTurnAction = TurnActionType.beforeAction;
		var attackRule : Rule[] = [].concat(card.attackRule);
		if (attackType == AttackType.SkillAttack){
			attackRule = [].concat(card.skillRule);
		}

		var hasProcessedEnemyPostAttack = false;
		for (var rule of attackRule){
			var hasAttackEnemy = false;
			if (Battle.OUTPUT_TYPES.includes(rule.type)){
				this.attack(attackType, rule, card);
				if (rule.type == RuleType.attack){
					hasAttackEnemy = true;
				}
				
				// skip post attack rules
				if (this.currentTurnAction != TurnActionType.afterAction){
					// Run post attack rules after attack
					if (rule.type == RuleType.attack){
						this.currentTurnAction = TurnActionType.afterAttack;
					}
					var postAttackRules = this.battleTurns[card.name].rules
						.filter((e: Rule)=>e.isPostAttackRule() && e.isConditionsFulfilled(card, this.team, this.currentTurnAction, attackType, this.currentTurn));

					// 追擊
					for (var postRule of postAttackRules){
						if (postRule.type == RuleType.basicAtkFollowupSkill){
							var atkFollowupRule = postRule.cloneSimple();
							atkFollowupRule.type = RuleType.attack;
							atkFollowupRule.turn = 1;
							atkFollowupRule.condition = [new Condition(ConditionType.isAttackType, AttackType.BasicAttack)];
							this.attack(attackType, atkFollowupRule, card);
							this.currentTurnAction = TurnActionType.afterAttack;
							hasAttackEnemy = true;
						}
					}

					// 我方「攻擊時」「普攻時」「必殺時」被動
					for (var postRule of postAttackRules){
						this.addRuleToTargets(postRule, card, attackType);
						this.processRule(postRule, card, attackType);
						this.addBuffToTargets(postRule, card, attackType);
					}
				}

				if (hasAttackEnemy && !hasProcessedEnemyPostAttack){
					// 敵方「被攻擊時」被動
					this.currentTurnAction = TurnActionType.afterAttack;
					postAttackRules = this.enemyBattleTurn.rules
						.filter((e: Rule)=>e.isPostAttackRule());
					for (var postRule of postAttackRules){
						this.addRuleToTargets(postRule, card, attackType);
						this.addBuffToTargets(postRule, card, attackType);
					}
					hasProcessedEnemyPostAttack = true;
				}
				
				this.currentTurnAction = TurnActionType.afterAction;
			}
			else{
				this.addRuleToTargets(rule, card, attackType);
				this.processRule(rule, card, attackType);
				this.addBuffToTargets(rule, card, attackType);
			}
		}

		this.battleTurns[card.name].action[this.currentTurn] = attackType;

		return attackType;
	}

	endRound(attackType: AttackType, cards: Card[]){
		this.currentTurnAction = TurnActionType.atTurnEnd;

		for (var card of cards){
			// ---------------------------敵方攻擊------------------------------------
			// 反擊
			if (this.counterAttackCount > 0){
				var counterAttackRules = this.battleTurns[card.name].rules.filter(e=>e.type == RuleType.counterAttackSkill);
				for (var rule of counterAttackRules){
					var newRule = rule.cloneSimple();
					newRule.type = RuleType.attack;
					newRule.turn = 1;
					newRule.maxCount = Math.min(this.counterAttackCount, rule.maxCount);
					this.attack(AttackType.SkillAttack, newRule, card);
					
					if (this.counterAttackMode == CounterAttackMode.firstTurnOnly){
						rule.turn = 0; // consume
					}
				}
			}

			// ---------------------------回合結束------------------------------------
			// 持續傷害
			var poisonRules = this.enemyBattleTurn.rules.filter((e: Rule)=>e.type == RuleType.poisonAttackState && e.parentCardName == card.name);
			var poisonVal = poisonRules.reduce((sum, e)=> sum + Battle.getNumber(e.value as string), 0);
			if (poisonVal != null && poisonVal > 0){
				var enemyRules = this.enemyBattleTurn.rules
							.filter((r:Rule)=>r.isConditionsFulfilled(card, this.team, this.currentTurnAction, attackType, this.currentTurn));
				var enemyBuffs = this.filterBuffs(enemyRules, RuleType.poisonAttack, attackType, true);
				var debuffs : Rule[] = [];
				for (var buff of enemyBuffs){
					var buffType = buff.type;
					// 持續傷害：「敵方持續傷害增加」跟「敵方受到傷害增加」屬於同一乘區
					if (buffType == RuleType.enemyPoisonAtkUp){
						buffType = RuleType.enemyAllAtkUp;
					}
					var applyCount = buff.getConditionFulfillTimes(card, this.team, this.currentTurnAction, attackType, this.currentTurn);
					debuffs[buffType] = (debuffs[buffType] || 0) + (Battle.getNumber(buff.value as string) * applyCount);
				}
				var outputVal = poisonVal;
				var enemyDamageVal = outputVal;
				for (var key of Object.keys(debuffs)){
					enemyDamageVal = Math.floor(enemyDamageVal * (1 + Battle.getNumber(debuffs[key])));
				}

				this.battleTurns[card.name].outputs[RuleType.poisonAttack][this.currentTurn] = (this.battleTurns[card.name].outputs[RuleType.poisonAttack][this.currentTurn] || 0) + outputVal;
				this.battleTurns[card.name].enemyDamage[RuleType.poisonAttack][this.currentTurn] = (this.battleTurns[card.name].enemyDamage[RuleType.poisonAttack][this.currentTurn] || 0) + enemyDamageVal;
			}

			// 持續治療
			var contHealRules = this.battleTurns[card.name].rules.filter((e: Rule)=>e.type == RuleType.continueHealState && e.parentCardName == card.name);
			var contHealVal = contHealRules.reduce((sum, e)=> sum + Battle.getNumber(e.value as string), 0);
			if (contHealVal != null && contHealVal > 0){
				var cardRules = this.battleTurns[card.name].rules
							.filter((r:Rule)=>r.isConditionsFulfilled(card, this.team, this.currentTurnAction, attackType, this.currentTurn));
				var ourBuffs = cardRules.filter((r:Rule)=>r.type == RuleType.partyContinueHealUp || r.type == RuleType.partyAllHealUp);
				var buffs : Rule[] = [];
				for (var buff of ourBuffs){
					var buffType = buff.type;
					// 持續傷害：「我方受到持續治療增加」跟「我方受到治療增加」屬於同一乘區
					if (buffType == RuleType.partyContinueHealUp){
						buffType = RuleType.partyAllHealUp;
					}
					var applyCount = buff.getConditionFulfillTimes(card, this.team, this.currentTurnAction, attackType, this.currentTurn);
					buffs[buffType] = (buffs[buffType] || 0) + (Battle.getNumber(buff.value as string) * applyCount);
				}
				var outputVal = contHealVal;
				for (var key of Object.keys(buffs)){
					outputVal = Math.floor(outputVal * (1 + Battle.getNumber(buffs[key])));
				}

				this.battleTurns[card.name].outputs[RuleType.continueHeal][this.currentTurn] = (this.battleTurns[card.name].outputs[RuleType.continueHeal][this.currentTurn] || 0) + outputVal;
				this.battleTurns[card.name].enemyDamage[RuleType.continueHeal][this.currentTurn] = (this.battleTurns[card.name].enemyDamage[RuleType.continueHeal][this.currentTurn] || 0) + outputVal;
			}
		}
	}

	static ACTION_ACCEPT_BUFFS = {
		[RuleType.attack]: [RuleType.atkUp, RuleType.basicAtkUp, RuleType.skillAtkUp, RuleType.allAtkUp, 
			RuleType.enemyBasicAtkUp, RuleType.enemySkillAtkUp, RuleType.enemyElementAtkUp, RuleType.enemyAllAtkUp],
		[RuleType.poisonAttack]: [RuleType.atkUp, RuleType.poisonAtkUp, RuleType.allAtkUp, 
			RuleType.enemyPoisonAtkUp, RuleType.enemyAllAtkUp],
		[RuleType.heal]: [RuleType.atkUp, RuleType.basicAtkUp, RuleType.skillAtkUp, RuleType.healUp,
			RuleType.partyHealUp, RuleType.partyAllHealUp],
		[RuleType.continueHeal]: [RuleType.atkUp, RuleType.continueHealUp, RuleType.partyContinueHealUp],
		[RuleType.support]: [],
	};

	static ENEMY_BUFFS : RuleType[] = [RuleType.enemyBasicAtkUp, RuleType.enemyPoisonAtkUp, RuleType.enemySkillAtkUp, RuleType.enemyElementAtkUp, RuleType.enemyAllAtkUp];

	private filterBuffs(rules: Rule[], ruleType: RuleType, attackType: AttackType, isEnemy:boolean = false) : Rule[]{
		var filtered = rules.filter(r=> isEnemy ? Battle.ENEMY_BUFFS.includes(r.type) : !Battle.ENEMY_BUFFS.includes(r.type));
		filtered = filtered.filter(r=>Battle.ACTION_ACCEPT_BUFFS[ruleType].includes(r.type));
		filtered = filtered.filter(r=>!(r.isBeforeRoundRule() || r.isPreAttackRule() || r.isPostAttackRule()));
		if (attackType == AttackType.BasicAttack){
			filtered = filtered.filter(r=>r.type != RuleType.skillAtkUp && r.type != RuleType.enemySkillAtkUp);
		}
		else if (attackType == AttackType.SkillAttack){
			filtered = filtered.filter(r=>r.type != RuleType.basicAtkUp && r.type != RuleType.enemyBasicAtkUp);
		}
		// Should check and process at turn end
		filtered = filtered.filter(r=>r.type != RuleType.partyContinueHealUp);
		return filtered;
	}

	private filterBuffsForLog(rules: Rule[], ruleType: RuleType, attackType: AttackType, isEnemy:boolean = false) : Rule[]{
		var filtered = rules.filter(r=> isEnemy ? Battle.ENEMY_BUFFS.includes(r.type) : !Battle.ENEMY_BUFFS.includes(r.type));
		filtered = filtered.filter(r=>!(r.isBeforeRoundRule() || r.isPreAttackRule() || r.isPostAttackRule()));
		if (attackType == AttackType.BasicAttack){
			filtered = filtered.filter(r=>r.type != RuleType.skillAtkUp && r.type != RuleType.enemySkillAtkUp);
		}
		else if (attackType == AttackType.SkillAttack){
			filtered = filtered.filter(r=>r.type != RuleType.basicAtkUp && r.type != RuleType.enemyBasicAtkUp);
		}
		return filtered;
	}

	private processRule(rule: Rule, card: Card, attackType: AttackType){
		if (!rule.isConditionsFulfilled(card, this.team, this.currentTurnAction, attackType, this.currentTurn)){
			return;
		}

		var targetNames = rule.getRuleApplyTarget(this.team, card);
		for (var targetName of targetNames){
			// 減CD
			if (rule.type == RuleType.cdMinus){
				var cooldownCount = Battle.getNumber(rule.value);
				var targetSkillCD = this.battleTurns[targetName].skillCD - cooldownCount;
				this.battleTurns[targetName].skillCD = targetSkillCD > 0 ? targetSkillCD : 0;
			}
			// 普攻追擊
			else if (rule.type == RuleType.basicAtkFollowup){
				var newRule = rule.cloneSimple();
				newRule.type = RuleType.basicAtkFollowupSkill;
				newRule.condition = null;
				this.battleTurns[targetName].addRule(newRule);
			}
			// 反擊
			else if (rule.type == RuleType.counterAttack){
				var newRule = rule.cloneSimpleChild();
				newRule.type = RuleType.counterAttackSkill;
				newRule.condition = null;
				newRule.target = null;
				this.battleTurns[targetName].addRule(newRule);
			}
		}
	}

	private addBuffToTargets(rule: Rule, card: Card, attackType: AttackType){
		if (!(Battle.TEAM_BUFF_TYPES.includes(rule.type) || Battle.ENEMY_BUFF_TYPES.includes(rule.type))){
			return;
		}
		if (!rule.isConditionsFulfilled(card, this.team, this.currentTurnAction, attackType, this.currentTurn)){
			return;
		}
		var targetNames = rule.getRuleApplyTarget(this.team, card);
		for (var targetName of targetNames){
			var newRule = rule.cloneSimpleChild();
			newRule.isPassive = false;
			newRule.target = null;
			newRule.condition = null;
			// 各種buff （普攻/必殺/造傷/下毒/治療/持續治療增加）
			if (Battle.TEAM_BUFF_TYPES.includes(rule.type)){
				var isRuleAdded = this.battleTurns[targetName].addRule(newRule);
				if (isRuleAdded && targetName == card.name && !newRule.isBeforeRoundRule() && !newRule.isPreAttackRule()
					&& this.currentTurnAction != TurnActionType.beforeAction && this.currentTurnAction != TurnActionType.beforeTurn && this.currentTurnAction != TurnActionType.atTurnEnd){
					this.battleTurns[card.name].addRuleLog(this.currentTurn, newRule);
				}
			}
			// 敵方Debuff （普攻/必殺/造傷）
			else if (Battle.ENEMY_BUFF_TYPES.includes(rule.type)){
				var isRuleAdded = this.enemyBattleTurn.addRule(newRule);
				if (isRuleAdded && !newRule.isBeforeRoundRule() && !newRule.isPreAttackRule()
					&& this.currentTurnAction != TurnActionType.beforeAction && this.currentTurnAction != TurnActionType.beforeTurn && this.currentTurnAction != TurnActionType.atTurnEnd){
					this.battleTurns[card.name].addRuleLog(this.currentTurn, newRule);
				}
			}
		}
	}

	private addRuleToTargets(rule: Rule, card: Card, attackType: AttackType){
		if (!(rule.type == RuleType.appendRule || rule.type == RuleType.enemyAppendRule)){
			return;
		}
		if (!rule.isConditionsFulfilled(card, this.team, this.currentTurnAction, attackType, this.currentTurn)){
			return;
		}
		var targetNames = rule.getRuleApplyTarget(this.team, card);
		for (var targetName of targetNames){
			var newRule = (rule.value as Rule).cloneSimple();
			if (rule.type == RuleType.appendRule){
				newRule.parentCardName = targetName;
				var isRuleAdded = this.battleTurns[targetName].addRule(newRule);
				if (isRuleAdded && targetName == card.name && Battle.TEAM_BUFF_TYPES.includes(newRule.type) && newRule.condition == null && !newRule.isBeforeRoundRule() && !newRule.isPreAttackRule()
					&& this.currentTurnAction != TurnActionType.beforeAction && this.currentTurnAction != TurnActionType.beforeTurn && this.currentTurnAction != TurnActionType.atTurnEnd){
					this.battleTurns[card.name].addRuleLog(this.currentTurn, newRule);
				}
			}
			else if (rule.type == RuleType.enemyAppendRule){
				newRule.parentCardName = card.name;
				var isRuleAdded = this.enemyBattleTurn.addRule(newRule);
				if (isRuleAdded && Battle.ENEMY_BUFF_TYPES.includes(newRule.type) && newRule.condition == null && !newRule.isBeforeRoundRule() && !newRule.isPreAttackRule()
					&& this.currentTurnAction != TurnActionType.beforeAction && this.currentTurnAction != TurnActionType.beforeTurn && this.currentTurnAction != TurnActionType.atTurnEnd){
					this.battleTurns[card.name].addRuleLog(this.currentTurn, newRule);
				}
			}
		}
	}

	private attack(attackType: AttackType, rule: Rule, card: Card){
		var currentTurn = this.currentTurn;
		if (!rule.isConditionsFulfilled(card, this.team, this.currentTurnAction, attackType, currentTurn)){
			return;
		}

		var isAddRuleLog = this.currentTurnAction == TurnActionType.beforeAction;

		// Calculate
		var atk : number = card.getAtk();
		var hp : number = card.getHp();
		var action = null;
		if (rule.type == RuleType.attack) action = TurnActionType.attack;
		else if (rule.type == RuleType.poisonAttack) action = TurnActionType.poison;
		else if (rule.type == RuleType.heal || RuleType.continueHeal) action = TurnActionType.heal;
		else if (rule.type == RuleType.support) action = TurnActionType.support;

		var cardRules = this.battleTurns[card.name].rules
						.filter((r:Rule)=>r.isConditionsFulfilled(card, this.team, action, attackType, currentTurn));
		var ourBuffs = this.filterBuffs(cardRules, rule.type, attackType);
		var enemyRules = this.enemyBattleTurn.rules
						.filter((r:Rule)=>r.isConditionsFulfilled(card, this.team, action, attackType, currentTurn));
		var enemyBuffs = this.filterBuffs(enemyRules, rule.type, attackType, true);
		var buffs : Rule[] = [];
		var debuffs : Rule[] = [];
		var supportBuff = 0;
		for (var buff of ourBuffs){
			var applyCount = buff.getConditionFulfillTimes(card, this.team, action, attackType, currentTurn);
			if ((buff.value as string).endsWith("%")){
				buffs[buff.type] = (buffs[buff.type] || 0) + (Battle.getNumber(buff.value as string) * applyCount);
			}
			else{
				supportBuff += (Battle.getNumber(buff.value as string) * applyCount);
			}
		}
		for (var buff of enemyBuffs){
			var applyCount = buff.getConditionFulfillTimes(card, this.team, action, attackType, currentTurn);
			debuffs[buff.type] = (debuffs[buff.type] || 0) + (Battle.getNumber(buff.value as string) * applyCount);
			if (isAddRuleLog && applyCount > 0){
				this.battleTurns[card.name].addRuleLog(this.currentTurn, buff, applyCount);
			}
		}

		if (isAddRuleLog){
			var logRules = this.filterBuffsForLog(cardRules, rule.type, attackType);
			for (var buff of logRules){
				var applyCount = buff.getConditionFulfillTimes(card, this.team, action, attackType, currentTurn);
				if (applyCount > 0){
					this.battleTurns[card.name].addRuleLog(this.currentTurn, buff, applyCount);
				}
			}
			logRules = this.filterBuffsForLog(this.enemyBattleTurn.rules, rule.type, attackType);
			for (var buff of logRules){
				var applyCount = buff.getConditionFulfillTimes(card, this.team, action, attackType, currentTurn);
				if (applyCount > 0){
					this.battleTurns[card.name].addRuleLog(this.currentTurn, buff, applyCount);
				}
			}
		}

		var hitCount = rule.maxCount || 1;
		var outputVal = 0;
		if (rule.valueBy == RuleValueByType.hp){
			outputVal = Math.floor((Math.floor(hp * (1 + Battle.getNumber(buffs[RuleType.hpUp])))) * Battle.getNumber(rule.value));
		}
		else{
			outputVal = Math.floor((Math.floor(atk * (1 + Battle.getNumber(buffs[RuleType.atkUp]))) + supportBuff) * Battle.getNumber(rule.value));
		}
		// Support
		if (rule.type == RuleType.support){
			var targetNames = rule.getRuleApplyTarget(this.team, card);
			for (var targetName of targetNames){
				var newRule = rule.cloneSimpleChild();
				newRule.type = RuleType.atkUp;
				newRule.value = outputVal.toString();
				newRule.condition = null;
				newRule.target = null;
				this.battleTurns[targetName].addRule(newRule);
			}
		}
		
		for (var key of Object.keys(buffs)){
			if (key != RuleType.atkUp){
				outputVal = Math.floor(outputVal * (1 + Battle.getNumber(buffs[key])));
			}
		}
		// Poison
		if (rule.type == RuleType.poisonAttack){
			var newRule = new Rule({type: RuleType.poisonAttackState, parentCardName: card.name, value: outputVal, turn: rule.turn});
			this.enemyBattleTurn.addRule(newRule);
		}
		// Cont. Heal
		else if (rule.type == RuleType.continueHeal){
			var newRule = new Rule({type: RuleType.continueHealState, parentCardName: card.name, value: outputVal, turn: rule.turn});
			this.battleTurns[card.name].addRule(newRule);
		}

		var enemyDamageVal = outputVal;
		for (var key of Object.keys(debuffs)){
			enemyDamageVal = Math.floor(enemyDamageVal * (1 + Battle.getNumber(debuffs[key])));
		}

		if (rule.type == RuleType.support){
			for (var i = 0; i < rule.turn; i++){
				this.battleTurns[card.name].outputs[rule.type][currentTurn+i] = (this.battleTurns[card.name].outputs[rule.type][currentTurn+i] || 0) + outputVal;
				this.battleTurns[card.name].enemyDamage[rule.type][currentTurn+i] = (this.battleTurns[card.name].enemyDamage[rule.type][currentTurn+i] || 0) + outputVal;
				this.battleTurns[card.name].addRuleLog(currentTurn+i, rule);
			}
		}
		else if (rule.type == RuleType.poisonAttack || rule.type == RuleType.continueHeal){
			for (var i = 0; i < rule.turn; i++){
				this.battleTurns[card.name].addRuleLog(currentTurn+i, rule);
			}
		}
		else{
			this.battleTurns[card.name].outputs[rule.type][currentTurn] = (this.battleTurns[card.name].outputs[rule.type][currentTurn] || 0) + outputVal * hitCount;
			this.battleTurns[card.name].enemyDamage[rule.type][currentTurn] = (this.battleTurns[card.name].enemyDamage[rule.type][currentTurn] || 0) + enemyDamageVal * hitCount;
			this.battleTurns[card.name].addRuleLog(currentTurn, rule, hitCount);
		}
	}

	getTurnValue(cardname: string, turn: number) : number{
		var card: Card = this.team.getCard(cardname);
		var battleTurn = this.battleTurns[cardname];
		var output = 0;

		var ruleType : RuleType[] = [];
		if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ALL){
			if (card.class == Class.Striker || card.class == Class.Guardian || card.class == Class.Saboteur){
				ruleType.push(RuleType.attack);
				ruleType.push(RuleType.poisonAttack);
			}
			else if (card.class == Class.Healer){
				ruleType.push(RuleType.heal);
				ruleType.push(RuleType.continueHeal);
			}
			else if (card.class == Class.Support){
				ruleType.push(RuleType.support);
			}
		}
		else if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_ATTACK){
			ruleType.push(RuleType.attack);
		}
		else if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_POISON){
			ruleType.push(RuleType.poisonAttack);
		}
		else if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_HEAL){
			ruleType.push(RuleType.heal);
			ruleType.push(RuleType.continueHeal);
		}
		else if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_SUPPORT){
			ruleType.push(RuleType.support);
		}
		else if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_DAMAGE){
			ruleType.push(RuleType.attack);
			ruleType.push(RuleType.poisonAttack);
		}

		for (var type of ruleType){
			if (this.printEnemeyOption && (type == RuleType.attack || type == RuleType.poisonAttack)){
				var enemyDamage = battleTurn.enemyDamage[type][turn] | 0;
				if (this.enemyElement != Element.NA && type == RuleType.attack){
					enemyDamage = Math.floor(enemyDamage * Battle.getElementalBuff(card.element, this.enemyElement));
				}
				output += enemyDamage;
			}
			else{
				output += battleTurn.outputs[type][turn] | 0;
			}
		}
		return output;
	}

	getTotalValue(cardname: string, outputOption? : string) : number{
		var card: Card = this.team.getCard(cardname);
		var battleTurn = this.battleTurns[cardname];
		var output = 0;

		if (outputOption == null){
			outputOption = this.printOutputOption;
		}

		var ruleType : RuleType[] = [];
		if (outputOption == Battle.PRINT_OUTPUT_OPTION.ALL){
			if (card.class == Class.Striker || card.class == Class.Guardian || card.class == Class.Saboteur){
				ruleType.push(RuleType.attack);
				ruleType.push(RuleType.poisonAttack);
			}
			else if (card.class == Class.Healer){
				ruleType.push(RuleType.heal);
				ruleType.push(RuleType.continueHeal);
			}
			else if (card.class == Class.Support){
				ruleType.push(RuleType.support);
			}
		}
		else if (outputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_ATTACK){
			ruleType.push(RuleType.attack);
		}
		else if (outputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_POISON){
			ruleType.push(RuleType.poisonAttack);
		}
		else if (outputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_HEAL){
			ruleType.push(RuleType.heal);
			ruleType.push(RuleType.continueHeal);
		}
		else if (outputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_SUPPORT){
			ruleType.push(RuleType.support);
		}
		else if (outputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_DAMAGE){
			ruleType.push(RuleType.attack);
			ruleType.push(RuleType.poisonAttack);
		}

		for (var turn=1; turn <= this.turns; turn++){
			for (var type of ruleType){
				if (this.printEnemeyOption && (type == RuleType.attack || type == RuleType.poisonAttack)){
					var enemyDamage = battleTurn.enemyDamage[type][turn] | 0;
					if (this.enemyElement != Element.NA && type == RuleType.attack){
						enemyDamage = Math.floor(enemyDamage * Battle.getElementalBuff(card.element, this.enemyElement));
					}
					output += enemyDamage;
				}
				else{
					output += battleTurn.outputs[type][turn] | 0;
				}
			}
		}
		return output;
	}

	getTeamTotalValue() : number{
		var output = 0;
		var printOutputOption = this.printOutputOption;
		if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ALL){
			printOutputOption = Battle.PRINT_OUTPUT_OPTION.ONLY_DAMAGE;
		}
		for (var card of this.team.cards){
			output += this.getTotalValue(card.name, printOutputOption);
		}
		return output;
	}

	getTeamTotalDamage() : number{
		var output = 0;
		for (var card of this.team.cards){
			output += this.getTotalValue(card.name, Battle.PRINT_OUTPUT_OPTION.ONLY_DAMAGE);
		}
		return output;
	}

	getTurnAction(cardname: string, turn: number) : AttackType{
		return this.battleTurns[cardname].action[turn];
	}

	// TODO: should simplify those ugly if-else code for different rule types
	getTurnRuleLog(cardname: string, turn: number) : Rule[]{
		var attackType : AttackType = this.battleTurns[cardname].action[turn];
		var rules : Rule[] = this.battleTurns[cardname].ruleLog[turn];
		var hasAttack = rules.map(e=>e.type).includes(RuleType.attack);
		var hasPoisonAttack = rules.map(e=>e.type).includes(RuleType.poisonAttack);
		var hasHeal = rules.map(e=>e.type).includes(RuleType.heal);
		var hasContHeal = rules.map(e=>e.type).includes(RuleType.continueHeal);

		var acceptTypes : RuleType[] = [RuleType.attack, RuleType.poisonAttack, RuleType.support, RuleType.continueHeal, RuleType.heal];
		if (hasAttack){
			if (attackType == AttackType.BasicAttack){
				acceptTypes = acceptTypes.concat([RuleType.atkUp, RuleType.basicAtkUp, RuleType.allAtkUp, RuleType.enemyBasicAtkUp, RuleType.enemyElementAtkUp, RuleType.enemyAllAtkUp]);
			}
			else if (attackType == AttackType.SkillAttack){
				acceptTypes = acceptTypes.concat([RuleType.atkUp, RuleType.skillAtkUp, RuleType.allAtkUp, RuleType.enemySkillAtkUp, RuleType.enemyElementAtkUp, RuleType.enemyAllAtkUp]);
			}
		}
		if (hasPoisonAttack){
			acceptTypes = acceptTypes.concat([RuleType.atkUp, RuleType.allAtkUp, RuleType.poisonAtkUp, RuleType.enemyPoisonAtkUp, RuleType.enemyAllAtkUp]);
		}
		if (hasHeal){
			if (attackType == AttackType.BasicAttack){
				acceptTypes = acceptTypes.concat([RuleType.atkUp, RuleType.basicAtkUp, RuleType.healUp, RuleType.partyHealUp, RuleType.partyAllHealUp]);
			}
			else if (attackType == AttackType.SkillAttack){
				acceptTypes = acceptTypes.concat([RuleType.atkUp, RuleType.skillAtkUp, RuleType.healUp, RuleType.partyHealUp, RuleType.partyAllHealUp]);
			}
		}
		if (hasContHeal){
			acceptTypes = acceptTypes.concat([RuleType.atkUp, RuleType.continueHealUp, RuleType.partyContinueHealUp]);
		}

		rules = rules.filter(function(rule : Rule){
			return acceptTypes.includes(rule.type);
		});
		rules = this.filterRulesByPrintOption(rules);

		// Sort rules - move poison / cont. heal to end
		for (var index = rules.length-1; index>=0; index--){
			var rule = rules[index];
			if ((rule.type == RuleType.continueHeal || rule.type == RuleType.poisonAttack) && (index != rules.length-1)){
				rules.splice(index, 1);
				rules.push(rule);
			}
		}

		return rules;
	}

	private filterRulesByPrintOption(rules : Rule[]){
		var acceptTypes = [];
		var hasAttack = rules.map(e=>e.type).includes(RuleType.attack);
		var hasPoisonAttack = rules.map(e=>e.type).includes(RuleType.poisonAttack);
		var hasHeal = rules.map(e=>e.type).includes(RuleType.heal);
		var hasContHeal = rules.map(e=>e.type).includes(RuleType.continueHeal);

		if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ALL){
			return rules;
		}
		else if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_SUPPORT){
			acceptTypes = [RuleType.support];
		}
		else{
			if (hasAttack && [Battle.PRINT_OUTPUT_OPTION.ONLY_ATTACK, 
				Battle.PRINT_OUTPUT_OPTION.ONLY_DAMAGE].includes(this.printOutputOption)){
				acceptTypes = acceptTypes.concat([RuleType.attack, RuleType.atkUp, RuleType.basicAtkUp, RuleType.skillAtkUp, RuleType.allAtkUp,
								RuleType.enemyBasicAtkUp, RuleType.enemySkillAtkUp, RuleType.enemyElementAtkUp, RuleType.enemyAllAtkUp]);
			}
			if (hasPoisonAttack && [Battle.PRINT_OUTPUT_OPTION.ONLY_POISON, 
				Battle.PRINT_OUTPUT_OPTION.ONLY_DAMAGE].includes(this.printOutputOption)){
				acceptTypes = acceptTypes.concat([RuleType.poisonAttack, RuleType.atkUp, RuleType.poisonAtkUp, RuleType.allAtkUp,
								RuleType.enemyPoisonAtkUp, RuleType.enemyAllAtkUp]);
			}
			if (hasHeal && [Battle.PRINT_OUTPUT_OPTION.ONLY_HEAL].includes(this.printOutputOption)){
				acceptTypes = acceptTypes.concat([RuleType.heal, RuleType.healUp, RuleType.atkUp, RuleType.basicAtkUp, RuleType.skillAtkUp]);
			}
			if (hasContHeal && [Battle.PRINT_OUTPUT_OPTION.ONLY_HEAL].includes(this.printOutputOption)){
				acceptTypes = acceptTypes.concat([RuleType.continueHeal, RuleType.continueHealUp, RuleType.atkUp]);
			}
		}

		if (!this.printEnemeyOption){
			var removeTypes = [RuleType.enemyBasicAtkUp, RuleType.enemySkillAtkUp, RuleType.enemyPoisonAtkUp, RuleType.enemyElementAtkUp, RuleType.enemyAllAtkUp];
			acceptTypes = acceptTypes.filter(e=>!removeTypes.includes(e));
		}

		rules = rules.filter(function(rule : Rule){
			return acceptTypes.includes(rule.type);
		});
		return rules;
	}

	getTurnRuleLogStr(cardname: string, turn: number) : string{
		var rules = this.getTurnRuleLog(cardname, turn);
		return rules.map(r=>r.toString()).join('\n');
	}

	static getElementalBuff(e1 : Element, e2 : Element){
		if ((e1 == Element.Fire && e2 == Element.Water) || (e1 == Element.Water && e2 == Element.Wood) || (e1 == Element.Wood && e2 == Element.Fire)){
			return 0.8;
		}
		else if ((e1 == Element.Fire && e2 == Element.Wood) || (e1 == Element.Water && e2 == Element.Fire) || (e1 == Element.Wood && e2 == Element.Water)
			|| (e1 == Element.Light && e2 == Element.Dark) || (e1 == Element.Dark && e2 == Element.Light)){
			return 1.2;
		}
		return 1;
	}

	printResult(){
		console.info('角色\t' + this.team.cards.map(e=>e.name).join('\t'));
		console.info('星數\t' + this.team.cards.map(e=>e.star).join('\t'));
		console.info('HP\t' + this.team.cards.map(e=>e.getHp()).join('\t'));
		console.info('ATK\t' + this.team.cards.map(e=>e.getAtk()).join('\t'));
		console.info('普攻\t' + this.team.cards.map(e=>e.attackRule).join('\t'));
		console.info('必殺\t' + this.team.cards.map(e=>e.skillRule).join('\t'));
		console.info('3星\t' + this.team.cards.map(e=>e.star3Rule).join('\t'));
		console.info('5星\t' + this.team.cards.map(e=>e.star5Rule).join('\t'));
		console.info('潛6\t' + this.team.cards.map(e=>e.pot6Rule).join('\t'));
		console.info();
		
		var totalOutput = [];
		var totalEnemyDamage = [];
		for (var card of this.team.cards){
			totalOutput[card.name] = 0;
			totalEnemyDamage[card.name] = 0;
		}

		for (var turn=1; turn <= this.turns; turn++){
			var s = turn + '\t';
			for (var card of this.team.cards){
				s += this.getTurnValue(card.name, turn) + '\t';
			}
			console.info(s);
		}

		var summary = '總計\t';
		for (var card of this.team.cards){
			summary += this.getTotalValue(card.name) + '\t';
		}

		console.info(summary);
		console.info('隊伍總數\t'+this.getTeamTotalValue());
	}

	private static getNumber(val: any) : number{
		var num : number = 0;
		if (typeof val == 'string' && val.endsWith("%")){
			val = val.substring(0, val.indexOf("%"));
			num = +val.trim() / 100;
		}
		else if (typeof val == 'string' || typeof val == 'number'){
			num = +val;
		}
		
		return num;
	}
}


export class Team{
	cards: Card[] = [];
	position: string[] = [];
	actionOrder: string[] = [];
    team: any;

	reset(){
		this.cards = [];
		this.position = [];
		this.actionOrder = [];
	}

	addCard(card : Card){
		if (card != null){
			this.cards.push(card);
		}
		this.position[this.cards.length] = card.name;
		this.actionOrder[this.cards.length-1] = card.name;
	}

	updateActionOrder(names : string[]){
		this.actionOrder = names;
	}

	getCard(name: string) : Card | null {
		var result = this.cards.filter(e=> e.name == name);
		return result.length > 0 ? result[0] : null;
	}

	getCardByPos(posArr: number[]) : Card[]{
		var cards : Card[] = [];
		for (var pos of posArr){
			if (this.cards.length >= pos){
				cards.push(this.getCard(this.position[pos]));
			}
		}
		return cards;
	}

	getCardByActionOrder() : Card[]{
		var cards : Card[] = [];
		for (var name of this.actionOrder){
			cards.push(this.getCard(name));
		}
		return cards;
	}

	getCharCount(char : string) : number{
		return this.cards.filter(e=> e.char == char).length;
	}

	hasChar(char : string) : boolean{
		return this.getCharCount(char) > 0;
	}

	getClassCount(cardClass : Class) : number{
		return this.cards.filter(e=> e.class == cardClass).length;
	}

	hasClass(cardClass : Class) : boolean{
		return this.getClassCount(cardClass) > 0;
	}

	getElementCount(element : string) : number{
		return this.cards.filter(e=> e.element == element).length;
	}

	hasElement(element : string) : boolean{
		return this.getElementCount(element) > 0;
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
		var value = this.value;
		var exceptStr = this.exceptType != null ? this.exceptValue != null ? this.exceptValue : this.exceptType : '';
		if (exceptStr.length > 0) exceptStr = '（除了' + exceptStr + '）';

		if (value == null){
			return type + exceptStr;
		}
		return value.toString() + exceptStr;
	}
}

export class Rule{
	id: number;
	parentCardName: string;

	isPassive: boolean;
	type: RuleType;
	value: string | Rule;
	valueBy: RuleValueByType;
	turn: number ;
	maxCount: number;
	target: RuleTarget | null = null;
	condition: Condition[] | null = null ;

	static idCounter: number = 0;
	static BATTLE_INIT_RULE_ID: number = 10000;
	static CHILD_RULE_ID_INCREMENT: number = 300000;

	static createId(){
		return Rule.idCounter++;
	}

	constructor({id = null, parentCardName = "", isPassive=false, type=RuleType.attack as RuleType as string, value, valueBy = RuleValueByType.atk as RuleValueByType, turn=50, maxCount=1, condition=null, target=null}){
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
		this.maxCount = maxCount;
		if (condition == null || Array.isArray(condition)){
			this.condition = condition;
		}
		else{
			this.condition = [condition];
		}
		this.target = target;
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

	public clone(){
		var cloneRule = new Rule({id: this.id, parentCardName: this.parentCardName, isPassive: this.isPassive, type: this.type, value: this.value, valueBy: this.valueBy,
			turn: this.turn, maxCount: this.maxCount, condition: this.condition, target: this.target});
		if (this.condition != null){
			cloneRule.condition = this.condition;
		}
		return cloneRule;
	}

	public cloneSimpleChild(){
		var cloneRule = this.clone();
		cloneRule.id += Rule.CHILD_RULE_ID_INCREMENT;
		return cloneRule;
	}

	// Not passive
	public cloneSimple(){
		var cloneRule = new Rule({id: this.id, parentCardName: this.parentCardName, isPassive: false, type: this.type, value: this.value, valueBy: this.valueBy,
			turn: this.turn, maxCount: this.maxCount, condition: this.condition, target: this.target});
		if (this.condition != null){
			cloneRule.condition = this.condition;
		}
		return cloneRule;
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

	static loadRule({isPassive=false, type=RuleType.attack as RuleType as string, value, valueBy=RuleValueByType.atk as RuleValueByType, turn=1, maxCount=1, condition=null, target=null}) : Rule{
		if (type == RuleType.appendRule || type == RuleType.enemyAppendRule){
			value = Rule.loadRule(value);
		}

		var conditionArr = null;
		if (condition != null){
			conditionArr = [];
			if (Array.isArray(condition)){
				for (var item of condition){
					conditionArr.push(new Condition(item.type, item.value, item.minCount));
				}
			}
			else if (typeof condition == 'string'){
				conditionArr.push(new Condition(condition as ConditionType, null, null));
			}
			else{
				conditionArr.push(new Condition(condition.type, condition.value, condition.minCount));
			}
		}

		var targetItem = null;
		if (target != null){
			if (typeof target == 'string'){
				target = {type: target};
			}
			targetItem = RuleTarget.loadTarget(target);
		}


		var rule = new Rule({isPassive: isPassive, type: type, value:value, valueBy: valueBy, turn: turn, maxCount: maxCount, condition: conditionArr, target: targetItem});
		return rule;
	}

	static loadSimpleRule({type=RuleType.attack as RuleType as string, value, valueBy=RuleValueByType.atk as RuleValueByType, turn=1, maxCount=1, condition=null, target=null}) : Rule{
		var isPassive = false;
		return Rule.loadRule({isPassive, type, value, valueBy, turn, maxCount, condition, target});
	}
	static loadPermRule({type=RuleType.attack as RuleType as string, value, valueBy=RuleValueByType.atk as RuleValueByType, turn=ALWAYS_EFFECTIVE, maxCount=1, condition=null, target=null}) : Rule{
		var isPassive = true;
		return Rule.loadRule({isPassive, type, value, valueBy, turn, maxCount, condition, target});
	}
}

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


export class Condition{
	type: ConditionType;
	value: number | number[] | string | Class | AttackType;
	minCount: number;

	// can only check after battle start
	static CHECK_IN_BATTLE_LIST : ConditionType[] = [ConditionType.isAttackType, ConditionType.isAttack, ConditionType.everyTurn, ConditionType.atTurn];

	static IS_HP_FULFILL : boolean = true;

	constructor(type: ConditionType, value: number | number[] | string | Class | AttackType, minCount: number = 1){
		this.type = type;
		this.value = value;
		if (minCount != null){
			this.minCount = minCount;
		}
	}
	
	isFulfilled(card: Card, team: Team, turnAction: TurnActionType, charAttackType : AttackType, currentTurn: number) : boolean{
		if (this.type == ConditionType.hasChar || this.type == ConditionType.charCount){
			return team.getCharCount(this.value.toString()) >= this.minCount;
		}
		else if (this.type == ConditionType.hasClass || this.type == ConditionType.classCount){
			return team.getClassCount(this.value as Class) >= this.minCount;
		}
		else if (this.type == ConditionType.hasElement || this.type == ConditionType.elementCount){
			return team.getElementCount(this.value.toString()) >= this.minCount;
		}
		else if (this.type == ConditionType.hpHigher || this.type == ConditionType.hpLower){
			return Condition.IS_HP_FULFILL;
		}
		else if (this.type == ConditionType.isAttackType){
			return (this.value as AttackType) == charAttackType;
		}
		else if (this.type == ConditionType.isAttack){
			return charAttackType == AttackType.BasicAttack || charAttackType == AttackType.SkillAttack;
		}
		else if (this.type == ConditionType.everyTurn){
			return ((currentTurn-1) % (this.value as number)) == 0;
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
				return (this.value as string) == card.char;
			}
		}
		else if (this.type == ConditionType.enemyIsAttackByClass){
			if (turnAction == TurnActionType.attack){
				return (this.value as string) == card.class;
			}
		}
		else if (this.type == ConditionType.enemyIsAttackByElement){
			if (turnAction == TurnActionType.attack){
				return (this.value as string) == card.element;
			}
		}
		return false;
	}

	getFulfillTimes(card: Card, team: Team, turnAction: TurnActionType, charAttackType : AttackType, currentTurn: number): number{
		if (this.type == ConditionType.charCount){
			return team.getCharCount(this.value.toString());
		}
		else if (this.type == ConditionType.classCount){
			return team.getClassCount(this.value as Class);
		}
		else if (this.type == ConditionType.elementCount){
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
		var minCount = this.minCount > 1 ? this.minCount + '名' : '';
		if (type == ConditionType.charCount){
			return type.replace('角色', '1名「'+value.toString() + '」');
		}
		else if (type == ConditionType.classCount){
			return type.replace('定位', '1名「'+value.toString() + '」');
		}
		else if (type == ConditionType.elementCount){
			return type.replace('屬性', '1名「'+value.toString() + '」');
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