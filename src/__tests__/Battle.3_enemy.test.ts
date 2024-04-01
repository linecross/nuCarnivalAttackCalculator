import { Battle } from '../BattleSystem.js';
import { Team, Card, CardCenter } from '../Card.js';
import { ActionPattern } from '../Constants.js';
import CardData from './sample/cardData.json';
import '../jest/toBeAround.js';

describe('攻擊手＞單人對敵測試：ATK=1000', () => {
    beforeAll(() => {
        CardCenter.setMainCardData(CardData);
    });

    var battle : Battle;
    var cardName : string = 'Striker1';
    
    var turn : number;
    var counterAttackCount: number;
    var otherCards : string[];
    var cardData : string;
    var skillTurns : number[];
    var guardTurns : number[];

    beforeEach(() => {
        turn = 20;
        counterAttackCount = 1;
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
        battle.counterAttackCount = counterAttackCount;
        battle.printEnemeyOption = true;
        for (var card of battle.team.cards){
            battle.setActionPattern(card.name, ActionPattern.Manual);
        }
        return battle;
    }

    describe('敵方方傷害增加的被動（短時間）', () => {
        beforeEach(()=>{
            skillTurns = [4, 7, 10];
            setupBattle();
        });

        test('敵方受到普攻傷害增加 27%', () => {
            cardData = `{ 
                "coolDown": 3,
                "skillLv3Rule": [ {"type": "敵方受到普攻傷害增加", "value": "27%", "turn": 2}, {"type": "攻擊", "value": "1000%"} ] 
            }`;
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(1000);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(10000);
            expect(battle.getTurnValue(cardName, 5)).toBeAround(1270);
            expect(battle.getTurnValue(cardName, 6)).toBeAround(1000);
        });

        test('敵方受到必殺技傷害增加 27%', () => {
            cardData = `{ 
                "coolDown": 3,
                "skillLv3Rule": [ {"type": "敵方受到必殺技傷害增加", "value": "27%"}, {"type": "攻擊", "value": "1000%"} ] 
            }`;
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(1000);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(12700);
            expect(battle.getTurnValue(cardName, 5)).toBeAround(1000);
        });

        test('敵方受到傷害增加 30%', () => {
            cardData = `{ 
                "coolDown": 3,
                "skillLv3Rule": [ {"type": "敵方受到傷害增加", "value": "30%", "turn": 3}, {"type": "攻擊", "value": "1000%"} ] 
            }`;
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(1000);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(13000);
            expect(battle.getTurnValue(cardName, 5)).toBeAround(1300);
            expect(battle.getTurnValue(cardName, 6)).toBeAround(1300);
        });
    });

    describe('敵方方傷害增加的被動（永久）', () => {
        beforeEach(()=>{
            skillTurns = [4, 7, 10];
            setupBattle();
        });

        test('敵方受到普攻傷害增加 27%', () => {
            cardData = `{ 
                "coolDown": 3,
                "skillLv3Rule": [ {"type": "敵方受到普攻傷害增加", "value": "27%", "turn": 99}, {"type": "攻擊", "value": "1000%"} ] 
            }`;
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(1000);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(10000);
            expect(battle.getTurnValue(cardName, 5)).toBeAround(1270);
            expect(battle.getTurnValue(cardName, 6)).toBeAround(1270);
        });

        test('敵方受到必殺技傷害增加 27%', () => {
            cardData = `{ 
                "coolDown": 3,
                "skillLv3Rule": [ {"type": "敵方受到必殺技傷害增加", "value": "27%", "turn": 99}, {"type": "攻擊", "value": "1000%"} ] 
            }`;
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(1000);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(12700);
            expect(battle.getTurnValue(cardName, 5)).toBeAround(1000);
            expect(battle.getTurnValue(cardName, 7)).toBeAround(12700);
        });

        test('敵方受到傷害增加 30%', () => {
            cardData = `{ 
                "coolDown": 3,
                "skillLv3Rule": [ {"type": "敵方受到傷害增加", "value": "30%", "turn": 99}, {"type": "攻擊", "value": "1000%"} ] 
            }`;
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(1000);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(13000);
            expect(battle.getTurnValue(cardName, 5)).toBeAround(1300);
            expect(battle.getTurnValue(cardName, 6)).toBeAround(1300);
            expect(battle.getTurnValue(cardName, 7)).toBeAround(13000);
        });

        test('敵方受到持續傷害增加 10%', () => {
            cardData = `{
                "coolDown": 3,
                "attackRule": [ {"type": "持續傷害", "value": "50%", "turn": 4 } ],
                "skillLv3Rule": [ {"type": "敵方受到持續傷害增加", "value": "10%", "turn": 99, "maxCount": 3}, {"type": "持續傷害", "value": "200%", "turn": 3} ]
            }`;
            skillTurns = [4, 7, 10, 13];
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(500);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(3850);
            expect(battle.getTurnValue(cardName, 5)).toBeAround(3850);
            expect(battle.getTurnValue(cardName, 7)).toBeAround(3600);
            expect(battle.getTurnValue(cardName, 8)).toBeAround(4200);
            expect(battle.getTurnValue(cardName, 10)).toBeAround(3900);
            expect(battle.getTurnValue(cardName, 11)).toBeAround(4550);
            expect(battle.getTurnValue(cardName, 13)).toBeAround(3900);
            expect(battle.getTurnValue(cardName, 14)).toBeAround(4550);
        });
    });
    
});
