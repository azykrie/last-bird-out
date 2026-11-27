import test from 'node:test';
import assert from 'node:assert/strict';
import { createRun, step, beginRun } from '../game/src/simulation.js';

test('fresh run starts at center with three lives and reset is complete', () => {
  const s = createRun(42); beginRun(s); s.score = 88; s.lives = 1; beginRun(s);
  assert.equal(s.phase, 'play'); assert.equal(s.lives, 3); assert.equal(s.score, 0); assert.equal(s.lane, 1);
});
test('jump and dash respond; movement clamps at outer lanes', () => {
  const s = createRun(7); s.phase = 'play'; step(s, { jump: true, dash: true, left: true }, 1 / 60);
  assert.ok(s.jumpY > 0); assert.ok(s.stamina < 100); assert.equal(s.lane, 0);
  step(s, { left: true }, 1); assert.equal(s.lane, 0);
});
test('collision costs one life, invulnerability prevents repeat damage, then caught', () => {
  const s = createRun(5); s.phase = 'play'; s.obstacles = [{ lane: 1, z: .165, type: 'block' }];
  step(s, {}, 1 / 60); assert.equal(s.lives, 2); assert.ok(s.invulnerable > 0);
  s.obstacles = [{ lane: 1, z: .165, type: 'block' }]; step(s, {}, 1 / 60); assert.equal(s.lives, 2);
  s.invulnerable = 0; s.lives = 1; s.obstacles = [{ lane: 1, z: .165, type: 'block' }]; step(s, {}, 1 / 60); assert.equal(s.phase, 'caught');
});
test('corn awards score and the run reaches the escape gate', () => {
  const s = createRun(10); s.phase = 'play'; s.obstacles = [{ lane: 1, z: .165, type: 'corn' }]; step(s, {}, 1 / 60);
  assert.equal(s.score, 100); assert.equal(s.corn, 1); s.distance = 599.99; step(s, {}, 1 / 60); assert.equal(s.phase, 'win');
});
test('cover is restricted to hay lane; it lowers pressure at cost of pace', () => {
 const open=createRun(3);beginRun(open);open.chase=40;step(open,{crouch:true,hide:true},.05);assert.ok(open.chase>=40);
 const cover=createRun(3);beginRun(cover);cover.lane=2;cover.chase=40;step(cover,{crouch:true,hide:true},.05);assert.ok(cover.chase<40);assert.ok(cover.distance<open.distance);
});
test('kitchen generates actual oven dangers, solid crates cannot be jumped',()=>{
 const s=createRun(4);beginRun(s);s.distance=450;s.spawnAt=0;step(s,{},1/60);assert.ok(s.obstacles.some(o=>o.type==='oven'));
 const crate=createRun(1);beginRun(crate);crate.jumpY=1;crate.obstacles=[{lane:1,z:.165,type:'block'}];step(crate,{},1/60);assert.equal(crate.lives,2);
});
test('deterministic seeds retain a damage-free route through all three stages',()=>{
 for(let seed=1;seed<=100;seed++){
  const s=createRun(seed), twin=createRun(seed);beginRun(s);beginRun(twin);const stages=new Set();
  for(let frame=0;frame<4800&&s.phase==='play';frame++){
   const danger=s.obstacles.filter(o=>o.type!=='corn'&&!o.done&&o.z>.09&&o.z<.45);
   const safe=[0,1,2].find(l=>!danger.some(o=>o.lane===l));assert.notEqual(safe,undefined,'one legal route remains');
   const input={left:s.lane>safe,right:s.lane<safe};step(s,input,1/60);step(twin,input,1/60);stages.add(s.stage);
   assert.deepEqual(s,twin);if(frame<120)assert.equal(s.lives,3,'fair opening');
  }
  assert.equal(s.phase,'win',`seed ${seed}`);assert.equal(s.lives,3);assert.deepEqual([...stages],[0,1,2]);
 }
});
test('gravity lands, overhead duck is safe and reset removes every transient',()=>{
 const s=createRun(8);beginRun(s);step(s,{jump:true},1/60);for(let i=0;i<60;i++)step(s,{},1/60);assert.equal(s.jumpY,0);
 s.obstacles=[{lane:1,z:.165,type:'overhead'}];step(s,{crouch:true},1/60);assert.equal(s.lives,3);assert.equal(s.crouch,true);
 s.stamina=0;s.hidden=9;s.invulnerable=3;s.phase='caught';beginRun(s);const clean=createRun(8);clean.phase='play';assert.deepEqual(s,clean);
});
test('pause is owned by lifecycle: simulation steps freeze outside play', () => {
  const s = createRun(2); s.phase = 'paused'; step(s, {}, .05); assert.equal(s.distance, 0);
});

test('fatal collision at the escape gate takes precedence over winning', () => {
 const s=createRun(1);beginRun(s);s.distance=599.99;s.lives=1;
 s.obstacles=[{lane:1,z:.165,type:'block'}];step(s,{},1/60);
 assert.equal(s.lives,0);assert.equal(s.phase,'caught');
});
test('chase threshold catches before escape even with lives remaining', () => {
 const s=createRun(1);beginRun(s);s.distance=599.99;s.chase=99.999;
 step(s,{},1/60);assert.equal(s.phase,'caught');assert.equal(s.lives,3);
});
test('airborne turkey cannot collect floor corn', () => {
 const s=createRun(1);beginRun(s);s.jumpY=1;s.obstacles=[{lane:1,z:.165,type:'corn'}];
 step(s,{},1/60);assert.equal(s.corn,0);assert.equal(s.score,0);
});
test('invalid time deltas leave the entire run unchanged', () => {
 for(const dt of [NaN,Infinity,-Infinity,-1]){
  const s=createRun(1);beginRun(s);const before=structuredClone(s);
  step(s,{left:true,jump:true,dash:true},dt);assert.deepEqual(s,before,`dt ${dt}`);
 }
});
test('collision pushing chase to threshold also catches before escape', () => {
 const s=createRun(1);beginRun(s);s.distance=599.99;s.chase=90;
 s.obstacles=[{lane:1,z:.165,type:'block'}];step(s,{},1/60);
 assert.equal(s.lives,2);assert.equal(s.chase,100);assert.equal(s.phase,'caught');
});
