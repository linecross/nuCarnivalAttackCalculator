export class Util{
    static getPercentNumber(val: any) : number{
        var num : number = 0;
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
		var num : number = 0;
		if (typeof val == 'string' && val.endsWith("%")){
			val = val.substring(0, val.indexOf("%"));
			num = +val.trim() / 100;
		}
		else if (typeof val == 'string' || typeof val == 'number'){
			num = +val;
		}
		
		return num;
	}
}