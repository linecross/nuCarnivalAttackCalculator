import { Character, Rarity, Class, Element, AttackType, ActionPattern, CounterAttackMode, ConditionHPStatus } from '/build/Constants.js';
import { Battle } from '/build/BattleSystem.js';
import { Team, Card, CardCenter } from '/build/Card.js';
import { LogRule } from '/build/LogRule.js';
import { UIConfig } from './config.js';

var { NA, ...ELEMENT_MAP } = Element;


export default {
	getCardnameByChar(char){
		return CardCenter.getCardNameByChar(char);
	},
	getEnemyNames(){
		if (this.userInput.enemyName == '' || CardCenter.getEnemyList().length == 0){
			return ["N/A"];
		}
		var enemyList = CardCenter.getEnemyList();
		enemyList.unshift("N/A");
		return enemyList;
	},
	hasActiveEnemy(){
		return CardCenter.getEnemyList().length > 0;
	},
	loadCurrentEnemyJson(){
		if (this.userInput.enemyCard == null){
			return;
		}
		var enemyJson = {};
		enemyJson[this.userInput.enemyName] = CardCenter.getEnemyData()[this.userInput.enemyName];
		this.inputJson = JSON.stringify(enemyJson, null, 2);
		this.switchTab('JSON');
	},
	loadCards(){
		for (var i =0; i<this.userInput.cardname.length; i++){
			var name = this.userInput.cardname[i];
			if (name != '' && (this.cards[i] == null || this.cards[i].name != name)){
				var card = CardCenter.loadCard(name);
				if (this.userInput.defaultStar == 'FULL'){
					card.star = 5;
				}
				if (this.userInput.defaultStar == 'SSR3'){
					if (card.rarity == 'SSR') card.star = 3;
					else card.star = 5;
				}
				else if (this.userInput.defaultStar == 'SSR1'){
					if (card.rarity == 'SSR') card.star = 1;
					else if (card.rarity == 'SR') card.star = 3;
					else card.star = 5;
				}

				this.cards[i] = card;
			}
		}

		this.setupBattle();
	},
	getCardnameByActionOrder(){
		var arr = [];
		for (var i =0; i<this.userInput.cardname.length; i++){
			var name = this.userInput.cardname[i];
			var order = this.userInput.cardActionOrder[i];
			if (name != null && name != '' && this.userInput.isCardEnabled[i]){
				arr.push({name: name, order: order});
			}
		}
		arr = arr.sort((e1, e2)=>e1.order - e2.order).map(e=>e.name);
		return arr;
	},
	getCardnameByTurnActionOrder(){
		var fullArr = [];
		for (var turn=1; turn<=this.userInput.turns; turn++){
			if (this.userInput.cardCustomTurnActionOrder[turn] == undefined){
				continue;
			}
			var arr = [];
			for (var i =0; i<this.userInput.cardname.length; i++){
				var name = this.userInput.cardname[i];
				var order = this.userInput.cardCustomTurnActionOrder[turn][i];
				if (name != null && name != '' && this.userInput.isCardEnabled[i]){
					arr.push({name: name, order: order});
				}
			}
			arr = arr.sort((e1, e2)=>e1.order - e2.order).map(e=>e.name);
			fullArr[turn] = arr;
		}
		
		return fullArr;
	},
	removeCard(idx){
		if (idx >= 0 && idx <=5){
			this.userInput.cardname[idx] = '';
			this.cards[idx] = null;
			this.setupBattle();
		}
	},
	setupBattle(){
		var team = new Team();
		for (var i =0; i<this.userInput.cardname.length; i++){
			var card = this.cards[i];
			if (card != null && this.userInput.isCardEnabled[i]){
				team.addCard(card, i+1);
			}
		}
		
		if (team.cards.length == 0){
			this.battle = null;
		}
		else{
			this.battle = new Battle(team, this.userInput.turns);
			this.updateBattle();
		}
	},
	updateBattle(){
		if (this.battle == null){
			return;
		}
		this.battle.team.updateActionOrder(this.getCardnameByActionOrder());
		if (this.userInput.cardCustomTurnActionOrder.length > 0){
			this.battle.team.updateActionOrderByTurn(this.getCardnameByTurnActionOrder());
		}

		this.battle.counterAttackCount = this.userInput.maxCounterAttack;
		this.battle.counterAttackMode = this.userInput.counterAttackMode;
		this.battle.enemyCard = this.userInput.enemyCard;
		this.battle.enemyElement = this.userInput.enemyElement;
		this.battle.printEnemeyOption = this.userInput.isCalcEnemyDebuff;
		this.battle.printOutputOption = this.userInput.printOutputMode;
		this.battle.init();
		
		for (var i=0; i<this.cards.length; i++){
			var card = this.cards[i];

			if (card != null){
				card.limitLevel = this.userInput.limitLevel;
			}

			if (this.isCardInBattle(card)){
				this.battle.setActionPattern(card.name, this.userInput.cardActionPattern[i]);

				if (this.userInput.cardActionPattern[i] == ActionPattern.Manual || this.userInput.cardActionPattern[i] == ActionPattern.BruteForce){
					var skillArr = this.getManualAttackTypeArr(this.userInput.cardManualAction[i], 'S');
					var guardArr = this.getManualAttackTypeArr(this.userInput.cardManualAction[i], 'G');
					this.battle.setManualActionPattern(card.name, skillArr, guardArr);
				}
			}
		}

		this.battle.startBattle();
		this.updateChart();
	},
	getBattleTurnValue(cardname, turn){
		return this.battle.getTurnValue(cardname, turn);
	},
	getBattleTeamTurnValue(turn){
		return this.battle.getTeamTurnValue(turn);
	},
	getBattleTotalValue(cardname){
		return this.battle.getTotalValue(cardname);
	},
	getBattleTeamTotalValue(){
		return this.battle.getTeamTotalValue();
	},
	getBattleTurnRuleLogStr(cardname, turn){
		var ruleLogs = this.battle.getTurnRuleLog(cardname, turn);
		var ruleStrList = [];
		var title = '<span class="info-title"><b><u>【'+cardname+'（T' + turn+'）】</u></b><span><br/>';
		for (var rule of ruleLogs){
			if (rule.type.startsWith('敵方受到')){
				ruleStrList.push('<span class="info-debuff">' + rule.toString() + "</span>");
			}
			else if (['攻擊', '輔助', '治療', '持續治療', '持續傷害'].includes(rule.type)){
				ruleStrList.push('<span class="info-attack">' + rule.toString() + "</span>");
			}
			else{
				ruleStrList.push('<span class="info-buff">' + rule.toString() + "</span>");
			}
		}
		return title+ruleStrList.join('<br/>');
	},
	isCardInBattle(card){
		if (card == null){
			return false;
		}
		var cardname = null;
		if (typeof card == 'string') cardname = card;
		else cardname = card.name;

		for (var i =0; i<this.userInput.cardname.length; i++){
			if (this.userInput.cardname[i] == cardname){
				return this.userInput.isCardEnabled[i];
			}
		}
		return false;
	},
	changeAllAttackType(turn){
		var targetAction = null;
		var hasChanged = false;
		for (var idx=0; idx<5; idx++){
			var card = this.cards[idx];
			var actionPattern = this.userInput.cardActionPattern[idx];
			if (card == null || (actionPattern != ActionPattern.Manual && actionPattern != ActionPattern.BruteForce)){
				continue;
			}
			var actionArr = this.userInput.cardManualAction[idx];
			var action = actionArr[turn] == null ? 'A' : actionArr[turn];
			if (action == 'A') targetAction = 'S';
			else if (action == 'S') targetAction = 'G';
			else if (action == 'G') targetAction = 'A';
			break;
		}
		for (var card of this.cards){
			if (card != null){
				var idx = this.getIndexByCardname(card.name);
				var actionPattern = this.userInput.cardActionPattern[idx];
				if (actionPattern != ActionPattern.Manual && actionPattern != ActionPattern.BruteForce){
					return;
				}
				var actionArr = this.userInput.cardManualAction[idx];
				actionArr[turn] = targetAction;
				hasChanged = true;
			}
		}
		if (hasChanged){
			this.setupBattle();
		}
	},
	changeAttackType(card, turn){
		if (card == null){
			return;
		}
		var idx = this.getIndexByCardname(card.name);
		var actionPattern = this.userInput.cardActionPattern[idx];
		if (actionPattern != ActionPattern.Manual && actionPattern != ActionPattern.BruteForce){
			return;
		}

		var actionArr = this.userInput.cardManualAction[idx];
		var action = actionArr[turn] == null ? 'A' : actionArr[turn];
		if (action == 'A') actionArr[turn] = 'S';
		else if (action == 'S') actionArr[turn] = 'G';
		else if (action == 'G') actionArr[turn] = 'A';

		this.setupBattle();
		if (actionArr[turn] == 'S' && this.battle.getTurnAction(card.name, turn) == AttackType.BasicAttack){
			actionArr[turn] = 'G';
			this.setupBattle();
		}
	},
	getManualAttackTypeArr(arr, type){
		var output = [];
		for (var i=0; i<=this.userInput.turns; i++){
			if (arr[i] == type) output.push(i);
		}
		return output;
	},
	swapCard(i, j){
		[this.userInput.cardname[i], this.userInput.cardname[j]] = [this.userInput.cardname[j], this.userInput.cardname[i]];
		[this.userInput.cardActionPattern[i], this.userInput.cardActionPattern[j]] = [this.userInput.cardActionPattern[j], this.userInput.cardActionPattern[i]];
		[this.userInput.cardManualAction[i], this.userInput.cardManualAction[j]] = [this.userInput.cardManualAction[j], this.userInput.cardManualAction[i]];
		[this.userInput.isCardEnabled[i], this.userInput.isCardEnabled[j]] = [this.userInput.isCardEnabled[j], this.userInput.isCardEnabled[i]];
		[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
		this.userInput.updateKey += 1 ;
	},
	getIndexByCardname(cardname){
		for (var i=0; i<this.userInput.cardname.length; i++){
			if (this.userInput.cardname[i] == cardname){
				return i;
			}
		}
		return -1;
	},
	getCardByCardname(cardname){
		var idx = this.getIndexByCardname(cardname);
		if (idx >= 0){
			return this.cards[idx];
		}
		return null;
	},
	getCardImagePath(cardData){
		if (cardData == null || cardData.img == null){
			return './res/img/card/no_image.png';
		}
		return './res/img/card/' + UIConfig.IMAGE_PATH.char[cardData.char] + '/' + cardData.img;
	},
	getCardIconPath(cardData, type){
		if (cardData == null){
			return '';
		}
		if (type=='star'){
			return './res/img/card-icon/star.png';
		}
		return './res/img/card-icon/' + type + '-' + UIConfig.IMAGE_PATH[type][cardData[type]] + '.png';
	},
	getFilterPanalIconPath(type, value){
		if (type == 'char'){
			var folder = this.cardFilter.charDisplayStyle == 'pixel' ? 'pixel' : 'image';
			return './res/img/card-icon/' + folder + '/' + type + '-' + UIConfig.IMAGE_PATH[type][value] + '.png';
		}
		else{
			return './res/img/card-icon/' + type + '-' + UIConfig.IMAGE_PATH[type][value] + '.png';
		}
	},
	getCardData(cardname){
		var cardData = CardCenter.getCardData();
		return cardData[cardname];
	},
	getRuleAsString(rule){
		var summary = [];
		summary.push(rule.map(e=>new LogRule(e).getFullSkillInfo()).join('，'));
		return summary.join('<br />');
	},
	getPrevCardname(cardname){
		var idx = this.getIndexByCardname(cardname);
		if (idx == -1){
			return '';
		}
		var prevCardname = '';
		for (var i=idx-1; i>=0; i--){
			if (this.userInput.cardname[i].length > 0){
				prevCardname = this.userInput.cardname[i];
				break;
			}
		}
		if (prevCardname.length == 0){
			for (var i=4; i>idx; i--){
				if (this.userInput.cardname[i].length > 0){
					prevCardname = this.userInput.cardname[i];
					break;
				}
			}
		}
		return prevCardname;
	},
	getNextCardname(cardname){
		var idx = this.getIndexByCardname(cardname);
		if (idx == -1){
			return '';
		}
		var nextCardname = '';
		for (var i=idx+1; i<5; i++){
			if (this.userInput.cardname[i].length > 0){
				nextCardname = this.userInput.cardname[i];
				break;
			}
		}
		if (nextCardname.length == 0){
			for (var i=0; i<idx; i++){
				if (this.userInput.cardname[i].length > 0){
					nextCardname = this.userInput.cardname[i];
					break;
				}
			}
		}
		return nextCardname;
	},
	getCardHpUp(cardname){
		if (this.battle != null){
			return this.battle.getCardHpUp(cardname);
		}
		return '';
	},
	getCardActualHp(cardname){
		if (this.battle != null){
			return this.battle.getCardActualHp(cardname);
		}
		return '';
	},
	handleCardTurnActionOrderEvt(evt, turn, cardIdx){
		const order = Number(evt.target.value);
		this.setCardCustomTurnActionOrder(turn, cardIdx, order);
	},
	setCardCustomTurnActionOrder(turn, cardIdx, order){
		let defaultOrder = this.userInput.cardActionOrder;
		if (this.userInput.cardCustomTurnActionOrder[turn]){
			this.userInput.cardCustomTurnActionOrder[turn][cardIdx] = order;
		}
		else{
			let turnOrder = [];
			for (let i=0; i<defaultOrder.length; i++){
				turnOrder[i] = defaultOrder[i];
			}
			turnOrder[cardIdx] = order;
			this.userInput.cardCustomTurnActionOrder[turn] = turnOrder;
		}

		let sameAsDefaultOrder = true;
		for (let i=0; i<defaultOrder.length; i++){
			if (this.userInput.cardCustomTurnActionOrder[turn][i] != defaultOrder[i]){
				sameAsDefaultOrder = false;
				break;
			}
		}
		if (sameAsDefaultOrder){
			delete this.userInput.cardCustomTurnActionOrder[turn];
		}
		this.updateBattle();
	},
	resetCardTurnActionOrder(){
		this.userInput.cardCustomTurnActionOrder = [[]];
		this.updateBattle();
	},
	hasCustomTurnActionOrder(turn){
		return this.userInput.cardCustomTurnActionOrder[turn];
	},
	getCardTurnActionOrder(turn, cardIdx){
		let turnOrder = this.userInput.cardCustomTurnActionOrder[turn] ? this.userInput.cardCustomTurnActionOrder[turn] : this.userInput.cardActionOrder;
		return turnOrder[cardIdx];
	}
}