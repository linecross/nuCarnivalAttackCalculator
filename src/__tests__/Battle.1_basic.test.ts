import { Battle, Team, Card, CardCenter } from '../BattleSystem.js';
import { ActionPattern } from '../Constants.js';
import CardData from './sample/cardData.json';
import '../jest/toBeAround.js';

describe('攻擊手＞基本單人測試：ATK=1000', () => {
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

    describe('無被動', () => {
        beforeEach(()=>{
            cardData = `{"coolDown": 3}`;
            skillTurns = [4];
            setupBattle();
        });

        test('連擊', () => {
            expect(battle.getTurnValue(cardName, 1)).toBeAround(1000);
            expect(battle.getTurnValue(cardName, 8)).toBeAround(1000);
        });

        test('必殺技=1000%', () => {
            expect(battle.getTurnValue(cardName, 4)).toBeAround(10000);
        });
    });

    describe('持續傷害測試', () => {
        test('持續傷害（無被動）', () => {
            cardData = `{
                "coolDown": 3,
                "attackRule": [ {"type": "持續傷害", "value": "50%", "turn": 4 } ],
                "skillLv3Rule": [ {"type": "持續傷害", "value": "200%", "turn": 3} ]
            }`;
            skillTurns = [4, 7, 10];
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(500);
            expect(battle.getTurnValue(cardName, 2)).toBeAround(1000);
            expect(battle.getTurnValue(cardName, 3)).toBeAround(1500);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(3500);
            expect(battle.getTurnValue(cardName, 5)).toBeAround(3500);
            expect(battle.getTurnValue(cardName, 6)).toBeAround(3500);
            expect(battle.getTurnValue(cardName, 7)).toBeAround(3000);
        });

        test('持續傷害（持續傷害增加）', () => {
            cardData = `{
                "coolDown": 3,
                "attackRule": [ {"type": "持續傷害", "value": "50%", "turn": 4 } ],
                "skillLv3Rule": [ {"type": "持續傷害", "value": "200%", "turn": 3} ],
                "pot6Rule": [ {"type": "持續傷害增加", "value": "15%"} ]
            }`;
            skillTurns = [4, 7, 10];
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(575);
            expect(battle.getTurnValue(cardName, 2)).toBeAround(1150);
            expect(battle.getTurnValue(cardName, 3)).toBeAround(1725);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(4025);
            expect(battle.getTurnValue(cardName, 5)).toBeAround(4025);
            expect(battle.getTurnValue(cardName, 6)).toBeAround(4025);
            expect(battle.getTurnValue(cardName, 7)).toBeAround(3450);
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

    describe('多次攻擊', () => {
        
        test('連擊100%（共300%）', () => {
            cardData = `{ "attackRule": [ {"type": "攻擊", "value": "100%", "maxCount": 3} ] }`;
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(3000);
        });

        test('攻擊100%，再攻擊300%（共400%）', () => {
            cardData = `{ "attackRule": [ {"type": "攻擊", "value": "100%"}, {"type": "攻擊", "value": "300%"} ] }`;
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(4000);
        });

        test('先攻擊100%，後提升攻擊力5% 6回合', () => {
            cardData = `{ "attackRule": [ {"type": "攻擊", "value": "100%"}, {"type": "攻擊力增加", "turn": 6, "value": "5%"} ] }`;
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(1000);
            expect(battle.getTurnValue(cardName, 2)).toBeAround(1050);
            expect(battle.getTurnValue(cardName, 6)).toBeAround(1250);
            expect(battle.getTurnValue(cardName, 7)).toBeAround(1250);
        });

        test('先提升攻擊力5% 6回合，後攻擊100%', () => {
            cardData = `{ "attackRule": [ {"type": "攻擊力增加", "turn": 6, "value": "5%"}, {"type": "攻擊", "value": "100%"} ] }`;
            setupBattle();

            expect(battle.getTurnValue(cardName, 1)).toBeAround(1050);
            expect(battle.getTurnValue(cardName, 2)).toBeAround(1100);
            expect(battle.getTurnValue(cardName, 6)).toBeAround(1300);
            expect(battle.getTurnValue(cardName, 7)).toBeAround(1300);
        });
    }); 

    describe('普攻追擊', () => {
        test('普攻100%，必殺技發動 普攻追擊80% 3回合', () => {
            cardData = `{ 
                "coolDown": 3,
                "skillLv3Rule": [ {"type": "攻擊", "value": "1000%"}, {"type": "普攻追擊", "value": "80%", "turn": 3} ] 
            }`;
            skillTurns = [4];
            setupBattle();

            expect(battle.getTurnValue(cardName, 3)).toBeAround(1000);
            expect(battle.getTurnValue(cardName, 4)).toBeAround(10000);
            expect(battle.getTurnValue(cardName, 5)).toBeAround(1800);
            expect(battle.getTurnValue(cardName, 6)).toBeAround(1800);
            expect(battle.getTurnValue(cardName, 7)).toBeAround(1000);
        });

        test('普攻100%，必殺技發動 普攻追擊80% 3回合（有普攻buff）', () => {
            cardData = `{ 
                "coolDown": 3,
                "skillLv3Rule": [ {"type": "攻擊", "value": "1000%"}, {"type": "普攻追擊", "value": "80%", "turn": 3} ], 
                "star3Rule": [
                    {"type": "普攻傷害增加", "value": "50%" }
                ] 
            }`;
            skillTurns = [4];
            setupBattle();

            expect(battle.getTurnValue(cardName, 4)).toBeAround(10000);
            expect(battle.getTurnValue(cardName, 5)).toBeAround(2700);
            expect(battle.getTurnValue(cardName, 6)).toBeAround(2700);
            expect(battle.getTurnValue(cardName, 7)).toBeAround(1500);
        });

        test('普攻100%，必殺技發動 普攻追擊80% 3回合（反擊3次，有普攻buff）', () => {
            cardData = `{ 
                "coolDown": 3,
                "skillLv3Rule": [ {"type": "攻擊", "value": "1000%"}, {"type": "普攻追擊", "value": "80%", "turn": 3} ], 
                "star3Rule": [
                    {"type": "必殺技傷害增加", "value": "20%" }
                ] 
            }`;
            skillTurns = [4];
            setupBattle();

            expect(battle.getTurnValue(cardName, 4)).toBeAround(12000);
            expect(battle.getTurnValue(cardName, 5)).toBeAround(1800);
            expect(battle.getTurnValue(cardName, 6)).toBeAround(1800);
            expect(battle.getTurnValue(cardName, 7)).toBeAround(1000);
        });
    });

    describe('反擊', () => {
        beforeEach(()=>{
            cardData = `{ 
                "coolDown": 3,
                "skillLv3Rule": [ {"type": "攻擊", "value": "1000%"}, {"type": "反擊", "value": "120%", "turn": 3, "maxCount": 99} ] 
            }`;
            skillTurns = [4];
            setupBattle();
        });

        test('必殺技1000%，必殺技發動 反擊120%（無反擊）', () => {
            counterAttackCount = 0;
            setupBattle();

            expect(battle.getTurnValue(cardName, 4)).toBeAround(10000);
        });

        test('必殺技1000%，必殺技發動 反擊120%（反擊1次）', () => {
            counterAttackCount = 1;
            setupBattle();

            expect(battle.getTurnValue(cardName, 4)).toBeAround(11200);
        });

        test('必殺技1000%，必殺技發動 反擊120%（反擊3次）', () => {
            counterAttackCount = 3;
            setupBattle();

            expect(battle.getTurnValue(cardName, 4)).toBeAround(13600);
        });

        test('必殺技1000%，必殺技發動 反擊120%（反擊3次，有必殺技buff）', () => {
            cardData = `{ 
                "coolDown": 3,
                "skillLv3Rule": [ {"type": "攻擊", "value": "1000%"}, {"type": "反擊", "value": "120%", "turn": 3, "maxCount": 99} ],
                "star3Rule": [
                    {"type": "必殺技傷害增加", "value": "50%" }
                ] 
            }`;
            counterAttackCount = 3;
            setupBattle();

            expect(battle.getTurnValue(cardName, 4)).toBeAround(20400);
        });

        test('必殺技1000%，必殺技發動 反擊120%（反擊3次，有造傷buff）', () => {
            cardData = `{ 
                "coolDown": 3,
                "skillLv3Rule": [ {"type": "攻擊", "value": "1000%"}, {"type": "反擊", "value": "120%", "turn": 3, "maxCount": 99} ],
                "star3Rule": [
                    {"type": "造成傷害增加", "value": "50%" }
                ] 
            }`;
            counterAttackCount = 3;
            setupBattle();

            expect(battle.getTurnValue(cardName, 4)).toBeAround(20400);
        });

        test('必殺技1000%，必殺技發動 反擊120%（反擊3次，有普攻buff）', () => {
            cardData = `{ 
                "coolDown": 3,
                "skillLv3Rule": [ {"type": "攻擊", "value": "1000%"}, {"type": "反擊", "value": "120%", "turn": 3, "maxCount": 99} ],
                "star3Rule": [
                    {"type": "普攻傷害增加", "value": "50%" }
                ] 
            }`;
            counterAttackCount = 3;
            setupBattle();

            expect(battle.getTurnValue(cardName, 4)).toBeAround(13600);
        });

    });

    
});
