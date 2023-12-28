import { Class, Element, Rarity, PotentialType, RuleType, AttackType, ConditionType, TargetType, ActionPattern, RuleValueByType } from './Constants.js';
const ALWAYS_EFFECTIVE = 99;
var GAME_CONFIG = {
    MAX_LEVEL: 60,
    POTTYPE: {
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
export class CardCenter {
    static setMainCardData(obj) {
        CardCenter.cardData = obj;
    }
    static addUserCardData(newObj) {
        CardCenter.concatData(CardCenter.userCardData, newObj);
    }
    static concatData(o1, o2) {
        for (var key of Object.keys(o2)) {
            o1[key] = o2[key];
        }
        return o1;
    }
    static getCardData() {
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
export class Card {
    constructor(name, char, rarity) {
        this.level = 60;
        this.star = 5;
        this.bond = 5;
        this.potential = 12;
        this.star3Rule = [];
        this.star5Rule = [];
        this.pot6Rule = [];
        this.attackRule = [];
        this.skillLv1Rule = [];
        this.skillLv2Rule = [];
        this.skillLv3Rule = [];
        this.skillRule = [];
        this.name = name;
        this.char = char;
        this.rarity = rarity;
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
        }
        else if (this.potential >= 3) {
            ruleArr.concat(this.pot6Rule);
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
            if (this.rarity == Rarity.SSR) {
                var bondVals = [5, 10, 20, 35, 60];
                bondVal = bondVals[this.bond - 1];
            }
            else if (this.rarity == Rarity.SR || this.rarity == Rarity.R) {
                var bondVals = [5, 10, 20, 30, 50];
                bondVal = bondVals[this.bond - 1];
            }
        }
        val = Math.floor(val * Math.pow(1.05, this.level - 1) * (1 + bondVal / 100) * (1 + potential / 100));
        return val;
    }
    getAtk() {
        if (this.atk != null) {
            return this.atk;
        }
        return this.getCardVal(this.baseAtk, this.getAtkPotential());
    }
    getHp() {
        if (this.hp != null) {
            return this.hp;
        }
        return this.getCardVal(this.baseHp, this.getHpPotential());
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
        // var simpleRules = ['attackRule', 'skillLv1Rule', 'skillLv2Rule', 'skillLv3Rule'];
        // var permRules = ['star3Rule', 'star5Rule', 'pot6Rule'];
        // for (var key of Object.keys(data)) {
        // 	if (simpleRules.includes(key)){
        // 		card[key] = [];
        // 		for (var ruleItem of data[key]){
        // 			card[key].push(Rule.loadSimpleRule(ruleItem));
        // 		}
        // 	}
        // 	else if (permRules.includes(key)){
        // 		card[key] = [];
        // 		for (var ruleItem of data[key]){
        // 			card[key].push(Rule.loadPermRule(ruleItem));
        // 		}
        // 	}
        // 	else{
        // 		card[key] = data[key];
        // 	}
        // }
        card = Card.updateCard(card, data);
        card.name = name;
        return card;
    }
    updateCard(data) {
        return Card.updateCard(this, data);
    }
    static updateCard(card, data) {
        var simpleRules = ['attackRule', 'skillLv1Rule', 'skillLv2Rule', 'skillLv3Rule'];
        var permRules = ['star3Rule', 'star5Rule', 'pot6Rule'];
        for (var key of Object.keys(data)) {
            if (simpleRules.includes(key)) {
                card[key] = [];
                for (var ruleItem of data[key]) {
                    card[key].push(Rule.loadSimpleRule(ruleItem));
                }
            }
            else if (permRules.includes(key)) {
                card[key] = [];
                for (var ruleItem of data[key]) {
                    card[key].push(Rule.loadPermRule(ruleItem));
                }
            }
            else {
                card[key] = data[key];
            }
        }
        return card;
    }
}
export class BattleTurn {
    constructor(cardName) {
        this.cardName = cardName;
        this.skillCD = 0;
        this.action = [];
        this.actionPattern = ActionPattern.Immediately;
        this.outputs = [];
        this.enemyDamage = [];
        this.rules = [];
        this.ruleLog = [];
    }
    addRule(newRule) {
        // Always effective rule: check max count allowed
        if (newRule.turn == ALWAYS_EFFECTIVE) {
            var currentCount = this.rules.filter(rule => rule.id == newRule.id).length;
            if (currentCount < newRule.maxCount) {
                this.rules.push(newRule);
                return true;
            }
        }
        // Rule will be consumed over time
        else {
            this.rules.push(newRule);
            return true;
        }
        return false;
    }
    clearRulePerRound() {
        for (var rule of this.rules) {
            if (!rule.isPassive && rule.turn != ALWAYS_EFFECTIVE) {
                rule.turn = rule.turn - 1;
            }
        }
        this.rules = this.rules.filter(rule => rule.turn > 0);
    }
    addRuleLog(turn, rule) {
        var existingRules = this.ruleLog[turn].filter(e => e.id == rule.id);
        var attackTypes = [RuleType.attack, RuleType.poisonAttack];
        var attackRules = this.ruleLog[turn].filter(e => attackTypes.includes(e.type));
        if (attackRules.length == 0 && existingRules.length > 0) {
            existingRules[0].addCount();
        }
        else {
            var logRule = new LogRule(rule.clone());
            logRule.condition = null;
            logRule.target = null;
            this.ruleLog[turn].push(logRule);
        }
    }
    countDownCDPerRound() {
        if (this.skillCD > 0) {
            this.skillCD -= 1;
        }
    }
    isSkillAvailable() {
        if (this.skillCD == 0) {
            return true;
        }
        return false;
    }
    getLastSkillTurn() {
        if (!this.isSkillAvailable()) {
            return -1;
        }
        var lastTurn = 0;
        for (var i = this.action.length - 1; i >= 0; i--) {
            if (this.action[i] == AttackType.SkillAttack) {
                lastTurn = i;
                break;
            }
        }
        return lastTurn;
    }
    getSkillDelayedTurn(currentTurn, cooldown) {
        var lastTurn = this.getLastSkillTurn();
        if (lastTurn == 0) {
            lastTurn = 1;
        }
        return currentTurn - (lastTurn + cooldown);
    }
    isGuard(currentTurn, cooldown) {
        if (this.actionPattern == ActionPattern.Manual) {
            return this.action[currentTurn] == AttackType.Guard;
        }
        return false;
    }
    isReleaseSkill(currentTurn, cooldown) {
        if (!this.isSkillAvailable()) {
            return false;
        }
        if (this.actionPattern == ActionPattern.Immediately) {
            return true;
        }
        else if (this.actionPattern == ActionPattern.Delay1Turn) {
            if (this.getLastSkillTurn() == 0) {
                return this.getSkillDelayedTurn(currentTurn, cooldown) >= 1;
            }
            else {
                return true;
            }
        }
        else if (this.actionPattern == ActionPattern.AddCD1) {
            return (this.getSkillDelayedTurn(currentTurn, cooldown) == 1);
        }
        else if (this.actionPattern == ActionPattern.AddCD2) {
            return (this.getSkillDelayedTurn(currentTurn, cooldown) == 2);
        }
        else if (this.actionPattern == ActionPattern.AddCD3) {
            return (this.getSkillDelayedTurn(currentTurn, cooldown) == 3);
        }
        else if (this.actionPattern == ActionPattern.AddCD1Delay1Turn) {
            if (this.getLastSkillTurn() == 0) {
                return (this.getSkillDelayedTurn(currentTurn, cooldown) == 2);
            }
            else {
                return (this.getSkillDelayedTurn(currentTurn, cooldown) == 1);
            }
        }
        else if (this.actionPattern == ActionPattern.AddCD2Ahead1Turn) {
            if (this.getLastSkillTurn() == 0) {
                return (this.getSkillDelayedTurn(currentTurn, cooldown) == 1);
            }
            else {
                return (this.getSkillDelayedTurn(currentTurn, cooldown) == 2);
            }
        }
        else if (this.actionPattern == ActionPattern.Manual) {
            return this.action[currentTurn] == AttackType.SkillAttack;
        }
        return false;
    }
}
export class Battle {
    constructor(team, turns = 13) {
        this.turns = 13;
        this.battleTurns = [];
        this.enemyElement = Element.NA;
        this.counterAttackCount = 0;
        this.printOutputOption = Battle.PRINT_OUTPUT_OPTION.ALL;
        this.printEnemeyOption = false;
        this.turns = turns;
        this.team = team;
    }
    start() {
        this.init();
        this.startBattle();
    }
    init() {
        this.enemyBattleTurn = new BattleTurn('Boss');
        for (var card of this.team.cards) {
            card.initSkill();
            this.battleTurns[card.name] = new BattleTurn(card.name);
            this.battleTurns[card.name].skillCD = card.coolDown;
            for (var key of Battle.OUTPUT_TYPES) {
                this.battleTurns[card.name].outputs[key] = [];
            }
            this.battleTurns[card.name].outputs[RuleType.support] = [];
            this.battleTurns[card.name].enemyDamage[RuleType.attack] = [];
            this.battleTurns[card.name].enemyDamage[RuleType.poisonAttack] = [];
            for (var i = 0; i <= this.turns; i++) {
                this.battleTurns[card.name].ruleLog[i] = [];
            }
        }
        for (var card of this.team.cards) {
            this.initBattleRules(this.team, card);
            // this.battleTurns[card.name].setActionPattern(this.turns, card);
        }
    }
    setActionPattern(cardName, pattern) {
        this.battleTurns[cardName].actionPattern = pattern;
    }
    setManualActionPattern(cardName, skillTurns, guardTurns = []) {
        for (var i = 1; i <= this.turns; i++) {
            if (guardTurns.includes(i)) {
                this.battleTurns[cardName].action[i] = AttackType.Guard;
            }
            else if (skillTurns.includes(i)) {
                this.battleTurns[cardName].action[i] = AttackType.SkillAttack;
            }
        }
    }
    initBattleRules(team, card) {
        var toAddRules = [];
        if (card.star >= 3)
            toAddRules = toAddRules.concat(card.star3Rule);
        if (card.star >= 5)
            toAddRules = toAddRules.concat(card.star5Rule);
        if (card.potential >= 6)
            toAddRules = toAddRules.concat(card.pot6Rule);
        for (var rule of toAddRules) {
            // If rule only check in battle, only add to card but not targets
            if (rule.isRuleCheckInBattle()) {
                this.battleTurns[card.name].addRule(rule.clone());
            }
            // Apply rule to all targets
            else {
                var targetNames = rule.getRuleApplyTarget(team, card);
                for (var targetName of targetNames) {
                    var newRule = rule.clone();
                    if (newRule.target != null) {
                        newRule.target = new RuleTarget();
                    }
                    this.battleTurns[targetName].addRule(newRule);
                }
            }
        }
    }
    startBattle() {
        for (var turn = 1; turn <= this.turns; turn++) {
            // Clear rules
            for (var card of this.team.getCardByActionOrder()) {
                this.battleTurns[card.name].clearRulePerRound();
            }
            this.enemyBattleTurn.clearRulePerRound();
            // Attack
            for (var card of this.team.getCardByActionOrder()) {
                var attackType = AttackType.BasicAttack;
                if (this.battleTurns[card.name].isReleaseSkill(turn, card.coolDown)) {
                    attackType = AttackType.SkillAttack;
                }
                else if (this.battleTurns[card.name].isGuard(turn, card.coolDown)) {
                    attackType = AttackType.Guard;
                }
                attackType = this.startRound(attackType, card, turn);
                if (attackType == AttackType.SkillAttack) {
                    this.battleTurns[card.name].skillCD = card.coolDown;
                }
            }
            // Count down Skill CD
            for (var card of this.team.getCardByActionOrder()) {
                this.battleTurns[card.name].countDownCDPerRound();
            }
        }
    }
    getPostAttackRules(rules) {
        var attackRules = rules.filter(r => r.isPostAttackRule());
        return attackRules;
    }
    getPreAttackRules(rules) {
        var attackRules = rules.filter(r => !r.isPostAttackRule());
        return attackRules;
    }
    startRound(attackType, card, currentTurn) {
        var buff = [];
        var enemyDebuff = [];
        var atkSupportBuff = 0;
        var additionalPostAtkRule = []; // 追擊
        var postAtkRule = []; // 反擊
        for (var key of Battle.TEAM_BUFF_TYPES) {
            buff[key] = 0;
        }
        for (var key of Battle.ENEMY_BUFF_TYPES) {
            enemyDebuff[key] = 0;
        }
        // ---------------------------攻擊前------------------------------------
        for (var rule of this.getPreAttackRules(this.battleTurns[card.name].rules)) {
            if (!rule.isRuleCheckInBattle()) {
                continue;
            }
            if (!rule.isConditionsFulfilled(card, this.team, attackType, currentTurn)) {
                continue;
            }
            var targetNames = rule.getRuleApplyTarget(this.team, card);
            for (var targetName of targetNames) {
                var newRule = rule.cloneSimpleChild();
                newRule.target = new RuleTarget();
                newRule.condition = null;
                newRule.isPassive = false;
                // -----我方Buff-----
                // 各種buff （普攻/必殺/造傷/下毒/治療/持續治療增加）
                if (Battle.TEAM_BUFF_TYPES.includes(rule.type)) {
                    var isRuleAdded = this.battleTurns[targetName].addRule(newRule);
                }
                // -----敵方Buff-----
                // 敵方受到各種debuff （普攻/必殺/造傷/下毒）
                else if (Battle.ENEMY_BUFF_TYPES.includes(rule.type)) {
                    var isRuleAdded = this.enemyBattleTurn.addRule(newRule);
                }
                // -----其他能力-----
                // 減CD
                else if (rule.type == RuleType.cdMinus) {
                    var cooldownCount = Battle.getNumber(rule.value);
                    this.battleTurns[targetName].skillCD = this.battleTurns[targetName].skillCD - cooldownCount;
                }
                // 我方獲得技能
                else if (rule.type == RuleType.appendRule) {
                    newRule = rule.value;
                    newRule.isPassive = false;
                    this.battleTurns[targetName].addRule(newRule.cloneSimple());
                }
                // 敵方獲得技能
                else if (rule.type == RuleType.enemyAppendRule) {
                    newRule = rule.value;
                    newRule.isPassive = false;
                    var result = this.enemyBattleTurn.addRule(newRule.cloneSimple());
                }
            }
            // 減CD後可以放技能
            if (this.battleTurns[card.name].isReleaseSkill(currentTurn, card.coolDown)) {
                attackType = AttackType.SkillAttack;
            }
        }
        // Pre-attack
        for (var rule of this.getPreAttackRules(this.battleTurns[card.name].rules)) {
            if (rule.isRuleCheckInBattle()) {
                continue;
            }
            if (!rule.isConditionsFulfilled(card, this.team, attackType, currentTurn)) {
                continue;
            }
            var applyCount = rule.getConditionFulfillTimes(card, this.team, attackType, currentTurn);
            for (var i = 0; i < applyCount; i++) {
                // 攻擊力增加
                if (rule.type == RuleType.atkUp) {
                    if (rule.value.endsWith("%")) {
                        buff[rule.type] += Battle.getNumber(rule.value);
                    }
                    else {
                        atkSupportBuff += Battle.getNumber(rule.value);
                    }
                    this.battleTurns[card.name].addRuleLog(currentTurn, rule, applyCount);
                }
                // 各種buff （普攻/必殺/造傷/下毒/治療/持續治療增加）
                else if (Battle.TEAM_BUFF_TYPES.includes(rule.type)) {
                    buff[rule.type] += Battle.getNumber(rule.value);
                    this.battleTurns[card.name].addRuleLog(currentTurn, rule, applyCount);
                }
                // 敵方Debuff （普攻/必殺/造傷）
                else if (Battle.ENEMY_BUFF_TYPES.includes(rule.type)) {
                    var isRuleAdded = this.enemyBattleTurn.addRule(rule.cloneSimple());
                }
                // 普攻追擊被動
                else if (rule.type == RuleType.basicAtkFollowupSkill) {
                    var newRule = rule.cloneSimple();
                    newRule.type = RuleType.attack;
                    newRule.turn = 1;
                    newRule.isPassive = false;
                    newRule.condition = [new Condition(ConditionType.isAttackType, AttackType.BasicAttack)];
                    additionalPostAtkRule.push(newRule);
                }
                // 我方獲得技能
                else if (rule.type == RuleType.appendRule) {
                    var newRule = rule.value;
                    newRule.isPassive = false;
                    this.battleTurns[card.name].addRule(newRule.cloneSimple());
                }
                // 敵方獲得技能
                else if (rule.type == RuleType.enemyAppendRule) {
                    var newRule = rule.value;
                    newRule.isPassive = false;
                    this.enemyBattleTurn.addRule(newRule.cloneSimple());
                }
            }
        }
        // ---------------------------敵方技能-----------------------------------
        for (var rule of this.getPreAttackRules(this.enemyBattleTurn.rules)) {
            if (!rule.isConditionsFulfilled(card, this.team, attackType, currentTurn)) {
                continue;
            }
            // 敵方獲得技能
            if (rule.type == RuleType.enemyAppendRule) {
                var newRule = rule.value;
                this.enemyBattleTurn.addRule(newRule.cloneSimple());
            }
        }
        for (var rule of this.getPreAttackRules(this.enemyBattleTurn.rules)) {
            if (!rule.isConditionsFulfilled(card, this.team, attackType, currentTurn)) {
                continue;
            }
            // 敵方buffs
            if (Battle.ENEMY_BUFF_TYPES.includes(rule.type)) {
                enemyDebuff[rule.type] += Battle.getNumber(rule.value);
                this.battleTurns[card.name].addRuleLog(currentTurn, rule);
            }
        }
        // ---------------------------正式攻擊------------------------------------
        if (attackType != AttackType.Guard) {
            var attackRule = [].concat(card.attackRule);
            if (attackType == AttackType.SkillAttack) {
                attackRule = [].concat(card.skillRule);
            }
            attackRule = attackRule.concat(additionalPostAtkRule);
            var hasAttacked = false;
            for (var rule of attackRule) {
                if (!rule.isConditionsFulfilled(card, this.team, attackType, currentTurn)) {
                    continue;
                }
                // 攻擊/下毒/瞬補/緩補/輔助
                if (Battle.OUTPUT_TYPES.includes(rule.type)) {
                    this.attack(attackType, rule, atkSupportBuff, buff, enemyDebuff, card, currentTurn);
                    this.battleTurns[card.name].addRuleLog(currentTurn, rule);
                    // Post attack rules
                    if (rule.type == RuleType.attack) {
                        if (hasAttacked)
                            continue; // 連擊只會觸發1次
                        // 我方
                        for (var postRule of this.getPostAttackRules(this.battleTurns[card.name].rules)) {
                            if (!postRule.isConditionsFulfilled(card, this.team, attackType, currentTurn)) {
                                continue;
                            }
                            var postTargetNames = postRule.getRuleApplyTarget(this.team, card);
                            for (var postTargetName of postTargetNames) {
                                if (postRule.type == RuleType.appendRule) {
                                    var newRule = postRule.value;
                                    newRule.isPassive = false;
                                    this.battleTurns[postTargetName].addRule(newRule.cloneSimpleChild());
                                }
                                else if (postRule.type == RuleType.enemyAppendRule) {
                                    var newRule = postRule.value;
                                    newRule.isPassive = false;
                                    this.enemyBattleTurn.addRule(newRule.cloneSimpleChild());
                                }
                            }
                        }
                        for (var postRule of this.getPostAttackRules(this.battleTurns[card.name].rules)) {
                            if (!postRule.isConditionsFulfilled(card, this.team, attackType, currentTurn)) {
                                continue;
                            }
                            var postTargetNames = postRule.getRuleApplyTarget(this.team, card);
                            for (var postTargetName of postTargetNames) {
                                if (Battle.TEAM_BUFF_TYPES.includes(postRule.type)) {
                                    var newRule = postRule.cloneSimpleChild();
                                    newRule.target = null;
                                    newRule.condition = null;
                                    var isRuleAdded = this.battleTurns[postTargetName].addRule(newRule);
                                    buff[postRule.type] += isRuleAdded ? Battle.getNumber(postRule.value) : 0;
                                    if (isRuleAdded && postTargetName == card.name)
                                        this.battleTurns[card.name].addRuleLog(currentTurn, postRule);
                                }
                                else if (Battle.ENEMY_BUFF_TYPES.includes(postRule.type)) {
                                    var newRule = postRule.cloneSimpleChild();
                                    newRule.target = null;
                                    newRule.condition = null;
                                    var isRuleAdded = this.enemyBattleTurn.addRule(newRule);
                                    enemyDebuff[postRule.type] += isRuleAdded ? Battle.getNumber(postRule.value) : 0;
                                    if (isRuleAdded)
                                        this.battleTurns[card.name].addRuleLog(currentTurn, postRule);
                                }
                            }
                        }
                        // 敵方
                        for (var postRule of this.getPostAttackRules(this.enemyBattleTurn.rules)) {
                            if (!postRule.isConditionsFulfilled(card, this.team, attackType, currentTurn)) {
                                continue;
                            }
                            // 敵方獲得技能
                            if (postRule.type == RuleType.enemyAppendRule) {
                                var newRule = postRule.value;
                                newRule.isPassive = false;
                                this.enemyBattleTurn.addRule(newRule.cloneSimpleChild());
                            }
                        }
                        for (var postRule of this.getPostAttackRules(this.enemyBattleTurn.rules)) {
                            if (!postRule.isConditionsFulfilled(card, this.team, attackType, currentTurn)) {
                                continue;
                            }
                            // 敵方buffs
                            if (Battle.ENEMY_BUFF_TYPES.includes(postRule.type)) {
                                enemyDebuff[postRule.type] += Battle.getNumber(postRule.value);
                                this.battleTurns[card.name].addRuleLog(currentTurn, postRule);
                            }
                        }
                        hasAttacked = true;
                    }
                }
                // -----各種Buff-----
                else {
                    var targetNames = rule.getRuleApplyTarget(this.team, card);
                    for (var targetName of targetNames) {
                        // -----我方Buff-----
                        // 各種buff （普攻/必殺/造傷/下毒/治療/持續治療增加）
                        if (Battle.TEAM_BUFF_TYPES.includes(rule.type)) {
                            var isRuleAdded = this.battleTurns[targetName].addRule(rule.cloneSimple());
                            buff[rule.type] += isRuleAdded ? Battle.getNumber(rule.value) : 0;
                            if (isRuleAdded && targetName == card.name)
                                this.battleTurns[card.name].addRuleLog(currentTurn, rule);
                        }
                        // -----敵方Buff-----
                        // 敵方受到各種debuff （普攻/必殺/造傷/下毒）
                        else if (Battle.ENEMY_BUFF_TYPES.includes(rule.type)) {
                            var isRuleAdded = this.enemyBattleTurn.addRule(rule.cloneSimple());
                            enemyDebuff[rule.type] += isRuleAdded ? Battle.getNumber(rule.value) : 0;
                            if (isRuleAdded)
                                this.battleTurns[card.name].addRuleLog(currentTurn, rule);
                        }
                        // -----其他能力-----
                        // 普攻追擊（追加普攻追擊被動）
                        else if (rule.type == RuleType.basicAtkFollowup) {
                            var newRule = rule.cloneSimple();
                            newRule.type = RuleType.basicAtkFollowupSkill;
                            newRule.condition = null;
                            this.battleTurns[targetName].addRule(newRule);
                        }
                        // 反擊（追加反擊被動）
                        else if (rule.type == RuleType.counterAttack) {
                            var newRule = rule.cloneSimple();
                            newRule.type = RuleType.counterAttackSkill;
                            newRule.condition = null;
                            this.battleTurns[targetName].addRule(newRule);
                        }
                        // 減CD
                        else if (rule.type == RuleType.cdMinus) {
                            var cooldownCount = Battle.getNumber(rule.value);
                            this.battleTurns[targetName].skillCD = this.battleTurns[targetName].skillCD - cooldownCount;
                        }
                        // 我方獲得技能
                        else if (rule.type == RuleType.appendRule) {
                            var newRule = rule.value;
                            this.battleTurns[targetName].addRule(newRule.cloneSimple());
                        }
                        // 敵方獲得技能
                        else if (rule.type == RuleType.enemyAppendRule) {
                            var newRule = rule.value;
                            this.enemyBattleTurn.addRule(newRule.cloneSimple());
                        }
                    }
                }
            }
        }
        // ---------------------------反擊------------------------------------
        if (this.counterAttackCount > 0) {
            var postAtkRule = this.battleTurns[card.name].rules.filter(e => e.type == RuleType.counterAttackSkill);
            for (var rule of postAtkRule) {
                var newRule = rule.cloneSimple();
                newRule.type = RuleType.attack;
                newRule.turn = 1;
                newRule.maxCount = Math.min(this.counterAttackCount, rule.maxCount);
                this.attack(AttackType.SkillAttack, newRule, atkSupportBuff, buff, enemyDebuff, card, currentTurn);
                this.battleTurns[card.name].addRuleLog(currentTurn, newRule);
                rule.turn = 0; // consume
            }
        }
        this.battleTurns[card.name].action[currentTurn] = attackType;
        return attackType;
    }
    attack(attackType, rule, atkSupportBuff, buff, enemyDebuff, card, currentTurn) {
        var atk = card.getAtk();
        var hp = card.getHp();
        // 輔助（只用基礎攻擊力）
        if (rule.type == RuleType.support) {
            var support = Math.floor(atk * Battle.getNumber(rule.value));
            var targetNames = rule.getRuleApplyTarget(this.team, card);
            for (var targetName of targetNames) {
                var newRule = rule.cloneSimple();
                newRule.type = RuleType.atkUp;
                newRule.value = support.toString();
                newRule.condition = null;
                newRule.target = null;
                this.battleTurns[targetName].addRule(newRule);
            }
            for (var i = 0; i < rule.turn; i++) {
                this.battleTurns[card.name].outputs[rule.type][currentTurn + i] = (this.battleTurns[card.name].outputs[rule.type][currentTurn + i] || 0) + support;
            }
        }
        // 攻擊
        else {
            var outputVal = 0;
            if (rule.valueBy == RuleValueByType.hp) {
                outputVal = Math.floor((Math.floor(hp * (1 + buff[RuleType.hpUp]))) * Battle.getNumber(rule.value));
            }
            else {
                outputVal = Math.floor((Math.floor(atk * (1 + buff[RuleType.atkUp])) + atkSupportBuff) * Battle.getNumber(rule.value));
            }
            // 我方buff
            if (attackType == AttackType.SkillAttack && [RuleType.attack, RuleType.heal].includes(rule.type)) {
                outputVal = Math.floor(outputVal * (1 + buff[RuleType.skillAtkUp]));
            }
            if (attackType == AttackType.BasicAttack && [RuleType.attack, RuleType.heal].includes(rule.type)) {
                outputVal = Math.floor(outputVal * (1 + buff[RuleType.basicAtkUp]));
            }
            if (rule.type == RuleType.attack) {
                outputVal = Math.floor(outputVal * (1 + buff[RuleType.allAtkUp]));
            }
            else if (rule.type == RuleType.poisonAttack) {
                outputVal = Math.floor(outputVal * (1 + buff[RuleType.poisonAtkUp]));
            }
            else if (rule.type == RuleType.heal) {
                outputVal = Math.floor(outputVal * (1 + buff[RuleType.healUp]));
            }
            else if (rule.type == RuleType.continueHeal) {
                outputVal = Math.floor(outputVal * (1 + buff[RuleType.continueHealUp]));
            }
            for (var i = 0; i < rule.turn; i++) {
                for (var j = 0; j < rule.maxCount; j++) {
                    this.battleTurns[card.name].outputs[rule.type][currentTurn + i] = (this.battleTurns[card.name].outputs[rule.type][currentTurn + i] || 0) + outputVal;
                }
            }
            // 敵方buff
            if (rule.type == RuleType.attack || rule.type == RuleType.poisonAttack) {
                var enemyDamageVal = outputVal;
                if (attackType == AttackType.SkillAttack && rule.type == RuleType.attack) {
                    enemyDamageVal = Math.floor(enemyDamageVal * (1 + enemyDebuff[RuleType.enemySkillAtkUp]));
                }
                if (attackType == AttackType.BasicAttack && rule.type == RuleType.attack) {
                    enemyDamageVal = Math.floor(enemyDamageVal * (1 + enemyDebuff[RuleType.enemyBasicAtkUp]));
                }
                if (rule.type == RuleType.poisonAttack) {
                    enemyDamageVal = Math.floor(enemyDamageVal * (1 + enemyDebuff[RuleType.enemyPoisonAtkUp]));
                }
                if (rule.type == RuleType.attack || rule.type == RuleType.poisonAttack) {
                    enemyDamageVal = Math.floor(enemyDamageVal * (1 + enemyDebuff[RuleType.enemyAllAtkUp]));
                }
                for (var i = 0; i < rule.turn; i++) {
                    for (var j = 0; j < rule.maxCount; j++) {
                        this.battleTurns[card.name].enemyDamage[rule.type][currentTurn + i] = (this.battleTurns[card.name].enemyDamage[rule.type][currentTurn + i] || 0) + enemyDamageVal;
                    }
                }
            }
        }
    }
    getTurnValue(cardname, turn) {
        var card = this.team.getCard(cardname);
        var battleTurn = this.battleTurns[cardname];
        var output = 0;
        var ruleType = [];
        if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ALL) {
            if (card.class == Class.Striker || card.class == Class.Guardian || card.class == Class.Saboteur) {
                ruleType.push(RuleType.attack);
                ruleType.push(RuleType.poisonAttack);
            }
            else if (card.class == Class.Healer) {
                ruleType.push(RuleType.heal);
                ruleType.push(RuleType.continueHeal);
            }
            else if (card.class == Class.Support) {
                ruleType.push(RuleType.support);
            }
        }
        else if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_ATTACK) {
            ruleType.push(RuleType.attack);
        }
        else if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_POISON) {
            ruleType.push(RuleType.poisonAttack);
        }
        else if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_HEAL) {
            ruleType.push(RuleType.heal);
            ruleType.push(RuleType.continueHeal);
        }
        else if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_SUPPORT) {
            ruleType.push(RuleType.support);
        }
        else if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_DAMAGE) {
            ruleType.push(RuleType.attack);
            ruleType.push(RuleType.poisonAttack);
        }
        for (var type of ruleType) {
            if (this.printEnemeyOption && (type == RuleType.attack || type == RuleType.poisonAttack)) {
                var enemyDamage = battleTurn.enemyDamage[type][turn] | 0;
                if (this.enemyElement != Element.NA && type == RuleType.attack) {
                    enemyDamage = Math.floor(enemyDamage * Battle.getElementalBuff(card.element, this.enemyElement));
                }
                output += enemyDamage;
            }
            else {
                output += battleTurn.outputs[type][turn] | 0;
            }
        }
        return output;
    }
    getTotalValue(cardname, outputOption) {
        var card = this.team.getCard(cardname);
        var battleTurn = this.battleTurns[cardname];
        var output = 0;
        if (outputOption == null) {
            outputOption = this.printOutputOption;
        }
        var ruleType = [];
        if (outputOption == Battle.PRINT_OUTPUT_OPTION.ALL) {
            if (card.class == Class.Striker || card.class == Class.Guardian || card.class == Class.Saboteur) {
                ruleType.push(RuleType.attack);
                ruleType.push(RuleType.poisonAttack);
            }
            else if (card.class == Class.Healer) {
                ruleType.push(RuleType.heal);
                ruleType.push(RuleType.continueHeal);
            }
            else if (card.class == Class.Support) {
                ruleType.push(RuleType.support);
            }
        }
        else if (outputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_ATTACK) {
            ruleType.push(RuleType.attack);
        }
        else if (outputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_POISON) {
            ruleType.push(RuleType.poisonAttack);
        }
        else if (outputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_HEAL) {
            ruleType.push(RuleType.heal);
            ruleType.push(RuleType.continueHeal);
        }
        else if (outputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_SUPPORT) {
            ruleType.push(RuleType.support);
        }
        else if (outputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_DAMAGE) {
            ruleType.push(RuleType.attack);
            ruleType.push(RuleType.poisonAttack);
        }
        for (var turn = 1; turn <= this.turns; turn++) {
            for (var type of ruleType) {
                if (this.printEnemeyOption && (type == RuleType.attack || type == RuleType.poisonAttack)) {
                    var enemyDamage = battleTurn.enemyDamage[type][turn] | 0;
                    if (this.enemyElement != Element.NA && type == RuleType.attack) {
                        enemyDamage = Math.floor(enemyDamage * Battle.getElementalBuff(card.element, this.enemyElement));
                    }
                    output += enemyDamage;
                }
                else {
                    output += battleTurn.outputs[type][turn] | 0;
                }
            }
        }
        return output;
    }
    getTeamTotalValue() {
        var output = 0;
        var printOutputOption = this.printOutputOption;
        if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ALL) {
            printOutputOption = Battle.PRINT_OUTPUT_OPTION.ONLY_DAMAGE;
        }
        for (var card of this.team.cards) {
            output += this.getTotalValue(card.name, printOutputOption);
        }
        return output;
    }
    getTeamTotalDamage() {
        var output = 0;
        for (var card of this.team.cards) {
            output += this.getTotalValue(card.name, Battle.PRINT_OUTPUT_OPTION.ONLY_DAMAGE);
        }
        return output;
    }
    getTurnAction(cardname, turn) {
        return this.battleTurns[cardname].action[turn];
    }
    // TODO: should simplify those ugly if-else code for different rule types
    getTurnRuleLog(cardname, turn) {
        var attackType = this.battleTurns[cardname].action[turn];
        var rules = this.battleTurns[cardname].ruleLog[turn];
        var hasAttack = rules.map(e => e.type).includes(RuleType.attack);
        var hasPoisonAttack = rules.map(e => e.type).includes(RuleType.poisonAttack);
        var hasHeal = rules.map(e => e.type).includes(RuleType.heal);
        var hasContHeal = rules.map(e => e.type).includes(RuleType.continueHeal);
        var acceptTypes = [RuleType.attack, RuleType.poisonAttack, RuleType.support, RuleType.continueHeal, RuleType.heal];
        if (hasAttack) {
            if (attackType == AttackType.BasicAttack) {
                acceptTypes = acceptTypes.concat([RuleType.atkUp, RuleType.basicAtkUp, RuleType.allAtkUp, RuleType.enemyBasicAtkUp, RuleType.enemyAllAtkUp]);
            }
            else if (attackType == AttackType.SkillAttack) {
                acceptTypes = acceptTypes.concat([RuleType.atkUp, RuleType.skillAtkUp, RuleType.allAtkUp, RuleType.enemySkillAtkUp, RuleType.enemyAllAtkUp]);
            }
        }
        if (hasPoisonAttack) {
            acceptTypes = acceptTypes.concat([RuleType.basicAtkUp, RuleType.allAtkUp, RuleType.poisonAtkUp, RuleType.enemyPoisonAtkUp, RuleType.enemyAllAtkUp]);
        }
        if (hasHeal) {
            if (attackType == AttackType.BasicAttack) {
                acceptTypes = acceptTypes.concat([RuleType.atkUp, RuleType.basicAtkUp]);
            }
            else if (attackType == AttackType.SkillAttack) {
                acceptTypes = acceptTypes.concat([RuleType.atkUp, RuleType.skillAtkUp]);
            }
        }
        if (hasContHeal) {
            acceptTypes = acceptTypes.concat([RuleType.atkUp, RuleType.continueHealUp]);
        }
        rules = rules.filter(function (rule) {
            return acceptTypes.includes(rule.type);
        });
        rules = this.filterRulesByPrintOption(rules);
        return rules;
    }
    filterRulesByPrintOption(rules) {
        var acceptTypes = [];
        var hasAttack = rules.map(e => e.type).includes(RuleType.attack);
        var hasPoisonAttack = rules.map(e => e.type).includes(RuleType.poisonAttack);
        var hasHeal = rules.map(e => e.type).includes(RuleType.heal);
        var hasContHeal = rules.map(e => e.type).includes(RuleType.continueHeal);
        if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ALL) {
            return rules;
        }
        else if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_SUPPORT) {
            acceptTypes = [RuleType.support];
        }
        else {
            if (hasAttack && [Battle.PRINT_OUTPUT_OPTION.ONLY_ATTACK,
                Battle.PRINT_OUTPUT_OPTION.ONLY_DAMAGE].includes(this.printOutputOption)) {
                acceptTypes = acceptTypes.concat([RuleType.attack, RuleType.atkUp, RuleType.basicAtkUp, RuleType.skillAtkUp, RuleType.allAtkUp,
                    RuleType.enemyBasicAtkUp, RuleType.enemySkillAtkUp, RuleType.enemyAllAtkUp]);
            }
            if (hasPoisonAttack && [Battle.PRINT_OUTPUT_OPTION.ONLY_POISON,
                Battle.PRINT_OUTPUT_OPTION.ONLY_DAMAGE].includes(this.printOutputOption)) {
                acceptTypes = acceptTypes.concat([RuleType.poisonAttack, RuleType.atkUp, RuleType.poisonAtkUp, RuleType.allAtkUp,
                    RuleType.enemyPoisonAtkUp, RuleType.enemyAllAtkUp]);
            }
            if (hasHeal && [Battle.PRINT_OUTPUT_OPTION.ONLY_HEAL].includes(this.printOutputOption)) {
                acceptTypes = acceptTypes.concat([RuleType.heal, RuleType.healUp, RuleType.atkUp, RuleType.basicAtkUp, RuleType.skillAtkUp]);
            }
            if (hasContHeal && [Battle.PRINT_OUTPUT_OPTION.ONLY_HEAL].includes(this.printOutputOption)) {
                acceptTypes = acceptTypes.concat([RuleType.continueHeal, RuleType.continueHealUp, RuleType.atkUp]);
            }
        }
        if (!this.printEnemeyOption) {
            var removeTypes = [RuleType.enemyBasicAtkUp, RuleType.enemySkillAtkUp, RuleType.enemyPoisonAtkUp, RuleType.enemyAllAtkUp];
            acceptTypes = acceptTypes.filter(e => !removeTypes.includes(e));
        }
        rules = rules.filter(function (rule) {
            return acceptTypes.includes(rule.type);
        });
        return rules;
    }
    getTurnRuleLogStr(cardname, turn) {
        var rules = this.getTurnRuleLog(cardname, turn);
        return rules.map(r => r.toString()).join('\n');
    }
    static getElementalBuff(e1, e2) {
        if ((e1 == Element.Fire && e2 == Element.Water) || (e1 == Element.Water && e2 == Element.Wood) || (e1 == Element.Wood && e2 == Element.Fire)) {
            return 0.8;
        }
        else if ((e1 == Element.Fire && e2 == Element.Wood) || (e1 == Element.Water && e2 == Element.Fire) || (e1 == Element.Wood && e2 == Element.Water)
            || (e1 == Element.Light && e2 == Element.Dark) || (e1 == Element.Dark && e2 == Element.Light)) {
            return 1.2;
        }
        return 1;
    }
    printResult() {
        console.info('角色\t' + this.team.cards.map(e => e.name).join('\t'));
        console.info('星數\t' + this.team.cards.map(e => e.star).join('\t'));
        console.info('HP\t' + this.team.cards.map(e => e.getHp()).join('\t'));
        console.info('ATK\t' + this.team.cards.map(e => e.getAtk()).join('\t'));
        console.info('普攻\t' + this.team.cards.map(e => e.attackRule).join('\t'));
        console.info('必殺\t' + this.team.cards.map(e => e.skillRule).join('\t'));
        console.info('3星\t' + this.team.cards.map(e => e.star3Rule).join('\t'));
        console.info('5星\t' + this.team.cards.map(e => e.star5Rule).join('\t'));
        console.info('潛6\t' + this.team.cards.map(e => e.pot6Rule).join('\t'));
        console.info();
        var totalOutput = [];
        var totalEnemyDamage = [];
        for (var card of this.team.cards) {
            totalOutput[card.name] = 0;
            totalEnemyDamage[card.name] = 0;
        }
        for (var turn = 1; turn <= this.turns; turn++) {
            var s = turn + '\t';
            for (var card of this.team.cards) {
                s += this.getTurnValue(card.name, turn) + '\t';
            }
            console.info(s);
        }
        var summary = '總計\t';
        for (var card of this.team.cards) {
            summary += this.getTotalValue(card.name) + '\t';
        }
        console.info(summary);
        console.info('隊伍總數\t' + this.getTeamTotalValue());
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
}
Battle.PRINT_OUTPUT_OPTION = { ALL: 'All', ONLY_DAMAGE: 'OnlyDamage', ONLY_ATTACK: 'OnlyAttack', ONLY_SUPPORT: 'OnlySupport', ONLY_HEAL: 'OnlyHeal', ONLY_POISON: 'OnlyPoison' };
Battle.OUTPUT_TYPES = [RuleType.attack, RuleType.poisonAttack, RuleType.heal, RuleType.continueHeal, RuleType.support];
Battle.TEAM_BUFF_TYPES = [RuleType.atkUp, RuleType.hpUp, RuleType.basicAtkUp, RuleType.skillAtkUp, RuleType.allAtkUp, RuleType.poisonAtkUp, RuleType.healUp, RuleType.continueHealUp];
Battle.ENEMY_BUFF_TYPES = [RuleType.enemyBasicAtkUp, RuleType.enemySkillAtkUp, RuleType.enemyAllAtkUp, RuleType.enemyPoisonAtkUp];
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
    addCard(card) {
        if (card != null) {
            this.cards.push(card);
        }
        this.position[this.cards.length] = card.name;
        this.actionOrder[this.cards.length - 1] = card.name;
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
            if (this.cards.length >= pos) {
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
}
export class RuleTarget {
    constructor(type = TargetType.self, value = null, exceptType = null, exceptValue = null) {
        this.type = type;
        this.exceptType = exceptType;
        if (Array.isArray(value) || value == null) {
            this.value = value;
        }
        else {
            this.value = [value];
        }
        if (Array.isArray(exceptValue) || exceptValue == null) {
            this.exceptValue = exceptValue;
        }
        else {
            this.exceptValue = [exceptValue];
        }
    }
    static loadTarget({ type = TargetType.self, value = null, exceptType = null, exceptValue = null }) {
        var target = new RuleTarget(type, value, exceptType, exceptValue);
        return target;
    }
    getTarget(type, value, team, card) {
        var cardNames = [];
        if (type == null) {
            // do nothing
        }
        else if (type == TargetType.self) {
            cardNames.push(card.name);
        }
        else if (type == TargetType.all) {
            cardNames = Object.values(team.cards).map(e => e.name);
        }
        else if (type == TargetType.isClass) {
            var targetClasses = value;
            cardNames = Object.values(team.cards).filter(e => targetClasses.includes(e.class)).map(e => e.name);
        }
        else if (type == TargetType.isChar) {
            var targetChars = value;
            cardNames = Object.values(team.cards).filter(e => targetChars.includes(e.char)).map(e => e.name);
        }
        else if (type == TargetType.isPosition) {
            var targetPos = value;
            var targetCards = team.getCardByPos(targetPos);
            cardNames = targetCards.map(e => e.name);
        }
        return cardNames;
    }
    getIncludeTarget(team, card) {
        return this.getTarget(this.type, this.value, team, card);
    }
    getExcludeTarget(team, card) {
        return this.getTarget(this.exceptType, this.exceptValue, team, card);
    }
    getTargetCard(team, card) {
        var includeNames = this.getIncludeTarget(team, card);
        var excludeNames = this.getExcludeTarget(team, card);
        return includeNames.filter(e => !excludeNames.includes(e));
    }
    toString() {
        var type = this.type;
        var value = this.value;
        var exceptStr = this.exceptType != null ? this.exceptValue != null ? this.exceptValue : this.exceptType : '';
        if (exceptStr.length > 0)
            exceptStr = '（除了' + exceptStr + '）';
        if (value == null) {
            return type + exceptStr;
        }
        return value.toString() + exceptStr;
    }
}
export class Rule {
    static createId() {
        return Rule.idCounter++;
    }
    constructor({ id = null, isPassive = false, type = RuleType.attack, value, valueBy = RuleValueByType.atk, turn = 50, maxCount = 1, condition = null, target = null }) {
        this.target = null;
        this.condition = null;
        this.id = id == null ? Rule.createId() : id;
        this.isPassive = isPassive;
        if (typeof type == 'string') {
            var idx = Object.values(RuleType).indexOf(type);
            this.type = RuleType[Object.keys(RuleType)[idx]];
        }
        else {
            this.type = type;
        }
        this.value = value;
        this.valueBy = valueBy;
        this.turn = turn;
        this.maxCount = maxCount;
        if (condition == null || Array.isArray(condition)) {
            this.condition = condition;
        }
        else {
            this.condition = [condition];
        }
        this.target = target;
    }
    toString() {
        var s = this.type + ' ' + this.value;
        if (this.turn < 50 && this.turn > 1) {
            s += '（' + this.turn + '回合）';
        }
        if (this.maxCount > 1) {
            s += '（最多' + this.maxCount + '層）';
        }
        return s;
    }
    clone() {
        var cloneRule = new Rule({ id: this.id, isPassive: this.isPassive, type: this.type, value: this.value, valueBy: this.valueBy,
            turn: this.turn, maxCount: this.maxCount, condition: this.condition, target: this.target });
        if (this.condition != null) {
            cloneRule.condition = this.condition;
        }
        return cloneRule;
    }
    cloneSimpleChild() {
        var cloneRule = this.clone();
        cloneRule.id += Rule.CHILD_RULE_ID_INCREMENT;
        return cloneRule;
    }
    // Not passive
    cloneSimple() {
        var cloneRule = new Rule({ id: this.id, isPassive: false, type: this.type, value: this.value, valueBy: this.valueBy,
            turn: this.turn, maxCount: this.maxCount, condition: this.condition, target: this.target });
        if (this.condition != null) {
            cloneRule.condition = this.condition;
        }
        return cloneRule;
    }
    isConditionsFulfilled(card, team, attackType, turn) {
        if (this.condition == null || this.condition.length == 0) {
            return true;
        }
        var isFulfilled = true;
        for (var condition of this.condition) {
            isFulfilled = isFulfilled && condition.isFulfilled(card, team, attackType, turn);
        }
        return isFulfilled;
    }
    getConditionFulfillTimes(card, team, attackType, turn) {
        if (this.condition == null || this.condition.length == 0 || this.maxCount == null) {
            return 1;
        }
        var count = this.maxCount;
        for (var condition of this.condition) {
            count = Math.min(count, condition.getFulfillTimes(card, team, attackType, turn));
        }
        return count;
    }
    isRuleCheckInBattle() {
        if (this.condition == null || this.condition.length == 0) {
            return false;
        }
        for (var condition of this.condition) {
            if (Condition.CHECK_IN_BATTLE_LIST.includes(condition.type)) {
                return true;
            }
        }
        return false;
    }
    isPostAttackRule() {
        if (this.condition == null || this.condition.length == 0) {
            return false;
        }
        for (var condition of this.condition) {
            if (condition.type == ConditionType.isAttack || condition.type == ConditionType.enemyIsAttacked) {
                return true;
            }
        }
        return false;
    }
    getRuleApplyTarget(team, card) {
        var cardNames = [];
        if (this.target == null) {
            cardNames.push(card.name); //self
        }
        else {
            cardNames = this.target.getTargetCard(team, card);
        }
        return cardNames;
    }
    static loadRule({ isPassive = false, type = RuleType.attack, value, valueBy = RuleValueByType.atk, turn = 1, maxCount = 1, condition = null, target = null }) {
        if (type == RuleType.appendRule || type == RuleType.enemyAppendRule) {
            value = Rule.loadRule(value);
        }
        var conditionArr = null;
        if (condition != null) {
            conditionArr = [];
            if (Array.isArray(condition)) {
                for (var item of condition) {
                    conditionArr.push(new Condition(item.type, item.value));
                }
            }
            else if (typeof condition == 'string') {
                conditionArr.push(new Condition(condition, null));
            }
            else {
                conditionArr.push(new Condition(condition.type, condition.value));
            }
        }
        var targetItem = null;
        if (target != null) {
            if (typeof target == 'string') {
                target = { type: target };
            }
            targetItem = RuleTarget.loadTarget(target);
        }
        var rule = new Rule({ isPassive: isPassive, type: type, value: value, valueBy: valueBy, turn: turn, maxCount: maxCount, condition: conditionArr, target: targetItem });
        return rule;
    }
    static loadSimpleRule({ type = RuleType.attack, value, valueBy = RuleValueByType.atk, turn = 1, maxCount = 1, condition = null, target = null }) {
        var isPassive = false;
        return Rule.loadRule({ isPassive, type, value, valueBy, turn, maxCount, condition, target });
    }
    static loadPermRule({ type = RuleType.attack, value, valueBy = RuleValueByType.atk, turn = ALWAYS_EFFECTIVE, maxCount = 1, condition = null, target = null }) {
        var isPassive = true;
        return Rule.loadRule({ isPassive, type, value, valueBy, turn, maxCount, condition, target });
    }
}
Rule.idCounter = 0;
Rule.CHILD_RULE_ID_INCREMENT = 300000;
export class LogRule extends Rule {
    constructor(rule) {
        super(rule);
        this.applyCount = 1;
        if (rule.type == RuleType.attack) {
            this.applyCount = rule.maxCount;
        }
    }
    addCount() {
        this.applyCount++;
    }
    toString() {
        var s = this.type + '：' + this.value;
        if (this.maxCount > 1) {
            if (this.type == RuleType.attack || this.type == RuleType.poisonAttack) {
                s += '（' + this.applyCount + '次）';
            }
            else {
                s += '（' + this.applyCount + '層）';
            }
        }
        return s;
    }
    getFullSkillInfo() {
        var s = this.type + this.value;
        if (this.target != null && this.target.type != TargetType.self) {
            s = this.target + s;
        }
        if (this.condition != null && this.condition.length > 0) {
            s = this.condition.map(c => c.toString()).join('，') + '，' + s;
        }
        if (this.turn < 50 && this.turn > 1) {
            s += '（' + this.turn + '回合）';
        }
        if (this.maxCount > 1) {
            s += '（最多' + this.maxCount + '層）';
        }
        return s;
    }
}
export class Condition {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
    isFulfilled(card, team, charAttackType, currentTurn) {
        if (this.type == ConditionType.hasChar || this.type == ConditionType.charCount) {
            return team.hasChar(this.value.toString());
        }
        else if (this.type == ConditionType.hasClass || this.type == ConditionType.classCount) {
            return team.hasClass(this.value);
        }
        else if (this.type == ConditionType.hpHigher || this.type == ConditionType.hpLower) {
            return Condition.IS_HP_FULFILL;
        }
        else if (this.type == ConditionType.isAttackType) {
            return this.value == charAttackType;
        }
        else if (this.type == ConditionType.isAttack) {
            return charAttackType == AttackType.BasicAttack || charAttackType == AttackType.SkillAttack;
        }
        else if (this.type == ConditionType.everyTurn) {
            return ((currentTurn - 1) % this.value) == 0;
        }
        else if (this.type == ConditionType.atTurn) {
            if (Array.isArray(this.value)) {
                return this.value.includes(currentTurn);
            }
            else {
                return this.value == currentTurn;
            }
        }
        else if (this.type == ConditionType.enemyIsAttacked) {
            return charAttackType == AttackType.BasicAttack || charAttackType == AttackType.SkillAttack;
        }
        else if (this.type == ConditionType.enemyIsAttackByChar) {
            return this.value == card.char;
        }
        else if (this.type == ConditionType.enemyIsAttackByClass) {
            return this.value == card.class;
        }
        return false;
    }
    getFulfillTimes(card, team, charAttackType, currentTurn) {
        if (this.type == ConditionType.charCount) {
            return team.getCharCount((this.value.toString()));
        }
        else if (this.type == ConditionType.classCount) {
            return team.getClassCount(this.value);
        }
        else if (this.isFulfilled(card, team, charAttackType, currentTurn)) {
            return 1;
        }
        return 0;
    }
    toString() {
        var type = this.type;
        var value = this.value;
        if (type == ConditionType.charCount) {
            return type.replace('角色', '1名「' + value.toString() + '」');
        }
        else if (type == ConditionType.classCount) {
            return type.replace('定位', '1名「' + value.toString() + '」');
        }
        else if (type == ConditionType.hasChar) {
            return type.replace('角色', '「' + value.toString() + '」') + '時';
        }
        else if (type == ConditionType.hasClass) {
            return type.replace('定位', '定位' + value.toString()) + '時';
        }
        else if (type == ConditionType.atTurn) {
            return type.replace('n', value.toString()) + '時';
        }
        else if (type == ConditionType.everyTurn) {
            return '每經過' + value.toString() + '回合';
        }
        else if (type == ConditionType.isAttackType) {
            return value.toString() + '時';
        }
        else if (type == ConditionType.isAttack) {
            return type;
        }
        else if (type == ConditionType.hpHigher || type == ConditionType.hpLower) {
            return '當前' + type + value + '時';
        }
        return type + value;
    }
}
// can only check after battle start
Condition.CHECK_IN_BATTLE_LIST = [ConditionType.isAttackType, ConditionType.isAttack, ConditionType.everyTurn, ConditionType.atTurn];
Condition.IS_HP_FULFILL = true;
//# sourceMappingURL=BattleSystem.js.map