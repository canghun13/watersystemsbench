import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {installPlaywrightAnalyticsBlock,isAnalyticsUrl} from './analytics-blocker.mjs';
const {chromium}=createRequire(import.meta.url)('playwright');
const base=process.env.WSB_QA_BASE||'http://127.0.0.1:4211',local=new URL(base).hostname==='127.0.0.1';
const output=process.env.WSB_QA_REPORT;assert.ok(output,'Use a new dated report path.');
const images=process.env.WSB_QA_IMAGES;
const tools=[...(await readFile('sitemap.xml','utf8')).matchAll(/<loc>https:\/\/watersystemsbench.com(\/tools\/[^<]+)<\/loc>/g)].map(m=>m[1]);assert.equal(tools.length,59);
const report={date:'2026-11-19',checkedAt:new Date().toISOString(),base,renders:0,allToolChecks:[],representativeChecks:[],geometry:[],screenshots:[],analytics:{intercepted:0,completed:0},consoleErrors:[],pageErrors:[],requestFailures:[],httpFailures:[],complete:false};
const digest=t=>createHash('sha256').update(t.replace(/\r\n/g,'\n')).digest('hex');
const sources=['assets/js/form-utils.js','assets/js/unit-conversions.js','assets/css/main.css','assets/css/calculator.css','tools-qa/generate-site.mjs','sitemap.xml','tools-qa/result-invalidation-browser-qa.mjs'];
report.sourceHashes=Object.fromEntries(await Promise.all(sources.map(async p=>[p,digest(await readFile(p,'utf8'))])));
if(images)await mkdir(images,{recursive:true});if(local)await fetch(base+'/__qa__/analytics-reset',{method:'POST'});
const browser=await chromium.launch({channel:'chrome',headless:true});report.browser=browser.version();
const context=await browser.newContext({serviceWorkers:'block'});await installPlaywrightAnalyticsBlock(context,report.analytics);
await context.grantPermissions(['clipboard-read','clipboard-write'],{origin:base});await context.addInitScript(()=>{window.__printCalls=0;window.print=()=>window.__printCalls++;});
const page=await context.newPage();
page.on('console',m=>{if(m.type()==='error'&&!/ERR_BLOCKED_BY_CLIENT/.test(m.text()))report.consoleErrors.push(m.text());});page.on('pageerror',e=>report.pageErrors.push(e.message));
page.on('requestfailed',r=>{if(!isAnalyticsUrl(r.url()))report.requestFailures.push({url:r.url(),error:r.failure()?.errorText});});page.on('response',r=>{if(r.status()>=400&&new URL(r.url()).origin===new URL(base).origin)report.httpFailures.push({url:r.url(),status:r.status()});});
const form=()=>page.locator('[data-tool-form]').first(),layout=()=>form().locator('xpath=ancestor::*[contains(concat(" ",normalize-space(@class)," ")," tool-layout ")][1]');
const result=()=>layout().locator('.result-report');const submit=()=>form().locator('button[type="submit"]').click();
async function open(path,width){await page.setViewportSize({width,height:1000});assert.equal((await page.goto(base+path,{waitUntil:'networkidle'})).status(),200,path);report.renders++;}
async function stale(){assert.ok(await result().isHidden());assert.equal(await form().getAttribute('data-last-result'),'');assert.equal(await layout().locator('[data-result-action]:enabled').count(),0);}
async function reset(){await form().locator('button[type="reset"]').click();await page.waitForFunction(()=>document.querySelector('.result-report').hidden);}
async function geometry(path,width){const g=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-innerWidth,badControls:[...document.querySelectorAll('input,select,textarea,button')].filter(e=>e.getBoundingClientRect().width&&getComputedStyle(e).visibility!=='hidden').filter(e=>e.getBoundingClientRect().left<0||e.getBoundingClientRect().right>innerWidth+1).map(e=>e.id),broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)}));assert.ok(g.overflow<=1);assert.deepEqual(g.badControls,[]);assert.deepEqual(g.broken,[]);report.geometry.push({path,width,...g});}
async function shot(name,selector,fullPage=false){if(!images)return;if(selector)await page.locator(selector).first().evaluate(e=>window.scrollTo({top:e.getBoundingClientRect().top+scrollY-110,behavior:'instant'}));await page.screenshot({path:images+'/'+name+'.png',fullPage});report.screenshots.push(name);}
try{
 for(const path of tools){
  await open(path,1280);await submit();assert.ok(await result().isVisible());
  const field=form().locator('input:not([type="file"]):not([type="hidden"]):not([disabled]):visible,textarea:not([disabled]):visible').first();
  const selects=form().locator('select:not([disabled]):visible');let control;
  if(await field.count()){
   control=await field.getAttribute('name')||await field.getAttribute('id');const type=await field.getAttribute('type');
   if(type==='checkbox'||type==='radio')await field.click();else if(type==='number')await field.fill(String(Number(await field.inputValue())+1));else await field.fill((await field.inputValue())+'\n');
  }else{assert.ok(await selects.count());const sel=selects.first(),current=await sel.inputValue();const value=await sel.locator('option:not([disabled])').evaluateAll((es,v)=>es.find(e=>e.value!==v)?.value,current);assert.ok(value!=null);control=await sel.getAttribute('name')||await sel.getAttribute('id');await sel.selectOption(value);}
  await stale();await reset();await submit();assert.ok(await result().isVisible());
  const changed=await form().evaluate(f=>{const e=[...f.querySelectorAll('input,textarea,select')].find(e=>!e.disabled&&e.type!=='file'&&e.type!=='hidden'&&e.getBoundingClientRect().width);if(!e)return null;e.dispatchEvent(new Event('change',{bubbles:true}));return e.id||e.name;});assert.ok(changed);await stale();
  await reset();await submit();assert.ok(await result().isVisible());await geometry(path,1280);report.allToolChecks.push({path,control,nativeEditClears:true,changeEventClears:true,resetAndRerun:true,copyPacketCleared:true,actionsDisabled:true});
 }
 assert.equal(report.allToolChecks.length,59);console.log('All 59 native-edit/change/reset checks passed.');
 const paths=['/tools/water-storage-tank-sizing-planner/','/tools/total-dynamic-head-calculator/','/tools/tss-vss-gravimetric-calculator/','/tools/pressure-tank-sizing-calculator/','/tools/groundwater-stabilization-log-analyzer/','/tools/matrix-spike-recovery-calculator/'];
 for(const width of[390,768,1024,1280,1440]){
  for(const path of paths){await open(path,width);await submit();assert.ok(await result().isVisible());
   const field=form().locator('input[type="number"]:not([disabled]):visible').first();await field.fill(String(Number(await field.inputValue())+1));await stale();await reset();await submit();await geometry(path,width);report.representativeChecks.push({path,width,editReset:true});
  }
  await open(paths[0],width);await submit();assert.match(await layout().locator('.reading-value').innerText(),/3,200/);await form().locator('[name="dailyDemand"]').fill('3000');await stale();await shot(width+'-storage-edited','[data-tool-form]');
  await page.emulateMedia({media:'print'});assert.ok(await result().isHidden());if([390,1280].includes(width))await shot(width+'-edited-print',null,true);await page.emulateMedia({media:'screen'});
  await submit();assert.match(await layout().locator('.reading-value').innerText(),/7,200/);await layout().locator('[data-copy-result]').click();assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/7,200/);await layout().locator('[data-print-result]').click();assert.ok(await page.evaluate(()=>window.__printCalls>0));await shot(width+'-storage-recalculated','.result-panel');
  await form().locator('[name="dailyDemand"]').fill('-1');await stale();await submit();await stale();assert.ok((await form().locator('[data-form-error]').innerText()).length>0);await reset();await submit();assert.match(await layout().locator('.reading-value').innerText(),/3,200/);
  await open('/tools/matrix-spike-recovery-calculator/',width);await submit();await page.locator('[data-spike-run]').click();assert.ok(await page.locator('[data-spike-report]').isVisible());await form().locator('[name="native"]').fill('6');await stale();assert.ok(await page.locator('[data-spike-report]').isVisible(),'Other form packet must remain independent');await submit();await page.locator('#spike-batch-records').fill('bad,header\n1,2');assert.ok(await page.locator('[data-spike-report]').isHidden());assert.ok(await result().isVisible(),'Batch edit must not clear single form');
  await open('/tools/',width);await page.locator('[data-tool-search]').fill('no-result-invalidation');assert.equal(await page.locator('[data-tool-card]:visible').count(),0);await page.locator('button[type="reset"]').click();await page.waitForFunction(()=>document.querySelectorAll('[data-tool-card]:not([hidden])').length===59);
  report.representativeChecks.push({width,storage3200Edit7200:true,actualCopy:true,printHookAndEditedMedia:true,invalidRecovery:true,matrixFormIsolation:true,finder59:true});console.log('Focused lifecycle checks passed at '+width);
 }
 for(const key of['consoleErrors','pageErrors','requestFailures','httpFailures'])assert.deepEqual(report[key],[],key);assert.equal(report.analytics.completed,0);
 if(local){report.serverAnalytics=await(await fetch(base+'/__qa__/analytics-report.json')).json();assert.equal(report.serverAnalytics.analyticsRequestsCompleted,0);assert.ok(report.serverAnalytics.analyticsRequestsIntercepted>0);}else assert.ok(report.analytics.intercepted>0);
 for(const[p,h]of Object.entries(report.sourceHashes))assert.equal(digest(await readFile(p,'utf8')),h,p+' source changed during run');report.sourceStable=true;report.complete=true;
}catch(e){report.failure=e.stack;process.exitCode=1;}finally{await browser.close();await writeFile(output,JSON.stringify(report,null,2));}
console.log(JSON.stringify({complete:report.complete,renders:report.renders,allTools:report.allToolChecks.length,representative:report.representativeChecks.length,analytics:report.analytics,serverAnalytics:report.serverAnalytics,failure:report.failure}));
