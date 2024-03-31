import { Character, Rarity, Element, AttackType, ActionPattern, CounterAttackMode } from './../../build/Constants.js';
import { CardCenter, Team, Battle, Condition, LogRule } from './../../build/BattleSystem.js';

var config = {
	MAX_LEVEL: 60,
	LEVEL_SELECT: [1,15,20,25,30,35,40,45,50,55,60],
	STARS: [1,2,3,4,5],
	POT_SELECT: [0,1,2,3,4,5,6,7,8,9,10,11,12],
	DEFAULT_STAR: {
		FULL: '全員滿星', SSR3: '3星SSR+5星SR', SSR1: '1星SSR+3星SR'
	},
	FILTERS:{
		rarity: ['N','R','SR','SSR'],
		char: Object.values(Character),
		clazz: ['攻擊','守護','妨礙','輔助','治療'],
		element: ['火','水','木','光','闇'],
		coolDown: [3, 4, 5, 6],
		immuneSkill: ['免疫麻痺','免疫沈默','免疫睡眠'],
		buffSkill: ['攻擊力增加','普攻傷害增加','必殺技傷害增加','持續傷害增加','觸發技效果增加','造成傷害增加',
		'敵方受到普攻傷害增加','敵方受到必殺技傷害增加','敵方受到持續傷害增加','敵方受到觸發技傷害增加','敵方受到屬性傷害增加','敵方受到傷害增加'],
		healBuffSkill: ['治療量增加','持續治療量增加',
		'我方受到治療增加','我方受到瞬間治療增加','我方受到持續治療增加'],
	},
	CHAR_FOLDER: {
		'八雲': 'yakumo', '艾德蒙特': 'edmond', '奧利文': 'olivine',
		'崑西': 'quincy', '玖夜': 'kuya', '可爾': 'garu',
		'布儡': 'blade', '啖天': 'dante', '歛': 'rei',
		'艾斯特': 'aster', '墨菲': 'morvay', '伊得': 'eiden'
	},
	IMAGE_PATH: {
		'element': {
			'光': 'light', '闇': 'dark', '火': 'fire', '水': 'water', '木': 'wood'
		},
		'class': {
			'攻擊':'attack', '守護':'guard', '妨礙':'saboteur', '輔助':'support', '治療':'heal'
		},
		'rarity':{
			'N':'n', 'R':'r', 'SR':'sr', 'SSR':'ssr'
		},
		'coolDown':{
			'3':3, '4': 4, '5': 5, '6': 6
		},
		//TODO: fix the dirty data
		'char': {
			'八雲': 'yakumo', '艾德蒙特': 'edmond', '奧利文': 'olivine',
			'崑西': 'quincy', '玖夜': 'kuya', '可爾': 'garu',
			'布儡': 'blade', '啖天': 'dante', '歛': 'rei',
			'艾斯特': 'aster', '墨菲': 'morvay', '伊得': 'eiden'
		}
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

				updateKey: 0,
				isAdvanceMode: true,
				turns: 14,
				isShowTurns: true,
				maxCounterAttack: 1,
				counterAttackMode: CounterAttackMode.everyTurn,
				isAllowHpCond: Condition.IS_HP_FULFILL,
				isModifyCardVal: false,
				defaultStar: 'SSR3',
				enemyElement: Element.NA,
				isCalcEnemyDebuff: true,
				printOutputMode: Battle.PRINT_OUTPUT_OPTION.ALL,
			},
			cardFilter:{
				currentIdx: -1,
				selectCardName: '',
				searchStr: '',
				rarity: [],
				char: [],
				clazz: [],
				element: [],
				coolDown: [],
				charDisplayStyle: 'image',
			},
			setting: {
				userInput: {
					turns: 14,
					isShowTurns: true,
					defaultStar: 'SSR3',
					isCalcEnemyDebuff: false,
					maxCounterAttack: 1
				},
				general: {
					charFilterDisplayStyle: 'image',
					recordPanelCardImgSize: 'normal',
				}
			},
			cardJsonLastModified: '',
			cards: [null, null, null, null, null],
			battle: null,
			inputJson: null,
			importJsonResult: '',
			cardDetailCardName: '',
			teamName: '',
			damageRecords: [],
			damageRecordPanel: {
				editElement: '',
				manageMode: 'normal',
				cardImgSize: 'normal',
				sortBy: 'id',
				sortMode: 'desc',
				searchFav: false,
				searchTeamName: '',
				searchCard: '',
				searchTurn: null,
			},
			toastMessage: '',
			toastStatus: '',
			db: null,
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
		this.COUNTER_ATTACK_MODE = CounterAttackMode;
		this.FILTERS = config.FILTERS;

		this.db = new Dexie('nuAttackCalculatorDB');
		this.db.version(1).stores({
			damageRecords: '++id, teamName, turn, cardname'
		});

		fetch("./res/json/cardData.json")
		.then(resp => {
			var date = new Date(resp.headers.get("last-modified"));
			this.cardJsonLastModified = date.getFullYear() + ' 年 ' + (date.getMonth()+1) + ' 月 ' + date.getDate() + ' 日 ' 
				+ (date.getHours() > 10 ? '' : '0') + date.getHours() + ':'
				+ (date.getMinutes() > 10 ? '' : '0') + date.getMinutes() +':'
				+ (date.getSeconds() > 10 ? '' : '0') + date.getSeconds() ;
			return resp.json();
		})
		.then(json => {
			CardCenter.setMainCardData(json);
			this.loadCards();
			this.loadRecordsFromDB();
		});
		this.loadSettingFromStorage();
	},
	mounted: function(){
		this.$watch(vm => [vm.setting], val => {
			this.saveSettingFromStorage();
		}, {
			immediate: true,
			deep: true
		});

		this.createSortable();
	},
	updated()
	{
		const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
		const popoverList = [...popoverTriggerList].map(popoverTriggerEl => bootstrap.Popover.getOrCreateInstance(popoverTriggerEl, {
			'animation': false
		}));
		popoverList.forEach(e=>e._config.content=e._element.getAttribute('data-bs-content'));

		const isCharItemDraggable = document.querySelector('#charInputList.isDraggable');
		if (isCharItemDraggable == null){
			this.createSortable();
			console.info(this.userInput.cardname);
		}
	},
	methods: {
		createSortable(){
			var el = document.getElementById("charInputList");
			var vueObj = this;
			Sortable.create(el, {
				draggable: ".charItem",
				dataIdAttr: 'data-id',
				handle: '.drag-handler',
				swapClass: "sortable-swap-highlight",
				chosenClass: "sortable-chosen",
				swap: true,
				onUpdate: function (evt) {
					if (evt.oldIndex != evt.newIndex){
						// console.info(evt.oldIndex + ' to ' + evt.newIndex);
						vueObj.swapCard(evt.oldIndex, evt.newIndex);
					}
				},
			});
			el.classList.add("isDraggable");

			el = document.querySelector(".resultTable .table-header");
			Sortable.create(el, {
				draggable: ".charItem",
				dataIdAttr: 'data-id',
				handle: '.card-block .card-icon-move-btn',
				swapClass: "sortable-swap-highlight",
				chosenClass: "sortable-chosen",
				swap: true,
				onUpdate: function (evt) {
					if (evt.oldIndex != evt.newIndex){
						// console.info(evt.oldIndex + ' to ' + evt.newIndex);
						vueObj.swapCard(evt.oldIndex-1, evt.newIndex-1);
					}
				},
			});
			el.classList.add("isDraggable");
		},
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
		removeCard(idx){
			if (idx >= 0 && idx <=5){
				this.userInput.char[idx] = '';
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
			this.battle.counterAttackMode = this.userInput.counterAttackMode;
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
		getPassiveRuleSummary(cardname){
			if (cardname == null || cardname == '') return '';
			var summary = [];
			var card = this.cards[this.getIndexByCardname(cardname)];
			if (card!=null){
				var title = '<span class="info-title"><b><u>【'+cardname+'】</u></b><span><br/>';
				if (card.star >= 3) {
					summary.push('3星被動：'+card.star3Rule.map(e=>new LogRule(e).getFullSkillInfo()).join('／'));
				}
				if (card.star == 5){
					summary.push('5星被動：'+card.star5Rule.map(e=>new LogRule(e).getFullSkillInfo()).join('／'));
				}
				if ((card.rarity == Rarity.SSR || card.rarity == Rarity.SR)){
					if (card.potential >= 6){
						summary.push('潛6被動：'+card.pot6Rule.map(e=>new LogRule(e).getFullSkillInfo()).join('／'));
					}
					if (card.potential >= 12){
						summary.push('潛12被動：'+card.pot12Rule.map(e=>new LogRule(e).getFullSkillInfo()).join('／'));
					}
				}
				else{
					if (card.potential >= 3){
						summary.push('潛3被動：'+card.pot6Rule.map(e=>new LogRule(e).getFullSkillInfo()).join('／'));
					};
					if (card.potential >= 3){
						summary.push('潛6被動：'+card.pot12Rule.map(e=>new LogRule(e).getFullSkillInfo()).join('／'));
					};
				}
			}
			return title+summary.join('<br />');
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
		cardFilterSelectNone(field){
			if (field != null){
				this.cardFilter[field] = [];
			}
			else{
				this.cardFilterSelectNone('rarity');
				this.cardFilterSelectNone('clazz');
				this.cardFilterSelectNone('element');
				this.cardFilterSelectNone('coolDown');
				this.cardFilterSelectNone('char');
				this.cardFilter.searchStr = '';
			}
		},
		openCardSelector(idx){
			this.cardFilter.currentIdx = idx;
			this.cardFilterSelectNone('rarity');
			this.cardFilterSelectNone('clazz');
			this.cardFilterSelectNone('element');
			this.cardFilterSelectNone('coolDown');
			this.cardFilterSelectNone('char');
			this.cardFilter.searchStr = '';
			if (this.userInput.cardname[idx] != null && this.userInput.cardname[idx].length > 0){
				this.cardFilter.selectCardName = this.userInput.cardname[idx];
			}
			else{
				this.cardFilter.selectCardName = '';
			}
			var selector = document.getElementById('cardSelector');
			var bsModal = bootstrap.Modal.getOrCreateInstance(selector);
			bsModal.show();
		},
		selectCard(cardname){
			this.cardFilter.selectCardName = cardname;
		},
		getCardImagePath(cardData){
			if (cardData == null || cardData.img == null){
				return './res/img/card/no_image.png';
			}
			return './res/img/card/' + config.CHAR_FOLDER[cardData.char] + '/' + cardData.img;
		},
		getCardIconPath(cardData, type){
			if (cardData == null){
				return '';
			}
			if (type=='star'){
				return './res/img/card-icon/star.png';
			}
			return './res/img/card-icon/' + type + '-' + config.IMAGE_PATH[type][cardData[type]] + '.png';
		},
		getFilterPanalIconPath(type, value){
			if (type == 'char'){
				var folder = this.cardFilter.charDisplayStyle == 'pixel' ? 'pixel' : 'image';
				return './res/img/card-icon/' + folder + '/' + type + '-' + config.IMAGE_PATH[type][value] + '.png';
			}
			else{
				return './res/img/card-icon/' + type + '-' + config.IMAGE_PATH[type][value] + '.png';
			}
		},
		getFilterPanelCode(type, value){
			return config.IMAGE_PATH[type][value];
		},
		loadNoCardImage(event){
			event.target.src = this.getCardImagePath();
		},
		showCardDetail(cardname){
			if (cardname == '') return;
			this.cardDetailCardName = cardname;
			var panel = document.getElementById('cardDetailPanel');
			var bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(panel);
			bsOffcanvas.show();
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
		addToFilterSearch(filterItem){
			var filterItem = '"' + filterItem + '"';
			var searchStr = this.cardFilter.searchStr;
			if (searchStr.indexOf(filterItem) >= 0){
				searchStr = searchStr.replaceAll(filterItem, '').replaceAll('  ', ' ');
			}
			else{
				searchStr += searchStr == '' ? filterItem : ' ' + filterItem;
			}
			this.cardFilter.searchStr = searchStr;
		},
		isFilterChecked(filterItem){
			var filterItem = '"' + filterItem + '"';
			if (this.cardFilter.searchStr.indexOf(filterItem) >= 0){
				return true;
			}
			return false;
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
		},
		loadSettingFromStorage(){
			let map = JSON.parse(localStorage.getItem("nuAttackCalculator"));
			if (map == null || map == undefined){
				return;
			}
			for (var key of Object.keys(map.setting)){
				this.setting[key] = map.setting[key];
			}

			this.loadSetting();
		},
		loadRecordsFromDB(){
			this.db.damageRecords.toArray().then(records=>{
				if (records != null && records.length > 0){
					this.damageRecords = records;
				}
			});
		},
		loadSetting(){
			if (this.setting['userInput'] != null){
				Object.assign(this.userInput, this.setting['userInput']);
				this.userInput.turns = parseInt(this.setting['userInput'].turns);
			}
			var charFilterDisplayStyle = this.setting['general']['charFilterDisplayStyle'];
			if (['image','text','pixel'].includes(charFilterDisplayStyle)) {
				this.cardFilter.charDisplayStyle = charFilterDisplayStyle;
			}
			var recordPanelCardImgSize = this.setting['general']['recordPanelCardImgSize'];
			if (['normal','big','small', 'none'].includes(recordPanelCardImgSize)) {
				this.damageRecordPanel.cardImgSize = recordPanelCardImgSize;
			}
		},
		saveSettingFromStorage(){
			let map = {};
			map['setting'] = this.setting;
			localStorage.setItem("nuAttackCalculator", JSON.stringify(map));
			this.loadSetting();
		},
		loadDamageRecord(record){
			this.userInput.cardActionOrder = record.cardActionOrder;
			this.userInput.cardActionPattern = record.cardActionPattern;
			this.userInput.cardManualAction = record.cardManualAction;
			this.userInput.isCardEnabled = [true, true, true, true, true];
			if (record.isCardEnabled != null){
				this.userInput.isCardEnabled = record.isCardEnabled;
			}
			this.userInput.turns = parseInt(record.turns);
			var cardDmgDataArr = record.cards;

			this.teamName = record.teamName;
			this.userInput.char = ['', '', '', '', ''];
			this.userInput.cardname = ['', '', '', '', ''];
			this.cards = [null, null, null, null, null];
			for (var i=0; i<5; i++){
				var cardDmgData = cardDmgDataArr[i];
				if (cardDmgData != null){
					var card = CardCenter.loadCard(cardDmgData.name);
					card.star = cardDmgData.star;
					this.userInput.cardname[i] = cardDmgData.name;
					this.userInput.char[i] = card.char;
					this.cards[i] = card;
				}
			}
			this.setupBattle();
		},
		showToast(message, messageStatus){
			this.toastMessage = message;
			this.toastStatus = messageStatus == null ? 'text-bg-primary' : messageStatus;
			var toastEle = document.getElementById('msgToast');
			var toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastEle);
			toastBootstrap.show();
		},
		addDamageRecord(){
			if (this.battle == null){
				this.showToast('請先加入一張卡片', 'text-bg-danger');
				return;
			}
			var cardDmgDataArr = [];
			for (var i=0; i<5; i++){
				var card = this.cards[i];
				var cardDmgData = null;
				if (card != null){
					cardDmgData = {
						name: card.name, 
						star: card.star,
						potential: card.potential,
					};
					if (this.userInput.isCardEnabled[i]){
						cardDmgData['dmg'] = this.getBattleTotalValue(card.name);
					}
				}
				cardDmgDataArr.push(cardDmgData);
			}
			var teamTotalDamage = this.getBattleTeamTotalValue();

			var record = {
				teamName: this.teamName,
				turns: this.userInput.turns,
				cardname: [...this.userInput.cardname],
				isCardEnabled: [...this.userInput.isCardEnabled],
				cardActionOrder: [...this.userInput.cardActionOrder],
				cardActionPattern: [...this.userInput.cardActionPattern],
				cardManualAction: [...this.userInput.cardManualAction],
				cards: cardDmgDataArr,
				totalDamage: teamTotalDamage,
				isFav: false,
			};

			var teamNameTitle = record.teamName.split('\n')[0];
			var existRecord = this.getExistsDamageRecord(record);
			if (existRecord != null){
				record.id = existRecord.id;
				record.isFav = existRecord.isFav;
				if (record.teamName == null || record.teamName == ''){
					record.teamName = existRecord.teamName;
					teamNameTitle = record.teamName.split('\n')[0];
				}
				this.db.damageRecords.put(JSON.parse(JSON.stringify(record))).then(recordId=>{
					this.damageRecords = this.damageRecords.filter(e=>e.id != recordId);
					this.damageRecords.push(record);
				});
				this.showToast('已更新隊伍 ' + teamNameTitle);
			}
			else{
				this.db.damageRecords.add(JSON.parse(JSON.stringify(record))).then(recordId=>{
					record.id = recordId;
					this.damageRecords.push(record);
				});
				this.showToast('已加入隊伍 ' + teamNameTitle);
			}
			this.teamName = '';
		},
		getExistsDamageRecord(record){
			var isExists = true;
			for (var damageRecord of this.damageRecords){
				if (record.turns == damageRecord.turns && record.cardname.join(',') == damageRecord.cardname.join(',') 
					&& JSON.stringify(record.cardActionPattern) == JSON.stringify(damageRecord.cardActionPattern)
					&& JSON.stringify(record.cardActionOrder) == JSON.stringify(damageRecord.cardActionOrder)
					&& JSON.stringify(record.cardManualAction) == JSON.stringify(damageRecord.cardManualAction)){
					for (var i=0; i<5; i++){
						if (record.cards[i] != null && damageRecord.cards[i] != null){
							if (record.cards[i].star != damageRecord.cards[i].star || record.cards[i].potential != damageRecord.cards[i].potential){
								isExists = false;
								break;
							}
						}
					}
					if (isExists){
						return damageRecord;
					}
				}
			}
			return null;
		},
		deleteDamageRecord(id){
			this.damageRecords = this.damageRecords.filter(e=>e.id !== id);
			this.db.damageRecords.delete(id);
		},
		updateDamageRecord(record){
			this.db.damageRecords.put(JSON.parse(JSON.stringify(record)));
		},
		damageRecordFilterSelectNone(){
			this.damageRecordPanel.searchFav = false;
			this.damageRecordPanel.searchTeamName = '';
			this.damageRecordPanel.searchCard = '';
			this.damageRecordPanel.searchTurn = null;
		},
		damageRecordSwitchManageMode(){
			var mode = this.damageRecordPanel.manageMode;
			mode = mode == 'normal' ? 'delete' : 'normal';
			this.damageRecordPanel.manageMode = mode;
		},
		damageSort(val){
			if (val == this.damageRecordPanel.sortBy){
				this.damageRecordPanel.sortMode = this.damageRecordPanel.sortMode == 'asc' ? 'desc' : 'asc';
			}
			else{
				this.damageRecordPanel.sortMode = 'asc';
			}
			this.damageRecordPanel.sortBy = val;
		},
		generateTeamNameHtml(str){
			str = str.replaceAll('\n', '\n<br>\n').replaceAll(/(#.+?)(\s|$)/g, '\n$1\n');
			return str.split('\n').filter(e=>e.trim().length > 0);
		},
		addToRecordSearch(fieldId, tag){
			var searchStr = this.damageRecordPanel[fieldId];
			if (fieldId == 'searchTurn'){
				this.damageRecordPanel[fieldId] = searchStr == tag ? null : tag;
			}
			else{
				if (searchStr.indexOf(tag) >= 0){
					searchStr = searchStr.replaceAll(tag, '').replaceAll('  ', ' ');
				}
				else{
					searchStr += searchStr == '' ? tag : ' ' + tag;
				}
				this.damageRecordPanel[fieldId] = searchStr;
			}
		},
		importDamageRecord(event){
			var file = event.target.files[0];

			const reader = new FileReader();
			reader.onload = (e) => {
				var str = e.target.result;
				var json = JSON.parse(str);
				var updateCount = 0;
				var addCount = 0;
				for (var record of json){
					delete record.id;
					var existRecord = this.getExistsDamageRecord(record);
					if (existRecord != null){
						record.id = existRecord.id;
						record.isFav = existRecord.isFav;
						if (record.teamName == null || record.teamName == ''){
							record.teamName = existRecord.teamName;
						}
						this.db.damageRecords.put(JSON.parse(JSON.stringify(record))).then(recordId=>{
							this.damageRecords = this.damageRecords.filter(e=>e.id != recordId);
							this.damageRecords.push(record);
						});
						updateCount++;
					}
					else{
						this.db.damageRecords.add(JSON.parse(JSON.stringify(record))).then(recordId=>{
							record.id = recordId;
							this.damageRecords.push(record);
						});
						addCount++;
					}
				}
				var toastMsg = addCount > 0 ? '已新增 ' + addCount + ' 記錄；' : '';
				toastMsg += updateCount > 0 ? '已更新 ' + updateCount + ' 記錄' : '';
				this.showToast(toastMsg);
			};
			reader.readAsText(file);
		},
		exportDamageRecord(){
			var json = JSON.stringify(this.getDamageRecords);
			var blob = new Blob([json], { type: "text/plain;charset=utf-8" });
    		saveAs(blob, 'output.json');
		}

	},
	computed: {
		isEditTeam(){
			return this.damageRecordPanel.editElement.startsWith("teamName_");
		},
		getDamageRecords() {
			var arr = [...this.damageRecords];
			
			var isFav = this.damageRecordPanel.searchFav;
			var teamName = this.damageRecordPanel.searchTeamName;
			var cardname = this.damageRecordPanel.searchCard;
			var turn = this.damageRecordPanel.searchTurn;
			
			if (isFav){
				arr = arr.filter(e=>e.isFav);
			}
			if (teamName.length > 0){
				var teamNameArr = teamName.trim().split(' ');
				for (var str of teamNameArr){
					str = str.trim();
					if (str.startsWith("-")){
						str = str.slice(1);
						arr = arr.filter(e=>e.teamName.indexOf(str) == -1);
					}
					else{
						arr = arr.filter(e=>e.teamName.indexOf(str) > -1);
					}
				}
			}
			if (cardname.length > 0){
				var cardnameArr = cardname.trim().split(' ');
				for (var str of cardnameArr){
					str = str.trim();
					if (str.startsWith("-")){
						str = str.slice(1);
						arr = arr.filter(e=>e.cardname.join(',').indexOf(str) == -1);
					}
					else{
						arr = arr.filter(e=>e.cardname.join(',').indexOf(str) > -1);
					}
				}
			}
			if (turn != null && turn > 0){
				arr = arr.filter(e=>e.turns == turn);
			}

			var sortBy = this.damageRecordPanel.sortBy;
			if (sortBy == 'id'){
				arr = arr.sort((e1, e2)=>e1.id > e2.id);
			}
			else if (sortBy == 'teamName'){
				arr = arr.sort((e1, e2)=>e1.teamName > e2.teamName);
			}
			else if (sortBy == 'turns'){
				arr = arr.sort((e1, e2)=>e1.turns > e2.turns);
			}
			else if (sortBy == 'totalDamage'){
				arr = arr.sort((e1, e2)=>e1.totalDamage > e2.totalDamage);
			}
			else if (sortBy == 'isFav'){
				arr = arr.sort((e1, e2)=>e1.isFav != e2.isFav ? e1.isFav : e1.id > e2.id);
			}
			else{ //sort by card name
				var cardIdx = -1;
				if (sortBy == 'card1') cardIdx = 0;
				else if (sortBy == 'card2') cardIdx = 1;
				else if (sortBy == 'card3') cardIdx = 2;
				else if (sortBy == 'card4') cardIdx = 3;
				else if (sortBy == 'card5') cardIdx = 4;
				if (cardIdx >= 0){
					arr = arr.sort((e1, e2)=>{
						if (e1.cards[cardIdx] == null) return -1;
						if (e2.cards[cardIdx] == null) return 1;
						if (e1.cards[cardIdx].name == e2.cards[cardIdx].name){
							if (e1.cards[cardIdx].dmg == null) return -1;
							else if (e2.cards[cardIdx].dmg == null) return 1;
							else return e1.cards[cardIdx].dmg > e2.cards[cardIdx].dmg;
						}
						else{
							return e1.cards[cardIdx].name > e2.cards[cardIdx].name;
						}
					});
				}
			}
			if (this.damageRecordPanel.sortMode == 'desc'){
				arr = arr.reverse();
			}
			
			return arr;
		},
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
		getTeamBattlePower(){
			if (this.battle != null){
				return this.battle.team.getBattlePower();
			}
			return 0;
		},
		getFilteredCards(){
			var arr = [];
			var cardData = CardCenter.getCardData();
			for (var card of Object.entries(cardData)) {
				arr.push(card);
			}

			var searchStr = this.cardFilter.searchStr;
			var chars = this.cardFilter.char;
			var rarity = this.cardFilter.rarity;
			var clazz = this.cardFilter.clazz;
			var element = this.cardFilter.element;
			var coolDown = this.cardFilter.coolDown;
			
			if (chars.length > 0){
				arr = arr.filter(e=>chars.includes(e[1].char));
			}
			if (rarity.length > 0){
				arr = arr.filter(e=>rarity.includes(e[1].rarity));
			}
			if (clazz.length > 0){
				arr = arr.filter(e=>clazz.includes(e[1].class));
			}
			if (element.length > 0){
				arr = arr.filter(e=>element.includes(e[1].element));
			}
			if (coolDown.length > 0){
				arr = arr.filter(e=>coolDown.includes(e[1].coolDown));
			}
			if (searchStr != null && searchStr.length > 0){
				var searchStrArr = searchStr.trim().split(' ');
				for (var str of searchStrArr){
					str = str.trim();
					if (str.startsWith("-")){
						str = str.slice(1);
						arr = arr.filter(e=>e[0].indexOf(str) == -1 && JSON.stringify(e[1]).indexOf(str) == -1);
					}
					else{
						arr = arr.filter(e=>e[0].indexOf(str) > -1 || JSON.stringify(e[1]).indexOf(str) > -1);
					}
				}
			}
			
			arr = arr.reverse();
			return arr;
		},
		cardDetailCardData(){
			if (this.cardDetailCardName != null && this.cardDetailCardName.length > 0){
				// var cardData = CardCenter.getCardData();
				var cardObject = CardCenter.loadCard(this.cardDetailCardName);
				return cardObject;
			}
			return null;
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
			var newPattern = newVal.split(',');
			var oldPattern = oldVal.split(',');
			for (var i=0; i<this.userInput.cardActionPattern.length; i++){
				if (newPattern[i] != ActionPattern.Manual && oldPattern[i] == ActionPattern.Manual){
					this.userInput.cardManualAction[i] = [];
				}
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
		'cardFilter.selectCardName'(newCardName, oldVal){
			if (newCardName != null && newCardName.length > 0){
				this.userInput.cardname[this.cardFilter.currentIdx] = newCardName;
				this.userInput.char[this.cardFilter.currentIdx] = CardCenter.getCardData()[newCardName].char;
			}
		},
		inputJson(){
			if (this.importJsonResult != ''){
				this.importJsonResult = '';
			}
		}
		
	}
}).mount('#NuCarnivalAttackCalApp');