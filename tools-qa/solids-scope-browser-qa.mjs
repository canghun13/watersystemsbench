import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { installPlaywrightAnalyticsBlock, isAnalyticsUrl } from './analytics-blocker.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const base = process.env.WSB_QA_BASE || 'http://127.0.0.1:4211';
const local = new URL(base).hostname === '127.0.0.1';
const baseline = process.argv.includes('--baseline');
const output = process.env.WSB_QA_REPORT;
assert.ok(output, 'Set a new dated WSB_QA_REPORT, never overwrite historical evidence.');
const images = process.env.WSB_QA_IMAGES;
const target = '/tools/tss-vss-gravimetric-calculator/';
const widths = baseline ? [390,1280] : [390,768,1024,1280,1440];
const paths = baseline ? [target,'/tools/matrix-spike-recovery-calculator/'] : ['/', '/tools/', '/systems/water-laboratory-qa/', target,
 '/tools/bod-seed-correction-bottle-analyzer/', '/tools/water-duplicate-rpd-batch-checker/', '/tools/matrix-spike-recovery-calculator/',
 '/guides/review-water-laboratory-calculations/', '/reference/water-laboratory-qc-calculation-bases/',
 '/systems/rainfall-records-gauge-networks/', '/reference/water-pipe-internal-diameters/', '/guides/how-to-read-a-pump-curve/',
 '/tools/groundwater-stabilization-log-analyzer/', '/tools/pressure-tank-sizing-calculator/', '/reference/greywater-source-use-screening/'];
const report = {date:'2026-11-11',checkedAt:new Date().toISOString(),base,baseline,widths,paths,renders:0,geometry:[],interactions:[],screenshots:[],analytics:{intercepted:0,completed:0},consoleErrors:[],pageErrors:[],requestFailures:[],httpFailures:[],complete:false};
const sourceFiles = ['assets/js/tools/water-laboratory-tools.js','tools-qa/water-laboratory-content.mjs',target.slice(1)+'index.html','sitemap.xml','assets/css/main.css','assets/css/water-laboratory.css','tools-qa/solids-scope-browser-qa.mjs'];
const digest = s=>createHash('sha256').update(s.replace(/\r\n/g,'\n')).digest('hex');
report.sourceHashes=Object.fromEntries(await Promise.all(sourceFiles.map(async p=>[p,digest(await readFile(p,'utf8'))])));
if(images) await mkdir(images,{recursive:true});
if(local) await fetch(base+'/__qa__/analytics-reset',{method:'POST'});
const browser = await chromium.launch({channel:'chrome',headless:true}); report.browser=browser.version();
const context = await browser.newContext({serviceWorkers:'block'});
await installPlaywrightAnalyticsBlock(context,report.analytics); // Before every first navigation.
await context.grantPermissions(['clipboard-read','clipboard-write'],{origin:base});
await context.addInitScript(()=>{window.__prints=0;window.print=()=>window.__prints++;});
const page=await context.newPage();
page.on('console',m=>{if(m.type()==='error'&&!/ERR_BLOCKED_BY_CLIENT/.test(m.text()))report.consoleErrors.push(m.text());});
page.on('pageerror',e=>report.pageErrors.push(e.message));
page.on('requestfailed',r=>{if(!isAnalyticsUrl(r.url()))report.requestFailures.push({url:r.url(),error:r.failure()?.errorText});});
page.on('response',r=>{if(r.status()>=400&&new URL(r.url()).origin===new URL(base).origin)report.httpFailures.push({url:r.url(),status:r.status()});});
async function open(path,width){await page.setViewportSize({width,height:1000});assert.equal((await page.goto(base+path,{waitUntil:'networkidle'})).status(),200);}
async function geometry(path,width,stage){
 const g=await page.evaluate(()=>({overflow:Math.max(0,document.documentElement.scrollWidth-innerWidth),h1:document.querySelector('h1').getBoundingClientRect().top,header:document.querySelector('.site-header').getBoundingClientRect().bottom,broken:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src),controls:[...document.querySelectorAll('input,select,textarea,button')].filter(e=>e.getBoundingClientRect().width&&getComputedStyle(e).visibility!=='hidden').filter(e=>e.getBoundingClientRect().left<0||e.getBoundingClientRect().right>innerWidth+1).map(e=>e.id||e.textContent)}));
 assert.equal(g.overflow,0);assert.deepEqual(g.broken,[]);assert.deepEqual(g.controls,[]);if(stage==='initial')assert.ok(g.h1>=g.header-1);
 report.geometry.push({path,width,stage,...g});
}
async function shot(name,fullPage=false){if(images){await page.screenshot({path:images+'/'+name+'.png',fullPage});report.screenshots.push(name);}}
const form=()=>page.locator('[data-tool-form="lab-solids"]');
const field=n=>form().locator(`[name="${n}"]`);
const run=()=>form().locator('button[type="submit"]').click();
const result=()=>page.locator('.result-report').first();
const reading=()=>page.locator('.reading-value').first().innerText();
async function stale(){assert.ok(await result().isHidden());assert.ok(await page.locator('[data-copy-result]').first().isDisabled());}
try{
 for(const width of widths){
  for(const path of paths){await open(path,width);await geometry(path,width,'initial');report.renders++;}
  await open(target,width);await run();assert.match(await reading(),/300/);assert.match(await result().innerText(),/VSS: 200/);
  if(baseline){assert.equal(await field('solidsScope').count(),0);await field('ash').fill('');await run();await stale();assert.match(await form().locator('[data-form-error]').innerText(),/required/);report.interactions.push({width,original300:true,tssOnlyScopeAbsent:true,missingAshBlocksTss:true});continue;}
  await form().evaluate(e=>window.scrollTo({top:e.getBoundingClientRect().top+scrollY-100,behavior:'instant'}));await shot(width+'-combined-top');
  await field('ash').fill('');await field('blank').fill('');await field('solidsScope').selectOption('tss');await stale();assert.ok(await field('ash').isDisabled());assert.ok(await field('ash').isHidden());assert.ok(await field('blank').isDisabled());await run();assert.match(await reading(),/300/);assert.match(await result().innerText(),/VSS.*not determined/i);assert.doesNotMatch(await result().innerText(),/Ignited filter \+ ash mass|Matching blank ignition mass loss/);
  await geometry(target,width,'tss-only');await form().evaluate(e=>window.scrollTo({top:e.getBoundingClientRect().top+scrollY-100,behavior:'instant'}));await shot(width+'-tss-form');
  await result().evaluate(e=>window.scrollTo({top:e.getBoundingClientRect().top+scrollY-100,behavior:'instant'}));await shot(width+'-tss-report');
  await page.locator('[data-copy-result]').first().click();const copied=await page.evaluate(()=>navigator.clipboard.readText());assert.match(copied,/TSS only/);assert.match(copied,/300/);assert.match(copied,/1\.1774/);assert.match(copied,/mg\/L/);assert.match(copied,/tss-vss-gravimetric-calculator/);assert.match(copied,/not determined/i);
  await page.locator('[data-print-result]').first().click();assert.ok(await page.evaluate(()=>window.__prints>0));await page.emulateMedia({media:'print'});assert.ok(await form().isHidden());assert.ok(await page.locator('.site-header').isHidden());assert.ok(await result().isVisible());assert.match(await result().innerText(),/TSS only/);if([390,1280].includes(width))await shot(width+'-tss-print',true);await page.emulateMedia({media:'screen'});
  await field('massUnit').selectOption('mg');await stale();assert.equal(await field('tare').inputValue(),'1177.4');await field('volumeUnit').selectOption('L');assert.equal(await field('volume').inputValue(),'0.1');await run();assert.match(await reading(),/300/);
  await field('solidsScope').selectOption('combined');await stale();assert.ok(await field('ash').isEnabled());await run();await stale();assert.match(await form().locator('[data-form-error]').innerText(),/required/);
  await field('ash').fill('1187.4');await field('blank').fill('0');await run();assert.match(await result().innerText(),/VSS: 200/);
  await field('solidsScope').selectOption('tss');await field('volume').fill('0');await run();await stale();await page.emulateMedia({media:'print'});assert.ok(await page.locator('.tool-layout').isHidden());await page.emulateMedia({media:'screen'});
  await field('volume').fill('0.1');await field('dry').fill('1100');await run();await stale();await field('dry').fill('1207.4');await run();assert.match(await reading(),/300/);
  await form().locator('button[type="reset"]').click();await page.waitForFunction(()=>document.querySelector('[name="solidsScope"]').value==='combined'&&!document.querySelector('[name="ash"]').disabled&&document.querySelector('.result-report').hidden);assert.equal(await field('massUnit').inputValue(),'g');assert.equal(await field('ash').inputValue(),'1.1874');await field('massUnit').selectOption('mg');assert.equal(await field('ash').inputValue(),'1187.4');await run();assert.match(await reading(),/300/);
  report.interactions.push({width,originalCombined:true,tssWithoutIgnition:true,unmeasuredNotZero:true,copy:true,printMediaAndHook:true,units:true,blankCombinedError:true,zeroAndMassOrderError:true,recovery:true,nativeResetAndSecondUnitSwitch:true});
  for(const[path,expected]of[['/tools/bod-seed-correction-bottle-analyzer/','2'],['/tools/water-duplicate-rpd-batch-checker/','0'],['/tools/matrix-spike-recovery-calculator/','96']]){await open(path,width);await page.locator('[data-tool-form] button[type="submit"]').first().click();assert.ok((await reading()).includes(expected));await geometry(path,width,'peer-result');}
  await open('/tools/matrix-spike-recovery-calculator/',width);await page.locator('[data-spike-run]').click();assert.match(await page.locator('[data-spike-count]').innerText(),/2\s*\/\s*3/);
  await open('/tools/',width);await page.locator('[data-tool-search]').fill('nonexistent-qascope');assert.equal(await page.locator('[data-tool-card]:visible').count(),0);await page.locator('button[type="reset"]').click();await page.waitForFunction(()=>document.querySelectorAll('[data-tool-card]:not([hidden])').length===59);
  await open('/tools/groundwater-stabilization-log-analyzer/',width);await page.locator('[data-tool-form] button[type="submit"]').click();assert.match(await reading(),/MET/);
  await open('/tools/pressure-tank-sizing-calculator/',width);await page.locator('[data-tool-form] button[type="submit"]').click();assert.ok(await result().isVisible());
  report.interactions.push({width,threeLabPeers:true,matrixBatch:true,finderNativeReset59:true,stabilization:true,pressure:true});
  console.log('Completed width '+width);
 }
 for(const k of ['consoleErrors','pageErrors','requestFailures','httpFailures'])assert.deepEqual(report[k],[],k);
 assert.equal(report.analytics.completed,0);
 if(local){report.serverAnalytics=await(await fetch(base+'/__qa__/analytics-report.json')).json();assert.equal(report.serverAnalytics.analyticsRequestsCompleted,0);assert.ok(report.serverAnalytics.analyticsRequestsIntercepted>0);}else assert.ok(report.analytics.intercepted>0);
 for(const[p,h]of Object.entries(report.sourceHashes))assert.equal(digest(await readFile(p,'utf8')),h,'Source changed during run: '+p);
 report.sourceStable=true;report.complete=true;
}catch(e){report.failure=e.stack;process.exitCode=1;}
finally{await browser.close();await writeFile(output,JSON.stringify(report,null,2));}
console.log(JSON.stringify({complete:report.complete,renders:report.renders,geometry:report.geometry.length,interactions:report.interactions.length,analytics:report.analytics,serverAnalytics:report.serverAnalytics,failure:report.failure}));
