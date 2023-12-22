"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Condition = exports.Rule = exports.RuleTarget = exports.Team = exports.Battle = exports.BattleTurn = exports.Card = exports.CardCenter = void 0;
var Constants_1 = require("./Constants");
var ALWAYS_EFFECTIVE = 99;
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
var CardCenter = /** @class */ (function () {
    function CardCenter() {
    }
    CardCenter.setMainCardData = function (obj) {
        CardCenter.cardData = obj;
    };
    CardCenter.addUserCardData = function (newObj) {
        CardCenter.concatData(CardCenter.userCardData, newObj);
    };
    CardCenter.concatData = function (o1, o2) {
        for (var _i = 0, _a = Object.keys(o2); _i < _a.length; _i++) {
            var key = _a[_i];
            o1[key] = o2[key];
        }
        return o1;
    };
    CardCenter.getCardData = function () {
        var fullCardData = JSON.parse(JSON.stringify(CardCenter.cardData));
        fullCardData = CardCenter.concatData(fullCardData, CardCenter.userCardData);
        return fullCardData;
    };
    CardCenter.setupDefaultTeamStar = function (team, ssrStar, srStar) {
        for (var _i = 0, _a = team.cards; _i < _a.length; _i++) {
            var card = _a[_i];
            if (card.rarity == Constants_1.Rarity.SSR) {
                card.star = ssrStar;
            }
            else if (card.rarity == Constants_1.Rarity.SR) {
                card.star = srStar;
            }
        }
    };
    CardCenter.loadCard = function (name) {
        if (CardCenter.getCardData()[name] == null) {
            throw new Error('Card does not exists: ' + name);
        }
        return Card.loadCardFromJson(name, CardCenter.getCardData()[name]);
    };
    CardCenter.getCardNameByChar = function (char) {
        var arr = [];
        var cardData = CardCenter.getCardData();
        for (var _i = 0, _a = Object.keys(cardData); _i < _a.length; _i++) {
            var name = _a[_i];
            if (cardData[name].char == char) {
                arr.push(name);
            }
        }
        arr = arr.reverse();
        return arr;
    };
    CardCenter.cardData = {};
    CardCenter.userCardData = {};
    return CardCenter;
}());
exports.CardCenter = CardCenter;
var Card = /** @class */ (function () {
    function Card(name, char, rarity) {
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
    Card.prototype.initSkill = function () {
        if (this.star >= 4)
            this.skillRule = this.skillLv3Rule;
        else if (this.star >= 2)
            this.skillRule = this.skillLv2Rule;
        else
            this.skillRule = this.skillLv1Rule;
    };
    Card.prototype.getPassiveRuleSummary = function () {
        var ruleArr = [];
        if (this.star >= 3)
            ruleArr.concat(this.star3Rule);
        if (this.star == 5)
            ruleArr.concat(this.star5Rule);
        if ((this.rarity == Constants_1.Rarity.SSR || this.rarity == Constants_1.Rarity.SR)) {
            if (this.potential >= 6) {
                ruleArr.concat(this.pot6Rule);
            }
        }
        else if (this.potential >= 3) {
            ruleArr.concat(this.pot6Rule);
        }
        return ruleArr;
    };
    Card.prototype.getAttackRuleSummary = function () {
        this.initSkill();
        var ruleArr = [];
        ruleArr.concat(this.attackRule);
        ruleArr.concat(this.skillRule);
        return ruleArr;
    };
    Card.prototype.getCardVal = function (baseVal, potential) {
        var val = 0;
        val = Math.ceil(baseVal / Math.pow(1.05, 59)) * (0.5 + (0.1 * this.star));
        var bondVal = 0;
        if (this.bond > 0) {
            if (this.rarity == Constants_1.Rarity.SSR) {
                var bondVals = [5, 10, 20, 35, 60];
                bondVal = bondVals[this.bond - 1];
            }
            else if (this.rarity == Constants_1.Rarity.SR || this.rarity == Constants_1.Rarity.R) {
                var bondVals = [5, 10, 20, 30, 50];
                bondVal = bondVals[this.bond - 1];
            }
        }
        val = Math.floor(val * Math.pow(1.05, this.level - 1) * (1 + bondVal / 100) * (1 + potential / 100));
        return val;
    };
    Card.prototype.getAtk = function () {
        if (this.atk != null) {
            return this.atk;
        }
        return this.getCardVal(this.baseAtk, this.getAtkPotential());
    };
    Card.prototype.getHp = function () {
        if (this.hp != null) {
            return this.hp;
        }
        return this.getCardVal(this.baseHp, this.getHpPotential());
    };
    Card.prototype.getHpPotential = function () {
        return this.getPotentialPercent('hp', this.potential);
    };
    Card.prototype.getAtkPotential = function () {
        return this.getPotentialPercent('atk', this.potential);
    };
    Card.prototype.getPotentialPercent = function (hpOrAtk, tier) {
        var potType = 'D';
        if (this.potType == Constants_1.PotentialType.A)
            potType = 'A';
        else if (this.potType == Constants_1.PotentialType.B)
            potType = 'B';
        else if (this.potType == Constants_1.PotentialType.C)
            potType = 'C';
        else if (this.potType == Constants_1.PotentialType.D)
            potType = 'D';
        if ((this.rarity == 'R' || this.rarity == 'N') && tier > 6) {
            tier = 6;
        }
        tier = tier + 1;
        var potArr = GAME_CONFIG.POTTYPE[potType][hpOrAtk];
        var sum = 0;
        for (var i = 0; i < tier - 1; i++) {
            sum += potArr[i].reduce(function (a, b) { return a + b; });
        }
        return sum;
    };
    Card.loadCard = function (data) {
        var card = new Card();
        for (var _i = 0, _a = Object.keys(data); _i < _a.length; _i++) {
            var key = _a[_i];
            card[key] = data[key];
        }
        return card;
    };
    Card.loadCardFromJson = function (name, data) {
        var card = new Card();
        var simpleRules = ['attackRule', 'skillLv1Rule', 'skillLv2Rule', 'skillLv3Rule'];
        var permRules = ['star3Rule', 'star5Rule', 'pot6Rule'];
        for (var _i = 0, _a = Object.keys(data); _i < _a.length; _i++) {
            var key = _a[_i];
            if (simpleRules.includes(key)) {
                card[key] = [];
                for (var _b = 0, _c = data[key]; _b < _c.length; _b++) {
                    var ruleItem = _c[_b];
                    card[key].push(Rule.loadSimpleRule(ruleItem));
                }
            }
            else if (permRules.includes(key)) {
                card[key] = [];
                for (var _d = 0, _e = data[key]; _d < _e.length; _d++) {
                    var ruleItem = _e[_d];
                    card[key].push(Rule.loadPermRule(ruleItem));
                }
            }
            else {
                card[key] = data[key];
            }
        }
        card.name = name;
        return card;
    };
    return Card;
}());
exports.Card = Card;
var BattleTurn = /** @class */ (function () {
    function BattleTurn(cardName) {
        this.cardName = cardName;
        this.skillCD = 0;
        this.action = [];
        this.actionPattern = Constants_1.ActionPattern.Immediately;
        this.outputs = [];
        this.enemyDamage = [];
        this.rules = [];
    }
    // setActionPattern(turns: number, card : Card, type = 'immediately'){
    // 	for (var i=1; i<=turns; i++){
    // 		this.action[i] = AttackType.BasicAttack;
    // 	}
    // 	if (type == 'immediately'){
    // 		var cd = card.coolDown;
    // 		for (var i=1+cd; i<=turns; i+=cd){
    // 			this.action[i] = AttackType.SkillAttack;
    // 		}
    // 	}
    // }
    BattleTurn.prototype.addRule = function (newRule) {
        // Always effective rule: check max count allowed
        if (newRule.turn == ALWAYS_EFFECTIVE) {
            var currentCount = this.rules.filter(function (rule) { return rule.id == newRule.id; }).length;
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
    };
    BattleTurn.prototype.clearRulePerRound = function () {
        for (var _i = 0, _a = this.rules; _i < _a.length; _i++) {
            var rule = _a[_i];
            if (!rule.isPassive && rule.turn != ALWAYS_EFFECTIVE) {
                rule.turn = rule.turn - 1;
            }
        }
        this.rules = this.rules.filter(function (rule) { return rule.turn > 0; });
    };
    BattleTurn.prototype.countDownCDPerRound = function () {
        if (this.skillCD > 0) {
            this.skillCD -= 1;
        }
    };
    BattleTurn.prototype.isSkillAvailable = function () {
        if (this.skillCD == 0) {
            return true;
        }
        return false;
    };
    BattleTurn.prototype.getLastSkillTurn = function () {
        if (!this.isSkillAvailable()) {
            return -1;
        }
        var lastTurn = 0;
        for (var i = this.action.length - 1; i >= 0; i--) {
            if (this.action[i] == Constants_1.AttackType.SkillAttack) {
                lastTurn = i;
                break;
            }
        }
        return lastTurn;
    };
    BattleTurn.prototype.getSkillDelayedTurn = function (currentTurn, cooldown) {
        var lastTurn = this.getLastSkillTurn();
        if (lastTurn == 0) {
            lastTurn = 1;
        }
        return currentTurn - (lastTurn + cooldown);
    };
    BattleTurn.prototype.isGuard = function (currentTurn, cooldown) {
        if (this.actionPattern == Constants_1.ActionPattern.Manual) {
            return this.action[currentTurn] == Constants_1.AttackType.Guard;
        }
        return false;
    };
    BattleTurn.prototype.isReleaseSkill = function (currentTurn, cooldown) {
        if (!this.isSkillAvailable()) {
            return false;
        }
        if (this.actionPattern == Constants_1.ActionPattern.Immediately) {
            return true;
        }
        else if (this.actionPattern == Constants_1.ActionPattern.Delay1Turn) {
            if (this.getLastSkillTurn() == 0) {
                return this.getSkillDelayedTurn(currentTurn, cooldown) >= 1;
            }
            else {
                return true;
            }
        }
        else if (this.actionPattern == Constants_1.ActionPattern.AddCD1) {
            return (this.getSkillDelayedTurn(currentTurn, cooldown) == 1);
        }
        else if (this.actionPattern == Constants_1.ActionPattern.AddCD2) {
            return (this.getSkillDelayedTurn(currentTurn, cooldown) == 2);
        }
        else if (this.actionPattern == Constants_1.ActionPattern.AddCD3) {
            return (this.getSkillDelayedTurn(currentTurn, cooldown) == 3);
        }
        else if (this.actionPattern == Constants_1.ActionPattern.AddCD1Delay1Turn) {
            if (this.getLastSkillTurn() == 0) {
                return (this.getSkillDelayedTurn(currentTurn, cooldown) == 2);
            }
            else {
                return (this.getSkillDelayedTurn(currentTurn, cooldown) == 1);
            }
        }
        else if (this.actionPattern == Constants_1.ActionPattern.AddCD2Ahead1Turn) {
            if (this.getLastSkillTurn() == 0) {
                return (this.getSkillDelayedTurn(currentTurn, cooldown) == 1);
            }
            else {
                return (this.getSkillDelayedTurn(currentTurn, cooldown) == 2);
            }
        }
        else if (this.actionPattern == Constants_1.ActionPattern.Manual) {
            return this.action[currentTurn] == Constants_1.AttackType.SkillAttack;
        }
        return false;
    };
    return BattleTurn;
}());
exports.BattleTurn = BattleTurn;
var Battle = /** @class */ (function () {
    function Battle(team, turns) {
        if (turns === void 0) { turns = 13; }
        this.turns = 13;
        this.battleTurns = [];
        this.enemyElement = Constants_1.Element.NA;
        this.counterAttackCount = 0;
        this.printOutputOption = Battle.PRINT_OUTPUT_OPTION.ALL;
        this.printEnemeyOption = false;
        this.turns = turns;
        this.team = team;
    }
    Battle.prototype.start = function () {
        this.init();
        this.startBattle();
    };
    Battle.prototype.init = function () {
        this.enemyBattleTurn = new BattleTurn('Boss');
        for (var _i = 0, _a = this.team.cards; _i < _a.length; _i++) {
            var card = _a[_i];
            card.initSkill();
            this.battleTurns[card.name] = new BattleTurn(card.name);
            this.battleTurns[card.name].skillCD = card.coolDown;
            for (var _b = 0, _c = Battle.OUTPUT_TYPES; _b < _c.length; _b++) {
                var key = _c[_b];
                this.battleTurns[card.name].outputs[key] = [];
            }
            this.battleTurns[card.name].outputs[Constants_1.RuleType.support] = [];
            this.battleTurns[card.name].enemyDamage[Constants_1.RuleType.attack] = [];
            this.battleTurns[card.name].enemyDamage[Constants_1.RuleType.poisonAttack] = [];
        }
        for (var _d = 0, _e = this.team.cards; _d < _e.length; _d++) {
            var card = _e[_d];
            this.initBattleRules(this.team, card);
            // this.battleTurns[card.name].setActionPattern(this.turns, card);
        }
    };
    Battle.prototype.setActionPattern = function (cardName, pattern) {
        this.battleTurns[cardName].actionPattern = pattern;
    };
    Battle.prototype.setManualActionPattern = function (cardName, skillTurns, guardTurns) {
        if (guardTurns === void 0) { guardTurns = []; }
        for (var i = 1; i <= this.turns; i++) {
            if (guardTurns.includes(i)) {
                this.battleTurns[cardName].action[i] = Constants_1.AttackType.Guard;
            }
            else if (skillTurns.includes(i)) {
                this.battleTurns[cardName].action[i] = Constants_1.AttackType.SkillAttack;
            }
        }
    };
    Battle.prototype.initBattleRules = function (team, card) {
        var toAddRules = [];
        if (card.star >= 3)
            toAddRules = toAddRules.concat(card.star3Rule);
        if (card.star >= 5)
            toAddRules = toAddRules.concat(card.star5Rule);
        if (card.potential >= 6)
            toAddRules = toAddRules.concat(card.pot6Rule);
        for (var _i = 0, toAddRules_1 = toAddRules; _i < toAddRules_1.length; _i++) {
            var rule = toAddRules_1[_i];
            // If rule only check in battle, only add to card but not targets
            if (rule.isRuleCheckInBattle()) {
                this.battleTurns[card.name].addRule(rule.clone());
            }
            // Apply rule to all targets
            else {
                var targetNames = rule.getRuleApplyTarget(team, card);
                for (var _a = 0, targetNames_1 = targetNames; _a < targetNames_1.length; _a++) {
                    var targetName = targetNames_1[_a];
                    var newRule = rule.clone();
                    if (newRule.target != null) {
                        newRule.target = new RuleTarget();
                    }
                    this.battleTurns[targetName].addRule(newRule);
                }
            }
        }
    };
    Battle.prototype.startBattle = function () {
        for (var turn = 1; turn <= this.turns; turn++) {
            // Clear rules
            for (var _i = 0, _a = this.team.getCardByActionOrder(); _i < _a.length; _i++) {
                var card = _a[_i];
                this.battleTurns[card.name].clearRulePerRound();
            }
            this.enemyBattleTurn.clearRulePerRound();
            // Attack
            for (var _b = 0, _c = this.team.getCardByActionOrder(); _b < _c.length; _b++) {
                var card = _c[_b];
                var attackType = Constants_1.AttackType.BasicAttack;
                if (this.battleTurns[card.name].isReleaseSkill(turn, card.coolDown)) {
                    attackType = Constants_1.AttackType.SkillAttack;
                }
                else if (this.battleTurns[card.name].isGuard(turn, card.coolDown)) {
                    attackType = Constants_1.AttackType.Guard;
                }
                attackType = this.startRound(attackType, card, turn);
                if (attackType == Constants_1.AttackType.SkillAttack) {
                    this.battleTurns[card.name].skillCD = card.coolDown;
                }
            }
            // Count down Skill CD
            for (var _d = 0, _e = this.team.getCardByActionOrder(); _d < _e.length; _d++) {
                var card = _e[_d];
                this.battleTurns[card.name].countDownCDPerRound();
            }
        }
    };
    Battle.prototype.getPostAttackRules = function (rules) {
        var attackRules = rules.filter(function (r) { return r.isPostAttackRule(); });
        return attackRules;
    };
    Battle.prototype.getPreAttackRules = function (rules) {
        var attackRules = rules.filter(function (r) { return !r.isPostAttackRule(); });
        return attackRules;
    };
    Battle.prototype.startRound = function (attackType, card, currentTurn) {
        var buff = [];
        var enemyDebuff = [];
        var atkSupportBuff = 0;
        var additionalPostAtkRule = []; // 追擊
        var postAtkRule = []; // 反擊
        for (var _i = 0, _a = Battle.TEAM_BUFF_TYPES; _i < _a.length; _i++) {
            var key = _a[_i];
            buff[key] = 0;
        }
        for (var _b = 0, _c = Battle.ENEMY_BUFF_TYPES; _b < _c.length; _b++) {
            var key = _c[_b];
            enemyDebuff[key] = 0;
        }
        // ---------------------------攻擊前------------------------------------
        for (var _d = 0, _e = this.getPreAttackRules(this.battleTurns[card.name].rules); _d < _e.length; _d++) {
            var rule = _e[_d];
            if (!rule.isRuleCheckInBattle()) {
                continue;
            }
            if (!rule.isConditionsFulfilled(card, this.team, attackType, currentTurn)) {
                continue;
            }
            var targetNames = rule.getRuleApplyTarget(this.team, card);
            for (var _f = 0, targetNames_2 = targetNames; _f < targetNames_2.length; _f++) {
                var targetName = targetNames_2[_f];
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
                else if (rule.type == Constants_1.RuleType.cdMinus) {
                    var cooldownCount = Battle.getNumber(rule.value);
                    this.battleTurns[targetName].skillCD = this.battleTurns[targetName].skillCD - cooldownCount;
                }
                // 我方獲得技能
                else if (rule.type == Constants_1.RuleType.appendRule) {
                    newRule = rule.value;
                    newRule.isPassive = false;
                    this.battleTurns[targetName].addRule(newRule.cloneSimple());
                }
                // 敵方獲得技能
                else if (rule.type == Constants_1.RuleType.enemyAppendRule) {
                    newRule = rule.value;
                    newRule.isPassive = false;
                    var result = this.enemyBattleTurn.addRule(newRule.cloneSimple());
                }
            }
            // 減CD後可以放技能
            if (this.battleTurns[card.name].isReleaseSkill(currentTurn, card.coolDown)) {
                attackType = Constants_1.AttackType.SkillAttack;
            }
        }
        // Pre-attack
        for (var _g = 0, _h = this.getPreAttackRules(this.battleTurns[card.name].rules); _g < _h.length; _g++) {
            var rule = _h[_g];
            if (rule.isRuleCheckInBattle()) {
                continue;
            }
            if (!rule.isConditionsFulfilled(card, this.team, attackType, currentTurn)) {
                continue;
            }
            var applyCount = rule.getConditionFulfillTimes(card, this.team, attackType, currentTurn);
            for (var i = 0; i < applyCount; i++) {
                // 攻擊力增加
                if (rule.type == Constants_1.RuleType.atkUp) {
                    if (rule.value.endsWith("%")) {
                        buff[rule.type] += Battle.getNumber(rule.value);
                    }
                    else {
                        atkSupportBuff += Battle.getNumber(rule.value);
                    }
                }
                // 各種buff （普攻/必殺/造傷/下毒/治療/持續治療增加）
                else if (Battle.TEAM_BUFF_TYPES.includes(rule.type)) {
                    buff[rule.type] += Battle.getNumber(rule.value);
                }
                // 敵方Debuff （普攻/必殺/造傷）
                else if (Battle.ENEMY_BUFF_TYPES.includes(rule.type)) {
                    var isRuleAdded = this.enemyBattleTurn.addRule(rule.cloneSimple());
                }
                // 普攻追擊被動
                else if (rule.type == Constants_1.RuleType.basicAtkFollowupSkill) {
                    var newRule = rule.cloneSimple();
                    newRule.type = Constants_1.RuleType.attack;
                    newRule.turn = 1;
                    newRule.isPassive = false;
                    newRule.condition = [new Condition(Constants_1.ConditionType.isAttackType, Constants_1.AttackType.BasicAttack)];
                    additionalPostAtkRule.push(newRule);
                }
                // 我方獲得技能
                else if (rule.type == Constants_1.RuleType.appendRule) {
                    var newRule = rule.value;
                    newRule.isPassive = false;
                    this.battleTurns[card.name].addRule(newRule.cloneSimple());
                }
                // 敵方獲得技能
                else if (rule.type == Constants_1.RuleType.enemyAppendRule) {
                    var newRule = rule.value;
                    newRule.isPassive = false;
                    this.enemyBattleTurn.addRule(newRule.cloneSimple());
                }
            }
        }
        // ---------------------------敵方技能-----------------------------------
        for (var _j = 0, _k = this.getPreAttackRules(this.enemyBattleTurn.rules); _j < _k.length; _j++) {
            var rule = _k[_j];
            if (!rule.isConditionsFulfilled(card, this.team, attackType, currentTurn)) {
                continue;
            }
            // 敵方獲得技能
            if (rule.type == Constants_1.RuleType.enemyAppendRule) {
                var newRule = rule.value;
                this.enemyBattleTurn.addRule(newRule.cloneSimple());
            }
        }
        for (var _l = 0, _m = this.getPreAttackRules(this.enemyBattleTurn.rules); _l < _m.length; _l++) {
            var rule = _m[_l];
            if (!rule.isConditionsFulfilled(card, this.team, attackType, currentTurn)) {
                continue;
            }
            // 敵方buffs
            if (Battle.ENEMY_BUFF_TYPES.includes(rule.type)) {
                enemyDebuff[rule.type] += Battle.getNumber(rule.value);
            }
        }
        // ---------------------------正式攻擊------------------------------------
        if (attackType != Constants_1.AttackType.Guard) {
            var attackRule = [].concat(card.attackRule);
            if (attackType == Constants_1.AttackType.SkillAttack) {
                attackRule = [].concat(card.skillRule);
            }
            attackRule = attackRule.concat(additionalPostAtkRule);
            var hasAttacked = false;
            for (var _o = 0, attackRule_1 = attackRule; _o < attackRule_1.length; _o++) {
                var rule = attackRule_1[_o];
                if (!rule.isConditionsFulfilled(card, this.team, attackType, currentTurn)) {
                    continue;
                }
                // 攻擊/下毒/瞬補/緩補/輔助
                if (Battle.OUTPUT_TYPES.includes(rule.type)) {
                    this.attack(attackType, rule, atkSupportBuff, buff, enemyDebuff, card, currentTurn);
                    // Post attack rules
                    if (rule.type == Constants_1.RuleType.attack) {
                        if (hasAttacked)
                            continue; // 連擊只會觸發1次
                        // 我方
                        for (var _p = 0, _q = this.getPostAttackRules(this.battleTurns[card.name].rules); _p < _q.length; _p++) {
                            var postRule = _q[_p];
                            if (!postRule.isConditionsFulfilled(card, this.team, attackType, currentTurn)) {
                                continue;
                            }
                            var postTargetNames = postRule.getRuleApplyTarget(this.team, card);
                            for (var _r = 0, postTargetNames_1 = postTargetNames; _r < postTargetNames_1.length; _r++) {
                                var postTargetName = postTargetNames_1[_r];
                                if (postRule.type == Constants_1.RuleType.appendRule) {
                                    var newRule = postRule.value;
                                    newRule.isPassive = false;
                                    this.battleTurns[postTargetName].addRule(newRule.cloneSimpleChild());
                                }
                                else if (postRule.type == Constants_1.RuleType.enemyAppendRule) {
                                    var newRule = postRule.value;
                                    newRule.isPassive = false;
                                    this.enemyBattleTurn.addRule(newRule.cloneSimpleChild());
                                }
                            }
                        }
                        for (var _s = 0, _t = this.getPostAttackRules(this.battleTurns[card.name].rules); _s < _t.length; _s++) {
                            var postRule = _t[_s];
                            if (!postRule.isConditionsFulfilled(card, this.team, attackType, currentTurn)) {
                                continue;
                            }
                            var postTargetNames = postRule.getRuleApplyTarget(this.team, card);
                            for (var _u = 0, postTargetNames_2 = postTargetNames; _u < postTargetNames_2.length; _u++) {
                                var postTargetName = postTargetNames_2[_u];
                                if (Battle.TEAM_BUFF_TYPES.includes(postRule.type)) {
                                    var newRule = postRule.cloneSimpleChild();
                                    newRule.target = null;
                                    newRule.condition = null;
                                    var isRuleAdded = this.battleTurns[postTargetName].addRule(newRule);
                                    buff[postRule.type] += isRuleAdded ? Battle.getNumber(postRule.value) : 0;
                                }
                                else if (Battle.ENEMY_BUFF_TYPES.includes(postRule.type)) {
                                    var newRule = postRule.cloneSimpleChild();
                                    newRule.target = null;
                                    newRule.condition = null;
                                    var isRuleAdded = this.enemyBattleTurn.addRule(newRule);
                                    enemyDebuff[postRule.type] += isRuleAdded ? Battle.getNumber(postRule.value) : 0;
                                }
                            }
                        }
                        // 敵方
                        for (var _v = 0, _w = this.getPostAttackRules(this.enemyBattleTurn.rules); _v < _w.length; _v++) {
                            var postRule = _w[_v];
                            if (!postRule.isConditionsFulfilled(card, this.team, attackType, currentTurn)) {
                                continue;
                            }
                            // 敵方獲得技能
                            if (postRule.type == Constants_1.RuleType.enemyAppendRule) {
                                var newRule = postRule.value;
                                newRule.isPassive = false;
                                this.enemyBattleTurn.addRule(newRule.cloneSimpleChild());
                            }
                        }
                        for (var _x = 0, _y = this.getPostAttackRules(this.enemyBattleTurn.rules); _x < _y.length; _x++) {
                            var postRule = _y[_x];
                            if (!postRule.isConditionsFulfilled(card, this.team, attackType, currentTurn)) {
                                continue;
                            }
                            // 敵方buffs
                            if (Battle.ENEMY_BUFF_TYPES.includes(postRule.type)) {
                                enemyDebuff[postRule.type] += Battle.getNumber(postRule.value);
                            }
                        }
                        hasAttacked = true;
                    }
                }
                // -----各種Buff-----
                else {
                    var targetNames = rule.getRuleApplyTarget(this.team, card);
                    for (var _z = 0, targetNames_3 = targetNames; _z < targetNames_3.length; _z++) {
                        var targetName = targetNames_3[_z];
                        // -----我方Buff-----
                        // 各種buff （普攻/必殺/造傷/下毒/治療/持續治療增加）
                        if (Battle.TEAM_BUFF_TYPES.includes(rule.type)) {
                            var isRuleAdded = this.battleTurns[targetName].addRule(rule.cloneSimple());
                            buff[rule.type] += isRuleAdded ? Battle.getNumber(rule.value) : 0;
                        }
                        // -----敵方Buff-----
                        // 敵方受到各種debuff （普攻/必殺/造傷/下毒）
                        else if (Battle.ENEMY_BUFF_TYPES.includes(rule.type)) {
                            var isRuleAdded = this.enemyBattleTurn.addRule(rule.cloneSimple());
                            enemyDebuff[rule.type] += isRuleAdded ? Battle.getNumber(rule.value) : 0;
                        }
                        // -----其他能力-----
                        // 普攻追擊（追加普攻追擊被動）
                        else if (rule.type == Constants_1.RuleType.basicAtkFollowup) {
                            var newRule = rule.cloneSimple();
                            newRule.type = Constants_1.RuleType.basicAtkFollowupSkill;
                            newRule.condition = null;
                            this.battleTurns[targetName].addRule(newRule);
                        }
                        // 反擊（追加反擊被動）
                        else if (rule.type == Constants_1.RuleType.counterAttack) {
                            var newRule = rule.cloneSimple();
                            newRule.type = Constants_1.RuleType.counterAttackSkill;
                            newRule.condition = null;
                            this.battleTurns[targetName].addRule(newRule);
                        }
                        // 減CD
                        else if (rule.type == Constants_1.RuleType.cdMinus) {
                            var cooldownCount = Battle.getNumber(rule.value);
                            this.battleTurns[targetName].skillCD = this.battleTurns[targetName].skillCD - cooldownCount;
                        }
                        // 我方獲得技能
                        else if (rule.type == Constants_1.RuleType.appendRule) {
                            var newRule = rule.value;
                            this.battleTurns[targetName].addRule(newRule.cloneSimple());
                        }
                        // 敵方獲得技能
                        else if (rule.type == Constants_1.RuleType.enemyAppendRule) {
                            var newRule = rule.value;
                            this.enemyBattleTurn.addRule(newRule.cloneSimple());
                        }
                    }
                }
            }
        }
        // ---------------------------反擊------------------------------------
        if (this.counterAttackCount > 0) {
            var postAtkRule = this.battleTurns[card.name].rules.filter(function (e) { return e.type == Constants_1.RuleType.counterAttackSkill; });
            for (var _0 = 0, postAtkRule_1 = postAtkRule; _0 < postAtkRule_1.length; _0++) {
                var rule = postAtkRule_1[_0];
                var newRule = rule.cloneSimple();
                newRule.type = Constants_1.RuleType.attack;
                newRule.turn = 1;
                newRule.maxCount = Math.min(this.counterAttackCount, rule.maxCount);
                this.attack(Constants_1.AttackType.SkillAttack, newRule, atkSupportBuff, buff, enemyDebuff, card, currentTurn);
                rule.turn = 0; // consume
            }
        }
        this.battleTurns[card.name].action[currentTurn] = attackType;
        return attackType;
    };
    Battle.prototype.attack = function (attackType, rule, atkSupportBuff, buff, enemyDebuff, card, currentTurn) {
        var atk = card.getAtk();
        var hp = card.getHp();
        // 輔助（只用基礎攻擊力）
        if (rule.type == Constants_1.RuleType.support) {
            var support = Math.floor(atk * Battle.getNumber(rule.value));
            var targetNames = rule.getRuleApplyTarget(this.team, card);
            for (var _i = 0, targetNames_4 = targetNames; _i < targetNames_4.length; _i++) {
                var targetName = targetNames_4[_i];
                var newRule = rule.cloneSimple();
                newRule.type = Constants_1.RuleType.atkUp;
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
            if (rule.valueBy == Constants_1.RuleValueByType.hp) {
                outputVal = Math.floor((Math.floor(hp * (1 + buff[Constants_1.RuleType.hpUp]))) * Battle.getNumber(rule.value));
            }
            else {
                outputVal = Math.floor((Math.floor(atk * (1 + buff[Constants_1.RuleType.atkUp])) + atkSupportBuff) * Battle.getNumber(rule.value));
            }
            // 我方buff
            if (attackType == Constants_1.AttackType.SkillAttack && [Constants_1.RuleType.attack, Constants_1.RuleType.heal].includes(rule.type)) {
                outputVal = Math.floor(outputVal * (1 + buff[Constants_1.RuleType.skillAtkUp]));
            }
            if (attackType == Constants_1.AttackType.BasicAttack && [Constants_1.RuleType.attack, Constants_1.RuleType.heal].includes(rule.type)) {
                outputVal = Math.floor(outputVal * (1 + buff[Constants_1.RuleType.basicAtkUp]));
            }
            if (rule.type == Constants_1.RuleType.attack) {
                outputVal = Math.floor(outputVal * (1 + buff[Constants_1.RuleType.allAtkUp]));
            }
            else if (rule.type == Constants_1.RuleType.poisonAttack) {
                outputVal = Math.floor(outputVal * (1 + buff[Constants_1.RuleType.poisonAtkUp]));
            }
            else if (rule.type == Constants_1.RuleType.heal) {
                outputVal = Math.floor(outputVal * (1 + buff[Constants_1.RuleType.healUp]));
            }
            else if (rule.type == Constants_1.RuleType.continueHeal) {
                outputVal = Math.floor(outputVal * (1 + buff[Constants_1.RuleType.continueHealUp]));
            }
            for (var i = 0; i < rule.turn; i++) {
                for (var j = 0; j < rule.maxCount; j++) {
                    this.battleTurns[card.name].outputs[rule.type][currentTurn + i] = (this.battleTurns[card.name].outputs[rule.type][currentTurn + i] || 0) + outputVal;
                }
            }
            // 敵方buff
            if (rule.type == Constants_1.RuleType.attack || rule.type == Constants_1.RuleType.poisonAttack) {
                var enemyDamageVal = outputVal;
                if (attackType == Constants_1.AttackType.SkillAttack && rule.type == Constants_1.RuleType.attack) {
                    enemyDamageVal = Math.floor(enemyDamageVal * (1 + enemyDebuff[Constants_1.RuleType.enemySkillAtkUp]));
                }
                if (attackType == Constants_1.AttackType.BasicAttack && rule.type == Constants_1.RuleType.attack) {
                    enemyDamageVal = Math.floor(enemyDamageVal * (1 + enemyDebuff[Constants_1.RuleType.enemyBasicAtkUp]));
                }
                if (rule.type == Constants_1.RuleType.poisonAttack) {
                    enemyDamageVal = Math.floor(enemyDamageVal * (1 + enemyDebuff[Constants_1.RuleType.enemyPoisonAtkUp]));
                }
                if (rule.type == Constants_1.RuleType.attack || rule.type == Constants_1.RuleType.poisonAttack) {
                    enemyDamageVal = Math.floor(enemyDamageVal * (1 + enemyDebuff[Constants_1.RuleType.enemyAllAtkUp]));
                }
                for (var i = 0; i < rule.turn; i++) {
                    for (var j = 0; j < rule.maxCount; j++) {
                        this.battleTurns[card.name].enemyDamage[rule.type][currentTurn + i] = (this.battleTurns[card.name].enemyDamage[rule.type][currentTurn + i] || 0) + enemyDamageVal;
                    }
                }
            }
        }
    };
    Battle.prototype.getTurnValue = function (cardname, turn) {
        var card = this.team.getCard(cardname);
        var battleTurn = this.battleTurns[cardname];
        var output = 0;
        var ruleType = [];
        if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ALL) {
            if (card.class == Constants_1.Class.Striker || card.class == Constants_1.Class.Guardian || card.class == Constants_1.Class.Saboteur) {
                ruleType.push(Constants_1.RuleType.attack);
                ruleType.push(Constants_1.RuleType.poisonAttack);
            }
            else if (card.class == Constants_1.Class.Healer) {
                ruleType.push(Constants_1.RuleType.heal);
                ruleType.push(Constants_1.RuleType.continueHeal);
            }
            else if (card.class == Constants_1.Class.Support) {
                ruleType.push(Constants_1.RuleType.support);
            }
        }
        else if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_ATTACK) {
            ruleType.push(Constants_1.RuleType.attack);
        }
        else if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_POISON) {
            ruleType.push(Constants_1.RuleType.poisonAttack);
        }
        else if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_HEAL) {
            ruleType.push(Constants_1.RuleType.heal);
            ruleType.push(Constants_1.RuleType.continueHeal);
        }
        else if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_SUPPORT) {
            ruleType.push(Constants_1.RuleType.support);
        }
        else if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_DAMAGE) {
            ruleType.push(Constants_1.RuleType.attack);
            ruleType.push(Constants_1.RuleType.poisonAttack);
        }
        for (var _i = 0, ruleType_1 = ruleType; _i < ruleType_1.length; _i++) {
            var type = ruleType_1[_i];
            if (this.printEnemeyOption && (type == Constants_1.RuleType.attack || type == Constants_1.RuleType.poisonAttack)) {
                var enemyDamage = battleTurn.enemyDamage[type][turn] | 0;
                if (this.enemyElement != Constants_1.Element.NA && type == Constants_1.RuleType.attack) {
                    enemyDamage = Math.floor(enemyDamage * Battle.getElementalBuff(card.element, this.enemyElement));
                }
                output += enemyDamage;
            }
            else {
                output += battleTurn.outputs[type][turn] | 0;
            }
        }
        return output;
    };
    Battle.prototype.getTotalValue = function (cardname, outputOption) {
        var card = this.team.getCard(cardname);
        var battleTurn = this.battleTurns[cardname];
        var output = 0;
        if (outputOption == null) {
            outputOption = this.printOutputOption;
        }
        var ruleType = [];
        if (outputOption == Battle.PRINT_OUTPUT_OPTION.ALL) {
            if (card.class == Constants_1.Class.Striker || card.class == Constants_1.Class.Guardian || card.class == Constants_1.Class.Saboteur) {
                ruleType.push(Constants_1.RuleType.attack);
                ruleType.push(Constants_1.RuleType.poisonAttack);
            }
            else if (card.class == Constants_1.Class.Healer) {
                ruleType.push(Constants_1.RuleType.heal);
                ruleType.push(Constants_1.RuleType.continueHeal);
            }
            else if (card.class == Constants_1.Class.Support) {
                ruleType.push(Constants_1.RuleType.support);
            }
        }
        else if (outputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_ATTACK) {
            ruleType.push(Constants_1.RuleType.attack);
        }
        else if (outputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_POISON) {
            ruleType.push(Constants_1.RuleType.poisonAttack);
        }
        else if (outputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_HEAL) {
            ruleType.push(Constants_1.RuleType.heal);
            ruleType.push(Constants_1.RuleType.continueHeal);
        }
        else if (outputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_SUPPORT) {
            ruleType.push(Constants_1.RuleType.support);
        }
        else if (outputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_DAMAGE) {
            ruleType.push(Constants_1.RuleType.attack);
            ruleType.push(Constants_1.RuleType.poisonAttack);
        }
        for (var turn = 1; turn <= this.turns; turn++) {
            for (var _i = 0, ruleType_2 = ruleType; _i < ruleType_2.length; _i++) {
                var type = ruleType_2[_i];
                if (this.printEnemeyOption && (type == Constants_1.RuleType.attack || type == Constants_1.RuleType.poisonAttack)) {
                    var enemyDamage = battleTurn.enemyDamage[type][turn] | 0;
                    if (this.enemyElement != Constants_1.Element.NA && type == Constants_1.RuleType.attack) {
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
    };
    Battle.prototype.getTeamTotalValue = function () {
        var output = 0;
        var printOutputOption = this.printOutputOption;
        if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ALL) {
            printOutputOption = Battle.PRINT_OUTPUT_OPTION.ONLY_DAMAGE;
        }
        for (var _i = 0, _a = this.team.cards; _i < _a.length; _i++) {
            var card = _a[_i];
            output += this.getTotalValue(card.name, printOutputOption);
        }
        return output;
    };
    Battle.prototype.getTeamTotalDamage = function () {
        var output = 0;
        for (var _i = 0, _a = this.team.cards; _i < _a.length; _i++) {
            var card = _a[_i];
            output += this.getTotalValue(card.name, Battle.PRINT_OUTPUT_OPTION.ONLY_DAMAGE);
        }
        return output;
    };
    Battle.prototype.getTurnAction = function (cardname, turn) {
        return this.battleTurns[cardname].action[turn];
    };
    Battle.getElementalBuff = function (e1, e2) {
        if ((e1 == Constants_1.Element.Fire && e2 == Constants_1.Element.Water) || (e1 == Constants_1.Element.Water && e2 == Constants_1.Element.Wood) || (e1 == Constants_1.Element.Wood && e2 == Constants_1.Element.Fire)) {
            return 0.8;
        }
        else if ((e1 == Constants_1.Element.Fire && e2 == Constants_1.Element.Wood) || (e1 == Constants_1.Element.Water && e2 == Constants_1.Element.Fire) || (e1 == Constants_1.Element.Wood && e2 == Constants_1.Element.Water)
            || (e1 == Constants_1.Element.Light && e2 == Constants_1.Element.Dark) || (e1 == Constants_1.Element.Dark && e2 == Constants_1.Element.Light)) {
            return 1.2;
        }
        return 1;
    };
    Battle.prototype.printResult = function () {
        console.info('角色\t' + this.team.cards.map(function (e) { return e.name; }).join('\t'));
        console.info('星數\t' + this.team.cards.map(function (e) { return e.star; }).join('\t'));
        console.info('HP\t' + this.team.cards.map(function (e) { return e.getHp(); }).join('\t'));
        console.info('ATK\t' + this.team.cards.map(function (e) { return e.getAtk(); }).join('\t'));
        console.info('普攻\t' + this.team.cards.map(function (e) { return e.attackRule; }).join('\t'));
        console.info('必殺\t' + this.team.cards.map(function (e) { return e.skillRule; }).join('\t'));
        console.info('3星\t' + this.team.cards.map(function (e) { return e.star3Rule; }).join('\t'));
        console.info('5星\t' + this.team.cards.map(function (e) { return e.star5Rule; }).join('\t'));
        console.info('潛6\t' + this.team.cards.map(function (e) { return e.pot6Rule; }).join('\t'));
        console.info();
        var totalOutput = [];
        var totalEnemyDamage = [];
        for (var _i = 0, _a = this.team.cards; _i < _a.length; _i++) {
            var card = _a[_i];
            totalOutput[card.name] = 0;
            totalEnemyDamage[card.name] = 0;
        }
        for (var turn = 1; turn <= this.turns; turn++) {
            var s = turn + '\t';
            for (var _b = 0, _c = this.team.cards; _b < _c.length; _b++) {
                var card = _c[_b];
                s += this.getTurnValue(card.name, turn) + '\t';
            }
            console.info(s);
        }
        var summary = '總計\t';
        for (var _d = 0, _e = this.team.cards; _d < _e.length; _d++) {
            var card = _e[_d];
            summary += this.getTotalValue(card.name) + '\t';
        }
        console.info(summary);
        console.info('隊伍總數\t' + this.getTeamTotalValue());
    };
    Battle.getNumber = function (val) {
        var num = 0;
        if (typeof val == 'string' && val.endsWith("%")) {
            val = val.substring(0, val.indexOf("%"));
            num = +val.trim() / 100;
        }
        else if (typeof val == 'string' || typeof val == 'number') {
            num = +val;
        }
        return num;
    };
    Battle.PRINT_OUTPUT_OPTION = { ALL: 'All', ONLY_DAMAGE: 'OnlyDamage', ONLY_ATTACK: 'OnlyAttack', ONLY_SUPPORT: 'OnlySupport', ONLY_HEAL: 'OnlyHeal', ONLY_POISON: 'OnlyPoison' };
    Battle.OUTPUT_TYPES = [Constants_1.RuleType.attack, Constants_1.RuleType.poisonAttack, Constants_1.RuleType.heal, Constants_1.RuleType.continueHeal, Constants_1.RuleType.support];
    Battle.TEAM_BUFF_TYPES = [Constants_1.RuleType.atkUp, Constants_1.RuleType.hpUp, Constants_1.RuleType.basicAtkUp, Constants_1.RuleType.skillAtkUp, Constants_1.RuleType.allAtkUp, Constants_1.RuleType.poisonAtkUp, Constants_1.RuleType.healUp, Constants_1.RuleType.continueHealUp];
    Battle.ENEMY_BUFF_TYPES = [Constants_1.RuleType.enemyBasicAtkUp, Constants_1.RuleType.enemySkillAtkUp, Constants_1.RuleType.enemyAllAtkUp, Constants_1.RuleType.enemyPoisonAtkUp];
    return Battle;
}());
exports.Battle = Battle;
var Team = /** @class */ (function () {
    function Team() {
        this.cards = [];
        this.position = [];
        this.actionOrder = [];
    }
    Team.prototype.reset = function () {
        this.cards = [];
        this.position = [];
        this.actionOrder = [];
    };
    Team.prototype.addCard = function (card) {
        if (card != null) {
            this.cards.push(card);
        }
        this.position[this.cards.length] = card.name;
        this.actionOrder[this.cards.length - 1] = card.name;
    };
    Team.prototype.updateActionOrder = function (names) {
        this.actionOrder = names;
    };
    Team.prototype.getCard = function (name) {
        var result = this.cards.filter(function (e) { return e.name == name; });
        return result.length > 0 ? result[0] : null;
    };
    Team.prototype.getCardByPos = function (posArr) {
        var cards = [];
        for (var _i = 0, posArr_1 = posArr; _i < posArr_1.length; _i++) {
            var pos = posArr_1[_i];
            if (this.cards.length >= pos) {
                cards.push(this.getCard(this.position[pos]));
            }
        }
        return cards;
    };
    Team.prototype.getCardByActionOrder = function () {
        var cards = [];
        for (var _i = 0, _a = this.actionOrder; _i < _a.length; _i++) {
            var name = _a[_i];
            cards.push(this.getCard(name));
        }
        return cards;
    };
    Team.prototype.getCharCount = function (char) {
        return this.cards.filter(function (e) { return e.char == char; }).length;
    };
    Team.prototype.hasChar = function (char) {
        return this.getCharCount(char) > 0;
    };
    Team.prototype.getClassCount = function (cardClass) {
        return this.cards.filter(function (e) { return e.class == cardClass; }).length;
    };
    Team.prototype.hasClass = function (cardClass) {
        return this.getClassCount(cardClass) > 0;
    };
    return Team;
}());
exports.Team = Team;
var RuleTarget = /** @class */ (function () {
    function RuleTarget(type, value, exceptType, exceptValue) {
        if (type === void 0) { type = Constants_1.TargetType.self; }
        if (value === void 0) { value = null; }
        if (exceptType === void 0) { exceptType = null; }
        if (exceptValue === void 0) { exceptValue = null; }
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
    RuleTarget.loadTarget = function (_a) {
        var _b = _a.type, type = _b === void 0 ? Constants_1.TargetType.self : _b, _c = _a.value, value = _c === void 0 ? null : _c, _d = _a.exceptType, exceptType = _d === void 0 ? null : _d, _e = _a.exceptValue, exceptValue = _e === void 0 ? null : _e;
        var target = new RuleTarget(type, value, exceptType, exceptValue);
        return target;
    };
    RuleTarget.prototype.getTarget = function (type, value, team, card) {
        var cardNames = [];
        if (type == null) {
            // do nothing
        }
        else if (type == Constants_1.TargetType.self) {
            cardNames.push(card.name);
        }
        else if (type == Constants_1.TargetType.all) {
            cardNames = Object.values(team.cards).map(function (e) { return e.name; });
        }
        else if (type == Constants_1.TargetType.isClass) {
            var targetClasses = value;
            cardNames = Object.values(team.cards).filter(function (e) { return targetClasses.includes(e.class); }).map(function (e) { return e.name; });
        }
        else if (type == Constants_1.TargetType.isChar) {
            var targetChars = value;
            cardNames = Object.values(team.cards).filter(function (e) { return targetChars.includes(e.char); }).map(function (e) { return e.name; });
        }
        else if (type == Constants_1.TargetType.isPosition) {
            var targetPos = value;
            var targetCards = team.getCardByPos(targetPos);
            cardNames = targetCards.map(function (e) { return e.name; });
        }
        return cardNames;
    };
    RuleTarget.prototype.getIncludeTarget = function (team, card) {
        return this.getTarget(this.type, this.value, team, card);
    };
    RuleTarget.prototype.getExcludeTarget = function (team, card) {
        return this.getTarget(this.exceptType, this.exceptValue, team, card);
    };
    RuleTarget.prototype.getTargetCard = function (team, card) {
        var includeNames = this.getIncludeTarget(team, card);
        var excludeNames = this.getExcludeTarget(team, card);
        return includeNames.filter(function (e) { return !excludeNames.includes(e); });
    };
    return RuleTarget;
}());
exports.RuleTarget = RuleTarget;
var Rule = /** @class */ (function () {
    function Rule(_a) {
        var _b = _a.id, id = _b === void 0 ? null : _b, _c = _a.isPassive, isPassive = _c === void 0 ? false : _c, _d = _a.type, type = _d === void 0 ? Constants_1.RuleType.attack : _d, value = _a.value, _e = _a.valueBy, valueBy = _e === void 0 ? Constants_1.RuleValueByType.atk : _e, _f = _a.turn, turn = _f === void 0 ? 50 : _f, _g = _a.maxCount, maxCount = _g === void 0 ? 1 : _g, _h = _a.condition, condition = _h === void 0 ? null : _h, _j = _a.target, target = _j === void 0 ? null : _j;
        this.target = null;
        this.condition = null;
        this.id = id == null ? Rule.createId() : id;
        this.isPassive = isPassive;
        if (typeof type == 'string') {
            var idx = Object.values(Constants_1.RuleType).indexOf(type);
            this.type = Constants_1.RuleType[Object.keys(Constants_1.RuleType)[idx]];
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
    Rule.createId = function () {
        return Rule.idCounter++;
    };
    Rule.prototype.toString = function () {
        var s = this.type + ' ' + this.value;
        if (this.turn < 50 && this.turn > 1) {
            s += '（' + this.turn + '回合）';
        }
        if (this.maxCount > 1) {
            s += '（最多' + this.maxCount + '層）';
        }
        return s;
    };
    Rule.prototype.clone = function () {
        var cloneRule = new Rule({ id: this.id, isPassive: this.isPassive, type: this.type, value: this.value, valueBy: this.valueBy,
            turn: this.turn, maxCount: this.maxCount, condition: this.condition, target: this.target });
        if (this.condition != null) {
            cloneRule.condition = this.condition;
        }
        return cloneRule;
    };
    Rule.prototype.cloneSimpleChild = function () {
        var cloneRule = this.clone();
        cloneRule.id += Rule.CHILD_RULE_ID_INCREMENT;
        return cloneRule;
    };
    // Not passive
    Rule.prototype.cloneSimple = function () {
        var cloneRule = new Rule({ id: this.id, isPassive: false, type: this.type, value: this.value, valueBy: this.valueBy,
            turn: this.turn, maxCount: this.maxCount, condition: this.condition, target: this.target });
        if (this.condition != null) {
            cloneRule.condition = this.condition;
        }
        return cloneRule;
    };
    Rule.prototype.isConditionsFulfilled = function (card, team, attackType, turn) {
        if (this.condition == null || this.condition.length == 0) {
            return true;
        }
        var isFulfilled = true;
        for (var _i = 0, _a = this.condition; _i < _a.length; _i++) {
            var condition = _a[_i];
            isFulfilled = isFulfilled && condition.isFulfilled(card, team, attackType, turn);
        }
        return isFulfilled;
    };
    Rule.prototype.getConditionFulfillTimes = function (card, team, attackType, turn) {
        if (this.condition == null || this.condition.length == 0 || this.maxCount == null) {
            return 1;
        }
        var count = this.maxCount;
        for (var _i = 0, _a = this.condition; _i < _a.length; _i++) {
            var condition = _a[_i];
            count = Math.min(count, condition.getFulfillTimes(card, team, attackType, turn));
        }
        return count;
    };
    Rule.prototype.isRuleCheckInBattle = function () {
        if (this.condition == null || this.condition.length == 0) {
            return false;
        }
        for (var _i = 0, _a = this.condition; _i < _a.length; _i++) {
            var condition = _a[_i];
            if (Condition.CHECK_IN_BATTLE_LIST.includes(condition.type)) {
                return true;
            }
        }
        return false;
    };
    Rule.prototype.isPostAttackRule = function () {
        if (this.condition == null || this.condition.length == 0) {
            return false;
        }
        for (var _i = 0, _a = this.condition; _i < _a.length; _i++) {
            var condition = _a[_i];
            if (condition.type == Constants_1.ConditionType.isAttack || condition.type == Constants_1.ConditionType.enemyIsAttacked) {
                return true;
            }
        }
        return false;
    };
    Rule.prototype.getRuleApplyTarget = function (team, card) {
        var cardNames = [];
        if (this.target == null) {
            cardNames.push(card.name); //self
        }
        else {
            cardNames = this.target.getTargetCard(team, card);
        }
        return cardNames;
    };
    Rule.loadRule = function (_a) {
        var _b = _a.isPassive, isPassive = _b === void 0 ? false : _b, _c = _a.type, type = _c === void 0 ? Constants_1.RuleType.attack : _c, value = _a.value, _d = _a.valueBy, valueBy = _d === void 0 ? Constants_1.RuleValueByType.atk : _d, _e = _a.turn, turn = _e === void 0 ? 1 : _e, _f = _a.maxCount, maxCount = _f === void 0 ? 1 : _f, _g = _a.condition, condition = _g === void 0 ? null : _g, _h = _a.target, target = _h === void 0 ? null : _h;
        if (type == Constants_1.RuleType.appendRule || type == Constants_1.RuleType.enemyAppendRule) {
            value = Rule.loadRule(value);
        }
        var conditionArr = null;
        if (condition != null) {
            conditionArr = [];
            if (Array.isArray(condition)) {
                for (var _i = 0, condition_1 = condition; _i < condition_1.length; _i++) {
                    var item = condition_1[_i];
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
    };
    Rule.loadSimpleRule = function (_a) {
        var _b = _a.type, type = _b === void 0 ? Constants_1.RuleType.attack : _b, value = _a.value, _c = _a.valueBy, valueBy = _c === void 0 ? Constants_1.RuleValueByType.atk : _c, _d = _a.turn, turn = _d === void 0 ? 1 : _d, _e = _a.maxCount, maxCount = _e === void 0 ? 1 : _e, _f = _a.condition, condition = _f === void 0 ? null : _f, _g = _a.target, target = _g === void 0 ? null : _g;
        var isPassive = false;
        return Rule.loadRule({ isPassive: isPassive, type: type, value: value, valueBy: valueBy, turn: turn, maxCount: maxCount, condition: condition, target: target });
    };
    Rule.loadPermRule = function (_a) {
        var _b = _a.type, type = _b === void 0 ? Constants_1.RuleType.attack : _b, value = _a.value, _c = _a.valueBy, valueBy = _c === void 0 ? Constants_1.RuleValueByType.atk : _c, _d = _a.turn, turn = _d === void 0 ? ALWAYS_EFFECTIVE : _d, _e = _a.maxCount, maxCount = _e === void 0 ? 1 : _e, _f = _a.condition, condition = _f === void 0 ? null : _f, _g = _a.target, target = _g === void 0 ? null : _g;
        var isPassive = true;
        return Rule.loadRule({ isPassive: isPassive, type: type, value: value, valueBy: valueBy, turn: turn, maxCount: maxCount, condition: condition, target: target });
    };
    Rule.idCounter = 0;
    Rule.CHILD_RULE_ID_INCREMENT = 300000;
    return Rule;
}());
exports.Rule = Rule;
var Condition = /** @class */ (function () {
    function Condition(type, value) {
        this.type = type;
        this.value = value;
    }
    Condition.prototype.isFulfilled = function (card, team, charAttackType, currentTurn) {
        if (this.type == Constants_1.ConditionType.hasChar || this.type == Constants_1.ConditionType.charCount) {
            return team.hasChar(this.value.toString());
        }
        else if (this.type == Constants_1.ConditionType.hasClass || this.type == Constants_1.ConditionType.classCount) {
            return team.hasClass(this.value);
        }
        else if (this.type == Constants_1.ConditionType.hpHigher || this.type == Constants_1.ConditionType.hpLower) {
            return Condition.IS_HP_FULFILL;
        }
        else if (this.type == Constants_1.ConditionType.isAttackType) {
            return this.value == charAttackType;
        }
        else if (this.type == Constants_1.ConditionType.isAttack) {
            return charAttackType == Constants_1.AttackType.BasicAttack || charAttackType == Constants_1.AttackType.SkillAttack;
        }
        else if (this.type == Constants_1.ConditionType.everyTurn) {
            return ((currentTurn - 1) % this.value) == 0;
        }
        else if (this.type == Constants_1.ConditionType.atTurn) {
            return this.value == currentTurn;
        }
        else if (this.type == Constants_1.ConditionType.enemyIsAttacked) {
            return charAttackType == Constants_1.AttackType.BasicAttack || charAttackType == Constants_1.AttackType.SkillAttack;
        }
        else if (this.type == Constants_1.ConditionType.enemyIsAttackByChar) {
            return this.value == card.char;
        }
        else if (this.type == Constants_1.ConditionType.enemyIsAttackByClass) {
            return this.value == card.class;
        }
        return false;
    };
    Condition.prototype.getFulfillTimes = function (card, team, charAttackType, currentTurn) {
        if (this.type == Constants_1.ConditionType.charCount) {
            return team.getCharCount((this.value.toString()));
        }
        else if (this.type == Constants_1.ConditionType.classCount) {
            return team.getClassCount(this.value);
        }
        else if (this.isFulfilled(card, team, charAttackType, currentTurn)) {
            return 1;
        }
        return 0;
    };
    // can only check after battle start
    Condition.CHECK_IN_BATTLE_LIST = [Constants_1.ConditionType.isAttackType, Constants_1.ConditionType.isAttack, Constants_1.ConditionType.everyTurn, Constants_1.ConditionType.atTurn];
    Condition.IS_HP_FULFILL = true;
    return Condition;
}());
exports.Condition = Condition;
//# sourceMappingURL=BattleSystem.js.map