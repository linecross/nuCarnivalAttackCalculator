import { Character, Rarity, Class, Element, AttackType, ActionPattern, CounterAttackMode, ConditionHPStatus } from '/build/Constants.js';
import { Team, Card, CardCenter } from '/build/Card.js';
import { UIConfig } from './config.js';

var { NA, ...ELEMENT_MAP } = Element;

export default async function created() {
	this.CHARACTERS = Object.assign({EMPTY: ''}, Character);
	this.STARS = UIConfig.STARS;
	this.LEVEL_SELECT = UIConfig.LEVEL_SELECT;
	this.POT_SELECT = UIConfig.POT_SELECT;
	this.ELEMENTS = Element;
	this.ACTION_PATTERN = ActionPattern;
	this.DEFAULT_STAR = UIConfig.DEFAULT_STAR;
	this.COUNTER_ATTACK_MODE = CounterAttackMode;
	this.FILTERS = UIConfig.FILTERS;
	this.HP_STATUS = ConditionHPStatus;

	this.db = new Dexie('nuAttackCalculatorDB');
	this.db.version(2).stores({
		damageRecords: '++id, teamName, [turns+cardname]'
	});

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

	this.loadSettingFromStorage();
}