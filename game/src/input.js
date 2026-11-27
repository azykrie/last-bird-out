const $ = (q) => document.querySelector(q);
export function bindInput(onAction) {
  const held = new Set();
  const keyMap = { ArrowLeft:'left', KeyA:'left', ArrowRight:'right', KeyD:'right', Space:'jump', ArrowDown:'crouch', KeyS:'crouch', ShiftLeft:'dash', ShiftRight:'dash' };
  const down = e => { const action = keyMap[e.code]; if (e.repeat && action) { e.preventDefault(); return; } if (action) { e.preventDefault(); held.add(action); onAction(action, true); } if (e.code === 'Escape' || e.code === 'KeyP') onAction('pause', true); };
  const up = e => { const action = keyMap[e.code]; if (action) { held.delete(action); onAction(action, false); } };
  const clear = () => { for (const a of held) onAction(a, false); held.clear(); };
  window.addEventListener('keydown', down); window.addEventListener('keyup', up); window.addEventListener('blur', clear);
  for (const [id, action] of [['left','left'],['right','right'],['jump','jump'],['crouch','crouch'],['dash','dash']]) {
    const button = $('#'+id); button.addEventListener('pointerdown', e => {e.preventDefault(); onAction(action,true)});
    for (const type of ['pointerup','pointercancel','pointerleave']) button.addEventListener(type, () => onAction(action,false));
  }
  return { destroy(){window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',clear);} };
}
