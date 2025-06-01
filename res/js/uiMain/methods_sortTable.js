export default {
	sortTableSort(val){
		if (val == this.cardHpAtkSort.sortBy){
			this.cardHpAtkSort.sortMode = this.cardHpAtkSort.sortMode == 'asc' ? 'desc' : 'asc';
		}
		else{
			this.cardHpAtkSort.sortMode = 'desc';
		}
		this.cardHpAtkSort.sortBy = val;
	},
	resetCardSort(){
		this.cardHpAtkSort.sortBy = 'actualHp';
		this.cardHpAtkSort.sortMode = 'desc';
		this.cardHpAtkSort.hpPercent = 0;
		this.cardHpAtkSort.level = 60;
		this.cardHpAtkSort.hp = { min: 0, max: 99999 };
		this.cardHpAtkSort.atk = { min: 0, max: 99999 };
		this.cardHpAtkSort.rarity = [];
		this.cardHpAtkSort.char = [];
		this.cardHpAtkSort.clazz = [];
		this.cardHpAtkSort.element = [];
		this.cardHpAtkSort.coolDown = [];
	}
}