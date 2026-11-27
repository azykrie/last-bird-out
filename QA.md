# QA — Last Bird Out

## Executed evidence

Node v22.23.3: `node --test tests/simulation.test.js` — 9/9 passing. Covers reset, lane limits, jump, dash, collisions, invulnerability, caught, corn, win, cover cost/benefit, actual kitchen ovens, solid crates, gravity, crouch, frozen pause and deterministic fair routes. One hundred seeds finish damage-free through all three stages, with identical twin simulations. Initial jump test failed a real assertion before implementation; cover and oven/crate slices were observed failing before correction. Some regression cases were added after implementation; this is not a claim that every function followed strict test-first development.

Real Chromium /usr/bin/chromium, Playwright outside the delivery: native start, arrows, jump, crouch, pause with frozen distance, mute toggle, blur pause, collisions to caught and keyboard retry, complete native-input escape and retry, narrow desktop, local-only route policy and offline loaded scene all passed. First full run: 61.873 real seconds, distance 600.0274666666642, 3 lives. 600 actual requestAnimationFrame intervals: mean 16.6728333333 ms, p95 16.8 ms. This measures scheduling in this sandbox, not a portable 60 FPS guarantee. Zero console errors, page errors, failed requests or external requests.

Four unedited 1280×800 quality-82 browser JPEGs: 01-kitchen (frozen representative renderer state), 02-title (real menu), 03-farmyard (native gameplay), 04-freedom (actual completed native run). Preview modes use the same renderer and can be exited by starting/retrying. Vision inspection was attempted but the service returned HTTP 403; parent visual review remains required.

## Adversarial self-judgment against official criteria

1. Completeness: real playable start→farm→pantry→kitchen→win and caught→retry. Turkey, farmer, oven, knife and HUD are present. Cover is an explicit deterministic scene, not a completed native kitchen screenshot.
2. Fun/depth: three routes, jump, crouch, limited dash, corn and cover-versus-speed trade-off. Weakness: a skilled player can evade most hazards by lane changes alone; farmer behavior is pressure-driven pursuit, not a searching/pathfinding simulation. Same seed improves learning but limits variety.
3. Feel/polish: fixed-step owner, immediate queued inputs, fair first seconds, forgiving hit window, 1.15 s invulnerability, pause/blur hygiene, simple synthesized effects and functioning mute. Remaining risk: audio has not been listened to by a human; there is no music. Horizontal lanes use left/right route selectors, which needs learning.
4. Look/originality: original engraved autumn palette, expressive vector characters, copper pans, jars, lit oven racks, riveted knives, hay, pumpkins and paper hatching. No copied game code/art or commercial assets. Cannot certify premium visual quality without the blocked image inspection and parent review.
5. Structure: pure simulation, art-only renderer, input and audio modules, one main lifecycle owner, local HTML/CSS, standard-library packaging. Compact source, no delivered dependencies.

No claim of winning, ranking, or passing the transcript gate. Parent must bundle the honest parent/child session chain, privacy-review it, run transcript checks, create/push the intended public repository, set About, and submit. No bundle, push or external submission performed here.
