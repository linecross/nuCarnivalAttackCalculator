import { Character, Rarity, Element, AttackType, ActionPattern } from './../../build/Constants.js';
import { CardCenter, Team, Battle, Condition } from './../../build/BattleSystem.js';

var config = {
	MAX_LEVEL: 60,
	LEVEL_SELECT: [1,15,20,25,30,35,40,45,50,55,60],
	STARS: [1,2,3,4,5],
	POT_SELECT: [0,6,9,12],
	DEFAULT_STAR: {
		FULL: '全員滿星', SSR3: '3星SSR+5星SR', SSR1: '1星SSR+3星SR'
	}
};

Vue.createApp({
    data() {
		return{
			tab: 'CAL',
			userInput: {
				char: ['', '', '', '', ''],
				cardname: ['', '', '', '', ''],
				cardActionOrder: [1, 2, 3, 4, 5],
				cardActionPattern: [ActionPattern.Immediately, ActionPattern.Immediately, ActionPattern.Immediately, ActionPattern.Immediately, ActionPattern.Immediately],
				cardManualAction:[[],[],[],[],[]],
				isCardEnabled: [true, true, true, true, true],

				isAdvanceMode: true,
				turns: 14,
				isShowTurns: true,
				maxCounterAttack: 0,
				isAllowHpCond: Condition.IS_HP_FULFILL,
				isModifyCardVal: false,
				defaultStar: 'SSR3',
				enemyElement: Element.NA,
				isCalcEnemyDebuff: false,
				printOutputMode: Battle.PRINT_OUTPUT_OPTION.ALL,
			},
			cards: [null, null, null, null, null],
			battle: null,
			inputJson: null,
			importJsonResult: '',
		}
	},
	created()
	{
		this.CHARACTERS = Object.assign({EMPTY: ''}, Character);
		this.STARS = config.STARS;
		this.LEVEL_SELECT = config.LEVEL_SELECT;
		this.POT_SELECT = config.POT_SELECT;
		this.ELEMENTS = Element;
		this.ACTION_PATTERN = ActionPattern;
		this.DEFAULT_STAR = config.DEFAULT_STAR;

		fetch("./res/json/cardData.json")
		.then(resp => resp.json())
		.then(json => {
			CardCenter.setMainCardData(json);
			this.loadCards();
		});
	},
	updated()
	{
		const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
		const popoverList = [...popoverTriggerList].map(popoverTriggerEl => bootstrap.Popover.getOrCreateInstance(popoverTriggerEl, {
			'animation': false
		}));
		popoverList.forEach(e=>e._config.content=e._element.getAttribute('data-bs-content'));
	},
	methods: {
		switchTab(tab){
			this.tab = tab;
		},
		getCardnameByChar(char){
			return CardCenter.getCardNameByChar(char);
		},
		loadCards(){
			for (var i =0; i<this.userInput.cardname.length; i++){
				var name = this.userInput.cardname[i];
				if (name != '' && (this.cards[i] == null || this.cards[i].name != name)){
					var card = CardCenter.loadCard(name);
					if (this.userInput.defaultStar == 'SSR3'){
						if (card.rarity == 'SSR') card.star = 3;
					}
					else if (this.userInput.defaultStar == 'SSR1'){
						if (card.rarity == 'SSR') card.star = 1;
						if (card.rarity == 'SR') card.star = 3;
					}

					this.cards[i] = card;
				}
			}

			this.setupBattle();
		},
		isCardSelected(){
			for (var i =0; i<this.userInput.cardname.length; i++){
				var name = this.userInput.cardname[i];
				if (name != null && name != ''){
					return true;
				}
			}
			return false;
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
		setupBattle(){
			if (!this.isCardSelected()){
				return;
			}
			var team = new Team();
			for (var i =0; i<this.userInput.cardname.length; i++){
				var card = this.cards[i];
				if (card != null && this.userInput.isCardEnabled[i]){
					team.addCard(card);
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

			this.battle.init();
			this.battle.counterAttackCount = this.userInput.maxCounterAttack;
			this.battle.enemyElement = this.userInput.enemyElement;
			this.battle.printEnemeyOption = this.userInput.isCalcEnemyDebuff;
			this.battle.printOutputOption = this.userInput.printOutputMode;
			
			for (var i=0; i<this.cards.length; i++){
				var card = this.cards[i];
				if (this.isCardInBattle(card)){
					this.battle.setActionPattern(card.name, this.userInput.cardActionPattern[i]);

					if (this.userInput.cardActionPattern[i] == ActionPattern.Manual){
						var skillArr = this.getManualAttackTypeArr(this.userInput.cardManualAction[i], 'S');
						var guardArr = this.getManualAttackTypeArr(this.userInput.cardManualAction[i], 'G');
						this.battle.setManualActionPattern(card.name, skillArr, guardArr);
					}
				}
			}

			this.battle.startBattle();
			// this.battle.printResult();
			// console.info(this.battle.enemyElement);
		},
		getBattleTurnValue(cardname, turn){
			return this.battle.getTurnValue(cardname, turn);
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
			var title = '<span class="info-title"><b><u>【'+cardname+'（T' + turn+'）】</u></b><span><br/>';
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
		getThNameClass(cardname){
			if (!this.isCardInBattle(cardname)){
				return '';
			}
			var card = this.cards[this.getIndexByCardname(cardname)];
			if (card == null){
				return '';
			}

			if (card.element == Element.Light) return ' ele-light';
			if (card.element == Element.Dark) return ' ele-dark';
			if (card.element == Element.Fire) return ' ele-fire';
			if (card.element == Element.Water) return ' ele-water';
			if (card.element == Element.Wood) return ' ele-wood';
		},
		getTdClass(card, turn){
			if (!this.isCardInBattle(card)){
				return '';
			}

			if (this.battle.getTurnAction(card.name, turn) == AttackType.SkillAttack){
				return ' skill';
			}
			else if (this.battle.getTurnAction(card.name, turn) == AttackType.BasicAttack){
				return ' basic';
			}
			else if (this.battle.getTurnAction(card.name, turn) == AttackType.Guard){
				return ' guard';
			}
		},
		changeAttackType(card, turn){
			if (card == null){
				return;
			}
			var idx = this.getIndexByCardname(card.name);
			var actionPattern = this.userInput.cardActionPattern[idx];
			if (actionPattern != ActionPattern.Manual){
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
			[this.userInput.char[i], this.userInput.char[j]] = [this.userInput.char[j], this.userInput.char[i]];
			[this.userInput.cardname[i], this.userInput.cardname[j]] = [this.userInput.cardname[j], this.userInput.cardname[i]];
			[this.userInput.cardActionPattern[i], this.userInput.cardActionPattern[j]] = [this.userInput.cardActionPattern[j], this.userInput.cardActionPattern[i]];
			[this.userInput.cardManualAction[i], this.userInput.cardManualAction[j]] = [this.userInput.cardManualAction[j], this.userInput.cardManualAction[i]];
			[this.userInput.isCardEnabled[i], this.userInput.isCardEnabled[j]] = [this.userInput.isCardEnabled[j], this.userInput.isCardEnabled[i]];
			[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
		},
		getIndexByCardname(cardname){
			for (var i=0; i<this.userInput.cardname.length; i++){
				if (this.userInput.cardname[i] == cardname){
					return i;
				}
			}
			return -1;
		},
		importJsonStr(){
			// remove spaces and tab, convert quotes, add quotes
			var cleanedStr = this.inputJson.replace(/[\r\n\t]/g, '').replace(/'/g, '"').replace(/(\w+):/g, '"$1":');
			if (!cleanedStr.startsWith("{")){
				cleanedStr = "{"+cleanedStr+"}"
			};
			// remove trailing comma
			const regex = /\,(?!\s*?[\{\[\"\'\w])/g;
			cleanedStr = cleanedStr.replace(regex, '');

			try {
				var jsonObj = JSON.parse(cleanedStr);
				CardCenter.addUserCardData(jsonObj);
				this.importJsonResult = "已載入：" + Object.keys(jsonObj);
			} catch(error){
				this.importJsonResult = "載入失敗，請檢查格式是否正確";
			}
		}
	},
	computed: {
		selectedChar() {
			return this.userInput.char.join(',');
		},
		selectedCard() {
			return this.userInput.cardname.join(',');
		},
		selectedCardEnabled() {
			return this.userInput.isCardEnabled.join(',');
		},
		selectedCardActionOrder(){
			return this.userInput.cardActionOrder.join(',');
		},
		selectedCardActionPattern(){
			return this.userInput.cardActionPattern.join(',');
		},
		updatedCardData(){
			var result = '';
			for (var card of this.cards){
				if (card != null){
					result += card.name + ',' + card.star + ',' + card.level + ',' + card.potential + ',' + card.atk;
				}
				result += ';';
			}
			return result;
		},
	},
	watch:{
		selectedChar(newVal, oldVal){
			for (var i =0; i<this.userInput.char.length; i++){
				var char = this.userInput.char[i];
				if (char == null || char == ''){
					this.userInput.cardname[i] = '';
					this.cards[i] = null;
				}
				else if (!this.getCardnameByChar(char).includes(this.userInput.cardname[i])){
					this.userInput.cardname[i] = '';
					this.cards[i] = null;
				}
			}
		},
		selectedCard(newVal, oldVal) {
			this.loadCards();
		},
		updatedCardData(newVal, oldVal){
			this.updateBattle();
		},
		selectedCardEnabled(newVal, oldVal){
			this.setupBattle();
		},
		selectedCardActionOrder(newVal, oldVal){
			this.updateBattle();
		},
		selectedCardActionPattern(newVal, oldVal){
			for (var i=0; i<this.userInput.cardActionPattern.length; i++){
				if (this.userInput.cardActionPattern[i] == ActionPattern.Manual){
					this.userInput.cardManualAction[i] = [];
				}
			}
			this.updateBattle();
		},
		'userInput.turns'(newVal, oldVal){
			var turn = parseInt(newVal) || oldVal;
			if ((turn > 50) || (turn <= 0)){
				turn = oldVal;
			}
			this.userInput.turns = turn;
			this.setupBattle();
		},
		'userInput.maxCounterAttack'(newVal, oldVal){
			this.updateBattle();
		},
		'userInput.enemyElement'(newVal, oldVal){
			this.updateBattle();
		},
		'userInput.isCalcEnemyDebuff'(newVal, oldVal){
			this.updateBattle();
		},
		'userInput.printOutputMode'(newVal, oldVal){
			this.updateBattle();
		},
		'userInput.isAllowHpCond'(newVal, oldVal){
			Condition.IS_HP_FULFILL = newVal;
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
		inputJson(){
			if (this.importJsonResult != ''){
				this.importJsonResult = '';
			}
		}
	}
}).mount('#NuCarnivalAttackCalApp');