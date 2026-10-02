import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const root = process.cwd();
const html = readFileSync(`${root}/Main.html`, 'utf8');
const css = readFileSync(`${root}/res/css/main.css`, 'utf8');
const source = readFileSync(`${root}/res/js/uiMain.js`, 'utf8');

function makeApp(saved: object | null = null) {
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
        Character: { Yakumo: '八雲' }, Rarity: {}, Class: {}, Element: { NA: 'N/A' },
        AttackType: {}, ActionPattern: { Immediately: 'immediately' },
        CounterAttackMode: { everyTurn: 'everyTurn' }, ConditionHPStatus: {},
        Condition: { HP_STATUS: {} }, Battle: { PRINT_OUTPUT_OPTION: { ALL: 'all' } },
    };
    runInNewContext(source.replace(/^import .*;\r?\n/gm, ''), { Vue, localStorage, document: {
        documentElement: { setAttribute: () => {}, classList: '' },
    }, ...constants });
    const app = Object.assign(options.data(), options.methods);
    return { app, localStorage, getStored: () => JSON.parse(stored!) };
}

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