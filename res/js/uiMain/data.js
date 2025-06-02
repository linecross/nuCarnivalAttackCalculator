import { Element, ActionPattern, CounterAttackMode } from '/build/Constants.js';
import { Battle } from '/build/BattleSystem.js';
import { Condition } from '/build/CardRule.js';

export default function appData() {
	return {
		tab: 'CAL',
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
		tierList: {
			tiers: [
				{ id: 'S', name: 'S', color: '#f64e4e', cards: [], order: 1 },
				{ id: 'A', name: 'A', color: '#ff8f64', cards: [], order: 2 },
				{ id: 'B', name: 'B', color: '#ffcc7b', cards: [], order: 3 },
				{ id: 'C', name: 'C', color: '#bbef7b', cards: [], order: 4 },
				{ id: 'D', name: 'D', color: '#67f6e9', cards: [], order: 5 }
			],
			// unrankedCards: Array.from({ length: 20 }, (_, index) => ({
			// 	id: index + 1,
			// 	name: `Card ${index + 1}`,
			// 	image: `https://via.placeholder.com/100?text=Card${index + 1}`
			// })),
			unrankedCards: [],
			rarity: [],
			char: [],
			clazz: [],
			element: [],
			coolDown: [],
			draggedTierIndex: null,
			draggedCardId: null
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
				damageChartDisplay: 'cardDamage',
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
	}
}