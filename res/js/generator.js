import { Character, Rarity, Element, RuleType } from '../../../build/Constants.js';
import { CardCenter, Card, Team, Battle } from '../../../build/BattleSystem.js';
import { CardData } from '../../../build/SampleData.js';


var config = {
	MAX_LEVEL: 60,
	LEVEL_SELECT: [1,15,20,25,30,35,40,45,50,55,60],
	STARS: [1,2,3,4,5],
	POT_SELECT: [0,6,9,12],
};

var SAMPLE_JSON = {
	char: '測試', fullname: null, alias: null,
	rarity: 'SSR', class: '守護', element: '闇', potType: '平均型',
	baseHp: 0, baseAtk: 0, coolDown: 3,
	attackRule:   [  ],
	skillLv1Rule: [ ],
	skillLv2Rule: [  ],
	skillLv3Rule: [ ],
	star3Rule:    [  ],
	star5Rule:    [ ],
	pot6Rule:     [ ],
}

var NuCarnivalCharChartApp = Vue.createApp({
    data() {
		return{
			inputChar: null,
			inputCard: null,
			card: null,
		}
	},
	created()
	{
		// this.CHARACTERS = Character;
		this.CHARACTERS = Object.assign({EMPTY: ''}, Character);
		this.STARS = config.STARS;
		this.POT_SELECT = config.POT_SELECT;
		this.ELEMENTS = Element;

		// this.sample =

		CardCenter.setMainCardData(CardData);
	},
	methods: {
		getCardnameByChar(char){
			return CardCenter.getCardNameByChar(char);
		},
		loadCard(){
			if (this.inputCard != '' && this.inputCard != null && (this.card == null || this.card.name != this.inputCard)){
				var card = CardCenter.loadCard(this.inputCard);
				this.card = JSON.parse(JSON.stringify(card));

				var keys = Object.keys(this.card);
				var sampleKeys = Object.keys(SAMPLE_JSON);
				for (var key of keys){
					if (!sampleKeys.includes(key)){
						delete this.card[key];
					}
				}
			}
		},
	},
	computed:{
		generatedCardJson(){
			return this.card;
		}
	},
	watch:{
		inputCard(newVal, oldVal) {
			this.loadCard();
		},
	}
}).mount('#NuCarnivalCharChartApp');