# QA — Last Bird Out

## Executed evidence

Node v22.23.3: `node --test tests/simulation.test.js` — 9/9 passing. Covers reset, lane limits, jump, dash, collisions, invulnerability, caught, corn, win, cover cost/benefit, actual kitchen ovens, solid crates, gravity, crouch, frozen pause and deterministic fair routes. One hundred seeds finish damage-free through all three stages, with identical twin simulations. Initial jump test failed a real assertion before implementation; cover and oven/crate slices were observed failing before correction. Some regression cases were added after implementation; this is not a claim that every function followed strict test-first development.

Real Chromium /usr/bin/chromium, Playwright outside the delivery: native start, arrows, jump, crouch, pause with frozen distance, mute toggle, blur pause, collisions to caught and keyboard retry, complete native-input escape and retry, narrow desktop, local-only route policy and offline loaded scene all passed. First full run: 61.873 real seconds, distance 600.0274666666642, 3 lives. 600 actual requestAnimationFrame intervals: mean 16.6728333333 ms, p95 16.8 ms. This measures scheduling in this sandbox, not a portable 60 FPS guarantee. Zero console errors, page errors, failed requests or external requests.

Four unedited 1280×800 quality-82 browser JPEGs: 01-kitchen (frozen representative renderer state), 02-title (real menu), 03-farmyard (native gameplay), 04-freedom (actual completed native run). Preview modes use the same renderer and can be exited by starting/retrying. Vision inspection was attempted but the service returned HTTP 403; parent visual review remains required.

## Final verification

Final revised browser pass also tested mouse route buttons and native Shift stamina drain: PASS, 61.839-second native finish with three lives; 600 frame intervals averaged 16.6881666666 ms, p95 16.8 ms. No console/page/request failures or external requests. Browser and server closed in finally. The final screenshots were recaptured by this pass.

Executed root main.ts with MAKEFUN_OUTPUT_DIR=/data/home/.hermes/cache/scratch/last-bird-package-verify. It emitted game/, screenshots/, dossier.json. Independent buildDossier from the official kit matched byte-for-byte; vendor bytes matched official SHA-256 dc67187521b24025ff952f8c231485a6eb92d6d71d29edd2a08154ffb4376129. Four JPEGs verified 1280×800, each below 262144 bytes. Dossier 534637 bytes at first package verification. Official CLI check: 4 passed, 1 failed (transcripts_present, intentionally absent), 15 skipped, 5 checked at submission. This is NOT a full submission-gate pass. Git diff --check passed.

## Adversarial self-judgment against official criteria

1. Completeness: real playable start→farm→pantry→kitchen→win and caught→retry. Turkey, farmer, oven, knife and HUD are present. Cover is an explicit deterministic scene, not a completed native kitchen screenshot.
2. Fun/depth: three routes, jump, crouch, limited dash, corn and cover-versus-speed trade-off. Weakness: a skilled player can evade most hazards by lane changes alone; farmer behavior is pressure-driven pursuit, not a searching/pathfinding simulation. Same seed improves learning but limits variety.
3. Feel/polish: fixed-step owner, immediate queued inputs, fair first seconds, forgiving hit window, 1.15 s invulnerability, pause/blur hygiene, simple synthesized effects and functioning mute. Remaining risk: audio has not been listened to by a human; there is no music. Horizontal lanes use left/right route selectors, which needs learning.
4. Look/originality: original engraved autumn palette, expressive vector characters, copper pans, jars, lit oven racks, riveted knives, hay, pumpkins and paper hatching. No copied game code/art or commercial assets. Cannot certify premium visual quality without the blocked image inspection and parent review.
5. Structure: pure simulation, art-only renderer, input and audio modules, one main lifecycle owner, local HTML/CSS, standard-library packaging. Compact source, no delivered dependencies.

No claim of winning, ranking, or passing the transcript gate. Parent must bundle the honest parent/child session chain, privacy-review it, run transcript checks, create/push the intended public repository, set About, and submit. No bundle, push or external submission performed here.

## Follow-up: confirmed finish and native-input regressions

This genuine follow-up session leaves the original renderer, title copy and official vendor untouched. The fatal collision fixture at distance 599.99 failed with `win !== caught` before the minimal win guard was added. A separate test verifies chase accumulation catches before escape. A further regression exposed collision-added chase reaching 100 while still winning; that assertion also failed before collision handling was corrected. Death or capture now takes precedence over escape.

Floor corn is deliberately grounded-only: jumping over it forfeits that pickup. Its regression failed with corn count 1 instead of 0 before the collection guard. Invalid NaN, positive/negative infinity and negative dt are ignored without any state mutation; the new test first demonstrated NaN poisoning the run before the early return was implemented.

`tests/input-browser.mjs` drives the real DOM and installed Chromium key handlers, rather than importing the simulation. Initial native results: held-arrow repeat already passed in the final source (the interim finding was partly stale), while repeated P, repeated Escape, alternate crouch-key release and alternate Shift-key release all failed actual assertions. Input now tracks physical sources independently, suppresses repeated edge presses, and releases an action only after its last source is released. This preserves simultaneous alternate physical keys and held crouch/dash. Pointer holds participate in blur cleanup and existing pointerup/cancel/leave release behavior.

First follow-up combined run: 13/13 Node tests and 12/12 native-input scenarios passed. The full existing native browser script passed with a 61.851-second actual escape, distance 600.0274666666642, three lives; 600 rAF intervals averaged 16.682 ms, p95 16.8 ms. Console/page errors, failed requests and external requests were empty. It recaptured all four actual 1280×800 game renders. This run preceded the additional collision-added chase regression; final rerun results follow below.

Limits remain unchanged: no human audio audition and no successful local vision inspection are claimed. Parent's separate fresh-eyes visual review and transcript bundling/checking remain pending. This session must be included alongside the original authoring session; it does not bundle, submit, or upload transcripts. Historical repository-creation instructions above are superseded by the existing correct public origin.

Final follow-up rerun after all production fixes: `node --test tests/*.test.js` passed 14/14; `node tests/input-browser.mjs` passed all 12 native DOM/input scenarios; `node tests/browser.mjs` passed the full existing caught/retry and real-time win/retry sequence. Escape took 61.833 seconds with three lives and distance 600.0274666666642. The 600 rAF intervals averaged 16.681 ms, p95 16.8 ms; this is sandbox scheduling evidence only. No console/page errors, failed requests or external requests were reported. Four screenshots were recaptured by this final run, not synthesized.

Fresh root-entry execution with MAKEFUN_OUTPUT_DIR=/data/home/.hermes/cache/scratch/last-bird-followup.se3GIe emitted game/, screenshots/ and a 535687-byte dossier. Independent buildDossier imported from the official turkey kit matched the output byte-for-byte; local vendor was byte-identical to the official file, SHA-256 dc67187521b24025ff952f8c231485a6eb92d6d71d29edd2a08154ffb4376129. All four JPEGs are 1280×800 and respectively 95213, 96289, 87339 and 102221 bytes, below 262144 bytes each. `git diff --check` passed. Staging is limited to the fixes, tests, this QA record and changed native screenshots; no vendor, dependencies, generated output or logs are intended for this commit.

Critical judgment: the confirmed end-state defect and native pause/alternate-key defects are corrected with observed red→green evidence. This does not increase the game's claimed farmer intelligence or erase the depth, audio and visual-review limitations above. No official submission or grading result is claimed.
