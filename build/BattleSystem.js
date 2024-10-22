import { Class, Element, RuleType, AttackType, ConditionType, ActionPattern, RuleValueByType, TurnActionType, CounterAttackMode } from './Constants.js';
import { EnemyCard } from './Card.js';
import { Rule, RuleTarget, Condition } from './CardRule.js';
import { RuleHelper } from './util/RuleHelper.js';
import { LogRule } from './LogRule.js';
import { Util } from './util/Util.js';
export class Battle {
    constructor(team, turns = 13) {
        this.turns = 13;
        this.currentTurn = 0;
        this.battleTurns = [];
        this.cardHpUp = [];
        this.enemyElement = Element.NA;
        this.enemylockHpTurn = [];
        this.isRuleLogAddedPerTurn = false;
        this.counterAttackCount = 0;
        this.counterAttackMode = CounterAttackMode.everyTurn;
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
        this.enemylockHpTurn = [];
        for (var card of this.team.cards) {
            card.initSkill();
            card.phase = [];
            this.battleTurns[card.name] = new BattleTurn(card.name);
            this.battleTurns[card.name].skillCD = card.coolDown;
            for (var key of Battle.OUTPUT_TYPES) {
                this.battleTurns[card.name].outputs[key] = [];
                this.battleTurns[card.name].enemyDamage[key] = [];
            }
            for (var i = 0; i <= this.turns; i++) {
                this.battleTurns[card.name].ruleLog[i] = [];
            }
        }
        for (var card of this.team.cards) {
            this.initBattleRules(this.team, card);
            // this.battleTurns[card.name].setActionPattern(this.turns, card);
        }
        for (var card of this.team.cards) {
            var hpUp = this.battleTurns[card.name].rules.filter((r) => r.type == RuleType.hpUp)
                .filter((r) => r.isConditionsFulfilled(card, this, TurnActionType.none, AttackType.None))
                .map((r) => Util.getPercentNumber(r.value))
                .reduce((sum, e) => sum + e, 0);
            this.cardHpUp[card.name] = hpUp;
        }
        if (this.enemyCard != null) {
            this.enemyCard.currentHp = 1;
            this.enemyCard.remainHp = this.enemyCard.hp;
            this.enemyCard.lowestHp = this.enemyCard.hp;
            this.enemyCard.phase = [];
            this.enemyKilledTurn = 0;
            this.enemyCard.hpLock.sort(function (a, b) {
                return a.localeCompare(b, undefined, {
                    numeric: true,
                    sensitivity: 'base'
                });
            }).reverse();
            this.enemyCard.battleHpLock = [...this.enemyCard.hpLock];
            this.battleTurns[this.enemyCard.name] = this.enemyBattleTurn;
            if (this.enemyCard.star3Rule.length > 0) {
                this.initBattleRules(this.team, this.enemyCard);
            }
        }
    }
    getCardHpUp(cardname) {
        return this.cardHpUp[cardname];
    }
    getCardActualHp(cardname) {
        var hpUp = this.cardHpUp[cardname];
        var card = this.team.cards.filter(e => e.name == cardname)[0];
        return Math.floor(card.getHp() * (1 + hpUp / 100));
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
        if (card.rarity == 'SSR' || card.rarity == 'SR') {
            if (card.potential >= 6)
                toAddRules = toAddRules.concat(card.pot6Rule);
            if (card.potential >= 12)
                toAddRules = toAddRules.concat(card.pot12Rule);
        }
        else {
            if (card.potential >= 3)
                toAddRules = toAddRules.concat(card.pot6Rule);
            if (card.potential >= 6)
                toAddRules = toAddRules.concat(card.pot12Rule);
        }
        toAddRules = toAddRules.filter(e => !Battle.UNUSED_RULE_TYPES.has(e.type));
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
            this.currentTurn = turn;
            // Clear rules
            for (var card of this.team.getCardByActionOrder()) {
                this.battleTurns[card.name].clearRulePerRound();
            }
            this.enemyBattleTurn.clearRulePerRound();
            // Before round
            this.beforeRound(AttackType.None, this.team.getCardByActionOrder());
            // Attack
            for (var card of this.team.getCardByActionOrder()) {
                var attackType = AttackType.BasicAttack;
                if (this.battleTurns[card.name].isReleaseSkill(turn, card.coolDown)) {
                    attackType = AttackType.SkillAttack;
                }
                else if (this.battleTurns[card.name].isGuard(turn, card.coolDown)) {
                    attackType = AttackType.Guard;
                }
                this.startRoundPerCard(attackType, card);
            }
            // Before end turn (eg. counter-attack, poison, continuos heal...)
            this.endRound(AttackType.None, this.team.getCardByActionOrder());
            // Count down Skill CD
            for (var card of this.team.getCardByActionOrder()) {
                this.battleTurns[card.name].countDownCDPerRound();
            }
            if (this.enemyCard != null && this.enemyKilledTurn <= 0 && this.enemyCard.remainHp <= 0) {
                this.enemyKilledTurn = turn;
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
    isEnemyHpLockTurn(turn) {
        return this.enemylockHpTurn.includes(turn);
    }
    damageToEnemy(damage, isPoison = false) {
        if (this.enemyCard == null || this.enemyCard.remainHp <= 0) {
            return;
        }
        // TODO: 防禦狀態
        // 護盾
        if (RuleHelper.hasShield(this.enemyBattleTurn.rules)) {
            var shields = RuleHelper.getBuffRules(this.enemyBattleTurn.rules, RuleType.shieldState);
            for (var shield of shields) {
                var shieldVal = Util.getNumber(shield.value);
                if (shieldVal > damage) {
                    shield.value = '' + (shieldVal - damage);
                    damage = 0;
                    break;
                }
                else {
                    damage = damage - shieldVal;
                    shield.value = '0';
                }
            }
        }
        if (damage > 0) {
            this.enemyCard.minusRemainHp(damage);
        }
    }
    beforeRound(attackType, cards) {
        this.currentTurnAction = TurnActionType.beforeTurn;
        // ---------------------------每回合剛開始------------------------------------
        // 處理每個人各種回合開始被動，例：每n回合、第n回合
        for (var card of cards) {
            var preAttackRules = this.battleTurns[card.name].rules.filter((e) => e.isBeforeRoundRule());
            for (var rule of preAttackRules) {
                this.addRuleToTargets(rule, card, attackType);
            }
            preAttackRules = this.battleTurns[card.name].rules.filter((e) => e.isBeforeRoundRule());
            for (var rule of preAttackRules) {
                this.processRule(rule, card, attackType);
                this.addBuffToTargets(rule, card, attackType);
            }
        }
        // 敵方
        preAttackRules = this.enemyBattleTurn.rules.filter((e) => e.isBeforeRoundRule());
        for (var rule of preAttackRules) {
            this.addRuleToTargets(rule, card, attackType);
            this.addBuffToTargets(rule, card, attackType);
        }
    }
    startRoundPerCard(attackType, card) {
        this.currentTurnAction = TurnActionType.beforeTurn;
        this.isRuleLogAddedPerTurn = false;
        var postRuleToProcess = [];
        var enemyPostRuleToProcess = [];
        // ---------------------------每個人攻擊前------------------------------------
        var preAttackRules = this.battleTurns[card.name].rules.filter((e) => e.isPreAttackRule());
        for (var rule of preAttackRules) {
            this.addRuleToTargets(rule, card, attackType);
        }
        preAttackRules = this.battleTurns[card.name].rules.filter((e) => e.isPreAttackRule());
        for (var rule of preAttackRules) {
            this.processRule(rule, card, attackType);
            this.addBuffToTargets(rule, card, attackType);
        }
        // 敵方
        preAttackRules = this.enemyBattleTurn.rules.filter((e) => e.isPreAttackRule());
        for (var rule of preAttackRules) {
            this.addRuleToTargets(rule, card, attackType);
            this.addBuffToTargets(rule, card, attackType);
        }
        // ---------------------------正式攻擊------------------------------------
        if (attackType == AttackType.Guard) {
            var logRules = this.filterBuffsForLog(this.battleTurns[card.name].rules);
            for (var buff of logRules) {
                var applyCount = buff.getConditionFulfillTimes(card, this, TurnActionType.guard, attackType);
                if (applyCount > 0) {
                    this.battleTurns[card.name].addRuleLog(this.currentTurn, buff, applyCount);
                }
            }
            logRules = this.filterBuffsForLog(this.enemyBattleTurn.rules, true);
            for (var buff of logRules) {
                var applyCount = buff.getConditionFulfillTimes(card, this, TurnActionType.guard, attackType);
                if (applyCount > 0) {
                    this.battleTurns[card.name].addRuleLog(this.currentTurn, buff, applyCount);
                }
            }
            this.isRuleLogAddedPerTurn = true;
            this.battleTurns[card.name].action[this.currentTurn] = attackType;
            return attackType;
        }
        this.currentTurnAction = TurnActionType.beforeAction;
        var attackRule = [].concat(card.attackRule);
        if (attackType == AttackType.SkillAttack) {
            attackRule = [].concat(card.skillRule);
            this.battleTurns[card.name].skillCD = card.coolDown;
        }
        var hasProcessedEnemyPostAttack = false;
        var hasAttackEnemyAction = false;
        for (var rule of attackRule) {
            var hasAttackEnemy = false;
            if (Battle.OUTPUT_TYPES.has(rule.type)) {
                var hasActionDone = this.attack(attackType, rule, card);
                if (hasActionDone && rule.type == RuleType.attack && !rule.isTriggerSkill()) {
                    hasAttackEnemy = true;
                }
                // skip post attack rules
                if (this.currentTurnAction != TurnActionType.afterAction) {
                    // Run post attack rules after attack
                    if (rule.type == RuleType.attack) {
                        this.currentTurnAction = TurnActionType.afterAttack;
                    }
                    var postAttackRules = this.battleTurns[card.name].rules
                        .filter((e) => e.isPostAttackRule() && e.isConditionsFulfilled(card, this, this.currentTurnAction, attackType));
                    // 追擊
                    for (var postRule of postAttackRules) {
                        if (postRule.type == RuleType.basicAtkFollowupSkill) {
                            var atkFollowupRule = postRule.cloneSimple();
                            atkFollowupRule.type = RuleType.attack;
                            atkFollowupRule.turn = 1;
                            atkFollowupRule.condition = [new Condition(ConditionType.isAttackType, AttackType.BasicAttack)];
                            atkFollowupRule.isFollowUpAttack = true;
                            hasActionDone = this.attack(attackType, atkFollowupRule, card);
                            this.currentTurnAction = TurnActionType.afterAttack;
                            if (hasActionDone) {
                                hasAttackEnemy = true;
                            }
                        }
                        else if (Battle.OUTPUT_TYPES.has(postRule.type)) {
                            hasActionDone = this.attack(attackType, postRule, card);
                            if (postRule.type == RuleType.attack) {
                                this.currentTurnAction = TurnActionType.afterAttack;
                                if (hasActionDone && !postRule.isTriggerSkill()) {
                                    hasAttackEnemy = true;
                                }
                            }
                        }
                    }
                    // 我方「攻擊時」「普攻時」「必殺時」被動
                    for (var postRule of postAttackRules) {
                        postRuleToProcess.push(postRule);
                        // this.addRuleToTargets(postRule, card, attackType);
                        // this.processRule(postRule, card, attackType);
                        // this.addBuffToTargets(postRule, card, attackType);
                    }
                }
                if (hasAttackEnemy) {
                    hasAttackEnemyAction = true;
                }
                if (hasAttackEnemy && !hasProcessedEnemyPostAttack) {
                    // 敵方「被攻擊時」被動
                    this.currentTurnAction = TurnActionType.afterAttack;
                    postAttackRules = this.enemyBattleTurn.rules
                        .filter((e) => e.isPostAttackRule());
                    for (var postRule of postAttackRules) {
                        enemyPostRuleToProcess.push(postRule);
                        // this.addRuleToTargets(postRule, card, attackType);
                        // this.addBuffToTargets(postRule, card, attackType);
                    }
                    hasProcessedEnemyPostAttack = true;
                }
                this.currentTurnAction = TurnActionType.afterAction;
            }
            else {
                this.addRuleToTargets(rule, card, attackType);
                this.processRule(rule, card, attackType);
                this.addBuffToTargets(rule, card, attackType);
            }
        }
        // 移動結束才會執行「攻擊時」「必殺時」「普攻時」的rules
        this.currentTurnAction = hasAttackEnemyAction ? TurnActionType.afterAttack : TurnActionType.afterAction;
        for (var postRule of postRuleToProcess) {
            this.addRuleToTargets(postRule, card, attackType);
            this.processRule(postRule, card, attackType);
            this.addBuffToTargets(postRule, card, attackType);
        }
        for (var postRule of enemyPostRuleToProcess) {
            this.addRuleToTargets(postRule, card, attackType);
            this.addBuffToTargets(postRule, card, attackType);
        }
        this.battleTurns[card.name].action[this.currentTurn] = attackType;
        return attackType;
    }
    endRound(attackType, cards) {
        this.currentTurnAction = TurnActionType.atTurnEnd;
        // ---------------------------敵人行動------------------------------------
        if (this.enemyCard != null) {
            // Enemy action
            if (this.enemyCard.remainHp > 0) {
                var enemy = this.enemyCard;
                // Remove Enemy HP lock
                if (this.enemyCard.battleHpLock.length > 0) {
                    var nextLockHpPercent = Util.getNumber(this.enemyCard.battleHpLock[0]);
                    if (this.enemyCard.currentHp <= nextLockHpPercent) {
                        this.enemyCard.battleHpLock.shift();
                        this.enemylockHpTurn.push(this.currentTurn);
                    }
                }
                // Pre-attack
                var preAttackRules = this.enemyBattleTurn.rules.filter((r) => r.isPreAttackRule() && r.isConditionsFulfilled(enemy, this, TurnActionType.attack, AttackType.BasicAttack));
                for (var rule of preAttackRules) {
                    this.addRuleToTargets(rule, enemy, AttackType.BasicAttack);
                }
                preAttackRules = this.enemyBattleTurn.rules.filter((r) => r.isPreAttackRule() && r.isConditionsFulfilled(enemy, this, TurnActionType.attack, AttackType.BasicAttack));
                for (var rule of preAttackRules) {
                    this.processRule(rule, enemy, AttackType.BasicAttack);
                    this.addBuffToTargets(rule, enemy, AttackType.BasicAttack);
                }
                // attack
                var attackRule = [].concat(enemy.attackRule);
                attackRule = attackRule.filter((r) => r.isConditionsFulfilled(enemy, this, TurnActionType.attack, AttackType.BasicAttack));
                for (var rule of attackRule) {
                    if (Battle.OUTPUT_TYPES.has(rule.type)) {
                        this.attack(AttackType.BasicAttack, rule, enemy);
                    }
                    else {
                        this.addRuleToTargets(rule, enemy, AttackType.BasicAttack);
                        this.processRule(rule, enemy, AttackType.BasicAttack);
                        this.addBuffToTargets(rule, enemy, AttackType.BasicAttack);
                    }
                }
                // console.info(this.currentTurn + ":" + this.enemyCard.phase);
            }
        }
        for (var card of cards) {
            // ---------------------------敵方攻擊------------------------------------
            // 反擊
            if (this.counterAttackCount > 0) {
                var counterAttackRules = this.battleTurns[card.name].rules.filter(e => e.type == RuleType.counterAttackSkill);
                for (var rule of counterAttackRules) {
                    var newRule = rule.cloneSimple();
                    newRule.type = RuleType.attack;
                    newRule.turn = 1;
                    newRule.maxCount = Math.min(this.counterAttackCount, rule.getMaxCount());
                    newRule.isCounterAttack = true;
                    this.attack(AttackType.SkillAttack, newRule, card);
                    if (this.counterAttackMode == CounterAttackMode.firstTurnOnly) {
                        rule.turn = 0; // consume
                    }
                }
            }
            // ---------------------------回合結束------------------------------------
            // 持續傷害
            var poisonRules = this.enemyBattleTurn.rules.filter((e) => e.type == RuleType.poisonAttackState && e.parentCardName == card.name);
            var poisonVal = poisonRules.reduce((sum, e) => sum + Util.getNumber(e.value), 0);
            if (poisonVal != null && poisonVal > 0) {
                var enemyRules = this.enemyBattleTurn.rules
                    .filter((r) => r.isConditionsFulfilled(card, this, this.currentTurnAction, attackType));
                var enemyBuffs = this.filterBuffs(enemyRules, poisonRules[0], RuleType.poisonAttack, attackType, true);
                var debuffs = [];
                for (var buff of enemyBuffs) {
                    var buffType = buff.type;
                    // 持續傷害：「敵方持續傷害增加」跟「敵方受到傷害增加」屬於同一乘區
                    if (buffType == RuleType.enemyPoisonAtkUp) {
                        buffType = RuleType.enemyAllAtkUp;
                    }
                    var applyCount = buff.getConditionFulfillTimes(card, this, this.currentTurnAction, attackType);
                    debuffs[buffType] = (debuffs[buffType] || 0) + (Util.getNumber(buff.value) * applyCount);
                }
                var outputVal = poisonVal;
                var enemyDamageVal = outputVal;
                for (var key of Object.keys(debuffs)) {
                    enemyDamageVal = Math.floor(enemyDamageVal * (1 + Util.getNumber(debuffs[key])));
                }
                this.battleTurns[card.name].outputs[RuleType.poisonAttack][this.currentTurn] = (this.battleTurns[card.name].outputs[RuleType.poisonAttack][this.currentTurn] || 0) + outputVal;
                this.battleTurns[card.name].enemyDamage[RuleType.poisonAttack][this.currentTurn] = (this.battleTurns[card.name].enemyDamage[RuleType.poisonAttack][this.currentTurn] || 0) + enemyDamageVal;
                if (this.enemyCard != null) {
                    this.damageToEnemy(this.battleTurns[card.name].enemyDamage[RuleType.poisonAttack][this.currentTurn], true);
                }
            }
            // 持續治療
            var contHealRules = this.battleTurns[card.name].rules.filter((e) => e.type == RuleType.continueHealState && e.parentCardName == card.name);
            var contHealVal = contHealRules.reduce((sum, e) => sum + Util.getNumber(e.value), 0);
            if (contHealVal != null && contHealVal > 0) {
                var cardRules = this.battleTurns[card.name].rules
                    .filter((r) => r.isConditionsFulfilled(card, this, this.currentTurnAction, attackType));
                var ourBuffs = cardRules.filter((r) => r.type == RuleType.partyContinueHealUp || r.type == RuleType.partyAllHealUp);
                var buffs = [];
                for (var buff of ourBuffs) {
                    var buffType = buff.type;
                    // 持續傷害：「我方受到持續治療增加」跟「我方受到治療增加」屬於同一乘區
                    if (buffType == RuleType.partyContinueHealUp) {
                        buffType = RuleType.partyAllHealUp;
                    }
                    var applyCount = buff.getConditionFulfillTimes(card, this, this.currentTurnAction, attackType);
                    buffs[buffType] = (buffs[buffType] || 0) + (Util.getNumber(buff.value) * applyCount);
                }
                var outputVal = contHealVal;
                for (var key of Object.keys(buffs)) {
                    outputVal = Math.floor(outputVal * (1 + Util.getNumber(buffs[key])));
                }
                this.battleTurns[card.name].outputs[RuleType.continueHeal][this.currentTurn] = (this.battleTurns[card.name].outputs[RuleType.continueHeal][this.currentTurn] || 0) + outputVal;
                this.battleTurns[card.name].enemyDamage[RuleType.continueHeal][this.currentTurn] = (this.battleTurns[card.name].enemyDamage[RuleType.continueHeal][this.currentTurn] || 0) + outputVal;
            }
        }
        if (this.enemyCard != null) {
            this.enemyBattleTurn.hp[this.currentTurn] = this.enemyCard.remainHp;
            this.enemyBattleTurn.shield[this.currentTurn] = RuleHelper.getBuffTotalValue(this.enemyBattleTurn.rules, RuleType.shieldState);
        }
    }
    filterBuffs(rules, atkRule, ruleType, attackType, isEnemy = false) {
        var filtered = rules.filter(r => isEnemy ? Battle.ENEMY_BUFF_TYPES.has(r.type) : !Battle.ENEMY_BUFF_TYPES.has(r.type));
        filtered = filtered.filter(r => Battle.ACTION_ACCEPT_BUFFS[ruleType].includes(r.type));
        filtered = filtered.filter(r => !(r.isBeforeRoundRule() || r.isPreAttackRule() || r.isPostAttackRule()));
        if (attackType == AttackType.BasicAttack && !atkRule.isTriggerSkill(attackType)) {
            filtered = filtered.filter(r => r.type != RuleType.skillAtkUp && r.type != RuleType.enemySkillAtkUp);
        }
        else if (attackType == AttackType.SkillAttack || atkRule.isTriggerSkill(attackType)) {
            filtered = filtered.filter(r => r.type != RuleType.basicAtkUp && r.type != RuleType.enemyBasicAtkUp);
        }
        if (!atkRule.isTriggerSkill(attackType)) {
            filtered = filtered.filter(r => r.type != RuleType.triggerAtkUp && r.type != RuleType.enemyTriggerAtkUp);
        }
        // Should check and process at turn end
        filtered = filtered.filter(r => r.type != RuleType.partyContinueHealUp);
        return filtered;
    }
    filterBuffsForLog(rules, isEnemy = false) {
        var filtered = rules.filter(r => Battle.OUTPUT_TYPES.has(r.type) || Battle.TEAM_BUFF_TYPES.has(r.type) || Battle.ENEMY_BUFF_TYPES.has(r.type)
            || Battle.LOG_ONLY_RULE_TYPES);
        filtered = filtered.filter(r => isEnemy ? Battle.ENEMY_BUFF_TYPES.has(r.type) : !Battle.ENEMY_BUFF_TYPES.has(r.type));
        filtered = filtered.filter(r => !(r.isBeforeRoundRule() || r.isPreAttackRule() || r.isPostAttackRule()));
        return filtered;
    }
    processRule(rule, card, attackType) {
        if (!rule.isConditionsFulfilled(card, this, this.currentTurnAction, attackType)) {
            return;
        }
        var targetNames = rule.getRuleApplyTarget(this.team, card);
        for (var targetName of targetNames) {
            // 減CD
            if (rule.type == RuleType.cdMinus) {
                var cooldownCount = Util.getNumber(rule.value);
                var targetSkillCD = this.battleTurns[targetName].skillCD - cooldownCount;
                this.battleTurns[targetName].skillCD = targetSkillCD > 0 ? targetSkillCD : 0;
            }
            // 普攻追擊
            else if (rule.type == RuleType.basicAtkFollowup) {
                var newRule = rule.cloneSimple();
                newRule.type = RuleType.basicAtkFollowupSkill;
                newRule.condition = null;
                this.battleTurns[targetName].addRule(newRule);
            }
            // 反擊
            else if (rule.type == RuleType.counterAttack) {
                var newRule = rule.cloneSimpleChild();
                newRule.type = RuleType.counterAttackSkill;
                newRule.condition = null;
                newRule.target = null;
                this.battleTurns[targetName].addRule(newRule);
            }
            // 設定階段
            else if (rule.type == RuleType.setPhase) {
                var phases = rule.value || rule.value;
                card.setPhase(phases);
            }
            else if (rule.type == RuleType.setEnemyPhase) {
                var phases = rule.value || rule.value;
                this.enemyCard.setPhase(phases);
            }
            // 獲得護盾
            else if (rule.type == RuleType.getShield) {
                // var shieldVal = Util.getNumber(rule.value);
                var newRule = rule.cloneSimple();
                newRule.type = RuleType.shieldState;
                newRule.condition = null;
                newRule.target = null;
                this.battleTurns[targetName].addRule(newRule);
            }
        }
    }
    addBuffToTargets(rule, card, attackType) {
        if (!(Battle.TEAM_BUFF_TYPES.has(rule.type) || Battle.ENEMY_BUFF_TYPES.has(rule.type) || Battle.LOG_ONLY_RULE_TYPES.has(rule.type))) {
            return;
        }
        if (!rule.isConditionsFulfilled(card, this, this.currentTurnAction, attackType)) {
            return;
        }
        var targetNames = rule.getRuleApplyTarget(this.team, card);
        for (var targetName of targetNames) {
            var newRule = rule.cloneSimpleChild();
            newRule.isPassive = false;
            newRule.target = null;
            newRule.condition = null;
            // 各種buff （普攻/必殺/造傷/下毒/治療/持續治療增加）
            if (Battle.TEAM_BUFF_TYPES.has(rule.type) || Battle.LOG_ONLY_RULE_TYPES.has(rule.type)) {
                var isRuleAdded = this.battleTurns[targetName].addRule(newRule);
                if (isRuleAdded && targetName == card.name && !newRule.isBeforeRoundRule() && !newRule.isPreAttackRule()
                    && !Battle.LOG_EXCLUDE_TURNACTIONTYPE.has(this.currentTurnAction)) {
                    this.battleTurns[card.name].addRuleLog(this.currentTurn, newRule);
                }
            }
            // 敵方Debuff （普攻/必殺/造傷）
            else if (Battle.ENEMY_BUFF_TYPES.has(rule.type)) {
                var isRuleAdded = this.enemyBattleTurn.addRule(newRule);
                if (isRuleAdded && !newRule.isBeforeRoundRule() && !newRule.isPreAttackRule()
                    && !Battle.LOG_EXCLUDE_TURNACTIONTYPE.has(this.currentTurnAction)) {
                    this.battleTurns[card.name].addRuleLog(this.currentTurn, newRule);
                }
            }
        }
    }
    addRuleToTargets(rule, card, attackType) {
        if (!(rule.type == RuleType.appendRule || rule.type == RuleType.enemyAppendRule)) {
            return;
        }
        if (!rule.isConditionsFulfilled(card, this, this.currentTurnAction, attackType)) {
            return;
        }
        var targetNames = rule.getRuleApplyTarget(this.team, card);
        for (var targetName of targetNames) {
            var newRule = rule.value.cloneSimple();
            if (rule.type == RuleType.appendRule) {
                newRule.parentCardName = targetName;
                var isRuleAdded = this.battleTurns[targetName].addRule(newRule);
                if (isRuleAdded && targetName == card.name && Battle.TEAM_BUFF_TYPES.has(newRule.type) && newRule.condition == null && !newRule.isBeforeRoundRule() && !newRule.isPreAttackRule()
                    && !Battle.LOG_EXCLUDE_TURNACTIONTYPE.has(this.currentTurnAction)) {
                    this.battleTurns[card.name].addRuleLog(this.currentTurn, newRule);
                }
            }
            else if (rule.type == RuleType.enemyAppendRule) {
                newRule.parentCardName = card.name;
                var isRuleAdded = this.enemyBattleTurn.addRule(newRule);
                if (isRuleAdded && Battle.ENEMY_BUFF_TYPES.has(newRule.type) && newRule.condition == null && !newRule.isBeforeRoundRule() && !newRule.isPreAttackRule()
                    && !Battle.LOG_EXCLUDE_TURNACTIONTYPE.has(this.currentTurnAction)) {
                    this.battleTurns[card.name].addRuleLog(this.currentTurn, newRule);
                }
            }
        }
    }
    attack(attackType, rule, card) {
        var currentTurn = this.currentTurn;
        if (!rule.isConditionsFulfilled(card, this, this.currentTurnAction, attackType)) {
            return false;
        }
        // var isAddRuleLog = this.currentTurnAction == TurnActionType.beforeAction;
        // Calculate
        var isAttackSuccess = true;
        var atk = card.getAtk();
        var hp = card.getHp();
        var action = null;
        if (rule.type == RuleType.attack)
            action = TurnActionType.attack;
        else if (rule.type == RuleType.poisonAttack)
            action = TurnActionType.poison;
        else if (rule.type == RuleType.heal || RuleType.continueHeal)
            action = TurnActionType.heal;
        else if (rule.type == RuleType.support)
            action = TurnActionType.support;
        var cardRules = this.battleTurns[card.name].rules
            .filter((r) => r.isConditionsFulfilled(card, this, action, attackType));
        var ourBuffs = this.filterBuffs(cardRules, rule, rule.type, attackType);
        var enemyRules = this.enemyBattleTurn.rules
            .filter((r) => r.isConditionsFulfilled(card, this, action, attackType));
        var enemyBuffs = this.filterBuffs(enemyRules, rule, rule.type, attackType, true);
        var buffs = [];
        var debuffs = [];
        var supportBuff = 0;
        for (var buff of ourBuffs) {
            var applyCount = buff.getConditionFulfillTimes(card, this, action, attackType);
            // 觸發技：跟必殺技屬於同一乘區
            var buffType = buff.type;
            if (buffType == RuleType.triggerAtkUp) {
                buffType = RuleType.skillAtkUp;
            }
            if (buff.value.endsWith("%")) {
                buffs[buffType] = (buffs[buffType] || 0) + (Util.getNumber(buff.value) * applyCount);
            }
            else {
                supportBuff += (Util.getNumber(buff.value) * applyCount);
            }
        }
        for (var buff of enemyBuffs) {
            var applyCount = buff.getConditionFulfillTimes(card, this, action, attackType);
            // 觸發技：跟必殺技屬於同一乘區
            var buffType = buff.type;
            if (buffType == RuleType.enemyTriggerAtkUp) {
                buffType = RuleType.enemySkillAtkUp;
            }
            debuffs[buffType] = (debuffs[buffType] || 0) + (Util.getNumber(buff.value) * applyCount);
        }
        if (!this.isRuleLogAddedPerTurn) {
            var logRules = this.filterBuffsForLog(cardRules);
            for (var buff of logRules) {
                var applyCount = buff.getConditionFulfillTimes(card, this, action, attackType);
                if (applyCount > 0) {
                    this.battleTurns[card.name].addRuleLog(this.currentTurn, buff, applyCount);
                }
            }
            logRules = this.filterBuffsForLog(this.enemyBattleTurn.rules, true);
            for (var buff of logRules) {
                var applyCount = buff.getConditionFulfillTimes(card, this, action, attackType);
                if (applyCount > 0) {
                    this.battleTurns[card.name].addRuleLog(this.currentTurn, buff, applyCount);
                }
            }
            this.isRuleLogAddedPerTurn = true;
        }
        var hitCount = rule.getMaxCount();
        var outputVal = 0;
        // 計算攻擊力 x 輸出倍率
        if (rule.valueBy == RuleValueByType.exactVal) {
            outputVal = Math.floor(Util.getNumber(rule.value));
        }
        else if (rule.valueBy == RuleValueByType.hp || rule.valueBy == RuleValueByType.exactHp) {
            outputVal = Math.floor((Math.floor(hp * (1 + Util.getNumber(buffs[RuleType.hpUp])))) * Util.getNumber(rule.value));
        }
        else {
            var atkVal = Math.floor(atk * (1 + Util.getNumber(buffs[RuleType.atkUp]))) + supportBuff;
            // 只用基礎攻擊力計算
            // 註：如果是輔助rule，filterBuffs會過濾掉所有ATK加成，所以輔助無須特別指定是「基礎攻擊力」
            if (rule.valueBy == RuleValueByType.baseAtk) {
                atkVal = Math.floor(atk);
            }
            outputVal = Math.floor(atkVal * Util.getNumber(rule.value));
        }
        var outputStartTurn = 0;
        // 輔助rule - 幫全隊加攻擊力增加buff
        if (rule.type == RuleType.support) {
            var targetNames = rule.getRuleApplyTarget(this.team, card);
            // ugly hardcode for 不可疊加
            if (rule.isNoOverlayRule() && targetNames.length > 0) {
                var newRule = rule.cloneSimpleChild();
                var existRule = this.battleTurns[targetNames[0]].rules.find(r => r.id == newRule.id);
                if (existRule != null) {
                    outputStartTurn = existRule.turn;
                }
            }
            for (var targetName of targetNames) {
                var newRule = rule.cloneSimpleChild();
                newRule.type = RuleType.atkUp;
                newRule.value = outputVal.toString();
                newRule.condition = null;
                newRule.target = null;
                isAttackSuccess = this.battleTurns[targetName].addRule(newRule);
            }
        }
        // Buffs
        if (rule.valueBy != RuleValueByType.exactVal && rule.valueBy != RuleValueByType.exactHp && rule.valueBy != RuleValueByType.exactAtk) {
            for (var key of Object.keys(buffs)) {
                if (key != RuleType.atkUp) {
                    outputVal = Math.floor(outputVal * (1 + Util.getNumber(buffs[key])));
                }
            }
        }
        // Poison
        if (rule.type == RuleType.poisonAttack) {
            var newRule = new Rule({ type: RuleType.poisonAttackState, parentCardName: card.name, value: outputVal, turn: rule.poisonTurn });
            isAttackSuccess = this.enemyBattleTurn.addRule(newRule);
        }
        // Cont. Heal
        else if (rule.type == RuleType.continueHeal) {
            var newRule = new Rule({ type: RuleType.continueHealState, parentCardName: card.name, value: outputVal, turn: rule.turn });
            isAttackSuccess = this.battleTurns[card.name].addRule(newRule);
        }
        var enemyDamageVal = outputVal;
        for (var key of Object.keys(debuffs)) {
            enemyDamageVal = Math.floor(enemyDamageVal * (1 + Util.getNumber(debuffs[key])));
        }
        if (rule.type == RuleType.support) {
            // NOTE: fix support first, may still need too add "isAttackSuccess" to attack/heal/poison
            if (isAttackSuccess) {
                for (var i = outputStartTurn; i < rule.turn; i++) {
                    this.battleTurns[card.name].outputs[rule.type][currentTurn + i] = (this.battleTurns[card.name].outputs[rule.type][currentTurn + i] || 0) + outputVal;
                    this.battleTurns[card.name].enemyDamage[rule.type][currentTurn + i] = (this.battleTurns[card.name].enemyDamage[rule.type][currentTurn + i] || 0) + outputVal;
                    this.battleTurns[card.name].addRuleLog(currentTurn + i, rule);
                }
            }
        }
        else if (rule.type == RuleType.poisonAttack) {
            for (var i = 0; i < rule.poisonTurn; i++) {
                this.battleTurns[card.name].addRuleLog(currentTurn + i, rule);
            }
        }
        else if (rule.type == RuleType.continueHeal) {
            for (var i = 0; i < rule.turn; i++) {
                this.battleTurns[card.name].addRuleLog(currentTurn + i, rule);
            }
        }
        else {
            if (!(card instanceof EnemyCard)) {
                this.battleTurns[card.name].outputs[rule.type][currentTurn] = (this.battleTurns[card.name].outputs[rule.type][currentTurn] || 0) + outputVal * hitCount;
                this.battleTurns[card.name].enemyDamage[rule.type][currentTurn] = (this.battleTurns[card.name].enemyDamage[rule.type][currentTurn] || 0) + enemyDamageVal * hitCount;
                this.battleTurns[card.name].addRuleLog(currentTurn, rule, hitCount);
            }
            // Enemy Damage
            if (this.enemyCard != null && rule.type == RuleType.attack) {
                var enemyDamage = (card instanceof EnemyCard) ? (enemyDamageVal * hitCount) : this.battleTurns[card.name].enemyDamage[rule.type][currentTurn];
                enemyDamage = Math.floor(enemyDamage * Battle.getElementalBuff(card.element, this.enemyElement));
                this.damageToEnemy(enemyDamage);
            }
            if ((card instanceof EnemyCard) && rule.type == RuleType.heal) {
                var healUp = 1;
                if (rule.valueBy != RuleValueByType.exactVal && rule.valueBy != RuleValueByType.exactHp && rule.valueBy != RuleValueByType.exactAtk) {
                    healUp = 1 + RuleHelper.getBuffTotalValue(cardRules, RuleType.enemyHealUp);
                }
                this.enemyCard.addRemainHp(Math.floor(enemyDamageVal * hitCount * healUp));
            }
        }
        return true;
    }
    getEnemyTurnShieldValue(turn) {
        if (this.enemyCard == null || this.enemyCard.hp == null) {
            return null;
        }
        return this.enemyBattleTurn.shield[turn];
    }
    getEnemyTurnHpValue(turn) {
        if (this.enemyCard == null || this.enemyCard.hp == null) {
            return null;
        }
        return this.enemyBattleTurn.hp[turn];
    }
    getEnemyTurnHpPercent(turn) {
        if (this.enemyCard == null || this.enemyCard.hp == null) {
            return null;
        }
        var remainHp = this.enemyBattleTurn.hp[turn];
        return Math.round(remainHp / this.enemyCard.hp * 10000) / 100;
    }
    getTurnValue(cardname, turn, outputOption) {
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
    getTurnRuleLog(cardname, turn) {
        var attackType = this.battleTurns[cardname].action[turn];
        var rules = this.battleTurns[cardname].ruleLog[turn];
        var ruleTypes = new Set(rules.map(e => e.type));
        var acceptTypes = new Set(Battle.OUTPUT_TYPES);
        for (var actionType of Battle.OUTPUT_TYPES) {
            if (ruleTypes.has(actionType)) {
                Battle.ACTION_ACCEPT_BUFFS[actionType].forEach(e => acceptTypes.add(e));
            }
        }
        // Remove Skill buff when Basic Attack + no Trigger Attack
        if ((attackType == AttackType.BasicAttack || attackType == AttackType.Guard) && !RuleHelper.hasTriggerAttack(rules)) {
            acceptTypes.delete(RuleType.skillAtkUp);
            acceptTypes.delete(RuleType.enemySkillAtkUp);
        }
        // Remove Basic buff when Skill Attack
        if (attackType == AttackType.SkillAttack || attackType == AttackType.Guard) {
            acceptTypes.delete(RuleType.basicAtkUp);
            acceptTypes.delete(RuleType.enemyBasicAtkUp);
        }
        // Remove Trigger buff when no Trigger Attack
        if (!RuleHelper.hasTriggerAttack(rules)) {
            acceptTypes.delete(RuleType.triggerAtkUp);
            acceptTypes.delete(RuleType.enemyTriggerAtkUp);
        }
        // Always add log only types
        for (var logType of Battle.LOG_ONLY_RULE_TYPES) {
            acceptTypes.add(logType);
        }
        rules = rules.filter(function (rule) {
            return acceptTypes.has(rule.type);
        });
        rules = this.filterRulesByPrintOption(rules);
        // Sort rules - move poison / cont. heal to end
        for (var index = rules.length - 1; index >= 0; index--) {
            var rule = rules[index];
            if ((rule.type == RuleType.continueHeal || rule.type == RuleType.poisonAttack) && (index != rules.length - 1)) {
                rules.splice(index, 1);
                rules.push(rule);
            }
        }
        return rules;
    }
    filterRulesByPrintOption(rules) {
        // var acceptTypes = [];
        var ruleTypes = new Set(rules.map(e => e.type));
        var acceptTypes = new Set();
        if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ALL) {
            return rules;
        }
        else if (this.printOutputOption == Battle.PRINT_OUTPUT_OPTION.ONLY_SUPPORT) {
            acceptTypes.add(RuleType.support);
        }
        else {
            if (ruleTypes.has(RuleType.attack) && [Battle.PRINT_OUTPUT_OPTION.ONLY_ATTACK,
                Battle.PRINT_OUTPUT_OPTION.ONLY_DAMAGE].includes(this.printOutputOption)) {
                acceptTypes.add(RuleType.attack);
                Battle.ACTION_ACCEPT_BUFFS[RuleType.attack].forEach(e => acceptTypes.add(e));
            }
            if (ruleTypes.has(RuleType.poisonAttack) && [Battle.PRINT_OUTPUT_OPTION.ONLY_POISON,
                Battle.PRINT_OUTPUT_OPTION.ONLY_DAMAGE].includes(this.printOutputOption)) {
                acceptTypes.add(RuleType.poisonAttack);
                Battle.ACTION_ACCEPT_BUFFS[RuleType.poisonAttack].forEach(e => acceptTypes.add(e));
            }
            if (ruleTypes.has(RuleType.heal) && [Battle.PRINT_OUTPUT_OPTION.ONLY_HEAL].includes(this.printOutputOption)) {
                acceptTypes.add(RuleType.heal);
                Battle.ACTION_ACCEPT_BUFFS[RuleType.heal].forEach(e => acceptTypes.add(e));
            }
            if (ruleTypes.has(RuleType.continueHeal) && [Battle.PRINT_OUTPUT_OPTION.ONLY_HEAL].includes(this.printOutputOption)) {
                acceptTypes.add(RuleType.continueHeal);
                Battle.ACTION_ACCEPT_BUFFS[RuleType.continueHeal].forEach(e => acceptTypes.add(e));
            }
        }
        if (!this.printEnemeyOption) {
            Battle.ENEMY_BUFF_TYPES.forEach(e => acceptTypes.delete(e));
        }
        rules = rules.filter(function (rule) {
            return acceptTypes.has(rule.type);
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
        console.info('潛12\t' + this.team.cards.map(e => e.pot12Rule).join('\t'));
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
}
Battle.PRINT_OUTPUT_OPTION = { ALL: 'All', ONLY_DAMAGE: 'OnlyDamage', ONLY_ATTACK: 'OnlyAttack', ONLY_SUPPORT: 'OnlySupport', ONLY_HEAL: 'OnlyHeal', ONLY_POISON: 'OnlyPoison' };
Battle.OUTPUT_TYPES = new Set([RuleType.attack, RuleType.poisonAttack, RuleType.heal, RuleType.continueHeal, RuleType.support]);
Battle.TEAM_BUFF_TYPES = new Set([RuleType.atkUp, RuleType.hpUp, RuleType.basicAtkUp, RuleType.skillAtkUp, RuleType.triggerAtkUp, RuleType.allAtkUp, RuleType.poisonAtkUp, RuleType.healUp, RuleType.continueHealUp, RuleType.partyHealUp, RuleType.partyContinueHealUp, RuleType.partyAllHealUp]);
Battle.ENEMY_BUFF_TYPES = new Set([RuleType.enemyBasicAtkUp, RuleType.enemySkillAtkUp, RuleType.enemyElementAtkUp, RuleType.enemyTriggerAtkUp, RuleType.enemyAllAtkUp, RuleType.enemyPoisonAtkUp, RuleType.enemyHealUp]);
Battle.UNUSED_RULE_TYPES = new Set([RuleType.immuneParalysis, RuleType.immuneSilence, RuleType.immuneSleep,
    RuleType.takeLessDamage, RuleType.takeLessDamageByGuard, RuleType.moreRecovery,
    RuleType.enemyLessDamage]);
// static LOG_ONLY_RULE_TYPES : Set<RuleType> = new Set([RuleType.getShield]);
Battle.LOG_ONLY_RULE_TYPES = new Set();
Battle.ACTION_ACCEPT_BUFFS = {
    [RuleType.attack]: [RuleType.atkUp, RuleType.basicAtkUp, RuleType.skillAtkUp, RuleType.triggerAtkUp, RuleType.allAtkUp,
        RuleType.enemyBasicAtkUp, RuleType.enemySkillAtkUp, RuleType.enemyElementAtkUp, RuleType.enemyTriggerAtkUp, RuleType.enemyAllAtkUp],
    [RuleType.poisonAttack]: [RuleType.atkUp, RuleType.poisonAtkUp, RuleType.enemyPoisonAtkUp, RuleType.enemyAllAtkUp],
    [RuleType.heal]: [RuleType.atkUp, RuleType.basicAtkUp, RuleType.skillAtkUp, RuleType.triggerAtkUp, RuleType.healUp,
        RuleType.partyHealUp, RuleType.partyAllHealUp],
    [RuleType.continueHeal]: [RuleType.atkUp, RuleType.continueHealUp, RuleType.partyContinueHealUp],
    [RuleType.support]: [],
};
Battle.LOG_EXCLUDE_TURNACTIONTYPE = new Set([TurnActionType.beforeAction, TurnActionType.beforeTurn, TurnActionType.atTurnEnd]);
export class BattleTurn {
    constructor(cardName) {
        this.cardName = cardName;
        this.hp = [];
        this.shield = [];
        this.skillCD = 0;
        this.action = [];
        this.actionPattern = ActionPattern.Immediately;
        this.outputs = [];
        this.enemyDamage = [];
        this.rules = [];
        this.ruleLog = [];
    }
    addRule(newRule) {
        if (!RuleHelper.isRuleExceedMaxCount(newRule, this.rules)) {
            this.rules.push(newRule);
            return true;
        }
        // 不可疊加 - Repush rule
        else if (newRule.isNoOverlayRule()) {
            this.rules = this.rules.filter(r => r.id != newRule.id);
            this.rules.push(newRule);
            return true;
        }
        return false;
    }
    clearRulePerRound() {
        for (var rule of this.rules) {
            if (!rule.isPassive && rule.turn != Rule.ALWAYS_EFFECTIVE) {
                rule.turn = rule.turn - 1;
            }
        }
        this.rules = this.rules.filter(rule => rule.turn > 0);
    }
    addRuleLog(turn, rule, applyCount = 1) {
        if (turn >= this.ruleLog.length) {
            return;
        }
        var existingRules = this.ruleLog[turn].filter(e => e.id == rule.id);
        var attackTypes = [RuleType.attack, RuleType.heal];
        var attackRules = this.ruleLog[turn].filter(e => attackTypes.includes(e.type));
        // console.debug(turn+":["+rule.id+"]"+rule.type+rule.value+":"+rule.maxCount+"||"+existingRules.length);
        // Don't combine buffs log before and after attack action
        if (attackRules.length == 0 && existingRules.length > 0) {
            for (var i = 0; i < applyCount; i++) {
                existingRules[0].addCount();
            }
        }
        else {
            var logRule = new LogRule(rule.clone());
            logRule.condition = null;
            logRule.target = null;
            logRule.applyCount = applyCount;
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
        if (this.actionPattern == ActionPattern.Manual || this.actionPattern == ActionPattern.BruteForce) {
            return this.action[currentTurn] == AttackType.Guard;
        }
        return false;
    }
    isReleaseSkill(currentTurn, cooldown) {
        if (this.actionPattern == ActionPattern.BruteForce) {
            return this.action[currentTurn] == AttackType.SkillAttack;
        }
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
//# sourceMappingURL=BattleSystem.js.map