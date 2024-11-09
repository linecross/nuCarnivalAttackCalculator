import { Float32 } from './Float32.js';
export class Util {
    static getPercentNumber(val) {
        var num = 0;
        if (typeof val == 'string' && val.endsWith("%")) {
            val = val.substring(0, val.indexOf("%"));
            num = +val.trim();
        }
        else if (typeof val == 'string' || typeof val == 'number') {
            num = +val;
        }
        return num;
    }
    static getNumber(val) {
        var num = 0;
        if (typeof val == 'string' && val.endsWith("%")) {
            val = val.substring(0, val.indexOf("%"));
            num = +val.trim() / 100;
        }
        else if (typeof val == 'string' || typeof val == 'number') {
            num = +val;
        }
        return num;
    }
    static getFloat32(val) {
        if (typeof val == 'number') {
            return new Float32(val);
        }
        if (val instanceof Float32) {
            return new Float32(val.getValue());
        }
        return new Float32(Util.getNumber(val));
    }
}
//# sourceMappingURL=Util.js.map