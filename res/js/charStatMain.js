var chartConfig = {
	CHAR_NAMES: ['八雲','艾德蒙特','奧利文','崑西','玖夜','可爾','布儡','啖天','歛','艾斯特','墨菲','伊得'],
	MAX_LEVEL: 60,
	levels: [1,15,20,25,30,35,40,45,50,55,60],
	rooms:['無','1房','2房','3房','4房','5房'],
	roomPercents:{
		'default':{
			'無': 0,
			'1房': 5,
			'2房': 10,
			'3房': 20,
			'4房': 30,
			'5房': 50
		},
		'SSR':{
			'無': 0,
			'1房': 5,
			'2房': 15,
			'3房': 30,
			'4房': 45,
			'5房': 70
		},
	},
	potentials:{
		'A': {
			hp: [
				[0, 0, 3, 3, 3, 3],
				[0, 0, 3.5, 3.5, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 3.5, 3.5, 3.5],
				[0, 0, 0, 3.5, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 0, 0, 4],
			],
			atk: [
				[2, 2, 0, 0, 0, 0],
				[2, 2, 0, 0, 0, 0],
				[2, 2, 2, 2, 0, 0],
				[2, 2, 2, 0, 0, 0],
				[2, 2, 2, 0, 0, 0],
				[0, 2, 2, 2, 0, 0],
				[2.5, 2.5, 2.5, 2.5, 0, 0],
				[2.5, 2.5, 2.5, 2.5, 0, 0],
				[2.5, 2.5, 2.5, 2.5, 0, 0],
				[3, 3, 3, 3, 0, 0],
				[3, 3, 3, 3, 0, 0],
				[0, 3, 3, 3, 3, 0],
			],
		},
		'B': {
			hp: [
				[2, 2, 0, 0, 0, 0],
				[2, 2, 0, 0, 0, 0],
				[2, 2, 2, 2, 0, 0],
				[2, 2, 2, 0, 0, 0],
				[2, 2, 2, 0, 0, 0],
				[0, 2, 2, 2, 0, 0],
				[2.5, 2.5, 2.5, 2.5, 0, 0],
				[2.5, 2.5, 2.5, 2.5, 0, 0],
				[2.5, 2.5, 2.5, 2.5, 0, 0],
				[3, 3, 3, 3, 0, 0],
				[3, 3, 3, 3, 0, 0],
				[0, 3, 3, 3, 3, 0],
			],
			atk: [
				[0, 0, 3, 3, 3, 3],
				[0, 0, 3.5, 3.5, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 3.5, 3.5, 3.5],
				[0, 0, 0, 3.5, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 0, 3.5, 3.5],
				[0, 0, 0, 0, 0, 4],
			],
		},
		'C': {
			hp: [
				[0, 0, 0, 0, 0, 0],
				[2.7, 2.7, 2.7, 2.7, 2.7, 2.7],
				[0, 2.7, 0, 2.7, 0, 2.7],
				[2.7, 0, 0, 0, 0, 0],
				[0, 2.8, 2.8, 2.8, 2.8, 2.8],
				[0, 2.8, 0, 2.8, 0, 2.8],
				[0, 2.8, 0, 2.8, 0, 3],
				[0, 3, 0, 3, 0, 3],
				[0, 3, 0, 3, 0, 3],
				[0, 3, 0, 3, 0, 3],
				[0, 3, 0, 3, 0, 3],
				[0, 0, 0, 3, 0, 3],
			],
			atk: [
				[2.7, 2.7, 2.7, 2.7, 2.7, 2.7],
				[0, 0, 0, 0, 0, 0],
				[2.7, 0, 2.7, 0, 2.7, 0],
				[0, 2.7, 2.8, 2.8, 2.8, 2.8],
				[2.8, 0, 0, 0, 0, 0],
				[0, 0, 2.8, 0, 2.8, 0],
				[2.8, 0, 2.8, 0, 2.8, 0],
				[3, 0, 3, 0, 3, 0],
				[3, 0, 3, 0, 3, 0],
				[3, 0, 3, 0, 3, 0],
				[3, 0, 3, 0, 3, 0],
				[0, 3, 3, 0, 3, 0],
			],
		},
		'D': {
			hp: [
				[0, 0, 0, 0, 0, 0],
				[2.7, 2.7, 2.8, 2.8, 3, 3],
				[0, 3, 0, 3, 0, 3],
				[0, 0, 0, 0, 0, 0],
				[3, 3, 3, 3, 3, 3],
				[0, 0, 3, 0, 3, 0],
			],
			atk: [
				[2.7, 2.7, 2.8, 2.8, 3, 3],
				[0, 0, 0, 0, 0, 0],
				[0, 0, 3, 0, 3, 0],
				[3, 3, 3, 3, 3, 3],
				[0, 0, 0, 0, 0, 0],
				[0, 3, 0, 3, 0, 3],
			],
		},
	},
};

var NuCarnivalCharChartApp = Vue.createApp({
    data() {
		return{
			charData: {},
			input:{
				displayMode: 'potential',
				atkOrHp: 'both',
				charName: '八雲',
				charId: 'SR八雲',
				level: 60,
				room: '無',
				potentialHp: 0,
				potentialAtk: 0,
				potential: 1,
				pot: [false, false, false, false, false, false],
				extra: {
					hp: 0,
					atk: 0,
				},
			},
			selected:{
				star: null,
				level: null,
				room: null,
				potential: null,
				hpOrAtk: null,
			},
		}
	},
	created() {
		this.CHAR_NAMES = chartConfig.CHAR_NAMES;
		this.MAX_LEVEL = chartConfig.MAX_LEVEL;
		// this.charData = chartConfig.charData;
		this.levels = chartConfig.levels;
		this.rooms = chartConfig.rooms;
		this.roomPercents = chartConfig.roomPercents;
		this.potentials = chartConfig.potentials;
		this.charData = {};
		var vueObj = this;

		var potMap = {'HP先行':'A', 'ATK先行':'B', '平均型':'C', 'NR卡':'D'};
		fetch("./res/json/cardData.json")
		.then(resp => {
			return resp.json();
		})
		.then(json => {
			var charData = {};
			for (var charName of chartConfig.CHAR_NAMES){
				var list=Object.entries(json).filter(e=>{
					var value = e[1];
					return value['char'] == charName;
				})
				var data = {};
				for (var ele of list.reverse()){
					var cardName = ele[0];
					var value = ele[1];
					data[cardName] = {
						hp: value.baseHp, atk: value.baseAtk, potType: potMap[value.potType], rarity: value.rarity
					};
				}
				charData[charName] = data;
			}
			vueObj.charData = charData;
			vueObj.isRefreshed++;
		});
	},
	methods: {
		calculateCharValue(charName, charId, star, level, roomPercent, potentialPercent, hpOrAtk){
			if (!['both', 'hp', 'atk'].includes(hpOrAtk)){
				return;
			}
			if (Object.keys(this.charData).length > 0){
				let data = this.charData[charName][charId];
				if (data == null) {return ''}
				var val = this.calculateValue(star, level, roomPercent, potentialPercent, data[hpOrAtk], this.input.extra[hpOrAtk]);
				return val;
			}
		},
		getBaseValue(star, val){
			return Math.ceil(val / Math.pow(1.05, 59)) * (0.5 + (0.1 * star));
		},
		calculateValue(star, level, roomPercent, potentialPercent, val, extra){
			var result = Math.floor(this.getBaseValue(star, val) * Math.pow(1.05, level-1) * (1+roomPercent/100) * (1+potentialPercent/100));
			if (extra != null){
				result = Math.floor(result * (1 + extra/100));
			}
			return result;
		},
		getBattlePower(hp, atk){
			return Math.ceil(hp + (atk * 5));
		},
		calculateBattlePower(charName, charId, star, level, roomPercent, hpPotentialPercent, atkPotentialPercent){
			if (Object.keys(this.charData).length > 0){
				var hp = this.calculateCharValue(charName, charId, star, level, roomPercent, hpPotentialPercent, 'hp');
				var atk = this.calculateCharValue(charName, charId, star, level, roomPercent, atkPotentialPercent, 'atk');
				return this.getBattlePower(hp, atk);
			}
		},
		getPotentialPercent(hpOrAtk, tier){
			if (this.currentChar == null) return 0;
			let potArr = this.potentials[this.currentChar.potType][hpOrAtk];
			var sum = 0;
			for (let i = 0; i < tier-1; i++){
				sum += potArr[i].reduce((a, b) => a + b);
			}
			return sum;
		},
		getPotentialPercentOfOneTier(hpOrAtk, tier){
			if (!['hp', 'atk'].includes(hpOrAtk)){
				return;
			}
			if (this.currentChar == null) return 0;
			let potArr = this.potentials[this.currentChar.potType][hpOrAtk];
			if (tier <= 0 || tier > 12){
				return 0;
			}
			var pot = potArr[tier-1].reduce((a, b) => a + b);
			return pot.toFixed(1);
		},
		selectTableRecord(star, val, hpOrAtk){
			console.info("this.input.displayMode="+this.input.displayMode+", val="+val);
			// Deselect
			if (this.selected.star == star && this.selected[this.input.displayMode] == val && this.selected.hpOrAtk == hpOrAtk ){
				this.selected.star = null;
				this.selected[this.input.displayMode] = null;
				this.selected.hpOrAtk = null;
			}
			// Select
			else{
				this.selected.star = star;
				this.selected[this.input.displayMode] = val;
				this.selected.hpOrAtk = hpOrAtk;
			}
		},
		highlightTableRecord(star, val, hpOrAtk){
			if (this.selected.star == star && this.selected[this.input.displayMode] == val && this.selected.hpOrAtk == hpOrAtk ){
				return "selected " + this.selected.hpOrAtk;
			}
			console.info("this.selected.star="+star+", this.selected[this.input.displayMode]="+this.selected[this.input.displayMode]+", this.selected.hpOrAtk="+this.selected.hpOrAtk+", hpOrAtk="+hpOrAtk);
			if (this.selected.star != null && this.selected[this.input.displayMode] != null && this.selected.hpOrAtk == hpOrAtk){
				var level = this.input.displayMode == 'level' ? val : this.input.level;
				var room = this.input.displayMode == 'room' ? val : this.input.room;
				var calValue = 0;
				console.info('test');

				if (this.selected.hpOrAtk == 'bp'){
					var hpPotential = this.input.displayMode == 'potential' ? this.getPotentialPercent('hp', val+1) : this.getCurrentPotenial('hp');
					var atkPotential = this.input.displayMode == 'potential' ? this.getPotentialPercent('atk', val+1) : this.getCurrentPotenial('atk');
					calValue = this.calculateBattlePower(this.input.charName, this.input.charId, star, level, this.getRoomPercentage(room), hpPotential, atkPotential);
				}
				else{
					var potential = this.input.displayMode == 'potential' ? this.getPotentialPercent(hpOrAtk, val+1) : this.getCurrentPotenial(hpOrAtk);
					calValue = this.calculateCharValue(this.input.charName, this.input.charId, star, level, this.getRoomPercentage(room), potential, hpOrAtk);
				}
				console.info('calValue='+calValue+", this.selectedValue="+this.selectedValue );
				if (calValue >= this.selectedValue){
					return "higher " + this.selected.hpOrAtk;
				}
			}
		},
		highlightTableRowHeader(val){
			if (this.selected[this.input.displayMode] == val){
				return "selected " + this.selected.hpOrAtk;
			}
		},
		highlightTableColHeader(star){
			if (this.selected.star == star){
				return "selected " + this.selected.hpOrAtk;
			}
		},
		highlightTableHpOrAtkHeader(star, hpOrAtk){
			if (this.selected.star == star && this.selected.hpOrAtk == hpOrAtk){
				return "selected " + this.selected.hpOrAtk;
			}
		},
		getRoomPercentage(room){
			var roomPercent = this.roomPercents['default'][room];
			if (this.currentChar != null && this.currentChar.rarity == 'SSR'){
				roomPercent = this.roomPercents['SSR'][room];
			}
			return roomPercent;
		},
		getPotBoxType(tierBoxIdx){
			if (this.currentChar == null) return null;
			let hpPotArr = this.potentials[this.currentChar.potType].hp[this.input.potential-1];
			let atkPotArr = this.potentials[this.currentChar.potType].atk[this.input.potential-1];
			
			if (hpPotArr[tierBoxIdx] > 0) return 'hp';
			if (atkPotArr[tierBoxIdx] > 0) return 'atk';
			if (hpPotArr[tierBoxIdx] == 0 && atkPotArr[tierBoxIdx] == 0) return 'passive';
			return null;
		},
		getPotBoxClass(tierBoxIdx){
			let type = this.getPotBoxType(tierBoxIdx);
			if (type == 'hp' || type == 'atk' || type == 'passive') return type + 'Pot';
			return '';
		},
		getCurrentPotenial(hpOrAtk){
			if (this.currentChar == null) return 0;
			let potArr = this.potentials[this.currentChar.potType][hpOrAtk];
			let tier = this.input.potential;
			var sum = 0;
			for (let i = 0; i < tier-1; i++){
				sum += potArr[i].reduce((a, b) => a + b);
			}
			for (let i = 0; i < this.input.pot.length; i++){
				if (this.input.pot[i]){
					sum += potArr[tier-1][i];
				}
			}
			return sum.toFixed(1);
		}
	},
	computed: {
		tableHeader(){
			if (this.input.displayMode == 'level') return '等級';
			if (this.input.displayMode == 'room') return '房間';
			if (this.input.displayMode == 'potential') return '潛力';
		},
		currentChar(){
			console.info(this.isRefreshed);
			if (Object.keys(this.charData).length > 0){
				return this.charData[this.input.charName][this.input.charId];
			}
		},
		displayHP(){
			return this.input.atkOrHp == 'hp' || this.input.atkOrHp == 'both';
		},
		displayATK(){
			return this.input.atkOrHp == 'atk' || this.input.atkOrHp == 'both';
		},
		displayBattlePower(){
			return this.input.atkOrHp == 'bp';
		},
		tierMax(){
			if (this.currentChar == null) return 0;
			let potArr = this.potentials[this.currentChar.potType]['hp'];
			return potArr.length;
		},
		hasRoom(){
			if (this.currentChar == null) return true;
			return this.currentChar.rarity != 'N';
		},
		selectedValue(){
			if (this.selected.star != null && this.selected.hpOrAtk != null && this.selected[this.input.displayMode] != null){
				var star = this.selected.star;
				var level = this.input.displayMode == 'level' ? this.selected.level : this.input.level;
				var room = this.input.displayMode == 'room' ? this.selected.room : this.input.room;
				var calValue = 1000000;
				if (this.selected.hpOrAtk == 'bp'){
					var hpPotential = this.input.displayMode == 'potential' ? this.getPotentialPercent('hp', this.selected.potential+1) : this.getCurrentPotenial('hp');
					var atkPotential = this.input.displayMode == 'potential' ? this.getPotentialPercent('atk', this.selected.potential+1) : this.getCurrentPotenial('atk');
					calValue = this.calculateBattlePower(this.input.charName, this.input.charId, star, level, this.getRoomPercentage(room), hpPotential, atkPotential);
				}
				else{
					var potential = this.input.displayMode == 'potential' ? this.getPotentialPercent(this.selected.hpOrAtk, this.selected.potential+1) : this.getCurrentPotenial(this.selected.hpOrAtk);
					calValue = this.calculateCharValue(this.input.charName, this.input.charId, star, level, this.getRoomPercentage(room), potential, this.selected.hpOrAtk);
				}
				return calValue;
			}
			return 1000000;
		},
	},
	watch:{
		'input.charId'(){
			if (this.currentChar != null){
				if (this.currentChar.rarity == 'N'){
					this.input.room = '無';
				}
				if (this.currentChar.rarity == 'N' || this.currentChar.rarity == 'R'){
					if (this.input.potential > 6){
						this.input.potential = 1;
					}
				}
			}
		},
	}
}).mount('#NuCarnivalCharChartApp');