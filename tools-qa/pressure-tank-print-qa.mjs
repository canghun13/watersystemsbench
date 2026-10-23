// Final supplemental check after page-only print-header compaction.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { installPlaywrightAnalyticsBlock, isAnalyticsUrl } from "./analytics-blocker.mjs";
const {chromium}=createRequire(import.meta.url)("playwright");
const base=process.env.WSB_QA_BASE||"http://127.0.0.1:4197";
const local=new URL(base).hostname==="127.0.0.1";
const output=process.env.WSB_QA_REPORT||"tools-qa/weekly-growth-2026-10-23-local-print-results.json";
const dir=process.env.WSB_QA_IMAGES;
const report={date:"2026-10-23",base,scope:"Final page-only print-header supplement; not another full interaction matrix",checks:[],errors:[],analytics:{intercepted:0,completed:0},complete:false};
if(local)await fetch(base+"/__qa__/analytics-reset",{method:"POST"});
if(dir)await mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:"chrome",headless:true});
const context=await browser.newContext({serviceWorkers:"block"});
await installPlaywrightAnalyticsBlock(context,report.analytics);
const page=await context.newPage();
await page.addInitScript(()=>{window.__printCalls=0;window.print=()=>window.__printCalls++;});
page.on("pageerror",e=>report.errors.push(e.message));
page.on("console",m=>{if(m.type()==="error"&&!/ERR_BLOCKED_BY_CLIENT/.test(m.text()))report.errors.push(m.text());});
page.on("requestfailed",r=>{if(!isAnalyticsUrl(r.url()))report.errors.push(r.url());});
try{
 for(const width of [390,768,1024,1280,1440]){
  await page.setViewportSize({width,height:900});const response=await page.goto(base+"/tools/pressure-tank-sizing-calculator/",{waitUntil:"networkidle"});assert.equal(response.status(),200);await page.locator(".site-footer").waitFor();
  await page.selectOption('[name="compareMode"]',"rated");await page.locator('[name="ratedDrawdown"]').fill("50");await page.selectOption('[name="ratingBasis"]',"confirmed");await page.locator('button[type="submit"]').click();assert.match(await page.locator(".result-report").innerText(),/Meets entered drawdown target/);await page.locator("[data-print-result]").click();assert.equal(await page.evaluate(()=>window.__printCalls),1);
  await page.emulateMedia({media:"print"});for(const selector of [".instrument-panel",".result-actions",".site-header",".site-footer",".content-layout",".hero .lede"])assert.equal(await page.locator(selector).isVisible(),false);
  assert.ok(await page.locator("h1").isVisible());assert.ok(await page.locator(".result-report").isVisible());const geometry=await page.evaluate(()=>({heroHeight:document.querySelector(".hero").getBoundingClientRect().height,circleDisplay:getComputedStyle(document.querySelector(".hero"),"::after").display,width:document.documentElement.scrollWidth,viewport:innerWidth}));assert.ok(geometry.heroHeight<100);assert.equal(geometry.circleDisplay,"none");assert.ok(geometry.width<=geometry.viewport+1);const content=await page.locator(".result-report").innerText();for(const marker of ["Input record","40 L/min","50 L","https://watersystemsbench.com/tools/pressure-tank-sizing-calculator/"])assert.ok(content.includes(marker));
  if(dir&&[390,1280].includes(width)){await page.evaluate(()=>window.scrollTo({top:0,behavior:"instant"}));await page.screenshot({path:join(dir,width+"-compact-print.png"),fullPage:true});}
  report.checks.push({width,...geometry,inputRecord:true,title:true,printHook:true});await page.emulateMedia({media:"screen"});
 }
 assert.equal(report.checks.length,5);assert.deepEqual(report.errors,[]);assert.equal(report.analytics.completed,0);if(local)report.serverAnalytics=await(await fetch(base+"/__qa__/analytics-report.json")).json();report.complete=true;
}catch(error){report.failure=error.stack;process.exitCode=1;}finally{await browser.close();await writeFile(output,JSON.stringify(report,null,2));}
console.log(JSON.stringify(report));
