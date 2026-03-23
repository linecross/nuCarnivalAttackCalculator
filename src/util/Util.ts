import { Float32 } from './Float32.js';

export class Util{
    static getPercentNumber(val: any) : number{
        let num : number = 0;
		if (typeof val == 'string' && val.endsWith("%")){
			val = val.substring(0, val.indexOf("%"));
			num = +val.trim();
		}
		else if (typeof val == 'string' || typeof val == 'number'){
			num = +val;
		}
		
		return num;
    }

	static getNumber(val: any) : number{
		let num : number = 0;
		if (typeof val == 'string' && val.endsWith("%")){
			val = val.substring(0, val.indexOf("%"));
			num = +val.trim() / 100;
		}
		else if (typeof val == 'string' || typeof val == 'number'){
			num = +val;
		}
		
		return num;
	}

	static getFloat32(val: any) : Float32{
		if (typeof val == 'number'){
			return new Float32(val);
		}
		if (val instanceof Float32){
			return new Float32(val.getValue());
		}
		return new Float32(Util.getNumber(val));
	}
}