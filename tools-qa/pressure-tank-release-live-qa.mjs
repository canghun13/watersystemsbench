// Source/HTTP only: page JavaScript and Analytics are never executed here.
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
const domain = "https://watersystemsbench.com";
const baseline = "1a7bbd6e25711483cfb0ab87d7b81b8c6d7c5a67";
const target = "/tools/pressure-tank-sizing-calculator/";
const hash = x => createHash("sha256").update(x.replace(/\r\n/g,"\n")).digest("hex");
const report = {date:"2026-10-23",checkedAt:new Date().toISOString(),baseline,scope:{},checks:[],analyticsExecuted:0,complete:false};
const git = args => execFileSync("git",["-c","core.safecrlf=false",...args],{encoding:"utf8"});
const localPath = path => path==="/"?"index.html":path.endsWith("/")?path.slice(1)+"index.html":path.slice(1);
async function get(path,options={}){const r=await fetch(path.startsWith("http")?path:domain+path,{signal:AbortSignal.timeout(25000),...options});const text=await r.text();report.checks.push({path,status:r.status,sha256:hash(text),xRobots:r.headers.get("x-robots-tag")});return{response:r,text};}
async function parity(path){const value=await get(path);assert.equal(value.response.status,200,path);assert.equal(hash(value.text),hash(await readFile(localPath(path),"utf8")),path+" local/live parity");return value;}
try{
 const changedHtml=git(["diff","--name-only",baseline,"--","*.html"]).trim().split(/\r?\n/).filter(Boolean);
 assert.deepEqual(changedHtml,["tools/pressure-tank-sizing-calculator/index.html"]);
 report.scope.changedPublicHtml=changedHtml;
 report.scope.otherPublicHtmlUnchanged=104;
 report.scope.protected=[];
 for(const path of ["index.html","assets/css/main.css","assets/css/content.css","assets/css/calculator.css","assets/js/form-utils.js","assets/js/unit-conversions.js","assets/js/tool-finder.js","assets/js/tools/monitoring-well-tools.js","assets/js/tools/water-laboratory-tools.js","partials/header.html","partials/footer.html","_config.yml","guides/reduce-metal-finishing-rinse-water/index.html","guides/well-borehole-tube-well-terminology/index.html"]){const current=await readFile(path,"utf8");assert.equal(hash(current),hash(git(["show",baseline+":"+path])),path+" changed");report.scope.protected.push({path,sha256:hash(current)});}
 const pressurePath="assets/js/tools/pressure-tank-sizing.js";
 const core=text=>text.match(/export function computePressureTank[\s\S]*?\n}/)[0];
 assert.equal(core(await readFile(pressurePath,"utf8")),core(git(["show",baseline+":"+pressurePath])));
 report.scope.originalSizingEngineUnchanged=true;
 const oldSitemap=git(["show",baseline+":sitemap.xml"]),newSitemap=await readFile("sitemap.xml","utf8");
 const oldEntry=`<loc>${domain}${target}</loc><lastmod>2026-07-29</lastmod>`;
 assert.equal(oldSitemap.replace(oldEntry,`<loc>${domain}${target}</loc><lastmod>2026-10-23</lastmod>`),newSitemap.replace(/\r\n/g,"\n"));
 report.scope.onlySelectedSitemapDateChanged=true;
 if(process.argv.includes("--scope-only")){console.log(JSON.stringify({scopePassed:true,...report.scope,productionNotChecked:true}));process.exit(0);}
 const paths=[target,"/","/tools/","/tools/pump-short-cycling-analyzer/","/guides/pressure-tank-drawdown-short-cycling/","/systems/water-laboratory-qa/","/tools/water-duplicate-rpd-batch-checker/","/reference/water-laboratory-qc-calculation-bases/","/guides/well-borehole-tube-well-terminology/","/guides/reduce-metal-finishing-rinse-water/","/reference/water-pipe-internal-diameters/","/guides/how-to-read-a-pump-curve/"];
 for(const path of paths){const {text,response}=await parity(path);assert.ok(text.includes(`<link rel="canonical" href="${domain}${path}">`));assert.ok(text.includes('content="index,follow"'));assert.ok(!/noindex/i.test(response.headers.get("x-robots-tag")||""));assert.equal((text.match(/gtag\('config', 'G-7FB08YPX7C'\)/g)||[]).length,1);assert.equal((text.match(/<h1\b/g)||[]).length,1);if(path===target)for(const marker of ["October 23, 2026",'name="ratedDrawdown"','name="ratingBasis"',"Compare rated drawdown, not nominal capacity"])assert.ok(text.includes(marker));}
 for(const path of ["/assets/js/tools/pressure-tank-sizing.js","/assets/css/pressure-tank.css","/assets/css/main.css","/assets/css/calculator.css","/assets/js/form-utils.js","/assets/js/unit-conversions.js","/partials/header.html","/partials/footer.html"])await parity(path);
 const {text:sitemap}=await parity("/sitemap.xml");const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(x=>x[1]);assert.equal(urls.length,105);assert.equal(new Set(urls).size,105);assert.ok(!sitemap.includes("/docs/"));
 const {text:robots}=await parity("/robots.txt");assert.match(robots,/Allow: \//);
 const bot=await get(target,{headers:{"User-Agent":"Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"}});assert.equal(bot.response.status,200);assert.equal(hash(bot.text),hash(await readFile(localPath(target),"utf8")));
 const redirect=await get("http://watersystemsbench.com/",{redirect:"manual"});assert.equal(redirect.response.status,301);assert.equal(redirect.response.headers.get("location"),domain+"/");
 for(const path of ["/docs/","/docs/page-inventory.html","/docs/information-architecture.html","/docs/project-plan.html","/docs/weekly-growth-review-2026-10-23","/docs/weekly-growth-review-2026-10-23.md","/docs/weekly-growth-review-2026-10-23.html","/handover.html","/tools-qa/pressure-tank-release-qa.mjs","/tools-qa/verify-pressure-tank-rating.mjs","/tools-qa/weekly-growth-2026-10-23-local-results.json"])assert.equal((await get(path)).response.status,404,path);
 report.complete=true;
}catch(error){report.failure=error.stack;process.exitCode=1;}
await writeFile(process.env.WSB_QA_REPORT||"tools-qa/weekly-growth-2026-10-23-live-results.json",JSON.stringify(report,null,2));
console.log(JSON.stringify({complete:report.complete,requests:report.checks.length,scope:report.scope,analyticsExecuted:0,failure:report.failure}));
