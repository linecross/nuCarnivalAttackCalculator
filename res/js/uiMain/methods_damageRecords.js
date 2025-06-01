import { Character, Rarity, Class, Element, AttackType, ActionPattern, CounterAttackMode, ConditionHPStatus } from '/build/Constants.js';
import { Team, Card, CardCenter } from '/build/Card.js';

var { NA, ...ELEMENT_MAP } = Element;


export default {
	loadRecordsFromDB(){
		this.db.damageRecords.toArray().then(records=>{
			if (records != null && records.length > 0){
				this.damageRecords = records;
			}
		});
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
	}
}