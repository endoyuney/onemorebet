# ONE MORE BET v0.3 — Coin Swarm Playtest

This iteration intentionally changes only the Coin layer. Scratch and Slot remain structurally unchanged so the new swarm loop can be judged in isolation.

## Core changes

- Start every run with 1 physical Copper coin.
- Every purchased coin becomes a separate object on the table.
- Maximum 50 physical coins on the table.
- Coin shops:
  - Copper $1 stake — duplicate cost starts at $50 and grows by 1.28x.
  - Silver $5 stake — shop unlocks at peak $60; first coin costs $250; duplicate cost grows by 1.32x.
  - Gold $25 stake — shop unlocks at peak $250; first coin costs $1,250; duplicate cost grows by 1.36x.
- All denominations feed one shared Coin Jackpot.
- Clicking a physical coin flips only that coin.
- Each denomination also has a batch flip button.
- New permanent skill-tree node: DEALER HANDS.
  - Rank 0: manual batch size 1.
  - Rank 1: 2 coins.
  - Rank 2: 5 coins.
  - Rank 3: 10 coins.
  - Rank 4: FLIP ALL.
- AUTO SWARM is a prestige node. It activates only after Scratch Cards unlock.
  - Copper batch: every 2 seconds.
  - Silver batch: every 3 seconds.
  - Gold batch: every 4 seconds.
  - Automation pauses when bankroll is too thin for the batch.
- Removed the old run-only DOUBLE TOSS upgrade because physical coin quantity now provides that progression.
- Save version bumped to v3 with migration from older prototype saves.

## What to judge

1. After owning 5 coins, do you want a 6th?
2. After owning 15 coins, do you still want to fill the table further?
3. Does buying a new physical coin feel better than merely unlocking a larger stake button?
4. Do you naturally use the denomination batch buttons, individual coins, or both?
5. Does DEALER HANDS feel like meaningful prestige progression?
6. Does FLIP ALL feel like a reward worth reaching rather than a button that should exist from the start?
7. When Scratch opens, does AUTO SWARM make the earlier Coin layer feel like a machine you built rather than abandoned content?
8. Is 50 coins visually exciting or merely cluttered?
9. Do Silver and Gold feel like useful additions to the swarm, even if buying duplicates remains the main desire?
10. Is the Coin Shop readable while the table itself becomes chaotic?

## Design rule

The playfield may become chaotic. The interface must remain stable and readable.
