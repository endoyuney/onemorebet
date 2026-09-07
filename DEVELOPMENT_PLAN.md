# ONE MORE BET — Development Roadmap

## Current phase: v0.1 prototype stabilization

The current goal is not to add more content yet. First, make the existing Coin → Scratch → Slot → Bust → Skill Tree loop reliable and measurable.

## Phase 1 — Core correctness and playtest instrumentation

1. Jackpot Coin: first flip must be mandatory before TAKE is available.
2. Safe Pocket: protected money must leave the live bankroll; no money duplication.
3. Automation rule: the newest unlocked toy stays manual. Auto Spin remains locked until a newer toy exists.
4. Run telemetry: export duration, peak cash, unlock times, actions, bust time and chips earned.
5. Preserve existing balance numbers unless a bug fix requires otherwise.

## Phase 2 — Pacing and economy

After Phase 1 playtests, tune only from observed data:

- first natural BUST timing
- first Scratch unlock timing
- first Slot unlock timing
- table upgrade pacing
- chip income per run
- jackpot frequency and payout size
- whether any upgrade is obviously dominant
- whether players intentionally avoid busting because prestige is too weak

Target question: does the player voluntarily start another run after BUST?

## Phase 3 — Content progression

Only after the current loop is proven:

- add a fourth active gambling toy
- then enable Slot automation
- add new table tiers / ticket types only if they create a different play feel
- expand the skill tree with meaningful branches rather than percentage filler

Rule: automation always takes yesterday's job, never today's toy.

## Phase 4 — Meta progression and replayability

- deeper prestige choices
- mutually exclusive or opportunity-cost upgrades
- cosmetics and achievement rewards
- collection goals
- late-run goals and final progression target

## Phase 5 — Juice / polish

Do this after the game loop and economy are stable:

- improved physical coin flip animation
- real scratch-off interaction using pointer/canvas masking
- slot reel motion instead of simple shake
- jackpot particles / coin rain / screen response
- Tiny Scratcher character animation
- sound effects and music
- stronger unlock presentation
- table decorations and cosmetic presentation

## Phase 6 — Demo readiness

- save migration and corruption handling
- settings / audio / accessibility basics
- keyboard and mouse behavior
- resolution / scaling / performance checks
- onboarding without developer/debug language
- Windows packaging
- external playtest build

## Phase 7 — Steam preparation

Only after strangers can play the build without explanation:

- final-ish visual direction
- screenshots and trailer-quality moments
- Steam store assets and copy
- Steam Playtest
- public demo decision

## Scope rule

Do not solve boredom by adding systems before the current layer has been measured. Fix → playtest → evaluate → then add the next layer.
