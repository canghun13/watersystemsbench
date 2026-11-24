import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {installPlaywrightAnalyticsBlock,isAnalyticsUrl} from './analytics-blocker.mjs';
const {chromium}=createRequire(import.meta.url)('playwright');
const base=process.env.WSB_QA_BASE||'http://127.0.0.1:4211',local=new URL(base).hostname==='127.0.0.1';
const output=process.env.WSB_QA_REPORT;assert.ok(output,'Set a new dated report path.');const images=process.env.WSB_QA_IMAGES;
const target='/tools/rainwater-tank-days-of-supply-simulator/',widths=[390,768,1024,1280,1440];
const paths=[target,'/tools/water-storage-tank-sizing-planner/','/tools/pressure-tank-sizing-calculator/','/tools/total-dynamic-head-calculator/','/tools/tss-vss-gravimetric-calculator/','/tools/groundwater-stabilization-log-analyzer/','/tools/','/'];
const report={date:'2026-11-24',checkedAt:new Date().toISOString(),base,widths,paths,renders:0,geometry:[],tableChecks:[],interactions:[],screenshots:[],analytics:{intercepted:0,completed:0},consoleErrors:[],pageErrors:[],requestFailures:[],httpFailures:[],complete:false};
const hash=t=>createHash('sha256').update(t.replace(/\r\n/g,'\n')).digest('hex');
const sources=['assets/js/tools/rainwater-simulator.js','assets/js/tools/storage-tank-sizing.js','assets/js/form-utils.js','assets/css/calculator.css','assets/css/content.css',target.slice(1)+'index.html','tools-qa/generate-site.mjs','sitemap.xml','tools-qa/rainwater-result-table-browser-qa.mjs'];
report.sourceHashes=Object.fromEntries(await Promise.all(sources.map(async p=>[p,hash(await readFile(p,'utf8'))])));
if(images)await mkdir(images,{recursive:true});if(local)await fetch(base+'/__qa__/analytics-reset',{method:'POST'});
const browser=await chromium.launch({channel:'chrome',headless:true});report.browser=browser.version();const context=await browser.newContext({serviceWorkers:'block'});await installPlaywrightAnalyticsBlock(context,report.analytics);
await context.grantPermissions(['clipboard-read','clipboard-write'],{origin:base});await context.addInitScript(()=>{window.__prints=0;window.print=()=>window.__prints++;});const page=await context.newPage();
page.on('console',m=>{if(m.type()==='error'&&!/ERR_BLOCKED_BY_CLIENT/.test(m.text()))report.consoleErrors.push(m.text());});page.on('pageerror',e=>report.pageErrors.push(e.message));page.on('requestfailed',r=>{if(!isAnalyticsUrl(r.url()))report.requestFailures.push({url:r.url(),error:r.failure()?.errorText});});page.on('response',r=>{if(r.status()>=400&&new URL(r.url()).origin===new URL(base).origin)report.httpFailures.push({url:r.url(),status:r.status()});});
const form=()=>page.locator('[data-tool-form]').first(),field=n=>form().locator(`[name="${n}"]`),result=()=>page.locator('.result-report').first(),run=()=>form().locator('button[type="submit"]').click(),table=()=>result().locator('table'),region=()=>result().locator('.table-scroll');
async function open(path,width){await page.setViewportSize({width,height:1000});assert.equal((await page.goto(base+path,{waitUntil:'networkidle'})).status(),200,path);report.renders++;}
async function stale(){assert.ok(await result().isHidden());assert.equal(await form().getAttribute('data-last-result'),'');assert.equal(await page.locator('[data-result-action]:enabled').count(),0);}
async function reset(){await form().locator('button[type="reset"]').click();await page.waitForFunction(()=>document.querySelector('.result-report').hidden);}
async function geometry(path,width,stage){const g=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,h1:document.querySelector('h1').getBoundingClientRect().top,header:document.querySelector('.site-header').getBoundingClientRect().bottom,badControls:[...document.querySelectorAll('input,select,textarea,button')].filter(e=>e.getBoundingClientRect().width&&getComputedStyle(e).visibility!=='hidden').filter(e=>e.getBoundingClientRect().left<0||e.getBoundingClientRect().right>innerWidth+1).map(e=>e.id||e.textContent),broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)}));assert.ok(g.overflow<=1,JSON.stringify({path,width,stage,...g}));assert.deepEqual(g.badControls,[]);assert.deepEqual(g.broken,[]);if(stage==='initial')assert.ok(g.h1>=g.header-1);report.geometry.push({path,width,stage,...g});}
async function shot(name,selector,fullPage=false){if(!images)return;if(selector)await page.locator(selector).first().evaluate(e=>window.scrollTo({top:e.getBoundingClientRect().top+scrollY-110,behavior:'instant'}));await page.screenshot({path:images+'/'+name+'.png',fullPage});report.screenshots.push(name);}
async function tableCheck(width,stage){
 assert.equal(await table().locator('tbody tr').count(),12);assert.equal(await table().locator('thead th').count(),5);assert.equal(await region().getAttribute('tabindex'),'0');assert.equal(await region().getAttribute('role'),'region');
 await region().focus();await page.keyboard.press('Home');await region().evaluate(e=>e.scrollLeft=0);
 const left=await table().locator('tbody tr').first().innerText();assert.ok(left.startsWith('1\t'));
 await region().evaluate(e=>e.scrollLeft=e.scrollWidth);
 const g=await region().evaluate(e=>{const b=e.getBoundingClientRect(),r=e.querySelector('tr:last-child td:last-child').getBoundingClientRect();return{scrollLeft:e.scrollLeft,scrollWidth:e.scrollWidth,clientWidth:e.clientWidth,overflowX:getComputedStyle(e).overflowX,ownerLeft:b.left,ownerRight:b.right,lastRight:r.right,lastLeft:r.left,focused:document.activeElement===e};});
 assert.ok(g.ownerLeft>=0&&g.ownerRight<=width+1);assert.ok(g.lastRight<=g.ownerRight+2&&g.lastLeft>=g.ownerLeft-1);assert.equal(g.focused,true);assert.equal(g.overflowX,'auto');if(width===390)assert.ok(g.scrollLeft>0);
 report.tableChecks.push({width,stage,rows:12,columns:5,...g});
 await geometry(target,width,stage+'-rightmost');
}
try{
 for(const width of widths){
  for(const path of paths){await open(path,width);await geometry(path,width,'initial');}
  await open(target,width);await run();assert.match(await page.locator('.reading-value').innerText(),/^100%$/);assert.match(await result().innerText(),/Total collection: 102,000 L/);assert.match(await result().innerText(),/End storage: 9,750 L/);
  await tableCheck(width,'SI');await shot(width+'-rightmost','.table-scroll');await region().evaluate(e=>e.scrollLeft=0);await shot(width+'-result','.result-report');await shot(width+'-form','[data-tool-form]');
  await page.locator('[data-copy-result]').click();const copied=await page.evaluate(()=>navigator.clipboard.readText());assert.match(copied,/Daily demand reliability/);assert.match(copied,/102,000/);assert.match(copied,/End storage/);assert.match(copied,/9,750/);assert.match(copied,/12/);
  await page.locator('[data-print-result]').click();assert.ok(await page.evaluate(()=>window.__prints>0));if(width===1280){await page.emulateMedia({media:'print'});assert.ok(await result().isVisible());assert.ok(await form().isHidden());assert.ok(await page.locator('.site-header').isHidden());assert.equal(await table().locator('tbody tr').count(),12);await shot(width+'-print',null,true);await page.emulateMedia({media:'screen'});}
  await field('unitSystem').selectOption('US');await stale();await run();assert.match(await page.locator('.reading-value').innerText(),/^100%$/);assert.match(await region().getAttribute('aria-label'),/US gal/);await tableCheck(width,'US');
  await field('unitSystem').selectOption('SI');await stale();await run();assert.match(await page.locator('.reading-value').innerText(),/^100%$/);
  await field('capacity').fill('100000000');await field('initial').fill('99999999');await field('area').fill('10000000');await field('dailyDemand').fill('10000000');for(let i=1;i<=12;i++)await field('rain'+i).fill('5000');await run();assert.ok(await result().isVisible());await tableCheck(width,'large-numbers');if([390,1280].includes(width))await shot(width+'-large-rightmost','.table-scroll');
  await field('capacity').fill('0');await stale();await run();await stale();assert.match(await form().locator('[data-form-error]').innerText(),/greater than zero/);await field('capacity').fill('10000');await run();assert.ok(await result().isVisible());
  await reset();await run();assert.match(await page.locator('.reading-value').innerText(),/^100%$/);await tableCheck(width,'native-reset');await field('unitSystem').selectOption('US');await stale();await run();assert.match(await page.locator('.reading-value').innerText(),/^100%$/);await reset();
  await run();await region().focus();await page.keyboard.press('ArrowRight');await page.waitForTimeout(200);if(width===390)assert.ok(await region().evaluate(e=>e.scrollLeft>0));
  report.interactions.push({width,defaultMathPreserved:true,copyIncludes12Months:true,printHook:true,SIUS:true,nativeResetAndSecondUnitSwitch:true,largeNumbers:true,invalidRecovery:true,editedStale:true,keyboardScroll:true});
  for(const path of paths.slice(1,6)){await open(path,width);await run();assert.ok(await result().isVisible());await geometry(path,width,'control-result');if(path.includes('storage'))assert.match(await page.locator('.reading-value').innerText(),/3,200/);}
  await open('/tools/',width);await page.locator('[data-tool-search]').fill('nonexistent-rainwaterqa');assert.equal(await page.locator('[data-tool-card]:visible').count(),0);await page.locator('button[type="reset"]').click();await page.waitForFunction(()=>document.querySelectorAll('[data-tool-card]:not([hidden])').length===59);
  console.log('Completed width '+width);
 }
 for(const k of['consoleErrors','pageErrors','requestFailures','httpFailures'])assert.deepEqual(report[k],[],k);assert.equal(report.analytics.completed,0);
 if(local){report.serverAnalytics=await(await fetch(base+'/__qa__/analytics-report.json')).json();assert.equal(report.serverAnalytics.analyticsRequestsCompleted,0);assert.ok(report.serverAnalytics.analyticsRequestsIntercepted>0);}else assert.ok(report.analytics.intercepted>0);
 for(const[p,h]of Object.entries(report.sourceHashes))assert.equal(hash(await readFile(p,'utf8')),h,'Source changed during run: '+p);report.sourceStable=true;report.complete=true;
}catch(e){report.failure=e.stack;process.exitCode=1;}
await browser.close();await writeFile(output,JSON.stringify(report,null,2));console.log(JSON.stringify({complete:report.complete,renders:report.renders,geometry:report.geometry.length,tables:report.tableChecks.length,interactions:report.interactions.length,screenshots:report.screenshots.length,analytics:report.analytics,serverAnalytics:report.serverAnalytics,failure:report.failure}));
