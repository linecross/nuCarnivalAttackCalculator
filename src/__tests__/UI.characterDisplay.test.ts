import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const root = process.cwd();
const html = readFileSync(`${root}/Main.html`, 'utf8');
const css = readFileSync(`${root}/res/css/main.css`, 'utf8');
const source = readFileSync(`${root}/res/js/uiMain.js`, 'utf8');
const chartHtml = readFileSync(`${root}/CharacterLevels.html`, 'utf8');
const chartSource = readFileSync(`${root}/res/js/charStatMain.js`, 'utf8');

function makeChartApp(cardData: Record<string, any>) {
    let options: any;
    const Vue = { createApp: (app: any) => {
        options = app;
        return { mount: () => ({}) };
    } };
    const fetch = jest.fn(async () => ({ json: async () => cardData }));
    runInNewContext(chartSource, { Vue, fetch, console: { info: () => {} } });
    const app = Object.assign(options.data(), options.methods);
    for (const [name, getter] of Object.entries(options.computed) as [string, any][]) {
        Object.defineProperty(app, name, { get: () => getter.call(app) });
    }
    options.created.call(app);
    return { app, fetch, selectGroup: (name: string) => {
        app.input.charName = name;
        options.watch['input.charName'].call(app);
    }, selectCard: (name: string) => {
        app.input.charId = name;
        options.watch['input.charId'].call(app);
    } };
}

function makeApp(saved: object | null = null, cardData: Record<string, any> = {}) {
    let options: any;
    let stored = saved == null ? null : JSON.stringify(saved);
    const localStorage = {
        getItem: jest.fn(() => stored),
        setItem: jest.fn((_key: string, value: string) => { stored = value; }),
    };
    const Vue = { createApp: (app: any) => {
        options = app;
        return { mount: () => ({}) };
    } };
    const constants = {
        Character: { Yakumo: '八雲', Edmond: '艾德蒙特', Olivine: '奧利文', Quincy: '崑西',
            Kuya: '玖夜', Garu: '可爾', Blade: '布儡', Dante: '啖天', Rei: '歛',
            Aster: '艾斯特', Morvay: '墨菲', Eiden: '伊得' },
        Rarity: {}, Class: {}, Element: { NA: 'N/A' },
        AttackType: {}, ActionPattern: { Immediately: 'immediately' },
        CounterAttackMode: { everyTurn: 'everyTurn' }, ConditionHPStatus: {},
        Condition: { HP_STATUS: {} }, Battle: { PRINT_OUTPUT_OPTION: { ALL: 'all' } },
        CardCenter: {
            getCardData: () => cardData,
            loadCardBasic: (name: string) => ({ ...cardData[name], getActualHp: () => 1000, getAtk: () => 1000 }),
        },
    };
    runInNewContext(source.replace(/^import .*;\r?\n/gm, ''), { Vue, localStorage, document: {
        documentElement: { setAttribute: () => {}, classList: '' },
    }, ...constants });
    const app = Object.assign(options.data(), options.methods, options.computed);
    return { app, localStorage, getStored: () => JSON.parse(stored!) };
}

test('CharacterLevels groups unknown identities under Other and reconciles selections', async () => {
    const cardData = {
        'SR八雲': { char: '八雲', baseHp: 1000, baseAtk: 800, potType: 'HP先行', rarity: 'SR' },
        '蒼葉卡': { char: '蒼葉', baseHp: 1200, baseAtk: 900, potType: 'ATK先行', rarity: 'SSR' },
        '環卡': { char: '環', baseHp: 1500, baseAtk: 1100, potType: '平均型', rarity: 'SSR' },
        '無角色': { char: '', baseHp: 500, baseAtk: 500, potType: 'NR卡', rarity: 'N' },
    };
    const { app, fetch, selectGroup } = makeChartApp(cardData);
    expect(fetch).toHaveBeenCalledWith('./res/json/cardData.json');
    expect(app.currentChar).toBeUndefined();
    expect(app.calculateCharValue('其他', '環卡', 1, 60, 0, 0, 'hp')).toBeUndefined();
    await new Promise(resolve => setImmediate(resolve));
    expect(app.CHAR_NAMES).toEqual(['八雲','艾德蒙特','奧利文','崑西','玖夜','可爾','布儡','啖天','歛','艾斯特','墨菲','伊得']);
    expect(Object.keys(app.charData['其他'])).toEqual(['環卡', '蒼葉卡']);
    expect(app.charData['其他']['環卡']).toEqual({ hp: 1500, atk: 1100, potType: 'C', rarity: 'SSR' });
    expect(app.charData['其他']).not.toHaveProperty('無角色');
    expect(app.input.charName).toBe('八雲');
    expect(app.input.charId).toBe('SR八雲');
    expect(chartHtml).toMatch(/<option v-if="Object\.keys\(charData\['其他'\] \|\| \{\}\)\.length" value="其他">其他<\/option>/);
    selectGroup('其他');
    expect(app.input.charId).toBe('環卡');
    expect(app.currentChar.hp).toBe(1500);
    expect(app.calculateCharValue('其他', app.input.charId, 1, 60, 0, 0, 'hp')).toEqual(expect.any(Number));
    app.input.charId = '蒼葉卡';
    selectGroup('其他');
    expect(app.input.charId).toBe('蒼葉卡');
    expect(app.currentChar.atk).toBe(900);
    selectGroup('八雲');
    expect(app.input.charId).toBe('SR八雲');
    expect(app.currentChar.hp).toBe(1000);
    expect(cardData['環卡'].char).toBe('環');
    expect(cardData['蒼葉卡'].char).toBe('蒼葉');
});

test('CharacterLevels handles category changes before fetch and empty groups without stale stats', async () => {
    const cardData = {
        'SR八雲': { char: '八雲', baseHp: 1000, baseAtk: 800, potType: 'HP先行', rarity: 'SR' },
        '蒼葉卡': { char: '蒼葉', baseHp: 1200, baseAtk: 900, potType: 'ATK先行', rarity: 'SSR' },
    };
    const { app, selectGroup } = makeChartApp(cardData);
    selectGroup('其他');
    expect(app.input.charId).toBe('');
    expect(app.currentChar).toBeUndefined();
    await new Promise(resolve => setImmediate(resolve));
    expect(app.input.charId).toBe('蒼葉卡');
    expect(app.currentChar.hp).toBe(1200);
    selectGroup('艾德蒙特');
    expect(app.input.charId).toBe('');
    expect(app.currentChar).toBeUndefined();
    expect(app.calculateCharValue('艾德蒙特', '', 1, 60, 0, 0, 'hp')).toBe('');
    expect(app.calculateBattlePower('艾德蒙特', '', 1, 60, 0, 0, 0)).toBe('');
    selectGroup('八雲');
    expect(app.input.charId).toBe('SR八雲');
    expect(app.currentChar.hp).toBe(1000);

    const knownOnly = makeChartApp({ 'SR八雲': cardData['SR八雲'] });
    await new Promise(resolve => setImmediate(resolve));
    expect(knownOnly.app.charData).not.toHaveProperty('其他');
    expect(knownOnly.app.input.charId).toBe('SR八雲');
});

test('Other character selection is shared across card, sort and tier filters without changing identities', () => {
    const cardData = {
        known: { char: '八雲', rarity: 'SSR' },
        aoba: { char: '蒼葉', rarity: 'SSR' },
        future: { char: '環', rarity: 'SSR' },
        blank: { char: '', rarity: 'SSR' },
    };
    const { app } = makeApp(null, cardData);
    const results = () => [
        app.getFilteredCards().map(([name]: [string]) => name),
        app.getSortCards().map((card: { char: string }) => card.char),
        app.getTierListPoolCards(),
    ];
    const all = results();
    expect(all.every((list: string[]) => list.length === 4)).toBe(true);
    app.cardFilter.char = ['其他'];
    app.cardHpAtkSort.char = ['其他'];
    app.tierList.poolFilter.char = ['其他'];
    expect(results()).toEqual([['future', 'aoba'], ['環', '蒼葉'], ['future', 'aoba']]);
    app.cardFilter.char = ['八雲', '其他'];
    app.cardHpAtkSort.char = ['八雲', '其他'];
    app.tierList.poolFilter.char = ['八雲', '其他'];
    const mixed = results();
    expect(mixed[0]).toEqual(['future', 'aoba', 'known']);
    expect(mixed[1]).toEqual(['環', '蒼葉', '八雲']);
    expect(mixed[2]).toEqual(['future', 'aoba', 'known']);
    expect(cardData.aoba.char).toBe('蒼葉');
    expect(cardData.future.char).toBe('環');
});

test('Other and a known character remain a union under rarity, class, CD and search constraints', () => {
    const cardData = {
        edmond: { char: '艾德蒙特', rarity: 'SSR', class: '攻擊', coolDown: 3 },
        aoba: { char: '蒼葉', rarity: 'SSR', class: '攻擊', coolDown: 3 },
        otherSr: { char: '環', rarity: 'SR', class: '攻擊', coolDown: 3 },
        otherHeal: { char: '環', rarity: 'SSR', class: '治療', coolDown: 3 },
        otherCd: { char: '環', rarity: 'SSR', class: '攻擊', coolDown: 4 },
        missing: { rarity: 'SSR', class: '攻擊', coolDown: 3 },
        empty: { char: '', rarity: 'SSR', class: '攻擊', coolDown: 3 },
        whitespace: { char: ' ', rarity: 'SSR', class: '攻擊', coolDown: 3 },
    };
    const { app } = makeApp(null, cardData);
    const selected = ['艾德蒙特', '其他'];
    for (const filter of [app.cardFilter, app.cardHpAtkSort, app.tierList.poolFilter]) {
        filter.char = selected;
        filter.rarity = ['SSR'];
        filter.clazz = ['攻擊'];
        filter.coolDown = [3];
    }
    app.tierList.tiers[0].cards.push('aoba');
    expect(app.getFilteredCards().map(([name]: [string]) => name)).toEqual(['whitespace', 'aoba', 'edmond']);
    expect(app.getSortCards().map((card: { char: string }) => card.char)).toEqual([' ', '蒼葉', '艾德蒙特']);
    expect(app.getTierListPoolCards()).toEqual(['whitespace', 'edmond']);
    app.cardFilter.searchStr = '艾德蒙特 SSR -蒼葉';
    expect(app.getFilteredCards().map(([name]: [string]) => name)).toEqual(['edmond']);
    expect(cardData.edmond.char).toBe('艾德蒙特');
    expect(cardData.aoba.char).toBe('蒼葉');
});

test('CharacterLevels Other preserves numeric formulas and resets room and potential for N and R cards', async () => {
    const { app, selectGroup, selectCard } = makeChartApp({
        'SR八雲': { char: '八雲', baseHp: 1000, baseAtk: 800, potType: 'HP先行', rarity: 'SR' },
        otherSsr: { char: '蒼葉', baseHp: 1500, baseAtk: 1100, potType: '平均型', rarity: 'SSR' },
        otherN: { char: '蒼葉', baseHp: 500, baseAtk: 300, potType: 'NR卡', rarity: 'N' },
        otherR: { char: '蒼葉', baseHp: 700, baseAtk: 400, potType: 'NR卡', rarity: 'R' },
    });
    await new Promise(resolve => setImmediate(resolve));
    selectGroup('其他');
    selectCard('otherSsr');
    expect(app.getRoomPercentage('2房')).toBe(15);
    const hp = app.calculateCharValue('其他', 'otherSsr', 5, 60, 15, 0, 'hp');
    const atk = app.calculateCharValue('其他', 'otherSsr', 5, 60, 15, 0, 'atk');
    const formula = (base: number) => Math.floor(Math.ceil(base / Math.pow(Math.fround(1.05), 59))
        * Math.pow(Math.fround(1.05), 59) * Math.fround(1.15));
    expect(hp).toBe(formula(1500));
    expect(atk).toBe(formula(1100));
    expect(app.calculateBattlePower('其他', 'otherSsr', 5, 60, 15, 0, 0)).toBe(hp + 5 * atk);
    app.input.room = '5房';
    app.input.potential = 12;
    selectCard('otherN');
    expect(app.input.room).toBe('無');
    expect(app.input.potential).toBe(1);
    expect(app.hasRoom).toBe(false);
    app.input.potential = 12;
    selectCard('otherR');
    expect(app.input.potential).toBe(1);
    expect(app.hasRoom).toBe(true);
    expect(app.getRoomPercentage('2房')).toBe(10);
});

test('unknown character portraits and Other icon keep existing image fallback and sprite', () => {
    const { app } = makeApp();
    expect(app.getCardImagePath({ char: '八雲', img: 'Yakumo.jpg' })).toBe('./res/img/card/yakumo/Yakumo.jpg');
    expect(app.getCardImagePath({ char: '蒼葉', img: 'Aoba_SSR_01.jpg' })).toBe('./res/img/card/other/Aoba_SSR_01.jpg');
    expect(app.getCardImagePath({ char: '環', img: 'Future.jpg' })).toBe('./res/img/card/other/Future.jpg');
    expect(app.getCardImagePath({ char: '蒼葉' })).toBe('./res/img/card/no_image.png');
    expect(html).toContain('char_icons.png" as="image"');
    expect(html).toContain('char_icons_other.png" as="image"');
    expect(html.match(/:aria-label="char"/g)).toHaveLength(3);
    expect(css).toMatch(/\.icon-other\s*\{[^}]*char_icons_other\.png[^}]*0 0/s);
    expect(css).toContain("background: url('../img/card-icon/image/char_icons.png')");
});

test('character filters keep the image controls without obsolete display settings or styles', () => {
    expect(html.match(/class="py-1 cardFilter-char image"/g)).toHaveLength(3);
    for (const name of ['cardFilter', 'cardHpAtkSort', 'tierFilter']) {
        expect(html).toContain(`name="${name}-character"`);
    }
    expect(html.match(/class="filter-icon-char-image"/g)).toHaveLength(3);
    expect(html).not.toMatch(/charDisplayStyle|charFilterDisplayStyle|選擇器：過濾條件 > 角色/);
    expect(css).not.toMatch(/\.cardFilter-char\.(pixel|text)/);
    expect(css).toContain('.cardFilter-char.image label');
});

test.each(['image', 'pixel', 'text', 'unknown'])('legacy %s setting is discarded while other settings survive', style => {
    const { app, getStored } = makeApp({ setting: {
        charDisplayStyle: style,
        general: { charFilterDisplayStyle: style, charDisplayStyle: style, theme: 'dark', recordPanelPageMaxCount: 15 },
        userInput: { turns: '9' },
    }, other: 'untouched' });
    app.loadSettingFromStorage();
    expect(app.setting.general.theme).toBe('dark');
    expect(app.setting.general.recordPanelCardImgSize).toBe('normal');
    expect(app.damageRecordPanel.pageMaxCount).toBe(15);
    expect(app.userInput.turns).toBe(9);
    expect(app.cardFilter).not.toHaveProperty('charDisplayStyle');
    expect(app.cardHpAtkSort).not.toHaveProperty('charDisplayStyle');
    expect(app.tierList.poolFilter).not.toHaveProperty('charDisplayStyle');
    expect(getStored().other).toBe('untouched');
    expect(JSON.stringify(getStored().setting)).not.toMatch(/charDisplayStyle|charFilterDisplayStyle/);
});

test('fresh save excludes legacy fields and character paths use image icons', () => {
    const { app, getStored } = makeApp();
    app.saveSettingFromStorage();
    expect(JSON.stringify(getStored())).not.toMatch(/charDisplayStyle|charFilterDisplayStyle/);
    expect(app.getFilterPanalIconPath('char', '八雲')).toBe('./res/img/card-icon/image/char-yakumo.png');
    expect(app.tierListGetFilterIconPath('char', '八雲')).toBe('./res/img/card-icon/image/char-yakumo.png');
    expect(app.getFilterPanalIconPath('rarity', 'SSR')).toBe('./res/img/card-icon/rarity-ssr.png');
    expect(app.tierListGetFilterIconPath('rarity', 'SSR')).toBe('./res/img/card-icon/rarity-ssr.png');
});

test('general-only legacy setting is removed on load and later save retains other settings', () => {
    const { app, localStorage, getStored } = makeApp({ setting: {
        general: { charFilterDisplayStyle: 'pixel', theme: 'dark', recordPanelCardImgSize: 'small', recordPanelPageMaxCount: 15 },
        userInput: { turns: '9' },
    } });
    app.loadSettingFromStorage();
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    expect(getStored().setting.general).toMatchObject({
        recordPanelCardImgSize: 'small', recordPanelPageMaxCount: 15, theme: 'dark',
    });
    expect(getStored().setting.general).not.toHaveProperty('charFilterDisplayStyle');
    app.saveSettingFromStorage();
    expect(getStored().setting.userInput.turns).toBe('9');
    expect(getStored().setting.general).toMatchObject({
        recordPanelCardImgSize: 'small', recordPanelPageMaxCount: 15, theme: 'dark',
    });
    expect(getStored().setting.general).not.toHaveProperty('charFilterDisplayStyle');
});

test('ordinary saved settings load without rewriting storage', () => {
    const { app, localStorage, getStored } = makeApp({ setting: {
        general: { theme: 'dark', recordPanelCardImgSize: 'big', recordPanelPageMaxCount: 12 },
        userInput: { turns: '7' },
    } });
    app.loadSettingFromStorage();
    expect(localStorage.setItem).not.toHaveBeenCalled();
    expect(app.setting.general).toMatchObject(getStored().setting.general);
    expect(app.userInput.turns).toBe(7);
});