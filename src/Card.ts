import { Class, Element, Rarity, PotentialType, GAME_CONFIG } from './Constants.js';
import { Rule } from './CardRule.js';
import { Util } from './util/Util.js';

export class Card{
	name: string;
	fullname: string;
    char: string;
	rarity: Rarity;
	class: Class;
	element: Element;
	potType: PotentialType;

	phase: string[] = [];

	baseHp: number ;
	baseAtk: number ;

	hp: number;
	atk: number;
	currentHp: number = 100; // percentage

	level: number = 60;
	star: number = 5;
	bond: number = 5;
	potential: number = 12;
	coolDown: number;

	img: string;

	star3Rule: Rule[] = [];
	star5Rule: Rule[] = [];
	pot6Rule: Rule[] = [];
	pot12Rule: Rule[] = [];

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

	hasPhase(phase: string | string[]) : boolean{
		var phaseArr = Array.isArray(phase) ? phase : [phase];
		return phaseArr.findIndex( p => this.phase.includes(p)) != -1;
	}
	setPhase(phase: string | string[]){
		var phaseArr = Array.isArray(phase) ? phase : [phase];
		this.phase = [];
		phaseArr.forEach( p => this.phase.push(p));
	}
	addPhase(phase: string){
		this.phase.push(phase);
	}
	removePhase(phase: string){
		this.phase = this.phase.filter(e=>e != phase);
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
			if (this.potential >= 12){
				ruleArr.concat(this.pot12Rule);
			}
		}
		else {
			if (this.potential >= 3){
				ruleArr.concat(this.pot6Rule);
			}
			if (this.potential >= 6){
				ruleArr.concat(this.pot12Rule);
			}
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
			var bondVals = GAME_CONFIG.ROOM.DEFAULT;
			if (this.rarity == Rarity.SSR){
				bondVals = GAME_CONFIG.ROOM.SSR;
			}
			bondVal = bondVals.slice(0, this.bond).reduce((sum, e) => sum + e, 0);
		}
		val = Math.floor(val * Math.pow(1.05, this.level-1) * (1+bondVal/100) * (1+potential/100));

		return val;
	}

	getAtk() : number{
		if (this.atk != null){
			return Math.floor(this.atk);
		}
		if (this.baseAtk == null){
			return 0;
		}
		return this.getCardVal(this.baseAtk, this.getAtkPotential());
	}

	getHp() : number{
		if (this.hp != null){
			return Math.floor(this.hp);
		}
		if (this.baseHp == null){
			return 0;
		}
		return this.getCardVal(this.baseHp, this.getHpPotential());
	}

	getBp() : number{
		return Math.floor(this.getHp() + (this.getAtk() * 5));
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
		var permRules = ['star3Rule', 'star5Rule', 'pot6Rule', 'pot12Rule'];
		for (var key of Object.keys(data)) {
			if (simpleRules.includes(key) || permRules.includes(key)){
				var isPermRule = permRules.includes(key);
				card[key] = [];
				for (var ruleItem of data[key]){
					var rule = Rule.loadRule(ruleItem, isPermRule);
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

	addCard(card : Card, pos: number){
		if (card == null){
			return;
		}
		
		this.cards.push(card);
		this.actionOrder[this.cards.length-1] = card.name;

		if (pos != null){
            this.position[pos] = card.name;
        }
        else{
            this.position[this.cards.length] = card.name;
        }
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
			if (this.position.length >= pos){
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

	getBattlePower() : number{
		return this.cards.reduce((sum, card) => sum + card.getBp(), 0);
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

export class CardCenter{
	private static cardData: {} = {};
	private static userCardData: {} = {};
	private static enemyCardData: {} = {};
	private static userEnemyCardData: {} = {};

	static setMainCardData(obj:{}){
		CardCenter.cardData = obj;
	}
	static addUserCardData(newObj:{}){
		CardCenter.concatData(CardCenter.userCardData, newObj);
	}

	static setEnemyData(obj:{}){
		CardCenter.enemyCardData = obj;
	}
	static addUserEnemyData(newObj:{}){
		CardCenter.concatData(CardCenter.userEnemyCardData, newObj);
	}
	static getEnemyData(){
		if (Object.keys(CardCenter.userEnemyCardData).length === 0){
			return CardCenter.enemyCardData;
		}
		var fullCardData = JSON.parse(JSON.stringify(CardCenter.enemyCardData));
		fullCardData = CardCenter.concatData(fullCardData, CardCenter.userEnemyCardData);
		return fullCardData;
	}
	static getEnemyList(){
		var activeEnemyNames = [];
		for (const [name, data] of Object.entries(CardCenter.getEnemyData())){
			if (data['active'] === 'true'){
				activeEnemyNames.push(name);
			}
		}
		return activeEnemyNames;
	}
	static getEnemyCard(key: string){
		var fullEnemyData = CardCenter.getEnemyData();
		if (fullEnemyData[key] != null){
			return EnemyCard.loadCardFromJson(key, fullEnemyData[key]);
		}
		return null;
	}

	private static concatData(o1:{}, o2:{}) : {}{
		for (var key of Object.keys(o2)){
			o1[key] = o2[key];
		}
		return o1;
	}

	static getCardData(){
		if (Object.keys(CardCenter.userCardData).length === 0){
			return CardCenter.cardData;
		}
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

export class EnemyCard extends Card{
	active: boolean = false;
	remainHp: number;
	lowestHp: number; // For record the lowest HP interval (Eg. remain HP can higher after heal)

	hpLock: string[] = [];
	battleHpLock: string[] = [];

	shield: number = 0;
	isGuard: false;
	guardPercent: 50;

	static loadCardFromJson(name: string, data:Object) : EnemyCard {
		var card = new EnemyCard();
		card.name = name;
		card = EnemyCard.updateCard(card, data);
		return card;
	}

	updateCard(data: Object) : EnemyCard{
		return EnemyCard.updateCard(this, data);
	}

	static updateCard(card: EnemyCard, data:Object) : EnemyCard {
		var simpleRules = ['attackRule', 'skillLv1Rule', 'skillLv2Rule', 'skillLv3Rule'];
		var permRules = ['star3Rule', 'star5Rule', 'pot6Rule', 'pot12Rule'];
		for (var key of Object.keys(data)) {
			if (simpleRules.includes(key) || permRules.includes(key)){
				var isPermRule = permRules.includes(key);
				card[key] = [];
				for (var ruleItem of data[key]){
					var rule = Rule.loadRule(ruleItem, isPermRule);
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

	addRemainHp(val: number){
		if (this.remainHp + val >= this.hp){
			this.remainHp = this.hp;
			this.currentHp = 1;
		}
		else{
			this.remainHp += val;
			this.currentHp = this.remainHp / this.hp;
		}
	}
	minusRemainHp(val: number){
		var nextLockHpVal = 0;
		var nextLockHpPercent = 0;

		if (this.battleHpLock.length > 0){
			nextLockHpPercent = Util.getNumber(this.battleHpLock[0]);
			nextLockHpVal = Math.floor(this.hp * nextLockHpPercent);
		}

		if (this.remainHp - val <= nextLockHpVal){
			this.remainHp = nextLockHpVal;
			this.currentHp = nextLockHpPercent;
		}
		else{
			this.remainHp -= val;
			this.currentHp = this.remainHp / this.hp;
		}

		this.lowestHp = this.remainHp;
	}
}