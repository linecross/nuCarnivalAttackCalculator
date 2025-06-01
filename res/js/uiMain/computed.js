import { CardCenter } from '/build/Card.js';

export default {
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
}