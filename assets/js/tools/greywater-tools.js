import { numberValue, renderResult, setupForm, setupUnitSystem } from "../form-utils.js";
import { formatNumber, fromSI, toSI } from "../unit-conversions.js";

const value = (form, name, options = {}) => numberValue(form, name, options);
const report = (form, label, primary, supporting, interpretation, warning = "") =>
  renderResult(form, { label, primary, supporting, interpretation, warning });

function positive(value, label) {
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${label} must be greater than zero.`);
}

function nonnegative(value, label) {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${label} must be zero or greater.`);
}

function percent(value, label, allowZero = true) {
  if (!Number.isFinite(value) || value > 100 || value < (allowZero ? 0 : Number.EPSILON)) {
    throw new Error(`${label} must be ${allowZero ? "between 0% and 100%" : "greater than 0% and no more than 100%"}.`);
  }
}

export function computeGreywaterSupply({
  occupants, showerFlowLpm, showerMinutesPerPerson, bathLPerDay,
  laundryLPerLoad, loadsPerWeek, basinLPerPersonDay, capturePercent
}) {
  if (!Number.isInteger(occupants) || occupants < 1 || occupants > 100) throw new Error("Occupants must be a whole number between 1 and 100.");
  for (const [amount, label] of [[showerFlowLpm, "Shower flow"], [showerMinutesPerPerson, "Shower minutes"], [bathLPerDay, "Bath volume"], [laundryLPerLoad, "Laundry volume"], [loadsPerWeek, "Laundry loads"], [basinLPerPersonDay, "Basin volume"]]) nonnegative(amount, label);
  percent(capturePercent, "Capture factor", false);
  const showerLPerDay = occupants * showerFlowLpm * showerMinutesPerPerson;
  const laundryLPerDay = laundryLPerLoad * loadsPerWeek / 7;
  const basinLPerDay = occupants * basinLPerPersonDay;
  const rawLPerDay = showerLPerDay + bathLPerDay + laundryLPerDay + basinLPerDay;
  positive(rawLPerDay, "Generated greywater");
  const usableLPerDay = rawLPerDay * capturePercent / 100;
  return { showerLPerDay, laundryLPerDay, basinLPerDay, bathLPerDay, rawLPerDay, usableLPerDay, weeklyL: usableLPerDay * 7, annualL: usableLPerDay * 365.25 };
}

export function computeIrrigationMatch({ supplyLPerDay, etoMmWeek, rainfallMmWeek, plantFactor, areaM2, irrigationEfficiencyPercent }) {
  positive(supplyLPerDay, "Greywater supply");
  for (const [amount, label] of [[etoMmWeek, "Reference ET"], [rainfallMmWeek, "Effective rainfall"], [plantFactor, "Plant factor"]]) nonnegative(amount, label);
  if (plantFactor > 1.5) throw new Error("Plant factor is outside the supported 0 to 1.5 screening range.");
  positive(areaM2, "Irrigated area");
  percent(irrigationEfficiencyPercent, "Irrigation efficiency", false);
  const netDepthMmWeek = Math.max(0, etoMmWeek * plantFactor - rainfallMmWeek);
  const grossDepthMmWeek = netDepthMmWeek / (irrigationEfficiencyPercent / 100);
  const demandLWeek = grossDepthMmWeek * areaM2;
  const supplyLWeek = supplyLPerDay * 7;
  const offsetLWeek = Math.min(supplyLWeek, demandLWeek);
  const coveragePercent = demandLWeek === 0 ? 100 : offsetLWeek / demandLWeek * 100;
  const balanceLWeek = supplyLWeek - demandLWeek;
  const supportedAreaM2 = grossDepthMmWeek > 0 ? supplyLWeek / grossDepthMmWeek : null;
  return { netDepthMmWeek, grossDepthMmWeek, demandLWeek, supplyLWeek, offsetLWeek, coveragePercent, balanceLWeek, supportedAreaM2 };
}

export function computeLaundryZone({ loadVolumeL, outletCount, minimumLPerOutlet, maximumLPerOutlet, loadsPerWeek }) {
  positive(loadVolumeL, "Load volume");
  if (!Number.isInteger(outletCount) || outletCount < 1 || outletCount > 500) throw new Error("Outlet count must be a whole number between 1 and 500.");
  positive(minimumLPerOutlet, "Minimum target volume");
  positive(maximumLPerOutlet, "Maximum target volume");
  if (maximumLPerOutlet < minimumLPerOutlet) throw new Error("Maximum target volume must be at least the minimum target volume.");
  nonnegative(loadsPerWeek, "Loads per week");
  const perOutletL = loadVolumeL / outletCount;
  const minimumOutlets = Math.ceil(loadVolumeL / maximumLPerOutlet);
  const maximumOutlets = Math.floor(loadVolumeL / minimumLPerOutlet);
  const feasibleRange = maximumOutlets >= Math.max(1, minimumOutlets);
  const status = perOutletL < minimumLPerOutlet ? "Below entered target" : perOutletL > maximumLPerOutlet ? "Above entered target" : "Within entered target";
  return { perOutletL, minimumOutlets, maximumOutlets, feasibleRange, status, weeklyLPerOutlet: perOutletL * loadsPerWeek };
}

export function computeSurgeBasin({ eventVolumeL, outletCount, basinAreaM2, basinDepthM, voidPercent, infiltrationMmHour, drainHours, deliveryPercent }) {
  positive(eventVolumeL, "Event volume");
  if (!Number.isInteger(outletCount) || outletCount < 1 || outletCount > 500) throw new Error("Outlet count must be a whole number between 1 and 500.");
  positive(basinAreaM2, "Basin area per outlet");
  positive(basinDepthM, "Effective basin depth");
  percent(voidPercent, "Available void fraction", false);
  nonnegative(infiltrationMmHour, "Measured infiltration rate");
  positive(drainHours, "Drain-down window");
  percent(deliveryPercent, "Delivered fraction", false);
  const deliveredL = eventVolumeL * deliveryPercent / 100;
  const storageL = outletCount * basinAreaM2 * basinDepthM * 1000 * voidPercent / 100;
  const infiltrationL = outletCount * basinAreaM2 * infiltrationMmHour * drainHours;
  const acceptanceL = storageL + infiltrationL;
  const marginL = acceptanceL - deliveredL;
  const perOutletL = deliveredL / outletCount;
  return { deliveredL, storageL, infiltrationL, acceptanceL, marginL, perOutletL, status: marginL >= 0 ? "Entered capacity covers event" : "Entered capacity shortfall" };
}

export function computeReuseSavings({ dailyReuseL, activeDays, waterTariff, sewerTariff, sewerOffsetPercent, annualOperatingCost, installedCost }) {
  positive(dailyReuseL, "Daily reused volume");
  if (!Number.isInteger(activeDays) || activeDays < 1 || activeDays > 366) throw new Error("Active days must be a whole number between 1 and 366.");
  for (const [amount, label] of [[waterTariff, "Water tariff"], [sewerTariff, "Sewer tariff"], [annualOperatingCost, "Annual operating cost"], [installedCost, "Installed cost"]]) nonnegative(amount, label);
  percent(sewerOffsetPercent, "Sewer-charge offset");
  const annualReuseM3 = dailyReuseL * activeDays / 1000;
  const avoidedWaterCost = annualReuseM3 * waterTariff;
  const avoidedSewerCost = annualReuseM3 * sewerTariff * sewerOffsetPercent / 100;
  const grossAnnualSavings = avoidedWaterCost + avoidedSewerCost;
  const netAnnualSavings = grossAnnualSavings - annualOperatingCost;
  const simplePaybackYears = installedCost > 0 && netAnnualSavings > 0 ? installedCost / netAnnualSavings : null;
  return { annualReuseM3, avoidedWaterCost, avoidedSewerCost, grossAnnualSavings, netAnnualSavings, simplePaybackYears };
}

if (typeof document !== "undefined") for (const form of document.querySelectorAll('[data-tool-form^="greywater-"]')) {
  setupUnitSystem(form);
  setupForm(form, (current) => {
    const system = current.elements.unitSystem?.value || "SI";
    const type = current.dataset.toolForm;
    if (type === "greywater-supply") {
      const result = computeGreywaterSupply({
        occupants: value(current, "occupants", { allowZero: false, min: 1, max: 100 }),
        showerFlowLpm: toSI(value(current, "showerFlow"), "flow", system),
        showerMinutesPerPerson: value(current, "showerMinutes"),
        bathLPerDay: toSI(value(current, "bathVolume"), "volume", system),
        laundryLPerLoad: toSI(value(current, "laundryVolume"), "volume", system),
        loadsPerWeek: value(current, "loadsPerWeek"),
        basinLPerPersonDay: toSI(value(current, "basinVolume"), "volume", system),
        capturePercent: value(current, "capture", { allowZero: false, max: 100 })
      });
      report(current, "Usable greywater supply", `${formatNumber(fromSI(result.usableLPerDay, "volume", system), 1)}<span class="reading-unit"> ${system === "US" ? "US gal/day" : "L/day"}</span>`, [
        `Generated before capture factor: ${formatNumber(fromSI(result.rawLPerDay, "volume", system), 1)} ${system === "US" ? "US gal/day" : "L/day"}`,
        `Shower / bath: ${formatNumber(fromSI(result.showerLPerDay + result.bathLPerDay, "volume", system), 1)} ${system === "US" ? "US gal/day" : "L/day"}`,
        `Laundry: ${formatNumber(fromSI(result.laundryLPerDay, "volume", system), 1)} ${system === "US" ? "US gal/day" : "L/day"}`,
        `Bathroom basins: ${formatNumber(fromSI(result.basinLPerDay, "volume", system), 1)} ${system === "US" ? "US gal/day" : "L/day"}`,
        `Weekly usable supply: ${formatNumber(fromSI(result.weeklyL, "volume", system), 0)} ${system === "US" ? "US gal" : "L"}`
      ], "Measure actual fixtures and cycles where possible; not every source is permitted or suitable for every reuse.", "Keep potable plumbing separated and check local health, plumbing, discharge and irrigation rules before diversion.");
    } else if (type === "greywater-irrigation") {
      const result = computeIrrigationMatch({
        supplyLPerDay: toSI(value(current, "supply", { allowZero: false }), "volume", system),
        etoMmWeek: toSI(value(current, "eto"), "rainfall", system),
        rainfallMmWeek: toSI(value(current, "rainfall"), "rainfall", system),
        plantFactor: value(current, "plantFactor", { max: 1.5 }),
        areaM2: toSI(value(current, "area", { allowZero: false }), "area", system),
        irrigationEfficiencyPercent: value(current, "efficiency", { allowZero: false, max: 100 })
      });
      report(current, "Greywater demand coverage", `${formatNumber(result.coveragePercent, 1)}<span class="reading-unit"> %</span>`, [
        `Gross irrigation demand: ${formatNumber(fromSI(result.demandLWeek, "volume", system), 0)} ${system === "US" ? "US gal/week" : "L/week"}`,
        `Greywater supply: ${formatNumber(fromSI(result.supplyLWeek, "volume", system), 0)} ${system === "US" ? "US gal/week" : "L/week"}`,
        `Weekly balance: ${formatNumber(fromSI(result.balanceLWeek, "volume", system), 0)} ${system === "US" ? "US gal" : "L"}`,
        result.supportedAreaM2 == null ? "No supplemental demand under the entered climate case." : `Area supported at entered demand: ${formatNumber(fromSI(result.supportedAreaM2, "area", system), 1)} ${system === "US" ? "ft²" : "m²"}`
      ], "Use local ET, effective rainfall, plant factors and irrigation efficiency. A positive balance must be diverted or managed without ponding or runoff.");
    } else if (type === "greywater-laundry-zone") {
      const result = computeLaundryZone({
        loadVolumeL: toSI(value(current, "loadVolume", { allowZero: false }), "volume", system),
        outletCount: value(current, "outlets", { allowZero: false, min: 1, max: 500 }),
        minimumLPerOutlet: toSI(value(current, "minimum", { allowZero: false }), "volume", system),
        maximumLPerOutlet: toSI(value(current, "maximum", { allowZero: false }), "volume", system),
        loadsPerWeek: value(current, "loads", { max: 100 })
      });
      report(current, "Per-outlet event volume", `${formatNumber(fromSI(result.perOutletL, "volume", system), 1)}<span class="reading-unit"> ${system === "US" ? "US gal" : "L"}</span>`, [
        `Status against entered target: ${result.status}`,
        result.feasibleRange ? `Calculated whole-outlet range: ${Math.max(1, result.minimumOutlets)} to ${result.maximumOutlets}` : "No whole-outlet count satisfies both entered targets.",
        `Weekly volume per outlet: ${formatNumber(fromSI(result.weeklyLPerOutlet, "volume", system), 1)} ${system === "US" ? "US gal" : "L"}`
      ], "The target range is user supplied; it must come from the actual plant, soil, basin and local design guidance.", "Do not connect directly to a potable system or create a cross-connection. Preserve the appliance's required drain and emergency diversion path.");
    } else if (type === "greywater-surge") {
      const result = computeSurgeBasin({
        eventVolumeL: toSI(value(current, "eventVolume", { allowZero: false }), "volume", system),
        outletCount: value(current, "outlets", { allowZero: false, min: 1, max: 500 }),
        basinAreaM2: toSI(value(current, "basinArea", { allowZero: false }), "area", system),
        basinDepthM: toSI(value(current, "basinDepth", { allowZero: false }), "length", system),
        voidPercent: value(current, "void", { allowZero: false, max: 100 }),
        infiltrationMmHour: toSI(value(current, "infiltration"), "rainfall", system),
        drainHours: value(current, "drainHours", { allowZero: false, max: 168 }),
        deliveryPercent: value(current, "delivery", { allowZero: false, max: 100 })
      });
      report(current, "Surge acceptance check", `${result.status}`, [
        `Delivered event volume: ${formatNumber(fromSI(result.deliveredL, "volume", system), 1)} ${system === "US" ? "US gal" : "L"}`,
        `Entered basin void capacity: ${formatNumber(fromSI(result.storageL, "volume", system), 1)} ${system === "US" ? "US gal" : "L"}`,
        `Entered-window infiltration: ${formatNumber(fromSI(result.infiltrationL, "volume", system), 1)} ${system === "US" ? "US gal" : "L"}`,
        `Capacity margin: ${formatNumber(fromSI(result.marginL, "volume", system), 1)} ${system === "US" ? "US gal" : "L"}`,
        `Delivered per outlet: ${formatNumber(fromSI(result.perOutletL, "volume", system), 1)} ${system === "US" ? "US gal" : "L"}`
      ], "This is an event-volume screen using the infiltration rate and available void volume you entered; confirm it with field observation.", "Stop or divert flow if water surfaces, ponds, runs off, reaches a building, or approaches a well, watercourse or prohibited area.");
    } else if (type === "greywater-savings") {
      const result = computeReuseSavings({
        dailyReuseL: toSI(value(current, "dailyReuse", { allowZero: false }), "volume", system),
        activeDays: value(current, "activeDays", { allowZero: false, min: 1, max: 366 }),
        waterTariff: value(current, "waterTariff"),
        sewerTariff: value(current, "sewerTariff"),
        sewerOffsetPercent: value(current, "sewerOffset", { max: 100 }),
        annualOperatingCost: value(current, "operatingCost"),
        installedCost: value(current, "installedCost")
      });
      report(current, "Net annual savings", `${formatNumber(result.netAnnualSavings, 2)}<span class="reading-unit"> currency/year</span>`, [
        `Annual reused water: ${formatNumber(result.annualReuseM3, 2)} m³`,
        `Avoided water charge: ${formatNumber(result.avoidedWaterCost, 2)} currency/year`,
        `Avoided sewer charge entered: ${formatNumber(result.avoidedSewerCost, 2)} currency/year`,
        result.simplePaybackYears == null ? "Simple payback is unavailable because cost is zero or net savings are not positive." : `Simple payback: ${formatNumber(result.simplePaybackYears, 1)} years`
      ], "Use current local tariff rules. Some utilities do not reduce sewer charges when outdoor reuse changes metered water use.", "Simple payback excludes financing, replacement, escalation, rebates, property impacts and non-financial benefits.");
    }
  });
}
