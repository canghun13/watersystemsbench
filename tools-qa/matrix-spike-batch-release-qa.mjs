import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

const baseline = "8ebf7cbde3963b81a8d26b6080352eaebb80497c";
const target = "/tools/matrix-spike-recovery-calculator/", file = "tools/matrix-spike-recovery-calculator/index.html";
const domain = "https://watersystemsbench.com";
const hash = text => createHash("sha256").update(text.replace(/\r\n/g,"\n")).digest("hex");
const git = args => execFileSync("git", ["-c","core.safecrlf=false",...args], {encoding:"utf8",maxBuffer:4*1024*1024});
const report = {date:"2026-11-04",checkedAt:new Date().toISOString(),baseline,expectedRelease:process.env.WSB_QA_SHA||null,scope:{},checks:[],analyticsExecuted:0,complete:false};
const output = process.env.WSB_QA_REPORT || "tools-qa/weekly-growth-2026-11-04-live-results.json";
async function get(path, options={}) {
  const r=await fetch(path.startsWith("http")?path:domain+path,{signal:AbortSignal.timeout(25000),...options});
  const body=await r.text(); report.checks.push({path,status:r.status,sha256:hash(body)}); return {r,body};
}
async function parity(path) {
  const v=await get(path); assert.equal(v.r.status,200,path);
  const local=path==="/"?"index.html":path.endsWith("/")?path.slice(1)+"index.html":path.slice(1);
  assert.equal(hash(v.body),hash(await readFile(local,"utf8")),path+" source parity");return v;
}
try {
  const oldFiles=git(["ls-tree","-r","--name-only",baseline]).trim().split(/\r?\n/);
  const html=oldFiles.filter(p=>p==="index.html"||p.endsWith("/index.html"));assert.equal(html.length,112);
  for(const p of html) if(p!==file) assert.equal(hash(await readFile(p,"utf8")),hash(git(["show",`${baseline}:${p}`])),p+" protected page");
  report.scope.unchangedPublicHtml=111;
  const old=git(["show",`${baseline}:${file}`]),current=await readFile(file,"utf8");
  for(const pattern of [/<title>([^<]+)<\/title>/,/<h1>([^<]+)<\/h1>/,/<link rel="canonical" href="([^"]+)"/,/<meta name="description" content="([^"]+)"/]) assert.equal(current.match(pattern)?.[1],old.match(pattern)?.[1]);
  const single=/<form data-tool-form="lab-spike">[\s\S]*?<\/form>/;
  assert.equal(hash(current.match(single)[0]),hash(old.match(single)[0])); report.scope.originalSingleFormUnchanged=true;
  const protectedFiles=oldFiles.filter(p=>/^assets\/.*\.(?:js|css)$/.test(p)).concat(["_config.yml","CNAME","robots.txt","llms.txt","partials/header.html","partials/footer.html"]);
  for(const p of protectedFiles) assert.equal(hash(await readFile(p,"utf8")),hash(git(["show",`${baseline}:${p}`])),p+" protected source");
  report.scope.protectedFiles=protectedFiles.length;report.scope.exactFiveBadgeHomepage=true;
  const entries=s=>new Map([...s.matchAll(/<url><loc>https:\/\/watersystemsbench.com([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod><\/url>/g)].map(m=>[m[1],m[2]]));
  const previous=entries(git(["show",baseline+":sitemap.xml"])),now=entries(await readFile("sitemap.xml","utf8"));
  assert.equal(now.size,112);assert.deepEqual([...now.keys()],[...previous.keys()]);
  for(const[p,date]of now)assert.equal(date,p===target?"2026-11-04":previous.get(p),p+" sitemap date");
  report.scope.onlySelectedSitemapDateChanged=true;report.scope.publicPages=112;
  if(process.argv.includes("--scope-only")){report.productionNotChecked=true;report.complete=true;}
  else {
    const pages=["/","/tools/",target,"/tools/bod-seed-correction-bottle-analyzer/","/tools/tss-vss-gravimetric-calculator/","/tools/water-duplicate-rpd-batch-checker/","/systems/water-laboratory-qa/","/systems/rainfall-records-gauge-networks/","/tools/rainfall-counter-to-increments-analyzer/","/tools/rainfall-event-separator/","/tools/rain-gauge-double-mass-checker/","/tools/areal-rainfall-series-calculator/","/tools/pressure-tank-sizing-calculator/","/tools/groundwater-stabilization-log-analyzer/"];
    for(const p of pages){const{r,body}=await parity(p);assert.ok(body.includes(`rel="canonical" href="${domain+p}"`));assert.ok(body.includes('name="robots" content="index,follow"'));assert.equal(r.headers.get("x-robots-tag"),null);assert.equal((body.match(/gtag\('config', 'G-7FB08YPX7C'\)/g)||[]).length,1);}
    for(const p of ["/assets/js/tools/matrix-spike-batch.js","/assets/css/matrix-spike-batch.css","/assets/js/tools/water-laboratory-tools.js","/assets/css/water-laboratory.css","/assets/js/tool-finder.js","/assets/css/main.css","/sitemap.xml","/robots.txt","/partials/header.html","/partials/footer.html"])await parity(p);
    for(const p of [target,"/tools/water-duplicate-rpd-batch-checker/"]){const normal=await get(p),bot=await get(p,{headers:{"User-Agent":"Googlebot"}});assert.equal(bot.r.status,200);assert.equal(hash(bot.body),hash(normal.body));}
    const redirect=await get("http://watersystemsbench.com/",{redirect:"manual"});assert.equal(redirect.r.status,301);assert.equal(redirect.r.headers.get("location"),domain+"/");
    for(const p of ["/docs/","/docs/page-inventory.html","/docs/information-architecture.html","/docs/project-plan.html","/docs/weekly-growth-review-2026-11-04.html","/docs/weekly-growth-review-2026-11-04.md","/docs/matrix-spike-batch-upgrade-2026-11-04.html","/docs/matrix-spike-batch-upgrade-2026-11-04.md","/handover.html","/tools-qa/matrix-spike-batch-browser-qa.mjs","/tools-qa/matrix-spike-batch-content.mjs","/package.json"]) assert.equal((await get(p)).r.status,404,p);
    report.complete=true;
  }
}catch(error){report.failure=error.stack;process.exitCode=1;}
await writeFile(output,JSON.stringify(report,null,2));console.log(JSON.stringify({complete:report.complete,productionNotChecked:report.productionNotChecked||false,scope:report.scope,requests:report.checks.length,analyticsExecuted:0,failure:report.failure}));
