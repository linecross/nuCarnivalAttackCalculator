export class BiMap {
    constructor(map) {
        this.map = map;
        this.reverseMap = new Map();
        for (const key of map.keys()) {
            this.reverseMap.set(this.map.get(key), key);
        }
    }
    get(key) {
        if (this.map.has(key)) {
            return this.map.get(key);
        }
        else {
            return this.reverseMap.get(key);
        }
    }
}
//# sourceMappingURL=BiMap.js.map