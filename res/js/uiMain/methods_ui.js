import { Character, Rarity, Class, Element, AttackType, ActionPattern, CounterAttackMode, ConditionHPStatus } from '/build/Constants.js';
import { Battle } from '/build/BattleSystem.js';
import { Team, Card, CardCenter } from '/build/Card.js';
import { LogRule } from '/build/LogRule.js';
import { UIConfig } from './config.js';

var { NA, ...ELEMENT_MAP } = Element;


export default {
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
	},
	updateChart(requireRedraw = false){
		if (this.battle == null || this.setting.general.damageChartDisplay == 'none'){
			return;
		}
		var damageChart = Chart.getChart("damageChart");
		
		
		var displayMode = this.setting.general.damageChartDisplay || 'cardDamage';
		var chartType = UIConfig.CHART.types[displayMode].chartType;

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
				backgroundColor: UIConfig.CHART.CHART_COLOR[1],
				borderColor: UIConfig.CHART.CHART_COLOR[1]
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
						backgroundColor: UIConfig.CHART.CHART_COLOR[i],
						borderColor: UIConfig.CHART.CHART_COLOR[i]
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
				backgroundColor: UIConfig.CHART.CHART_COLOR,
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
			Chart.defaults.font.size = UIConfig.CHART.FONT_SIZE;
			Chart.defaults.font.family = UIConfig.CHART.FONT_FAMILY;
			Chart.defaults.color = UIConfig.CHART.TEXT_COLOR[theme];
			Chart.defaults.borderColor = UIConfig.CHART.BORDER_COLOR[theme];
		}

		damageChart.options.plugins.title.text = UIConfig.CHART.types[displayMode].name;
		damageChart.data = {
			labels: labels,
			datasets: datasets,
		};
		damageChart.resize();
		damageChart.update();
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
	openActionOrderDialog(){
		var selector = document.getElementById('actionOrderDialog');
		var bsModal = bootstrap.Modal.getOrCreateInstance(selector);
		bsModal.show();
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
}