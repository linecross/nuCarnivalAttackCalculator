import { Battle, Team, Card, CardCenter } from '../BattleSystem.js';
import { ActionPattern } from '../Constants.js';
import CardData from './sample/cardData.json';
import '../jest/toBeAround.js';

describe('增加規則', () => {
    beforeAll(() => {
        CardCenter.setMainCardData(CardData);
    });

    var battle : Battle;
    var cardName : string = 'Striker1';
    
    var turn : number;
    var counterAttackCount: number;
    var otherCards : string[] = ['Striker2', 'Striker3', 'Guard1', 'Healer1'];
    var cardData : string;
    var skillTurns : number[];
    var guardTurns : number[];

    beforeEach(() => {
        turn = 20;
        counterAttackCount = 1;
        cardData = '{}';
        otherCards = ['Striker2', 'Striker3', 'Guard1', 'Healer1'];
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
        battle.counterAttackCount = counterAttackCount;
        battle.printEnemeyOption = true;
        for (var card of battle.team.cards){
            battle.setActionPattern(card.name, ActionPattern.Immediately);
        }
        return battle;
    }

    describe('複雜規則：增加規則', () => {

        test('被動：攻擊時，觸發「使目標受到『test1』傷害增加10%」（鍍布）', () => {
            cardData = `{ 
                "star3Rule": [ {"type": "敵方獲得技能", "condition": "攻擊時", "value": {
                    "type": "敵方受到傷害增加", "value": "10%", "turn": 99, "maxCount": 5,
                    "condition": { "type": "被角色攻擊", "value": "test1" }
                } } ]
            }`;
            setupBattle();

            expect(battle.getTurnValue('Striker1', 1)).toBeAround(1000);
            expect(battle.getTurnValue('Striker2', 1)).toBeAround(1000);
            expect(battle.getTurnValue('Striker3', 1)).toBeAround(1000);
            expect(battle.getTurnValue('Guard1', 1)).toBeAround(1100);

            expect(battle.getTurnValue('Striker1', 2)).toBeAround(1100);
            expect(battle.getTurnValue('Striker2', 2)).toBeAround(1000);
            expect(battle.getTurnValue('Guard1', 2)).toBeAround(1200);

            expect(battle.getTurnValue('Striker1', 5)).toBeAround(1400);
            expect(battle.getTurnValue('Guard1', 5)).toBeAround(1500);

            expect(battle.getTurnValue('Striker1', 6)).toBeAround(1500);
            expect(battle.getTurnValue('Guard1', 6)).toBeAround(1500);

            expect(battle.getTurnValue('Striker1', 8)).toBeAround(1500);
            expect(battle.getTurnValue('Striker2', 8)).toBeAround(1000);
            expect(battle.getTurnValue('Guard1', 8)).toBeAround(1500);
        });

        test('必殺技：令我方獲得「攻擊時，令敵方受到傷害增加15% 2回合」（春玖）', () => {
            cardData = `{ 
                "skillLv3Rule": [ {"type": "攻擊", "value": "1000%"},
                    {"type": "我方獲得技能", "value": {
                        "type": "敵方獲得技能", "turn": 3, "condition": { "type": "攻擊時" }, "value":{
                            "type": "敵方受到傷害增加", "value": "15%", "turn": 2
                        }
                    } 
                } ]
            }`;
            setupBattle();

            expect(battle.getTurnValue('Striker1', 4)).toBeAround(10000);
            expect(battle.getTurnValue('Striker2', 4)).toBeAround(10000);

            expect(battle.getTurnValue('Striker1', 5)).toBeAround(1000);
            expect(battle.getTurnValue('Striker2', 5)).toBeAround(1150);
            expect(battle.getTurnValue('Striker3', 5)).toBeAround(1150);

            expect(battle.getTurnValue('Striker1', 6)).toBeAround(1150);
            expect(battle.getTurnValue('Striker2', 6)).toBeAround(1300);
            expect(battle.getTurnValue('Striker3', 6)).toBeAround(1300);

            expect(battle.getTurnValue('Striker1', 7)).toBeAround(11500);
            expect(battle.getTurnValue('Striker2', 7)).toBeAround(11500);
            expect(battle.getTurnValue('Striker3', 7)).toBeAround(11500);
        });

        test('必殺技：令敵方獲得「被攻擊時，敵方受到傷害增加5% 3回合」（鍍副）', () => {
            cardData = `{ 
                "skillLv3Rule": [
                    {
                      "type": "敵方獲得技能",
                      "value": {
                        "type": "敵方獲得技能",
                        "turn": 3,
                        "condition": "被攻擊時",
                        "value": { "type": "敵方受到傷害增加", "value": "5%", "turn": 3 }
                      }
                    },
                    { "type": "攻擊", "value": "1000%" }
                ]
            }`;
            setupBattle();

            expect(battle.getTurnValue('Striker1', 1)).toBeAround(1000);

            expect(battle.getTurnValue('Striker1', 4)).toBeAround(10000);
            expect(battle.getTurnValue('Striker2', 4)).toBeAround(10500);
            expect(battle.getTurnValue('Striker3', 4)).toBeAround(11000);
            expect(battle.getTurnValue('Guard1', 4)).toBeAround(11500);

            expect(battle.getTurnValue('Striker1', 5)).toBeAround(1200);
            expect(battle.getTurnValue('Striker1', 6)).toBeAround(1400);
        });

        
    });

});
