import { Battle } from '../BattleSystem.js';
import { Team, Card, CardCenter } from '../Card.js';
import { ActionPattern } from '../Constants.js';
import CardData from './sample/cardData.json';
import '../jest/toBeAround.js';

describe('輔助測試', () => {
    beforeAll(() => {
        CardCenter.setMainCardData(CardData);
    });

    var battle : Battle;
    var cardName : string = 'Healer1';
    
    var turn : number;
    var counterAttackCount: number;
    var otherCards : string[] = [];
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

    describe('補師', () => {
        test('緩補', () => {
            cardData = `{
                "coolDown": 3,
                "attackRule": [ {"type": "持續治療", "value": "50%", "turn": 2 } ],
                "skillLv3Rule": [ {"type": "持續治療", "value": "100%", "turn": 3} ]
            }`;
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(500);
            expect(battle.getTurnValue(cardName, 2)).toBeAround(1000);
        });

        test('緩補+我方緩補量增加', () => {
            cardData = `{
                "coolDown": 3,
                "attackRule": [ { "type": "我方受到持續治療增加", "value": "25%", "target": "全體" }, {"type": "持續治療", "value": "50%", "turn": 2 } ],
                "skillLv3Rule": [ {"type": "持續治療", "value": "100%", "turn": 3} ]
            }`;
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(625);
            expect(battle.getTurnValue(cardName, 2)).toBeAround(1250);
        });

    });

});
