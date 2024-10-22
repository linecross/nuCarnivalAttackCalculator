export const Character = {
	Yakumo : '八雲', 
	Edmond : '艾德蒙特',  
	Olivine : '奧利文',  
	Quincy : '崑西',
	Kuya : '玖夜',
	Garu : '可爾',
	Blade : '布儡',
	Dante : '啖天',
	Rei : '歛',
	Aster : '艾斯特',
	Morvay : '墨菲',
	Eiden : '伊得', 
} as const;
export type Character = typeof Character[keyof typeof Character];

export const Class = {Striker : '攻擊', Support : '輔助', Healer : '治療',  Guardian : '守護',  Saboteur : '妨礙'} as const;
export type Class = typeof Class[keyof typeof Class];

export const Element = {NA: 'N/A', Wood : '木', Fire : '火', Water : '水', Light : '光', Dark : '闇'} as const;
export type Element = typeof Element[keyof typeof Element];

export const Rarity = {SSR : 'SSR', SR: 'SR', R: 'R', N: 'N'} as const;
export type Rarity = typeof Rarity[keyof typeof Rarity];

export const PotentialType= {A : 'HP先行', B : 'ATK先行', C : '平均型', D : 'NR卡'} as const;
export type PotentialType = typeof PotentialType[keyof typeof PotentialType];

export const RuleType = {
	attack : '攻擊', 
	support : '輔助', 
	heal: '治療',
	continueHeal: '持續治療',
	poisonAttack: '持續傷害',

	poisonAttackState: '持續傷害被動',
	continueHealState: '持續治療被動',
	basicAtkFollowup : '普攻追擊',
	basicAtkFollowupSkill : '普攻追擊被動',
	counterAttack: '反擊',
	counterAttackSkill: '反擊被動',
	
	atkUp : '攻擊力增加', 
	basicAtkUp : '普攻傷害增加', 
	skillAtkUp : '必殺技傷害增加', 
	poisonAtkUp : '持續傷害增加', 
	triggerAtkUp : '觸發技效果增加',
	allAtkUp : '造成傷害增加',
	healUp : '治療量增加', 
	continueHealUp : '持續治療量增加', 
	
	enemyBasicAtkUp : '敵方受到普攻傷害增加',
	enemySkillAtkUp : '敵方受到必殺技傷害增加',
	enemyPoisonAtkUp : '敵方受到持續傷害增加',
	enemyTriggerAtkUp : '敵方受到觸發技傷害增加',
	enemyElementAtkUp : '敵方受到屬性傷害增加',
	enemyAllAtkUp : '敵方受到傷害增加',
	enemyHealUp: '敵方回復量增加',

	partyAllHealUp : '我方受到治療增加', 
	partyHealUp : '我方受到瞬間治療增加', 
	partyContinueHealUp : '我方受到持續治療增加', 
	
	cdMinus: '減少冷卻回合',
	hpUp : '最大HP增加', 
	
	// 較複雜的技能規則
	appendRule: '我方獲得技能',
	enemyAppendRule: '敵方獲得技能',
	setPhase: '我方設定階段',
	addPhase: '我方新增階段',
	removePhase: '我方刪除階段',
	setEnemyPhase: '敵方設定階段',
	addEnemyPhase: '敵方新增階段',
	removeEnemyPhase: '敵方刪除階段',

	// Boss專用
	getShield: '獲得護盾',
	shieldState: '護盾',
	guardMode: '防禦狀態',

	// 不會在計算機生效的被動（純記錄）
	takeLessDamage: '受到傷害減少',
	takeLessDamageByGuard: '防禦減傷增加',
	moreRecovery: '受到回復量增加',
	enemyLessDamage: '敵方造成傷害減少',

	immuneParalysis: '免疫麻痺',
	immuneSleep: '免疫睡眠',
	immuneSilence: '免疫沈默'
} as const;
export type RuleType = typeof RuleType[keyof typeof RuleType];

export const RuleValueByType= {atk: 'ATK', hp : 'HP', baseAtk: '基礎攻擊力', exactVal: '絕對數值', exactHp: '絕對HP', exactAtk: '絕對ATK'} as const;
export type RuleValueByType = typeof RuleValueByType[keyof typeof RuleValueByType];

export const AttackType= {BasicAttack : '普攻', SkillAttack : '必殺技', Guard: '防禦', None: 'NONE'} as const;
export type AttackType = typeof AttackType[keyof typeof AttackType];

export const ConditionType = {
	hasChar : '角色在場', 
	charCount : '隊伍中每存在角色', 
	hasClass : '隊伍中有定位', 
	classCount : '隊伍中每存在定位', 
	hasElement : '隊伍中有屬性',
	elementCount : '隊伍中每存在屬性', 
	hpHigher : '血量大於', 
	hpLower : '血量少於', 
	isAttackType : '攻擊方式',
	isAttack : '攻擊時',
	everyTurn: '每n回合',
	atTurn: '第n回合',
	hasPhase: '階段',
	// 敵方專用
	enemyIsAttacked: '被攻擊時',
	enemyIsAttackByChar: '被角色攻擊',
	enemyIsAttackByClass: '被定位攻擊',
	enemyIsAttackByElement: '被屬性攻擊',
	enemyHpTrigger : '血量機制'
} as const;
export type ConditionType = typeof ConditionType[keyof typeof ConditionType];

export const TargetType = {
	self: '自己',
	all: '全體',
	isClass: '定位',
	isChar: '角色',
	isPosition: '位置',
};
export type TargetType = typeof TargetType[keyof typeof TargetType];

export const SkillType = {
	none: 'N/A',
	trigger: '觸發',
	append: '追加',
};
export type SkillType = typeof SkillType[keyof typeof SkillType];

export const OperatorType = {
    less: '少於',
    lessOrEq: '少於或等於',
    more: '大於',
    moreOrEq: '大於或等於',
    equal: '等於',
    not: '不'
};
export type OperatorType = typeof OperatorType[keyof typeof OperatorType];

export const ActionPattern = {
	Immediately : '有招就放', 
	Delay1Turn: '延遲1回合', 
	AddCD1: 'CD+1', 
	AddCD2: 'CD+2', 
	AddCD3: 'CD+3', 
	AddCD1Delay1Turn: 'CD+1及延遲1回合', 
	AddCD2Ahead1Turn: 'CD+2及提早1回合', 
	Manual: '手動設置',
	BruteForce: '暴力設置（無視CD）'
} as const;
export type ActionPattern = typeof ActionPattern[keyof typeof ActionPattern];

export const TurnActionType = {
	beforeTurn: "beforeTurn",
	beforeAction: "beforeAction", 
	afterAction: "afterAction",
	attack: "attack", 
	afterAttack: "afterAttack",
	atTurnEnd: "atTrunEnd",
	poison: "poison",
	heal: "heal",
	support: "support",
	guard: "guard",
	none: "none"
} as const;
export type TurnActionType = typeof TurnActionType[keyof typeof TurnActionType];

export const CounterAttackMode = {firstTurnOnly: '僅第一回合', everyTurn : '每回合'} as const;
export type CounterAttackMode = typeof CounterAttackMode[keyof typeof CounterAttackMode];

export const ConditionHPStatus = {fulfill: '符合所有血量條件', notFulfill: '不符合所有血量條件', hpPercent : '按照當前血量'} as const;
export type ConditionHPStatus = typeof ConditionHPStatus[keyof typeof ConditionHPStatus];


export const GAME_CONFIG = {
	MAX_LEVEL: 60,
	ROOM:{
		'SSR': [5, 10, 15, 15, 25],
		'DEFAULT': [5, 5, 10, 10, 20]
	},
	POTTYPE:{
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