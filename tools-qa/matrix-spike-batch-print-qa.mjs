// Final print-only supplement. Never relabel a pre-refinement matrix as a rerun.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { installPlaywrightAnalyticsBlock, isAnalyticsUrl } from "./analytics-blocker.mjs";
const {chromium}=createRequire(import.meta.url)("playwright");
const base=process.env.WSB_QA_BASE||"http://127.0.0.1:4211",local=new URL(base).hostname==="127.0.0.1";
const output=process.env.WSB_QA_REPORT||"tools-qa/weekly-growth-2026-11-04-local-print-results.json",images=process.env.WSB_QA_IMAGES;
const prior=JSON.parse(await readFile("tools-qa/weekly-growth-2026-11-04-local-results.json","utf8"));
assert.equal(prior.complete,true);
const hash=s=>createHash("sha256").update(s.replace(/\r\n/g,"\n")).digest("hex");
const report={date:"2026-11-04",base,scope:"Final print-only font override; five-width media/hidden-state supplement, not a 105-render rerun",sourceHashes:{},changesSinceLocalMatrix:[],analytics:{intercepted:0,completed:0},checks:[],errors:[],complete:false};
for(const[p,h]of Object.entries(prior.sourceHashes)){const current=hash(await readFile(p,"utf8"));report.sourceHashes[p]=current;if(current!==h)report.changesSinceLocalMatrix.push(p.replaceAll("\\","/"));}
assert.deepEqual(report.changesSinceLocalMatrix,["assets/css/matrix-spike-batch.css"]);
if(images)await mkdir(images,{recursive:true});
const serverStart=local?await(await fetch(base+"/__qa__/analytics-report.json")).json():null;
const browser=await chromium.launch({channel:"chrome",headless:true});report.browser=browser.version();
const context=await browser.newContext({serviceWorkers:"block"});await installPlaywrightAnalyticsBlock(context,report.analytics);
const page=await context.newPage();page.on("pageerror",e=>report.errors.push(e.message));page.on("requestfailed",r=>{if(!isAnalyticsUrl(r.url()))report.errors.push(r.url());});
try{
 for(const width of[390,768,1024,1280,1440]){
  await page.setViewportSize({width,height:900});const response=await page.goto(base+"/tools/matrix-spike-recovery-calculator/",{waitUntil:"networkidle"});assert.equal(response.status(),200);
  await page.locator("[data-spike-run]").click();await page.emulateMedia({media:"print"});
  const font=await page.locator("h1").evaluate(e=>getComputedStyle(e).fontSize);assert.equal(font,"24px");
  assert.ok(await page.locator("[data-spike-report]").isVisible());assert.match(await page.locator("[data-spike-count]").innerText(),/2\s*\/\s*3/);
  assert.ok((await page.locator("[data-spike-print-input]").innerText()).includes("Sample-A nitrate,5,14.6,10,80,120"));
  assert.equal(await page.locator("[data-spike-report] th:visible").count(),5);
  for(const selector of["[data-spike-batch-form]",".spike-actions",".site-header",".site-footer",".content-layout"])assert.ok(await page.locator(selector).isHidden(),selector);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  if(images&&[390,1280].includes(width))await page.screenshot({path:images+`/${width}-batch-final-print.png`,fullPage:true});
  await page.emulateMedia({media:"screen"});await page.locator("#spike-batch-records").fill("bad");await page.locator("[data-spike-run]").click();await page.emulateMedia({media:"print"});assert.ok(await page.locator(".spike-batch").isHidden());await page.emulateMedia({media:"screen"});
  report.checks.push({width,titleFont:font,fiveFocusedColumns:true,actualSourceValues:true,controlsNavHidden:true,errorStateHidden:true,overflow:0});
 }
 assert.deepEqual(report.errors,[]);assert.equal(report.analytics.completed,0);
 if(local){const end=await(await fetch(base+"/__qa__/analytics-report.json")).json();report.serverAnalyticsDelta={intercepted:end.analyticsRequestsIntercepted-serverStart.analyticsRequestsIntercepted,completed:end.analyticsRequestsCompleted-serverStart.analyticsRequestsCompleted};assert.equal(report.serverAnalyticsDelta.completed,0);}else assert.ok(report.analytics.intercepted>0);
 for(const[p,h]of Object.entries(report.sourceHashes))assert.equal(hash(await readFile(p,"utf8")),h,p);
 report.sourceStableThroughoutRun=true;report.complete=true;
}catch(error){report.failure=error.stack;process.exitCode=1;}
finally{await browser.close();await writeFile(output,JSON.stringify(report,null,2));}
console.log(JSON.stringify({complete:report.complete,checks:report.checks.length,analytics:report.analytics,serverAnalyticsDelta:report.serverAnalyticsDelta,changesSinceLocalMatrix:report.changesSinceLocalMatrix,failure:report.failure}));
