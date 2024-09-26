import { Rarity, PotentialType, GAME_CONFIG } from './Constants.js';
import { Rule } from './CardRule.js';
import { Util } from './util/Util.js';
export class Card {
    constructor(name, char, rarity) {
        this.phase = [];
        this.currentHp = 100; // percentage
        this.level = 60;
        this.star = 5;
        this.bond = 5;
        this.potential = 12;
        this.star3Rule = [];
        this.star5Rule = [];
        this.pot6Rule = [];
        this.pot12Rule = [];
        this.attackRule = [];
        this.skillLv1Rule = [];
        this.skillLv2Rule = [];
        this.skillLv3Rule = [];
        this.skillRule = [];
        this.name = name;
        this.char = char;
        this.rarity = rarity;
    }
    hasPhase(phase) {
        var phaseArr = Array.isArray(phase) ? phase : [phase];
        return phaseArr.every(p => this.phase.includes(p));
    }
    setPhase(phase) {
        var phaseArr = Array.isArray(phase) ? phase : [phase];
        this.phase = [];
        phaseArr.forEach(p => this.phase.push(p));
    }
    addPhase(phase) {
        this.phase.push(phase);
    }
    removePhase(phase) {
        this.phase = this.phase.filter(e => e != phase);
    }
    initSkill() {
        if (this.star >= 4)
            this.skillRule = this.skillLv3Rule;
        else if (this.star >= 2)
            this.skillRule = this.skillLv2Rule;
        else
            this.skillRule = this.skillLv1Rule;
    }
    getPassiveRuleSummary() {
        var ruleArr = [];
        if (this.star >= 3)
            ruleArr.concat(this.star3Rule);
        if (this.star == 5)
            ruleArr.concat(this.star5Rule);
        if ((this.rarity == Rarity.SSR || this.rarity == Rarity.SR)) {
            if (this.potential >= 6) {
                ruleArr.concat(this.pot6Rule);
            }
            if (this.potential >= 12) {
                ruleArr.concat(this.pot12Rule);
            }
        }
        else {
            if (this.potential >= 3) {
                ruleArr.concat(this.pot6Rule);
            }
            if (this.potential >= 6) {
                ruleArr.concat(this.pot12Rule);
            }
        }
        return ruleArr;
    }
    getAttackRuleSummary() {
        this.initSkill();
        var ruleArr = [];
        ruleArr.concat(this.attackRule);
        ruleArr.concat(this.skillRule);
        return ruleArr;
    }
    getCardVal(baseVal, potential) {
        var val = 0;
        val = Math.ceil(baseVal / Math.pow(1.05, 59)) * (0.5 + (0.1 * this.star));
        var bondVal = 0;
        if (this.bond > 0) {
            var bondVals = GAME_CONFIG.ROOM.DEFAULT;
            if (this.rarity == Rarity.SSR) {
                bondVals = GAME_CONFIG.ROOM.SSR;
            }
            bondVal = bondVals.slice(0, this.bond).reduce((sum, e) => sum + e, 0);
        }
        val = Math.floor(val * Math.pow(1.05, this.level - 1) * (1 + bondVal / 100) * (1 + potential / 100));
        return val;
    }
    getAtk() {
        if (this.atk != null) {
            return Math.floor(this.atk);
        }
        if (this.baseAtk == null) {
            return 0;
        }
        return this.getCardVal(this.baseAtk, this.getAtkPotential());
    }
    getHp() {
        if (this.hp != null) {
            return Math.floor(this.hp);
        }
        if (this.baseHp == null) {
            return 0;
        }
        return this.getCardVal(this.baseHp, this.getHpPotential());
    }
    getBp() {
        return Math.floor(this.getHp() + (this.getAtk() * 5));
    }
    getHpPotential() {
        return this.getPotentialPercent('hp', this.potential);
    }
    getAtkPotential() {
        return this.getPotentialPercent('atk', this.potential);
    }
    getPotentialPercent(hpOrAtk, tier) {
        var potType = 'D';
        if (this.potType == PotentialType.A)
            potType = 'A';
        else if (this.potType == PotentialType.B)
            potType = 'B';
        else if (this.potType == PotentialType.C)
            potType = 'C';
        else if (this.potType == PotentialType.D)
            potType = 'D';
        if ((this.rarity == 'R' || this.rarity == 'N') && tier > 6) {
            tier = 6;
        }
        tier = tier + 1;
        let potArr = GAME_CONFIG.POTTYPE[potType][hpOrAtk];
        var sum = 0;
        for (let i = 0; i < tier - 1; i++) {
            sum += potArr[i].reduce((a, b) => a + b);
        }
        return sum;
    }
    static loadCard(data) {
        var card = new Card();
        for (var key of Object.keys(data)) {
            card[key] = data[key];
        }
        return card;
    }
    static loadCardFromJson(name, data) {
        var card = new Card();
        card.name = name;
        card = Card.updateCard(card, data);
        return card;
    }
    updateCard(data) {
        return Card.updateCard(this, data);
    }
    static updateCard(card, data) {
        var simpleRules = ['attackRule', 'skillLv1Rule', 'skillLv2Rule', 'skillLv3Rule'];
        var permRules = ['star3Rule', 'star5Rule', 'pot6Rule', 'pot12Rule'];
        for (var key of Object.keys(data)) {
            if (simpleRules.includes(key) || permRules.includes(key)) {
                var isPermRule = permRules.includes(key);
                card[key] = [];
                for (var ruleItem of data[key]) {
                    var rule = Rule.loadRule(ruleItem, isPermRule);
                    rule.parentCardName = card.name;
                    card[key].push(rule);
                }
            }
            else {
                card[key] = data[key];
            }
        }
        return card;
    }
}
export class Team {
    constructor() {
        this.cards = [];
        this.position = [];
        this.actionOrder = [];
    }
    reset() {
        this.cards = [];
        this.position = [];
        this.actionOrder = [];
    }
    addCard(card, pos) {
        if (card == null) {
            return;
        }
        this.cards.push(card);
        this.actionOrder[this.cards.length - 1] = card.name;
        if (pos != null) {
            this.position[pos] = card.name;
        }
        else {
            this.position[this.cards.length] = card.name;
        }
    }
    updateActionOrder(names) {
        this.actionOrder = names;
    }
    getCard(name) {
        var result = this.cards.filter(e => e.name == name);
        return result.length > 0 ? result[0] : null;
    }
    getCardByPos(posArr) {
        var cards = [];
        for (var pos of posArr) {
            if (this.position.length >= pos) {
                cards.push(this.getCard(this.position[pos]));
            }
        }
        return cards;
    }
    getCardByActionOrder() {
        var cards = [];
        for (var name of this.actionOrder) {
            cards.push(this.getCard(name));
        }
        return cards;
    }
    getBattlePower() {
        return this.cards.reduce((sum, card) => sum + card.getBp(), 0);
    }
    getCharCount(char) {
        return this.cards.filter(e => e.char == char).length;
    }
    hasChar(char) {
        return this.getCharCount(char) > 0;
    }
    getClassCount(cardClass) {
        return this.cards.filter(e => e.class == cardClass).length;
    }
    hasClass(cardClass) {
        return this.getClassCount(cardClass) > 0;
    }
    getElementCount(element) {
        return this.cards.filter(e => e.element == element).length;
    }
    hasElement(element) {
        return this.getElementCount(element) > 0;
    }
}
export class CardCenter {
    static setMainCardData(obj) {
        CardCenter.cardData = obj;
    }
    static addUserCardData(newObj) {
        CardCenter.concatData(CardCenter.userCardData, newObj);
    }
    static setEnemyData(obj) {
        CardCenter.enemyCardData = obj;
    }
    static addUserEnemyData(newObj) {
        CardCenter.concatData(CardCenter.userEnemyCardData, newObj);
    }
    static getEnemyData() {
        if (Object.keys(CardCenter.userEnemyCardData).length === 0) {
            return CardCenter.enemyCardData;
        }
        var fullCardData = JSON.parse(JSON.stringify(CardCenter.enemyCardData));
        fullCardData = CardCenter.concatData(fullCardData, CardCenter.userEnemyCardData);
        return fullCardData;
    }
    static getEnemyList() {
        var activeEnemyNames = [];
        for (const [name, data] of Object.entries(CardCenter.getEnemyData())) {
            if (data['active'] === 'true') {
                activeEnemyNames.push(name);
            }
        }
        return activeEnemyNames;
    }
    static getEnemyCard(key) {
        var fullEnemyData = CardCenter.getEnemyData();
        if (fullEnemyData[key] != null) {
            return EnemyCard.loadCardFromJson(key, fullEnemyData[key]);
        }
        return null;
    }
    static concatData(o1, o2) {
        for (var key of Object.keys(o2)) {
            o1[key] = o2[key];
        }
        return o1;
    }
    static getCardData() {
        if (Object.keys(CardCenter.userCardData).length === 0) {
            return CardCenter.cardData;
        }
        var fullCardData = JSON.parse(JSON.stringify(CardCenter.cardData));
        fullCardData = CardCenter.concatData(fullCardData, CardCenter.userCardData);
        return fullCardData;
    }
    static setupDefaultTeamStar(team, ssrStar, srStar) {
        for (var card of team.cards) {
            if (card.rarity == Rarity.SSR) {
                card.star = ssrStar;
            }
            else if (card.rarity == Rarity.SR) {
                card.star = srStar;
            }
        }
    }
    static loadCard(name) {
        if (CardCenter.getCardData()[name] == null) {
            throw new Error('Card does not exists: ' + name);
        }
        return Card.loadCardFromJson(name, CardCenter.getCardData()[name]);
    }
    static getCardNameByChar(char) {
        var arr = [];
        var cardData = CardCenter.getCardData();
        for (var name of Object.keys(cardData)) {
            if (cardData[name].char == char) {
                arr.push(name);
            }
        }
        arr = arr.reverse();
        return arr;
    }
}
CardCenter.cardData = {};
CardCenter.userCardData = {};
CardCenter.enemyCardData = {};
CardCenter.userEnemyCardData = {};
export class EnemyCard extends Card {
    constructor() {
        super(...arguments);
        this.active = false;
        this.hpLock = [];
        this.battleHpLock = [];
        this.shield = 0;
    }
    static loadCardFromJson(name, data) {
        var card = new EnemyCard();
        card.name = name;
        card = EnemyCard.updateCard(card, data);
        return card;
    }
    updateCard(data) {
        return EnemyCard.updateCard(this, data);
    }
    static updateCard(card, data) {
        var simpleRules = ['attackRule', 'skillLv1Rule', 'skillLv2Rule', 'skillLv3Rule'];
        var permRules = ['star3Rule', 'star5Rule', 'pot6Rule', 'pot12Rule'];
        for (var key of Object.keys(data)) {
            if (simpleRules.includes(key) || permRules.includes(key)) {
                var isPermRule = permRules.includes(key);
                card[key] = [];
                for (var ruleItem of data[key]) {
                    var rule = Rule.loadRule(ruleItem, isPermRule);
                    rule.parentCardName = card.name;
                    card[key].push(rule);
                }
            }
            else {
                card[key] = data[key];
            }
        }
        return card;
    }
    addRemainHp(val) {
        if (this.remainHp + val >= this.hp) {
            this.remainHp = this.hp;
            this.currentHp = 1;
        }
        else {
            this.remainHp += val;
            this.currentHp = this.remainHp / this.hp;
        }
    }
    minusRemainHp(val) {
        var nextLockHpVal = 0;
        var nextLockHpPercent = 0;
        if (this.battleHpLock.length > 0) {
            nextLockHpPercent = Util.getNumber(this.battleHpLock[0]);
            nextLockHpVal = Math.floor(this.hp * nextLockHpPercent);
        }
        if (this.remainHp - val <= nextLockHpVal) {
            this.remainHp = nextLockHpVal;
            this.currentHp = nextLockHpPercent;
        }
        else {
            this.remainHp -= val;
            this.currentHp = this.remainHp / this.hp;
        }
    }
}
//# sourceMappingURL=Card.js.map