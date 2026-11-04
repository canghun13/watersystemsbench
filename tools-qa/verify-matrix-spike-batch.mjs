import assert from "node:assert/strict";
import { reviewSpikeBatch as review, spikeBatchCsv, spikeBatchPacket, batchExamples, batchHeaders } from "../assets/js/tools/matrix-spike-batch.js";

let assertions = 0;
const eq = (a,b) => { assert.deepEqual(a,b); assertions++; };
const near = (a,b) => { assert.ok(Math.abs(a-b) <= 1e-9 * Math.max(1,Math.abs(b)), `${a} != ${b}`); assertions++; };
const throws = (fn, pattern) => { assert.throws(fn,pattern); assertions++; };
const row = (values, mode="basis", unit="mg/L") => review(batchHeaders[mode].join(",") + "\n" + values,mode,unit).rows[0];
const basis = (values,unit) => row("A,"+values,"basis",unit);
const r=review(batchExamples.basis);
eq([r.total,r.calculated,r.within,r.outside,r.uncomputed,r.complete],[3,2,1,1,1,false]);
near(r.rows[0].recovery,96); near(r.rows[1].recovery,40); eq(r.rows[2].recovery,null); eq(r.rows[2].status,"Not calculated"); eq(r.rows[2].input.native,"ND");
near(r.rows[0].expected,15); near(r.rows[0].nativeFinal,5); near(r.rows[0].addedFinal,10);
near(basis("0,0,10,0,0").recovery,0); eq(basis("0,0,10,0,0").within,true);
near(basis("5,0,10,0,120").recovery,-50); eq(basis("5,0,10,0,120").within,false);
near(basis("0,20,10,80,120").recovery,200); eq(basis("0,20,10,80,120").within,false);
eq(basis("5,13,10,80,120").within,true); eq(basis("5,17,10,80,120").within,true);
eq(basis("5,12.99,10,80,120").within,false); eq(basis("5,17.01,10,80,120").within,false);
near(basis("5000,14600,10000,80,120","µg/L").recovery,96);
near(basis("5e-9,14.6e-9,10e-9,80,120").recovery,96);
near(basis("5e11,9e11,4e11,80,120").recovery,100);
const v=row("A,2,10.90909090909091,100,10,100,80,120","volume");
near(v.nativeFinal,20/11); near(v.addedFinal,100/11); near(v.expected,120/11); near(v.recovery,100); near(v.volumeIncrease,10); eq(v.within,true);
near(row("A,2,12,100,20,50,80,120","volume").recovery,124);
eq(row("A,2,12,100,20,50,80,120","volume").within,false);
near(row("A,2000,10909.09090909091,100,10,100000,80,120","volume","µg/L").recovery,100);
near(row("A,2,10.90909090909091,1000,100,100,80,120","volume").recovery,100);
for(const value of ["NA","ND","<0.1",">10","NaN","Infinity","-1","1e-999","1e-10","1000000000001","1 2","0x10","1,000"]){
 if(value.includes(",")){throws(()=>basis(`${value},14.6,10,80,120`),/cells/);continue;}
 const bad=basis(`${value},14.6,10,80,120`);eq(bad.recovery,null);eq(bad.status,"Not calculated");
}
for(const values of ["5,14.6,0,80,120","5,14.6,10,120,80","5,14.6,10,-1,120","5,14.6,10,NA,120"]){eq(basis(values).recovery,null);}
for(const values of ["A,2,12,0,10,100,80,120","A,2,12,100,0,100,80,120","A,2,12,100,10,0,80,120"]){eq(row(values,"volume").recovery,null);}
eq(review("\uFEFFrecord,native,spiked,added,lower,upper\r\n A , 5 ,14.6,10,80,120\r\n").calculated,1);
eq(basis("0e999,0,10,0,120").recovery,0);
throws(()=>review(""),/Paste CSV/); throws(()=>review("record,native,spiked,added,lower,upper"),/at least one/);
throws(()=>review("bad\nA,5,14.6,10,80,120"),/exact CSV header/);
throws(()=>review("record,native,spiked,added,lower,upper\nA,,14.6,10,80,120"),/all 6 cells/);
throws(()=>review("record,native,spiked,added,lower,upper\nA,5,14.6,10,80,120\n\nB,2,6,10,80,120"),/cells/);
throws(()=>review(batchExamples.basis,"wrong"),/supported record/); throws(()=>review(batchExamples.basis,"basis","ppm"),/mg\/L/);
throws(()=>review("record,native,spiked,added,lower,upper\nA,5,14.6,10,80,120\nA,2,6,10,80,120"),/Duplicate/);
for(const id of ["=SUM(A1)","+A","-A","@A","A\tB","X".repeat(81)])throws(()=>review("record,native,spiked,added,lower,upper\n"+id+",5,14.6,10,80,120"),/IDs|labels/);
eq(row("Sample α nitrate,5,14.6,10,80,120").input.record,"Sample α nitrate");
const rows=n=>"record,native,spiked,added,lower,upper\n"+Array.from({length:n},(_,i)=>`S-${i+1},5,14.6,10,80,120`).join("\n");
const max=review(rows(250)); eq([max.total,max.calculated,max.within,max.complete],[250,250,250,true]);
throws(()=>review(rows(251)),/250/); throws(()=>review("x".repeat(262145)),/256 KiB/);
throws(()=>review("가".repeat(100000)),/256 KiB/);
const csv=spikeBatchCsv(max); eq(csv.split("\r\n").length,251); assert.ok(csv.includes('"S-250"')); assertions++;
const invalidExport=spikeBatchCsv(review("record,native,spiked,added,lower,upper\nA,=1,14.6,10,80,120"));
assert.ok(invalidExport.includes('"\'=1"')); assertions++; assert.ok(invalidExport.includes('"Not calculated"')); assertions++;
assert.ok(spikeBatchCsv(r).includes('"ND"')); assertions++;
const packet=spikeBatchPacket(max,"https://watersystemsbench.com/tools/matrix-spike-recovery-calculator/");
for(const text of ["250/250","S-250","Full entered CSV","Full audit CSV","https://watersystemsbench.com/","not an analytical acceptance decision"]){assert.ok(packet.includes(text));assertions++;}
eq(review("record,native,spiked,added,lower,upper\nA,NA,14.6,10,80,120").complete,false);
console.log(`Matrix spike batch verification passed: ${assertions} independent numeric, unit, row-state, parser, export and safety assertions.`);
