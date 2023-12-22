import { Battle, Team, Card, CardCenter } from '../BattleSystem';
import { Rarity, ActionPattern } from '../Constants';
import { CardData } from '../SampleData';

test('adds 1 + 2 to equal 3', () => {
    CardCenter.setMainCardData(CardData);
    var team = new Team();

    team.addCard(CardCenter.loadCard('血鑰．啖天'));
    CardCenter.setupDefaultTeamStar(team, 3, 5);

    var battle = new Battle(team, 14);
    battle.init();
    battle.counterAttackCount = 1;
    battle.printEnemeyOption = true;
    battle.startBattle();

    expect(battle.getTeamTotalDamage()).toBe(203445);
});