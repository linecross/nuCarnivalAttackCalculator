# Copilot Instructions — Nu Carnival Attack Calculator

## Project Overview

This is a client-side game output calculator for **Nu Carnival** (新世界狂歡). It simulates team battle output (damage, healing, support buffs) over configurable turns. The UI is entirely browser-based with no server backend.

## Architecture

### Two Layers

1. **Battle Engine** (`src/`) — TypeScript modules compiled to ES6. Contains all game logic: card stats, rules, conditions, battle simulation.
2. **UI Layer** (`res/js/`, `*.html`) — Vue 3 (Options API, loaded via CDN) with Bootstrap 5. Imports compiled JS from `build/`.

The battle engine is decoupled from the UI. Tests run entirely against the engine without any DOM.

### Key Classes

- **`Card`** — Represents a character card with stats (HP, ATK), star level, potential, bond, and skill rules. Stat calculation uses `Math.fround()` for 32-bit float precision matching the actual game.
- **`Team`** — A collection of up to 5 `Card` instances with action ordering.
- **`EnemyCard`** — Extends card model with enemy-specific fields (HP lock phases, boss skills).
- **`CardCenter`** — Static factory that loads cards from JSON data.
- **`Rule`** — Core data model for all effects (attacks, buffs, debuffs, heals). Rules have types, values, conditions, targets, and duration.
- **`Condition`** — Conditional logic attached to rules (e.g., "when HP > 50%", "when character X is on team").
- **`Battle`** — Main simulation engine. Manages turns, applies rules, tracks outputs per card per turn.
- **`BattleTurn`** — Per-card battle state within a simulation (rules, actions, outputs per turn).

### Data Flow

1. Card data is loaded from `res/json/cardData.json` (or test fixtures).
2. `CardCenter.loadCard()` instantiates `Card` objects with parsed `Rule` trees.
3. `Team` is assembled with selected cards.
4. `Battle` is initialized with the team — `initBattleRules()` distributes passive rules to appropriate targets.
5. `startBattle()` iterates turns: clears per-round buffs → applies before-round rules → executes card actions → processes end-of-turn effects.
6. Results are accessed via `getTurnValue()`, `getTeamTotalDamage()`, etc.

## Language & Naming

- Game terms, enum values, and UI text are in **Traditional Chinese** (zh-TW). All `Constants.ts` enums use Chinese string values (e.g., `RuleType.attack = '攻擊'`, `Element.Fire = '火'`).
- Code identifiers (variable names, class names, method names) are in **English**.
- Card names in data files are in Chinese (e.g., `'SR八雲'`, `'錆色．歛'`).
- When adding new enum values or card data, follow the existing Chinese naming convention.

## TypeScript Conventions

- Target: ES6 with `NodeNext` module resolution.
- Use `const` object pattern for enums (not TypeScript `enum`). Each enum has a companion type: `export type X = typeof X[keyof typeof X]`.
- Use `.js` extensions in import paths (required for ESM compatibility).
- `Math.fround()` is used deliberately in stat calculations to match the game's 32-bit float arithmetic. The `Float32` utility class wraps this for chained operations.
- Rules are deeply nested objects with recursive structures (e.g., `appendRule` can contain child `Rule` objects as values).

## Rule System

Rules are the core abstraction. Every card effect is a `Rule` with:
- `type` — A `RuleType` enum value (attack, heal, buff, debuff, etc.)
- `value` — Usually a percentage string like `"125%"` or `"10%"`
- `condition` — Array of `Condition` objects that must be satisfied
- `target` — `RuleTarget` specifying who the rule affects (self, all, enemy, specific class/character/position)
- `turn` — Duration in turns
- `maxCount` — Maximum stack count
- `isPassive` — Whether it's a permanent passive from star/potential unlocks

When modifying rule logic, be aware that rules are cloned during battle init and distributed to target cards' `BattleTurn` instances.

## Testing

- Framework: Jest with `@swc/jest` transformer.
- Tests are in `src/__tests__/` and use sample card data from `src/__tests__/sample/cardData.json` with fixed stats (ATK=1000, HP=1000) for deterministic results.
- Custom matcher `toBeAround` (in `src/jest/toBeAround.ts`) compares numbers within a percentage tolerance (default 0.1%).
- Test naming convention: `Battle.<category>.test.ts` (e.g., `Battle.1_basic`, `Battle.2_condition`).
- Run tests: `npm test` (includes coverage).

## Build & Run

- `npm run build` — Compile TS to `build/` directory.
- `npm test` — Run Jest tests with coverage.
- `npm start` — Run CLI simulation via ts-node (`src/Main.ts`).
- Open `Main.html` in a browser for the full UI (requires `build/` to exist).

## File Editing Guidelines

- **Card data changes** → Edit `res/json/cardData.json` (runtime data) or `src/SampleData.ts` (hardcoded data for Generator).
- **Battle logic changes** → Edit `src/BattleSystem.ts`. Always add or update tests in `src/__tests__/`.
- **New rule types** → Add to `RuleType` in `src/Constants.ts`, then handle in `BattleSystem.ts` (in `startRoundPerCard`, `beforeRound`, or `atTurnEnd` as appropriate).
- **UI changes** → Edit `res/js/uiMain.js` (main app) and `Main.html`. These are plain JS files importing from `build/`.
- **New conditions** → Add to `ConditionType` in `src/Constants.ts`, implement in `Condition.isFulfilled()` in `src/CardRule.ts`.

## Important Caveats

- The `build/` directory must be up to date for the browser UI to work. Run `npm run build` after any TypeScript changes.
- `tsconfig.json` excludes `Main.ts`, `SampleData.ts`, test files, and `jest/` from the build output — these are Node-only files.
- The UI JS files (`res/js/*.js`) import from `../../build/*.js` paths and are not compiled by TypeScript — they are hand-written ES module scripts.
- `Float32` arithmetic is critical for matching in-game values. Do not replace `Math.fround()` calls with regular arithmetic.
