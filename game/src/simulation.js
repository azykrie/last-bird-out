const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export function createRun(seed = 1) {
  return { seed: seed >>> 0 || 1, phase: 'title', lane: 1, lives: 3, jumpY: 0, jumpV: 0, stamina: 100, distance: 0, score: 0, invulnerable: 0, crouch: false, obstacles: [], corn: 0, chase: 0, elapsed: 0, spawnAt: 2, stage: 0, hidden: 0, rng: seed >>> 0 || 1 };
}
export function random(state) { state.rng = (1664525 * state.rng + 1013904223) >>> 0; return state.rng / 4294967296; }
export function beginRun(state) { Object.assign(state, createRun(state.seed)); state.phase = 'play'; return state; }
function spawn(state) {
  const lane = Math.floor(random(state) * 3), roll = random(state);
  state.obstacles.push({ lane, z: 1.08, type: roll < .28 ? 'overhead' : roll < .56 ? 'block' : roll < .79 ? (state.stage === 2 ? 'oven' : 'hay') : 'corn' });
}
export function step(s, input = {}, dt = 1 / 60) {
  dt = clamp(dt, 0, .05);
  if (s.phase !== 'play') return s;
  s.elapsed += dt; s.distance += dt * (8 + Math.min(5, s.elapsed * .055));
  s.stage = s.distance < 180 ? 0 : s.distance < 390 ? 1 : 2;
  s.invulnerable = Math.max(0, s.invulnerable - dt);
  s.lane = clamp(s.lane + (input.left ? -1 : 0) + (input.right ? 1 : 0), 0, 2);
  s.crouch = !!input.crouch;
  if (input.jump && s.jumpY === 0) s.jumpV = 7.7;
  s.jumpY = Math.max(0, s.jumpY + s.jumpV * dt); s.jumpV -= 21 * dt;
  if (s.jumpY === 0) s.jumpV = 0;
  if (input.dash && s.stamina > 0) { s.stamina = Math.max(0, s.stamina - 34 * dt); s.distance += 5.5 * dt; s.chase = Math.max(0, s.chase - 9 * dt); }
  else s.stamina = Math.min(100, s.stamina + 13 * dt);
  const inCover = input.crouch && s.lane === 2 && s.jumpY === 0;
  if (inCover) s.distance -= dt * 3;
  s.chase = clamp(s.chase + dt * (.8 + s.stage * .35) - (inCover ? dt * 5 : 0), 0, 100);
  s.hidden = inCover ? s.hidden + dt : 0;
  if (s.chase >= 100) { s.phase = 'caught'; return s; }
  s.spawnAt -= dt;
  if (s.spawnAt <= 0) { spawn(s); s.spawnAt = Math.max(.78, 1.42 - s.elapsed * .004) + random(s) * .32; }
  for (const o of s.obstacles) o.z -= dt * (.36 + Math.min(.18, s.elapsed * .0015));
  for (const o of s.obstacles) {
    if (o.z < .16 && o.z > .09 && o.lane === s.lane && !o.done) {
      o.done = true;
      if (o.type === 'corn') { s.score += 100; s.corn++; }
      else if (o.type === 'block' || (o.type === 'overhead' && !s.crouch) || ((o.type === 'hay' || o.type === 'oven') && s.jumpY < .45)) {
        if (s.invulnerable === 0) { s.lives--; s.invulnerable = 1.15; s.chase = clamp(s.chase + 18, 0, 100); if (s.lives <= 0) s.phase = 'caught'; }
      } else { s.score += 25; }
    }
  }
  s.obstacles = s.obstacles.filter(o => o.z > -.1);
  if (s.distance >= 600) s.phase = 'win';
  return s;
}
