import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const baseline='5353794e9414ef54ec5991d8529136e6bc7896e7',domain='https://watersystemsbench.com',target='assets/js/tools/rainwater-simulator.js';
const hash=t=>createHash('sha256').update(t.replace(/\r\n/g,'\n')).digest('hex');
const git=args=>execFileSync('git',['-c','core.safecrlf=false',...args],{encoding:'utf8',maxBuffer:4*1024*1024});
const output=process.env.WSB_QA_REPORT;assert.ok(output,'Set a new report path.');
const report={date:'2026-11-24',checkedAt:new Date().toISOString(),baseline,expectedRelease:process.env.WSB_QA_SHA||null,scope:{},checks:[],analyticsExecuted:0,complete:false};
async function get(p,opts={}){await new Promise(resolve=>setTimeout(resolve,350));const r=await fetch(p.startsWith('http')?p:domain+p,{signal:AbortSignal.timeout(25000),...opts});const body=await r.text();report.checks.push({path:p,status:r.status,sha256:hash(body)});return{r,body};}
async function parity(p){const v=await get(p);assert.equal(v.r.status,200,p);const f=p==='/'?'index.html':p.endsWith('/')?p.slice(1)+'index.html':p.slice(1);assert.equal(hash(v.body),hash(await readFile(f,'utf8')),p+' parity');return v;}
try{
 const files=git(['ls-tree','-r','--name-only',baseline]).trim().split(/\r?\n/);
 const protectedFiles=files.filter(p=>p==='index.html'||p.endsWith('/index.html')||/^assets\/.*\.(js|css)$/.test(p)&&p!==target);
 for(const p of protectedFiles)assert.equal(hash(await readFile(p,'utf8')),hash(git(['show',baseline+':'+p])),p+' unchanged');
 report.scope.unchangedPublicHtml=protectedFiles.filter(p=>p.endsWith('index.html')).length;assert.equal(report.scope.unchangedPublicHtml,112);
 report.scope.unchangedOtherAssets=protectedFiles.length-112;report.scope.exactHomepageAndFiveBadges=true;
 for(const p of['sitemap.xml','robots.txt','llms.txt','CNAME','_config.yml','partials/header.html','partials/footer.html','tools-qa/generate-site.mjs','tools-qa/water-laboratory-content.mjs','tools-qa/matrix-spike-batch-content.mjs','tools-qa/rainfall-records-content.mjs','package.json'])assert.equal(hash(await readFile(p,'utf8')),hash(git(['show',baseline+':'+p])),p+' unchanged');report.scope.unchangedMachineNavigationGeneratorAndPackage=12;
 const before=git(['show',baseline+':'+target]).replace(/\r\n/g,'\n'),after=(await readFile(target,'utf8')).replace(/\r\n/g,'\n');
 const expected=before.replace('if (form) {\n','if (form) {\n  form.closest(".tool-layout").querySelector(".result-panel").style.minWidth = "0";\n').replace('const table = `<table class="comparison-table">','const table = `<div class="table-scroll" role="region" tabindex="0" aria-label="Monthly water balance (${vu}); scroll for all columns" style="--table-min-width: 420px"><table class="comparison-table">').replace('</tbody></table>`;','</tbody></table></div>`;');
 assert.notEqual(expected,before);assert.equal(after,expected);report.scope.onlyTargetPanelMinimumAndMonthlyTableWrapper=true;report.scope.pureEngineByteIdentical=true;
 // Baseline-red/fixed-green structural regression, independent of expected math.
 const check=t=>assert.match(t,/const table = `<div class="table-scroll" role="region" tabindex="0" aria-label=/);
 assert.throws(()=>check(before));check(after);report.scope.baselineRedFixedGreenWrapper=true;
 if(process.argv.includes('--scope-only'))report.productionNotChecked=true;
 else{
  for(const p of['/','/tools/','/tools/rainwater-tank-days-of-supply-simulator/','/tools/water-storage-tank-sizing-planner/','/tools/pressure-tank-sizing-calculator/','/tools/total-dynamic-head-calculator/','/tools/tss-vss-gravimetric-calculator/','/tools/matrix-spike-recovery-calculator/','/tools/groundwater-stabilization-log-analyzer/','/systems/rainfall-records-gauge-networks/','/tools/pump-short-cycling-analyzer/','/tools/vehicle-wash-reclaim-savings-calculator/','/tools/ro-production-demand-planner/','/guides/complete-well-water-system-planning/']){
   const{r,body}=await parity(p);assert.ok(body.includes(`rel="canonical" href="${domain+p}"`));assert.ok(body.includes('name="robots" content="index,follow"'));assert.equal(r.headers.get('x-robots-tag'),null);assert.equal((body.match(/gtag\('config', 'G-7FB08YPX7C'\)/g)||[]).length,1);
  }
  for(const p of['/'+target,'/assets/js/tools/storage-tank-sizing.js','/assets/js/form-utils.js','/assets/css/calculator.css','/assets/css/content.css','/sitemap.xml','/robots.txt'])await parity(p);
  for(const p of['/tools/rainwater-tank-days-of-supply-simulator/','/tools/groundwater-stabilization-log-analyzer/']){const a=await get(p),b=await get(p,{headers:{'User-Agent':'Googlebot'}});assert.equal(b.r.status,200);assert.equal(hash(a.body),hash(b.body));}
  const v=await get('http://watersystemsbench.com/',{redirect:'manual'});assert.equal(v.r.status,301);assert.equal(v.r.headers.get('location'),domain+'/');
  for(const p of['/docs/','/docs/page-inventory.html','/docs/information-architecture.html','/docs/project-plan.html','/docs/weekly-growth-review-2026-11-24.html','/docs/weekly-growth-review-2026-11-24.md','/docs/rainwater-result-table-fix-2026-11-24.html','/docs/storage-refill-window-upgrade-2026-11-24.md','/handover.html','/tools-qa/rainwater-result-table-browser-qa.mjs','/package.json'])assert.equal((await get(p)).r.status,404,p);
 }
 report.complete=true;
}catch(e){report.failure=e.stack;process.exitCode=1;}
await writeFile(output,JSON.stringify(report,null,2));console.log(JSON.stringify({complete:report.complete,scope:report.scope,requests:report.checks.length,failure:report.failure}));
