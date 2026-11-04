import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { installPlaywrightAnalyticsBlock, isAnalyticsUrl } from "./analytics-blocker.mjs";
import { labHub, labTools, labGuides, labReferences } from "./water-laboratory-content.mjs";
import { rainHub, rainTools, rainGuides, rainReferences } from "./rainfall-records-content.mjs";
import { batchExamples } from "../assets/js/tools/matrix-spike-batch.js";

const { chromium }=createRequire(import.meta.url)("playwright");
const base=process.env.WSB_QA_BASE||"http://127.0.0.1:4211",local=new URL(base).hostname==="127.0.0.1";
const output=process.env.WSB_QA_REPORT||"tools-qa/weekly-growth-2026-11-04-local-results.json",images=process.env.WSB_QA_IMAGES;
const target=labTools[3][0],widths=[390,768,1024,1280,1440];
const paths=["/","/tools/",...[labHub,...labTools,...labGuides,...labReferences].map(x=>x[0]),...[rainHub,...rainTools,...rainGuides,...rainReferences].map(x=>x[0]),"/tools/pressure-tank-sizing-calculator/","/tools/groundwater-stabilization-log-analyzer/","/reference/greywater-source-use-screening/","/reference/water-pipe-internal-diameters/","/guides/how-to-read-a-pump-curve/"];
assert.equal(new Set(paths).size,21);
const report={date:"2026-11-04",base,scope:"21 selected/related/prior-release/protected pages ×5 widths; batch and protected interactions",widths,renders:0,geometry:[],interactions:[],tables:0,screenshots:[],analytics:{intercepted:0,completed:0},consoleErrors:[],pageErrors:[],requestFailures:[],internalHttpFailures:[],complete:false};
const hash=s=>createHash("sha256").update(s.replace(/\r\n/g,"\n")).digest("hex");
async function assets(dir="assets"){const e=await readdir(dir,{withFileTypes:true});return(await Promise.all(e.map(x=>x.isDirectory()?assets(join(dir,x.name)):/\.(js|css)$/.test(x.name)?[join(dir,x.name)]:[]))).flat();}
const publicPaths=[...(await readFile("sitemap.xml","utf8")).matchAll(/<loc>https:\/\/watersystemsbench.com([^<]+)<\/loc>/g)].map(m=>m[1]);
const sourceFiles=[...publicPaths.map(p=>p==="/"?"index.html":p.slice(1)+"index.html"),...await assets(),"partials/header.html","partials/footer.html","sitemap.xml","robots.txt","llms.txt","tools-qa/generate-site.mjs","tools-qa/water-laboratory-content.mjs","tools-qa/matrix-spike-batch-content.mjs","tools-qa/matrix-spike-batch-browser-qa.mjs"];
report.sourceHashes=Object.fromEntries(await Promise.all(sourceFiles.map(async p=>[p,hash(await readFile(p,"utf8"))])));
if(local)await fetch(base+"/__qa__/analytics-reset",{method:"POST"});
if(images)await mkdir(images,{recursive:true});
const browser=await chromium.launch({channel:"chrome",headless:true});report.browser=browser.version();
const context=await browser.newContext({serviceWorkers:"block",acceptDownloads:true});
await installPlaywrightAnalyticsBlock(context,report.analytics);
await context.grantPermissions(["clipboard-read","clipboard-write"],{origin:base});
await context.addInitScript(()=>{window.__prints=0;window.print=()=>window.__prints++;});
const page=await context.newPage();
page.on("console",m=>{if(m.type()==="error"&&!/ERR_BLOCKED_BY_CLIENT/.test(m.text()))report.consoleErrors.push(m.text());});
page.on("pageerror",e=>report.pageErrors.push(e.message));
page.on("requestfailed",r=>{if(!isAnalyticsUrl(r.url()))report.requestFailures.push({url:r.url(),error:r.failure()?.errorText});});
page.on("response",r=>{if(r.status()>=400&&new URL(r.url()).origin===new URL(base).origin)report.internalHttpFailures.push({url:r.url(),status:r.status()});});
const f=name=>page.locator(`#spike-batch-${name}`),run=()=>page.locator("[data-spike-run]").click();
const batch=()=>page.locator("[data-spike-report]"),summary=()=>page.locator("[data-spike-summary]").innerText();
async function open(path,width){await page.setViewportSize({width,height:900});const r=await page.goto(base+path,{waitUntil:"networkidle"});assert.equal(r.status(),200,path);}
async function snapshot(name,selector=null,fullPage=false){if(!images)return;const path=join(images,name+".png");if(selector)await page.locator(selector).evaluate(e=>window.scrollTo({top:e.getBoundingClientRect().top+scrollY-100,behavior:"instant"}));await page.screenshot({path,fullPage});report.screenshots.push(name+".png");}
async function geometry(path,width,stage){
 const g=await page.evaluate(()=>{
  const visible=e=>!!e.getClientRects().length,box=e=>{const b=e.getBoundingClientRect();return{x:b.x,right:b.right,y:b.y,bottom:b.bottom};};
  const bad=[...document.querySelectorAll("main input,main textarea,main select,main button,main legend,main h1,.tool-layout,.spike-batch")].filter(visible).filter(e=>{const b=box(e);return b.x< -1||b.right>innerWidth+1;}).map(e=>({tag:e.tagName,id:e.id,box:box(e)}));
  const unlabeled=[...document.querySelectorAll("main input,main select,main textarea")].filter(visible).filter(e=>!e.labels?.length&&!e.getAttribute("aria-label")).map(e=>e.id);
  const tables=[...document.querySelectorAll("main table")].filter(visible).map(t=>{const w=t.closest(".table-scroll")||t;return{table:t.scrollWidth,container:w.clientWidth,overflow:getComputedStyle(w).overflowX,box:box(w)};});
  return{doc:document.documentElement.scrollWidth,width:innerWidth,h1s:document.querySelectorAll("h1").length,h1:box(document.querySelector("h1")),header:box(document.querySelector(".site-header")),bad,unlabeled,tables,broken:[...document.images].filter(e=>!e.complete||!e.naturalWidth).map(e=>e.src)};
 });
 assert.ok(g.doc<=width+1,`${path} ${stage}: document overflow`);assert.equal(g.h1s,1);assert.deepEqual(g.bad,[]);assert.deepEqual(g.unlabeled,[]);assert.deepEqual(g.broken,[]);if(stage==="initial")assert.ok(g.h1.y>=g.header.bottom-1,"header/H1 overlap");
 for(const t of g.tables){assert.ok(t.box.x>=-1&&t.box.right<=width+1);if(t.table>t.container+1)assert.ok(["auto","scroll"].includes(t.overflow));report.tables++;}
 report.geometry.push({path,width,stage,...g});
}
async function stale(){assert.ok(await batch().isHidden());for(const key of["copy","download","print"])assert.ok(await page.locator(`[data-spike-${key}]`).isDisabled());}
async function download(){const event=page.waitForEvent("download");await page.locator("[data-spike-download]").click();const d=await event;assert.equal(d.suggestedFilename(),"matrix-spike-batch-audit.csv");return(await readFile(await d.path(),"utf8")).replace(/^\uFEFF/,"");}
async function upload(text,name="records.csv"){await f("file").setInputFiles({name,mimeType:"text/csv",buffer:Buffer.from(text)});await page.waitForFunction(()=>!document.querySelector("[data-spike-run]").disabled);assert.equal(await f("file").inputValue(),"");}
try{
 for(const width of widths){
  for(const path of paths){await open(path,width);await geometry(path,width,"initial");report.renders++;}
  console.log(`Render matrix: 21/21 at ${width}px`);
  await open(target,width);
  await snapshot(`${width}-target-top`);await page.locator('.spike-jump a').click();await page.waitForFunction(()=>Math.abs(document.querySelector("#spike-batch").getBoundingClientRect().top-100)<2);assert.ok(await page.locator("#spike-batch").evaluate(e=>e.getBoundingClientRect().top>=document.querySelector(".site-header").getBoundingClientRect().bottom));
  await page.emulateMedia({media:"print"});assert.ok(await page.locator(".spike-batch").isHidden());await page.emulateMedia({media:"screen"});
  await page.locator('[data-tool-form="lab-spike"] button[type="submit"]').click();assert.match(await page.locator(".reading-value").first().innerText(),/96/);
  await page.locator('[data-tool-form="lab-spike"] button[type="reset"]').click();
  await snapshot(`${width}-batch-input`,"[data-spike-batch-form]");
  await run();assert.match(await page.locator("[data-spike-count]").innerText(),/2\s*\/\s*3/);assert.match(await summary(),/1 within.*1 outside.*1 not calculated/);assert.match(await summary(),/incomplete/);
  const cells=await page.locator("[data-spike-rows] tr").evaluateAll(rows=>rows.map(r=>[...r.cells].map(c=>c.textContent)));
  assert.equal(cells[0][4],"96");assert.equal(cells[1][4],"40");assert.equal(cells[2][6],"Not calculated");
  await geometry(target,width,"batch-default");await snapshot(`${width}-batch-result`,"[data-spike-report]");
  const csv=await download();assert.equal(csv.split(/\r?\n/).length,4);assert.ok(csv.includes('"ND"'));assert.ok(csv.includes('"Outside entered range"'));
  await page.locator("[data-spike-copy]").click();const copy=(await page.evaluate(()=>navigator.clipboard.readText())).replace(/\r\n/g,"\n");assert.ok(copy.includes(batchExamples.basis));assert.ok(copy.includes("Review incomplete"));assert.ok(copy.includes(target));
  await page.locator("[data-spike-copy]").hover();assert.deepEqual(await page.locator("[data-spike-copy]").evaluate(e=>({c:getComputedStyle(e).color,b:getComputedStyle(e).backgroundColor})),{c:"rgb(255, 255, 255)",b:"rgb(18, 62, 80)"});
  const wrapper=page.locator("[data-spike-report] .table-scroll");await wrapper.focus();await page.keyboard.press("ArrowRight");
  await wrapper.evaluate(e=>{e.scrollTo({left:e.scrollWidth,behavior:"instant"});window.scrollTo({top:e.getBoundingClientRect().top+scrollY-150,behavior:"instant"});});
  assert.ok(await wrapper.evaluate(e=>e.querySelector("th:last-child").getBoundingClientRect().right<=e.getBoundingClientRect().right+1));await snapshot(`${width}-batch-rightmost`);
  await page.locator("[data-spike-print]").click();assert.ok(await page.evaluate(()=>window.__prints>0));await page.emulateMedia({media:"print"});
  assert.ok(await page.locator(".spike-print-inputs").isVisible());assert.ok((await page.locator("[data-spike-print-input]").innerText()).includes(batchExamples.basis));assert.ok(await page.locator("[data-spike-batch-form]").isHidden());assert.ok(await page.locator(".spike-actions").isHidden());assert.ok(await page.locator(".site-header").isHidden());
  if([390,1280].includes(width))await snapshot(`${width}-batch-print`,null,true);await page.emulateMedia({media:"screen"});
  await f("records").fill("bad,header\n1,2");await stale();await run();assert.ok((await page.locator("[data-spike-error]").innerText()).length>0);await stale();await page.emulateMedia({media:"print"});assert.ok(await page.locator(".spike-batch").isHidden());await page.emulateMedia({media:"screen"});
  await f("records").fill(batchExamples.basis);await run();await f("unit").selectOption("µg/L");await stale();assert.equal(await f("records").inputValue(),batchExamples.basis);await run();assert.match(await page.locator("[data-spike-context]").innerText(),/µg\/L/);
  await f("mode").selectOption("volume");await stale();assert.equal(await f("records").inputValue(),batchExamples.basis);await run();await stale();
  await page.locator("[data-spike-example]").click();await run();const volume=await page.locator("[data-spike-rows] tr").evaluateAll(rows=>rows.map(r=>r.cells[4].textContent));assert.equal(volume[0],"100");assert.equal(volume[1],"124");
  await page.locator('[data-spike-batch-form] button[type="reset"]').click();assert.equal(await f("mode").inputValue(),"basis");assert.equal(await f("unit").inputValue(),"mg/L");assert.equal(await f("records").inputValue(),batchExamples.basis);await stale();await run();
  await upload("bad,header\n1,2");await stale();await upload(batchExamples.basis);await run();await upload(batchExamples.basis);await run();
  await geometry(target,width,"batch-refilled");report.interactions.push({path:target,width,single96Preserved:true,batchMixedRows:true,fullCopy:true,realDownload:true,printHandlerAndMedia:true,rightmost:true,invalidRecovery:true,sourceUnits:true,modePreservesText:true,reset:true,repeatedFile:true,hover:true});
  for(const [path]of labTools.slice(0,3)){await open(path,width);await page.locator('[data-tool-form] button[type="submit"]').click();assert.ok(await page.locator(".result-report").isVisible());assert.doesNotMatch(await page.locator(".reading-value").innerText(),/NaN|Infinity/);await geometry(path,width,"peer-default");report.interactions.push({path,width,peerDefault:true});}
  await open("/tools/",width);await page.locator("[data-tool-system]").selectOption("rainfall-records");assert.equal(await page.locator("[data-tool-card]:visible").count(),4);await page.locator("[data-tool-search]").fill("no-match-qa-string");assert.equal(await page.locator("[data-tool-card]:visible").count(),0);await page.locator('button[type="reset"]').click();await page.waitForFunction(()=>document.querySelectorAll('[data-tool-card]:not([hidden])').length===59);report.interactions.push({path:"/tools/",width,nativeFinderReset:59});
  await open("/tools/groundwater-stabilization-log-analyzer/",width);const positions=await page.locator(".stabilization-criteria-grid input").evaluateAll(es=>es.filter(e=>["phCriterion","temperatureCriterion","conductivityCriterion","doCriterion","orpCriterion","turbidityCriterion"].includes(e.id)).map(e=>({x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y})));assert.equal(positions.length,6);if(width>900){for(let i=0;i<6;i+=2)assert.ok(Math.abs(positions[i].y-positions[i+1].y)<2);}else assert.ok(positions.every(p=>Math.abs(p.x-positions[0].x)<2));await page.locator('[data-tool-form] button[type="submit"]').click();assert.match(await page.locator(".result-report").innerText(),/MET/);report.interactions.push({path:"stabilization",width,alignment:true,default:true});
  await open("/tools/pressure-tank-sizing-calculator/",width);await page.locator('[data-tool-form] button[type="submit"]').click();assert.ok(await page.locator(".result-report").isVisible());await page.locator('[data-tool-form] button[type="reset"]').click();await page.locator(".result-report").waitFor({state:"hidden"});report.interactions.push({path:"pressure tank",width,defaultReset:true});
  console.log(`Batch and protected interactions passed at ${width}px`);
 }
 await open(target,390);
 const large="record,native,spiked,added,lower,upper\n"+Array.from({length:250},(_,i)=>`S-${i+1},5,14.6,10,80,120`).join("\n");await upload(large);await run();assert.equal(await page.locator("[data-spike-rows] tr").count(),100);assert.match(await page.locator("[data-spike-preview-note]").innerText(),/100 of 250/);assert.equal((await download()).split(/\r?\n/).length,251);
 await page.locator("[data-spike-copy]").click();assert.ok((await page.evaluate(()=>navigator.clipboard.readText())).includes("S-250"));assert.equal((await page.locator("[data-spike-print-input]").textContent()).split("\n").length,101);
 await f("records").fill("record,native,spiked,added,lower,upper\n<img src=x>,5,14.6,10,80,120");await run();assert.equal(await page.locator("[data-spike-rows] img").count(),0);assert.match(await page.locator("[data-spike-rows]").innerText(),/<img src=x>/);
 await f("records").fill("record,native,spiked,added,lower,upper\nA,=1,14.6,10,80,120");await run();assert.ok((await download()).includes('"\'=1"'));
 await upload("x".repeat(262145));await stale();assert.match(await page.locator("[data-spike-error]").innerText(),/256 KiB/);
 await f("records").fill("record,native,spiked,added,lower,upper\nUnresolved,ND,14.6,10,80,120");await run();assert.match(await summary(),/incomplete/);assert.ok(await page.locator("[data-spike-print]").isDisabled());await page.emulateMedia({media:"print"});assert.ok(await page.locator(".spike-batch").isHidden());await page.emulateMedia({media:"screen"});
 for(const action of["edit","reset"]){
  await page.evaluate(()=>{window.__fileText=File.prototype.text;File.prototype.text=function(){return new Promise(resolve=>window.__finishRead=()=>resolve("record,native,spiked,added,lower,upper\nSTALE,0,10,10,80,120"));};});
  await f("file").setInputFiles({name:"slow.csv",mimeType:"text/csv",buffer:Buffer.from("queued")});await page.waitForFunction(()=>typeof window.__finishRead==="function");
  if(action==="edit")await f("records").fill(batchExamples.basis);else await page.locator('[data-spike-batch-form] button[type="reset"]').click();
  await page.evaluate(()=>{File.prototype.text=window.__fileText;window.__finishRead();});await page.waitForTimeout(100);assert.equal(await f("records").inputValue(),batchExamples.basis);assert.equal(await f("file").inputValue(),"");await stale();
 }
 report.interactions.push({path:target,full250Export:true,preview100:true,oversizeRecovery:true,pendingEditAndResetCancel:true});
 const noScript=await browser.newContext({javaScriptEnabled:false,serviceWorkers:"block",viewport:{width:390,height:900}});await installPlaywrightAnalyticsBlock(noScript,report.analytics);const np=await noScript.newPage();await np.goto(base+target,{waitUntil:"networkidle"});assert.ok(await np.locator("[data-spike-run]").isDisabled());assert.ok(await np.locator("[data-spike-noscript]").isVisible());await np.locator("#spike-batch-records").fill("LOCAL_ONLY");assert.equal(await np.locator("[data-spike-batch-form]").evaluate(f=>[...new FormData(f).entries()].length),0);await noScript.close();report.interactions.push({nativeFallback:true,disabled:true,serializedEntries:0});
 for(const key of["consoleErrors","pageErrors","requestFailures","internalHttpFailures"])assert.deepEqual(report[key],[],key);
 assert.equal(report.analytics.completed,0);if(local)report.serverAnalytics=await(await fetch(base+"/__qa__/analytics-report.json")).json();else assert.ok(report.analytics.intercepted>0);
 for(const[p,h]of Object.entries(report.sourceHashes))assert.equal(hash(await readFile(p,"utf8")),h,p+" changed during run");report.sourceStableThroughoutRun=true;report.complete=true;
}catch(error){report.failure=error.stack;process.exitCode=1;}
finally{await browser.close();await writeFile(output,JSON.stringify(report,null,2));}
console.log(JSON.stringify({complete:report.complete,renders:report.renders,geometry:report.geometry.length,interactions:report.interactions.length,tables:report.tables,analytics:report.analytics,serverAnalytics:report.serverAnalytics,failure:report.failure}));
