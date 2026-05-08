import { Character, Rarity, Class, Element, AttackType, ActionPattern, CounterAttackMode, ConditionHPStatus } from './../../build/Constants.js';
import { Battle } from './../../build/BattleSystem.js';
import { Team, Card, CardCenter } from './../../build/Card.js';
import { Condition } from './../../build/CardRule.js';
import { LogRule } from './../../build/LogRule.js';
import { BiMap } from './../../build/util/BiMap.js';
// import jsonCardData from './../../res/json/cardData.json' with { type: 'json' };
// import jsonEnemyData from './../../res/json/enemyData.json' with { type: 'json' };

var { NA, ...ELEMENT_MAP } = Element;

var config = {
	MAX_LEVEL: 60,
	LEVEL_SELECT: [-1,20,30,40,45,50,55],
	STARS: [1,2,3,4,5],
	POT_SELECT: [0,1,2,3,4,5,6,7,8,9,10,11,12],
	DEFAULT_STAR: {
		FULL: '全員滿星', SSR3: '3星SSR+5星SR', SSR1: '1星SSR+3星SR'
	},
	FILTERS:{
		rarity: Object.values(Rarity),
		char: Object.values(Character),
		clazz: Object.values(Class),
		element: Object.values(ELEMENT_MAP),
		coolDown: [3, 4, 5, 6],
		immuneSkill: ['免疫麻痺','免疫沉默','免疫睡眠'],
		buffSkill: ['攻擊力增加','普攻傷害增加','必殺技傷害增加','持續傷害增加','觸發技效果增加','造成傷害增加',
		'敵方受到普攻傷害增加','敵方受到必殺技傷害增加','敵方受到持續傷害增加','敵方受到觸發技傷害增加','敵方受到屬性傷害增加','敵方受到傷害增加'],
		healBuffSkill: ['治療量增加','持續治療量增加',
		'我方受到治療增加','我方受到持續治療增加'],
		lessDamageSkill: ['受到傷害減少','受到普攻傷害減少','受到必殺技傷害減少',
		'敵方攻擊力減少','敵方造成傷害減少','敵方普攻傷害減少','敵方必殺技傷害減少'],
		otherSkill: ['解除防禦']
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
		'char': {
			'八雲': 'yakumo', '艾德蒙特': 'edmond', '奧利文': 'olivine',
			'崑西': 'quincy', '玖夜': 'kuya', '可爾': 'garu',
			'布儡': 'blade', '啖天': 'dante', '歛': 'rei',
			'艾斯特': 'aster', '墨菲': 'morvay', '伊得': 'eiden'
		}
	},
	CHART:{
		FONT_SIZE: 16,
		FONT_FAMILY: "'Roboto', 'Noto Sans TC', '微軟正黑體', 'Arial', sans-serif",
		TEXT_COLOR: {light: '#000', dark: '#fff'},
		BORDER_COLOR: {light: 'rgba(0, 0, 0, 0.1)', dark: 'rgba(255, 255, 255, 0.2)'},
		CHART_COLOR: ['rgba(75, 192, 192, 0.8)','rgba(255, 99, 132, 0.8)','rgba(54, 162, 235, 0.8)','rgba(255, 159, 64, 0.8)','rgba(153, 102, 255, 0.8)'],
		types: {
			'none': { name: '無圖表', chartType: '' },
			'teamTurnDamage': { name: '隊伍回合輸出表', chartType: 'bar' },
			'cardDamage': { name: '個人輸出表', chartType: 'bar' },
			'cardDamageTotal': { name: '個人輸出累積表', chartType: 'line' },
			'damagePie': { name: '輸出佔比圖', chartType: 'pie' },
		},
	}
};

Vue.createApp({
    data() {
		return{
			tab: 'CAL',
			isEditCustomOrderMode: false,
			userInput: {
				cardname: ['', '', '', '', ''],
				cardActionOrder: [1, 2, 3, 4, 5],
				cardActionPattern: [ActionPattern.Immediately, ActionPattern.Immediately, ActionPattern.Immediately, ActionPattern.Immediately, ActionPattern.Immediately],
				cardManualAction:[[],[],[],[],[]],
				cardCustomTurnActionOrder: [[]], // eg. order[5] = [2, 5, 1, 3, 4]
				isCardEnabled: [true, true, true, true, true],
				enemyName: '',
				enemyCard: null,

				updateKey: 0,
				isAdvanceMode: true,
				turns: 14,
				isShowTurns: true,
				isDisplayTurnTotal: true,
				maxCounterAttack: 1,
				counterAttackMode: CounterAttackMode.everyTurn,
				isAllowHpCond: Condition.HP_STATUS,
				isModifyCardVal: false,
				defaultStar: 'SSR3',
				enemyElement: Element.NA,
				limitLevel: -1,
				isCalcEnemyDebuff: true,
				printOutputMode: Battle.PRINT_OUTPUT_OPTION.ALL,
			},
			userGlobalInput: {
				cardPot: 12,
				cardActionPattern: ActionPattern.Immediately,
			},
			cardFilter:{
				currentIdx: -1,
				selectCardName: '',
				searchStr: '',
				searchStrOp: 'AND',
				rarity: [],
				char: [],
				clazz: [],
				element: [],
				coolDown: [],
				charDisplayStyle: 'image',
				showFilter: false,
			},
			cardHpAtkSort:{
				sortBy: 'actualHp', // actualHp or hp or atk
				sortMode: 'desc', // asc or desc
				hpPercent: 0,
				level: 60,
				hp: { min: 0, max: 99999 },
				atk: { min: 0, max: 99999 },
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
					isCalcEnemyDebuff: true,
					isDisplayTurnTotal: true,
					maxCounterAttack: 1,
				},
				general: {
					charFilterDisplayStyle: 'image',
					recordPanelCardImgSize: 'normal',
					recordPanelPageMaxCount: 20,
					theme: 'light',
					damageChartDisplay: 'none',
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
				currentPage: 1,
				pageMaxCount: 20,
			},
			toastMessage: '',
			toastStatus: '',
			db: null,
			tierColorPresets: ['#ff7f7e','#ffbf7f','#ffdf80','#ffff7f','#bfff7f','#7fbfff','#bf7fff','#d4d4d4'],
			tierList: {
				title: '我的Tier List',
				tiers: [
					{ id: 1, label: 'S', color: '#ff7f7e', cards: [] },
					{ id: 2, label: 'A', color: '#ffbf7f', cards: [] },
					{ id: 3, label: 'B', color: '#ffdf80', cards: [] },
					{ id: 4, label: 'C', color: '#ffff7f', cards: [] },
					{ id: 5, label: 'D', color: '#bfff7f', cards: [] },
				],
				poolFilter: {
					rarity: [], char: [], clazz: [], element: [], coolDown: [],
					charDisplayStyle: 'image',
				},
				nextTierId: 6,
				openColorPopupId: null,
				savedKeys: [],
				loadDropdownOpen: false,
				loadSearchText: '',
				poolKey: 0,
			},
		}
	},
	async created()
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
		this.HP_STATUS = ConditionHPStatus;

		this.db = new Dexie('nuAttackCalculatorDB');
		this.db.version(2).stores({
			damageRecords: '++id, teamName, [turns+cardname]'
		});

		this.loadSettingFromStorage();

		await fetch("./res/json/cardData.json")
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
		});

		await fetch("./res/json/enemyData.json")
		.then(resp => {
			return resp.json();
		})
		.then(json => {
			CardCenter.setEnemyData(json);
			this.userInput.enemyName = "N/A";

			var urlParam=new URLSearchParams(window.location.search);
			if (urlParam.has('q')){
				var queryStr = LZString.decompressFromEncodedURIComponent(urlParam.get('q'));
				var damageRecord = JSON.parse(queryStr);
				if (damageRecord.enemyName != null && damageRecord.enemyName != '' && damageRecord.enemyName != 'N/A'){
					if (this.getEnemyNames().includes(damageRecord.enemyName)){
						this.userInput.enemyName = damageRecord.enemyName;
					}
				}
				this.loadDamageRecord(damageRecord);
			}
		});
	},
	mounted: function(){
		this.$watch(vm => [vm.setting], val => {
			this.saveSettingFromStorage();
		}, {
			immediate: true,
			deep: true
		});

		this.createSortable();

		// Close tier list color popup and load dropdown on outside click
		var vueObj = this;
		document.addEventListener('click', function(){
			vueObj.tierList.openColorPopupId = null;
			vueObj.tierList.loadDropdownOpen = false;
		});
	},
	updated()
	{
		const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
		const popoverList = [...popoverTriggerList].map(popoverTriggerEl => bootstrap.Popover.getOrCreateInstance(popoverTriggerEl, {
			'animation': false
		}));
		popoverList.forEach(e=>e._config.content=e._element.getAttribute('data-bs-content'));

		// Performance tune: clear damage records after close modal
		const myModalEl = document.getElementById('damageRecordModal')
		if (myModalEl != null){
			myModalEl.addEventListener('hidden.bs.modal', event => {
				this.damageRecords = [];
			})
		}

		// Add back draggable after UI changes
		const charInputList = document.querySelector('#charInputList');
		if (charInputList != null && !charInputList.classList.contains('isDraggable')){
			this.createSortable();
		}

		// Re-init tier list sortable when tier tab is active
		if (this.tab === 'TIER'){
			this.initTierListSortable();
		}
	},
	methods: {
		switchTheme(){
			var theme = this.setting.general.theme == 'light' ? 'dark' : 'light';
			this.setting.general.theme = theme;
			document.documentElement.setAttribute('data-bs-theme', theme);
			document.documentElement.classList = 'theme-'+theme;
			this.updateChart(true);
		},
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

			el = document.querySelector("#battleTurnTable.resultTable .table-header");
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
			if (tab === 'TIER'){
				this.$nextTick(() => this.initTierListSortable());
			}
		},
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
					
					if (this.userGlobalInput.cardPot != null){
						card.potential = this.userGlobalInput.cardPot;
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
			this.battle.hpStatus = this.userInput.isAllowHpCond;
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
		updateChart(requireRedraw = false){
			if (this.battle == null || this.setting.general.damageChartDisplay == 'none'){
				return;
			}
			var damageChart = Chart.getChart("damageChart");
			
			
			var displayMode = this.setting.general.damageChartDisplay || 'cardDamage';
			var chartType = config.CHART.types[displayMode].chartType;

			var datasets = [];
			var outputOption = this.userInput.printOutputMode;
			if (outputOption == Battle.PRINT_OUTPUT_OPTION.ALL){
				outputOption = Battle.PRINT_OUTPUT_OPTION.ONLY_DAMAGE;
			}

			if (displayMode == 'teamTurnDamage'){
				var cardDamageArr = [];
				for (var turn=1; turn<=this.userInput.turns; turn++){
					cardDamageArr.push(this.battle.getTeamTurnValue(turn, outputOption));
				}
				datasets.push({
					label: '隊伍',
					data: cardDamageArr,
					backgroundColor: config.CHART.CHART_COLOR[1],
					borderColor: config.CHART.CHART_COLOR[1]
				});
			}
			else{
				for (var i =0; i<this.cards.length; i++){
					var card = this.cards[i];
					if (card != null && this.userInput.isCardEnabled[i]){
						var cardDamageArr = [];
						for (var turn=1; turn<=this.userInput.turns; turn++){
							cardDamageArr.push(this.battle.getTurnValue(card.name, turn, outputOption));
						}
						if (displayMode == 'cardDamageTotal'){
							var sum = 0;
							cardDamageArr = cardDamageArr.map(val => sum += val);
						}
						datasets.push({
							label: card.name,
							data: cardDamageArr,
							backgroundColor: config.CHART.CHART_COLOR[i],
							borderColor: config.CHART.CHART_COLOR[i]
						});
					}
				}
			}

			var labels = [ ...Array(this.userInput.turns).keys() ].map( i => i+1);
			var footer = (tooltipItems) => {
				return null;
			};
			if (displayMode == 'damagePie'){
				var data = datasets.flatMap(e=>e.data.reduce((sum, a) => sum + a, 0));
				labels = datasets.flatMap(e=>e.label);
				datasets = [{
					data: data,
					backgroundColor: config.CHART.CHART_COLOR,
				}];
				footer = (tooltipItems) => {
					let total = tooltipItems[0].dataset.data.reduce((sum, a) => sum + a, 0);
					let value = tooltipItems[0].raw;
					let percentage = Math.round(value / total * 10000) / 100;
					return percentage + '%';
				};
			}

			if (requireRedraw){
				if (damageChart != null){
					damageChart.destroy();
				}
			}
			if (damageChart == null || requireRedraw){
				damageChart = new Chart(
					document.getElementById('damageChart'),
					{
						type: chartType,
						options: {
							interaction: {
								intersect: false,
								mode: 'nearest'
							},
							plugins: {
								title: {
									display: true,
								},
								tooltip: {
									position: 'nearest',
									callbacks: {
										footer: footer,
									}
								}
							}
						}
					}
				);

				var theme = this.setting.general.theme;
				Chart.defaults.font.size = config.CHART.FONT_SIZE;
				Chart.defaults.font.family = config.CHART.FONT_FAMILY;
				Chart.defaults.color = config.CHART.TEXT_COLOR[theme];
				Chart.defaults.borderColor = config.CHART.BORDER_COLOR[theme];
			}

			damageChart.options.plugins.title.text = config.CHART.types[displayMode].name;
			damageChart.data = {
				labels: labels,
				datasets: datasets,
			};
			damageChart.resize();
			damageChart.update();
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
		getTurnPopMessage(turn){
			var msgList = [];
			if (this.userInput.enemyCard == null || this.battle == null){
				return '';
			}
			msgList.push('<span class="info-title"><b><u>'+this.userInput.enemyCard.name+'(T'+turn+')</u></b></span>');
			msgList.push('血量：'+this.battle.getEnemyTurnHpValue(turn)+'（'+this.battle.getEnemyTurnHpPercent(turn)+'%）');
			var shieldVal = this.battle.getEnemyTurnShieldValue(turn);
			if (shieldVal >= 0){
				msgList.push('護盾：'+this.battle.getEnemyTurnShieldValue(turn));
			}
			if (turn == this.battle.enemyKilledTurn){
				msgList.push('<span class="info-attack">Victory - 戰勝 ' + this.userInput.enemyCard.name + '！</span>');
			}
			return msgList.join('<br />');
		},
		getTurnClass(turn){
			if (this.userInput.enemyCard == null || this.battle == null){
				return '';
			}
			if (turn == this.battle.enemyKilledTurn){
				return 'victoryTurn';
			}
			
			if (this.userInput.enemyCard.hpLock != null && this.battle.isEnemyHpLockTurn(turn)){
				return 'hpLockTurn';
			}
			return '';
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
				this.cardFilter.searchStrOp = 'AND';
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
			this.cardFilter.searchStrOp = 'AND';
			this.cardFilter.showFilter = false;
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
			return './res/img/card/' + config.IMAGE_PATH.char[cardData.char] + '/' + cardData.img;
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
		importJsonStr(isEnemy = false){
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
				if (isEnemy){
					// var name = Object.keys(jsonObj);
					// this.userInput.enemyCard = Card.loadCardFromJson(name, jsonObj[name]);
					CardCenter.addUserEnemyData(jsonObj);
				}
				else{
					CardCenter.addUserCardData(jsonObj);
				}
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
				this.tierList.poolFilter.charDisplayStyle = charFilterDisplayStyle;
			}
			var recordPanelCardImgSize = this.setting['general']['recordPanelCardImgSize'];
			if (['normal','big','small', 'none'].includes(recordPanelCardImgSize)) {
				this.damageRecordPanel.cardImgSize = recordPanelCardImgSize;
			}
			var pageCount = this.setting['general']['recordPanelPageMaxCount'];
			if (Number.isInteger(pageCount)) {
				this.damageRecordPanel.pageMaxCount = pageCount;
			}
			var theme = this.setting['general']['theme'];
			if (['light','dark'].includes(theme)) {
				document.documentElement.setAttribute('data-bs-theme', theme);
				document.documentElement.classList = 'theme-'+theme;
			}
		},
		saveSettingFromStorage(){
			let map = {};
			map['setting'] = this.setting;
			localStorage.setItem("nuAttackCalculator", JSON.stringify(map));
			// this.loadSetting();
		},
		loadDamageRecord(record){
			this.userInput.cardActionOrder = record.cardActionOrder;
			this.userInput.cardActionPattern = record.cardActionPattern;
			this.userInput.cardManualAction = record.cardManualAction;
			this.userInput.isCardEnabled = [true, true, true, true, true];
			if (record.isCardEnabled != null){
				this.userInput.isCardEnabled = record.isCardEnabled;
			}
			this.userInput.cardCustomTurnActionOrder = [[]];
			if (record.cardCustomTurnActionOrder != null){
				this.userInput.cardCustomTurnActionOrder = record.cardCustomTurnActionOrder;
			}
			this.userInput.turns = parseInt(record.turns);
			var cardDmgDataArr = record.cards;

			this.teamName = record.teamName;
			this.userInput.cardname = ['', '', '', '', ''];
			this.cards = [null, null, null, null, null];
			for (var i=0; i<5; i++){
				var cardDmgData = cardDmgDataArr[i];
				if (cardDmgData != null){
					var card = CardCenter.loadCard(cardDmgData.name);
					card.star = cardDmgData.star;
					this.userInput.cardname[i] = cardDmgData.name;
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
		showDeleteConfirmToast(){
			var toastEle = document.getElementById('deleteConfirmToast');
			var toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastEle);
			toastBootstrap.show();
		},
		generateDamageRecord(forShare = false){
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
						currentHp: card.currentHp
					};
					if (!forShare){
						if (this.userInput.isCardEnabled[i]){
							cardDmgData['dmg'] = this.getBattleTotalValue(card.name);
						}
					}
				}
				cardDmgDataArr.push(cardDmgData);
			}
			var teamTotalDamage = this.getBattleTeamTotalValue();

			var record = {};
			if (forShare)
				record = {
					teamName: this.teamName,
					turns: this.userInput.turns,
					cardname: [...this.userInput.cardname],
					isCardEnabled: [...this.userInput.isCardEnabled],
					cardActionOrder: [...this.userInput.cardActionOrder],
					cardActionPattern: [...this.userInput.cardActionPattern],
					cardManualAction: [...this.userInput.cardManualAction],
					cardCustomTurnActionOrder: [...this.userInput.cardCustomTurnActionOrder],
					cards: cardDmgDataArr,
					enemyName: this.userInput.enemyName
				};
			else{
				record = {
					teamName: this.teamName,
					turns: this.userInput.turns,
					cardname: [...this.userInput.cardname],
					isCardEnabled: [...this.userInput.isCardEnabled],
					cardActionOrder: [...this.userInput.cardActionOrder],
					cardActionPattern: [...this.userInput.cardActionPattern],
					cardManualAction: [...this.userInput.cardManualAction],
					cardCustomTurnActionOrder: [...this.userInput.cardCustomTurnActionOrder],
					cards: cardDmgDataArr,
					totalDamage: teamTotalDamage,
					isFav: false,
				};
			}

			return record;
		},
		addDamageRecord(){
			var record = this.generateDamageRecord();
			var vueObj = this;
			var teamNameTitle = record.teamName.split('\n')[0];
			this.getExistsDamageRecord(record).then(existRecord=>{
				if (existRecord != null){
					record.id = existRecord.id;
					record.isFav = existRecord.isFav;
					if (record.teamName == null || record.teamName == ''){
						record.teamName = existRecord.teamName;
						if (record.teamName != null){
							teamNameTitle = record.teamName.split('\n')[0];
						}
					}
					vueObj.db.damageRecords.put(JSON.parse(JSON.stringify(record)));
					vueObj.showToast('已更新隊伍 ' + teamNameTitle);
				}
				else{
					vueObj.db.damageRecords.add(JSON.parse(JSON.stringify(record)));
					vueObj.showToast('已加入隊伍 ' + teamNameTitle);
				}
				vueObj.teamName = '';
			});
		},
		async getExistsDamageRecord(record){
			var isExists = true;
			var damageRecordList = await this.db.damageRecords.where({"turns":record.turns, "cardname":record.cardname}).toArray();
			for (var damageRecord of damageRecordList){
				if (JSON.stringify(record.cardActionPattern) == JSON.stringify(damageRecord.cardActionPattern)
					&& JSON.stringify(record.cardActionOrder) == JSON.stringify(damageRecord.cardActionOrder)
					&& JSON.stringify(record.cardManualAction) == JSON.stringify(damageRecord.cardManualAction)
					&& JSON.stringify(record.cardCustomTurnActionOrder) == JSON.stringify(damageRecord.cardCustomTurnActionOrder)
				){
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
			if (str == null) str = '';
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
		deleteAllDamageRecord(){
			this.db.damageRecords.clear();
			this.damageRecords = [];
		},
		importDamageRecord(event){
			var file = event.target.files[0];

			const reader = new FileReader();
			var vueObj = this;
			reader.onload = async (e) => {
				var str = e.target.result;
				var json = JSON.parse(str);

				var addList = [];
				var updateList = [];
				for (var record of json){
					delete record.id;
					var existRecord = await vueObj.getExistsDamageRecord(record);

					if (existRecord != null){
						record.id = existRecord.id;
						record.isFav = existRecord.isFav;
						if (record.teamName == null || record.teamName == ''){
							record.teamName = existRecord.teamName;
						}
						updateList.push(JSON.parse(JSON.stringify(record)));
					}
					else{
						addList.push(JSON.parse(JSON.stringify(record)));
					}
				}
				vueObj.db.damageRecords.bulkPut(updateList).then(recordId=>{
					if (addList.length == 0){
						vueObj.loadRecordsFromDB();
					}
				});
				vueObj.db.damageRecords.bulkAdd(addList).then(recordId=>{
					vueObj.loadRecordsFromDB();
				});

				var toastMsg = addList.length > 0 ? '已新增 ' + addList.length + ' 記錄；' : '';
				toastMsg += updateList.length > 0 ? '已更新 ' + updateList.length + ' 記錄' : '';
				vueObj.showToast(toastMsg);
				
			};
			reader.readAsText(file);
		},
		exportDamageRecord(){
			var json = JSON.stringify(this.getDamageRecords);
			var blob = new Blob([json], { type: "text/plain;charset=utf-8" });
    		saveAs(blob, 'output.json');
		},
		refreshDamageRecordPanelUI(){
			this.setting['general']['recordPanelPageMaxCount'] = this.damageRecordPanel.pageMaxCount;
			var el = document.querySelector('#damageRecordModal .card-panel');
			if (el != null){
				el.scrollTop=0;
			}
		},
		copyTableImage(id, retryCount = 0){
			var table = document.getElementById(id);
			if (table != null){
				var vueObj = this;
				if (retryCount == 0){
					vueObj.showToast('截圖中...');
				}
				htmlToImage.toBlob(table).then(function (blob) {
					navigator.clipboard.write([
						new ClipboardItem({
							'image/png': blob,
						})
					]).then(()=>{
						vueObj.showToast('已複製至剪貼簿！');
					}).catch(function (error) {
						if (retryCount < 3){
							vueObj.copyTableImage(id, ++retryCount);
						}
						else{
							vueObj.showToast('截圖失敗，請再試一次！');
						}
					});
				})
				.catch(function (error) {
					if (retryCount < 3){
						vueObj.copyTableImage(id, ++retryCount);
					}
					else{
						vueObj.showToast('截圖失敗，請再試一次！');
					}
				});
			}
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
		sortTableSort(val){
			if (val == this.cardHpAtkSort.sortBy){
				this.cardHpAtkSort.sortMode = this.cardHpAtkSort.sortMode == 'asc' ? 'desc' : 'asc';
			}
			else{
				this.cardHpAtkSort.sortMode = 'desc';
			}
			this.cardHpAtkSort.sortBy = val;
		},
		resetCardSort(){
			this.cardHpAtkSort.sortBy = 'actualHp';
			this.cardHpAtkSort.sortMode = 'desc';
			this.cardHpAtkSort.hpPercent = 0;
			this.cardHpAtkSort.level = 60;
			this.cardHpAtkSort.hp = { min: 0, max: 99999 };
			this.cardHpAtkSort.atk = { min: 0, max: 99999 };
			this.cardHpAtkSort.rarity = [];
			this.cardHpAtkSort.char = [];
			this.cardHpAtkSort.clazz = [];
			this.cardHpAtkSort.element = [];
			this.cardHpAtkSort.coolDown = [];
		},
		// --- Tier List methods ---
		tierListSave(){
			var title = this.tierList.title.trim();
			if (!title){
				this.showToast('請先輸入Tier List標題', 'text-bg-danger');
				return;
			}
			var storageKey = 'tierList_' + title;
			var existing = localStorage.getItem(storageKey);
			if (existing){
				if (!confirm('「' + title + '」已存在，確定要覆蓋嗎？')) return;
			}
			var data = {
				title: title,
				tiers: this.tierList.tiers.map(t => ({
					label: t.label,
					color: t.color,
					cards: [...t.cards],
				})),
				lastModified: Date.now(),
			};
			localStorage.setItem(storageKey, JSON.stringify(data));
			this.tierListRefreshSavedKeys();
			this.showToast('已儲存「' + title + '」');
		},
		tierListRefreshSavedKeys(){
			var keys = [];
			for (var i = 0; i < localStorage.length; i++){
				var k = localStorage.key(i);
				if (k.startsWith('tierList_')){
					try {
						var item = JSON.parse(localStorage.getItem(k));
						keys.push({ title: item.title, lastModified: item.lastModified || 0 });
					} catch(e){}
				}
			}
			keys.sort((a, b) => b.lastModified - a.lastModified);
			this.tierList.savedKeys = keys;
		},
		tierListLoad(title){
			var storageKey = 'tierList_' + title;
			var raw = localStorage.getItem(storageKey);
			if (!raw) return;
			var data = JSON.parse(raw);
			this.tierList.title = data.title;
			this.tierList.tiers = data.tiers.map((t, idx) => ({
				id: idx + 1,
				label: t.label,
				color: t.color,
				cards: [...t.cards],
			}));
			this.tierList.nextTierId = data.tiers.length + 1;
			this.tierList.openColorPopupId = null;
			this.tierList.loadDropdownOpen = false;
			this.tierList.loadSearchText = '';
			this.tierListResetPoolFilter();
			this.tierList.poolKey++;
			this.$nextTick(() => this.initTierListSortable(true));
			this.showToast('已載入「' + title + '」');
		},
		tierListToggleLoadDropdown(){
			this.tierListRefreshSavedKeys();
			this.tierList.loadDropdownOpen = !this.tierList.loadDropdownOpen;
			this.tierList.loadSearchText = '';
		},
		tierListDeleteSaved(title){
			if (!confirm('確定要刪除「' + title + '」嗎？')) return;
			localStorage.removeItem('tierList_' + title);
			this.tierListRefreshSavedKeys();
			this.showToast('已刪除「' + title + '」');
		},
		tierListAddTier(){
			this.tierList.tiers.push({
				id: this.tierList.nextTierId++,
				label: '',
				color: '#d4d4d4',
				cards: [],
			});
			this.$nextTick(() => this.initTierListSortable());
		},
		tierListAddTierAfter(tierIdx){
			this.tierList.tiers.splice(tierIdx + 1, 0, {
				id: this.tierList.nextTierId++,
				label: '',
				color: '#d4d4d4',
				cards: [],
			});
			this.$nextTick(() => this.initTierListSortable());
		},
		tierListRemoveTier(tierIdx){
			this.tierList.tiers.splice(tierIdx, 1);
		},
		tierListRemoveCard(tier, cardIdx){
			tier.cards.splice(cardIdx, 1);
			this.tierList.poolKey++;
			this.$nextTick(() => this.initTierListSortable(true));
		},
		tierListToggleColorPopup(tierId){
			this.tierList.openColorPopupId = this.tierList.openColorPopupId === tierId ? null : tierId;
		},
		tierListCapture(){
			var titleEl = document.querySelector('.tierlist-title');
			var rowsEl = document.getElementById('tierListRows');
			if (!titleEl || !rowsEl) return;
			// Create a temporary wrapper to capture both elements together
			var wrapper = document.createElement('div');
			wrapper.style.display = 'inline-block';
			wrapper.style.background = getComputedStyle(document.body).backgroundColor || '#fff';
			wrapper.style.padding = '12px';
			wrapper.appendChild(titleEl.cloneNode(true));
			var titleClone = wrapper.querySelector('.tierlist-title');
			titleClone.style.display = 'block';
			titleClone.style.marginBottom = '8px';
			wrapper.appendChild(rowsEl.cloneNode(true));
			document.body.appendChild(wrapper);
			var vueObj = this;
			vueObj.showToast('截圖中...');
			htmlToImage.toBlob(wrapper).then(function(blob){
				document.body.removeChild(wrapper);
				navigator.clipboard.write([
					new ClipboardItem({ 'image/png': blob })
				]).then(()=>{
					vueObj.showToast('已複製至剪貼簿！');
				}).catch(()=>{
					vueObj.showToast('截圖失敗，請再試一次！');
				});
			}).catch(function(){
				document.body.removeChild(wrapper);
				vueObj.showToast('截圖失敗，請再試一次！');
			});
		},
		tierListReset(){
			if (!confirm('確定要重設整個Tier List嗎？所有卡片將會回到卡池。')) return;
			this.tierList.title = '我的Tier List';
			this.tierList.tiers = [
				{ id: 1, label: 'S', color: '#ff7f7e', cards: [] },
				{ id: 2, label: 'A', color: '#ffbf7f', cards: [] },
				{ id: 3, label: 'B', color: '#ffdf80', cards: [] },
				{ id: 4, label: 'C', color: '#ffff7f', cards: [] },
				{ id: 5, label: 'D', color: '#bfff7f', cards: [] },
			];
			this.tierList.nextTierId = 6;
			this.tierListResetPoolFilter();
			this.tierList.poolKey++;
			this.$nextTick(() => this.initTierListSortable(true));
		},
		tierListResetPoolFilter(){
			this.tierList.poolFilter.rarity = [];
			this.tierList.poolFilter.char = [];
			this.tierList.poolFilter.clazz = [];
			this.tierList.poolFilter.element = [];
			this.tierList.poolFilter.coolDown = [];
		},
		tierListAutoResizeLabel(event){
			var el = event.target;
			el.style.height = 'auto';
			el.style.height = el.scrollHeight + 'px';
		},
		tierListGetCardObj(cardname){
			return CardCenter.loadCardBasic(cardname);
		},
		tierListGetFilterIconPath(type, value){
			if (type == 'char'){
				var folder = this.tierList.poolFilter.charDisplayStyle == 'pixel' ? 'pixel' : 'image';
				return './res/img/card-icon/' + folder + '/' + type + '-' + config.IMAGE_PATH[type][value] + '.png';
			}
			return './res/img/card-icon/' + type + '-' + config.IMAGE_PATH[type][value] + '.png';
		},
		tierListOpenFilter(){
			var el = document.getElementById('tierListFilterPanel');
			var bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(el);
			bsOffcanvas.show();
		},
		initTierListSortable(forceReinit){
			var vueObj = this;

			// Pool sortable
			var poolEl = document.getElementById('tierListPool');
			if (poolEl) {
				if (forceReinit && poolEl._sortable) {
					poolEl._sortable.destroy();
					poolEl._sortable = null;
					poolEl.classList.remove('isDraggable');
				}
				if (!poolEl.classList.contains('isDraggable')){
					poolEl._sortable = Sortable.create(poolEl, {
						group: { name: 'tierlist', pull: 'clone', put: false },
						draggable: '.tierlist-card',
						sort: false,
						animation: 150,
						onEnd: function(evt){
							// Remove the clone left behind in pool by SortableJS
							if (evt.pullMode === 'clone' && evt.clone && evt.clone.parentNode){
								evt.clone.parentNode.removeChild(evt.clone);
							}
						},
					});
					poolEl.classList.add('isDraggable');
				}
			}

			// Tier row sortables
			document.querySelectorAll('.tier-drop-zone').forEach(function(el){
				if (forceReinit && el._sortable) {
					el._sortable.destroy();
					el._sortable = null;
					el.classList.remove('isDraggable');
				}
				if (!el.classList.contains('isDraggable')){
					var tierId = parseInt(el.getAttribute('data-tier-id'));
					el._sortable = Sortable.create(el, {
						group: { name: 'tierlist', pull: true, put: true },
						draggable: '.tierlist-card',
						animation: 150,
						onAdd: function(evt){
							var cardname = evt.item.getAttribute('data-cardname');
							var tier = vueObj.tierList.tiers.find(t => t.id === tierId);
							if (!tier) return;

							// Prevent duplicate: if already in this tier, just remove the cloned DOM
							if (tier.cards.includes(cardname)){
								evt.item.parentNode.removeChild(evt.item);
								return;
							}

							var newIndex = evt.newIndex;

							// Revert DOM: remove the item SortableJS placed here
							evt.item.parentNode.removeChild(evt.item);

							// If from another tier (not cloned from pool), put it back in source
							// so Vue can cleanly patch the source tier's DOM
							if (evt.from.id !== 'tierListPool') {
								if (evt.oldIndex >= evt.from.children.length) {
									evt.from.appendChild(evt.item);
								} else {
									evt.from.insertBefore(evt.item, evt.from.children[evt.oldIndex]);
								}
							}

							// Remove from source tier (if moving between tiers)
							for (var t of vueObj.tierList.tiers){
								if (t.id === tierId) continue;
								var idx = t.cards.indexOf(cardname);
								if (idx > -1){
									t.cards.splice(idx, 1);
									break;
								}
							}

							// Add to target tier at the intended drop position
							tier.cards.splice(newIndex, 0, cardname);

							// Force pool re-render and reinit all sortables after Vue patches
							vueObj.tierList.poolKey++;
							vueObj.$nextTick(() => vueObj.initTierListSortable(true));
						},
						onUpdate: function(evt){
							var tier = vueObj.tierList.tiers.find(t => t.id === tierId);
							if (!tier) return;

							// Read the intended order from DOM BEFORE reverting
							var newOrder = [];
							el.querySelectorAll(':scope > .tierlist-card[data-cardname]').forEach(function(c){
								newOrder.push(c.getAttribute('data-cardname'));
							});

							// Revert DOM: remove item and put it back at original position
							// so Vue can apply its own rendering from the updated data
							evt.from.removeChild(evt.item);
							if (evt.oldIndex >= evt.from.children.length){
								evt.from.appendChild(evt.item);
							} else {
								evt.from.insertBefore(evt.item, evt.from.children[evt.oldIndex]);
							}

							// Update Vue data to the intended order
							tier.cards.splice(0, tier.cards.length, ...newOrder);

							// Reinit sortables after Vue patches to keep state fresh
							vueObj.$nextTick(() => vueObj.initTierListSortable(true));
						},
					});
					el.classList.add('isDraggable');
				}
			});

			// Tier rows reorder
			var tierContainer = document.getElementById('tierListRows');
			if (tierContainer) {
				if (forceReinit && tierContainer._sortable) {
					tierContainer._sortable.destroy();
					tierContainer._sortable = null;
					tierContainer.classList.remove('isDraggable');
				}
				if (!tierContainer.classList.contains('isDraggable')){
					tierContainer._sortable = Sortable.create(tierContainer, {
						draggable: '.tier-row',
						handle: '.tier-label-cell',
						animation: 150,
						onEnd: function(evt){
							if (evt.oldIndex !== evt.newIndex){
								var moved = vueObj.tierList.tiers.splice(evt.oldIndex, 1)[0];
								vueObj.tierList.tiers.splice(evt.newIndex, 0, moved);
							}
						},
					});
					tierContainer.classList.add('isDraggable');
				}
			}
		},
		handleCardTurnActionOrderEvt(evt, turn, cardIdx){
			const order = Number(evt.target.value);
			this.setCardCustomTurnActionOrder(turn, cardIdx, order);
		},
		setCardCustomTurnActionOrder(turn, cardIdx, order){
			let defaultOrder = this.userInput.cardActionOrder;
			// Set Order
			if (this.userInput.cardCustomTurnActionOrder[turn]){
				// this.userInput.cardCustomTurnActionOrder[turn][cardIdx] = order;
				this.updateOrderQueue(this.userInput.cardCustomTurnActionOrder[turn], cardIdx, order);
			}
			else{
				let turnOrder = [];
				for (let i=0; i<defaultOrder.length; i++){
					turnOrder[i] = defaultOrder[i];
				}
				// turnOrder[cardIdx] = order;
				this.updateOrderQueue(turnOrder, cardIdx, order);
				this.userInput.cardCustomTurnActionOrder[turn] = turnOrder;
			}

			// Check if it is same as default
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
		updateOrderQueue(queue, cardIdx, newValue) {
			// Set queue[cardIdx] to the new value
			queue[cardIdx] = newValue;
			
			// Get indices and values of other positions (excluding index)
			const otherIndices = [0, 1, 2, 3, 4].filter(i => i !== cardIdx);
			const current = otherIndices.map(i => ({ val: queue[i], idx: i }));
			
			// Determine available priorities (1 to 5 excluding newValue)
			const allPriorities = [1, 2, 3, 4, 5];
			const available = allPriorities.filter(val => val !== newValue).sort((a, b) => a - b);
			
			// Sort indices of current priorities to maintain relative order
			const sortedIndices = current
				.sort((a, b) => a.val - b.val)
				.map(item => item.idx);
			
			// Assign available priorities in order to maintain relative ranking
			sortedIndices.forEach((idx, i) => {
				queue[idx] = available[i];
			});
			
			return queue;
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
		},
		copyUrlToClipboard(text){
			try {
				navigator.clipboard.writeText(text);
				this.showToast('已複製網址！');
			} catch (err) {
				this.showToast('複製網址失敗！');
				console.error('Failed to copy url: ', err);
			}
		}
	},
	computed: {
		homeUrl(){
			return location.protocol + '//' + window.location.host + window.location.pathname;
		},
		isEditTeam(){
			return this.damageRecordPanel.editElement.startsWith("teamName_");
		},
		getDamageRecordsPageCount(){
			const list = this.getDamageRecords;
			const pageCount = this.damageRecordPanel.pageMaxCount;
			return Math.ceil(list.length / pageCount);
		},
		getDamageRecordsByPage() {
			const list = this.getDamageRecords;
			const pageCount = this.damageRecordPanel.pageMaxCount;
			const page = this.damageRecordPanel.currentPage - 1;
			return list.slice(page*pageCount, pageCount + page*pageCount);
		},
		getDamageRecords() {
			this.damageRecordPanel.currentPage = 1;
			// this.refreshDamageRecordPanelUI();

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
				arr = arr.sort((e1, e2)=>e1.id - e2.id);
			}
			else if (sortBy == 'teamName'){
				arr = arr.sort((e1, e2)=>e1.teamName - e2.teamName);
			}
			else if (sortBy == 'turns'){
				arr = arr.sort((e1, e2)=>e1.turns - e2.turns);
			}
			else if (sortBy == 'totalDamage'){
				arr = arr.sort((e1, e2)=>e1.totalDamage - e2.totalDamage);
			}
			else if (sortBy == 'isFav'){
				arr = arr.sort((e1, e2)=>e1.isFav != e2.isFav ? e1.isFav : e1.id - e2.id);
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
							else return e1.cards[cardIdx].dmg - e2.cards[cardIdx].dmg;
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
		getSortCards(){
			var cardArr = [];
			// load cards
			var cardDataJson = CardCenter.getCardData();
			for (var cardData of Object.entries(cardDataJson)) {
				var cardname = cardData[0];
				var card = CardCenter.loadCardBasic(cardname);
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
				card.level = this.cardHpAtkSort.level;
				cardArr.push(card);
			}

			// filter
			var chars = this.cardHpAtkSort.char;
			var rarity = this.cardHpAtkSort.rarity;
			var clazz = this.cardHpAtkSort.clazz;
			var element = this.cardHpAtkSort.element;
			var coolDown = this.cardHpAtkSort.coolDown;
			var filterHp = this.cardHpAtkSort.hp;
			var filterAtk = this.cardHpAtkSort.atk;
			var hpPercent = this.cardHpAtkSort.hpPercent;
			
			if (chars.length > 0){
				cardArr = cardArr.filter(e=>chars.includes(e.char));
			}
			if (rarity.length > 0){
				cardArr = cardArr.filter(e=>rarity.includes(e.rarity));
			}
			if (clazz.length > 0){
				cardArr = cardArr.filter(e=>clazz.includes(e.class));
			}
			if (element.length > 0){
				cardArr = cardArr.filter(e=>element.includes(e.element));
			}
			if (coolDown.length > 0){
				cardArr = cardArr.filter(e=>coolDown.includes(e.coolDown));
			}
			if (filterHp.min > 0 || filterHp.max < 99999){
				cardArr = cardArr.filter(e=>e.getActualHp(hpPercent) >= filterHp.min && e.getActualHp(hpPercent) <= filterHp.max);
			}
			if (filterAtk.min > 0 || filterAtk.max < 99999){
				cardArr = cardArr.filter(e=>e.getAtk() >= filterAtk.min && e.getAtk() <= filterAtk.max);
			}

			// sort
			if (this.cardHpAtkSort.sortBy == 'hp'){
				cardArr.sort((o1, o2)=> o1.getHp() - o2.getHp());
			}
			else if (this.cardHpAtkSort.sortBy == 'actualHp'){
				cardArr.sort((o1, o2)=> o1.getActualHp(hpPercent) - o2.getActualHp(hpPercent));
			}
			else{
				cardArr.sort((o1, o2)=> o1.getAtk() - o2.getAtk());
			}
			if (this.cardHpAtkSort.sortMode == 'desc'){
				cardArr = cardArr.reverse();
			}
			return cardArr;
		},
		tierListFilteredSavedKeys(){
			var search = this.tierList.loadSearchText;
			if (!search) return this.tierList.savedKeys;
			var s = search.toLowerCase();
			return this.tierList.savedKeys.filter(k => k.title.toLowerCase().includes(s));
		},
		getTierListPoolCards(){
			// All cards not placed in any tier
			var placedCards = new Set();
			for (var tier of this.tierList.tiers){
				for (var c of tier.cards){
					placedCards.add(c);
				}
			}
			var cardDataJson = CardCenter.getCardData();
			var cardArr = [];
			for (var cardname of Object.keys(cardDataJson)){
				if (!placedCards.has(cardname)){
					cardArr.push(cardname);
				}
			}
			// Apply pool filters
			var filter = this.tierList.poolFilter;
			if (filter.rarity.length > 0){
				cardArr = cardArr.filter(n => filter.rarity.includes(cardDataJson[n].rarity));
			}
			if (filter.clazz.length > 0){
				cardArr = cardArr.filter(n => filter.clazz.includes(cardDataJson[n].class));
			}
			if (filter.element.length > 0){
				cardArr = cardArr.filter(n => filter.element.includes(cardDataJson[n].element));
			}
			if (filter.coolDown.length > 0){
				cardArr = cardArr.filter(n => filter.coolDown.includes(cardDataJson[n].coolDown));
			}
			if (filter.char.length > 0){
				cardArr = cardArr.filter(n => filter.char.includes(cardDataJson[n].char));
			}
			cardArr = cardArr.reverse();
			return cardArr;
		},
		getFilteredCards(){
			var arr = [];
			var cardData = CardCenter.getCardData();
			for (var card of Object.entries(cardData)) {
				arr.push(card);
			}

			var searchStr = this.cardFilter.searchStr;
			var searchStrOp = this.cardFilter.searchStrOp;
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
				if (searchStrOp == 'AND'){
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
				else if (searchStrOp == 'OR'){
					var includeStrArr = searchStrArr.filter(e=>!e.startsWith("-"));
					// var excludeStrArr = searchStrArr.filter(e=>e.startsWith("-")).map(e=>e.slice(1));
					arr = arr.filter(e=>includeStrArr.some(s=>e[0].includes(s)) || includeStrArr.some(s=>JSON.stringify(e[1]).includes(s)));
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
			var result = [];
			for (var card of this.cards){
				if (card != null){
					result.push(card.name + ',' + card.star + ',' + card.level + ',' + card.potential + ',' + card.atk + ',' + card.currentHp);
				}
			}
			return result.sort().join(';');
		},
		teamShareURL(){
			var url = window.location.host + window.location.pathname;
			if (this.userInput.cardname.filter(e=>e.length>0).length == 0){
				return url;
			}
			var p = new URLSearchParams();
			// p.set("cards", this.userInput.cardname.join(","));
			var record = this.generateDamageRecord(true);
			var queryStr = LZString.compressToEncodedURIComponent(JSON.stringify(record));
			p.set("q", queryStr);
			
			return url + "?" + p.toString();
		},
	},
	watch:{
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
		},
		'userGlobalInput.cardPot'(newVal, oldVal){
			for (var card of this.cards){
				if (card != null){
					card.potential = newVal;
				}
			}
			this.updateBattle();
		},
		'userGlobalInput.cardActionPattern'(newVal, oldVal){
			for (var i=0; i<5; i++){
				this.userInput.cardActionPattern[i] = newVal;
			}
			this.updateBattle();
		},
	}
}).mount('#NuCarnivalAttackCalApp');