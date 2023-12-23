import { Battle, Team, Card, CardCenter } from './BattleSystem.js';
import { CardData } from './SampleData.js';

CardCenter.setMainCardData(CardData);


// var cardList : Card[] = [];
// for (var name of Object.keys(CardData)){
// 	cardList[name] = Card.loadCardFromJson(name, CardData[name]);
// }

var team = new Team();

// team.addCard(CardCenter.loadCard('沙副'));
// team.addCard(CardCenter.loadCard('銀伊'));
// team.addCard(CardCenter.loadCard('SR奧'));
// team.addCard(CardCenter.loadCard('錆玖'));
// team.addCard(CardCenter.loadCard('SR八雲'));
// team.addCard(CardCenter.loadCard('常副'));
// team.addCard(CardCenter.loadCard('常奧'));
// team.addCard(CardCenter.loadCard('煙可'));
// team.addCard(CardCenter.loadCard('月崑'));
// team.addCard(CardCenter.loadCard('火狐'));
// team.addCard(CardCenter.loadCard('學八'));
// team.addCard(CardCenter.loadCard('SR崑西'));
// team.addCard(CardCenter.loadCard('夏啖'));
// team.addCard(CardCenter.loadCard('學奧'));
// team.addCard(CardCenter.loadCard('春玖'));

// team.addCard(CardCenter.loadCard('SR艾斯特'));
// team.addCard(CardCenter.loadCard('聖崑'));
// team.addCard(CardCenter.loadCard('沙啖'));
// team.addCard(CardCenter.loadCard('錆歛'));
// team.addCard(CardCenter.loadCard('賭墨'));
// team.addCard(CardCenter.loadCard('雨歛'));
// team.addCard(CardCenter.loadCard('霜副'));
// team.addCard(CardCenter.loadCard('SR八雲'));


// team.addCard(CardCenter.loadCard('春玖'));
// team.addCard(CardCenter.loadCard('測試'));
// team.addCard(CardCenter.loadCard('鍍副'));
team.addCard(CardCenter.loadCard('血鑰．啖天'));
// team.addCard(CardCenter.loadCard('測試'));
// team.addCard(CardCenter.loadCard('測試２號'));
// team.addCard(CardCenter.loadCard('軍布'));


CardCenter.setupDefaultTeamStar(team, 3, 5);

var battle = new Battle(team, 14);
battle.init();
battle.counterAttackCount = 1;
battle.printEnemeyOption = true;
// battle.team.getCard('測試').atk=1000;
// battle.team.getCard('測試２號').atk=1000;
// battle.enemyElement = '木';
battle.printOutputOption = Battle.PRINT_OUTPUT_OPTION.ALL;

// battle.team.updateActionOrder(['錆歛', 'SR奧']);

// battle.team.getCard('錆歛').potential = 11;
// console.info(battle.team.getCard('錆歛').getPotentialPercent('atk', 12));
// console.info(battle.team.getCard('錆歛').getAtk());


// battle.setActionPattern('SR副團', ActionPattern.Manual);
// battle.setManualActionPattern('SR副團', [5, 7], [6, 7]);

// battle.setActionPattern('SR奧', ActionPattern.AddCD2Ahead1Turn);
// battle.setActionPattern('SR艾斯特', ActionPattern.AddCD2);
// battle.setActionPattern('SR艾斯特', ActionPattern.ImmediatelyAfter1);
// battle.setActionPattern('SR副團', ActionPattern.Delay1TurnAfter1);

// console.info('==================傷害計算機=======================');
battle.startBattle();
battle.printResult();
console.info('總傷害：'+battle.getTeamTotalDamage());
// console.info('=================================================');