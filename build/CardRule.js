import { RuleType, AttackType, ConditionType, TargetType, SkillType, RuleValueByType, TurnActionType, OperatorType } from './Constants.js';
export class Rule {
    static createId() {
        return Rule.idCounter++;
    }
    constructor({ id = null, parentCardName = "", isPassive = false, type = RuleType.attack, value, valueBy = RuleValueByType.atk, turn = 50, maxCount = 1, skillType = SkillType.none, condition = null, target = null, isCounterAttack = false, isFollowUpAttack = false }) {
        this.skillType = SkillType.none;
        this.target = null;
        this.condition = null;
        this.isCounterAttack = false;
        this.isFollowUpAttack = false;
        this.id = id == null ? Rule.createId() : id;
        this.parentCardName = parentCardName;
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
        this.skillType = skillType;
        if (condition == null || Array.isArray(condition)) {
            this.condition = condition;
        }
        else {
            this.condition = [condition];
        }
        this.target = target;
        this.isCounterAttack = isCounterAttack;
        this.isFollowUpAttack = isFollowUpAttack;
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
    // Exact clone including rule ID
    clone() {
        var cloneRule = new Rule({ id: this.id, parentCardName: this.parentCardName, isPassive: this.isPassive, type: this.type, value: this.value, valueBy: this.valueBy,
            turn: this.turn, maxCount: this.maxCount, skillType: this.skillType, condition: this.condition, target: this.target,
            isCounterAttack: this.isCounterAttack, isFollowUpAttack: this.isFollowUpAttack });
        if (this.condition != null) {
            cloneRule.condition = this.condition;
        }
        return cloneRule;
    }
    // rule ID increment
    cloneSimpleChild() {
        var cloneRule = this.clone();
        cloneRule.id += Rule.CHILD_RULE_ID_INCREMENT;
        return cloneRule;
    }
    // Not passive
    cloneSimple() {
        var cloneRule = this.clone();
        cloneRule.isPassive = false;
        return cloneRule;
    }
    isConditionsFulfilled(card, team, turnAction, attackType, turn) {
        if (this.condition == null || this.condition.length == 0) {
            return true;
        }
        var isFulfilled = true;
        for (var condition of this.condition) {
            isFulfilled = isFulfilled && condition.isFulfilled(card, team, turnAction, attackType, turn);
        }
        return isFulfilled;
    }
    getConditionFulfillTimes(card, team, turnAction, attackType, turn) {
        if (this.condition == null || this.condition.length == 0 || this.maxCount == null) {
            return 1;
        }
        var count = this.maxCount;
        for (var condition of this.condition) {
            count = Math.min(count, condition.getFulfillTimes(card, team, turnAction, attackType, turn));
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
        if (this.type == RuleType.basicAtkFollowupSkill) {
            return true;
        }
        if (this.condition == null || this.condition.length == 0) {
            return false;
        }
        var types = [ConditionType.isAttack, ConditionType.isAttackType,
            ConditionType.enemyIsAttacked];
        for (var condition of this.condition) {
            if (types.includes(condition.type)) {
                return true;
            }
        }
        return false;
    }
    isBeforeRoundRule() {
        if (this.condition != null) {
            for (var condition of this.condition) {
                if (condition.type == ConditionType.atTurn || condition.type == ConditionType.everyTurn) {
                    return true;
                }
            }
        }
        return false;
    }
    isPreAttackRule() {
        if (this.condition == null || this.condition.length == 0) {
            if (this.type == RuleType.appendRule || this.type == RuleType.enemyAppendRule) {
                return true;
            }
        }
        return false;
    }
    isTriggerSkill(attackType = AttackType.BasicAttack) {
        if (this.isCounterAttack || this.skillType == SkillType.trigger) {
            return true;
        }
        // FIXME: 現時假設 「必殺技」+「攻擊時/被攻擊時」+「攻擊/治療」 = 觸發技，日後可能要移除
        if (attackType == AttackType.SkillAttack && (this.type == RuleType.attack || this.type == RuleType.heal)) {
            if (this.condition != null) {
                for (var condition of this.condition) {
                    if (condition.type == ConditionType.isAttack || condition.type == ConditionType.isAttackType) {
                        return true;
                    }
                }
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
    static loadRule({ isPassive = false, type = RuleType.attack, value, valueBy = RuleValueByType.atk, turn = null, maxCount = 1, skillType = SkillType.none, condition = null, target = null }, isPermRule = false) {
        // Default values setup
        if (isPermRule) {
            isPassive = true;
            if (turn == null)
                turn = Rule.ALWAYS_EFFECTIVE;
        }
        else {
            isPassive = false;
            if (turn == null)
                turn = 1;
        }
        // Load append rule
        if (type == RuleType.appendRule || type == RuleType.enemyAppendRule) {
            value = Rule.loadRule(value);
        }
        // Load condition
        var conditionArr = null;
        if (condition != null) {
            conditionArr = [];
            if (Array.isArray(condition)) {
                for (var item of condition) {
                    conditionArr.push(new Condition(item.type, item.value, item.operator, item.minCount));
                }
            }
            else if (typeof condition == 'string') {
                conditionArr.push(new Condition(condition, null, null, null));
            }
            else {
                conditionArr.push(new Condition(condition.type, condition.value, condition.operator, condition.minCount));
            }
        }
        // Load Target
        var targetItem = null;
        if (target != null) {
            if (typeof target == 'string') {
                target = { type: target };
            }
            targetItem = RuleTarget.loadTarget(target);
        }
        var rule = new Rule({ isPassive: isPassive, type: type, value: value, valueBy: valueBy, turn: turn, maxCount: maxCount, skillType: skillType, condition: conditionArr, target: targetItem });
        return rule;
    }
}
Rule.idCounter = 0;
Rule.BATTLE_INIT_RULE_ID = 10000;
Rule.CHILD_RULE_ID_INCREMENT = 300000;
Rule.ALWAYS_EFFECTIVE = 99;
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
        var value = '';
        if (this.value != null) {
            value = this.value.toString();
        }
        if (type == TargetType.isPosition) {
            value = '第' + value + '位';
        }
        var exceptStr = this.exceptType != null ? this.exceptValue != null ? this.exceptValue : this.exceptType : '';
        if (this.exceptType == TargetType.isPosition) {
            exceptStr = '第' + exceptStr + '位';
        }
        if (exceptStr.length > 0)
            exceptStr = '（除了' + exceptStr + '）';
        if (this.value == null) {
            return type + exceptStr;
        }
        return value.toString() + exceptStr;
    }
}
export class Condition {
    constructor(type, value, operator = null, minCount = 1) {
        this.type = type;
        this.value = value;
        this.operator = operator;
        if (minCount != null) {
            this.minCount = minCount;
        }
    }
    isFulfilled(card, team, turnAction, charAttackType, currentTurn) {
        if (this.type == ConditionType.hasChar) {
            return team.getCharCount(this.value.toString()) >= this.minCount;
        }
        else if (this.type == ConditionType.charCount) {
            if (this.operator == null || this.operator == OperatorType.moreOrEq || this.operator == OperatorType.more) {
                return team.getCharCount(this.value.toString()) >= this.minCount;
            }
            else {
                return team.getCharCount(this.value.toString()) <= this.minCount;
            }
        }
        else if (this.type == ConditionType.hasClass) {
            return team.getClassCount(this.value) >= this.minCount;
        }
        else if (this.type == ConditionType.classCount) {
            if (this.operator == null || this.operator == OperatorType.moreOrEq || this.operator == OperatorType.more) {
                return team.getClassCount(this.value) >= this.minCount;
            }
            else {
                return team.getClassCount(this.value) <= this.minCount;
            }
        }
        else if (this.type == ConditionType.hasElement) {
            return team.getElementCount(this.value.toString()) >= this.minCount;
        }
        else if (this.type == ConditionType.elementCount) {
            if (this.operator == null || this.operator == OperatorType.moreOrEq || this.operator == OperatorType.more) {
                return team.getElementCount(this.value.toString()) >= this.minCount;
            }
            else {
                return team.getElementCount(this.value.toString()) <= this.minCount;
            }
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
            if (turnAction == TurnActionType.afterAttack) {
                return charAttackType == AttackType.BasicAttack || charAttackType == AttackType.SkillAttack;
            }
        }
        else if (this.type == ConditionType.enemyIsAttackByChar) {
            if (turnAction == TurnActionType.attack) {
                return [...this.value].includes(card.char);
            }
        }
        else if (this.type == ConditionType.enemyIsAttackByClass) {
            if (turnAction == TurnActionType.attack) {
                return [...this.value].includes(card.class);
            }
        }
        else if (this.type == ConditionType.enemyIsAttackByElement) {
            if (turnAction == TurnActionType.attack) {
                return [...this.value].includes(card.element);
            }
        }
        return false;
    }
    getFulfillTimes(card, team, turnAction, charAttackType, currentTurn) {
        if (this.type == ConditionType.charCount && (this.operator == null || this.operator == OperatorType.moreOrEq || this.operator == OperatorType.more)) {
            return team.getCharCount(this.value.toString());
        }
        else if (this.type == ConditionType.classCount && (this.operator == null || this.operator == OperatorType.moreOrEq || this.operator == OperatorType.more)) {
            return team.getClassCount(this.value);
        }
        else if (this.type == ConditionType.elementCount && (this.operator == null || this.operator == OperatorType.moreOrEq || this.operator == OperatorType.more)) {
            return team.getElementCount(this.value.toString());
        }
        else if (this.isFulfilled(card, team, turnAction, charAttackType, currentTurn)) {
            return 1;
        }
        return 0;
    }
    toString() {
        var type = this.type;
        var value = this.value;
        var operator = this.operator == null ? '' : this.operator;
        var minCount = this.minCount > 1 ? this.minCount + '名' : '';
        if (type == ConditionType.charCount) {
            return type.replace('角色', operator + '1名「' + value.toString() + '」');
        }
        else if (type == ConditionType.classCount) {
            return type.replace('定位', operator + '1名「' + value.toString() + '」');
        }
        else if (type == ConditionType.elementCount) {
            return type.replace('屬性', operator + '1名「' + value.toString() + '」');
        }
        else if (type == ConditionType.hasChar) {
            return type.replace('角色', minCount + '「' + value.toString() + '」') + '時';
        }
        else if (type == ConditionType.hasClass) {
            return type.replace('定位', minCount + '定位' + value.toString()) + '時';
        }
        else if (type == ConditionType.hasElement) {
            return type.replace('屬性', minCount + '屬性' + value.toString()) + '時';
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
//# sourceMappingURL=CardRule.js.map