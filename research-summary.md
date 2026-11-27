# Research and design decisions

Inspected research: straker/endless-runner-html5-game (part3/kandi.js), ccaleb/endless-runner (javascript-pixi/Scroller.js), chrislaupama/threejs-game-studio (SKILL.md and runner contract), and anthropics/skills (webapp-testing). Source URLs are recorded in the parent research file; no reference game code, assets, scaffold, or commercial content is shipped.

Single-lane hazards are spaced far enough apart that a clear adjacent route is always available in the tested collision horizon. A 100-seed deterministic simulation verifies a damage-free finish across all stages; this is not a proof for every possible seed or input.

Used principles, not implementations: layered scrolling, a single simulation owner, explicit lifecycle, fixed seconds rather than frame-dependent motion, local-first assets, seeded random generation, and native-input browser verification. Canvas 2D keeps this a static no-build delivery. The three routes are rendered as horizontal bands for a readable illustrated chase. Inputs remain left/right for route selection, Space for jump, Down for duck, Shift for dash.

All game art is original procedural Canvas geometry: layered tail fan, scarf and wattle, expressive farmer with overalls and pitchfork, copper pans, ovens with lit racks, knives with riveted handles, farm fence, jars, hay, corn and pumpkins. No outside fonts, images or audio. WebAudio generates short gesture-unlocked effects.
