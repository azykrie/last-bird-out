const $ = (q) => document.querySelector(q);
export function bindInput(onAction) {
  const held = new Map();
  const keyMap = { ArrowLeft:'left', KeyA:'left', ArrowRight:'right', KeyD:'right', Space:'jump', ArrowDown:'crouch', KeyS:'crouch', ShiftLeft:'dash', ShiftRight:'dash' };
  const press = (source, action) => { if (held.has(source)) return; held.set(source, action); onAction(action, true); };
  const release = source => { const action = held.get(source); if (!action) return; held.delete(source); if (![...held.values()].includes(action)) onAction(action, false); };
  const down = e => { const action = keyMap[e.code] || (e.code === 'Escape' || e.code === 'KeyP' ? 'pause' : null); if (!action) return; e.preventDefault(); if (!e.repeat) press(e.code, action); };
  const up = e => release(e.code);
  const clear = () => { const actions = new Set(held.values()); held.clear(); for (const a of actions) onAction(a, false); };
  window.addEventListener('keydown', down); window.addEventListener('keyup', up); window.addEventListener('blur', clear);
  for (const [id, action] of [['left','left'],['right','right'],['jump','jump'],['crouch','crouch'],['dash','dash']]) {
    const button = $('#'+id); button.addEventListener('pointerdown', e => {e.preventDefault(); press('pointer:'+id,action)});
    for (const type of ['pointerup','pointercancel','pointerleave']) button.addEventListener(type, () => release('pointer:'+id));
  }
  return { destroy(){window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',clear);} };
}
