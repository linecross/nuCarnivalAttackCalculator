import { Rarity } from './Constants';
console.info(Rarity.N);
var config = {
    CHAR_NAMES: ['八雲', '艾德蒙特', '奧利文', '崑西', '玖夜', '可爾', '布儡', '啖天', '艾斯特', '墨菲'],
    charData: {
        '八雲': {
            '偶像．八雲': { hp: 7222, atk: 2170, potType: 'C', rarity: 'SSR' },
            '白情．八雲': { hp: 7044, atk: 2241, potType: 'A', rarity: 'SSR' },
            '常駐．八雲': { hp: 7507, atk: 2099, potType: 'A', rarity: 'SSR' },
            'SR八雲': { hp: 6155, atk: 1636, potType: 'C', rarity: 'SR' },
            'R八雲': { hp: 5301, atk: 1352, potType: 'D', rarity: 'R' },
            'N八雲': { hp: 4554, atk: 1138, potType: 'D', rarity: 'N' },
        },
        '艾德蒙特': {
            '追夏．艾德蒙特': { hp: 7649, atk: 2063, potType: 'A', rarity: 'SSR' },
            '白情．艾德蒙特': { hp: 6831, atk: 2312, potType: 'A', rarity: 'SSR' },
            '常駐艾德蒙特': { hp: 7400, atk: 2134, potType: 'A', rarity: 'SSR' },
            'SR艾德蒙特': { hp: 5977, atk: 1672, potType: 'C', rarity: 'SR' },
            'R艾德蒙特': { hp: 5052, atk: 1423, potType: 'D', rarity: 'R' },
            'N艾德蒙特': { hp: 4305, atk: 1209, potType: 'D', rarity: 'N' },
        },
        '奧利文': {
            '偶像．奧利文': { hp: 6724, atk: 2348, potType: 'A', rarity: 'SSR' },
            '春狩．奧利文': { hp: 9321, atk: 1672, potType: 'C', rarity: 'SSR' },
            '常駐．奧利文': { hp: 7934, atk: 1992, potType: 'B', rarity: 'SSR' },
            'SR奧利文': { hp: 7827, atk: 1280, potType: 'B', rarity: 'SR' },
            'R奧利文': { hp: 6653, atk: 1067, potType: 'D', rarity: 'R' },
            'N奧利文': { hp: 5657, atk: 925, potType: 'D', rarity: 'N' },
        },
        '崑西': {
            '雙月．崑西': { hp: 6617, atk: 2383, potType: 'A', rarity: 'SSR' },
            '春狩．崑西': { hp: 11563, atk: 1352, potType: 'B', rarity: 'SSR' },
            '常駐．崑西': { hp: 7151, atk: 2205, potType: 'A', rarity: 'SSR' },
            'SR崑西': { hp: 5728, atk: 1743, potType: 'A', rarity: 'SR' },
            'R崑西': { hp: 4874, atk: 1494, potType: 'D', rarity: 'R' },
            'N崑西': { hp: 4127, atk: 1245, potType: 'D', rarity: 'N' },
        },
        '玖夜': {
            '雙月．玖夜': { hp: 8218, atk: 1921, potType: 'B', rarity: 'SSR' },
            '妖宴．玖夜': { hp: 8076, atk: 1956, potType: 'C', rarity: 'SSR' },
            '常駐．玖夜': { hp: 7791, atk: 2028, potType: 'C', rarity: 'SSR' },
            'SR玖夜': { hp: 6439, atk: 1565, potType: 'B', rarity: 'SR' },
            'R玖夜': { hp: 5514, atk: 1316, potType: 'D', rarity: 'R' },
            'N玖夜': { hp: 4660, atk: 1102, potType: 'D', rarity: 'N' },
        },
        '可爾': {
            '妖宴．可爾': { hp: 7329, atk: 2134, potType: 'A', rarity: 'SSR' },
            '常駐．可爾': { hp: 7258, atk: 2170, potType: 'A', rarity: 'SSR' },
            'SR可爾': { hp: 5799, atk: 1707, potType: 'A', rarity: 'SR' },
            'R可爾': { hp: 4945, atk: 1458, potType: 'D', rarity: 'R' },
            'N可爾': { hp: 4198, atk: 1245, potType: 'D', rarity: 'N' },
        },
        '布儡': {
            '偶像．布儡': { hp: 6973, atk: 2241, potType: 'A', rarity: 'SSR' },
            '常駐．布儡': { hp: 6937, atk: 2277, potType: 'A', rarity: 'SSR' },
            'SR布儡': { hp: 6048, atk: 1672, potType: 'A', rarity: 'SR' },
            'R布儡': { hp: 5158, atk: 1387, potType: 'D', rarity: 'R' },
            'N布儡': { hp: 4447, atk: 1174, potType: 'D', rarity: 'N' },
        },
        '啖天': {
            '追夏．啖天': { hp: 6511, atk: 2419, potType: 'A', rarity: 'SSR' },
            '常駐．啖天': { hp: 11314, atk: 1387, potType: 'B', rarity: 'SSR' },
            'SR啖天': { hp: 6190, atk: 1601, potType: 'A', rarity: 'SR' },
            'R啖天': { hp: 5230, atk: 1387, potType: 'D', rarity: 'R' },
            'N啖天': { hp: 4482, atk: 1174, potType: 'D', rarity: 'N' },
        },
        '艾斯特': {
            'SR艾斯特': { hp: 6333, atk: 1565, potType: 'C', rarity: 'SR' },
            'R艾斯特': { hp: 5443, atk: 1316, potType: 'D', rarity: 'R' },
            'N艾斯特': { hp: 4767, atk: 1102, potType: 'D', rarity: 'N' },
        },
        '墨菲': {
            'SR墨菲': { hp: 9606, atk: 1031, potType: 'B', rarity: 'SR' },
            'R墨菲': { hp: 8147, atk: 889, potType: 'D', rarity: 'R' },
            'N墨菲': { hp: 6937, atk: 747, potType: 'D', rarity: 'N' },
        },
    },
    MAX_LEVEL: 60,
    levels: [1, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60],
    rooms: {
        '無': 0,
        '1房': 5,
        '2房': 10,
        '3房': 20,
        '4房': 30,
        '5房': 50
    },
    potentials: {
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
        return {
            input: {
                displayMode: 'potential',
                atkOrHp: 'both',
                charName: '八雲',
                charId: 'SR八雲',
                level: 60,
                room: 0,
                potentialHp: 0,
                potentialAtk: 0,
                potential: 1,
                pot: [false, false, false, false, false, false],
            },
            inputTeam: [
                { charName: '', charId: '', star: 1, level: 60, room: 0, potential: 1, pot: [false, false, false, false, false, false] },
            ],
            selected: {
                star: null,
                level: null,
                room: null,
                potential: null,
                hpOrAtk: null,
            },
        };
    },
    created() {
        this.CHAR_NAMES = config.CHAR_NAMES;
        this.MAX_LEVEL = config.MAX_LEVEL;
        this.charData = config.charData;
        this.levels = config.levels;
        this.rooms = config.rooms;
        this.potentials = config.potentials;
    },
    methods: {
        calculateCharValue(charName, charId, star, level, roomPercent, potentialPercent, hpOrAtk) {
            let data = this.charData[charName][charId];
            if (data == null) {
                return '';
            }
            var val = this.calculateValue(star, level, roomPercent, potentialPercent, data[hpOrAtk]);
            return val;
        },
        getBaseValue(star, val) {
            return Math.ceil(val / Math.pow(1.05, 59)) * (0.5 + (0.1 * star));
        },
        calculateValue(star, level, roomPercent, potentialPercent, val) {
            return Math.floor(this.getBaseValue(star, val) * Math.pow(1.05, level - 1) * (1 + roomPercent / 100) * (1 + potentialPercent / 100));
        },
        getPotentialPercent(hpOrAtk, tier) {
            if (this.currentChar == null)
                return 0;
            let potArr = this.potentials[this.currentChar.potType][hpOrAtk];
            var sum = 0;
            for (let i = 0; i < tier - 1; i++) {
                sum += potArr[i].reduce((a, b) => a + b);
            }
            return sum;
        },
        getPotentialPercentOfOneTier(hpOrAtk, tier) {
            if (this.currentChar == null)
                return 0;
            let potArr = this.potentials[this.currentChar.potType][hpOrAtk];
            if (tier <= 0 || tier > 12) {
                return 0;
            }
            var pot = potArr[tier - 1].reduce((a, b) => a + b);
            return pot.toFixed(1);
        },
        selectTableRecord(star, val, hpOrAtk) {
            if (this.selected.star == star && this.selected[this.input.displayMode] == val && this.selected.hpOrAtk == hpOrAtk) {
                this.selected.star = null;
                this.selected[this.input.displayMode] = null;
                this.selected.hpOrAtk = null;
            }
            else {
                this.selected.star = star;
                this.selected[this.input.displayMode] = val;
                this.selected.hpOrAtk = hpOrAtk;
            }
        },
        highlightTableRecord(star, val, hpOrAtk) {
            if (this.selected.star == star && this.selected[this.input.displayMode] == val && this.selected.hpOrAtk == hpOrAtk) {
                return "selected " + this.selected.hpOrAtk;
            }
            if (this.selected.star != null && this.selected[this.input.displayMode] != null && this.selected.hpOrAtk == hpOrAtk) {
                var level = this.input.displayMode == 'level' ? val : this.input.level;
                var room = this.input.displayMode == 'room' ? val : this.input.room;
                var potential = this.input.displayMode == 'potential' ? this.getPotentialPercent(hpOrAtk, val + 1) : this.getCurrentPotenial(hpOrAtk);
                var calValue = 0;
                calValue = this.calculateCharValue(this.input.charName, this.input.charId, star, level, room, potential, hpOrAtk);
                if (calValue >= this.selectedValue) {
                    return "higher " + this.selected.hpOrAtk;
                }
            }
        },
        highlightTableRowHeader(val) {
            if (this.selected[this.input.displayMode] == val) {
                return "selected " + this.selected.hpOrAtk;
            }
        },
        highlightTableColHeader(star) {
            if (this.selected.star == star) {
                return "selected " + this.selected.hpOrAtk;
            }
        },
        highlightTableHpOrAtkHeader(star, hpOrAtk) {
            if (this.selected.star == star && this.selected.hpOrAtk == hpOrAtk) {
                return "selected " + this.selected.hpOrAtk;
            }
        },
        getPotBoxType(tierBoxIdx) {
            if (this.currentChar == null)
                return null;
            let hpPotArr = this.potentials[this.currentChar.potType].hp[this.input.potential - 1];
            let atkPotArr = this.potentials[this.currentChar.potType].atk[this.input.potential - 1];
            if (hpPotArr[tierBoxIdx] > 0)
                return 'hp';
            if (atkPotArr[tierBoxIdx] > 0)
                return 'atk';
            if (hpPotArr[tierBoxIdx] == 0 && atkPotArr[tierBoxIdx] == 0)
                return 'passive';
            return null;
        },
        getPotBoxClass(tierBoxIdx) {
            let type = this.getPotBoxType(tierBoxIdx);
            if (type == 'hp' || type == 'atk' || type == 'passive')
                return type + 'Pot';
            return '';
        },
        getCurrentPotenial(hpOrAtk) {
            if (this.currentChar == null)
                return 0;
            let potArr = this.potentials[this.currentChar.potType][hpOrAtk];
            let tier = this.input.potential;
            var sum = 0;
            for (let i = 0; i < tier - 1; i++) {
                sum += potArr[i].reduce((a, b) => a + b);
            }
            for (let i = 0; i < this.input.pot.length; i++) {
                if (this.input.pot[i]) {
                    sum += potArr[tier - 1][i];
                }
            }
            return sum.toFixed(1);
        },
        getChar(charName, charId) {
            if (charName != null && charId != null && this.charData[charName] != null && this.charData[charName][charId] != null) {
                return this.charData[charName][charId];
            }
            return {};
        }
    },
    computed: {
        tableHeader() {
            if (this.input.displayMode == 'level')
                return '等級';
            if (this.input.displayMode == 'room')
                return '房間';
            if (this.input.displayMode == 'potential')
                return '潛力';
        },
        currentChar() {
            return this.charData[this.input.charName][this.input.charId];
        },
        displayHP() {
            return this.input.atkOrHp != 'atk';
        },
        displayATK() {
            return this.input.atkOrHp != 'hp';
        },
        tierMax() {
            if (this.currentChar == null)
                return 0;
            let potArr = this.potentials[this.currentChar.potType]['hp'];
            return potArr.length;
        },
        hasRoom() {
            if (this.currentChar == null)
                return true;
            return this.currentChar.rarity != 'N';
        },
        selectedValue() {
            if (this.selected.star != null && this.selected.hpOrAtk != null && this.selected[this.input.displayMode] != null) {
                var star = this.selected.star;
                var level = this.input.displayMode == 'level' ? this.selected.level : this.input.level;
                var room = this.input.displayMode == 'room' ? this.selected.room : this.input.room;
                var potential = this.input.displayMode == 'potential' ? this.getPotentialPercent(this.selected.hpOrAtk, this.selected.potential + 1) : this.getCurrentPotenial(this.selected.hpOrAtk);
                var calValue = 1000000;
                calValue = this.calculateCharValue(this.input.charName, this.input.charId, star, level, room, potential, this.selected.hpOrAtk);
                return calValue;
            }
            return 1000000;
        },
    },
    watch: {
        'input.charId'() {
            if (this.currentChar.rarity == 'N') {
                this.input.room = 0;
            }
            if (this.currentChar.rarity == 'N' || this.currentChar.rarity == 'R') {
                if (this.input.potential > 6) {
                    this.input.potential = 1;
                }
            }
        },
    }
}).mount('#NuCarnivalCharChartApp');
//# sourceMappingURL=uiMain.js.map