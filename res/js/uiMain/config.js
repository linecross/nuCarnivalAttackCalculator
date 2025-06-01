import { Character, Rarity, Class, Element } from '/build/Constants.js';

var { NA, ...ELEMENT_MAP } = Element;

export const UIConfig = {
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
		immuneSkill: ['免疫麻痺','免疫沈默','免疫睡眠'],
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