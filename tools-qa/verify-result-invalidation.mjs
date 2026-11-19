import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
const baselineMode=process.argv.includes('--baseline');
const original=baselineMode?execFileSync('git',['show','79f63af9699d70d475ec5093b50e460b8873d91d:assets/js/form-utils.js'],{encoding:'utf8'}).replace('"./unit-conversions.js"',JSON.stringify(new URL('../assets/js/unit-conversions.js',import.meta.url).href)):null;
const {setupForm}=await import(baselineMode?'data:text/javascript;base64,'+Buffer.from(original).toString('base64'):'../assets/js/form-utils.js');
let checks=0;
const eq=(a,b)=>{checks++;assert.deepEqual(a,b);};
function fixture(){
 const form=new EventTarget();const report={hidden:false};const empty={hidden:true,setAttribute(){this.hidden=true;},removeAttribute(){this.hidden=false;}};const buttons=[{disabled:false},{disabled:false}];const error={textContent:''};let calculations=0;
 const panel={querySelector(s){return s==='.result-empty'?empty:s==='.result-report'?report:null;},querySelectorAll(){return buttons;}};
 const layout={querySelector(s){return s==='.result-panel'?panel:null;}};
 const state={fail:false};form.dataset={lastResult:'previous packet'};form.closest=()=>layout;form.querySelector=s=>s==='[data-form-error]'?error:null;form.querySelectorAll=()=>[];
 // closest result actions are intentionally absent: browser tests own real Clipboard/Print verification.
 setupForm(form,()=>{calculations++;if(state.fail)throw new Error('fixture rejected');report.hidden=false;empty.hidden=true;buttons.forEach(b=>b.disabled=false);form.dataset.lastResult='recalculated packet';});
 return{form,report,empty,buttons,error,state,count:()=>calculations};
}
for(const kind of['input','change']){
 const f=fixture(),peer=fixture();f.form.dispatchEvent(new Event(kind));
 eq(f.report.hidden,true);eq(f.empty.hidden,false);eq(f.buttons.map(b=>b.disabled),[true,true]);eq(f.form.dataset.lastResult,'');eq(f.count(),0);
 eq(peer.report.hidden,false);eq(peer.form.dataset.lastResult,'previous packet');
 f.form.dispatchEvent(new Event(kind));eq(f.report.hidden,true);eq(f.count(),0);
 const submit=new Event('submit',{cancelable:true});f.form.dispatchEvent(submit);eq(submit.defaultPrevented,true);eq(f.count(),1);eq(f.report.hidden,false);eq(f.form.dataset.lastResult,'recalculated packet');
 f.form.dispatchEvent(new Event(kind));eq(f.report.hidden,true);eq(f.form.dataset.lastResult,'');eq(f.buttons.map(b=>b.disabled),[true,true]);
}
for(const kind of['click','focusin','keydown']){const f=fixture();f.form.dispatchEvent(new Event(kind));eq(f.report.hidden,false);eq(f.form.dataset.lastResult,'previous packet');eq(f.count(),0);}
const invalid=fixture();invalid.state.fail=true;invalid.form.dispatchEvent(new Event('submit',{cancelable:true}));eq(invalid.report.hidden,true);eq(invalid.form.dataset.lastResult,'');eq(invalid.buttons.map(b=>b.disabled),[true,true]);eq(invalid.error.textContent,'fixture rejected');invalid.state.fail=false;invalid.form.dispatchEvent(new Event('submit',{cancelable:true}));eq(invalid.report.hidden,false);eq(invalid.error.textContent,'');eq(invalid.form.dataset.lastResult,'recalculated packet');
const callbacks=[];globalThis.requestAnimationFrame=fn=>callbacks.push(fn);
const reset=fixture();reset.error.textContent='old error';reset.form.dispatchEvent(new Event('reset'));eq(reset.report.hidden,false);eq(callbacks.length,1);callbacks.shift()();eq(reset.report.hidden,true);eq(reset.error.textContent,'');eq(reset.form.dataset.lastResult,'');eq(reset.count(),0);
console.log(`Result invalidation verification passed: ${checks} independent literal lifecycle and form-isolation assertions.`);
