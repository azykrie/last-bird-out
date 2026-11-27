import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)('/data/workspace/makefun/turkey-tools/node_modules/playwright');
const root=resolve('game'),server=createServer(async(req,res)=>{try{const path=resolve(root,'.'+new URL(req.url,'http://local').pathname.replace(/\/$/,'/index.html'));if(!path.startsWith(root+'/'))throw Error('path');const data=await readFile(path);res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html'})[extname(path)]||'application/octet-stream');res.end(data)}catch{res.writeHead(404);res.end()}});
let browser;const errors=[],external=[],failed=[];
try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base=`http://127.0.0.1:${server.address().port}`;
 browser=await chromium.launch({headless:true,executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const context=await browser.newContext({viewport:{width:1280,height:800},deviceScaleFactor:1});
 await context.route('**/*',r=>{if(r.request().url().startsWith(base))r.continue();else{external.push(r.request().url());r.abort()}});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('requestfailed',r=>failed.push(r.url()));
 const state=()=>page.evaluate(()=>window.__game);const shot=async name=>page.screenshot({path:`screenshots/${name}.jpg`,type:'jpeg',quality:82});
 await page.goto(base);await page.waitForFunction(()=>!!window.__game);await shot('02-title');await page.getByRole('button',{name:'MAKE A BREAK FOR IT'}).click();await page.waitForTimeout(90);assert.equal((await state()).phase,'play');
 await page.getByRole('button',{name:'Move left'}).click();await page.waitForTimeout(50);assert.equal((await state()).lane,0);await page.getByRole('button',{name:'Move right'}).click();await page.waitForTimeout(50);assert.equal((await state()).lane,1);
 await page.keyboard.down('Shift');await page.waitForTimeout(150);assert.ok((await state()).stamina<100);await page.keyboard.up('Shift');
 await page.keyboard.press('ArrowLeft');await page.waitForTimeout(50);assert.equal((await state()).lane,0);await page.keyboard.press('ArrowRight');await page.keyboard.press('Space');await page.waitForTimeout(100);assert.ok((await state()).jumpY>0);
 await page.keyboard.down('ArrowDown');await page.waitForTimeout(50);assert.equal((await state()).crouch,true);await page.keyboard.up('ArrowDown');
 await page.keyboard.press('p');const frozen=(await state()).distance;await page.waitForTimeout(300);assert.equal((await state()).distance,frozen);await page.keyboard.press('p');
 await page.getByRole('button',{name:'Toggle sound'}).click();assert.match(await page.locator('#sound').textContent(),/OFF/);await page.getByRole('button',{name:'Toggle sound'}).click();
 await page.evaluate(()=>window.dispatchEvent(new Event('blur')));assert.equal((await state()).phase,'paused');await page.keyboard.press('p');
 await page.waitForTimeout(900);await shot('03-farmyard');
 // Intentionally steer into hazards using only native arrow input.
 let until=Date.now()+26000;
 while(Date.now()<until){const s=await state();if(s.phase==='caught')break;const o=s.obstacles.find(o=>o.type!=='corn'&&o.z>.2&&o.z<.5);if(o){while((await state()).lane!==o.lane){const ss=await state();await page.keyboard.press(ss.lane<o.lane?'ArrowRight':'ArrowLeft');await page.waitForTimeout(25)}}await page.waitForTimeout(90)}
 assert.equal((await state()).phase,'caught');await page.keyboard.press('Enter');await page.waitForTimeout(60);assert.equal((await state()).lives,3);
 // Complete a full real-time run; diagnostics are read-only, all control is native.
 const start=Date.now();await page.evaluate(()=>{window.frameSamples=[];let p=performance.now();function f(n){window.frameSamples.push(n-p);p=n;if(window.frameSamples.length<600)requestAnimationFrame(f)}requestAnimationFrame(f)});
 until=Date.now()+85000;
 while(Date.now()<until){const s=await state();if(s.phase!=='play')break;const danger=s.obstacles.filter(o=>!o.done&&o.type!=='corn'&&o.z>.09&&o.z<.43);if(danger.some(o=>o.lane===s.lane)){const safe=[0,1,2].find(l=>!danger.some(o=>o.lane===l));if(safe!==undefined){await page.keyboard.press(s.lane<safe?'ArrowRight':'ArrowLeft')}}await page.waitForTimeout(45)}
 const end=await state();let frames=await page.evaluate(()=>window.frameSamples);assert.equal(end.phase,'win',JSON.stringify(end));await shot('04-freedom');const duration=(Date.now()-start)/1000;
 await page.keyboard.press('Enter');await page.waitForTimeout(40);assert.equal((await state()).distance<2,true);
 await page.setViewportSize({width:900,height:650});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.setViewportSize({width:1280,height:800});
 await page.goto(base+'/?shot=kitchen');await page.waitForFunction(()=>window.__game?.stage===2);await shot('01-kitchen');
 await context.setOffline(true);await page.waitForTimeout(250);assert.equal((await state()).phase,'play');
 assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);assert.deepEqual(external,[]);
 frames.sort((a,b)=>a-b);console.log(JSON.stringify({result:'PASS',nativeRunSeconds:duration,finishDistance:end.distance,finishLives:end.lives,frameSamples:frames.length,frameMeanMs:frames.reduce((a,b)=>a+b)/frames.length,frameP95Ms:frames[Math.floor(frames.length*.95)],errors,external,failed},null,2));
}finally{await browser?.close();await new Promise(r=>server.close(r))}
