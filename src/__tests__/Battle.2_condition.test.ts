import { Battle, Team, Card, CardCenter } from '../BattleSystem.js';
import { ActionPattern } from '../Constants.js';
import CardData from './sample/cardData.json';
import '../jest/toBeAround.js';

describe('攻擊手＞條件測試：ATK=1000', () => {
    beforeAll(() => {
        CardCenter.setMainCardData(CardData);
    });

    var battle : Battle;
    var cardName : string = 'Striker1';
    
    var turn : number;
    var otherCards : string[];
    var cardData : string;
    var skillTurns : number[];
    var guardTurns : number[];

    beforeEach(() => {
        turn = 20;
        cardData = '{}';
        otherCards = [];
        skillTurns = [];
        guardTurns = [];
    });

    function setupBattle(): Battle{
        var team = new Team();
        team.addCard(loadCard(cardName, cardData));
        for (var name of otherCards){
            team.addCard(loadCard(name));
        }
        CardCenter.setupDefaultTeamStar(team, 5, 5);

        battle = loadBattle(team);
        battle.setManualActionPattern(cardName, skillTurns, guardTurns);
        battle.startBattle();
        return battle;
    }

    function loadCard(name: string, data?: string) : Card{
        var card = CardCenter.loadCard(name);
        if (data != null){
            card.updateCard(JSON.parse(data));
        }
        return card;
    }
    function loadBattle(team: Team, turn = 14) : Battle{
        var battle = new Battle(team, turn);
        battle.init();
        battle.counterAttackCount = 1;
        battle.printEnemeyOption = true;
        for (var card of battle.team.cards){
            battle.setActionPattern(card.name, ActionPattern.Manual);
        }
        return battle;
    }

    describe('規則 > 條件 > 每n回合', () => {
        test('每經過3回合，必殺技傷害增加60%【沙啖3星】', () => {
            cardData = `{
                "coolDown": 3,
                "star3Rule": [
                    {"type": "必殺技傷害增加", "value": "60%", "turn": 1, "condition": { "type": "每n回合", "value": 3 } }
                ]
            }`;
            skillTurns = [4, 7, 12];
            setupBattle();

            expect(battle.getTurnValue(cardName, 4)).toBeAround(16000);
            expect(battle.getTurnValue(cardName, 7)).toBeAround(16000);
            expect(battle.getTurnValue(cardName, 12)).toBeAround(10000);
        });

        test('每經過1回合，攻擊力增加5%（最多10層）【SR可爾5星】', () => {
            cardData = `{
                "coolDown": 3,
                "star3Rule": [
                    {"type": "攻擊力增加", "value": "5%", "turn": 99, "maxCount": 10, "condition": { "type": "每n回合", "value": 1 } }
                ]
            }`;
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(1050);
            expect(battle.getTurnValue(cardName, 5)).toBeAround(1250);
            expect(battle.getTurnValue(cardName, 10)).toBeAround(1500);
            expect(battle.getTurnValue(cardName, 11)).toBeAround(1500);
        });
    });

    describe('規則 > 條件 > 第n回合', () => {
        test('第1回合，無法開必殺技', () => {
            skillTurns = [1];
            setupBattle();
            expect(battle.getTurnValue(cardName, 1)).toBeAround(1000);
        });

        test('第1回合，開必殺技', () => {
            cardData = `{
                "star3Rule": [
                    {"type": "減少冷卻回合", "value": "3", "turn": 1, "condition": { "type": "第n回合", "value": 1 } }
                ]
            }`;
            skillTurns = [1];
            setupBattle();
            expect(battle.getTurnValue(cardName, 1)).toBeAround(10000);
        });

        test('第5回合起，普攻傷害增加 20%（永久）', () => {
            cardData = `{
                "star3Rule": [
                    {"type": "普攻傷害增加", "value": "20%", "turn": 99, "condition": { "type": "第n回合", "value": 5 } }
                ]
            }`;
            skillTurns = [];
            setupBattle();
            expect(battle.getTurnValue(cardName, 1)).toBeAround(1000);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(1000);
            expect(battle.getTurnValue(cardName, 5)).toBeAround(1200);
            expect(battle.getTurnValue(cardName, 6)).toBeAround(1200);
        });
    });

    describe('規則 > 條件 > 攻擊時', () => {
        test('攻擊時，攻擊力增加 5%（最多6層）', () => {
            cardData = `{
                "star3Rule": [
                    {"type": "攻擊力增加", "value": "5%", "turn": "99", "maxCount": "6", "condition": "攻擊時" }
                ]
            }`;
            setupBattle();
            expect(battle.getTurnValue(cardName, 1)).toBeAround(1000);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(1150);
            expect(battle.getTurnValue(cardName, 7)).toBeAround(1300);
            expect(battle.getTurnValue(cardName, 8)).toBeAround(1300);
        });

        test('普攻時，攻擊力增加 5%（最多6層）', () => {
            cardData = `{
                "star3Rule": [
                    {"type": "攻擊力增加", "value": "5%", "turn": "99", "maxCount": "6", "condition": {"type": "攻擊方式", "value" :"普攻"} }
                ]
            }`;
            skillTurns = [4, 7];
            setupBattle();

            // FIXME: "攻擊方式"(普攻時/必殺時) should add as post-attack (same as "攻擊時")
            expect(battle.getTurnValue(cardName, 1)).toBeAround(1000);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(11500);
            expect(battle.getTurnValue(cardName, 6)).toBeAround(1200);
            expect(battle.getTurnValue(cardName, 8)).toBeAround(1250);
            expect(battle.getTurnValue(cardName, 9)).toBeAround(1300);
            expect(battle.getTurnValue(cardName, 10)).toBeAround(1300);
        });

        test('必殺時，攻擊力增加 15%（最多2層）', () => {
            cardData = `{
                "star3Rule": [
                    {"type": "攻擊力增加", "value": "15%", "turn": "99", "maxCount": "2", "condition": {"type": "攻擊方式", "value" :"必殺技"} }
                ]
            }`;
            skillTurns = [4, 7];
            setupBattle();

            // FIXME: "攻擊方式"(普攻時/必殺時) should add as post-attack (same as "攻擊時")
            expect(battle.getTurnValue(cardName, 1)).toBeAround(1000);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(10000);
            expect(battle.getTurnValue(cardName, 5)).toBeAround(1150);
            expect(battle.getTurnValue(cardName, 7)).toBeAround(11500);
            expect(battle.getTurnValue(cardName, 8)).toBeAround(1300);
        });

        test('必殺時，攻擊力增加 15%（2回合）', () => {
            cardData = `{
                "star3Rule": [
                    {"type": "攻擊力增加", "value": "15%", "turn": "2", "condition": {"type": "攻擊方式", "value" :"必殺技"} }
                ]
            }`;
            skillTurns = [4, 7];
            setupBattle();

            // FIXME: "攻擊方式"(普攻時/必殺時) should add as post-attack (same as "攻擊時")
            expect(battle.getTurnValue(cardName, 4)).toBeAround(10000);
            expect(battle.getTurnValue(cardName, 5)).toBeAround(1150);
            expect(battle.getTurnValue(cardName, 6)).toBeAround(1000);
        });
    });

    describe('規則 > 條件 > 角色在場時', () => {
        beforeEach(() => {
            cardData = `{
                "star3Rule": [
                    {"type": "攻擊力增加", "value": "27%", "condition": { "type": "角色在場", "value": "test2" } }
                ]
            }`;
            skillTurns = [4];
        });
        test('角色並不在場（無加成）', () => {
            otherCards = ['Striker3'];
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(1000);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(10000);
        });

        test('角色在場（有加成）', () => {
            otherCards = ['Striker2'];
            setupBattle();
            
            expect(battle.getTurnValue(cardName, 1)).toBeAround(1270);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(12700);
        });
    });

    describe('規則 > 條件 > 隊伍中每存在角色', () => {
        beforeEach(() => {
            cardData = `{
                "star3Rule": [
                    {"type": "攻擊力增加", "value": "8%", "maxCount": "3", "condition": { "type": "隊伍中每存在角色", "value": "test1" } }
                ]
            }`;
            skillTurns = [4];
        });

        test('只有自己（加成1次）', () => {
            otherCards = ['Striker2', 'Striker3'];
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(1080);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(10800);
        });

        test('有兩人（加成2次）', () => {
            otherCards = ['Healer1', 'Striker2'];
            setupBattle();
            
            expect(battle.getTurnValue(cardName, 1)).toBeAround(1160);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(11600);
        });

        test('有三人（加成3次）', () => {
            otherCards = ['Healer1', 'Support1'];
            setupBattle();
            
            expect(battle.getTurnValue(cardName, 1)).toBeAround(1240);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(12400);
        });

        test('有四人（加成3次）', () => {
            otherCards = ['Healer1', 'Support1', 'Guard1'];
            setupBattle();
            
            expect(battle.getTurnValue(cardName, 1)).toBeAround(1240);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(12400);
        });
    });

    describe('規則 > 條件 > 隊伍中有定位', () => {
        beforeEach(() => {
            cardData = `{
                "star3Rule": [
                    {"type": "必殺技傷害增加", "value": "18%", "condition": { "type": "隊伍中有定位", "value": "輔助" } }
                ]
            }`;
            skillTurns = [4];
        });

        test('沒有輔助定位（沒有加成）', () => {
            otherCards = ['Healer1', 'Striker2'];
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(1000);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(10000);
        });

        test('有輔助定位（有加成）', () => {
            otherCards = ['Healer1', 'Support1'];
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(1000);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(11800);
        });
    });

    describe('規則 > 條件 > 隊伍中每存在定位', () => {
        beforeEach(() => {
            cardData = `{
                "star3Rule": [
                    {"type": "造成傷害增加", "value": "8%", "maxCount": "3", "condition": { "type": "隊伍中每存在定位", "value": "攻擊" } }
                ]
            }`;
            skillTurns = [4];
        });

        test('只有自己（加成1次）', () => {
            otherCards = ['Healer1', 'Support1'];
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(1080);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(10800);
        });

        test('有兩名攻擊手（加成2次）', () => {
            otherCards = ['Healer1', 'Striker2'];
            setupBattle();
            
            expect(battle.getTurnValue(cardName, 1)).toBeAround(1160);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(11600);
        });

        test('有三名攻擊手（加成3次）', () => {
            otherCards = ['Striker2', 'Striker3'];
            setupBattle();
            
            expect(battle.getTurnValue(cardName, 1)).toBeAround(1240);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(12400);
        });

        test('有四名攻擊手（加成3次）', () => {
            otherCards = ['Striker2', 'Striker3', 'Striker4'];
            setupBattle();
            
            expect(battle.getTurnValue(cardName, 1)).toBeAround(1240);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(12400);
        });
    });
});