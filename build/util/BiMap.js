export class BiMap {
    constructor(obj) {
        this.map = new Map(Object.entries(obj));
        this.reverseMap = new Map();
        for (const key of this.map.keys()) {
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
    getObject() {
        return Object.fromEntries(this.map);
    }
    getReverseObject() {
        return Object.fromEntries(this.reverseMap);
    }
}
//# sourceMappingURL=BiMap.js.map