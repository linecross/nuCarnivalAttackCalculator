export class BiMap<K, V>{
	map : Map<K,V>;
	reverseMap: Map<V, K>;

	constructor(map : Map<K, V>) {
		this.map = map;
		this.reverseMap = new Map();
		for(const key of map.keys()) {
		   this.reverseMap.set(this.map.get(key), key);
		}
	}
	
	get(key) {
		if (this.map.has(key)){
			return this.map.get(key);
		}
		else{
			return this.reverseMap.get(key);
		}
	}
}