import { UIConfig } from './config.js';

export default {
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
	getFilterPanelCode(type, value){
		return UIConfig.IMAGE_PATH[type][value];
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
	}
}