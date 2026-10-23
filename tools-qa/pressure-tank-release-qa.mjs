// Dated targeted browser runner. Never overwrites historical release evidence.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { installPlaywrightAnalyticsBlock, isAnalyticsUrl } from "./analytics-blocker.mjs";
const { chromium } = createRequire(import.meta.url)("playwright");
const base = process.env.WSB_QA_BASE || "http://127.0.0.1:4197";
const local = new URL(base).hostname === "127.0.0.1";
const output = process.env.WSB_QA_REPORT || "tools-qa/weekly-growth-2026-10-23-local-results.json";
const imageDir = process.env.WSB_QA_IMAGES;
const target = "/tools/pressure-tank-sizing-calculator/";
const widths = [390,768,1024,1280,1440];
const paths = [target, "/tools/pump-short-cycling-analyzer/", "/guides/pressure-tank-drawdown-short-cycling/", "/tools/", "/tools/groundwater-stabilization-log-analyzer/", "/reference/greywater-source-use-screening/", "/tools/water-duplicate-rpd-batch-checker/", "/systems/water-laboratory-qa/", "/guides/well-borehole-tube-well-terminology/", "/guides/reduce-metal-finishing-rinse-water/", "/", "/reference/water-pipe-internal-diameters/"];
const report = { date:"2026-10-23", base, scope:"Pressure-tank upgrade plus protected controls, not a full-site render matrix", widths, paths, renders:0, geometry:[], interactions:[], tableChecks:0, screenshots:[], consoleErrors:[], pageErrors:[], requestFailures:[], internalHttpFailures:[], analytics:{intercepted:0,completed:0}, complete:false };
if(local) await fetch(base+"/__qa__/analytics-reset",{method:"POST"});
if(imageDir) await mkdir(imageDir,{recursive:true});
const browser = await chromium.launch({channel:"chrome",headless:true});
report.browser = browser.version();
const context = await browser.newContext({viewport:{width:1280,height:900},serviceWorkers:"block"});
await installPlaywrightAnalyticsBlock(context,report.analytics);
await context.grantPermissions(["clipboard-read","clipboard-write"],{origin:base});
await context.addInitScript(()=>{window.__printCalls=0;window.print=()=>window.__printCalls++;});
const page = await context.newPage();
page.on("pageerror",e=>report.pageErrors.push(e.message));
page.on("console",m=>{if(m.type()==="error"&&!/ERR_BLOCKED_BY_CLIENT/.test(m.text())) report.consoleErrors.push(m.text());});
page.on("requestfailed",r=>{if(!isAnalyticsUrl(r.url()))report.requestFailures.push({url:r.url(),error:r.failure()?.errorText});});
page.on("response",r=>{if(new URL(r.url()).origin===new URL(base).origin&&r.status()>=400)report.internalHttpFailures.push({url:r.url(),status:r.status()});});
async function open(path,width){await page.setViewportSize({width,height:900});const r=await page.goto(base+path,{waitUntil:"networkidle"});assert.equal(r.status(),200,path);await page.locator(".site-footer").waitFor();}
async function geometry(path,width,state){
 const g = await page.evaluate(()=>{
  const visible=e=>!!e.getClientRects().length&&getComputedStyle(e).visibility!=="hidden";
  const rect=e=>{const b=e.getBoundingClientRect();return{x:b.x,y:b.y,right:b.right,bottom:b.bottom,width:b.width,height:b.height};};
  const offenders=[...document.querySelectorAll("main input,main select,main textarea,main button,main h1,main legend,.tool-layout,.instrument-panel,.result-panel")].filter(visible).filter(e=>{const b=rect(e);return b.x< -1||b.right>innerWidth+1;}).map(e=>({tag:e.tagName,id:e.id,rect:rect(e)}));
  const tables=[...document.querySelectorAll("main table")].filter(visible).map(t=>{const w=t.closest(".table-scroll")||(["auto","scroll"].includes(getComputedStyle(t).overflowX)?t:null);if(!w){const b=rect(t),last=rect(t.querySelector("tr:last-child>:last-child"));return{accessible:last.right<=innerWidth+1,within:b.x>=-1&&b.right<=innerWidth+1};}const old=w.scrollLeft;w.scrollLeft=w.scrollWidth;const b=rect(w),last=rect(t.querySelector("tr:last-child>:last-child"));const value={accessible:last.right<=b.right+2&&last.right>b.x,within:b.x>=-1&&b.right<=innerWidth+1};w.scrollLeft=old;return value;});
  return{documentWidth:document.documentElement.scrollWidth,viewport:innerWidth,h1:rect(document.querySelector("h1")),header:rect(document.querySelector(".site-header")),offenders,tables,unlabelled:[...document.querySelectorAll("main input,main select,main textarea")].filter(visible).filter(e=>!e.labels?.length&&!e.getAttribute("aria-label")).map(e=>e.name),broken:[...document.images].filter(e=>!e.complete||!e.naturalWidth).map(e=>e.src)};
 });
 assert.ok(g.documentWidth<=g.viewport+1,`${path} ${width} overflow ${state}`);assert.deepEqual(g.offenders,[],`${path} controls ${state}`);assert.deepEqual(g.unlabelled,[]);assert.deepEqual(g.broken,[]);
 if(state==="initial")assert.ok(g.h1.y>=g.header.bottom-1,`${path} header/H1`);
 for(const t of g.tables){assert.ok(t.accessible&&t.within,`${path} table`);report.tableChecks++;}
 report.geometry.push({path,width,state,...g});
}
async function screenshot(name,selector){if(!imageDir)return;await page.locator(selector).evaluate(e=>window.scrollTo({top:window.scrollY+e.getBoundingClientRect().top-90,behavior:"instant"}));await page.screenshot({path:join(imageDir,name+".png"),fullPage:false});report.screenshots.push(name+".png");}
const field=name=>page.locator(`[name="${name}"]`);
const fill=(name,value)=>field(name).fill(String(value));
async function submit(){await page.locator('button[type="submit"]').click();await page.locator(".result-report").waitFor({state:"visible"});assert.equal(await page.locator("[data-form-error]").textContent(),"");assert.ok(!/\b(?:NaN|Infinity)\b/.test(await page.locator(".result-report").innerText()));}
async function text(){return page.locator(".result-report").innerText();}
async function stale(){assert.ok(await page.locator(".result-report").isHidden());assert.ok(await page.locator("[data-copy-result]").isDisabled());assert.ok(await page.locator("[data-print-result]").isDisabled());}
async function error(pattern){await page.locator('button[type="submit"]').click();await stale();assert.match(await page.locator("[data-form-error]").textContent(),pattern);}
async function confirm(){await field("ratingBasis").selectOption("confirmed");}
async function reset(){await page.locator('button[type="reset"]').click();await page.waitForFunction(()=>document.querySelector(".result-report").hidden&&document.querySelector("[data-rating-fields]").hidden);await stale();assert.equal(await field("unitSystem").inputValue(),"SI");assert.equal(await field("ratedDrawdown").inputValue(),"");}
try{
 for(const width of widths){
  for(const path of paths){await open(path,width);await geometry(path,width,"initial");report.renders++;}
  await open(target,width);await submit();assert.match(await text(),/135\.5/);assert.match(await text(),/not requested/);await geometry(target,width,"default");
  if([390,1280].includes(width))await screenshot(width+"-requirement",".tool-layout");
  await field("compareMode").selectOption("rated");await stale();await fill("ratedDrawdown",32);await error(/Confirm/);await confirm();await submit();assert.match(await text(),/Below entered drawdown target/);assert.match(await text(),/Shortfall: 8 L/);assert.match(await text(),/80%/);assert.match(await text(),/0\.8 minutes/);await geometry(target,width,"below-target");
  await fill("ratedDrawdown",50);await stale();assert.equal(await field("ratingBasis").inputValue(),"unverified");await error(/Confirm/);await confirm();await submit();assert.match(await text(),/Meets entered drawdown target/);assert.match(await text(),/Surplus: 10 L/);assert.match(await text(),/125%/);assert.match(await text(),/1\.25 minutes/);await geometry(target,width,"above-target");
  if([390,1280].includes(width)){await screenshot(width+"-comparison-form",".tool-layout");await screenshot(width+"-rating-fields","[data-rating-fields]");await screenshot(width+"-comparison-result",".result-panel");}
  await page.locator("[data-copy-result]").click();await page.waitForFunction(()=>document.querySelector("[data-copy-result]").textContent==="Copied");const clip=await page.evaluate(()=>navigator.clipboard.readText());for(const marker of ["Input record","40 L/min","193 kPa","207 kPa","345 kPa","50 L","rating conditions confirmed","https://watersystemsbench.com/tools/pressure-tank-sizing-calculator/"])assert.ok(clip.includes(marker),marker);
  await page.locator("[data-print-result]").click();assert.ok(await page.evaluate(()=>window.__printCalls)>0);await page.emulateMedia({media:"print"});for(const selector of [".instrument-panel",".result-actions",".site-header",".site-footer",".content-layout"])assert.equal(await page.locator(selector).isVisible(),false,selector);assert.ok(await page.locator(".result-report").isVisible());if(width===1280)await screenshot("1280-print-summary",".result-panel");await page.emulateMedia({media:"screen"});
  await fill("ratedDrawdown",40);await confirm();await submit();assert.match(await text(),/Meets entered drawdown target/);assert.match(await text(),/Surplus: 0 L/);
  await fill("precharge",194);await stale();assert.equal(await field("ratingBasis").inputValue(),"unverified");await error(/Confirm/);await fill("precharge",193);await confirm();await submit();
  await fill("ratedDrawdown",0);await confirm();await error(/at least|greater than/);await fill("ratedDrawdown",-1);await confirm();await error(/at least|greater than/);await fill("ratedDrawdown","");await confirm();await error(/required/);
  // Disabled comparison inputs must not gate the requirement-only path.
  await field("compareMode").selectOption("requirement");await submit();assert.match(await text(),/not requested/);assert.ok(await field("ratedDrawdown").isDisabled());
  await fill("runTime",0);await error(/greater than/);await fill("runTime",1);await submit();await fill("cutIn",400);await error(/precharge < cut-in < cut-out/);await fill("cutIn",207);await submit();
  await field("compareMode").selectOption("rated");await fill("ratedDrawdown",50);await confirm();await submit();
  await field("unitSystem").selectOption("US");await stale();await submit();assert.match(await text(),/Meets entered drawdown target/);assert.match(await text(),/125%/);assert.match(await text(),/1\.25 minutes/);assert.ok(Math.abs(Number(await field("ratedDrawdown").inputValue())-13.2086026)<1e-5);await field("unitSystem").selectOption("SI");await submit();assert.match(await text(),/125%/);
  await reset();await submit();await field("unitSystem").selectOption("US");await submit();assert.ok(Math.abs(Number(await field("pumpFlow").inputValue())-10.5668821)<1e-5);await reset();await fill("pumpFlow",20);await submit();assert.match(await text(),/Required drawdown: 20 L/);
  const copy=page.locator("[data-copy-result]");await copy.hover();const colors=await copy.evaluate(e=>({color:getComputedStyle(e).color,bg:getComputedStyle(e).backgroundColor}));assert.equal(colors.color,"rgb(255, 255, 255)");assert.equal(colors.bg,"rgb(18, 62, 80)");
  report.interactions.push({path:target,width,requirement:true,unconfirmedRejected:true,below:true,above:true,equality:true,pressureReconfirmation:true,invalidAndRecovery:true,disabledIgnored:true,staleCleared:true,clipboardInputRecord:true,printHookAndMedia:true,siUsRoundtrip:true,resetAndRefill:true,conversionAfterReset:true,hover:true});
  await open("/tools/",width);await page.locator("[data-tool-system]").selectOption("wells");await page.locator("[data-tool-search]").fill("pressure tank");assert.equal(await page.locator("[data-tool-card]:visible").count(),1);await page.locator('button[type="reset"]').click();await page.waitForFunction(()=>document.querySelectorAll("[data-tool-card]:not([hidden])").length===55);report.interactions.push({path:"/tools/",width,nativeReset:55});
  await open("/tools/groundwater-stabilization-log-analyzer/",width);const points=await page.locator(".stabilization-criteria-grid input").evaluateAll(es=>es.filter(e=>["phCriterion","temperatureCriterion","conductivityCriterion","doCriterion","orpCriterion","turbidityCriterion"].includes(e.id)).map(e=>({x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y})));assert.equal(points.length,6);if(width>900){for(let i=0;i<6;i+=2)assert.ok(Math.abs(points[i].y-points[i+1].y)<2);}else assert.ok(points.every(e=>Math.abs(e.x-points[0].x)<2));await submit();assert.match(await text(),/MET/);report.interactions.push({path:"/tools/groundwater-stabilization-log-analyzer/",width,alignment:true,default:true});
  for(const path of ["/tools/pump-short-cycling-analyzer/","/tools/water-duplicate-rpd-batch-checker/"]){await open(path,width);await submit();await geometry(path,width,"protected-result");await page.locator('button[type="reset"]').click();await page.waitForFunction(()=>document.querySelector(".result-report").hidden);report.interactions.push({path,width,defaultAndReset:true});}
  console.log(`Target and protected controls passed at ${width}px`);
 }
 await open(target,390);await page.locator(".menu-toggle").click();assert.equal(await page.locator(".menu-toggle").getAttribute("aria-expanded"),"true");await page.locator(".systems-menu summary").click();assert.equal(await page.locator(".systems-menu-panel a").count(),9);
 for(const path of ["/reference/greywater-source-use-screening/","/guides/well-borehole-tube-well-terminology/"]){await open(path,390);await page.locator(".table-scroll").first().focus();await page.keyboard.press("ArrowRight");await page.waitForFunction(()=>document.querySelector(".table-scroll").scrollLeft>0);await page.locator(".table-scroll").first().evaluate(e=>e.scrollLeft=e.scrollWidth);await geometry(path,390,"rightmost-column");}
 assert.equal(report.renders,60);assert.equal(report.interactions.length,25);for(const key of ["consoleErrors","pageErrors","requestFailures","internalHttpFailures"])assert.deepEqual(report[key],[],key);assert.equal(report.analytics.completed,0);
 if(local) report.serverAnalytics=await(await fetch(base+"/__qa__/analytics-report.json")).json();
 report.complete=true;
}catch(error){report.failure=error.stack;process.exitCode=1;}finally{await browser.close();await writeFile(resolve(output),JSON.stringify(report,null,2));}
console.log(JSON.stringify({complete:report.complete,renders:report.renders,geometry:report.geometry.length,interactions:report.interactions.length,tables:report.tableChecks,analytics:report.analytics,serverAnalytics:report.serverAnalytics,failure:report.failure}));
