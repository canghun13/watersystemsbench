// Non-executing source/HTTP verification. Never executes production Analytics.
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { labHub, labTools, labGuides, labReferences } from "./water-laboratory-content.mjs";
const root=fileURLToPath(new URL("..",import.meta.url));
const domain="https://watersystemsbench.com";
const hash=s=>createHash("sha256").update(s.replace(/\r\n/g,"\n")).digest("hex");
const report={date:"2026-10-16",checkedAt:new Date().toISOString(),checks:[],analyticsExecuted:0,complete:false};
const newRoutes=[labHub,...labTools,...labGuides,...labReferences].map(x=>x[0]);
async function get(path,options={}){const response=await fetch(path.startsWith("http")?path:domain+path,{signal:AbortSignal.timeout(25000),...options});const text=await response.text();report.checks.push({path,status:response.status,sha256:hash(text),xRobots:response.headers.get("x-robots-tag")});return{response,text};}
async function parity(path){const{response,text}=await get(path);assert.equal(response.status,200,path);const local=await readFile(join(root,path==="/"?"index.html":path.endsWith("/")?path.slice(1)+"index.html":path.slice(1)),"utf8");assert.equal(hash(text),hash(local),`${path} local/live parity`);return{text,response};}
try{
 const redirect=await get("http://watersystemsbench.com/",{redirect:"manual"});assert.equal(redirect.response.status,301);assert.equal(redirect.response.headers.get("location"),domain+"/");
 for(const path of [...newRoutes,"/","/tools/","/guides/","/reference/","/guides/well-borehole-tube-well-terminology/","/guides/reduce-metal-finishing-rinse-water/","/tools/groundwater-stabilization-log-analyzer/"]){
  const{text,response}=await parity(path);assert.ok(text.includes(`<link rel="canonical" href="${domain}${path}">`));assert.ok(text.includes('content="index,follow"'));assert.ok(!/noindex/i.test(response.headers.get("x-robots-tag")||""));assert.equal((text.match(/gtag\('config', 'G-7FB08YPX7C'\)/g)||[]).length,1);assert.equal((text.match(/<h1\b/g)||[]).length,1);
  if(newRoutes.includes(path))assert.match(text,/October 16, 2026/);
 }
 for(const path of ["/assets/js/tools/water-laboratory-tools.js","/assets/css/water-laboratory.css","/assets/js/tool-finder.js","/assets/css/main.css","/assets/css/calculator.css","/partials/header.html","/partials/footer.html","/llms.txt"])await parity(path);
 const{text:sitemap}=await parity("/sitemap.xml");const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]);assert.equal(urls.length,105);assert.equal(new Set(urls).size,105);assert.ok(!sitemap.includes("/docs/"));for(const path of newRoutes)assert.ok(sitemap.includes(`<loc>${domain}${path}</loc><lastmod>2026-10-16</lastmod>`));assert.ok(sitemap.includes("<loc>https://watersystemsbench.com/guides/reduce-metal-finishing-rinse-water/</loc><lastmod>2026-10-09</lastmod>"));
 const{text:robots}=await parity("/robots.txt");assert.match(robots,/Allow: \//);
 for(const path of [labHub[0],labTools[0][0],labTools[2][0]]){const{text,response}=await get(path,{headers:{"User-Agent":"Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"}});assert.equal(response.status,200);assert.equal(hash(text),hash(await readFile(join(root,path.slice(1)+"index.html"),"utf8")));}
 for(const path of ["/docs/","/docs/page-inventory.html","/docs/information-architecture.html","/docs/project-plan.html","/handover.html","/tools-qa/water-laboratory-content.mjs","/tools-qa/water-laboratory-browser-qa.mjs",...['','md','html'].flatMap(ext=>["/docs/workflow-cluster-discovery-2026-10-16"+(ext?"."+ext:""),"/docs/water-laboratory-qa-expansion"+(ext?"."+ext:"")])])assert.equal((await get(path)).response.status,404,path);
 report.complete=true;
}catch(error){report.failure=error.stack;process.exitCode=1;}
await writeFile(process.env.WSB_QA_REPORT||join(root,"tools-qa/water-laboratory-2026-10-16-live-results.json"),JSON.stringify(report,null,2));
console.log(JSON.stringify({complete:report.complete,requests:report.checks.length,analyticsExecuted:0,failure:report.failure}));
