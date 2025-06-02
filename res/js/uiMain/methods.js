import CardMethods from './methods_card.js';
import UIMethods from './methods_ui.js';
import CardFilterMethods from './methods_cardFilter.js';
import DamageRecordMethods from './methods_damageRecords.js';
import SortTableMethods from './methods_sortTable.js';
import TierListMethods from './methods_tierList.js';

export default {
	...CardMethods,
	...UIMethods,
	...CardFilterMethods,
	...DamageRecordMethods,
	...SortTableMethods,
	...TierListMethods
}