// Fresh release runner; historical browser-results.json is intentionally untouched.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { installPlaywrightAnalyticsBlock, isAnalyticsUrl } from "./analytics-blocker.mjs";
import { labHub, labTools, labGuides, labReferences } from "./water-laboratory-content.mjs";

const { chromium } = createRequire(import.meta.url)("playwright");
const root = fileURLToPath(new URL("..", import.meta.url));
const base = process.env.WSB_QA_BASE || "http://127.0.0.1:4173";
const output = process.env.WSB_QA_REPORT || join(root,"tools-qa/water-laboratory-2026-10-16-local-results.json");
const imageDir = process.env.WSB_QA_IMAGES;
const widths = [390,768,1024,1280,1440];
const newPaths = [labHub,...labTools,...labGuides,...labReferences].map(x=>x[0]);
const fullPaths = [...(await readFile(join(root,"sitemap.xml"),"utf8")).matchAll(/<loc>https:\/\/watersystemsbench.com([^<]+)<\/loc>/g)].map(x=>x[1]);
assert.equal(fullPaths.length,105);
const smoke = process.env.WSB_QA_SMOKE === "1";
const paths = smoke ? newPaths : fullPaths;
const report = {date:"2026-10-16",base,widths,scope:smoke?"New-cluster smoke matrix only":"Full 105-page release render matrix; new-cluster interactions plus protected controls",renders:0,toolDefaults:0,toolResets:0,tableChecks:0,geometry:[],interactions:[],screenshots:[],consoleErrors:[],pageErrors:[],requestFailures:[],internalHttpFailures:[],analytics:{intercepted:0,completed:0},complete:false};
const local = ["127.0.0.1","localhost"].includes(new URL(base).hostname);
if(local) await fetch(base+"/__qa__/analytics-reset",{method:"POST"});
if(imageDir) await mkdir(imageDir,{recursive:true});
const browser=await chromium.launch({channel:"chrome",headless:true});
report.browser=browser.version();
const context=await browser.newContext({viewport:{width:1280,height:900},serviceWorkers:"block"});
await installPlaywrightAnalyticsBlock(context,report.analytics);
await context.grantPermissions(["clipboard-read","clipboard-write"],{origin:base});
await context.addInitScript(()=>{window.__printCalls=0;window.print=()=>window.__printCalls++;});
const page=await context.newPage();
page.on("console",m=>{if(m.type()==="error"&&!/ERR_BLOCKED_BY_CLIENT/.test(m.text()))report.consoleErrors.push(m.text());});
page.on("pageerror",e=>report.pageErrors.push(e.message));
page.on("requestfailed",r=>{if(!isAnalyticsUrl(r.url())) report.requestFailures.push({url:r.url(),error:r.failure()?.errorText});});
page.on("response",r=>{if(r.status()>=400 && new URL(r.url()).origin===new URL(base).origin) report.internalHttpFailures.push({url:r.url(),status:r.status()});});
async function open(path,width){await page.setViewportSize({width,height:900}); const response=await page.goto(base+path,{waitUntil:"networkidle"});assert.equal(response.status(),200,path);await page.locator(".site-header").waitFor();await page.locator(".site-footer").waitFor();}
async function geometry(path,width,state){
 const g=await page.evaluate(()=>{
  const visible=e=>!!e.getClientRects().length && getComputedStyle(e).visibility!=="hidden";
  const box=e=>{const b=e.getBoundingClientRect();return {x:b.x,y:b.y,right:b.right,bottom:b.bottom,width:b.width,height:b.height};};
  const offenders=[...document.querySelectorAll("main h1, main input, main select, main textarea, main button, main legend, .tool-layout, .instrument-panel, .result-panel")].filter(visible).filter(e=>{const b=box(e);return b.x< -1||b.right>innerWidth+1;}).map(e=>({tag:e.tagName,id:e.id,box:box(e)}));
  const unlabeled=[...document.querySelectorAll("main input,main select,main textarea")].filter(visible).filter(e=>e.type!=="hidden"&&!e.labels?.length&&!e.getAttribute("aria-label")).map(e=>e.id);
  const tables=[...document.querySelectorAll("main table")].filter(visible).map(t=>{
   const wrapper=t.closest(".table-scroll")||(["auto","scroll"].includes(getComputedStyle(t).overflowX)?t:null);
   if(!wrapper){const r=box(t),last=box(t.querySelector("tr:last-child > :last-child")),side=document.querySelector(".sidebar"),sb=side?box(side):null;return {width:t.scrollWidth,ownerWidth:innerWidth,accessible:last.right<=innerWidth+1,within:r.x>=-1&&r.right<=innerWidth+1&&!(sb&&sb.x>r.x&&r.right>sb.x+1),overflow:"visible"};}
   const before=wrapper.scrollLeft;wrapper.scrollLeft=wrapper.scrollWidth;
   const bounds=box(wrapper),last=box(t.querySelector("tr:last-child > :last-child"));
   const item={width:t.scrollWidth,ownerWidth:wrapper.clientWidth,accessible:last.right<=bounds.right+2&&last.right>bounds.x,within:bounds.x>=-1&&bounds.right<=innerWidth+1,overflow:getComputedStyle(wrapper).overflowX};wrapper.scrollLeft=before;return item;
  });
  return {scrollWidth:document.documentElement.scrollWidth,width:document.documentElement.clientWidth,h1s:document.querySelectorAll("h1").length,h1:box(document.querySelector("h1")),header:box(document.querySelector(".site-header")),offenders,unlabeled,tables,broken:[...document.images].filter(e=>!e.complete||!e.naturalWidth).map(e=>e.src)};
 });
 assert.equal(g.h1s,1,path);assert.ok(g.scrollWidth<=g.width+1,`${path} ${width} overflow ${g.scrollWidth}`);assert.deepEqual(g.offenders,[],`${path} ${width} offscreen ${state}`);assert.deepEqual(g.unlabeled,[],path);assert.deepEqual(g.broken,[],`${path} broken images`);
 if(state==="initial") assert.ok(g.h1.y>=g.header.bottom-1,`${path} header overlap`);
 for(const t of g.tables){assert.ok(t.accessible&&t.within,`${path} inaccessible table`);if(t.width>t.ownerWidth+1)assert.ok(["auto","scroll"].includes(t.overflow));report.tableChecks++;}
 report.geometry.push({path,width,state,...g});
}
async function capture(name,selector){if(!imageDir)return; const path=join(imageDir,`${name}.png`);if(selector)await page.locator(selector).evaluate(e=>window.scrollTo({top:e.getBoundingClientRect().top+window.scrollY-90,behavior:"instant"}));else await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));await page.screenshot({path,fullPage:!selector});report.screenshots.push(`${name}.png`);}
async function submit(){await page.locator('[data-tool-form] button[type="submit"]').click();await assertVisible();}
async function assertVisible(){await page.locator(".result-report").waitFor({state:"visible"});assert.equal(await page.locator("[data-form-error]").textContent(),"");assert.ok(!/\b(?:NaN|Infinity)\b/.test(await page.locator(".result-report").innerText()));}
async function fill(name,value){await page.locator(`[name="${name}"]`).fill(String(value));}
async function rowText(){return page.locator(".result-report").innerText();}
async function errorThenRecover(name,bad){const f=page.locator(`[name="${name}"]`),old=await f.inputValue();await f.fill(String(bad));assert.ok(await page.locator(".result-report").isHidden());await page.locator('[data-tool-form] button[type="submit"]').click();assert.ok((await page.locator("[data-form-error]").textContent()).length>0);assert.ok(await page.locator(".result-report").isHidden());await f.fill(old);await submit();}
try {
 for(const width of widths){
  for(const path of paths){await open(path,width);await geometry(path,width,"initial");report.renders++;
   if(width===1280&&path.startsWith("/tools/")&&path!=="/tools/"){await submit();report.toolDefaults++;await page.locator('[data-tool-form] button[type="reset"]').click();await page.waitForFunction(()=>document.querySelector(".result-report")?.hidden);report.toolResets++;}
   if([390,1280].includes(width)&&[labHub[0],labGuides[0][0],"/tools/","/"].includes(path))await capture(`${width}-${path==="/"?"home":path.split("/")[1]+"-"+path.split("/")[2]}`);
  }
  console.log(`Rendered ${paths.length}/${paths.length} at ${width}px`);
 }
 assert.equal(report.renders,smoke?35:525);assert.equal(report.toolDefaults,smoke?4:55);assert.equal(report.toolResets,smoke?4:55);
 for(const width of widths) for(const [index,[path]] of labTools.entries()){
  await open(path,width);await submit();await geometry(path,width,"result");
  const text=await rowText();
  if(index===0){assert.match(text,/85/);assert.match(text,/No — entered DO check not met/);assert.match(text,/Depletion below entered minimum/);await errorThenRecover("bottleMl",0);}
  if(index===1){assert.match(text,/300/);assert.match(text,/200/);await errorThenRecover("volume",0);await page.selectOption('[name="massUnit"]',"mg");assert.ok(Math.abs(Number(await page.locator('[name="tare"]').inputValue())-1177.4)<1e-8);await page.selectOption('[name="volumeUnit"]',"L");await submit();assert.match(await rowText(),/300/);await page.selectOption('[name="massUnit"]',"g");await page.selectOption('[name="volumeUnit"]',"mL");await submit();}
  if(index===2){assert.match(text,/18.1818/);assert.match(text,/Censored — no substitution/);assert.match(text,/Not assessed/);await errorThenRecover("pairs","wrong,header\nA,1");}
  if(index===3){assert.match(text,/96/);await errorThenRecover("added",0);}
  await page.locator("[data-copy-result]").click();await page.waitForFunction(()=>document.querySelector("[data-copy-result]").textContent==="Copied");assert.match(await page.evaluate(()=>navigator.clipboard.readText()),/Input record/);
  await page.locator("[data-print-result]").click();assert.ok(await page.evaluate(()=>window.__printCalls)>0);
  await page.emulateMedia({media:"print"});assert.equal(await page.locator(".instrument-panel").isVisible(),false);assert.equal(await page.locator(".result-report").isVisible(),true);await page.emulateMedia({media:"screen"});
  if([390,1280].includes(width)){await capture(`${width}-tool-${index+1}-result`,".tool-layout");await capture(`${width}-tool-${index+1}-report`,".result-panel");}
  const hover=page.locator("[data-copy-result]");await hover.hover();const colors=await hover.evaluate(e=>({color:getComputedStyle(e).color,bg:getComputedStyle(e).backgroundColor}));assert.equal(colors.color,"rgb(255, 255, 255)");assert.equal(colors.bg,"rgb(18, 62, 80)");
  await page.locator('[data-tool-form] button[type="reset"]').click();await page.waitForFunction(()=>document.querySelector(".result-report")?.hidden);await submit();await geometry(path,width,"reset-rerun");
  if(index===1){assert.equal(await page.locator('[name="massUnit"]').inputValue(),"g");await page.selectOption('[name="massUnit"]',"mg");await submit();assert.match(await rowText(),/300/);}
  if(index===0||index===2){const name=index===0?"samples":"pairs",schema=index===0?"bottle,sampleMl,initialDo,finalDo,seedMl":"analyte,result,duplicate,reportingLimit";
   const csv=index===0?schema+"\nFile-A,15,8.5,3.5,2":schema+"\nFile-analyte,10,12,0.1";
   await page.locator(`[data-lab-file="${name}"]`).setInputFiles({name:"local-review.csv",mimeType:"text/csv",buffer:Buffer.from(csv)});await page.waitForFunction(({name,csv})=>document.querySelector(`[name="${name}"]`).value===csv,{name,csv});await submit();assert.match(await rowText(),/File-/);
   await page.locator(`[data-lab-file="${name}"]`).setInputFiles({name:"malformed.csv",mimeType:"text/csv",buffer:Buffer.from("bad\n1")});await page.waitForFunction(name=>document.querySelector(`[name="${name}"]`).value==="bad\n1",name);await page.locator('[data-tool-form] button[type="submit"]').click();assert.ok(await page.locator(".result-report").isHidden());
   await fill(name,csv);await submit();
  }
  if(index===0){await page.selectOption('[name="mode"]',"water");assert.ok(await page.locator(".result-report").isHidden());await page.locator("[data-lab-example]").click();await submit();assert.match(await rowText(),/12.4/);assert.match(await rowText(),/15/);await page.selectOption('[name="mode"]',"none");await page.locator("[data-lab-example]").click();await submit();assert.match(await rowText(),/100/);}
  if(index===3){await page.selectOption('[name="mode"]',"volume");await fill("native",2);await fill("sampleMl",100);await fill("spikeMl",10);await fill("stock",100);await fill("spiked",10.909090909090908);await submit();assert.match(await rowText(),/100/);await geometry(path,width,"physical-volume");await page.selectOption('[name="mode"]',"basis");await fill("native",5);await fill("spiked",14.6);await submit();assert.match(await rowText(),/96/);}
  report.interactions.push({path,width,default:true,errorClearing:true,recovery:true,copyClipboard:true,printHookAndMedia:true,resetRerun:true,units:index===1?"roundtrip-and-after-reset":"lab-native",csv:index===0||index===2?"valid-invalid-recovery":"not-applicable"});
 }
 // Native Finder reset and the ninth system filter.
 for(const width of widths){await open("/tools/",width);await page.selectOption("[data-tool-system]","water-laboratory");assert.equal(await page.locator("[data-tool-card]:visible").count(),4);await page.locator("[data-tool-search]").fill("recovery");assert.equal(await page.locator("[data-tool-card]:visible").count(),1);await page.locator('button[type="reset"]').click();await page.waitForFunction(()=>document.querySelectorAll("[data-tool-card]:not([hidden])").length===55);assert.match(await page.locator("[data-tool-count]").innerText(),/55/);report.interactions.push({path:"/tools/",width,nativeReset:true,labSystem:4});}
 await open(labHub[0],390);await page.locator(".menu-toggle").click();assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"),"true");await page.locator(".systems-menu summary").click();assert.equal(await page.locator(".systems-menu-panel a").count(),9);
 for(const width of [390,1280]){await open(labReferences[0][0],width);await page.locator(".table-scroll").evaluate(e=>e.scrollLeft=e.scrollWidth);await capture(`${width}-lab-reference-rightmost`);}
 // Protect the pre-existing stabilization form geometry, not just document width.
 for(const width of widths){await open("/tools/groundwater-stabilization-log-analyzer/",width);const inputs=await page.locator(".stabilization-criteria-grid input").evaluateAll(es=>es.filter(e=>["phCriterion","temperatureCriterion","conductivityCriterion","doCriterion","orpCriterion","turbidityCriterion"].includes(e.id)).map(e=>({x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y})));assert.equal(inputs.length,6);if(width>900){for(let i=0;i+1<inputs.length;i+=2)assert.ok(Math.abs(inputs[i].y-inputs[i+1].y)<2);}else assert.ok(inputs.every(e=>Math.abs(e.x-inputs[0].x)<2));}
 await open("/reference/greywater-source-use-screening/",390);await geometry("/reference/greywater-source-use-screening/",390,"protected-table");
 assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.pageErrors,[]);assert.deepEqual(report.requestFailures,[]);assert.deepEqual(report.internalHttpFailures,[]);assert.equal(report.analytics.completed,0);
 if(local) report.serverAnalytics=await (await fetch(base+"/__qa__/analytics-report.json")).json();
 report.complete=true;
} finally {await browser.close();await writeFile(resolve(output),JSON.stringify(report,null,2));}
console.log(JSON.stringify({complete:report.complete,renders:report.renders,defaults:report.toolDefaults,resets:report.toolResets,interactions:report.interactions.length,tableChecks:report.tableChecks,analytics:report.analytics,output}));
