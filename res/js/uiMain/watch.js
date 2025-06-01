import { Element, ActionPattern } from '/build/Constants.js';
import { CardCenter } from '/build/Card.js';

var { NA, ...ELEMENT_MAP } = Element;


export default {
	selectedCard(newVal, oldVal) {
		var oldStr = oldVal.split(',').sort().join(',');
		var newStr = newVal.split(',').sort().join(',');
		// Card added
		if (oldStr != newStr){
			this.loadCards();
		}
		// Card swapped
		else{
			this.setupBattle();
		}
	},	
	updatedCardData(newVal, oldVal){
		var newCards = newVal.split(';').map(e=>e.split(',')[0]).join(',');
		var oldCards = oldVal.split(';').map(e=>e.split(',')[0]).join(',');

		// No new card loaded, only star/pot/atk changes
		if (newCards == oldCards){
			this.updateBattle();
		}
	},
	selectedCardEnabled(newVal, oldVal){
		this.setupBattle();
	},
	selectedCardActionOrder(newVal, oldVal){
		this.updateBattle();
	},
	selectedCardActionPattern(newVal, oldVal){
		var newPattern = newVal.split(',');
		var oldPattern = oldVal.split(',');
		for (var i=0; i<this.userInput.cardActionPattern.length; i++){
			if (newPattern[i] != ActionPattern.Manual && newPattern[i] != ActionPattern.BruteForce 
				&& (oldPattern[i] == ActionPattern.Manual || oldPattern[i] == ActionPattern.BruteForce)){
				this.userInput.cardManualAction[i] = [];
			}
			// if (newPattern[i] != ActionPattern.BruteForce 
			// 	&& (oldPattern[i] == ActionPattern.Manual || oldPattern[i] == ActionPattern.BruteForce)){
			// 	this.userInput.cardManualAction[i] = [];
			// }

		}
		this.updateBattle();
	},
	'userInput.turns'(newVal, oldVal){
		var turn = parseInt(newVal) || parseInt(oldVal);
		if ((turn > 50) || (turn <= 0)){
			turn = parseInt(oldVal);
		}
		this.userInput.turns = turn;
		this.setupBattle();
	},
	'userInput.counterAttackMode'(newVal, oldVal){
		this.updateBattle();
	},
	'userInput.maxCounterAttack'(newVal, oldVal){
		this.updateBattle();
	},
	'userInput.enemyElement'(newVal, oldVal){
		this.updateBattle();
	},
	'userInput.limitLevel'(newVal, oldVal){
		this.updateBattle();
	},
	'userInput.enemyName'(newVal, oldVal){
		if (newVal != null && newVal.length > 0){
			this.userInput.enemyCard = CardCenter.getEnemyCard(newVal);
			if (this.userInput.enemyCard != null && this.userInput.enemyCard.element != null && this.userInput.enemyCard.element != Element.NA){
				this.userInput.enemyElement = this.userInput.enemyCard.element;
			}
			else{
				this.userInput.enemyCard = null;
				this.userInput.enemyElement = Element.NA;
			}
		}
		else{
			this.userInput.enemyCard = null;
			this.userInput.enemyElement = Element.NA;
		}
		this.updateBattle();
	},
	'userInput.isCalcEnemyDebuff'(newVal, oldVal){
		this.updateBattle();
	},
	'userInput.printOutputMode'(newVal, oldVal){
		this.updateBattle();
	},
	'userInput.isAllowHpCond'(newVal, oldVal){
		Condition.HP_STATUS = newVal;
		this.updateBattle();
	},
	'userInput.isModifyCardVal'(isModify, oldVal){
		for (var card of this.cards.filter(e=>e != null)){
			if (isModify){
				card.hp = card.getHp();
				card.atk = card.getAtk();
			}
			else{
				card.hp = null;
				card.atk = null;
			}
		}
		this.updateBattle();
	},
	'cardFilter.selectCardName'(newCardName, oldVal){
		if (newCardName != null && newCardName.length > 0){
			this.userInput.cardname[this.cardFilter.currentIdx] = newCardName;
		}
	},
	inputJson(){
		if (this.importJsonResult != ''){
			this.importJsonResult = '';
		}
	},
	"damageRecordPanel.searchFav"(){
		this.damageRecordPanel.currentPage = 1;
		this.refreshDamageRecordPanelUI();
	},
	"damageRecordPanel.searchTeamName"(){
		this.damageRecordPanel.currentPage = 1;
		this.refreshDamageRecordPanelUI();
	},
	"damageRecordPanel.searchCard"(){
		this.damageRecordPanel.currentPage = 1;
		this.refreshDamageRecordPanelUI();
	},
	"damageRecordPanel.searchTurn"(){
		this.damageRecordPanel.currentPage = 1;
		this.refreshDamageRecordPanelUI();
	},
	"damageRecordPanel.pageMaxCount"(){
		this.damageRecordPanel.currentPage = 1;
		this.refreshDamageRecordPanelUI();
	},
	"setting.general.damageChartDisplay"(){
		this.updateChart(true);
	}
}