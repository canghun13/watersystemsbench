import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
const baseline='a984e42bfa6a43e08731f7b44d556c0291574f23';
const target='/tools/tss-vss-gravimetric-calculator/',file=target.slice(1)+'index.html';
const engine='assets/js/tools/water-laboratory-tools.js';
const domain='https://watersystemsbench.com';
const hash=s=>createHash('sha256').update(s.replace(/\r\n/g,'\n')).digest('hex');
const git=args=>execFileSync('git',['-c','core.safecrlf=false',...args],{encoding:'utf8',maxBuffer:4*1024*1024});
const report={date:'2026-11-11',checkedAt:new Date().toISOString(),baseline,expectedRelease:process.env.WSB_QA_SHA||null,scope:{},checks:[],analyticsExecuted:0,complete:false};
const output=process.env.WSB_QA_REPORT;assert.ok(output,'Set a dated WSB_QA_REPORT');
async function get(path,options={}){const r=await fetch(path.startsWith('http')?path:domain+path,{signal:AbortSignal.timeout(25000),...options});const body=await r.text();report.checks.push({path,status:r.status,sha256:hash(body)});return{r,body};}
async function parity(path){const v=await get(path);assert.equal(v.r.status,200,path);const local=path==='/'?'index.html':path.endsWith('/')?path.slice(1)+'index.html':path.slice(1);assert.equal(hash(v.body),hash(await readFile(local,'utf8')),path+' parity');return v;}
try{
 const oldFiles=git(['ls-tree','-r','--name-only',baseline]).trim().split(/\r?\n/);
 const html=oldFiles.filter(p=>p==='index.html'||p.endsWith('/index.html'));assert.equal(html.length,112);
 for(const p of html)if(p!==file)assert.equal(hash(await readFile(p,'utf8')),hash(git(['show',`${baseline}:${p}`])),p+' unchanged');
 report.scope.unchangedPublicHtml=111;report.scope.exactHomepageAndFiveBadges=true;
 const old=git(['show',`${baseline}:${file}`]),now=await readFile(file,'utf8');
 for(const pattern of[/<title>([^<]+)<\/title>/,/<h1>([^<]+)<\/h1>/,/<link rel="canonical" href="([^"]+)"/,/<meta name="description" content="([^"]+)"/])assert.equal(now.match(pattern)?.[1],old.match(pattern)?.[1]);
 for(const marker of['name="solidsScope"','data-solids-ignition','TSS only','29.2 mg/L','www.pca.state.mn.us'])assert.ok(now.includes(marker),marker);
 const protectedFiles=oldFiles.filter(p=>/^assets\/.*\.(js|css)$/.test(p)&&p!==engine).concat(['_config.yml','CNAME','robots.txt','llms.txt','partials/header.html','partials/footer.html']);
 for(const p of protectedFiles)assert.equal(hash(await readFile(p,'utf8')),hash(git(['show',`${baseline}:${p}`])),p+' unchanged');
 report.scope.protectedAssetsAndConfiguration=protectedFiles.length;
 const currentEngine=await readFile(engine,'utf8'),oldEngine=git(['show',baseline+':'+engine]);
 const originalCombined=/export function computeSolids[\s\S]*?(?=export function checkDuplicates)/;
 assert.equal(currentEngine.match(originalCombined)[0],oldEngine.match(originalCombined)[0]);report.scope.originalCombinedEngineUnchanged=true;
 const map=s=>new Map([...s.matchAll(/<url><loc>https:\/\/watersystemsbench.com([^<]+)<\/loc><lastmod>([^<]+)<\/lastmod><\/url>/g)].map(m=>[m[1],m[2]]));
 const before=map(git(['show',baseline+':sitemap.xml'])),after=map(await readFile('sitemap.xml','utf8'));assert.equal(after.size,112);assert.deepEqual([...after.keys()],[...before.keys()]);for(const[p,date]of after)assert.equal(date,p===target?'2026-11-11':before.get(p));
 report.scope.onlyTargetSitemapDateChanged=true;report.scope.publicPages=112;
 if(process.argv.includes('--scope-only'))report.productionNotChecked=true;
 else{
  for(const p of['/','/tools/',target,'/systems/water-laboratory-qa/','/tools/bod-seed-correction-bottle-analyzer/','/tools/water-duplicate-rpd-batch-checker/','/tools/matrix-spike-recovery-calculator/','/guides/review-water-laboratory-calculations/','/reference/water-laboratory-qc-calculation-bases/','/systems/rainfall-records-gauge-networks/','/tools/groundwater-stabilization-log-analyzer/','/tools/pressure-tank-sizing-calculator/','/reference/greywater-source-use-screening/']){
   const{r,body}=await parity(p);assert.ok(body.includes(`rel="canonical" href="${domain+p}"`));assert.ok(body.includes('name="robots" content="index,follow"'));assert.equal(r.headers.get('x-robots-tag'),null);assert.equal((body.match(/gtag\('config', 'G-7FB08YPX7C'\)/g)||[]).length,1);
  }
  for(const p of['/'+engine,'/assets/css/water-laboratory.css','/assets/js/form-utils.js','/assets/css/main.css','/assets/js/tools/matrix-spike-batch.js','/sitemap.xml','/robots.txt','/partials/header.html','/partials/footer.html'])await parity(p);
  for(const p of[target,'/tools/matrix-spike-recovery-calculator/']){const a=await get(p),b=await get(p,{headers:{'User-Agent':'Googlebot'}});assert.equal(b.r.status,200);assert.equal(hash(a.body),hash(b.body));}
  const redirect=await get('http://watersystemsbench.com/',{redirect:'manual'});assert.equal(redirect.r.status,301);assert.equal(redirect.r.headers.get('location'),domain+'/');
  for(const p of['/docs/','/docs/page-inventory.html','/docs/information-architecture.html','/docs/project-plan.html','/docs/weekly-growth-review-2026-11-11.html','/docs/weekly-growth-review-2026-11-11.md','/docs/solids-scope-upgrade-2026-11-11.html','/docs/solids-scope-upgrade-2026-11-11.md','/handover.html','/tools-qa/solids-scope-browser-qa.mjs','/package.json'])assert.equal((await get(p)).r.status,404,p);
 }
 report.complete=true;
}catch(e){report.failure=e.stack;process.exitCode=1;}
await writeFile(output,JSON.stringify(report,null,2));console.log(JSON.stringify({complete:report.complete,scope:report.scope,requests:report.checks.length,analyticsExecuted:0,failure:report.failure}));
