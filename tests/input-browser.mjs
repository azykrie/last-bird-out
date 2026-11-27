import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const {chromium}=createRequire(import.meta.url)('/data/workspace/makefun/turkey-tools/node_modules/playwright');
const root=resolve('game');
const server=createServer(async(req,res)=>{try{const p=resolve(root,'.'+new URL(req.url,'http://local').pathname.replace(/\/$/,'/index.html'));if(!p.startsWith(root+'/'))throw Error('path');res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html'})[extname(p)]||'application/octet-stream');res.end(await readFile(p));}catch{res.writeHead(404);res.end();}});
let browser;const results=[],errors=[];
try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 browser=await chromium.launch({headless:true,executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 page.on('pageerror',e=>errors.push(e.message));
 const state=()=>page.evaluate(()=>window.__game);
 const settle=()=>page.waitForTimeout(65);
 const fresh=async()=>{await page.goto(`http://127.0.0.1:${server.address().port}`);await page.getByRole('button',{name:'MAKE A BREAK FOR IT'}).click();await settle();};
 const repeat=code=>page.evaluate(code=>window.dispatchEvent(new KeyboardEvent('keydown',{code,repeat:true,bubbles:true})),code);
 const check=async(name,fn)=>{try{await fresh();await fn();results.push({name,result:'PASS'});}catch(e){results.push({name,result:'FAIL',message:e.message});}};
 await check('held arrow changes exactly one lane despite repeat keydowns',async()=>{
  await page.keyboard.press('ArrowLeft');await settle();assert.equal((await state()).lane,0);
  await page.keyboard.down('ArrowRight');await settle();assert.equal((await state()).lane,1);
  for(let i=0;i<3;i++){await repeat('ArrowRight');await settle();}
  assert.equal((await state()).lane,1);await page.keyboard.up('ArrowRight');
  await page.keyboard.press('ArrowRight');await settle();assert.equal((await state()).lane,2);
 });
 for(const [key,code] of [['p','KeyP'],['Escape','Escape']])await check(`${code} does not toggle pause while held`,async()=>{
  await page.keyboard.down(key);assert.equal((await state()).phase,'paused');
  const distance=(await state()).distance;
  for(let i=0;i<3;i++){await repeat(code);await settle();assert.equal((await state()).phase,'paused');}
  assert.equal((await state()).distance,distance);await page.keyboard.up(key);
  await page.keyboard.press(key);await settle();assert.equal((await state()).phase,'play');
 });
 await check('alternate physical crouch keys remain held independently',async()=>{
  await page.keyboard.down('ArrowDown');await page.keyboard.down('s');await settle();
  await page.keyboard.up('ArrowDown');await settle();assert.equal((await state()).crouch,true);
  await page.keyboard.up('s');await settle();assert.equal((await state()).crouch,false);
 });
 await check('alternate physical dash keys remain held independently',async()=>{
  await page.keyboard.down('ShiftLeft');await page.keyboard.down('ShiftRight');await settle();
  await page.keyboard.up('ShiftLeft');const before=(await state()).stamina;await settle();
  assert.ok((await state()).stamina<before);await page.keyboard.up('ShiftRight');
  const released=(await state()).stamina;await settle();assert.ok((await state()).stamina>released);
 });
 await check('jump repeat does not jump again after landing',async()=>{
  await page.keyboard.down('Space');await settle();assert.ok((await state()).jumpY>0);
  await page.waitForTimeout(800);assert.equal((await state()).jumpY,0);
  await repeat('Space');await settle();assert.equal((await state()).jumpY,0);await page.keyboard.up('Space');
 });
 await check('alternate movement keys each permit their own physical press',async()=>{
  await page.keyboard.press('ArrowLeft');await settle();
  await page.keyboard.down('ArrowRight');await settle();assert.equal((await state()).lane,1);
  await page.keyboard.down('d');await settle();assert.equal((await state()).lane,2);
  await page.keyboard.up('ArrowRight');await page.keyboard.up('d');
 });
 await check('blur and keyboard restart clear held crouch and dash',async()=>{
  await page.keyboard.down('ArrowDown');await page.keyboard.down('Shift');await settle();
  await page.evaluate(()=>window.dispatchEvent(new Event('blur')));assert.equal((await state()).phase,'paused');
  await page.keyboard.up('ArrowDown');await page.keyboard.up('Shift');await page.keyboard.press('Enter');await settle();
  assert.equal((await state()).crouch,false);const before=(await state()).stamina;await settle();assert.ok((await state()).stamina>=before);
  await page.keyboard.down('ArrowDown');await page.keyboard.down('Shift');await settle();
  // The native start button restarts a playing run; no simulation mutation.
  await page.evaluate(()=>document.querySelector('#start').click());await settle();
  assert.equal((await state()).crouch,false);assert.equal((await state()).stamina,100);
  await page.keyboard.up('ArrowDown');await page.keyboard.up('Shift');
 });
 for(const type of ['pointerup','pointercancel','pointerleave'])await check(`${type} releases pointer-held crouch and dash`,async()=>{
  for(const id of ['crouch','dash']){
   await page.locator('#'+id).dispatchEvent('pointerdown',{pointerId:1});await settle();
   if(id==='crouch')assert.equal((await state()).crouch,true);else assert.ok((await state()).stamina<100);
   await page.locator('#'+id).dispatchEvent(type,{pointerId:1});await settle();
   if(id==='crouch')assert.equal((await state()).crouch,false);else{const before=(await state()).stamina;await settle();assert.ok((await state()).stamina>=before);}
  }
 });
 await check('blur releases pointer holds before resume',async()=>{
  await page.locator('#dash').dispatchEvent('pointerdown',{pointerId:1});await settle();
  await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await page.keyboard.press('Enter');await settle();
  const before=(await state()).stamina;await settle();assert.ok((await state()).stamina>=before);
 });
 console.log(JSON.stringify({results,errors},null,2));
 assert.deepEqual(errors,[]);assert.equal(results.filter(r=>r.result==='FAIL').length,0,'native input regressions');
}finally{await browser?.close();await new Promise(r=>server.close(r));}
