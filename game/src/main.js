import { createRun, beginRun, step } from './simulation.js';
import { drawScene } from './render.js';
import { bindInput } from './input.js';
import { sound, toggleMute } from './audio.js';
const canvas=document.querySelector('#scene'), $=id=>document.getElementById(id);
const state=createRun(2811), input={}, reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches; let previous=0, accumulator=0, preview=new URLSearchParams(location.search).get('shot'), best=0;
try{best=Number(localStorage.getItem('last-bird-best'))||0}catch{}
function start(){for(const k in input)delete input[k];beginRun(state);preview=null;sound('jump');}
function pause(){if(state.phase==='play')state.phase='paused';else if(state.phase==='paused')state.phase='play';for(const k in input)delete input[k];}
function action(name,down){if(!down&&['left','right','jump'].includes(name))return;if(name==='pause'&&down){pause();return;}if(down&&['title','caught','win'].includes(state.phase)){start();return;}if((name==='left'||name==='right'||name==='jump')&&input[name])return;input[name]=down;if(name==='crouch')input.hide=down;}
bindInput(action);
window.addEventListener('keydown',e=>{if(e.code==='Enter'&&!e.repeat){if(['title','caught','win'].includes(state.phase))start();else if(state.phase==='paused')pause();}});
canvas.addEventListener('pointerdown',()=>{if(['title','caught','win'].includes(state.phase))start();});
$('start').onclick=()=>{if(state.phase==='paused')pause();else start();};
$('pause').onclick=pause;$('sound').onclick=()=>{$('sound').textContent=toggleMute()?'♫ OFF':'♫ ON';sound('corn');};
function freeze(){if(state.phase==='play')state.phase='paused';for(const k in input)delete input[k];accumulator=0;}
window.addEventListener('blur',freeze);document.addEventListener('visibilitychange',()=>{if(document.hidden)freeze();});
function update(dt){const lives=state.lives,corn=state.corn,phase=state.phase;step(state,input,dt);input.left=false;input.right=false;input.jump=false;if(state.lives<lives)sound('hit');if(state.corn>corn)sound('corn');if(phase==='play'&&state.phase==='win')sound('win');if(state.score>best){best=state.score;try{localStorage.setItem('last-bird-best',String(best))}catch{}}}
function render(){$('start').hidden=state.phase==='play';$('start').textContent=state.phase==='title'?'MAKE A BREAK FOR IT →':state.phase==='paused'?'RESUME THE HEIST →':'ONE MORE ESCAPE →';drawScene(canvas,state,reducedMotion);$('score').textContent=String(state.score).padStart(4,'0');$('distance').textContent=Math.min(600,Math.floor(state.distance));$('lives').textContent='♥ '.repeat(Math.max(0,state.lives));$('status').textContent=state.phase==='play'?['I · FARMYARD','II · PANTRY','III · HOT KITCHEN'][state.stage]+' / BEST '+best:state.phase==='paused'?'PAUSED':'';}
function frame(now){if(!previous)previous=now;accumulator+=Math.min(.1,(now-previous)/1000);previous=now;if(!preview){let loops=0;while(accumulator>=1/60&&loops++<6){update(1/60);accumulator-=1/60;}}else accumulator=0;render();requestAnimationFrame(frame);}
window.render_game_to_text=()=>JSON.stringify({...state,best,coordinates:'lane 0 upper, 1 middle, 2 lower hay cover; obstacles travel right-to-left; z .125 collision'});
window.advanceTime=ms=>{for(let t=0;t<Math.min(ms,120000);t+=1000/60)update(1/60);render();};
Object.defineProperty(window,'__game',{get:()=>structuredClone(state)});
if(preview){state.phase=preview==='title'?'title':preview==='win'?'win':preview==='caught'?'caught':'play';state.stage=preview==='kitchen'?2:0;state.distance=preview==='kitchen'?468:preview==='win'?600:73;state.elapsed=preview==='kitchen'?47:9;state.score=preview==='title'?0:850;state.obstacles=preview==='kitchen'?[{lane:0,z:.42,type:'overhead'},{lane:1,z:.58,type:'oven'},{lane:2,z:.34,type:'corn'}]:[{lane:2,z:.55,type:'overhead'},{lane:0,z:.37,type:'hay'},{lane:1,z:.7,type:'corn'}];}
requestAnimationFrame(frame);
