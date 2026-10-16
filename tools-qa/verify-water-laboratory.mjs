import assert from "node:assert/strict";
import { analyzeBod, computeSolids, checkDuplicates, computeSpike, parseLabCsv } from "../assets/js/tools/water-laboratory-tools.js";

let checks = 0;
const equal = (actual, expected) => { assert.deepEqual(actual, expected); checks++; };
const close = (actual, expected, tolerance = 1e-8) => { assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} != ${expected}`); checks++; };
const rejects = fn => { assert.throws(fn); checks++; };
// Expected results below are literal hand calculations / published worked quantities,
// never values produced by the implementation under test.
const controls = [{control:"SC1",initialDo:8.5,finalDo:.3,seedMl:30},{control:"SC2",initialDo:8.4,finalDo:1.6,seedMl:20},{control:"SC3",initialDo:8.4,finalDo:4.3,seedMl:10}];
const sample = {bottle:"A",sampleMl:15,initialDo:8.5,finalDo:3.5,seedMl:2};
const bod = {mode:"direct",bottleMl:300,minimumDepletion:2,minimumFinalDo:1,samples:[sample],controls};
let b = analyzeBod(bod);
close(b.unitDemand,.375); close(b.rows[0].correction,.75); close(b.rows[0].bod,85); equal(b.eligible,1); equal(b.seedRows.map(x=>x.used),[false,true,true]);
close(analyzeBod({...bod,mode:"none",samples:[{...sample,seedMl:0}]}).rows[0].bod,100);
b=analyzeBod({...bod,mode:"water",waterInitial:8.6,waterFinal:6.2,samples:[{...sample,sampleMl:150,initialDo:8.5,finalDo:1.1,seedMl:0},{...sample,sampleMl:100,initialDo:8.4,finalDo:2.6,seedMl:0},{...sample,sampleMl:50,initialDo:8.4,finalDo:3.9,seedMl:0}]});
// DNR's third worked line prints an internally inconsistent 13.8: (4.5−2.0)×6 is 15.0.
// Follow the stated mass/depletion equation, not the printed arithmetic slip.
[12.4,12.6,15].forEach((expected,i)=>close(b.rows[i].bod,expected)); equal(b.eligible,3);
// Criteria are user data. Equality is accepted, but no certification is inferred.
equal(analyzeBod({...bod,mode:"none",samples:[{...sample,sampleMl:300,seedMl:0,initialDo:3,finalDo:1}]}).eligible,1);
equal(analyzeBod({...bod,samples:[{...sample,finalDo:.9}]}).rows[0].bod,null);
equal(analyzeBod({...bod,samples:[{...sample,initialDo:8,finalDo:7}]}).eligible,0);
equal(analyzeBod({...bod,controls:[controls[0]]}).rows[0].bod,null);
equal(analyzeBod({...bod,controls:[{...controls[1],seedMl:1}],samples:[{...sample,seedMl:2}]}).rows[0].bod,null);
close(analyzeBod({...bod,minimumDepletion:0,mode:"none",samples:[{...sample,seedMl:0,initialDo:3.5}]}).rows[0].bod,0);
equal(analyzeBod({...bod,mode:"water",waterInitial:8,waterFinal:7,samples:[{...sample,seedMl:0}]}).eligible,0);
rejects(()=>analyzeBod({...bod,mode:"unknown"})); rejects(()=>analyzeBod({...bod,bottleMl:0}));
rejects(()=>analyzeBod({...bod,samples:[{...sample,sampleMl:300}]}));
rejects(()=>analyzeBod({...bod,samples:[{...sample,sampleMl:0}]}));
rejects(()=>analyzeBod({...bod,samples:[{...sample,sampleMl:1e-300}]}));
rejects(()=>analyzeBod({...bod,samples:[{...sample,finalDo:9}]}));
rejects(()=>analyzeBod({...bod,controls:[{...controls[1],seedMl:-1}]}));
rejects(()=>analyzeBod({...bod,mode:"none"})); // Nonzero direct seed cannot be silently ignored.
close(analyzeBod({...bod,mode:"none",bottleMl:1000,samples:[{...sample,sampleMl:1,seedMl:0}]}).rows[0].bod,5000);
const solids={tareMg:1177.4,dryMg:1207.4,ashMg:1187.4,blankLossMg:0,volumeMl:100,minimumResidueMg:1};
let s=computeSolids(solids); close(s.tss,300);close(s.vss,200);close(s.fixed,100);close(s.fraction,66.6666666666667);equal(s.massMet,true);
close(computeSolids({...solids,blankLossMg:2}).vss,180);
close(computeSolids({...solids,volumeMl:1000}).tss,30);
close(computeSolids({...solids,tareMg:0,dryMg:100000,ashMg:25000,volumeMl:1000}).vss,75000);
s=computeSolids({...solids,dryMg:1177.4,ashMg:1177.4});equal(s.fraction,null);equal(s.tss,0);equal(s.massMet,false);
equal(computeSolids({...solids,minimumResidueMg:30}).massMet,true);
equal(computeSolids({...solids,minimumResidueMg:31}).massMet,false);
rejects(()=>computeSolids({...solids,dryMg:1100}));rejects(()=>computeSolids({...solids,ashMg:1300}));rejects(()=>computeSolids({...solids,ashMg:1100}));rejects(()=>computeSolids({...solids,blankLossMg:21}));rejects(()=>computeSolids({...solids,volumeMl:0}));rejects(()=>computeSolids({...solids,tareMg:-1}));rejects(()=>computeSolids({...solids,volumeMl:1e-300}));
const pair = {analyte:"Chloride",result:"10",duplicate:"12",reportingLimit:".1"};
const dup={rows:[pair],maximumRpd:20,minimumRlMultiple:5,absoluteLimit:.02};
let d=checkDuplicates(dup)[0];close(d.rpd,18.1818181818182);equal(d.status,"Within entered limit");equal(d.mode,"RPD");
equal(checkDuplicates({...dup,maximumRpd:18})[0].status,"Exceeds entered limit");
d=checkDuplicates({...dup,rows:[{...pair,result:".05",duplicate:".06",reportingLimit:".02"}]})[0];close(d.difference,.01);equal(d.mode,"Absolute difference");equal(d.status,"Within entered limit");
equal(checkDuplicates({...dup,absoluteLimit:.009,rows:[{...pair,result:".05",duplicate:".06",reportingLimit:".02"}]})[0].status,"Exceeds entered limit");
equal(checkDuplicates({...dup,rows:[{...pair,result:"<.02"}]})[0].rpd,null);
equal(checkDuplicates({...dup,rows:[{...pair,result:"<.02",duplicate:"<.02"}]})[0].status,"Not assessed");
equal(checkDuplicates({...dup,rows:[{...pair,result:"0",duplicate:"0"}]})[0].mode,"Absolute difference");
equal(checkDuplicates({...dup,minimumRlMultiple:0,rows:[{...pair,result:"0",duplicate:"0"}]})[0].status,"Not assessed");
close(checkDuplicates({...dup,minimumRlMultiple:0,rows:[{...pair,result:"0",duplicate:"1"}]})[0].rpd,200);
equal(checkDuplicates({...dup,rows:[{...pair,result:"1",duplicate:"1",reportingLimit:".2"}]})[0].mode,"RPD");
for(const bad of ["", "ND", "=1+2", "-1", "Infinity", "<", "1junk", "1 2", "<<.1"]) rejects(()=>checkDuplicates({...dup,rows:[{...pair,result:bad}]}));
close(checkDuplicates({...dup,rows:[{...pair,result:"1000000",duplicate:"1000000"}]})[0].rpd,0);
const spike={mode:"basis",native:5,spiked:14.6,added:10,lower:80,upper:120};
let p=computeSpike(spike);close(p.recovery,96);equal(p.within,true);close(p.expected,15);
close(computeSpike({...spike,native:0,spiked:10}).recovery,100);
close(computeSpike({...spike,spiked:4}).recovery,-10);
close(computeSpike({...spike,spiked:20}).recovery,150);
equal(computeSpike({...spike,spiked:13}).within,true);equal(computeSpike({...spike,spiked:17}).within,true);
const volume={...spike,mode:"volume",native:2,spiked:10.909090909090908,sampleMl:100,spikeMl:10,stock:100};
p=computeSpike(volume);close(p.recovery,100);close(p.expected,10.909090909090908);close(p.nativeFinal,1.8181818181818181);close(p.addedFinal,9.090909090909092);close(p.volumeIncrease,10);
// Equivalent physical volumes (ratio unchanged) and recovery-basis distinction.
close(computeSpike({...volume,sampleMl:1,spikeMl:.1}).recovery,100);
close(computeSpike({...spike,native:1.8181818181818181,spiked:10.909090909090908,added:9.090909090909092}).recovery,100);
for(const patch of [{added:0},{added:-1},{upper:50},{native:-1},{mode:"bad"},{added:1e-300}]) rejects(()=>computeSpike({...spike,...patch}));
rejects(()=>computeSpike({...volume,spikeMl:0}));rejects(()=>computeSpike({...volume,stock:0}));
const header=["analyte","result","duplicate","reportingLimit"];
equal(parseLabCsv("\uFEFFanalyte,result,duplicate,reportingLimit\nA,1,2,0.1",header).length,1);
for(const bad of ["", "wrong,header\nA,1", "analyte,result,duplicate,reportingLimit", "analyte,result,duplicate,reportingLimit\nA,,2,.1", 'analyte,result,duplicate,reportingLimit\n"A,B",1,2,.1', "analyte,result,duplicate,reportingLimit\nA,1,2,.1\n\nB,1,2,.1", "x".repeat(262145)]) rejects(()=>parseLabCsv(bad,header));
rejects(()=>parseLabCsv("analyte,result,duplicate,reportingLimit\n"+Array(251).fill("A,1,2,.1").join("\n"),header));
console.log(`Water laboratory verification passed: ${checks} independent numeric, basis, boundary, censor and strict-parser assertions.`);
