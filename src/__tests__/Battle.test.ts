import { Battle, Team, Card, CardCenter } from '../BattleSystem.js';
import { ActionPattern } from '../Constants.js';
import CardData from './sample/cardData.json';
import '../jest/toBeAround.js';

describe('攻擊手＞單人測試：ATK=1000', () => {
    beforeAll(() => {
        CardCenter.setMainCardData(CardData);
    });

    var cardName : string = 'Striker1';
    var battle : Battle;
    var turn : number = 20;
    var cardData : string = '{}';
    var skillTurns : number[] = [];
    var guardTurns : number[] = [];

    beforeEach(() => {
        turn = 20;
        cardData = '{}';
        skillTurns = [];
        guardTurns = [];
    });

    function setupBattle(): Battle{
        battle = loadBattle(loadTeam(loadCard(cardName, cardData)));
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
    function loadTeam(card: Card){
        var team = new Team();
        team.addCard(card);
        CardCenter.setupDefaultTeamStar(team, 5, 5);
        return team;
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

    describe('無被動', () => {
        beforeAll(()=>{
            cardData = `{"coolDown": 3}`;
            skillTurns = [4];
            setupBattle();
        });

        test('普攻=100%', () => {
            expect(battle.getTurnValue(cardName, 1)).toBeAround(1000);
            expect(battle.getTurnValue(cardName, 8)).toBeAround(1000);
        });

        test('必殺技=1000%', () => {
            expect(battle.getTurnValue(cardName, 4)).toBeAround(10000);
        });
    });

    describe('我方傷害增加的被動（永久）', () => {
        beforeEach(()=>{
            cardData = `{"coolDown": 3}`;
            skillTurns = [4, 7, 10];
            setupBattle();
        });

        test('攻擊力增加 30%', () => {
            cardData = `{ "star3Rule": [ {"type": "攻擊力增加", "value": "30%" } ] }`;
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(1300);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(13000);
            expect(battle.getTurnValue(cardName, 9)).toBeAround(1300);
            expect(battle.getTurnValue(cardName, 10)).toBeAround(13000);
        });

        test('攻擊力增加 1024點（輔助）', () => {
            cardData = `{ "star3Rule": [ {"type": "攻擊力增加", "value": "1024" } ] }`;
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(2024);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(20240);
            expect(battle.getTurnValue(cardName, 9)).toBeAround(2024);
            expect(battle.getTurnValue(cardName, 10)).toBeAround(20240);
        });

        test('普攻傷害增加 50%', () => {
            cardData = `{ "star3Rule": [ {"type": "普攻傷害增加", "value": "50%" } ] }`;
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(1500);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(10000);
            expect(battle.getTurnValue(cardName, 9)).toBeAround(1500);
        });

        test('必殺技傷害增加 38%', () => {
            cardData = `{ "star3Rule": [ {"type": "必殺技傷害增加", "value": "38%" } ] }`;
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(1000);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(13800);
            expect(battle.getTurnValue(cardName, 7)).toBeAround(13800);
            expect(battle.getTurnValue(cardName, 9)).toBeAround(1000);
        });

        test('造成傷害增加 24%', () => {
            cardData = `{ "star3Rule": [ {"type": "造成傷害增加", "value": "24%" } ] }`;
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(1240);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(12400);
            expect(battle.getTurnValue(cardName, 7)).toBeAround(12400);
            expect(battle.getTurnValue(cardName, 9)).toBeAround(1240);
        });
    });

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

});