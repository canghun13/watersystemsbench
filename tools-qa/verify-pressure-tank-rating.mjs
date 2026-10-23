import assert from "node:assert/strict";
import { compareRatedDrawdown, computePressureTank } from "../assets/js/tools/pressure-tank-sizing.js";
import { toSI, fromSI } from "../assets/js/unit-conversions.js";

let assertions = 0;
const equal = (actual, expected) => { assert.equal(actual, expected); assertions++; };
const close = (actual, expected, tolerance = 1e-9) => { assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} versus ${expected}`); assertions++; };
const rejects = input => { assert.throws(() => compareRatedDrawdown(input)); assertions++; };
const base = { pumpLpm: 40, minimumRunMinutes: 1, ratedDrawdownL: 32 };
const low = compareRatedDrawdown(base);
equal(low.requiredDrawdownL, 40);
equal(low.marginL, -8);
equal(low.coveragePercent, 80);
equal(low.refillMinutes, 0.8);
equal(low.meetsTarget, false);
const high = compareRatedDrawdown({ ...base, ratedDrawdownL: 50 });
equal(high.marginL, 10);
equal(high.coveragePercent, 125);
equal(high.refillMinutes, 1.25);
equal(high.meetsTarget, true);
const boundary = compareRatedDrawdown({ ...base, ratedDrawdownL: 40 });
equal(boundary.marginL, 0);
equal(boundary.meetsTarget, true);
equal(compareRatedDrawdown({ ...base, ratedDrawdownL: 39.999 }).meetsTarget, false);
equal(compareRatedDrawdown({ ...base, ratedDrawdownL: 40.001 }).meetsTarget, true);

// Independent US arithmetic: 10 GPM ×2 min=20 US gal; 25−20=5; 25/10=2.5.
const us = compareRatedDrawdown({ pumpLpm: toSI(10, "flow", "US"), minimumRunMinutes: 2, ratedDrawdownL: toSI(25, "volume", "US") });
close(us.requiredDrawdownL, 75.70823568);
close(fromSI(us.marginL, "volume", "US"), 5);
close(us.coveragePercent, 125);
close(us.refillMinutes, 2.5);
equal(us.meetsTarget, true);
const slow = compareRatedDrawdown({ pumpLpm: 0.1, minimumRunMinutes: 0.5, ratedDrawdownL: 0.02 });
close(slow.marginL, -0.03);
close(slow.refillMinutes, 0.2);
equal(slow.meetsTarget, false);
const realisticHigh = compareRatedDrawdown({ pumpLpm: 100000, minimumRunMinutes: 120, ratedDrawdownL: 12000000 });
equal(realisticHigh.marginL, 0);
equal(realisticHigh.refillMinutes, 120);
equal(realisticHigh.meetsTarget, true);
equal(compareRatedDrawdown({ pumpLpm: 1e-9, minimumRunMinutes: 1, ratedDrawdownL: 1e-9 }).meetsTarget, true);
for (const key of ["pumpLpm", "minimumRunMinutes", "ratedDrawdownL"]) {
  for (const value of [0, -1, NaN, Infinity, 1e-10, 1e9 + 1, "40", undefined]) rejects({ ...base, [key]: value });
}
// Existing documented example remains a separate ideal nominal-volume calculation.
const ideal = computePressureTank({ pumpLpm: 40, minimumRunMinutes: 1, prechargeKPa: 193, cutInKPa: 207, cutOutKPa: 345 });
equal(ideal.requiredDrawdownL, 40);
close(ideal.minimumTankVolumeL, 135.5, 0.05);
console.log(`Pressure tank rated-drawdown verification passed: ${assertions} independent numeric, unit, boundary and validation assertions.`);
