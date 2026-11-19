import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const baseline='79f63af9699d70d475ec5093b50e460b8873d91d',domain='https://watersystemsbench.com',helper='assets/js/form-utils.js';
const hash=t=>createHash('sha256').update(t.replace(/\r\n/g,'\n')).digest('hex');const git=a=>execFileSync('git',['-c','core.safecrlf=false',...a],{encoding:'utf8',maxBuffer:4*1024*1024});
const output=process.env.WSB_QA_REPORT;assert.ok(output,'Set a dated evidence path.');
const report={date:'2026-11-19',checkedAt:new Date().toISOString(),baseline,expectedRelease:process.env.WSB_QA_SHA||null,scope:{},checks:[],analyticsExecuted:0,complete:false};
async function get(p,o={}){const r=await fetch(p.startsWith('http')?p:domain+p,{signal:AbortSignal.timeout(25000),...o});const body=await r.text();report.checks.push({path:p,status:r.status,sha256:hash(body)});return{r,body};}
async function parity(p){const v=await get(p);assert.equal(v.r.status,200,p);const f=p==='/'?'index.html':p.endsWith('/')?p.slice(1)+'index.html':p.slice(1);assert.equal(hash(v.body),hash(await readFile(f,'utf8')),p+' parity');return v;}
try{
 const old=git(['ls-tree','-r','--name-only',baseline]).trim().split(/\r?\n/),html=old.filter(p=>p==='index.html'||p.endsWith('/index.html'));assert.equal(html.length,112);
 for(const p of html)assert.equal(hash(await readFile(p,'utf8')),hash(git(['show',baseline+':'+p])),p+' unchanged');report.scope.unchangedPublicHtml=112;report.scope.exactHomepageAndFiveBadges=true;
 const assets=old.filter(p=>/^assets\/.*\.(js|css)$/.test(p)&&p!==helper);for(const p of assets)assert.equal(hash(await readFile(p,'utf8')),hash(git(['show',baseline+':'+p])),p+' unchanged');report.scope.unchangedOtherAssets=assets.length;
 const protectedFiles=['sitemap.xml','robots.txt','llms.txt','CNAME','_config.yml','partials/header.html','partials/footer.html','tools-qa/generate-site.mjs','tools-qa/water-laboratory-content.mjs','tools-qa/matrix-spike-batch-content.mjs','tools-qa/rainfall-records-content.mjs'];for(const p of protectedFiles)assert.equal(hash(await readFile(p,'utf8')),hash(git(['show',baseline+':'+p])),p+' unchanged');report.scope.unchangedMachineNavigationAndGeneratorFiles=protectedFiles.length;
 const before=git(['show',baseline+':'+helper]).replace(/\r\n/g,'\n'),after=(await readFile(helper,'utf8')).replace(/\r\n/g,'\n');
 const addition='  // Edited inputs no longer describe the previous report or its copy/print packet.\n  form.addEventListener("input", () => clearResult(form));\n  form.addEventListener("change", () => clearResult(form));\n';assert.equal(after,before.replace('  const error = form.querySelector("[data-form-error]");\n','  const error = form.querySelector("[data-form-error]");\n'+addition));report.scope.onlyTwoEventListenersAndComment=true;
 if(process.argv.includes('--scope-only'))report.productionNotChecked=true;
 else{
  for(const p of['/','/tools/','/tools/water-storage-tank-sizing-planner/','/tools/total-dynamic-head-calculator/','/tools/tss-vss-gravimetric-calculator/','/tools/matrix-spike-recovery-calculator/','/tools/pressure-tank-sizing-calculator/','/tools/groundwater-stabilization-log-analyzer/','/tools/pump-short-cycling-analyzer/','/tools/ro-production-demand-planner/','/guides/complete-well-water-system-planning/','/systems/rainfall-records-gauge-networks/','/tools/areal-rainfall-series-calculator/','/tools/rainfall-event-separator/','/tools/rainfall-counter-to-increments-analyzer/','/tools/rain-gauge-double-mass-checker/','/guides/review-rainfall-records-before-analysis/','/reference/rainfall-record-bases-and-missing-data/']){const{r,body}=await parity(p);assert.ok(body.includes(`rel="canonical" href="${domain+p}"`));assert.ok(body.includes('name="robots" content="index,follow"'));assert.equal(r.headers.get('x-robots-tag'),null);assert.equal((body.match(/gtag\('config', 'G-7FB08YPX7C'\)/g)||[]).length,1);}
  for(const p of['/'+helper,'/assets/js/unit-conversions.js','/assets/js/tools/storage-tank-sizing.js','/assets/js/tools/total-dynamic-head.js','/assets/css/calculator.css','/sitemap.xml','/robots.txt'])await parity(p);
  for(const p of['/tools/water-storage-tank-sizing-planner/','/tools/ro-production-demand-planner/']){const a=await get(p),b=await get(p,{headers:{'User-Agent':'Googlebot'}});assert.equal(b.r.status,200);assert.equal(hash(a.body),hash(b.body));}
  const redirect=await get('http://watersystemsbench.com/',{redirect:'manual'});assert.equal(redirect.r.status,301);assert.equal(redirect.r.headers.get('location'),domain+'/');
  for(const p of['/docs/','/docs/page-inventory.html','/docs/information-architecture.html','/docs/project-plan.html','/docs/weekly-growth-review-2026-11-19.html','/docs/weekly-growth-review-2026-11-19.md','/docs/stale-result-invalidation-fix-2026-11-19.html','/docs/stale-result-invalidation-fix-2026-11-19.md','/handover.html','/tools-qa/result-invalidation-browser-qa.mjs','/package.json'])assert.equal((await get(p)).r.status,404,p);
 }
 report.complete=true;
}catch(e){report.failure=e.stack;process.exitCode=1;}
await writeFile(output,JSON.stringify(report,null,2));console.log(JSON.stringify({complete:report.complete,scope:report.scope,requests:report.checks.length,analyticsExecuted:0,failure:report.failure}));
