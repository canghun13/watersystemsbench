import assert from 'node:assert/strict';
import { computeTss, computeSolids } from '../assets/js/tools/water-laboratory-tools.js';
let checks=0;
const near=(actual,expected)=>{checks++;assert.ok(Math.abs(actual-expected)<=1e-8*Math.max(1,Math.abs(expected)),`${actual} != ${expected}`);};
const same=(actual,expected)=>{checks++;assert.deepEqual(actual,expected);};
const base={tareMg:1177.4,dryMg:1207.4,volumeMl:100,minimumResidueMg:1};
// Literal hand-derived expected values; neither ash nor a simulated ash measurement is supplied.
for(const [input,mass,tss] of [
 [base,30,300],
 [{tareMg:1179.8,dryMg:1194.4,volumeMl:500,minimumResidueMg:1},14.6,29.2],
 [{tareMg:1178.9,dryMg:1214.8,volumeMl:150,minimumResidueMg:1},35.9,239.33333333333333],
 [{tareMg:1,dryMg:1,volumeMl:100,minimumResidueMg:0},0,0],
 [{tareMg:0,dryMg:1,volumeMl:1000,minimumResidueMg:1},1,1],
 [{tareMg:0,dryMg:0.0001,volumeMl:0.01,minimumResidueMg:0},0.0001,10],
 [{tareMg:1e6,dryMg:1000500,volumeMl:10000,minimumResidueMg:1},500,50],
 [{tareMg:0,dryMg:1e12,volumeMl:1e12,minimumResidueMg:1e12},1e12,1000],
 [{tareMg:0,dryMg:1,volumeMl:1e-9,minimumResidueMg:0},1,1e12]
]){const r=computeTss(input);near(r.dryMass,mass);near(r.tss,tss);same(Object.keys(r).sort(),['dryMass','massMet','tss']);}
same(computeTss({...base,minimumResidueMg:29}).massMet,true);
same(computeTss({...base,minimumResidueMg:30}).massMet,true);
same(computeTss({...base,minimumResidueMg:31}).massMet,false);
near(computeTss({tareMg:1.1774*1000,dryMg:1.2074*1000,volumeMl:0.1*1000,minimumResidueMg:0.001*1000}).tss,300);
for(const name of ['tareMg','dryMg','minimumResidueMg','volumeMl'])for(const bad of[-1,NaN,Infinity,1e12+1,undefined]){checks++;assert.throws(()=>computeTss({...base,[name]:bad}));}
for(const volumeMl of [0,1e-10]){checks++;assert.throws(()=>computeTss({...base,volumeMl}));}
checks++;assert.throws(()=>computeTss({...base,dryMg:1000}));
const combined=computeSolids({...base,ashMg:1187.4,blankLossMg:0});
near(combined.tss,300);near(combined.vss,200);near(combined.fixed,100);near(combined.fraction,66.66666666666667);
near(computeSolids({...base,ashMg:1187.4,blankLossMg:2}).vss,180);
console.log(`Solids result scope verification passed: ${checks} independent literal numeric, unit, boundary and validation assertions.`);
