import { Battle, Team, Card, CardCenter } from '../BattleSystem.js';
import { ActionPattern } from '../Constants.js';
import CardData from './sample/cardData.json';
import '../jest/toBeAround.js';

describe('輔助測試', () => {
    beforeAll(() => {
        CardCenter.setMainCardData(CardData);
    });

    var battle : Battle;
    var cardName : string = 'Support1';
    
    var turn : number;
    var counterAttackCount: number;
    var otherCards : string[] = ['Striker1', 'Striker2', 'Guard1', 'Healer1'];
    var cardData : string;
    var skillTurns : number[];
    var guardTurns : number[];

    beforeEach(() => {
        turn = 20;
        counterAttackCount = 1;
        cardData = '{}';
        otherCards = ['Striker1', 'Striker2', 'Guard1', 'Healer1'];
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

    describe('泛用輔助', () => {
        test('輔助（4CD，無被動）', () => {
            setupBattle();

            expect(battle.getTurnValue('Striker1', 1)).toBeAround(1300);
            expect(battle.getTurnValue('Striker2', 1)).toBeAround(1300);

            expect(battle.getTurnValue('Striker1', 5)).toBeAround(2000);
            expect(battle.getTurnValue('Striker2', 5)).toBeAround(2000);

            expect(battle.getTurnValue('Striker1', 6)).toBeAround(2300);
            expect(battle.getTurnValue('Striker2', 6)).toBeAround(2300);
        });

        test('被動：全體攻擊力增加 20%（永久）', () => {
            cardData = `{ 
                "atk": 0,
                "star3Rule": [ {"type": "攻擊力增加", "value": "20%", "target": "全體"} ] 
            }`;
            setupBattle();

            expect(battle.getTurnValue('Striker1', 1)).toBeAround(1200);
            expect(battle.getTurnValue('Striker2', 1)).toBeAround(1200);

            expect(battle.getTurnValue('Striker1', 4)).toBeAround(12000);
            expect(battle.getTurnValue('Striker2', 4)).toBeAround(12000);
        });

        test('被動：攻擊手必殺技傷害增加 20%（永久）', () => {
            cardData = `{ 
                "atk": 0,
                "star3Rule": [ {"type": "必殺技傷害增加", "value": "20%", "target": {"type": "定位", "value": ["攻擊"] } } ] 
            }`;
            setupBattle();

            expect(battle.getTurnValue('Striker1', 1)).toBeAround(1000);
            expect(battle.getTurnValue('Guard1', 1)).toBeAround(1000);

            expect(battle.getTurnValue('Striker1', 4)).toBeAround(12000);
            expect(battle.getTurnValue('Guard1', 4)).toBeAround(10000);
        });

        test('被動：全體（除了攻擊手）普攻傷害增加 20%（永久）', () => {
            cardData = `{ 
                "atk": 0,
                "star3Rule": [ {"type": "普攻傷害增加", "value": "20%", "target": {"type": "全體", "exceptType": "定位", "exceptValue": "攻擊" } } ] 
            }`;
            setupBattle();

            expect(battle.getTurnValue('Striker1', 1)).toBeAround(1000);
            expect(battle.getTurnValue('Guard1', 1)).toBeAround(1200);

            expect(battle.getTurnValue('Striker1', 4)).toBeAround(10000);
            expect(battle.getTurnValue('Guard1', 4)).toBeAround(10000);

            expect(battle.getTurnValue('Striker1', 5)).toBeAround(1000);
            expect(battle.getTurnValue('Guard1', 5)).toBeAround(1200);
        });

        test('被動：某角色造成傷害增加 20%（永久）', () => {
            cardData = `{ 
                "atk": 0,
                "star3Rule": [ {"type": "造成傷害增加", "value": "20%", "target": {"type": "角色", "value": "test1" } } ] 
            }`;
            setupBattle();

            expect(battle.getTurnValue('Striker1', 1)).toBeAround(1200);
            expect(battle.getTurnValue('Guard1', 1)).toBeAround(1200);
            expect(battle.getTurnValue('Striker2', 1)).toBeAround(1000);

            expect(battle.getTurnValue('Striker1', 4)).toBeAround(12000);
            expect(battle.getTurnValue('Guard1', 4)).toBeAround(12000);
            expect(battle.getTurnValue('Striker2', 4)).toBeAround(10000);
        });

        test('被動：必殺技時，攻擊力增加10%（最多2層）（永久）', () => {
            cardData = `{ 
                "atk": 0,
                "star3Rule": [ {"type": "攻擊力增加", "value": "10%", "target": {"type": "全體"}, "maxCount": 2, "condition": {"type": "攻擊方式", "value": "必殺技"} } ] 
            }`;
            setupBattle();

            expect(battle.getTurnValue('Striker1', 1)).toBeAround(1000);
            expect(battle.getTurnValue('Guard1', 1)).toBeAround(1000);

            expect(battle.getTurnValue('Striker1', 5)).toBeAround(1100);
            expect(battle.getTurnValue('Guard1', 5)).toBeAround(1100);
            
            expect(battle.getTurnValue('Striker1', 7)).toBeAround(11000);
            expect(battle.getTurnValue('Guard1', 7)).toBeAround(11000);

            expect(battle.getTurnValue('Striker1', 9)).toBeAround(1200);
            expect(battle.getTurnValue('Guard1', 9)).toBeAround(1200);

            expect(battle.getTurnValue('Striker1', 10)).toBeAround(12000);
            expect(battle.getTurnValue('Guard1', 10)).toBeAround(12000);

            expect(battle.getTurnValue('Striker1', 14)).toBeAround(1200);
            expect(battle.getTurnValue('Guard1', 14)).toBeAround(1200);
        });

        test('被動：必殺技時，全體造成傷害增加15%（3回合）', () => {
            cardData = `{ 
                "atk": 0,
                "star3Rule": [ {"type": "造成傷害增加", "value": "15%", "target": {"type": "全體"}, "turn": 3, "condition": {"type": "攻擊方式", "value": "必殺技"} } ] 
            }`;
            setupBattle();

            expect(battle.getTurnValue('Striker1', 1)).toBeAround(1000);
            expect(battle.getTurnValue('Guard1', 1)).toBeAround(1000);

            expect(battle.getTurnValue('Striker1', 5)).toBeAround(1150);
            expect(battle.getTurnValue('Guard1', 5)).toBeAround(1150);

            expect(battle.getTurnValue('Striker1', 7)).toBeAround(11500);
            expect(battle.getTurnValue('Guard1', 7)).toBeAround(11500);

            expect(battle.getTurnValue('Striker1', 8)).toBeAround(1000);
            expect(battle.getTurnValue('Striker1', 8)).toBeAround(1000);
        });
    });

    describe('普攻輔助', () => {
        test('必殺時，全體攻擊手獲得普攻追擊（3回合）', () => {
            cardData = `{ 
                "atk": 0,
                "skillLv3Rule": [ {"type": "普攻追擊", "value": "80%", "target": {"type": "定位", "value": "攻擊"}, "turn": 3 } ] 
            }`;
            setupBattle();

            expect(battle.getTurnValue('Striker1', 1)).toBeAround(1000);

            expect(battle.getTurnValue('Striker1', 5)).toBeAround(1800);
            expect(battle.getTurnValue('Striker2', 5)).toBeAround(1800);
            expect(battle.getTurnValue('Guard1', 5)).toBeAround(1000);

            expect(battle.getTurnValue('Striker1', 6)).toBeAround(1800);
            expect(battle.getTurnValue('Striker2', 6)).toBeAround(1800);

            expect(battle.getTurnValue('Striker1', 7)).toBeAround(10000);
            expect(battle.getTurnValue('Striker2', 7)).toBeAround(10000);

            expect(battle.getTurnValue('Striker1', 8)).toBeAround(1000);
            expect(battle.getTurnValue('Striker2', 8)).toBeAround(1000);
        });

        test('必殺時，2、4位攻擊手獲得普攻追擊（2回合）', () => {
            cardData = `{ 
                "atk": 0,
                "skillLv3Rule": [ {"type": "普攻追擊", "value": "120%", "target": {"type": "位置", "value": [2, 4]}, "turn": 2 } ] 
            }`;
            setupBattle();

            expect(battle.getTurnValue('Striker1', 1)).toBeAround(1000);

            expect(battle.getTurnValue('Striker1', 5)).toBeAround(2200);
            expect(battle.getTurnValue('Striker2', 5)).toBeAround(1000);
            expect(battle.getTurnValue('Guard1', 5)).toBeAround(2200);

            expect(battle.getTurnValue('Striker1', 6)).toBeAround(2200);
            expect(battle.getTurnValue('Guard1', 6)).toBeAround(2200);

            expect(battle.getTurnValue('Striker1', 8)).toBeAround(1000);
            expect(battle.getTurnValue('Guard1', 8)).toBeAround(1000);
        });
    });
});
