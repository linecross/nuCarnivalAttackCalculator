import { Battle, Team, Card, CardCenter } from '../BattleSystem.js';
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
            cards = ['血鑰．奧利文']
            setupBattle();

            console.info(battle.getTurnRuleLogStr('血鑰．奧利文', 7));
        });

        test('SR奧+學八+月崑+賭艾+賭墨', () => {
            cards = ['SR奧利文', '學院．八雲', '雙月．崑西', '賭場．艾斯特', '賭場．墨菲']
            setupBattle();

            expect(battle.getTurnValue('賭場．艾斯特', 13)).toBeAround(43403);
            expect(battle.getTurnValue('賭場．墨菲', 13)).toBeAround(58578);

            expect(battle.getTurnValue('學院．八雲', 14)).toBeAround(82208);
            expect(battle.getTurnValue('雙月．崑西', 14)).toBeAround(87250);
            
            expect(battle.getTotalValue('學院．八雲')).toBeAround(502806);
            expect(battle.getTotalValue('雙月．崑西')).toBeAround(467939);
            expect(battle.getTotalValue('賭場．艾斯特')).toBeAround(319473);
            expect(battle.getTotalValue('賭場．墨菲')).toBeAround(369272);
        });

        test('SR奧+普八+軍布+霜狼+偶奧', () => {
            cards = ['SR奧利文', '常駐．八雲', '軍服．布儡', '晶霜．可爾', '偶像．奧利文']
            setupBattle();

            expect(battle.getTurnValue('常駐．八雲', 13)).toBeAround(43882);
            expect(battle.getTurnValue('軍服．布儡', 13)).toBeAround(71058);
            expect(battle.getTurnValue('晶霜．可爾', 13)).toBeAround(82746);
            expect(battle.getTurnValue('偶像．奧利文', 13)).toBeAround(68970);
            
            expect(battle.getTotalValue('常駐．八雲')).toBeAround(269600);
            expect(battle.getTotalValue('軍服．布儡')).toBeAround(277464);
            expect(battle.getTotalValue('晶霜．可爾')).toBeAround(381960);
            expect(battle.getTotalValue('偶像．奧利文')).toBeAround(405183);
        });

        test('學奧+普八+軍布+霜狼+偶奧', () => {
            cards = ['學院．奧利文', '白情．八雲', '追夏．啖天', '沙漠．啖天', 'SR崑西']
            setupBattle();

            expect(battle.getTurnValue('白情．八雲', 13)).toBeAround(92465);
            expect(battle.getTurnValue('追夏．啖天', 13)).toBeAround(86235);
            expect(battle.getTurnValue('沙漠．啖天', 13)).toBeAround(178611);
            expect(battle.getTurnValue('SR崑西', 13)).toBeAround(327075);
            
            expect(battle.getTotalValue('白情．八雲')).toBeAround(460677);
            expect(battle.getTotalValue('追夏．啖天')).toBeAround(474357);
            expect(battle.getTotalValue('沙漠．啖天')).toBeAround(869967);
            expect(battle.getTotalValue('SR崑西')).toBeAround(783089);
        });

        test('錆玖+鍍副+血啖+血奧+煙八', () => {
            cards = ['錆色．玖夜', '鍍金．艾德蒙特', '血鑰．啖天', '血鑰．奧利文', '煙嵐．八雲']
            setupBattle();

            expect(battle.getTurnValue('鍍金．艾德蒙特', 13)).toBeAround(81360);
            expect(battle.getTurnValue('血鑰．啖天', 13)).toBeAround(108750);
            expect(battle.getTurnValue('血鑰．奧利文', 13)).toBeAround(275010);
            expect(battle.getTurnValue('煙嵐．八雲', 13)).toBeAround(336259);
            
            expect(battle.getTotalValue('鍍金．艾德蒙特')).toBeAround(452591);
            expect(battle.getTotalValue('血鑰．啖天')).toBeAround(576300);
            expect(battle.getTotalValue('血鑰．奧利文')).toBeAround(768827);
            expect(battle.getTotalValue('煙嵐．八雲')).toBeAround(995491);
        });

        test('聖啖+學八+常副+錆歛+SR艾斯特', () => {
            cards = ['聖夜．啖天', '學院．八雲', '常駐．艾德蒙特', '錆色．歛', 'SR艾斯特']
            setupBattle();

            expect(battle.getTurnValue('學院．八雲', 14)).toBeAround(52746);
            expect(battle.getTurnValue('常駐．艾德蒙特', 14)).toBeAround(38964);
            expect(battle.getTurnValue('錆色．歛', 14)).toBeAround(43656);
            expect(battle.getTurnValue('SR艾斯特', 14)).toBeAround(21765);
            
            expect(battle.getTotalValue('學院．八雲')).toBeAround(464190);
            expect(battle.getTotalValue('常駐．艾德蒙特')).toBeAround(402057);
            expect(battle.getTotalValue('錆色．歛')).toBeAround(516900);
            expect(battle.getTotalValue('SR艾斯特')).toBeAround(324643);
        });

    });

});
