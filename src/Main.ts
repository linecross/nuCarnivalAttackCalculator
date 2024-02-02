import { Battle, Team, Card, CardCenter } from './BattleSystem.js';
import CardData from '../res/json/cardData.json';

CardCenter.setMainCardData(CardData);

var rule = '{ "coolDown": 3 }';


var team = new Team();

// team.addCard(CardCenter.loadCard('SR八雲'));
// team.addCard(CardCenter.loadCard('錆色．歛'));
// team.addCard(CardCenter.loadCard('測試').updateCard(JSON.parse(rule)));
// team.addCard(CardCenter.loadCard('測試２號'));
// team.addCard(CardCenter.loadCard('軍布'));

// team.addCard(CardCenter.loadCard('測試２號'));
team.addCard(CardCenter.loadCard('白情．八雲'));



CardCenter.setupDefaultTeamStar(team, 5, 5);

var battle = new Battle(team, 10);
battle.init();
// battle.counterAttackCount = 1;
battle.printEnemeyOption = true;
// battle.enemyElement = '木';
battle.printOutputOption = Battle.PRINT_OUTPUT_OPTION.ALL;

// battle.setActionPattern('測試', ActionPattern.Manual);
// battle.setManualActionPattern('測試', [4]);

// battle.team.updateActionOrder(['錆歛', 'SR奧']);

// battle.team.getCard('錆歛').potential = 11;
// console.info(battle.team.getCard('錆歛').getPotentialPercent('atk', 12));
// console.info(battle.team.getCard('錆歛').getAtk());




// battle.setActionPattern('SR奧', ActionPattern.AddCD2Ahead1Turn);
// battle.setActionPattern('SR艾斯特', ActionPattern.AddCD2);
// battle.setActionPattern('SR艾斯特', ActionPattern.ImmediatelyAfter1);
// battle.setActionPattern('SR副團', ActionPattern.Delay1TurnAfter1);

// console.info('==================傷害計算機=======================');
battle.startBattle();
battle.printResult();
console.info('總傷害：'+battle.getTeamTotalDamage());
// console.info('=================================================');