import { Battle } from '../BattleSystem.js';
import { Team, Card, CardCenter } from '../Card.js';
import { ActionPattern } from '../Constants.js';
import CardData from '../../res/json/cardData.json';
import '../jest/toBeAround.js';

describe('實際測試', () => {
    beforeAll(() => {
        CardCenter.setMainCardData(CardData);
    });

    var battle : Battle;
    
    var turn : number;
    var counterAttackCount: number;
    var cards : string[] = [];
    var cardData : string;
    var skillTurns : number[];
    var guardTurns : number[];

    beforeEach(() => {
        turn = 14;
        counterAttackCount = 1;
        cardData = '{}';
        skillTurns = [];
        guardTurns = [];
    });

    function setupBattle(): Battle{
        var team = new Team();
        for (var name of cards){
            team.addCard(loadCard(name));
        }
        CardCenter.setupDefaultTeamStar(team, 3, 5);

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

    describe('輔助+攻擊手組合', () => {

        test('Quick test', () => {
            cards = ['迷夢．八雲','SR艾德蒙特']
            // cards = ['迷夢．八雲']
            setupBattle();

            console.info(battle.getTurnRuleLogStr('迷夢．八雲', 1));
        });

        test('SR奧+學八+月崑+賭艾+賭墨', () => {
            cards = ['SR奧利文', '學院．八雲', '雙月．崑西', '賭場．艾斯特', '賭場．墨菲']
            setupBattle();

            expect(battle.getTurnValue('賭場．艾斯特', 13)).toBeAround(45321);
            expect(battle.getTurnValue('賭場．墨菲', 13)).toBeAround(61179);

            expect(battle.getTurnValue('學院．八雲', 14)).toBeAround(85240);
            expect(battle.getTurnValue('雙月．崑西', 14)).toBeAround(90506);
            
            expect(battle.getTotalValue('學院．八雲')).toBeAround(525177);
            expect(battle.getTotalValue('雙月．崑西')).toBeAround(487897);
            expect(battle.getTotalValue('賭場．艾斯特')).toBeAround(334733);
            expect(battle.getTotalValue('賭場．墨菲')).toBeAround(426602);
        });

        test('SR奧+普八+軍布+霜狼+偶奧', () => {
            cards = ['SR奧利文', '常駐．八雲', '軍服．布儡', '晶霜．可爾', '偶像．奧利文']
            setupBattle();

            expect(battle.getTurnValue('常駐．八雲', 13)).toBeAround(45900);
            expect(battle.getTurnValue('軍服．布儡', 13)).toBeAround(74218);
            expect(battle.getTurnValue('晶霜．可爾', 13)).toBeAround(86148);
            expect(battle.getTurnValue('偶像．奧利文', 13)).toBeAround(72054);
            
            expect(battle.getTotalValue('常駐．八雲')).toBeAround(282752);
            expect(battle.getTotalValue('軍服．布儡')).toBeAround(290204);
            expect(battle.getTotalValue('晶霜．可爾')).toBeAround(398615);
            expect(battle.getTotalValue('偶像．奧利文')).toBeAround(424566);
        });

        test('學奧+普八+軍布+霜狼+偶奧', () => {
            cards = ['學院．奧利文', '白情．八雲', '追夏．啖天', '沙漠．啖天', 'SR崑西']
            setupBattle();

            expect(battle.getTurnValue('白情．八雲', 13)).toBeAround(98234);
            expect(battle.getTurnValue('追夏．啖天', 13)).toBeAround(92322);
            expect(battle.getTurnValue('沙漠．啖天', 13)).toBeAround(189762);
            expect(battle.getTurnValue('SR崑西', 13)).toBeAround(337611);
            
            expect(battle.getTotalValue('白情．八雲')).toBeAround(489430);
            expect(battle.getTotalValue('追夏．啖天')).toBeAround(508487);
            expect(battle.getTotalValue('沙漠．啖天')).toBeAround(924315);
            expect(battle.getTotalValue('SR崑西')).toBeAround(806565);
        });

        test('錆玖+鍍副+血啖+血奧+煙八', () => {
            cards = ['錆色．玖夜', '鍍金．艾德蒙特', '血鑰．啖天', '血鑰．奧利文', '煙嵐．八雲']
            setupBattle();

            expect(battle.getTurnValue('鍍金．艾德蒙特', 13)).toBeAround(83423);
            expect(battle.getTurnValue('血鑰．啖天', 13)).toBeAround(121722);
            expect(battle.getTurnValue('血鑰．奧利文', 13)).toBeAround(282102);
            expect(battle.getTurnValue('煙嵐．八雲', 13)).toBeAround(347142);
            
            expect(battle.getTotalValue('鍍金．艾德蒙特')).toBeAround(467377);
            expect(battle.getTotalValue('血鑰．啖天')).toBeAround(635547);
            expect(battle.getTotalValue('血鑰．奧利文')).toBeAround(792364);
            expect(battle.getTotalValue('煙嵐．八雲')).toBeAround(1031766);
        });

        test('聖啖+學八+常副+錆歛+SR艾斯特', () => {
            cards = ['聖夜．啖天', '學院．八雲', '常駐．艾德蒙特', '錆色．歛', 'SR艾斯特']
            setupBattle();

            expect(battle.getTurnValue('學院．八雲', 14)).toBeAround(56045);
            expect(battle.getTurnValue('常駐．艾德蒙特', 14)).toBeAround(41399);
            expect(battle.getTurnValue('錆色．歛', 14)).toBeAround(46386);
            expect(battle.getTurnValue('SR艾斯特', 14)).toBeAround(21765);
            
            expect(battle.getTotalValue('學院．八雲')).toBeAround(493204);
            expect(battle.getTotalValue('常駐．艾德蒙特')).toBeAround(427183);
            expect(battle.getTotalValue('錆色．歛')).toBeAround(549209);
            expect(battle.getTotalValue('SR艾斯特')).toBeAround(328275);
        });

    });

});
