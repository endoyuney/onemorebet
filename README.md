# ONE MORE BET

Current prototype: **v0.5.1**, open `index.html` in a desktop browser.
The historical `one-more-bet-v0.1.html` is retained. The supplied v0.5 HTML
was imported unchanged in the preceding commit, so the technical patch can
be reviewed separately from the older GitHub prototype.

Run logic regression tests with Node.js (no dependencies):

```sh
node --test tests/regression.cjs
```

The harness executes the game's actual inline script with an inert DOM and
controlled time. Tests cover game state and timers; they do not establish
visual quality, browser interaction, fun, or campaign completion time.

Save data uses the existing `oneMoreBet_save` key, now schema version 6.
Export your existing save before switching prototype files or browsers.
Browser storage scope can differ between file URLs; use Export/Import to
transfer progress. Older prototype versions cannot safely read v6 saves.

See [the technical patch](docs/v0.5.1.md) and
[the gameplay proposal](docs/gameplay-next.md).
