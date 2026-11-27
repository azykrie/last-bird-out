let ctx = null, muted = false, master = null;
export function toggleMute(){ muted = !muted; if(master)master.gain.value=muted?0:1; return muted; }
export function isMuted(){ return muted; }
export function sound(kind='step'){
  if(muted) return;
  try { ctx ||= new AudioContext(); if(ctx.state==='suspended') ctx.resume(); const osc=ctx.createOscillator(), gain=ctx.createGain();
    osc.type=kind==='hit'?'sawtooth':'triangle'; osc.frequency.value=kind==='corn'?760:kind==='hit'?120:kind==='win'?580:300;
    gain.gain.setValueAtTime(.055,ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.12); osc.connect(gain); if(!master){master=ctx.createGain();master.connect(ctx.destination)}gain.connect(master);osc.start();osc.stop(ctx.currentTime+.13);
  } catch {}
}
