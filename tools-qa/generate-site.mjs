import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const domain = "https://watersystemsbench.com";
const reviewed = "July 29, 2026";
const ga4 = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-7FB08YPX7C"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-7FB08YPX7C');
</script>`;

const sources = {
  doe: ["U.S. Department of Energy — Pump Systems", "https://www.energy.gov/cmei/ito/pump-systems"],
  doeManual: ["U.S. Department of Energy — Pumping System Assessment Tool User’s Manual", "https://www.energy.gov/eere/iedo/articles/pumping-system-assessment-tool-user-manual"],
  hiFaq: ["Hydraulic Institute — Pump FAQs", "https://www.pumps.org/resources/pump-faqs/"],
  hiCurve: ["Hydraulic Institute — Combined Pump & System Curves", "https://datatool.pumps.org/pump-fundamentals/combined"],
  hiNpsh: ["Hydraulic Institute — Pump Principles and NPSH", "https://datatool.pumps.org/pump-fundamentals/pump-principles"],
  usace: ["U.S. Army Corps of Engineers — EM 1110-1-4008", "https://www.publications.usace.army.mil/Portals/76/Publications/EngineerManuals/EM_1110-1-4008.pdf"],
  usgs: ["U.S. Geological Survey — Pressure transducers and pressure-head conversions", "https://pubs.usgs.gov/twri/twri8a3/"],
  nist: ["NIST — Thermophysical Properties of Fluid Systems", "https://webbook.nist.gov/chemistry/fluid/"],
  epa: ["U.S. EPA — Storm Water Management Model User’s Manual 5.2", "https://www.epa.gov/system/files/documents/2022-02/storm-water-management-model-users-manual-version-5.2.pdf"],
  westlake: ["Westlake Pipe & Fittings — Schedule 40 and 80 PVC Pressure Pipe", "https://www.westlakepipe.com/sites/default/files/PL-PS-025-CA-EN-0522.1_Sch40-Sch80-Pressure-Pipe.pdf"],
  usgsGlossary: ["U.S. Geological Survey — Water Resources Glossary", "https://water.usgs.gov/water-basics_glossary.html"],
  usgsHydrology: ["U.S. Geological Survey — Basic Ground-Water Hydrology", "https://pubs.usgs.gov/wsp/2220/report.pdf"],
  cdcRain: ["U.S. CDC — Collecting Rainwater and Your Health", "https://www.cdc.gov/drinking-water/about/collecting-rainwater-and-your-health-an-overview.html"],
  cdcCistern: ["U.S. CDC — Cistern Safety and Disasters", "https://www.cdc.gov/water-emergency/about/cistern-safety-and-disasters-before-during-and-after.html"],
  doeRain: ["U.S. Department of Energy — Rainwater Harvesting Tool Help Guide", "https://www.energy.gov/sites/default/files/2023-12/rainwater-harvesting-tool-help-guide.pdf"],
  yourHome: ["Australian Government — YourHome Rainwater Guidance", "https://www.yourhome.gov.au/water/rainwater"],
  pentairTank: ["Pentair — Steel Pressure Tanks Owner’s Manual", "https://www.pentair.com/content/dam/extranet/web/nam/pro-source/manuals/steel-pressure-tanks-manual.pdf"],
  epaEmergency: ["U.S. EPA — Emergency Drinking Water Supply Guidance", "https://www.epa.gov/waterutilityresponse/emergency-drinking-water-supply-guidance"]
  ,nrcsIrrigation: ["USDA NRCS — Irrigation Guide, Chapter 6", "https://directives.nrcs.usda.gov/sites/default/files2/1712932413/25695.pdf"]
  ,faoScheduling: ["FAO — Irrigation Scheduling", "https://www.fao.org/4/T7202E/t7202e06.htm"]
  ,epaWatersense: ["U.S. EPA WaterSense — Sprinkler Spruce-Up", "https://www.epa.gov/watersense/sprinkler-spruce-up"]
  ,hunter: ["Hunter Industries — Irrigation Technical Manual", "https://www.hunterindustries.com/sites/default/files/BR_IrrigationTechManual_dom.pdf"]
  ,rainBird: ["Rain Bird — Irrigation Design Manual", "https://www.rainbird.com/sites/default/files/media/documents/2018-02/IrrigationDesignManual.pdf"]
  ,okState: ["Oklahoma State University Extension — Managing Pressure in Home Irrigation", "https://extension.okstate.edu/fact-sheets/managing-pressure-in-the-home-irrigation-system"]
  ,epaPrivateWells: ["U.S. EPA — Protect Your Home’s Water", "https://www.epa.gov/privatewells/protect-your-homes-water"]
  ,epaSoftener: ["U.S. EPA WaterSense — Cation Exchange Water Softeners", "https://www.epa.gov/watersense/cation-exchange-water-softeners"]
  ,epaRo: ["U.S. EPA — Reverse Osmosis Process", "https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30004QQG.TXT"]
  ,epaCt: ["U.S. EPA — Disinfection Profiling and Benchmarking Technical Guidance", "https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=20002649.TXT"]
  ,epaTreatment: ["U.S. EPA — Drinking Water Technologies", "https://www.epa.gov/ground-water-and-drinking-water/drinking-water-technologies"]
  ,cdcWellTesting: ["U.S. CDC — Guidelines for Testing Well Water", "https://www.cdc.gov/drinking-water/safety/guidelines-for-testing-well-water.html"]
  ,cdcHomeTreatment: ["U.S. CDC — About Home Water Treatment Systems", "https://www.cdc.gov/drinking-water/about/about-home-water-treatment-systems.html"]
  ,cdcTreatment: ["U.S. CDC — How Water Treatment Works", "https://www.cdc.gov/drinking-water/about/how-water-treatment-works.html"]
  ,nsfTreatment: ["NSF — Standards for Water Treatment Systems", "https://www.nsf.org/consumer-resources/articles/standards-water-treatment-systems"]
  ,nsfListings: ["NSF — Official Drinking Water Treatment Unit Listings", "https://info.nsf.org/Certified/dwtu/listings.asp"]
  ,whoDrinking: ["World Health Organization — Guidelines for Drinking-water Quality", "https://www.who.int/teams/environment-climate-change-and-health/water-sanitation-and-health/water-safety-and-quality/drinking-water-quality-guidelines"]
  ,usgsWaterQuality: ["U.S. Geological Survey — Water Science Glossary", "https://www.usgs.gov/water-science-school/science/water-science-glossary"]
  ,sfGreywater: ["San Francisco Public Utilities Commission — Graywater Design Manual", "https://www.sfpuc.gov/documents/graywater-design-manual"]
  ,waGreywater: ["Washington State Department of Health — Greywater Reuse", "https://doh.wa.gov/community-and-environment/wastewater-management/greywater-reuse"]
  ,epaWaterBudget: ["U.S. EPA WaterSense — Water Budget Tool", "https://www.epa.gov/watersense/water-budget-tool"]
  ,epaNewr: ["U.S. EPA — Non-potable Environmental and Economic Water Reuse Calculator Methods", "https://www.epa.gov/sites/default/files/widgets/newr-calculator/resources.html"]
  ,auRecycling: ["Australian Government — Australian Guidelines for Water Recycling", "https://www.waterquality.gov.au/guidelines/recycled-water"]
  ,epaVehicleWash: ["U.S. EPA WaterSense at Work — Vehicle Washes", "https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=P1018SSR.TXT"]
  ,doeVehicleWash: ["U.S. Department of Energy — Vehicle Wash Water-Use Estimating Methods", "https://www.energy.gov/cmei/femp/estimating-methods-determining-end-use-water-consumption"]
  ,icaVehicleWash: ["International Carwash Association — Water Use, Evaporation and Carryout", "https://www.carwash.org/hubfs/Pulse%20and%20Research/Water%2BUse%2C%2BEvaporation%2Band%2BCarryout%2Bin%2BProfessional%2BCar%2BWashes.pdf"]
  ,doeWaterEvaluation: ["U.S. Department of Energy — Handbook of Water Use and Conservation", "https://www.energy.gov/sites/prod/files/2020/11/f80/handbook-water-evaluation-tools.pdf"]
  ,epaMetalP2: ["U.S. EPA — Pollution Prevention for Metal Finishing", "https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=30004KLA.TXT"]
  ,epaMetalGuide: ["U.S. EPA — Metal Finishing Development Document", "https://www.epa.gov/sites/default/files/2015-10/documents/metal-finishing_dd_1983.pdf"]
  ,epaMpm: ["U.S. EPA — Metal Products and Machinery Development Document", "https://www.epa.gov/sites/default/files/2015-11/documents/mp-m_dd_2003.pdf"]
  ,epaConductivity: ["U.S. EPA — Conductivity Control for Rinse Water", "https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=P100YFAU.txt"]
  ,epaLowFlowSop: ["U.S. EPA — Groundwater Sampling Operating Procedure (EQASOP-GW4)", "https://www.epa.gov/sites/default/files/2017-10/documents/eqasop-gw4.pdf"]
  ,epaLowFlow: ["U.S. EPA — Low-Flow (Minimal Drawdown) Ground-Water Sampling Procedures", "https://www.epa.gov/remedytech/low-flow-minimal-drawdown-ground-water-sampling-procedures"]
  ,usgsPurgeAnalyzer: ["U.S. Geological Survey — Purge Analyzer Tool (PAT)", "https://www.usgs.gov/centers/new-england-water-science-center/science/purge-analyzer-tool-pat-assess-optimal-pumping"]
};

const pumpToolLinks = [
  ["/tools/total-dynamic-head-calculator/", "Total Dynamic Head Calculator", "Combine elevation, pressure and losses."],
  ["/tools/pipe-friction-loss-calculator/", "Pipe Friction Loss Calculator", "Compare Hazen–Williams and Darcy–Weisbach."],
  ["/tools/water-pipe-size-velocity-checker/", "Water Pipe Size & Velocity Checker", "Screen velocity using actual internal diameter."],
  ["/tools/pump-power-efficiency-calculator/", "Pump Power & Efficiency Calculator", "Estimate hydraulic, shaft and input power."],
  ["/tools/booster-pump-duty-point-estimator/", "Booster Pump Duty Point Estimator", "Define preliminary flow and boost head."],
  ["/tools/pump-curve-duty-point-comparator/", "Pump Curve Duty Point Comparator", "Interpolate and compare up to three candidates."],
  ["/tools/npsh-available-calculator/", "NPSH Available Calculator", "Estimate suction head above vapor pressure."],
  ["/tools/pump-operating-cost-comparator/", "Pump Operating Cost Comparator", "Compare energy and annual cost scenarios."],
  ["/tools/low-water-pressure-troubleshooter/", "Low Water Pressure Troubleshooter", "Prioritize measurements and likely cause groups."]
];

const toolLinks = [...pumpToolLinks];

const guideLinks = [
  ["/guides/how-to-size-a-water-pump/", "How to Size a Water Pump", "Build a duty point from flow and total dynamic head."],
  ["/guides/how-to-read-a-pump-curve/", "How to Read a Pump Curve", "Find the duty point and interpret the operating region."],
  ["/guides/how-to-diagnose-low-water-pressure/", "How to Diagnose Low Water Pressure", "Separate pressure, flow and local restrictions."]
];

const referenceLinks = [
  ["/reference/water-flow-pressure-volume-conversions/", "Water Flow, Pressure & Volume Conversions", "One practical conversion table."],
  ["/reference/water-pressure-head-conversion/", "Water Pressure & Head Conversion", "Relate pressure to metres and feet of water."],
  ["/reference/hazen-williams-c-values/", "Hazen–Williams C Values", "Typical preliminary ranges and limitations."],
  ["/reference/water-pipe-internal-diameters/", "Water Pipe Internal Diameters", "Nominal size is not internal diameter."],
  ["/reference/pump-formulas-hydraulic-terms/", "Pump Formulas & Hydraulic Terms", "A compact notation and formulas reference."]
];

const phase2ToolLinks = [
  ["/tools/well-borehole-pump-sizing-planner/", "Well & Borehole Pump Sizing Planner", "Build a duty point from pumping level, pressure and losses."],
  ["/tools/well-yield-demand-checker/", "Well Yield vs Demand Checker", "Compare sustained source production, daily demand and peak storage."],
  ["/tools/pressure-tank-sizing-calculator/", "Pressure Tank Sizing Calculator", "Convert required run time into drawdown and nominal tank volume."],
  ["/tools/pump-short-cycling-analyzer/", "Pump Short-Cycling Analyzer", "Compare observed starts with a simple drawdown cycle model."],
  ["/tools/water-storage-tank-sizing-planner/", "Water Storage Tank Sizing Planner", "Balance outage demand, refill, reserve and usable volume."],
  ["/tools/rainwater-harvesting-yield-calculator/", "Rainwater Harvesting Yield Calculator", "Estimate roof collection after runoff and system losses."],
  ["/tools/rainwater-tank-days-of-supply-simulator/", "Rainwater Tank Days-of-Supply Simulator", "Step through 365 days of monthly rainfall, storage and demand."],
  ["/tools/first-flush-diverter-sizing-calculator/", "First Flush Diverter Sizing Calculator", "Convert a local diversion rule into required volume."]
];

const phase2GuideLinks = [
  ["/guides/well-borehole-tube-well-terminology/", "Well, Borehole & Tube Well Terminology", "Use globally variable source-water terms carefully."],
  ["/guides/complete-well-water-system-planning/", "Complete Well Water System Planning", "Connect yield, pump duty, controls, pressure and storage."],
  ["/guides/pressure-tank-drawdown-short-cycling/", "Pressure Tank Drawdown & Short Cycling", "Understand precharge, switch settings, run time and symptoms."],
  ["/guides/water-storage-demand-outages-refill/", "Water Storage for Demand, Outages & Refill", "Separate daily demand, peak use, refill and emergency reserve."],
  ["/guides/rainwater-harvesting-system-planning/", "Rainwater Harvesting System Planning", "Plan from horizontal roof area through treatment and end use."]
];

const phase2ReferenceLinks = [
  ["/reference/water-demand-planning-factors/", "Water Demand Planning Factors", "Build explicit average, peak, outage and refill scenarios."]
];

toolLinks.push(...phase2ToolLinks);
guideLinks.push(...phase2GuideLinks);
referenceLinks.push(...phase2ReferenceLinks);

const irrigationToolLinks = [
  ["/tools/available-water-flow-test-calculator/", "Available Water Flow Test Calculator", "Turn bucket or meter trials into a measured flow."],
  ["/tools/sprinkler-zone-capacity-planner/", "Sprinkler Zone Capacity Planner", "Check flow and pressure margins before grouping heads."],
  ["/tools/sprinkler-precipitation-rate-calculator/", "Sprinkler Precipitation Rate Calculator", "Convert discharge and layout to applied depth."],
  ["/tools/irrigation-runtime-water-depth-planner/", "Irrigation Runtime & Water Depth Planner", "Plan runtime, cycles and applied volume."],
  ["/tools/drip-irrigation-flow-zone-calculator/", "Drip Irrigation Flow & Zone Calculator", "Total emitters and divide feasible zones."],
  ["/tools/irrigation-pump-zone-matcher/", "Irrigation Pump & Zone Matcher", "Screen one pump duty condition against one zone."],
  ["/tools/sprinkler-low-pressure-troubleshooter/", "Sprinkler Low-Pressure Troubleshooter", "Prioritize irrigation-specific evidence and next measurements."]
];
const irrigationGuideLinks = [
  ["/guides/measure-irrigation-flow-pressure/", "How to Measure Irrigation Flow and Dynamic Pressure", "Measure supply without confusing static pressure and flow."],
  ["/guides/split-sprinkler-zones/", "How to Split Sprinklers into Practical Zones", "Build compatible hydraulic and landscape zones."],
  ["/guides/troubleshoot-low-pressure-sprinkler-zone/", "How to Troubleshoot a Low-Pressure Sprinkler Zone", "Use a safe observation sequence before changing equipment."]
];
toolLinks.push(...irrigationToolLinks);
guideLinks.push(...irrigationGuideLinks);

const treatmentToolLinks = [
  ["/tools/water-softener-sizing-calculator/", "Water Softener Sizing Calculator", "Estimate working capacity from measured hardness, use and reserve."],
  ["/tools/softener-salt-regeneration-planner/", "Softener Salt & Regeneration Planner", "Plan regeneration interval, salt, water and optional cost."],
  ["/tools/ro-recovery-reject-water-calculator/", "RO Recovery & Reject Water Calculator", "Balance feed, permeate and reject streams."],
  ["/tools/ro-production-demand-planner/", "RO Production vs Demand Planner", "Compare corrected production, demand peaks and usable storage."],
  ["/tools/media-filter-loading-rate-calculator/", "Media Filter Loading Rate Calculator", "Calculate service and backwash loading from actual filter area."],
  ["/tools/chlorine-dose-solution-volume-calculator/", "Chlorine Dose & Solution Volume Calculator", "Convert a user-supplied target dose into active mass and solution volume."],
  ["/tools/disinfection-contact-time-calculator/", "Disinfection Contact Time Calculator", "Calculate nominal time, effective time and CT from measured residual."],
  ["/tools/water-treatment-train-selector/", "Water Treatment Train Selector", "Build test-led candidate stages without declaring potable safety."]
];
const treatmentGuideLinks = [
  ["/guides/read-water-test-report/", "How to Read a Water Test Report", "Interpret sample context, units, qualifiers and follow-up needs."],
  ["/guides/filter-softener-ro-uv-comparison/", "Sediment Filter vs Carbon Filter vs Softener vs RO vs UV", "Compare what each technology can and cannot do."],
  ["/guides/build-water-treatment-train/", "How to Build a Water Treatment Train Without Over-Treating", "Sequence treatment from evidence, flow and maintenance constraints."]
];
const treatmentReferenceLinks = [
  ["/reference/water-quality-glossary/", "Water Quality Parameter Glossary", "Understand common laboratory and field parameters without treating one value as a verdict."],
  ["/reference/water-treatment-comparison-matrix/", "Water Treatment Technology Comparison Matrix", "Compare purpose, pressure, waste, power and maintenance at a glance."]
];
toolLinks.push(...treatmentToolLinks);
guideLinks.push(...treatmentGuideLinks);
referenceLinks.push(...treatmentReferenceLinks);

const greywaterToolLinks = [
  ["/tools/greywater-supply-calculator/", "Greywater Supply Calculator", "Estimate measured shower, bath, laundry and bathroom-basin water available for reuse."],
  ["/tools/greywater-irrigation-demand-planner/", "Greywater Irrigation Demand Planner", "Compare reusable supply with ET, rainfall, plant and efficiency-based landscape demand."],
  ["/tools/laundry-to-landscape-zone-planner/", "Laundry-to-Landscape Zone Planner", "Distribute one laundry event across a practical whole-outlet range."],
  ["/tools/greywater-surge-basin-checker/", "Greywater Surge & Basin Checker", "Screen delivered event volume against entered void capacity and infiltration."],
  ["/tools/greywater-reuse-savings-calculator/", "Greywater Reuse Savings Calculator", "Estimate annual water and sewer savings and simple payback from local tariffs."]
];
const greywaterGuideLinks = [
  ["/guides/plan-home-greywater-reuse-system/", "How to Plan a Home Greywater Reuse System", "Move from allowed sources and measured volume to demand, distribution, diversion and maintenance."],
  ["/guides/troubleshoot-greywater-irrigation/", "How to Troubleshoot Greywater Irrigation", "Investigate runoff, ponding, odor, weak outlets and plant stress without unsafe exposure."]
];
const greywaterReferenceLinks = [
  ["/reference/greywater-source-use-screening/", "Greywater Source & Use Screening Reference", "Screen source characteristics, end uses and questions that require local approval."]
];
toolLinks.push(...greywaterToolLinks);
guideLinks.push(...greywaterGuideLinks);
referenceLinks.push(...greywaterReferenceLinks);

const vehicleWashToolLinks = [
  ["/tools/vehicle-wash-water-use-audit-calculator/", "Vehicle Wash Water Use Audit Calculator", "Turn meter readings and vehicle counts into fresh-water use per vehicle and annual demand."],
  ["/tools/wash-water-reclaim-balance-planner/", "Wash Water Reclaim Balance Planner", "Balance fresh, reclaimed, spot-free and loss streams for each vehicle and operating day."],
  ["/tools/reclaim-buffer-tank-simulator/", "Reclaim Buffer Tank Simulator", "Simulate a peak wash window against reclaim recovery, starting storage and reserve."],
  ["/tools/spot-free-rinse-ro-production-planner/", "Spot-Free Rinse RO Production Planner", "Match spot-free rinse demand to RO production, storage and reclaimable reject water."],
  ["/tools/vehicle-wash-reclaim-savings-calculator/", "Vehicle Wash Reclaim Savings Calculator", "Estimate water, sewer and operating-cost savings with transparent simple payback."]
];
const vehicleWashGuideLinks = [
  ["/guides/meter-vehicle-wash-water-use/", "How to Meter Vehicle Wash Water Use", "Build a defensible per-vehicle baseline from comparable meter and throughput records."],
  ["/guides/plan-vehicle-wash-water-reclaim-retrofit/", "How to Plan a Vehicle Wash Water Reclaim Retrofit", "Move from baseline and stream mapping to buffer, spot-free production, economics and monitoring."]
];
const vehicleWashReferenceLinks = [
  ["/reference/vehicle-wash-water-stream-map/", "Vehicle Wash Water Stream Map", "Separate fresh, reclaimed, spot-free, reject, carryout and sewer streams before sizing."]
];
toolLinks.push(...vehicleWashToolLinks);
guideLinks.push(...vehicleWashGuideLinks);
referenceLinks.push(...vehicleWashReferenceLinks);

const metalToolLinks = [
  ["/tools/metal-finishing-rinse-water-audit-calculator/", "Metal Finishing Rinse Water Audit Calculator", "Calculate water per production load from a matched meter interval."],
  ["/tools/plating-drag-out-loss-estimator/", "Plating Drag-Out Loss Estimator", "Turn measured retained solution into hourly mass and value loss."],
  ["/tools/countercurrent-rinse-flow-planner/", "Countercurrent Rinse Flow Planner", "Compare ideal one-stage and multistage rinse-flow requirements."],
  ["/tools/rinse-conductivity-log-analyzer/", "Rinse Conductivity Log Analyzer", "Analyze local flow, conductivity and production log rows."],
  ["/tools/rinse-water-savings-payback-comparator/", "Rinse Water Savings & Payback Comparator", "Compare annual water, treatment cost and simple payback."]
];
const metalGuideLinks = [["/guides/reduce-metal-finishing-rinse-water/", "How to Reduce Metal Finishing Rinse Water", "Measure the baseline, reduce drag-out, stage rinses and verify control."]];
const metalReferenceLinks = [["/reference/metal-finishing-rinse-control-methods/", "Metal Finishing Rinse Control Methods", "Compare operational water-saving methods and the evidence each needs."]];
toolLinks.push(...metalToolLinks);
guideLinks.push(...metalGuideLinks);
referenceLinks.push(...metalReferenceLinks);

const monitoringWellToolLinks = [
  ["/tools/monitoring-well-purge-volume-calculator/", "Monitoring Well Purge Volume & Time Calculator", "Calculate standing well volume, an entered purge target, pumping time and whole containers."],
  ["/tools/low-flow-sampling-setup-checker/", "Low-Flow Sampling Setup Checker", "Check screen, intake, water-level, drawdown and flow geometry against entered limits."],
  ["/tools/low-flow-equipment-volume-reading-interval-planner/", "Low-Flow Equipment Volume & Reading Interval Planner", "Calculate tubing and flow-cell displacement before each field reading."],
  ["/tools/groundwater-stabilization-log-analyzer/", "Groundwater Stabilization Log Analyzer", "Analyze a local field log against user-entered stabilization criteria."]
];
const monitoringWellGuideLinks = [["/guides/plan-monitoring-well-purging-low-flow-sampling/", "How to Plan Monitoring-Well Purging & Low-Flow Sampling", "Move from well construction and water levels to equipment setup, field logs and documented handoff."]];
const monitoringWellReferenceLinks = [["/reference/groundwater-low-flow-field-parameters/", "Groundwater Low-Flow Field Parameters", "Compare field parameters, calculation methods and evidence boundaries without universal limits."]];
toolLinks.push(...monitoringWellToolLinks);
guideLinks.push(...monitoringWellGuideLinks);
referenceLinks.push(...monitoringWellReferenceLinks);

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function cardGrid(items, label = "Open") {
  return `<div class="grid three">${items.map(([href, title, text], index) => `<article class="bench-card" data-step="${String(index + 1).padStart(2, "0")}"><h3>${title}</h3><p>${text}</p><a class="card-link" href="${href}">${label} →</a></article>`).join("")}</div>`;
}

function toolType(title) {
  if (title.includes("Matcher")) return "Comparator";
  return ["Calculator", "Planner", "Checker", "Comparator", "Estimator", "Troubleshooter", "Analyzer", "Simulator", "Selector"].find((type) => title.includes(type)) || "Tool";
}

function toolFinder() {
  const groups = [
    ["pumps", "Pumps, pressure & pipe flow", pumpToolLinks],
    ["wells", "Wells, storage & rainwater", phase2ToolLinks],
    ["irrigation", "Irrigation & sprinklers", irrigationToolLinks],
    ["treatment", "Water treatment & quality", treatmentToolLinks],
    ["greywater", "Greywater reuse", greywaterToolLinks],
    ["vehicle-wash", "Vehicle wash water reclaim", vehicleWashToolLinks],
    ["metal-finishing", "Metal finishing rinse water", metalToolLinks],
    ["monitoring-well", "Monitoring well sampling", monitoringWellToolLinks]
  ];
  let step = 0;
  const cards = groups.flatMap(([system, systemLabel, items]) => items.map(([href, title, text]) => {
    step += 1;
    const type = toolType(title);
    return `<article class="bench-card" data-step="${String(step).padStart(2, "0")}" data-tool-card data-system="${system}" data-type="${type.toLowerCase()}" data-search="${esc(`${title} ${text} ${systemLabel} ${type}`.toLowerCase())}"><div class="tool-card-meta"><span class="tag">${systemLabel}</span><span class="tag">${type}</span></div><h3>${title}</h3><p>${text}</p><a class="card-link" href="${href}">Use tool →</a></article>`;
  })).join("");
  const types = ["Calculator", "Planner", "Checker", "Comparator", "Estimator", "Troubleshooter", "Analyzer", "Simulator", "Selector"];
  return `<section class="section tool-finder" data-tool-finder aria-labelledby="tool-finder-heading"><div class="section-heading"><p class="eyebrow">Find the next calculation</p><h2 id="tool-finder-heading">Filter ${toolLinks.length} working tools</h2><p class="lede">Search by task, narrow to one water-system workflow, or choose the kind of decision you need to make.</p></div><form class="tool-finder-controls" data-tool-filters><div><label for="toolSearch">Search tools</label><input id="toolSearch" type="search" autocomplete="off" placeholder="Search pressure, rinse, cost..." data-tool-search></div><div><label for="toolSystem">System</label><select id="toolSystem" data-tool-system><option value="all">All systems</option>${groups.map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}</select></div><div><label for="toolType">Tool type</label><select id="toolType" data-tool-type><option value="all">All tool types</option>${types.map((type) => `<option value="${type.toLowerCase()}">${type}</option>`).join("")}</select></div><button class="button secondary small" type="reset">Clear filters</button><p class="tool-finder-count" data-tool-count role="status" aria-live="polite">Showing all ${toolLinks.length} tools.</p></form><div class="grid three" data-tool-results>${cards}</div><p class="notice" data-tool-empty hidden><strong>No matching tools.</strong> Clear a filter or try a broader task such as flow, rinse, storage or treatment.</p></section>`;
}

function breadcrumbs(items) {
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${items.map(([name, href], index) => `<li>${index === items.length - 1 ? `<span aria-current="page">${name}</span>` : `<a href="${href}">${name}</a>`}</li>`).join("")}</ol></nav>`;
}

function related(items) {
  return `<section aria-labelledby="related-heading"><h2 id="related-heading">Continue the workflow</h2><div class="related-grid">${items.map(([href, title]) => `<a href="${href}">${title}<br><span class="meta-line">Open next →</span></a>`).join("")}</div></section>`;
}

function sourceList(items) {
  return `<ul class="source-list">${items.map(([name, url]) => `<li><a href="${url}" rel="noopener noreferrer">${name}</a></li>`).join("")}</ul>`;
}

function schemaFor(page) {
  const url = `${domain}${page.path}`;
  const crumbs = page.crumbs.map(([name, href], index) => ({
    "@type": "ListItem",
    position: index + 1,
    name,
    item: `${domain}${href}`
  }));
  const primary = page.schemaType === "WebApplication" ? {
    "@type": "WebApplication",
    "@id": `${url}#application`,
    name: page.h1,
    description: page.description,
    url,
    applicationCategory: "EngineeringApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript"
  } : {
    "@type": page.schemaType,
    "@id": `${url}#page`,
    headline: page.h1,
    name: page.h1,
    description: page.description,
    url,
    dateModified: page.dateModified || "2026-07-29",
    inLanguage: "en"
  };
  const graph = [
    primary,
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: crumbs
    }
  ];
  if (page.path === "/") {
    graph.unshift(
      {
        "@type": "WebSite",
        "@id": `${domain}/#website`,
        name: "Water Systems Bench",
        url: `${domain}/`,
        description: page.description,
        inLanguage: "en"
      },
      {
        "@type": "Organization",
        "@id": `${domain}/#organization`,
        name: "Water Systems Bench",
        url: `${domain}/`,
        email: "canghun13@naver.com",
        logo: `${domain}/favicon.svg`
      }
    );
  }
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
}

function pageTemplate(page) {
  const url = `${domain}${page.path}`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.description)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Water Systems Bench">
  <meta property="og:title" content="${esc(page.title)}">
  <meta property="og:description" content="${esc(page.description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${domain}/assets/og.png">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="stylesheet" href="/assets/css/main.css">
  <link rel="stylesheet" href="/assets/css/content.css">
${[
  page.toolScript ? '  <link rel="stylesheet" href="/assets/css/calculator.css">' : "",
  page.pageStyle ? `  <link rel="stylesheet" href="${page.pageStyle}">` : ""
].filter(Boolean).join("\n")}
  ${ga4}
  <script type="application/ld+json">${schemaFor(page)}</script>
  <script type="module" src="/assets/js/partials.js"></script>
  <script type="module" src="/assets/js/main.js"></script>
${[
  page.toolScript ? `  <script type="module" src="${page.toolScript}"></script>` : "",
  page.pageScript ? `  <script type="module" src="${page.pageScript}"></script>` : ""
].filter(Boolean).join("\n")}
</head>
<body>
  <div data-header-slot></div>
  <main id="main-content">
    <div class="page-shell">
      ${breadcrumbs(page.crumbs)}
      ${page.body}
    </div>
  </main>
  <div data-footer-slot></div>
${page.path === "/" ? `  <div class="page-shell" style="padding:30px 0;text-align:center;">
    <a href="https://kittylaunch.com/p/water-systems-bench" target="_blank" rel="noopener" style="display:inline-block;margin:0 2px;">
      <img src="https://kittylaunch.com/api/public/badges/launch_badge.svg?theme=light&name=Water%20Systems%20Bench" alt="Water Systems Bench on KittyLaunch" data-kittylaunch-badge="1" style="margin:0 2px;height:36px;" />
    </a>
    <a href="https://sellwithboost.com" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin:0 2px;">
    \t<img src="https://sellwithboost.com/badge/listing.svg" alt="Listed on Sell With boost" style="height: 36px; width: auto;" />
    </a>
    <a href="https://twelve.tools" target="_blank" style="display:inline-block;margin:0 2px;">
      <img src="https://twelve.tools/badge0-white.svg" alt="Featured on Twelve Tools" height="36px">
    </a>
    <a href="https://findly.tools/watersystemsbench?utm_source=watersystemsbench" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin:0 2px;">
      <img src="https://findly.tools/badges/findly-tools-badge-light.svg" alt="Featured on Findly.tools" height="36px" />
    </a>
    <a href="https://boostdomainrating.com/item/watersystemsbench.com?utm_source=badge" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin:0 2px;">
    \t<img src="https://boostdomainrating.com/api/badge/watersystemsbench.com" alt="Water Systems Bench - Domain Rating" style="height: 36px; width: auto;"/>
    </a>
  </div>
` : ""}</body>
</html>
`;
}

function hero(eyebrow, h1, lede, aside = "", actions = "") {
  return `<header class="hero compact"><div><p class="eyebrow">${eyebrow}</p><h1>${h1}</h1><p class="lede">${lede}</p>${actions}</div><p class="hero-note">${aside || "Use measured inputs where possible. Keep estimated values visible, and verify final decisions against manufacturer data and project requirements."}</p></header>`;
}

function resultPanel() {
  return `<section class="result-panel" aria-label="Result">
    <div class="panel-heading"><h2>Operating report</h2><span class="panel-code">RESULT / LIVE</span></div>
    <div class="result-empty"><p>Enter the known values, then calculate to build a result summary.</p></div>
    <div class="result-report" aria-live="polite" hidden>
      <div class="primary-reading"><span class="reading-label"></span><span class="reading-value"></span></div>
      <div class="result-block"><h3>Supporting calculations</h3><ul data-supporting></ul></div>
      <div class="result-block"><h3>Interpretation</h3><p data-interpretation></p></div>
      <p class="result-warning" data-warning></p>
      <div class="result-actions"><button class="button small secondary" type="button" data-result-action data-copy-result disabled>Copy result</button><button class="button small secondary" type="button" data-result-action data-print-result disabled>Print result</button></div>
    </div>
  </section>`;
}

const unitSelect = `<div class="field full"><label for="unitSystem">Unit system</label><select id="unitSystem" name="unitSystem" data-unit-system><option value="SI">SI — metric</option><option value="US">US customary</option></select></div>`;
const input = (name, label, value, kind = "", options = {}) => `<div class="field ${options.full ? "full" : ""}"><label for="${name}">${label}${kind ? ` (<span data-unit-label="${kind}"></span>)` : ""}</label><input id="${name}" name="${name}" data-label="${esc(label)}" type="number" value="${value}" ${kind ? `data-unit-kind="${kind}"` : ""} ${options.step ? `step="${options.step}"` : 'step="any"'} ${options.optional ? "" : "required"}>${options.hint ? `<span class="hint">${options.hint}</span>` : ""}</div>`;
const select = (name, label, options, extra = "") => `<div class="field ${extra}"><label for="${name}">${label}</label><select id="${name}" name="${name}">${options.map(([value, text]) => `<option value="${value}">${text}</option>`).join("")}</select></div>`;
const actions = (verb = "Calculate") => `<p class="form-error" data-form-error role="alert"></p><div class="button-row"><button class="button" type="submit">${verb}</button><button class="button secondary" type="reset">Reset</button></div>`;
const toolLayout = (formHtml) => `<div class="tool-layout"><section class="instrument-panel"><div class="panel-heading"><h2>Bench inputs</h2><span class="panel-code">INPUT / SET</span></div>${formHtml}</section>${resultPanel()}</div>`;

const toolData = [
  {
    path: "/tools/total-dynamic-head-calculator/", slug: "total-dynamic-head-calculator", script: "/assets/js/tools/total-dynamic-head.js", type: "Calculator",
    h1: "Total Dynamic Head Calculator", description: "Calculate total dynamic head from elevation, delivery pressure, friction and inlet pressure for a preliminary water-pump duty point.",
    purpose: "Build a transparent head balance before reading a pump curve. The calculation separates elevation, required delivery pressure, pipe loss, fittings or equipment loss, and available inlet pressure.",
    when: "Use it after required flow is known and after pipe friction has been measured or calculated. A flooded suction can contribute positive inlet pressure; a suction lift should be represented through the elevation and inlet conditions without mixing gauge and absolute pressure.",
    method: `<div class="formula">TDH = elevation head + delivery pressure head + friction + minor/equipment losses − available inlet pressure head</div><p>Pressure is converted to head using <code>H = p/(ρg)</code> with water near 20 °C. This page treats delivery and inlet entries as gauge pressure; absolute pressure belongs in the NPSH calculation.</p>`,
    example: "A system lifting water 18 m, delivering at 250 kPa, losing 6.5 m in pipework and 2 m through fittings/equipment, with 35 kPa available at the inlet, produces roughly 48.4 m TDH.",
    assumptions: "Steady incompressible water flow; pressure readings refer to comparable gauge locations; listed losses represent the duty flow.",
    limitations: "No transient, control-valve, acceleration, open-channel, non-water or system-curve calculation is included.",
    warning: "Confirm the duty point across the complete operating range. Do not select a pump from TDH alone.",
    sources: [sources.hiCurve, sources.doe, sources.usgs],
    related: [[toolLinks[1][0], toolLinks[1][1]], [toolLinks[5][0], toolLinks[5][1]], [guideLinks[0][0], guideLinks[0][1]], [referenceLinks[1][0], referenceLinks[1][1]], ["/systems/pumps-pressure-pipe/", "Parent pump system workflow"]],
    form: `<form data-tool-form="tdh">${unitSelect}<div class="field-grid">${select("sourceCondition", "Suction condition", [["open", "Open source / suction lift"], ["flooded", "Flooded suction"], ["pressurized", "Pressurized inlet"]], "full")}${input("elevation", "Static elevation difference", "18", "head")}${input("deliveryPressure", "Required delivery gauge pressure", "250", "pressure")}${input("inletPressure", "Available inlet gauge pressure", "35", "pressure")}${input("friction", "Pipe friction loss", "6.5", "head")}${input("minor", "Minor loss allowance", "1.2", "head")}${input("equipment", "Additional equipment loss", "0.8", "head")}</div>${actions()}</form>`
  },
  {
    path: "/tools/pipe-friction-loss-calculator/", slug: "pipe-friction-loss-calculator", script: "/assets/js/tools/pipe-friction-loss.js", type: "Calculator",
    h1: "Pipe Friction Loss Calculator", description: "Estimate water velocity, Reynolds number and pipe pressure loss with Hazen–Williams or Darcy–Weisbach in SI or US units.",
    purpose: "Estimate straight-pipe and optional minor loss at a known flow, actual internal diameter and length. The two modes make the method and its limits visible.",
    when: "Use Hazen–Williams for a conventional empirical water estimate with an appropriate C value. Use Darcy–Weisbach when Reynolds number, water temperature and roughness need to be represented explicitly.",
    method: `<div class="formula">Hazen–Williams: h<sub>f</sub> = 10.67 L Q<sup>1.852</sup> / (C<sup>1.852</sup> d<sup>4.87</sup>)</div><div class="formula">Darcy–Weisbach: h<sub>f</sub> = f (L/d) V²/(2g)</div><p>Laminar flow uses <code>f = 64/Re</code>. Turbulent flow uses the explicit Swamee–Jain approximation. Transitional results are identified rather than presented as certain.</p>`,
    example: "For 120 L/min through 50 mm ID pipe over 80 m, Hazen–Williams with C = 140 estimates about 1.97 m of major head loss. A combined minor-loss K of 2 adds about 0.11 m. Actual ID and fittings can materially change the result.",
    assumptions: "Water only; steady full-pipe flow; a circular pipe; uniform internal diameter; roughness and C values selected by the user.",
    limitations: "Hazen–Williams is empirical and does not model viscosity. The explicit Darcy approximation is not a substitute for detailed transient or network analysis.",
    warning: "Internal diameter—not nominal size—drives velocity and loss. Validate pipe data and fitting coefficients.",
    sources: [sources.usace, sources.epa, sources.nist],
    related: [[toolLinks[0][0], toolLinks[0][1]], [toolLinks[2][0], toolLinks[2][1]], [guideLinks[0][0], guideLinks[0][1]], [referenceLinks[2][0], referenceLinks[2][1]], [referenceLinks[3][0], referenceLinks[3][1]]],
    form: `<form data-tool-form="friction">${unitSelect}<div class="field-grid">${select("method", "Calculation method", [["hazen", "Hazen–Williams"], ["darcy", "Darcy–Weisbach"]], "full")}${input("flow", "Flow", "120", "flow")}${input("diameter", "Internal diameter", "50", "diameter")}${input("length", "Pipe length", "80", "length")}${input("minorK", "Combined minor-loss K", "2", "", {hint: "Enter 0 when minor losses are excluded."})}<div class="field full" data-hazen-fields><label for="cValue">Hazen–Williams C value</label><input id="cValue" name="cValue" data-label="C value" type="number" value="140" min="50" max="160"></div><div class="field-grid field full" data-darcy-fields hidden>${input("roughness", "Absolute roughness", "0.0015", "diameter", {hint: "Enter in the displayed diameter unit."})}${input("temperature", "Water temperature", "20", "temperature")}</div></div>${actions()}</form>`
  },
  {
    path: "/tools/water-pipe-size-velocity-checker/", slug: "water-pipe-size-velocity-checker", script: "/assets/js/tools/pipe-velocity.js", type: "Checker",
    h1: "Water Pipe Size & Velocity Checker", description: "Check water velocity from flow and actual pipe diameter, with an optional preliminary Hazen–Williams loss estimate.",
    purpose: "Screen whether a candidate internal diameter creates unusually low or high velocity at the entered flow. Optional length and C-value inputs add a preliminary friction estimate.",
    when: "Use it before selecting a pipe size, when comparing real pipe schedules, or when checking whether a pressure-loss result is driven by velocity.",
    method: `<div class="formula">V = Q/A, where A = πd²/4</div><p>The tool reports neutral screening language rather than treating a single velocity range as a universal legal limit.</p>`,
    example: "At 120 L/min through a 50 mm internal diameter, velocity is about 1.02 m/s. The same flow through a substantially smaller ID increases both velocity and friction rapidly.",
    assumptions: "Steady, full circular pipe flow; the entered diameter is the actual internal diameter.",
    limitations: "The status is a screening cue. It does not consider water hammer, noise criteria, solids transport, erosion, code or manufacturer limits.",
    warning: "Confirm project-specific velocity and surge criteria; do not treat this page as an approved pipe-size selector.",
    sources: [sources.usace, sources.westlake, sources.epa],
    related: [[toolLinks[1][0], toolLinks[1][1]], [toolLinks[0][0], toolLinks[0][1]], [guideLinks[0][0], guideLinks[0][1]], [referenceLinks[3][0], referenceLinks[3][1]], ["/systems/pumps-pressure-pipe/", "Parent pump system workflow"]],
    form: `<form data-tool-form="velocity">${unitSelect}<div class="field-grid">${input("flow", "Flow", "120", "flow")}${input("diameter", "Actual internal diameter", "50", "diameter")}${input("length", "Optional pipe length", "80", "length", {optional: true})}${input("cValue", "Optional Hazen–Williams C", "140")}</div>${actions("Check velocity")}</form>`
  },
  {
    path: "/tools/pump-power-efficiency-calculator/", slug: "pump-power-efficiency-calculator", script: "/assets/js/tools/pump-power.js", type: "Calculator",
    h1: "Pump Power & Efficiency Calculator", description: "Estimate hydraulic power, pump shaft power and electrical input from water flow, head and efficiencies.",
    purpose: "Separate useful hydraulic power from pump-shaft and motor input power so efficiency assumptions are visible.",
    when: "Use it after flow and total head are defined and when a pump or scenario efficiency can be read from a manufacturer curve or measured.",
    method: `<div class="formula">P<sub>hydraulic</sub> = ρgQH<br>P<sub>shaft</sub> = P<sub>hydraulic</sub>/η<sub>pump</sub><br>P<sub>electrical</sub> = P<sub>shaft</sub>/η<sub>motor</sub></div>`,
    example: "At 120 L/min and 50 m head with 70% pump efficiency and 90% motor efficiency, estimated electrical input is about 1.56 kW.",
    assumptions: "Steady water flow; entered efficiencies apply at the duty point; direct drive with no additional drive loss.",
    limitations: "No motor part-load curve, service factor, starting current, drive loss or variable-speed map is included.",
    warning: "Do not size the motor from this single number. Check the complete manufacturer power curve and applicable electrical requirements.",
    sources: [sources.doeManual, sources.doe, sources.hiFaq],
    related: [[toolLinks[0][0], toolLinks[0][1]], [toolLinks[5][0], toolLinks[5][1]], [toolLinks[7][0], toolLinks[7][1]], [guideLinks[0][0], guideLinks[0][1]], [referenceLinks[4][0], referenceLinks[4][1]]],
    form: `<form data-tool-form="power">${unitSelect}<div class="field-grid">${input("flow", "Flow", "120", "flow")}${input("head", "Total head", "50", "head")}${input("temperature", "Water temperature", "20", "temperature")}${input("pumpEfficiency", "Pump efficiency (%)", "70")}${input("motorEfficiency", "Motor efficiency (%)", "90")}</div>${actions()}</form>`
  },
  {
    path: "/tools/booster-pump-duty-point-estimator/", slug: "booster-pump-duty-point-estimator", script: "/assets/js/tools/booster-duty.js", type: "Estimator",
    h1: "Booster Pump Duty Point Estimator", description: "Estimate preliminary booster flow, pressure rise and head from inlet pressure, outlet target, elevation and losses.",
    purpose: "Turn a measured or credible minimum inlet pressure into a preliminary booster duty point without hiding the contributions from elevation and losses.",
    when: "Use it when downstream pressure is insufficient under the required flow. Test minimum and maximum inlet conditions separately.",
    method: `<div class="formula">Required boost = outlet target + elevation head + pipe/equipment loss − inlet pressure</div><p>A user-entered allowance is applied only to a positive boost requirement. Negative results are reported as no additional boost for the entered condition.</p>`,
    example: "With 220 kPa inlet, a 300 kPa outlet target, 12 m elevation, 5 m combined losses and 120 L/min duty flow, the required boost is about 247 kPa before any allowance.",
    assumptions: "Gauge pressures are comparable; losses apply at duty flow; inlet pressure is available while that flow is being drawn.",
    limitations: "No control strategy, tank sizing, parallel-pump staging, transient or minimum-flow analysis is included.",
    warning: "Check the full inlet-pressure envelope. A booster selected from one static reading can be oversized or unable to meet dynamic demand.",
    sources: [sources.hiCurve, sources.doe, sources.hiFaq],
    related: [[toolLinks[0][0], toolLinks[0][1]], [toolLinks[8][0], toolLinks[8][1]], [guideLinks[2][0], guideLinks[2][1]], [referenceLinks[1][0], referenceLinks[1][1]], ["/systems/pumps-pressure-pipe/", "Parent pump system workflow"]],
    form: `<form data-tool-form="booster">${unitSelect}<div class="field-grid">${input("inletPressure", "Available inlet gauge pressure", "220", "pressure")}${input("outletPressure", "Required outlet gauge pressure", "300", "pressure")}${input("elevation", "Elevation increase", "12", "head")}${input("pipeLoss", "Pipe loss", "4", "head")}${input("equipmentLoss", "Equipment loss", "1", "head")}${input("flow", "Required flow", "120", "flow")}${input("safety", "Safety allowance (%)", "5")}</div>${actions("Estimate duty")}</form>`
  },
  {
    path: "/tools/pump-curve-duty-point-comparator/", slug: "pump-curve-duty-point-comparator", script: "/assets/js/tools/pump-curve.js", type: "Comparator",
    h1: "Pump Curve Duty Point Comparator", description: "Compare up to three user-entered pump curves at a duty flow with transparent linear interpolation and no extrapolation.",
    purpose: "Screen manufacturer curve points against one required flow and head. The tool sorts points and linearly interpolates only within the entered range.",
    when: "Use it after flow and TDH are known and while comparing current manufacturer curves for equivalent conditions.",
    method: `<div class="formula">H(Q) = H₁ + (H₂ − H₁)(Q − Q₁)/(Q₂ − Q₁)</div><p>Interpolation uses the two entered points bracketing duty flow. The tool does not extrapolate, fit a quadratic curve or invent a manufacturer performance map.</p>`,
    example: "For points 0,60; 100,50; 200,30, a duty flow of 120 gives 46 head units by linear interpolation. Compare that with the required head in the same units.",
    assumptions: "All points share one flow/head unit system and represent the exact pump configuration being compared.",
    limitations: "No system curve, affinity-law adjustment, efficiency island, power limit, NPSH curve or operating-region boundary is generated.",
    warning: "Verify the result on the current certified or published manufacturer curve, including impeller, speed and allowable operating region.",
    sources: [sources.hiFaq, sources.hiCurve, sources.doe],
    related: [[toolLinks[0][0], toolLinks[0][1]], [toolLinks[3][0], toolLinks[3][1]], [toolLinks[6][0], toolLinks[6][1]], [guideLinks[1][0], guideLinks[1][1]], [referenceLinks[4][0], referenceLinks[4][1]]],
    form: `<form data-tool-form="curve">${unitSelect}<div class="field-grid">${input("dutyFlow", "Required duty flow", "120", "flow")}${input("dutyHead", "Required duty head", "48", "head")}</div>${[1,2,3].map((n) => `<fieldset class="scenario-group"><legend>Candidate ${n}</legend><div class="field-grid"><div class="field"><label for="name${n}">Pump name</label><input id="name${n}" name="name${n}" type="text" value="${n === 1 ? `Pump ${n}` : ""}"></div><div class="field full"><label for="points${n}">Flow,head points</label><textarea id="points${n}" name="points${n}">${n === 1 ? "0,65; 100,53; 200,31" : ""}</textarea><span class="hint">At least three pairs separated by semicolons or new lines.</span></div></div></fieldset>`).join("")}${actions("Compare curves")}</form>`
  },
  {
    path: "/tools/npsh-available-calculator/", slug: "npsh-available-calculator", script: "/assets/js/tools/npsh.js", type: "Calculator",
    h1: "NPSH Available Calculator", description: "Estimate NPSH available from absolute surface pressure, suction head, losses and water vapor pressure by temperature.",
    purpose: "Estimate the system-side suction head above water vapor pressure and keep absolute pressure, static suction condition and temperature visible.",
    when: "Use it after suction geometry and losses are known. Compare NPSHA with manufacturer NPSHR and an application-specific margin.",
    method: `<div class="formula">NPSHA = absolute surface pressure head + static suction head − suction friction − additional inlet loss − vapor pressure head</div><p>Positive static suction head means the liquid surface is above the pump; a suction lift is entered as negative. Water properties are limited to 0–100 °C.</p>`,
    example: "At 101.325 kPa absolute, 2 m flooded suction, 1.5 m friction and 20 °C water, NPSHA is about 10.6 m before any additional loss.",
    assumptions: "Water only; steady inlet conditions; pressure is absolute; pump reference elevation is used consistently.",
    limitations: "No acceleration head, dissolved gas, non-water property or transient suction analysis is included.",
    warning: "NPSHA merely exceeding published NPSHR does not guarantee acceptable reliability. Confirm manufacturer and Hydraulic Institute margin guidance.",
    sources: [sources.hiNpsh, sources.nist, sources.hiFaq],
    related: [[toolLinks[5][0], toolLinks[5][1]], [toolLinks[0][0], toolLinks[0][1]], [guideLinks[1][0], guideLinks[1][1]], [referenceLinks[4][0], referenceLinks[4][1]], ["/systems/pumps-pressure-pipe/", "Parent pump system workflow"]],
    form: `<form data-tool-form="npsh">${unitSelect}<div class="field-grid">${input("absolutePressure", "Absolute pressure at liquid surface", "101.325", "pressure", {hint: "Absolute—not gauge—pressure."})}${input("staticSuction", "Static suction head", "2", "head", {hint: "Use a negative value for suction lift."})}${input("friction", "Suction pipe friction loss", "1.5", "head")}${input("additional", "Additional inlet losses", "0", "head")}${input("temperature", "Water temperature", "20", "temperature")}${input("npshr", "Optional manufacturer NPSHR", "4", "head", {optional: true})}</div>${actions()}</form>`
  },
  {
    path: "/tools/pump-operating-cost-comparator/", slug: "pump-operating-cost-comparator", script: "/assets/js/tools/operating-cost.js", type: "Comparator",
    h1: "Pump Operating Cost Comparator", description: "Compare annual energy, electricity and optional maintenance cost for up to three pump operating scenarios.",
    purpose: "Make the schedule, electrical input and tariff assumptions behind a simple one-year and five-year operating-cost comparison explicit.",
    when: "Use it with measured or credible electrical input at the duty condition. For flow/head scenarios, first estimate electrical input with the power calculator.",
    method: `<div class="formula">Annual energy = input kW × hours/day × days/year<br>Annual total = annual kWh × tariff + annual maintenance</div>`,
    example: "A 4 kW scenario operating 8 hours/day for 300 days uses 9,600 kWh/year. At 0.15 currency units/kWh, electricity is 1,440 currency units/year.",
    assumptions: "Entered power and schedule are representative; tariff is a single user-entered energy rate; maintenance is annual.",
    limitations: "No demand charge, tariff tier, inflation, discount rate, purchase cost, downtime or replacement timing is included.",
    warning: "A lower energy estimate does not by itself prove acceptable hydraulic performance or lifecycle cost.",
    sources: [sources.doe, sources.doeManual, sources.hiCurve],
    related: [[toolLinks[3][0], toolLinks[3][1]], [toolLinks[5][0], toolLinks[5][1]], [guideLinks[1][0], guideLinks[1][1]], [referenceLinks[4][0], referenceLinks[4][1]], ["/systems/pumps-pressure-pipe/", "Parent pump system workflow"]],
    form: `<form data-tool-form="cost"><div class="field"><label for="currency">Currency label</label><input id="currency" name="currency" type="text" value="currency units"></div>${[1,2,3].map((n) => `<fieldset class="scenario-group"><legend>Scenario ${n}</legend><div class="field-grid"><div class="field"><label for="name${n}">Scenario name</label><input id="name${n}" name="name${n}" type="text" value="${n === 1 ? "Pump A" : ""}"></div>${input(`power${n}`, "Electrical input power (kW)", n === 1 ? "4" : "", "", {optional: n > 1})}${input(`hours${n}`, "Operating hours/day", n === 1 ? "8" : "", "", {optional: n > 1})}${input(`days${n}`, "Operating days/year", n === 1 ? "300" : "", "", {optional: n > 1})}${input(`tariff${n}`, "Tariff per kWh", n === 1 ? "0.15" : "", "", {optional: n > 1})}${input(`maintenance${n}`, "Annual maintenance", n === 1 ? "0" : "", "", {optional: n > 1})}</div></fieldset>`).join("")}${actions("Compare costs")}</form>`
  },
  {
    path: "/tools/low-water-pressure-troubleshooter/", slug: "low-water-pressure-troubleshooter", script: "/assets/js/tools/low-pressure.js", type: "Troubleshooter",
    h1: "Low Water Pressure Troubleshooter", description: "Prioritize safe low-pressure measurements and likely cause groups without presenting a rules-based screen as a confirmed diagnosis.",
    purpose: "Separate whole-system and local symptoms, static and dynamic behavior, restrictions, source changes, pump systems and leak indicators.",
    when: "Use it before buying a booster pump. Record actual static pressure, dynamic pressure and flow where safe and permitted.",
    method: `<p>The rules prioritize cause groups from scope, pressure drop, equipment and change history. They do not assign certainty or replace on-site inspection.</p>`,
    example: "If every outlet is affected, dynamic pressure falls sharply, and a filter is present, compare safe upstream/downstream pressure under flow before assuming the supply needs a booster.",
    assumptions: "Answers describe the same event and the user can make only non-invasive observations safely.",
    limitations: "No remote questionnaire can locate a hidden leak, verify a utility condition, test electrical equipment or inspect a pressure vessel.",
    warning: "Do not dismantle gas equipment, electrical controls, pressure vessels, pumps or PRVs. Escalate sudden changes, leaks and safety hazards.",
    sources: [sources.hiCurve, sources.doe, sources.usgs],
    related: [[toolLinks[1][0], toolLinks[1][1]], [toolLinks[4][0], toolLinks[4][1]], [guideLinks[2][0], guideLinks[2][1]], [referenceLinks[1][0], referenceLinks[1][1]], ["/systems/pumps-pressure-pipe/", "Parent pump system workflow"]],
    form: `<form data-tool-form="troubleshooter"><div class="field-grid">${select("scope", "Where is the problem?", [["all", "All outlets or zones"], ["single", "One fixture or zone"]])}${select("dynamicDrop", "Dynamic pressure compared with static", [["unknown", "Not measured"], ["small", "Small change"], ["large", "Large drop under flow"]])}${select("filter", "Filter or softener present?", [["no", "No / unknown"], ["yes", "Yes"]])}${select("prv", "Pressure-reducing valve present?", [["no", "No / unknown"], ["yes", "Yes"]])}${select("pump", "Pump or pressure tank present?", [["no", "No / unknown"], ["yes", "Yes"]])}${select("sudden", "Did the problem start suddenly?", [["no", "No / unknown"], ["yes", "Yes"]])}${select("leak", "Any leak signs?", [["no", "No"], ["yes", "Yes / uncertain"]])}${select("time", "Does it vary by time of day?", [["no", "No / unknown"], ["yes", "Yes"]])}</div>${actions("Analyze symptoms")}</form>`
  }
];

toolData.push(
  {
    path: phase2ToolLinks[0][0], script: "/assets/js/tools/well-pump-sizing.js", type: "Planner", cluster: "Wells, storage & rainwater", h1: "Well & Borehole Pump Sizing Planner",
    description: "Build a preliminary well or borehole pump duty point from required flow, pumping water level, delivery elevation, pressure and losses.",
    purpose: "Turn source level and delivery requirements into one transparent flow-and-head duty point while keeping pump setting depth separate as a submergence check.",
    when: "Use after a representative pumping water level and sustained demand flow are known. Re-run for seasonal low water levels and other operating cases.",
    method: `<div class="formula">TDH = pumping-level lift + discharge elevation + delivery pressure head + pipe and equipment losses</div><p>Pump setting depth is compared with pumping level to report submergence. It is not added to TDH because the energy balance starts at the pumped water surface.</p>`,
    example: "At 45 L/min, a 28 m pumping level, 6 m discharge elevation, 240 kPa delivery pressure and 8 m losses produce about 66.5 m TDH. A pump set at 42 m has 14 m submergence.",
    assumptions: "Depths share the wellhead datum; the pumping level represents the stated flow; gauge delivery pressure and losses apply at that flow.",
    limitations: "No well recovery model, cable sizing, motor cooling, check-valve, sand, water-quality or transient analysis is included.",
    warning: "Confirm sustained yield, seasonal low level, minimum submergence, electrical design and the exact manufacturer curve with qualified well and pump professionals.",
    sources: [sources.usgsHydrology, sources.usgsGlossary, sources.hiCurve],
    related: [[phase2ToolLinks[1][0], phase2ToolLinks[1][1]], [toolLinks[0][0], toolLinks[0][1]], [toolLinks[5][0], toolLinks[5][1]], [phase2GuideLinks[1][0], phase2GuideLinks[1][1]], ["/systems/wells-storage-rainwater/", "Parent wells and rainwater workflow"]],
    form: `<form data-tool-form="well-pump">${unitSelect}<div class="field-grid">${input("demand", "Required flow", "45", "flow")}${input("pumpingLevel", "Pumping water level below wellhead", "28", "head")}${input("pumpSetting", "Pump setting depth below wellhead", "42", "head")}${input("dischargeElevation", "Delivery elevation above wellhead", "6", "head")}${input("deliveryPressure", "Required delivery gauge pressure", "240", "pressure")}${input("friction", "Pipe and fitting loss", "6", "head")}${input("equipment", "Treatment / equipment loss", "2", "head")}</div>${actions("Build duty point")}</form>`
  },
  {
    path: phase2ToolLinks[1][0], script: "/assets/js/tools/well-yield-demand.js", type: "Checker", cluster: "Wells, storage & rainwater", h1: "Well Yield vs Demand Checker",
    description: "Compare sustained well yield with average daily demand, pumping schedule, peak-period demand, reserve and existing storage.",
    purpose: "Separate average daily source capacity from short peak demand so a favorable daily balance is not mistaken for adequate instantaneous supply.",
    when: "Use after a defensible sustained-yield test and a demand schedule are available, before sizing storage or selecting a pump flow.",
    method: `<div class="formula">Daily production = sustained yield × pumping hours × 60</div><div class="formula">Peak storage gap = max(0, peak demand − well supply during the peak)</div>`,
    example: "A 12 L/min well pumped 10 hours can produce 7,200 L/day. A 30 L/min demand for 90 minutes needs 2,700 L while the well contributes 1,080 L, leaving a 1,620 L peak gap before reserve and existing storage.",
    assumptions: "The entered yield is sustainable for the pumping schedule and demand periods can be approximated by the entered peak rate and duration.",
    limitations: "A one-day balance does not model seasonal recharge, well recovery, water quality, pump protection or multiple demand peaks.",
    warning: "Do not treat a short airlift or pump test as permanent safe yield. Sustained withdrawals can lower groundwater levels and affect pump submergence.",
    sources: [sources.usgsHydrology, sources.usgsGlossary, sources.epaEmergency],
    related: [[phase2ToolLinks[0][0], phase2ToolLinks[0][1]], [phase2ToolLinks[4][0], phase2ToolLinks[4][1]], [phase2ReferenceLinks[0][0], phase2ReferenceLinks[0][1]], [phase2GuideLinks[1][0], phase2GuideLinks[1][1]], ["/systems/wells-storage-rainwater/", "Parent wells and rainwater workflow"]],
    form: `<form data-tool-form="well-yield">${unitSelect}<div class="field-grid">${input("wellYield", "Sustained well yield", "12", "flow")}${input("pumpingHours", "Available pumping hours per day", "10")}${input("dailyDemand", "Average daily demand", "4500", "volume")}${input("peakDemand", "Peak demand rate", "30", "flow")}${input("peakMinutes", "Peak duration (minutes)", "90")}${input("existingStorage", "Existing usable storage", "1000", "volume")}${input("reserve", "Reserve allowance (%)", "15")}</div>${actions("Check source and demand")}</form>`
  },
  {
    path: phase2ToolLinks[2][0], script: "/assets/js/tools/pressure-tank-sizing.js", type: "Calculator", cluster: "Wells, storage & rainwater", h1: "Pressure Tank Sizing Calculator",
    description: "Estimate required pressure-tank drawdown and nominal volume from pump flow, minimum run time, precharge, cut-in and cut-out pressure.",
    purpose: "Convert a target minimum pump run time into required drawdown, then estimate the idealized nominal precharged-tank volume at the entered settings.",
    when: "Use for preliminary conventional on/off pump systems. Select the actual tank from manufacturer drawdown tables at the exact pressure switch settings.",
    method: `<div class="formula">Required drawdown = pump flow × minimum run time</div><div class="formula">Drawdown fraction = P₀(abs) × [1/P<sub>in</sub>(abs) − 1/P<sub>out</sub>(abs)]</div><p>Gauge pressures are converted to absolute by adding atmospheric pressure. The tool requires precharge &lt; cut-in &lt; cut-out.</p>`,
    example: "A 40 L/min pump with a 1-minute target needs 40 L drawdown. At 193 kPa precharge and 207/345 kPa cut-in/out, the idealized fraction is about 29.5%, requiring roughly 136 L nominal volume.",
    assumptions: "Ideal-gas behavior, fixed atmospheric pressure and a conventional captive-air tank without thermal or bladder-volume corrections.",
    limitations: "The idealized result does not replace rated manufacturer drawdown, code rules, motor start limits or variable-speed system guidance.",
    warning: "A pressure tank is a sealed pressure vessel. Isolate power and fully release water pressure before checking precharge; follow the tank and pump instructions.",
    sources: [sources.pentairTank, sources.hiFaq],
    related: [[phase2ToolLinks[3][0], phase2ToolLinks[3][1]], [phase2GuideLinks[2][0], phase2GuideLinks[2][1]], [phase2ToolLinks[0][0], phase2ToolLinks[0][1]], [toolLinks[8][0], toolLinks[8][1]], ["/systems/wells-storage-rainwater/", "Parent wells and rainwater workflow"]],
    form: `<form data-tool-form="pressure-tank">${unitSelect}<div class="field-grid">${input("pumpFlow", "Pump flow at cut-out", "40", "flow")}${input("runTime", "Minimum pump run time (minutes)", "1")}${input("precharge", "Tank precharge gauge pressure", "193", "pressure")}${input("cutIn", "Pump cut-in gauge pressure", "207", "pressure")}${input("cutOut", "Pump cut-out gauge pressure", "345", "pressure")}</div>${actions("Size pressure tank")}</form>`
  },
  {
    path: phase2ToolLinks[3][0], script: "/assets/js/tools/short-cycling.js", type: "Analyzer", cluster: "Wells, storage & rainwater", h1: "Pump Short-Cycling Analyzer",
    description: "Screen observed pump starts against pressure-tank drawdown, demand and pump flow with explicit zero-demand and high-demand handling.",
    purpose: "Translate an observed start count into starts per hour and compare it with a simplified pressure-tank fill-and-draw cycle.",
    when: "Use after safely observing pressure and start behavior. It helps organize measurements before inspecting the tank, switch, check valve, leaks or controls.",
    method: `<div class="formula">Off-time = drawdown / demand; on-time = drawdown / (pump flow − demand)</div><p>The refill model is unavailable when demand equals or exceeds pump flow. At zero demand, repeated cycling points away from normal drawdown consumption.</p>`,
    example: "Six starts in 20 minutes is 18 starts/hour. With 30 L drawdown, 10 L/min demand and 40 L/min pump flow, modeled off/on times are 3 and 1 minutes, or 15 starts/hour.",
    assumptions: "Constant demand and pump flow during a cycle, usable drawdown is known, and observed starts are counted consistently.",
    limitations: "The model does not diagnose bladder failure, switch chatter, air charge, a leaking check valve, variable-speed controls or motor limits.",
    warning: "Do not open energized controls or work on a pressurized vessel. Use the pump/motor manufacturer’s allowable starts and service procedures.",
    sources: [sources.pentairTank, sources.doe, sources.hiFaq],
    related: [[phase2ToolLinks[2][0], phase2ToolLinks[2][1]], [phase2GuideLinks[2][0], phase2GuideLinks[2][1]], [toolLinks[8][0], toolLinks[8][1]], [phase2ToolLinks[1][0], phase2ToolLinks[1][1]], ["/systems/wells-storage-rainwater/", "Parent wells and rainwater workflow"]],
    form: `<form data-tool-form="short-cycling">${unitSelect}<div class="field-grid">${input("starts", "Observed pump starts", "6")}${input("observation", "Observation period (minutes)", "20")}${input("drawdown", "Usable tank drawdown", "30", "volume")}${input("demand", "Demand during observation", "10", "flow")}${input("pumpFlow", "Pump flow while running", "40", "flow")}</div>${actions("Analyze cycling")}</form>`
  },
  {
    path: phase2ToolLinks[4][0], script: "/assets/js/tools/storage-tank-sizing.js", type: "Planner", cluster: "Wells, storage & rainwater", h1: "Water Storage Tank Sizing Planner",
    description: "Plan nominal water storage from daily demand, outage duration, partial refill, reserve, usable fraction and existing capacity.",
    purpose: "Show no-refill and partial-refill water balances, then distinguish required usable volume from the tank’s nominal physical volume.",
    when: "Use for preliminary outage, slow-source or scheduled-refill scenarios after demand and source availability have been explicitly estimated.",
    method: `<div class="formula">Net demand = max(0, daily demand × days − refill rate × refill hours × days)</div><div class="formula">Nominal storage = net demand × (1 + reserve) / usable fraction</div>`,
    example: "At 2,000 L/day for 3 days with 5 L/min refill for 4 hours/day, refill contributes 3,600 L. The 2,400 L net plus 20% reserve is 2,880 L usable; at 90% usable fraction, nominal storage is 3,200 L.",
    assumptions: "Average refill occurs for the entered hours each day, demand is represented by a daily total and the usable fraction includes dead or inaccessible volume.",
    limitations: "No hourly peak, water age, treatment, fire flow, structural, seismic, freeze, overflow or pressure analysis is included.",
    warning: "Potable, emergency and fire storage requirements vary. Protect water quality, turnover, access, venting and cross-connection control.",
    sources: [sources.epaEmergency, sources.cdcCistern],
    related: [[phase2ToolLinks[1][0], phase2ToolLinks[1][1]], [phase2GuideLinks[3][0], phase2GuideLinks[3][1]], [phase2ReferenceLinks[0][0], phase2ReferenceLinks[0][1]], [phase2ToolLinks[6][0], phase2ToolLinks[6][1]], ["/systems/wells-storage-rainwater/", "Parent wells and rainwater workflow"]],
    form: `<form data-tool-form="storage-tank">${unitSelect}<div class="field-grid">${input("dailyDemand", "Average daily demand", "2000", "volume")}${input("outageDays", "Outage / autonomy period (days)", "3")}${input("refillFlow", "Available refill flow", "5", "flow")}${input("refillHours", "Refill hours per day", "4")}${input("reserve", "Reserve allowance (%)", "20")}${input("usablePercent", "Usable fraction (%)", "90")}${input("existingVolume", "Existing nominal storage", "0", "volume")}</div>${actions("Plan storage")}</form>`
  },
  {
    path: phase2ToolLinks[5][0], script: "/assets/js/tools/rainwater-yield.js", type: "Calculator", cluster: "Wells, storage & rainwater", h1: "Rainwater Harvesting Yield Calculator",
    description: "Estimate rainwater collection from horizontal catchment area, rainfall, runoff coefficient, collection efficiency and fixed event losses.",
    purpose: "Make the roof-area and rainfall relationship visible while separating runoff, collection and fixed-loss assumptions.",
    when: "Use with local rainfall for the same period as the demand being assessed. Follow it with a storage simulation because annual yield alone does not show dry-season reliability.",
    method: `<div class="formula">Harvested volume = max(0, area × rainfall × runoff coefficient × collection efficiency − fixed loss)</div><p>In SI, 1 mm on 1 m² equals 1 litre.</p>`,
    example: "A 150 m² horizontal roof receiving 80 mm, with 0.9 runoff, 0.85 collection efficiency and 100 L fixed loss, yields about 9,080 L.",
    assumptions: "Area is the horizontal plan area draining to the tank; rainfall covers the chosen period; coefficient and efficiency are dimensionless fractions.",
    limitations: "Even monthly yield does not represent event timing, tank overflow, drought sequence, roof contamination or end-use quality.",
    warning: "Rainwater is not automatically safe to drink. Verify roof materials, separation, first flush, treatment, testing and local collection rules.",
    sources: [sources.doeRain, sources.yourHome, sources.cdcRain],
    related: [[phase2ToolLinks[6][0], phase2ToolLinks[6][1]], [phase2ToolLinks[7][0], phase2ToolLinks[7][1]], [phase2GuideLinks[4][0], phase2GuideLinks[4][1]], [phase2ReferenceLinks[0][0], phase2ReferenceLinks[0][1]], ["/systems/wells-storage-rainwater/", "Parent wells and rainwater workflow"]],
    form: `<form data-tool-form="rain-yield">${unitSelect}<div class="field-grid">${input("area", "Horizontal catchment area", "150", "area")}${input("rainfall", "Rainfall for the period", "80", "rainfall")}${input("runoff", "Runoff coefficient (%)", "90")}${input("efficiency", "Collection efficiency (%)", "85")}${input("fixedLoss", "Fixed first-flush / event loss", "100", "volume")}</div>${actions("Estimate yield")}</form>`
  },
  {
    path: phase2ToolLinks[6][0], script: "/assets/js/tools/rainwater-simulator.js", type: "Simulator", cluster: "Wells, storage & rainwater", h1: "Rainwater Tank Days-of-Supply Simulator",
    description: "Simulate 365 daily rainwater tank steps from monthly rainfall, catchment area, collection factor, storage capacity and daily demand.",
    purpose: "Expose overflow, unmet demand, empty periods and end storage that an annual yield total cannot show.",
    when: "Use for comparative preliminary tank scenarios. Enter local monthly rainfall and test dry, typical and wet years; use daily historic rainfall for detailed design.",
    method: `<div class="formula">Each day: add evenly distributed monthly inflow → spill overflow → withdraw daily demand</div><p>Reliability is the fraction of 365 days on which the complete entered daily demand is supplied.</p>`,
    example: "A 10,000 L tank, 150 m² roof, 80% collection factor and 250 L/day demand can be compared across multiple monthly rainfall sequences; the monthly report identifies overflow and unmet demand.",
    assumptions: "Each month’s rain falls evenly across its days; demand is constant; one non-leap year is modeled; collection factor already includes runoff and system efficiency.",
    limitations: "Even rainfall distribution smooths storms and dry spells and can overstate reliability. No water-quality, pump, treatment or demand-timing model is included.",
    warning: "Run multiple historical and sensitivity cases. Do not use monthly averages as a potable supply guarantee or emergency plan.",
    sources: [sources.doeRain, sources.yourHome, sources.cdcRain],
    related: [[phase2ToolLinks[5][0], phase2ToolLinks[5][1]], [phase2ToolLinks[7][0], phase2ToolLinks[7][1]], [phase2GuideLinks[4][0], phase2GuideLinks[4][1]], [phase2ToolLinks[4][0], phase2ToolLinks[4][1]], ["/systems/wells-storage-rainwater/", "Parent wells and rainwater workflow"]],
    form: `<form data-tool-form="rain-simulator">${unitSelect}<div class="field-grid">${input("capacity", "Tank capacity", "10000", "volume")}${input("initial", "Initial stored volume", "3000", "volume")}${input("area", "Horizontal catchment area", "150", "area")}${input("coefficient", "Combined collection factor (%)", "80")}${input("dailyDemand", "Daily rainwater demand", "250", "volume")}<div class="field full"><span class="field-label">Monthly rainfall (<span data-unit-label="rainfall"></span>)</span><div class="month-grid">${[65,55,70,80,90,75,60,55,70,85,75,70].map((value, i) => `<label for="rain${i + 1}">${i + 1}<input id="rain${i + 1}" name="rain${i + 1}" data-label="Month ${i + 1} rainfall" data-unit-kind="rainfall" type="number" step="any" value="${value}" required></label>`).join("")}</div></div></div>${actions("Simulate 365 days")}</form>`
  },
  {
    path: phase2ToolLinks[7][0], script: "/assets/js/tools/first-flush.js", type: "Calculator", cluster: "Wells, storage & rainwater", h1: "First Flush Diverter Sizing Calculator",
    description: "Calculate first-flush diversion volume from catchment area and either a diversion depth or a stated volume-per-area rule.",
    purpose: "Convert the project’s local first-flush criterion into an installed diversion volume without implying that one rule is universal.",
    when: "Use after identifying the roof area that actually drains to the tank and finding the applicable guidance for location, roof condition and end use.",
    method: `<div class="formula">Depth mode: volume = area × diversion depth</div><div class="formula">Rule mode: volume = area × entered volume per square metre</div>`,
    example: "A 150 m² roof at 0.2 mm diversion depth requires 30 L. The same result is expressed as 0.2 L/m².",
    assumptions: "Catchment area is horizontal plan area and one consistent local rule has been chosen.",
    limitations: "The result does not predict contaminant removal, storm reset/drain behavior, maintenance or harvest loss across a rainfall record.",
    warning: "First flush can improve source control but does not make rainwater potable. Local guidance and intended end use determine the appropriate rule.",
    sources: [sources.cdcRain, sources.yourHome],
    related: [[phase2ToolLinks[5][0], phase2ToolLinks[5][1]], [phase2GuideLinks[4][0], phase2GuideLinks[4][1]], [phase2ToolLinks[6][0], phase2ToolLinks[6][1]], [referenceLinks[0][0], referenceLinks[0][1]], ["/systems/wells-storage-rainwater/", "Parent wells and rainwater workflow"]],
    form: `<form data-tool-form="first-flush">${unitSelect}<div class="field-grid">${input("area", "Horizontal catchment area", "150", "area")}${select("mode", "Sizing rule", [["depth", "Diversion depth"], ["rate", "Volume per square metre"]], "full")}<div class="field" data-depth-field><label for="depth">Diversion depth (<span data-unit-label="rainfall"></span>)</label><input id="depth" name="depth" data-label="Diversion depth" data-unit-kind="rainfall" type="number" step="any" value="0.2"></div><div class="field" data-rate-field hidden><label for="rate">Volume rule (L/m²)</label><input id="rate" name="rate" data-label="Volume rule" type="number" step="any" value="0.2"></div></div>${actions("Size diverter")}</form>`
  }
);

const metalToolCommon = {
  cluster: "Metal finishing rinse water optimization",
  script: "/assets/js/tools/metal-finishing-tools.js",
  reviewed: "August 24, 2026",
  assumptions: "Representative production, matched meter and load boundaries, user-entered process targets and tariffs, and stable conditions during each comparison.",
  limitations: "No bath chemistry, final rinse acceptance, discharge limit, treatment package, permit condition or worker exposure control is selected or approved.",
  warning: "Metal-finishing solutions and wastewater may be corrosive, toxic or regulated. Follow SDS, PPE, ventilation, spill, wastewater, electrical and local authority requirements; use qualified industrial review.",
  sources: [sources.epaMetalP2, sources.epaMetalGuide, sources.epaMpm, sources.epaConductivity]
};

toolData.push(
  {
    ...metalToolCommon, path: metalToolLinks[0][0], type: "Calculator", h1: metalToolLinks[0][1],
    description: "Calculate rinse-water use per production load, average flow, annual volume and utility cost from a matched meter interval.",
    purpose: "Builds a repeatable line baseline without confusing facility-wide water with the selected rinse boundary.",
    when: "Use after isolating or defensibly allocating a meter interval and matching it to production loads and operating time.",
    method: `<div class="formula">Water per load = (end meter − start meter) / loads<br>Annual water = interval flow × hours/day × days/year</div>`,
    example: "A 10,000 L increase over eight hours and 200 loads equals 50 L/load and 1,250 L/h.",
    related: [[metalToolLinks[1][0], metalToolLinks[1][1]], [metalGuideLinks[0][0], metalGuideLinks[0][1]], [metalReferenceLinks[0][0], metalReferenceLinks[0][1]], ["/systems/metal-finishing-rinse-water/", "Metal finishing rinse workflow"]],
    form: `<form data-tool-form="metal-finishing-audit">${unitSelect}<div class="field-grid">${input("startMeter", "Starting meter reading", "50000", "volume")}${input("endMeter", "Ending meter reading", "60000", "volume")}${input("intervalHours", "Matched interval (hours)", "8")}${input("loads", "Production loads", "200", "", { step: "1" })}${input("hoursPerDay", "Operating hours per day", "8")}${input("days", "Operating days per year", "250", "", { step: "1" })}${input("tariff", "Combined water and sewer tariff (currency/m³)", "5.5")}</div>${actions("Calculate baseline")}</form>`
  },
  {
    ...metalToolCommon, path: metalToolLinks[1][0], type: "Estimator", h1: metalToolLinks[1][1],
    description: "Estimate solution, active-material mass and entered value carried from a process bath using measured retention per load.",
    purpose: "Makes measured drag-out visible before rinse-flow or recovery changes are evaluated.",
    when: "Use after a safe, representative drain-time study for one rack, barrel or product family.",
    method: `<div class="formula">Drag-out L/h = retained mL/load ÷ 1,000 × loads/h<br>Active mass = drag-out × bath concentration</div>`,
    example: "40 mL/load at 25 loads/h is 1 L/h; at 100 g/L across eight hours it carries 0.8 kg/shift.",
    related: [[metalToolLinks[2][0], metalToolLinks[2][1]], [metalGuideLinks[0][0], metalGuideLinks[0][1]], [metalReferenceLinks[0][0], metalReferenceLinks[0][1]], ["/systems/metal-finishing-rinse-water/", "Metal finishing rinse workflow"]],
    form: `<form data-tool-form="metal-finishing-dragout"><div class="field-grid">${input("retained", "Measured retained solution per load (mL)", "40")}${input("loadsPerHour", "Loads per hour", "25")}${input("concentration", "Bath concentration (g/L)", "100")}${input("valuePerKg", "Entered material value (currency/kg)", "12")}${input("shiftHours", "Shift length (hours)", "8")}</div>${actions("Estimate drag-out")}</form>`
  },
  {
    ...metalToolCommon, path: metalToolLinks[2][0], type: "Planner", h1: metalToolLinks[2][1],
    description: "Compare ideal one-stage and one-to-four-stage countercurrent rinse flow from measured drag-out and a user-entered dilution ratio.",
    purpose: "Screens the water-flow effect of staging while keeping the assumed dilution ratio explicit.",
    when: "Use after measuring drag-out and defining a process-specific rinse criterion with qualified process staff.",
    method: `<div class="formula">Ideal countercurrent flow Q = n × D × R<sup>1/n</sup><br>One-stage comparison = D × R</div>`,
    example: "At 1 L/h drag-out and a 1,000:1 ratio, two ideal stages screen at about 63.2 L/h versus 1,000 L/h for one stage.",
    related: [[metalToolLinks[1][0], metalToolLinks[1][1]], [metalToolLinks[3][0], metalToolLinks[3][1]], [metalReferenceLinks[0][0], metalReferenceLinks[0][1]], ["/systems/metal-finishing-rinse-water/", "Metal finishing rinse workflow"]],
    form: `<form data-tool-form="metal-finishing-countercurrent">${unitSelect}<div class="field-grid">${input("dragOut", "Measured drag-out per hour", "1", "volume")}${input("dilution", "Required dilution ratio", "1000")}${input("stages", "Ideal mixed rinse stages (1–4)", "2", "", { step: "1" })}</div>${actions("Plan rinse flow")}</form>`
  },
  {
    ...metalToolCommon, path: metalToolLinks[3][0], type: "Analyzer", h1: metalToolLinks[3][1],
    description: "Analyze local rinse-flow, conductivity and production log rows for water per load, idle flow and alert excursions.",
    purpose: "Connects an operating change to a local verification record without uploading process data.",
    when: "Use with comparable timestamp intervals exported or transcribed as minutes, flow, conductivity and loads.",
    method: `<div class="formula">Water = Σ(minutes × flow)<br>Water/load = total water ÷ total loads</div><p>Rows above the user-entered conductivity alert are counted; no universal limit is supplied.</p>`,
    example: "Rows of 60,5,400,10 and 30,5,800,0 total 450 L, 45 L/load, 150 L idle water and one excursion at a 600 µS/cm alert.",
    related: [[metalToolLinks[2][0], metalToolLinks[2][1]], [metalToolLinks[4][0], metalToolLinks[4][1]], [metalGuideLinks[0][0], metalGuideLinks[0][1]], ["/systems/metal-finishing-rinse-water/", "Metal finishing rinse workflow"]],
    form: `<form data-tool-form="metal-finishing-log">${unitSelect}<div class="field-grid"><div class="field full"><label for="logFile">Local CSV file (optional)</label><input id="logFile" name="logFile" type="file" accept=".csv,.txt,text/csv,text/plain"><span class="hint">Read locally only; selecting a file replaces the text below.</span></div><div class="field full"><label for="logText">minutes, flow, conductivity, loads</label><textarea id="logText" name="logText" rows="7">minutes,flow,conductivity,loads\n60,5,400,10\n30,5,800,0</textarea></div>${input("alert", "User-entered conductivity alert (µS/cm)", "600")}</div>${actions("Analyze log")}</form>`
  },
  {
    ...metalToolCommon, path: metalToolLinks[4][0], type: "Comparator", h1: metalToolLinks[4][1],
    description: "Compare baseline and proposed rinse flow, annual water and treatment savings, net savings and simple payback.",
    purpose: "Keeps measured flow, operating schedule, current tariffs, treatment cost and added operating cost separate.",
    when: "Use after a feasible rinse change and before capital approval; test production and maintenance sensitivity.",
    method: `<div class="formula">Annual saved m³ = (baseline − proposed) × hours/day × days/year ÷ 1,000<br>Net savings = saved volume × entered unit costs − annual operating cost</div>`,
    example: "Reducing 1,000 to 100 L/h for eight hours across 250 days saves 1,800 m³/year before entered costs.",
    related: [[metalToolLinks[0][0], metalToolLinks[0][1]], [metalToolLinks[3][0], metalToolLinks[3][1]], [metalGuideLinks[0][0], metalGuideLinks[0][1]], ["/systems/metal-finishing-rinse-water/", "Metal finishing rinse workflow"]],
    form: `<form data-tool-form="metal-finishing-savings">${unitSelect}<div class="field-grid">${input("baseline", "Baseline rinse flow per hour", "1000", "volume")}${input("proposed", "Proposed rinse flow per hour", "100", "volume")}${input("hoursPerDay", "Operating hours per day", "8")}${input("days", "Operating days per year", "250", "", { step: "1" })}${input("waterTariff", "Water tariff (currency/m³)", "2.5")}${input("sewerTariff", "Sewer tariff (currency/m³)", "3")}${input("treatmentCost", "Treatment cost (currency/m³)", "1.5")}${input("operatingCost", "Added annual operating cost (currency)", "2500")}${input("installedCost", "Installed cost (currency)", "30000")}</div>${actions("Compare savings")}</form>`
  }
);

const monitoringWellToolCommon = {
  cluster: "Monitoring well purging and low-flow sampling",
  script: "/assets/js/tools/monitoring-well-tools.js",
  reviewed: "August 31, 2026",
  modified: "2026-08-31",
  assumptions: "Well construction, water levels, equipment dimensions, flow and field readings are site-specific measurements entered in consistent units. All comparison criteria are supplied by the user from the governing plan or authority.",
  limitations: "These tools calculate geometry, displacement and numeric variation only. They do not select a sampling method, prove sample representativeness, establish laboratory requirements or authorize collection or disposal.",
  warning: "Follow the approved sampling and health-and-safety plans. Treat unknown groundwater and purge water as potentially contaminated; use qualified field staff, calibrated instruments, required PPE and lawful containment and disposal.",
  sources: [sources.epaLowFlowSop, sources.epaLowFlow, sources.usgsPurgeAnalyzer]
};

toolData.push(
  {
    ...monitoringWellToolCommon, path: monitoringWellToolLinks[0][0], type: "Calculator", h1: monitoringWellToolLinks[0][1],
    description: "Calculate monitoring-well water-column volume, a user-entered purge-volume target, pumping time and whole usable containers.",
    purpose: "Turns measured casing geometry and water level into a transparent standing-volume calculation while keeping the field-plan multiplier explicit.",
    when: "Use only when the approved method calls for a purge target based on standing well volumes; low-flow methods may instead use drawdown and stabilization evidence.",
    method: `<div class="formula">Water column = total depth − depth to water<br>Well volume = π × (inside diameter ÷ 2)² × water column<br>Target = well volume × entered multiplier</div>`,
    example: "A 50 mm ID well, 12 m deep with water at 4 m contains about 15.7 L. At an entered 3× target and 1 L/min, the result is about 47.1 L, 47.1 minutes and three 20 L usable containers.",
    related: [[monitoringWellToolLinks[1][0], monitoringWellToolLinks[1][1]], [monitoringWellGuideLinks[0][0], monitoringWellGuideLinks[0][1]], [monitoringWellReferenceLinks[0][0], monitoringWellReferenceLinks[0][1]], ["/systems/monitoring-well-sampling/", "Monitoring well sampling workflow"]],
    form: `<form data-tool-form="monitoring-well-purge">${unitSelect}<div class="field-grid">${input("internalDiameter", "Well internal diameter", "50", "diameter")}${input("totalDepth", "Total well depth", "12", "length")}${input("depthToWater", "Depth to water", "4", "length")}${input("multiplier", "Field-plan purge multiplier", "3")}${input("flow", "Measured pumping rate", "1", "flow")}${input("container", "Usable capacity per container", "20", "volume")}</div>${actions("Calculate purge target")}</form>`
  },
  {
    ...monitoringWellToolCommon, path: monitoringWellToolLinks[1][0], type: "Checker", h1: monitoringWellToolLinks[1][1],
    description: "Check pump-intake placement, screen and water-level geometry, drawdown and measured flow against user-entered field limits.",
    purpose: "Makes setup conflicts visible before a field team treats a numeric stabilization result as sufficient evidence.",
    when: "Use with surveyed well-construction data, measured initial and stabilized water levels, and limits copied from the approved site plan.",
    method: `<div class="formula">Drawdown = stabilized depth to water − initial depth to water<br>Submerged head over intake = intake depth − stabilized depth to water</div>`,
    example: "For a 10–13 m screen, an intake at 11.5 m, initial water at 4 m and stabilized water at 4.08 m, drawdown is 0.08 m and 7.42 m of water remains over the intake.",
    related: [[monitoringWellToolLinks[2][0], monitoringWellToolLinks[2][1]], [monitoringWellToolLinks[3][0], monitoringWellToolLinks[3][1]], [monitoringWellGuideLinks[0][0], monitoringWellGuideLinks[0][1]], ["/systems/monitoring-well-sampling/", "Monitoring well sampling workflow"]],
    form: `<form data-tool-form="monitoring-well-setup">${unitSelect}<div class="field-grid">${input("screenTop", "Screen top depth", "10", "length")}${input("screenBottom", "Screen bottom depth", "13", "length")}${input("intakeDepth", "Pump intake depth", "11.5", "length")}${input("initialWater", "Initial depth to water", "4", "length")}${input("stabilizedWater", "Stabilized depth to water", "4.08", "length")}${input("flow", "Measured flow", "0.25", "flow")}${input("maxDrawdown", "Entered maximum drawdown", "0.1", "length")}${input("maxFlow", "Entered maximum flow", "0.5", "flow")}</div>${actions("Check setup")}</form>`
  },
  {
    ...monitoringWellToolCommon, path: monitoringWellToolLinks[2][0], type: "Planner", h1: monitoringWellToolLinks[2][1],
    description: "Calculate tubing, pump, flow-cell and other equipment volume, then compare a planned reading interval with user-entered volume exchanges.",
    purpose: "Prevents readings from being scheduled faster than the entered flow can displace the measured equipment volume.",
    when: "Use after measuring internal tubing diameter and length and obtaining wetted volumes for the installed pump, chamber and flow cell.",
    method: `<div class="formula">Tubing volume = π × (inside diameter ÷ 2)² × length<br>Minimum interval = total equipment volume × entered exchanges ÷ flow</div>`,
    example: "For 6 mm ID tubing over 20 m plus 100, 250 and 50 mL components, total equipment volume is about 0.97 L and one exchange takes about 3.86 minutes at 0.25 L/min.",
    related: [[monitoringWellToolLinks[1][0], monitoringWellToolLinks[1][1]], [monitoringWellToolLinks[3][0], monitoringWellToolLinks[3][1]], [monitoringWellReferenceLinks[0][0], monitoringWellReferenceLinks[0][1]], ["/systems/monitoring-well-sampling/", "Monitoring well sampling workflow"]],
    form: `<form data-tool-form="monitoring-well-equipment">${unitSelect}<div class="field-grid">${input("tubingDiameter", "Tubing internal diameter", "6", "diameter")}${input("tubingLength", "Wetted tubing length", "20", "length")}${input("pumpVolume", "Pump or chamber volume (mL)", "100")}${input("flowCellVolume", "Flow-cell volume (mL)", "250")}${input("otherVolume", "Other wetted volume (mL)", "50")}${input("exchanges", "Entered volume exchanges", "1")}${input("flow", "Measured flow", "0.25", "flow")}${input("plannedInterval", "Planned reading interval (minutes)", "5")}</div>${actions("Plan reading interval")}</form>`
  },
  {
    ...monitoringWellToolCommon, path: monitoringWellToolLinks[3][0], type: "Analyzer", h1: monitoringWellToolLinks[3][1],
    description: "Analyze a local groundwater field log across consecutive readings using user-entered absolute and relative stabilization criteria.",
    purpose: "Produces an auditable parameter-by-parameter comparison without uploading the log or converting example values into universal requirements.",
    when: "Use after the approved setup is operating and calibrated instruments have produced time-ordered readings in the displayed schema.",
    method: `<div class="formula">Absolute range = maximum − minimum<br>Relative range (%) = range ÷ |mean| × 100<br>Integrated purge volume = Σ(time interval × preceding flow)</div><p>pH, ORP, depth-to-water and flow use absolute ranges; temperature, conductivity, dissolved oxygen and turbidity use relative ranges.</p>`,
    example: "Three readings at minutes 0, 5 and 10 are compared as one window. The report says only MET when every entered criterion passes; any one failed parameter produces NOT YET MET.",
    related: [[monitoringWellToolLinks[2][0], monitoringWellToolLinks[2][1]], [monitoringWellGuideLinks[0][0], monitoringWellGuideLinks[0][1]], [monitoringWellReferenceLinks[0][0], monitoringWellReferenceLinks[0][1]], ["/systems/monitoring-well-sampling/", "Monitoring well sampling workflow"]],
    form: `<form data-tool-form="monitoring-well-stabilization">${unitSelect}<div class="field-grid"><div class="field full"><label for="logFile">Local CSV file (optional)</label><input id="logFile" name="logFile" type="file" accept=".csv,.txt,text/csv,text/plain"><span class="hint">Read in this browser only; the file is not uploaded. Selecting it replaces the text below.</span></div><div class="field full"><label for="logText">Local CSV rows</label><textarea id="logText" name="logText" rows="7">minutes,pH,temperature,conductivity,do,orp,turbidity,depthToWater,flow\n0,7.01,15.0,500,4.0,120,5.0,4.05,0.25\n5,7.03,15.1,505,3.9,122,4.8,4.06,0.25\n10,7.02,15.1,503,3.9,121,4.9,4.06,0.24</textarea><span class="hint">Columns: minutes, pH, temperature, conductivity, DO, ORP, turbidity, depth to water, flow. In US mode, enter temperature in °F, depth in ft and flow in GPM. Every row and value is validated; no row is silently skipped.</span></div><fieldset class="field full stabilization-criteria-group"><legend>Comparison window</legend><div class="stabilization-criteria-grid stabilization-window-grid">${input("readings", "Consecutive readings to compare", "3", "", { step: "1" })}</div></fieldset><fieldset class="field full stabilization-criteria-group"><legend>Water-quality stability limits</legend><div class="stabilization-criteria-grid">${input("phCriterion", "Maximum pH absolute range", "0.1")}${input("temperatureCriterion", "Maximum temperature relative range (%)", "3")}${input("conductivityCriterion", "Maximum conductivity relative range (%)", "3")}${input("doCriterion", "Maximum dissolved oxygen relative range (%)", "10")}${input("orpCriterion", "Maximum ORP absolute range (mV)", "10")}${input("turbidityCriterion", "Maximum turbidity relative range (%)", "10")}</div></fieldset><fieldset class="field full stabilization-criteria-group"><legend>Hydraulic stability limits</legend><div class="stabilization-criteria-grid">${input("drawdownCriterion", "Maximum depth-to-water absolute range", "0.05", "length")}${input("flowCriterion", "Maximum flow absolute range", "0.05", "flow")}</div></fieldset></div>${actions("Analyze stabilization")}</form>`
  }
);

const irrigationToolCommon = {
  cluster: "Irrigation & sprinkler systems",
  sources: [sources.nrcsIrrigation, sources.hunter, sources.rainBird],
  assumptions: "Entered measurements represent the same operating condition. Calculations use unrounded SI values and convert only for display.",
  limitations: "This is a preliminary planning screen, not a design approval, irrigation audit, pump curve analysis or distribution-uniformity test.",
  warning: "Use current manufacturer data and local requirements. Isolate electrical and pressurized equipment before service; use qualified help for backflow, pump controls and buried piping."
};
toolData.push(
  { ...irrigationToolCommon, path: irrigationToolLinks[0][0], script: "/assets/js/tools/irrigation-tools.js", type: "Calculator", h1: irrigationToolLinks[0][1], reviewed: "August 20, 2026", modified: "2026-08-20", description: "Calculate available water flow from a bucket or meter test, average repeat trials and identify measurements that need checking.", purpose: "Turns a known container volume or water-meter difference and a timed interval into raw measured flow for a faucet, hose, irrigation takeoff or other accessible test point. It does not infer water pressure.", when: "Use before designing or changing an irrigation zone. Test at the connection point that will actually supply the project, and record the time, valve position and any other active water use so repeat trials describe the same condition.", method: `<div class="formula">Flow (L/min) = measured litres × 60 / seconds</div><div class="formula">Repeat-test spread (%) = (highest trial flow − lowest trial flow) ÷ average trial flow × 100</div><h2>Run a reliable bucket flow test</h2><ol><li><strong>Choose the real supply point.</strong> Test the outlet or takeoff that will feed the planned irrigation. A small faucet branch, hose, nozzle or upstream test point can change the available flow.</li><li><strong>Use a known volume.</strong> Select a container mark you can read clearly. Open the supply to the intended test position, allow the flow to stabilize, then time only the fill from zero to that mark.</li><li><strong>Repeat the same test.</strong> Enter the same collected volume for every trial and repeat two or three times with the same valves, test point and other demand. Do not average unlike operating conditions.</li><li><strong>Use a longer observation when needed.</strong> If the container fills in less than about 10 seconds, reaction time becomes a larger part of the result. Use a larger container or a longer meter interval where practical.</li></ol><h2>Use a water meter difference</h2><p>Record start and end readings in the same units while a defined outlet or zone runs, subtract the start from the end, and enter that delivered volume with the exact elapsed time. Confirm that unrelated demand and meter resolution do not dominate the reading.</p><h2>Interpret the measured flow</h2><p>The result is the observed raw flow at that place and condition—not an automatic design allowance. A wide repeat-test spread means the supply or test method was not stable enough for a confident zone limit. Record dynamic pressure separately while water is moving, then take the measured flow to the zone planner and choose a deliberate reserve there.</p>`, example: "A 10 L container filled in 20 seconds gives 30 L/min (0.5 L/s, 1.8 m³/h, 7.93 GPM). Comparable 20, 21 and 19 second trials average about 30.05 L/min; keep the three times with the result rather than reporting only a rounded flow.", assumptions: "The entered volume is known, every repeat uses that same volume, and all trials represent the same test point and operating condition. Calculations use unrounded SI values and convert only for display.", limitations: "A bucket or meter test measures one observed flow condition. It does not establish static or dynamic pressure, predict a pump or well through a full cycle, remove hose or branch restrictions, or prove that a different connection point has the same capacity.", warning: "Keep water away from electrical equipment and avoid unsafe flooding or pressure release. Do not alter backflow devices, pump controls or buried piping for this test; obtain qualified help where required.", related: [[irrigationGuideLinks[0][0], irrigationGuideLinks[0][1]], [irrigationToolLinks[1][0], irrigationToolLinks[1][1]], ["/systems/irrigation-sprinklers/", "Irrigation workflow"], [toolLinks[8][0], toolLinks[8][1]]], form: `<form data-tool-form="irrigation-flow">${unitSelect}<div class="field-grid">${select("mode", "Measurement method", [["bucket", "Bucket / container fill test"], ["meter", "Water meter volume difference"]], "full")}${input("volume", "Collected volume or meter difference", "10", "volume", { hint: "Bucket mode: use the marked container volume. Meter mode: use end reading minus start reading." })}${input("seconds", "Measurement time (seconds)", "20", "", { hint: "Time the full collection interval; use the same volume for every repeat trial." })}${input("trial2", "Optional second trial time (seconds)", "", "", { optional: true, hint: "Repeat at the same test point and operating condition." })}${input("trial3", "Optional third trial time (seconds)", "", "", { optional: true, hint: "A third comparable trial makes an unstable result easier to spot." })}</div>${actions("Calculate flow")}</form>` },
  { ...irrigationToolCommon, path: irrigationToolLinks[1][0], script: "/assets/js/tools/irrigation-tools.js", type: "Planner", h1: irrigationToolLinks[1][1], description: "Plan whole sprinkler-head capacity using measured flow, reserve, dynamic pressure, head demand and losses.", purpose: "Screens both flow and pressure margins so a flow-only head count is not mistaken for a feasible zone.", when: "Use after measuring available flow and dynamic pressure at comparable conditions.", method: `<div class="formula">Usable flow = available flow × (1 − reserve); pressure margin = dynamic − required head − losses − elevation head</div>`, example: "100 L/min with 10% reserve and 12 L/min/head yields seven whole heads and 6 L/min unused.", related: [[irrigationToolLinks[0][0], irrigationToolLinks[0][1]], [irrigationToolLinks[5][0], irrigationToolLinks[5][1]], [irrigationGuideLinks[1][0], irrigationGuideLinks[1][1]], ["/systems/irrigation-sprinklers/", "Irrigation workflow"]], form: `<form data-tool-form="irrigation-zone">${unitSelect}<div class="field-grid">${input("available", "Available measured flow", "100", "flow")}${input("reserve", "Flow reserve (%)", "10")}${input("perHead", "Per-head flow", "12", "flow")}${input("heads", "Proposed head count", "7", "", { optional: true, step: "1" })}${input("dynamic", "Dynamic pressure", "400", "pressure")}${input("required", "Required head pressure", "210", "pressure")}${input("loss", "Pipe / valve / filter loss", "50", "pressure")}${input("rise", "Elevation rise", "0", "head")}</div>${actions("Plan capacity")}</form>` },
  { ...irrigationToolCommon, path: irrigationToolLinks[2][0], script: "/assets/js/tools/irrigation-tools.js", type: "Calculator", h1: irrigationToolLinks[2][1], description: "Calculate sprinkler precipitation rate from total flow and area or from head flow, arc and rectangular or triangular spacing.", purpose: "Converts a verified nozzle discharge and wetted layout into theoretical applied depth per hour.", when: "Use with current nozzle data and an actual layout; precipitation rate is not a distribution-uniformity score.", method: `<div class="formula">mm/h = total L/min × 60 / area m²</div>`, example: "120 L/min over 4,000 m² produces 1.8 mm/h; 45 minutes applies 1.35 mm.", related: [[irrigationToolLinks[3][0], irrigationToolLinks[3][1]], [irrigationGuideLinks[1][0], irrigationGuideLinks[1][1]], ["/systems/irrigation-sprinklers/", "Irrigation workflow"]], form: `<form data-tool-form="irrigation-precipitation">${unitSelect}<div class="field-grid">${select("mode", "Calculation mode", [["total", "Total flow and area"], ["spacing", "Head flow and spacing"]], "full")}${input("flow", "Total or per-head flow", "120", "flow")}${input("area", "Irrigated area", "4000", "area")}${input("x", "Head spacing", "4", "length")}${input("y", "Row spacing", "4", "length")}${select("layout", "Spacing layout", [["rect", "Rectangular"], ["tri", "Triangular"]])}${input("runtime", "Optional runtime (minutes)", "45", "", { optional: true })}</div>${actions("Calculate precipitation")}</form>` },
  { ...irrigationToolCommon, path: irrigationToolLinks[3][0], script: "/assets/js/tools/irrigation-tools.js", type: "Planner", h1: irrigationToolLinks[3][1], description: "Plan irrigation runtime, gross water depth, event and cycle length from target depth, application rate and efficiency.", purpose: "Converts net target depth into a transparent gross application and cycle-and-soak schedule.", when: "Use after confirming precipitation rate and observing infiltration/runoff.", method: `<div class="formula">Gross depth = net target / efficiency; runtime = gross depth / precipitation rate</div>`, example: "20 mm net at 80% efficiency and 10 mm/h needs 25 mm gross and 150 minutes.", related: [[irrigationToolLinks[2][0], irrigationToolLinks[2][1]], [irrigationToolLinks[4][0], irrigationToolLinks[4][1]], [irrigationGuideLinks[1][0], irrigationGuideLinks[1][1]], ["/systems/irrigation-sprinklers/", "Irrigation workflow"]], form: `<form data-tool-form="irrigation-runtime">${unitSelect}<div class="field-grid">${input("depth", "Target net water depth", "20", "rainfall")}${input("rate", "Precipitation rate", "10", "rainfall")}${input("efficiency", "Application efficiency (%)", "80")}${input("area", "Optional irrigated area", "500", "area", { optional: true })}${input("events", "Watering events", "1", "", { step: "1" })}${input("cycles", "Cycles per event", "1", "", { step: "1" })}${input("intake", "Optional soil intake rate", "", "rainfall", { optional: true })}</div>${actions("Plan runtime")}</form>` },
  { ...irrigationToolCommon, path: irrigationToolLinks[4][0], script: "/assets/js/tools/irrigation-tools.js", type: "Calculator", h1: irrigationToolLinks[4][1], description: "Calculate direct emitter or row-geometry drip flow, event volume and practical zone splitting.", purpose: "Totals emitters without allowing direct and geometry input to be counted at once.", when: "Use with the actual emitter discharge at operating pressure and field row geometry.", method: `<div class="formula">Total L/h = emitters × emitter L/h; geometry uses floor(row length / spacing) + 1 endpoints.</div>`, example: "100 m rows at 0.5 m spacing, 10 rows and 2 L/h emitters total 4,020 L/h.", related: [[irrigationToolLinks[3][0], irrigationToolLinks[3][1]], [irrigationGuideLinks[1][0], irrigationGuideLinks[1][1]], ["/systems/irrigation-sprinklers/", "Irrigation workflow"]], form: `<form data-tool-form="irrigation-drip">${unitSelect}<div class="field-grid">${select("mode", "Input mode", [["direct", "Direct emitter count"], ["rows", "Row geometry"]], "full")}${input("emitters", "Direct emitter count", "100", "", { step: "1" })}${input("emitter", "Emitter flow", "4", "", { hint: "L/h" })}${input("rowLength", "Row length", "100", "length")}${input("spacing", "Emitter spacing", "0.5", "length")}${input("rows", "Row count", "10", "", { step: "1" })}${input("available", "Optional available flow", "50", "flow", { optional: true })}${input("reserve", "Flow reserve (%)", "10")}${input("hours", "Event duration (hours)", "1.5")}</div>${actions("Calculate drip zones")}</form>` },
  { ...irrigationToolCommon, path: irrigationToolLinks[5][0], script: "/assets/js/tools/irrigation-tools.js", type: "Comparator", h1: irrigationToolLinks[5][1], description: "Compare one entered pump duty condition against one irrigation zone's flow and head requirement, including reserve.", purpose: "Makes the single-duty-condition screen explicit and links onward to TDH and pump curve work.", when: "Use only after a current pump curve or manufacturer duty condition is available.", method: `<div class="formula">Required head = operating pressure head + elevation + pipe/valve loss; reserve applies to both flow and head screen.</div>`, example: "100 L/min at 60 m against an 80 L/min, 200 kPa zone with 10 m rise and 5 m loss is a Match with 10% reserve.", related: [[toolLinks[0][0], toolLinks[0][1]], [toolLinks[5][0], toolLinks[5][1]], [irrigationToolLinks[1][0], irrigationToolLinks[1][1]], ["/systems/irrigation-sprinklers/", "Irrigation workflow"]], form: `<form data-tool-form="irrigation-pump">${unitSelect}<div class="field-grid">${input("pumpFlow", "Pump available flow", "100", "flow")}${input("pumpHead", "Pump available head", "60", "head")}${input("zoneFlow", "Zone required flow", "80", "flow")}${input("pressure", "Zone operating pressure", "200", "pressure")}${input("rise", "Elevation rise", "10", "head")}${input("loss", "Pipe / valve / filter loss", "5", "head")}${input("reserve", "Safety margin (%)", "10")}</div>${actions("Match pump and zone")}</form>` },
  { ...irrigationToolCommon, path: irrigationToolLinks[6][0], script: "/assets/js/tools/irrigation-tools.js", type: "Troubleshooter", h1: irrigationToolLinks[6][1], description: "Prioritize likely irrigation low-pressure cause groups from zone scope, pressure, flow, nozzle, valve, filter, leak and pump evidence.", purpose: "Provides triage and the next measurement, not a confirmed diagnosis.", when: "Use after a safe visual inspection and, where appropriate, comparable static/dynamic pressure and flow measurements.", method: `<p>Rules weigh evidence for local head/nozzle issues, zone restrictions or leaks, excess demand, source-wide limits and pumped-source faults.</p>`, example: "One weak zone with a restricted filter leads with zone valve/filter restriction and a safe filter/valve check before changing pressure equipment.", related: [[irrigationToolLinks[0][0], irrigationToolLinks[0][1]], [irrigationToolLinks[1][0], irrigationToolLinks[1][1]], [irrigationGuideLinks[2][0], irrigationGuideLinks[2][1]], ["/systems/irrigation-sprinklers/", "Irrigation workflow"]], form: `<form data-tool-form="irrigation-troubleshoot"><div class="field-grid">${select("scope", "Affected area", [["one", "One head"], ["zone", "One zone"], ["all", "All zones"]])}${select("filter", "Filter restricted?", [["unknown", "Unknown"], ["yes", "Yes"], ["no", "No"]])}${select("leak", "Leak or soggy patch?", [["no", "No"], ["yes", "Yes"]])}${select("nozzle", "Nozzles recently enlarged?", [["no", "No"], ["yes", "Yes"]])}${select("pump", "Pump alarm, lost prime or dry-run sign?", [["no", "No"], ["yes", "Yes"]])}${select("dynamic", "Dynamic pressure / flow low across all zones?", [["no", "No / unknown"], ["yes", "Yes"]])}</div>${actions("Analyze symptoms")}</form>` }
);

const treatmentToolCommon = {
  cluster: "Water treatment & water quality",
  script: "/assets/js/tools/treatment-tools.js",
  assumptions: "The entered water test, flow, product concentration and manufacturer values represent the same source, use and operating condition.",
  limitations: "The result is a transparent preliminary calculation or decision screen. It does not establish contaminant removal, potable safety, product certification, regulatory compliance or an approved treatment design.",
  warning: "Test water through an appropriate accredited laboratory, follow current product labels and SDS, verify certified contaminant-reduction claims in an official listing, and obtain local public-health or qualified design review where required."
};
toolData.push(
  {
    ...treatmentToolCommon, path: treatmentToolLinks[0][0], type: "Calculator", h1: treatmentToolLinks[0][1],
    description: "Estimate preliminary water-softener working capacity from tested hardness, daily use, regeneration interval, reserve, optional iron allowance and peak service flow.",
    purpose: "Converts hardness to grains per US gallon, applies only the iron compensation factor entered by the user, and separates working capacity from reserve-adjusted capacity and service-flow review.",
    when: "Use after a current laboratory test and before comparing the exact manufacturer capacity at a stated salt setting and service-flow curve.",
    method: `<div class="formula">Daily grain load = adjusted hardness (grains/US gal) × daily US gallons</div><div class="formula">Reserve-adjusted capacity = daily grain load × regeneration days × (1 + reserve)</div><p>The conversion used is 1 grain/US gal = 17.118061 mg/L as CaCO₃. Iron allowance is added only when the user supplies a factor from applicable product or technical data.</p>`,
    example: "171.18061 mg/L as CaCO₃ is 10 grains/US gal. At 1,000 L/day for 7 days with 20% reserve, the preliminary reserve-adjusted capacity is about 22,190 grains before any user-entered iron allowance.",
    sources: [sources.epaSoftener, sources.usgsWaterQuality, sources.nsfTreatment],
    related: [[treatmentToolLinks[1][0], treatmentToolLinks[1][1]], [treatmentGuideLinks[0][0], treatmentGuideLinks[0][1]], [treatmentReferenceLinks[0][0], treatmentReferenceLinks[0][1]], ["/systems/water-treatment-quality/", "Water Treatment & Water Quality workflow"]],
    form: `<form data-tool-form="treatment-softener">${unitSelect}<div class="field-grid">${input("hardness", "Water hardness", "171.18061")}${select("hardnessUnit", "Hardness basis", [["mgL", "mg/L as CaCO₃"], ["ppm", "ppm as CaCO₃"], ["gpg", "grains per US gallon"]])}${input("dailyUse", "Daily water use", "1000", "volume")}${input("regenerationDays", "Desired days between regeneration", "7")}${input("reserve", "Reserve allowance (%)", "20")}${input("iron", "Optional iron concentration (mg/L)", "", "", { optional: true })}${input("ironFactor", "Iron allowance factor (gpg per mg/L iron)", "", "", { optional: true, hint: "Enter only from selected product or authoritative technical data." })}${input("peakFlow", "Peak service flow", "40", "flow")}</div>${actions("Size softener")}</form>`
  },
  {
    ...treatmentToolCommon, path: treatmentToolLinks[1][0], type: "Planner", h1: treatmentToolLinks[1][1],
    description: "Plan softener regeneration interval, monthly and annual salt demand, salt efficiency, regeneration water and optional operating cost.",
    purpose: "Uses the actual usable capacity and salt dose entered from manufacturer data rather than inventing a universal salt setting.",
    when: "Use after the incoming daily grain load is known and an exact model’s usable capacity at the proposed salt setting has been identified.",
    method: `<div class="formula">Service capacity = usable capacity × (1 − reserve); days/regeneration = service capacity / daily grain load</div><div class="formula">Annual salt = regenerations/year × salt dose/regeneration</div>`,
    example: "With 30,000 grains usable capacity, 10% reserve, 3,000 grains/day and 4 kg salt per regeneration, the interval is 9 days and annual salt is about 162.3 kg.",
    sources: [sources.epaSoftener, sources.nsfTreatment],
    related: [[treatmentToolLinks[0][0], treatmentToolLinks[0][1]], [treatmentGuideLinks[1][0], treatmentGuideLinks[1][1]], [treatmentReferenceLinks[1][0], treatmentReferenceLinks[1][1]], ["/systems/water-treatment-quality/", "Water Treatment & Water Quality workflow"]],
    form: `<form data-tool-form="treatment-salt">${unitSelect}<div class="field-grid">${input("dailyLoad", "Daily hardness load (grains/day)", "3000")}${input("usableCapacity", "Usable capacity per regeneration (grains)", "30000")}${input("saltDose", "Salt dose per regeneration", "4", "mass")}${input("reserve", "Capacity reserve (%)", "10")}${input("regenWater", "Optional regeneration water", "150", "volume", { optional: true })}${input("saltPrice", "Optional salt price (currency/kg)", "", "", { optional: true })}${input("waterPrice", "Optional water price (currency/m³)", "", "", { optional: true })}</div>${actions("Plan regeneration")}</form>`
  },
  {
    ...treatmentToolCommon, path: treatmentToolLinks[2][0], type: "Calculator", h1: treatmentToolLinks[2][1],
    description: "Calculate reverse-osmosis recovery, permeate and reject flow, daily volumes and entered-period totals from feed and product flow or recovery.",
    purpose: "Makes the RO water balance visible without equating recovery with contaminant rejection, membrane condition or product-water safety.",
    when: "Use with flows measured under the same operating condition or with a recovery value supplied by the exact membrane-system design.",
    method: `<div class="formula">Recovery (%) = permeate flow / feed flow × 100</div><div class="formula">Reject flow = feed flow − permeate flow</div>`,
    example: "A feed of 10 L/min and permeate of 4 L/min gives 40% recovery and 6 L/min reject. At 8 operating hours, that is 1,920 L/day product and 2,880 L/day reject.",
    sources: [sources.epaRo, sources.cdcHomeTreatment],
    related: [[treatmentToolLinks[3][0], treatmentToolLinks[3][1]], [treatmentGuideLinks[2][0], treatmentGuideLinks[2][1]], [phase2ToolLinks[4][0], phase2ToolLinks[4][1]], ["/systems/water-treatment-quality/", "Water Treatment & Water Quality workflow"]],
    form: `<form data-tool-form="treatment-ro-recovery">${unitSelect}<div class="field-grid">${select("mode", "Input mode", [["flow", "Feed and permeate flow"], ["recovery", "Feed flow and recovery"]], "full")}${input("feed", "Feed flow", "10", "flow")}${input("permeate", "Permeate / product flow", "4", "flow")}${input("recovery", "Recovery (%)", "40")}${input("hours", "Operating hours per day", "8")}${input("days", "Operating days in reporting period", "30")}</div>${actions("Calculate RO streams")}</form>`
  },
  {
    ...treatmentToolCommon, path: treatmentToolLinks[3][0], type: "Planner", h1: treatmentToolLinks[3][1],
    description: "Compare user-corrected RO production with daily demand, peak-period demand, usable storage, reserve and estimated refill time.",
    purpose: "Keeps rated output, user-supplied manufacturer correction factors, operating time, demand and usable storage as separate quantities.",
    when: "Use after finding correction factors for the exact membrane and feed conditions; do not substitute generic temperature or pressure correction formulas.",
    method: `<div class="formula">Adjusted daily production = rated production × entered correction factors × actual hours / rating hours</div><p>The planner compares reserve-adjusted daily demand and the larger of daily deficit or peak-period storage need with initially available usable storage.</p>`,
    example: "A 2,000 L rating over 24 hours, operated 20 hours with factors 0.9, 0.95 and 0.98, yields about 1,396.5 L/day. Against 1,200 L/day plus 10% reserve, the daily margin is about 76.5 L.",
    sources: [sources.epaRo, sources.cdcHomeTreatment, sources.epaTreatment],
    related: [[treatmentToolLinks[2][0], treatmentToolLinks[2][1]], [phase2ToolLinks[4][0], phase2ToolLinks[4][1]], [toolLinks[7][0], toolLinks[7][1]], ["/systems/water-treatment-quality/", "Water Treatment & Water Quality workflow"]],
    form: `<form data-tool-form="treatment-ro-production">${unitSelect}<div class="field-grid">${input("ratedProduction", "Rated production", "2000", "volume")}${input("ratingHours", "Rating period (hours)", "24")}${input("actualHours", "Actual operating hours per day", "20")}${input("temperatureFactor", "Manufacturer temperature factor", "0.9")}${input("pressureFactor", "Manufacturer pressure factor", "0.95")}${input("otherFactor", "Other user-supplied derating factor", "0.98")}${input("dailyDemand", "Daily product-water demand", "1200", "volume")}${input("peakDemand", "Peak-period product-water volume", "500", "volume")}${input("peakHours", "Peak period (hours)", "4")}${input("usableStorage", "Usable storage volume", "500", "volume")}${input("initialStored", "Optional initial stored volume", "400", "volume", { optional: true })}${input("reserve", "Demand reserve (%)", "10")}</div>${actions("Plan production")}</form>`
  },
  {
    ...treatmentToolCommon, path: treatmentToolLinks[4][0], type: "Calculator", h1: treatmentToolLinks[4][1],
    description: "Calculate media-filter service and backwash loading from total flow, actual vessel diameter or area and parallel vessel count.",
    purpose: "Relates flow to actual filter area and compares only against user-entered media or manufacturer limits.",
    when: "Use after identifying the exact vessel and media; include filter pressure loss in the connected pump duty review.",
    method: `<div class="formula">Circular area = πd²/4; loading rate = total flow / total filter area</div>`,
    example: "Two 1 m diameter vessels provide 1.571 m² total area. At 100 L/min, service loading is about 63.66 L/min/m² and flow per vessel is 50 L/min.",
    sources: [sources.epaTreatment, sources.cdcTreatment],
    related: [[toolLinks[0][0], toolLinks[0][1]], [toolLinks[1][0], toolLinks[1][1]], [treatmentGuideLinks[1][0], treatmentGuideLinks[1][1]], ["/systems/water-treatment-quality/", "Water Treatment & Water Quality workflow"]],
    form: `<form data-tool-form="treatment-media">${unitSelect}<div class="field-grid">${input("flow", "Total service flow", "100", "flow")}${select("shape", "Filter area input", [["circle", "Circular vessel diameter"], ["area", "Area per vessel"]])}${input("diameter", "Vessel internal diameter", "1000", "diameter")}${input("filterArea", "Filter area per vessel", "0.7854", "area")}${input("vessels", "Number of parallel vessels", "2", "", { step: "1" })}${input("bedDepth", "Optional media bed depth", "", "length", { optional: true })}${input("backwashFlow", "Optional total backwash flow", "300", "flow", { optional: true })}${input("serviceLimit", "Optional service limit (L/min/m²)", "", "", { optional: true })}${input("backwashLimit", "Optional backwash target (L/min/m²)", "", "", { optional: true })}</div>${actions("Calculate loading")}</form>`
  },
  {
    ...treatmentToolCommon, path: treatmentToolLinks[5][0], type: "Calculator", h1: treatmentToolLinks[5][1],
    description: "Convert a user-supplied chlorine target and verified product active concentration into active mass and solution volume without recommending a dose.",
    purpose: "Performs dose arithmetic only after the user has obtained the target dose and product basis from an applicable authority, product label or qualified design.",
    when: "Use only when the water volume, existing residual, target dose, available chlorine concentration and—when required—solution density are known.",
    method: `<div class="formula">Net dose = max(0, target − existing); active mass = net dose × water volume</div><div class="formula">Solution volume = required active mass / active chlorine concentration</div>`,
    example: "For 10,000 L, a user-entered target of 2 mg/L, existing 0.2 mg/L, 10% w/w product and density 1.1 kg/L, active mass is 18 g and solution volume is about 0.164 L.",
    sources: [sources.epaCt, sources.cdcTreatment, sources.whoDrinking],
    related: [[treatmentToolLinks[6][0], treatmentToolLinks[6][1]], [treatmentGuideLinks[2][0], treatmentGuideLinks[2][1]], [treatmentReferenceLinks[0][0], treatmentReferenceLinks[0][1]], ["/systems/water-treatment-quality/", "Water Treatment & Water Quality workflow"]],
    form: `<form data-tool-form="treatment-chlorine">${unitSelect}<div class="field-grid">${select("waterMode", "Water quantity mode", [["volume", "Entered water volume"], ["flow", "Flow and dosing duration"]], "full")}${input("waterVolume", "Water volume", "10000", "volume")}${input("doseFlow", "Dosed water flow", "100", "flow")}${input("doseHours", "Dosing duration (hours)", "1")}${input("targetDose", "User-supplied target dose (mg/L)", "2")}${input("existing", "Existing residual / concentration (mg/L)", "0.2", "", { optional: true })}${select("concentrationBasis", "Product active concentration basis", [["percent", "Percent by weight"], ["mgL", "mg/L or user-defined active concentration"]], "full")}${input("productConcentration", "Product active concentration", "10")}${input("density", "Product solution density (kg/L)", "1.1", "", { optional: true })}</div>${actions("Calculate solution volume")}</form>`
  },
  {
    ...treatmentToolCommon, path: treatmentToolLinks[6][0], type: "Calculator", h1: treatmentToolLinks[6][1],
    description: "Calculate nominal detention time, effective contact time and CT from contact volume, flow, measured residual and a user-supplied baffling factor.",
    purpose: "Shows the arithmetic behind CT and, when the user supplies a target, reports only a simple mathematical margin.",
    when: "Use with a measured residual at the correct location and a baffling or effective-volume factor obtained from design information or applicable guidance.",
    method: `<div class="formula">Nominal time = volume / flow; effective time = nominal time × baffling factor; CT = measured residual × effective time</div>`,
    example: "A 5,000 L contact volume at 100 L/min has 50 minutes nominal detention. With 0.7 baffling and 0.5 mg/L measured residual, effective time is 35 minutes and CT is 17.5 mg·min/L.",
    sources: [sources.epaCt, sources.whoDrinking],
    related: [[treatmentToolLinks[5][0], treatmentToolLinks[5][1]], [treatmentGuideLinks[2][0], treatmentGuideLinks[2][1]], [treatmentReferenceLinks[0][0], treatmentReferenceLinks[0][1]], ["/systems/water-treatment-quality/", "Water Treatment & Water Quality workflow"]],
    form: `<form data-tool-form="treatment-ct">${unitSelect}<div class="field-grid">${select("volumeMode", "Contact-volume input", [["volume", "Entered volume"], ["dimensions", "Rectangular tank dimensions"]], "full")}${input("volume", "Contact volume", "5000", "volume")}${input("tankLength", "Tank internal length", "3", "length")}${input("tankWidth", "Tank internal width", "2", "length")}${input("waterDepth", "Water depth", "1", "length")}${input("flow", "Flow", "100", "flow")}${input("residual", "Measured disinfectant residual (mg/L)", "0.5")}${input("bafflingFactor", "User-supplied baffling factor", "0.7")}${input("targetCt", "Optional user-supplied CT target (mg·min/L)", "", "", { optional: true })}</div>${actions("Calculate contact time")}</form>`
  },
  {
    ...treatmentToolCommon, path: treatmentToolLinks[7][0], type: "Selector", h1: treatmentToolLinks[7][1],
    description: "Explore evidence-led water-treatment stages from source, intended use, laboratory availability, reported problems and practical constraints.",
    purpose: "Organizes possible tests, stages, sequence and constraints while keeping uncertainty and urgent public-health escalation visible.",
    when: "Use before buying equipment and after defining the intended use. Laboratory results and local authority guidance remain the decision basis.",
    method: `<p>Rules add only stages supported by the entered evidence, flag missing testing and preserve alternatives or constraints. A positive microbiological result triggers urgent safe-source and authority guidance rather than a universal device prescription.</p>`,
    example: "A private well with a laboratory report showing hardness only produces a softening review followed by monitoring. Rainwater with no laboratory test instead starts with source protection and testing, not a potable-safety claim.",
    sources: [sources.epaPrivateWells, sources.cdcWellTesting, sources.cdcHomeTreatment, sources.nsfTreatment, sources.whoDrinking],
    related: [[treatmentGuideLinks[0][0], treatmentGuideLinks[0][1]], [treatmentReferenceLinks[0][0], treatmentReferenceLinks[0][1]], [treatmentGuideLinks[2][0], treatmentGuideLinks[2][1]], ["/systems/water-treatment-quality/", "Water Treatment & Water Quality workflow"]],
    form: `<form data-tool-form="treatment-selector"><div class="field-grid">${select("source", "Water source", [["municipal", "Municipal / public supply"], ["well", "Private well / borehole"], ["rainwater", "Rainwater"], ["surface", "Surface water"], ["process", "Process water"]])}${select("intendedUse", "Intended use", [["drinking", "Drinking / cooking"], ["household", "General household"], ["irrigation", "Irrigation"], ["equipment", "Equipment protection"], ["process", "Process use"]])}${select("lab", "Laboratory test available?", [["yes", "Yes"], ["no", "No"]])}${select("sediment", "Sediment reported or observed?", [["no", "No / not reported"], ["yes", "Yes"]])}${select("turbidity", "Turbidity concern?", [["no", "No / not reported"], ["yes", "Yes"]])}${select("hardness", "Hardness concern?", [["no", "No / not reported"], ["yes", "Yes"]])}${select("iron", "Iron concern?", [["no", "No / not reported"], ["yes", "Yes"]])}${select("manganese", "Manganese concern?", [["no", "No / not reported"], ["yes", "Yes"]])}${select("chlorine", "Chlorine concern?", [["no", "No / not reported"], ["yes", "Yes"]])}${select("tasteOdor", "Taste or odor concern?", [["no", "No / not reported"], ["yes", "Yes"]])}${select("tds", "High TDS / dissolved-solids concern?", [["no", "No / not reported"], ["yes", "Yes"]])}${select("pH", "pH / corrosion concern?", [["no", "No / not reported"], ["yes", "Yes"]])}${select("microbiology", "Microbiological result", [["unknown", "Unknown / not tested"], ["negative", "No positive result reported"], ["positive", "Positive / unsafe indication"]])}${select("color", "Unexplained color?", [["no", "No"], ["yes", "Yes"]])}${select("organics", "Organic-contamination indication?", [["no", "No / unknown"], ["yes", "Yes"]])}${select("flowKnown", "Service flow requirement defined?", [["yes", "Yes / measured"], ["no", "No / not measured"]])}${select("peakFlow", "Peak-flow requirement", [["normal", "Defined / manageable"], ["high", "High or uncertain"]])}${select("existingEquipment", "Existing treatment equipment", [["none", "None"], ["yes", "Present"], ["unknown", "Unknown"]])}${select("space", "Equipment and service space", [["available", "Available / verified"], ["limited", "Limited / uncertain"]])}${select("drainage", "Drainage / backwash capacity", [["available", "Available and verified"], ["limited", "Limited / uncertain"]])}${select("rejectLimit", "RO reject-water limitation", [["no", "No / not applicable"], ["yes", "Yes"]])}</div>${actions("Select candidate stages")}</form>`
  }
);

const greywaterToolCommon = {
  cluster: "Greywater reuse planning",
  script: "/assets/js/tools/greywater-tools.js",
  reviewed: "August 8, 2026",
  assumptions: "Entered fixture, event, climate, soil and tariff values describe the planning case; volumes are kept on an SI internal basis.",
  limitations: "The result is a preliminary quantity or cost screen. It does not approve a source, end use, plumbing connection, treatment process, setback, storage time or irrigation method.",
  warning: "Greywater is non-potable wastewater. Prevent cross-connections and human contact, preserve a safe diversion path, and follow current local health, plumbing, irrigation and environmental requirements.",
  sources: [sources.sfGreywater, sources.waGreywater, sources.epaWaterBudget, sources.auRecycling]
};

toolData.push(
  {
    ...greywaterToolCommon, path: greywaterToolLinks[0][0], type: "Calculator", h1: greywaterToolLinks[0][1],
    description: "Estimate daily and weekly greywater supply from measured shower, bath, laundry and bathroom-basin use in SI or US units.",
    purpose: "Builds a source-by-source water balance and applies one explicit capture factor instead of hiding household defaults.",
    when: "Use before choosing an irrigation area, outlet layout or treatment system. Measure actual fixture flow, appliance volume and cycles where possible.",
    method: `<div class="formula">Usable supply = (shower + bath + laundry + bathroom-basin volume) × capture factor</div><p>Toilets are excluded. Kitchen sources are not assumed acceptable because definitions and risk controls vary by jurisdiction.</p>`,
    example: "Two people using 8 L/min showers for six minutes each, four 55 L laundry loads per week and 8 L/person/day at bathroom basins generate about 143.4 L/day before a capture factor.",
    related: [[greywaterToolLinks[1][0], greywaterToolLinks[1][1]], [greywaterGuideLinks[0][0], greywaterGuideLinks[0][1]], [greywaterReferenceLinks[0][0], greywaterReferenceLinks[0][1]], ["/systems/greywater-reuse/", "Greywater Reuse Planning workflow"]],
    form: `<form data-tool-form="greywater-supply">${unitSelect}<div class="field-grid">${input("occupants", "Occupants", "2", "", { step: "1" })}${input("showerFlow", "Measured shower flow", "8", "flow")}${input("showerMinutes", "Shower minutes per person per day", "6")}${input("bathVolume", "Bath water per day", "0", "volume")}${input("laundryVolume", "Water per laundry load", "55", "volume")}${input("loadsPerWeek", "Laundry loads per week", "4")}${input("basinVolume", "Bathroom-basin water per person per day", "8", "volume")}${input("capture", "Usable capture factor (%)", "85")}</div>${actions("Estimate supply")}</form>`
  },
  {
    ...greywaterToolCommon, path: greywaterToolLinks[1][0], type: "Planner", h1: greywaterToolLinks[1][1],
    description: "Compare daily greywater supply with ET, rainfall, plant-factor, area and irrigation-efficiency demand.",
    purpose: "Shows whether the entered reusable supply covers a site-specific weekly landscape demand and how much area that supply can support.",
    when: "Use after estimating supply and obtaining local reference ET, effective rainfall and a defensible plant factor for one hydrozone.",
    method: `<div class="formula">Gross demand = max(0, ETo × plant factor − effective rainfall) × area / irrigation efficiency</div><p>One millimetre over one square metre equals one litre. EPA's water-budget method likewise treats climate, plant type, area, rainfall and efficiency as separate inputs.</p>`,
    example: "150 L/day over 100 m² with 35 mm/week ETo, plant factor 0.4, 2 mm effective rain and 80% efficiency supplies about 70% of the 1,500 L/week gross demand.",
    related: [[greywaterToolLinks[0][0], greywaterToolLinks[0][1]], [greywaterToolLinks[2][0], greywaterToolLinks[2][1]], ["/tools/irrigation-runtime-water-depth-planner/", "Irrigation Runtime & Water Depth Planner"], ["/systems/greywater-reuse/", "Greywater Reuse Planning workflow"]],
    form: `<form data-tool-form="greywater-irrigation">${unitSelect}<div class="field-grid">${input("supply", "Usable greywater supply per day", "150", "volume")}${input("eto", "Reference ET per week", "35", "rainfall")}${input("rainfall", "Effective rainfall per week", "2", "rainfall")}${input("plantFactor", "Plant factor", "0.4")}${input("area", "Irrigated hydrozone area", "100", "area")}${input("efficiency", "Irrigation efficiency (%)", "80")}</div>${actions("Match supply and demand")}</form>`
  },
  {
    ...greywaterToolCommon, path: greywaterToolLinks[2][0], type: "Planner", h1: greywaterToolLinks[2][1],
    description: "Plan a whole-outlet laundry-to-landscape zone from measured load volume and user-entered minimum and maximum event volume per outlet.",
    purpose: "Makes event volume and outlet count visible so one large laundry discharge is not confused with a smooth daily average.",
    when: "Use after measuring the washing machine's actual discharge and after defining a locally acceptable per-basin event range for the plants and soil.",
    method: `<div class="formula">Volume per outlet = load volume / whole outlets<br>Minimum outlets = ceil(load / maximum target); maximum outlets = floor(load / minimum target)</div>`,
    example: "A 60 L load with a user-entered 10–20 L target per outlet has a feasible range of three to six outlets; four outlets receive 15 L each.",
    related: [[greywaterToolLinks[3][0], greywaterToolLinks[3][1]], [greywaterGuideLinks[0][0], greywaterGuideLinks[0][1]], [greywaterGuideLinks[1][0], greywaterGuideLinks[1][1]], ["/systems/greywater-reuse/", "Greywater Reuse Planning workflow"]],
    form: `<form data-tool-form="greywater-laundry-zone">${unitSelect}<div class="field-grid">${input("loadVolume", "Measured water per laundry load", "60", "volume")}${input("outlets", "Proposed whole outlets", "4", "", { step: "1" })}${input("minimum", "User-entered minimum per outlet", "10", "volume")}${input("maximum", "User-entered maximum per outlet", "20", "volume")}${input("loads", "Laundry loads per week", "4")}</div>${actions("Plan outlets")}</form>`
  },
  {
    ...greywaterToolCommon, path: greywaterToolLinks[3][0], type: "Checker", h1: greywaterToolLinks[3][1],
    description: "Check one greywater event against entered basin void capacity and measured soil infiltration over a drain-down window.",
    purpose: "Screens whether distributed subsurface basins can accept a short event without treating soil as unlimited storage.",
    when: "Use after a field infiltration assessment and after defining the actual number, area, effective depth and fill material of receiving basins.",
    method: `<div class="formula">Acceptance = outlet count × basin area × effective depth × void fraction + outlet count × basin area × infiltration rate × drain window</div><p>The method is a transparent volume screen, not a soil, groundwater, setback or permit determination.</p>`,
    example: "A 60 L event delivered at 90% to four 0.25 m² basins with 0.10 m effective depth and 30% void space has 30 L static capacity before entered-window infiltration.",
    related: [[greywaterToolLinks[2][0], greywaterToolLinks[2][1]], [greywaterGuideLinks[1][0], greywaterGuideLinks[1][1]], [greywaterReferenceLinks[0][0], greywaterReferenceLinks[0][1]], ["/systems/greywater-reuse/", "Greywater Reuse Planning workflow"]],
    form: `<form data-tool-form="greywater-surge">${unitSelect}<div class="field-grid">${input("eventVolume", "Source event volume", "60", "volume")}${input("outlets", "Receiving outlets / basins", "4", "", { step: "1" })}${input("basinArea", "Basin area per outlet", "0.25", "area")}${input("basinDepth", "Effective basin depth", "0.10", "length")}${input("void", "Available void fraction (%)", "30")}${input("infiltration", "Measured infiltration rate", "15", "rainfall")}${input("drainHours", "Entered drain-down window (hours)", "2")}${input("delivery", "Delivered fraction (%)", "90")}</div>${actions("Check event capacity")}</form>`
  },
  {
    ...greywaterToolCommon, path: greywaterToolLinks[4][0], type: "Calculator", h1: greywaterToolLinks[4][1],
    description: "Estimate annual reused water, avoided water and sewer charges, net savings and simple payback using local inputs.",
    purpose: "Keeps tariff, active days, sewer-billing treatment, operating cost and installed cost explicit instead of inventing regional prices.",
    when: "Use after a realistic reusable volume is known and after checking the utility's current water, sewer, rebate and billing rules.",
    method: `<div class="formula">Annual reused m³ = daily reuse × active days / 1,000<br>Net savings = avoided water + entered sewer offset − annual operating cost</div>`,
    example: "150 L/day for 240 days equals 36 m³/year. At 2.50 water and 3.00 sewer currency/m³ with a 50% sewer offset, gross savings are 144 currency/year before operating cost.",
    related: [[greywaterToolLinks[0][0], greywaterToolLinks[0][1]], [greywaterToolLinks[1][0], greywaterToolLinks[1][1]], [greywaterGuideLinks[0][0], greywaterGuideLinks[0][1]], ["/systems/greywater-reuse/", "Greywater Reuse Planning workflow"]],
    form: `<form data-tool-form="greywater-savings">${unitSelect}<div class="field-grid">${input("dailyReuse", "Reused water per active day", "150", "volume")}${input("activeDays", "Active reuse days per year", "240", "", { step: "1" })}${input("waterTariff", "Water tariff (currency/m³)", "2.5")}${input("sewerTariff", "Sewer tariff (currency/m³)", "3")}${input("sewerOffset", "Sewer charge avoided (%)", "50")}${input("operatingCost", "Annual operating cost (currency)", "40")}${input("installedCost", "Installed cost (currency)", "1200")}</div>${actions("Estimate savings")}</form>`
  }
);

const vehicleWashToolCommon = {
  cluster: "Vehicle wash water reclaim planning",
  script: "/assets/js/tools/vehicle-wash-tools.js",
  reviewed: "August 11, 2026",
  assumptions: "Steady representative operating periods; user-entered meter, equipment, tariff and operating data; volumes are quantity balances rather than water-quality claims.",
  limitations: "No treatment technology, discharge route, oil-water separation, chemical compatibility, permit condition or manufacturer package is selected or approved.",
  warning: "Vehicle-wash wastewater can contain sediment, detergents, oils, metals and other contaminants. Keep reclaimed water non-potable, prevent cross-connections and exposure, and verify current equipment, sewer, environmental and workplace requirements.",
  sources: [sources.epaVehicleWash, sources.doeVehicleWash, sources.icaVehicleWash, sources.doeWaterEvaluation]
};

toolData.push(
  {
    ...vehicleWashToolCommon, path: vehicleWashToolLinks[0][0], type: "Calculator", h1: vehicleWashToolLinks[0][1],
    description: "Calculate metered fresh-water use per vehicle, daily demand and annual demand for a professional vehicle wash in SI or US units.",
    purpose: "Turns a comparable meter interval and verified vehicle count into an operator baseline that can be repeated before and after equipment or reclaim changes.",
    when: "Use after recording a dedicated or defensibly isolated water-meter interval and the vehicles processed during the same period.",
    method: `<div class="formula">Fresh water per vehicle = (ending meter − starting meter) / vehicles<br>Annual use = interval use / interval days × operating days</div>`,
    example: "A 15,000 L meter increase across 300 vehicles in five days equals 50 L/vehicle, 3,000 L/day and 900 m³ across 300 operating days.",
    related: [[vehicleWashToolLinks[1][0], vehicleWashToolLinks[1][1]], [vehicleWashGuideLinks[0][0], vehicleWashGuideLinks[0][1]], [vehicleWashReferenceLinks[0][0], vehicleWashReferenceLinks[0][1]], ["/systems/vehicle-wash-water-reclaim/", "Vehicle Wash Water Reclaim workflow"]],
    form: `<form data-tool-form="vehicle-wash-audit">${unitSelect}<div class="field-grid">${input("startMeter", "Starting meter reading", "100000", "volume")}${input("endMeter", "Ending meter reading", "115000", "volume")}${input("vehicles", "Vehicles washed in interval", "300", "", { step: "1" })}${input("intervalDays", "Interval length (days)", "5")}${input("operatingDays", "Operating days per year", "300", "", { step: "1" })}</div>${actions("Calculate baseline")}</form>`
  },
  {
    ...vehicleWashToolCommon, path: vehicleWashToolLinks[1][0], type: "Planner", h1: vehicleWashToolLinks[1][1],
    description: "Plan fresh, reclaimed, carryout and remaining discharge volumes from measured wash demand and entered recovery performance.",
    purpose: "Separates gross applied water from non-recoverable carryout, collection efficiency, treatment recovery and the fresh-only spot-free stream.",
    when: "Use after measuring or estimating gross applied water per vehicle and obtaining current recovery information from the proposed reclaim equipment.",
    method: `<div class="formula">Potential recovered = (gross applied − carryout) × collection × treatment recovery<br>Reclaim used = min(potential recovered, gross applied − fresh-only spot-free demand)</div>`,
    example: "At 180 L applied, 20 L spot-free, 30 L carryout, 90% collection and 80% treatment recovery, 108 L/vehicle can return as reclaim and fresh requirement is 72 L/vehicle.",
    related: [[vehicleWashToolLinks[0][0], vehicleWashToolLinks[0][1]], [vehicleWashToolLinks[2][0], vehicleWashToolLinks[2][1]], [vehicleWashReferenceLinks[0][0], vehicleWashReferenceLinks[0][1]], ["/systems/vehicle-wash-water-reclaim/", "Vehicle Wash Water Reclaim workflow"]],
    form: `<form data-tool-form="vehicle-wash-balance">${unitSelect}<div class="field-grid">${input("gross", "Gross applied water per vehicle", "180", "volume")}${input("spotFree", "Fresh-only spot-free rinse per vehicle", "20", "volume")}${input("carryout", "Carryout / evaporation per vehicle", "30", "volume")}${input("collection", "Collection efficiency (%)", "90")}${input("recovery", "Treatment recovery (%)", "80")}${input("vehicles", "Vehicles per operating day", "120", "", { step: "1" })}</div>${actions("Plan water balance")}</form>`
  },
  {
    ...vehicleWashToolCommon, path: vehicleWashToolLinks[2][0], type: "Simulator", h1: vehicleWashToolLinks[2][1],
    description: "Simulate reclaim tank level through a steady peak wash window with entered demand, delayed return, tank capacity and reserve.",
    purpose: "Checks whether available starting storage and delayed recovered flow cover a peak operating window without falling below the entered reserve.",
    when: "Use after the reclaim balance is known and before choosing a tank; run multiple peak-throughput and recovery cases.",
    method: `<div class="formula">Each simulated minute: storage = prior storage − reclaim demand + delayed recovered return<br>Usable limit = working tank volume − reserve</div>`,
    example: "A four-hour 12 vehicle/hour peak using 100 L reclaim/vehicle and returning 90 L/vehicle after 20 minutes draws a 3,000 L starting tank to a calculated minimum before recovery stabilizes.",
    related: [[vehicleWashToolLinks[1][0], vehicleWashToolLinks[1][1]], [vehicleWashToolLinks[3][0], vehicleWashToolLinks[3][1]], [vehicleWashGuideLinks[1][0], vehicleWashGuideLinks[1][1]], ["/systems/vehicle-wash-water-reclaim/", "Vehicle Wash Water Reclaim workflow"]],
    form: `<form data-tool-form="vehicle-wash-buffer">${unitSelect}<div class="field-grid">${input("vehiclesPerHour", "Peak vehicles per hour", "12")}${input("peakHours", "Peak window (hours)", "4")}${input("demandPerVehicle", "Reclaim demand per vehicle", "100", "volume")}${input("returnPerVehicle", "Recovered return per vehicle", "90", "volume")}${input("delayMinutes", "Recovery delay (minutes)", "20")}${input("tankVolume", "Working tank volume", "5000", "volume")}${input("startingVolume", "Starting stored volume", "3000", "volume")}${input("reserve", "Minimum operating reserve", "500", "volume")}</div>${actions("Simulate peak window")}</form>`
  },
  {
    ...vehicleWashToolCommon, path: vehicleWashToolLinks[3][0], type: "Planner", h1: vehicleWashToolLinks[3][1],
    description: "Compare spot-free rinse demand with RO permeate production, peak storage draw and reclaimable reject water.",
    purpose: "Keeps permeate demand, rated production, availability, membrane recovery, peak draw and reject routing visible as separate quantities.",
    when: "Use with current measured spot-free rinse use and current membrane production at actual feed conditions.",
    method: `<div class="formula">Daily permeate = rated rate × production hours × availability<br>Feed = permeate / recovery; reject = feed − permeate</div>`,
    example: "At 15 L spot-free rinse for 120 vehicles, demand is 1,800 L/day. A 120 L/h unit running 18 hours at 90% availability makes 1,944 L/day before peak-storage checks.",
    related: [[vehicleWashToolLinks[2][0], vehicleWashToolLinks[2][1]], [vehicleWashToolLinks[4][0], vehicleWashToolLinks[4][1]], ["/tools/ro-production-demand-planner/", "RO Production vs Demand Planner"], ["/systems/vehicle-wash-water-reclaim/", "Vehicle Wash Water Reclaim workflow"]],
    form: `<form data-tool-form="vehicle-wash-ro">${unitSelect}<div class="field-grid">${input("vehicles", "Vehicles per day", "120", "", { step: "1" })}${input("rinsePerVehicle", "Spot-free rinse per vehicle", "15", "volume")}${input("ratedRate", "Measured permeate production per hour", "120", "volume")}${input("productionHours", "Production hours per day", "18")}${input("availability", "Production availability (%)", "90")}${input("recovery", "Verified membrane recovery (%)", "50")}${input("peakVehiclesPerHour", "Peak vehicles per hour", "12")}${input("peakHours", "Peak duration (hours)", "4")}${input("usableStorage", "Usable permeate storage", "800", "volume")}</div>${actions("Plan spot-free production")}</form>`
  },
  {
    ...vehicleWashToolCommon, path: vehicleWashToolLinks[4][0], type: "Calculator", h1: vehicleWashToolLinks[4][1],
    description: "Estimate annual fresh-water and sewer savings, net operating savings and simple payback for a vehicle-wash reclaim project.",
    purpose: "Connects measured baseline and proposed per-vehicle quantities to current local tariffs, annual operating cost and installed cost.",
    when: "Use after baseline and proposed water balances are documented; test low-throughput, high-cost and under-performance scenarios.",
    method: `<div class="formula">Annual volume saved = (baseline − proposed) × vehicles/day × operating days<br>Net annual savings = avoided water + avoided sewer − added annual operating cost</div>`,
    example: "Reducing fresh water from 180 to 72 L/vehicle at 120 vehicles/day and 300 days/year saves 3,888 m³/year before tariff and operating-cost effects.",
    related: [[vehicleWashToolLinks[0][0], vehicleWashToolLinks[0][1]], [vehicleWashToolLinks[1][0], vehicleWashToolLinks[1][1]], [vehicleWashGuideLinks[1][0], vehicleWashGuideLinks[1][1]], ["/systems/vehicle-wash-water-reclaim/", "Vehicle Wash Water Reclaim workflow"]],
    form: `<form data-tool-form="vehicle-wash-savings">${unitSelect}<div class="field-grid">${input("baselineFresh", "Baseline fresh water per vehicle", "180", "volume")}${input("proposedFresh", "Proposed fresh water per vehicle", "72", "volume")}${input("baselineSewer", "Baseline sewer discharge per vehicle", "150", "volume")}${input("proposedSewer", "Proposed sewer discharge per vehicle", "42", "volume")}${input("vehicles", "Vehicles per operating day", "120", "", { step: "1" })}${input("days", "Operating days per year", "300", "", { step: "1" })}${input("waterTariff", "Water tariff (currency/m³)", "2.5")}${input("sewerTariff", "Sewer tariff (currency/m³)", "3")}${input("operatingCost", "Added annual operating cost (currency)", "3500")}${input("installedCost", "Installed project cost (currency)", "45000")}</div>${actions("Estimate savings")}</form>`
  }
);

function toolBody(tool) {
  const phase2 = tool.cluster;
  const irrigation = phase2 === "Irrigation & sprinkler systems";
  const treatment = phase2 === "Water treatment & water quality";
  const greywater = phase2 === "Greywater reuse planning";
  const vehicleWash = phase2 === "Vehicle wash water reclaim planning";
  const metal = phase2 === "Metal finishing rinse water optimization";
  const systemPath = metal ? "/systems/metal-finishing-rinse-water/" : vehicleWash ? "/systems/vehicle-wash-water-reclaim/" : greywater ? "/systems/greywater-reuse/" : treatment ? "/systems/water-treatment-quality/" : irrigation ? "/systems/irrigation-sprinklers/" : phase2 ? "/systems/wells-storage-rainwater/" : "/systems/pumps-pressure-pipe/";
  const systemName = metal ? "Metal Finishing Rinse Water workflow" : vehicleWash ? "Vehicle Wash Water Reclaim workflow" : greywater ? "Greywater Reuse Planning workflow" : treatment ? "Water Treatment & Water Quality workflow" : irrigation ? "Irrigation & Sprinkler Systems workflow" : phase2 ? "Wells, Storage & Rainwater workflow" : "Start with the pump-system workflow";
  return `${hero(`${phase2 || "Pump systems"} / ${tool.type}`, tool.h1, tool.description, "Preliminary planning output only. Use measured data where possible and verify manufacturer and jurisdiction-specific requirements.")}
  <p class="meta-line">Last reviewed: ${tool.reviewed || reviewed} · SI first · US customary supported</p>
  ${toolLayout(tool.form)}
  <div class="content-layout"><article class="article-body">
    <h2>What this tool does</h2><p>${tool.purpose}</p>
    <h2>When to use it</h2><p>${tool.when}</p>
    <h2>Inputs and supported units</h2><p>Each labelled field explains the quantity it expects. Unit-system changes convert existing numeric entries once and keep calculations on a single SI internal basis. Supported shared units include L/min and GPM, metres and feet, kPa and psi, millimetres and inches, kW and hp, and °C and °F as relevant.</p>
    <h2>Calculation or decision method</h2>${tool.method}
    <h2>How to interpret the result</h2><p>Read the primary result with the supporting breakdown and warning. A plausible number is not evidence that every input, operating case or design constraint has been included.</p>
    <div class="worked-example"><h2>Worked example</h2><p>${tool.example}</p></div>
    <h2>Assumptions</h2><p>${tool.assumptions}</p>
    <h2>Limitations</h2><p>${tool.limitations}</p>
    <div class="notice"><strong>Safety and review boundary.</strong> ${tool.warning}</div>
    <h2>Sources</h2>${sourceList(tool.sources)}
    ${related(tool.related)}
  </article><aside class="sidebar"><h2>Bench sequence</h2><ul><li><a href="${systemPath}">${systemName}</a></li><li><a href="${metal ? metalGuideLinks[0][0] : vehicleWash ? vehicleWashGuideLinks[0][0] : greywater ? greywaterGuideLinks[0][0] : treatment ? treatmentGuideLinks[0][0] : irrigation ? irrigationGuideLinks[0][0] : phase2 ? phase2GuideLinks[1][0] : "/guides/how-to-size-a-water-pump/"}">${metal ? "Reduce rinse water in sequence" : vehicleWash ? "Meter the baseline first" : greywater ? "Plan source, use and diversion" : treatment ? "Read the water test first" : irrigation ? "Measure supply first" : phase2 ? "Plan the connected source system" : "Build flow and TDH"}</a></li><li><a href="${metal ? metalReferenceLinks[0][0] : vehicleWash ? vehicleWashReferenceLinks[0][0] : greywater ? greywaterReferenceLinks[0][0] : treatment ? treatmentToolLinks[7][0] : irrigation ? irrigationToolLinks[1][0] : phase2 ? phase2ReferenceLinks[0][0] : "/reference/pump-formulas-hydraulic-terms/"}">${metal ? "Compare rinse-control methods" : vehicleWash ? "Map each water stream" : greywater ? "Screen source and end use" : treatment ? "Build a test-led treatment path" : irrigation ? "Build a feasible zone" : phase2 ? "Check demand factors" : "Check formulas and terms"}</a></li><li><a href="/contact/">Report a content issue</a></li></ul></aside></div>`;
}

const homeBody = `${hero("Hydraulic field bench", "Plan the water path. Check the duty point.", "Practical tools, field-oriented guides and technical references for pumps, wells, storage, monitoring, irrigation, reuse, industrial rinse water and treatment—from source testing to documented use.", "Built for global use with SI-first calculations and common US customary units. Results support preliminary planning; they are not formal design, sampling authorization, potable-safety or regulatory approval.", '<div class="hero-actions"><a class="button" href="/systems/monitoring-well-sampling/">Plan a monitoring-well run</a><a class="button secondary" href="/tools/">Open all tools</a></div>')}
<div class="status-strip"><span>Monitoring-well sampling workflow live</span><span>51 working tools</span><span>20 field guides</span><span>12 references</span></div>
<section class="section"><div class="section-heading"><p class="eyebrow">System, not a card catalogue</p><h2>Follow water from source to use</h2><p class="lede">Water-system decisions depend on each other. Storage changes pump duty. Pipe size changes friction. Pressure requirements change power. Treatment and end use shape the whole path.</p></div><div class="flow-line"><span>Source</span><span>Storage</span><span>Pumping</span><span>Pipes</span><span>Treatment</span><span>Use</span></div></section>
<section class="section"><div class="section-heading"><p class="eyebrow">Eight connected system clusters</p><h2>Start with the system you are planning</h2></div>${cardGrid([["/systems/pumps-pressure-pipe/", "Pumps, Pressure & Pipe Flow", "Build flow, TDH, loss, duty point, power and suction checks."], ["/systems/wells-storage-rainwater/", "Wells, Storage & Rainwater", "Connect source yield, pumping, pressure, stored volume and roof collection."], ["/systems/monitoring-well-sampling/", "Monitoring Well Purging & Sampling", "Plan well volume, low-flow setup, equipment exchange and stabilization evidence."], ["/systems/irrigation-sprinklers/", "Irrigation & Sprinkler Systems", "Measure supply, build zones, set runtime and troubleshoot coverage."], ["/systems/water-treatment-quality/", "Water Treatment & Water Quality", "Test first, identify the problem, sequence treatment and verify performance."], ["/systems/greywater-reuse/", "Greywater Reuse Planning", "Measure reusable supply, match demand, distribute events and check economics."], ["/systems/vehicle-wash-water-reclaim/", "Vehicle Wash Water Reclaim", "Meter use per vehicle, balance reclaim, size buffers and check payback."], ["/systems/metal-finishing-rinse-water/", "Metal Finishing Rinse Water", "Audit flow, quantify drag-out, compare staging and verify savings."]], "Open system")}</section>
<section class="section"><div class="section-heading"><p class="eyebrow">Monitoring well field operations</p><h2>Set up, displace, observe and document</h2></div>${cardGrid([monitoringWellToolLinks[0], monitoringWellToolLinks[1], monitoringWellToolLinks[2], monitoringWellToolLinks[3], monitoringWellGuideLinks[0]], "Open resource")}</section>
<section class="section"><div class="section-heading"><p class="eyebrow">Three ways in</p><h2>Calculate, understand, verify</h2></div>${cardGrid([["/tools/", "Tools", "Use interactive forms with transparent methods and limitations."], ["/guides/", "Guides", "Work through pump sizing, curves and low-pressure diagnosis."], ["/reference/", "Reference", "Check conversions, pipe data, formulas and hydraulic terms."]])}</section>
<section class="section"><h2>Evidence-led expansion</h2><p class="lede">Each published cluster has a distinct user decision, repeat-use tools, primary-source methods and a connected workflow. The monitoring-well expansion adds field geometry, equipment displacement and local-log analysis while keeping criteria and authorization with the governing plan.</p><div class="notice"><strong>Use the result as evidence, not approval.</strong> Verify measurements, laboratory results, manufacturer data, certified claims, local rules and qualified requirements for the actual project.</div></section>`;

function hubBody(kind) {
  const isTools = kind === "Tools";
  const isGuides = kind === "Guides";
  const items = isTools ? toolLinks : isGuides ? guideLinks : referenceLinks;
  const description = isTools ? "Working calculators, planners, checks, selectors and troubleshooting across pump, well, monitoring, storage, irrigation, reuse, industrial rinse and treatment systems." : isGuides ? "Field-oriented explanations that connect source measurements, laboratory evidence, formulas and the next useful tool." : "Conversion tables, formulas, field-parameter methods, water-quality terms, reuse screening, process-control comparisons and hydraulic data used across eight workflows.";
  const updated = "August 31, 2026";
  return `${hero(`${kind} index`, kind, description, "Every linked resource is implemented. The initial plan and validated expansions contain no inactive or empty future pages.")}<p class="meta-line">Updated: ${updated} · ${items.length} published ${kind.toLowerCase()}</p>${isTools ? toolFinder() : `<section class="section">${cardGrid(items, "Read")}</section>`}<section class="section"><div class="notice"><strong>Practical boundary.</strong> These resources support preliminary decisions and transparent checking. They do not replace laboratory testing, manufacturer data, certified product claims, local requirements or project-specific professional review.</div></section>`;
}

const systemBody = `${hero("System hub / Phase 1", "Pumps, Pressure & Pipe Flow", "Build the duty point in the right order: required flow, static head, delivery pressure, pipe loss, pump curve, power, suction conditions and operating cost.", "Measured values describe the present system. Estimated values describe a planning assumption. Label both before comparing equipment.", '<div class="hero-actions"><a class="button" href="/tools/total-dynamic-head-calculator/">Start with total dynamic head</a><a class="button secondary" href="/guides/how-to-size-a-water-pump/">Read the sizing workflow</a></div>')}
<div class="status-strip"><span>9 tools</span><span>3 guides</span><span>5 references</span></div>
<section class="section"><h2>The recommended sequence</h2><div class="flow-line"><span>Required flow</span><span>Static head</span><span>Required pressure</span><span>Pipe loss</span><span>Duty point</span><span>Power & NPSH</span></div><div class="notice"><strong>Start with flow.</strong> A pump does not have one universal head or flow. It operates where its curve and the system curve meet.</div></section>
<section class="section"><h2>Inputs to collect</h2>${cardGrid([["/guides/how-to-size-a-water-pump/", "Demand and required flow", "Peak, simultaneous or process flow with a stated basis."], ["/tools/total-dynamic-head-calculator/", "Elevation and pressure", "Gauge locations, elevation datum and target pressure."], ["/tools/pipe-friction-loss-calculator/", "Pipe path and fittings", "Actual ID, length, material/roughness and duty flow."], ["/tools/pump-curve-duty-point-comparator/", "Manufacturer curve points", "Exact speed, impeller and fluid condition."], ["/tools/npsh-available-calculator/", "Suction conditions", "Absolute pressure, temperature, level and losses."], ["/tools/pump-operating-cost-comparator/", "Operating schedule", "Input power, hours, tariff and maintenance."]], "Open step")}</section>
<section class="section"><h2>Tools on the bench</h2>${cardGrid(toolLinks, "Use tool")}</section>
<section class="section"><h2>Understand the decisions</h2>${cardGrid(guideLinks, "Read guide")}</section>
<section class="section"><h2>Check the underlying data</h2>${cardGrid(referenceLinks, "Open reference")}</section>
<section class="section"><h2>Connections beyond this cluster</h2><p class="lede"><a href="/systems/wells-storage-rainwater/">Wells, Storage & Rainwater</a> defines source yield and storage, <a href="/systems/irrigation-sprinklers/">Irrigation & Sprinkler Systems</a> defines end-use zones, <a href="/systems/water-treatment-quality/">Water Treatment & Water Quality</a> adds testing and treatment constraints, and <a href="/systems/greywater-reuse/">Greywater Reuse Planning</a> connects non-potable wastewater supply to distribution and receiving capacity.</p></section>`;

const wellsSystemBody = `${hero("System hub / Phase 2", "Wells, Storage & Rainwater", "Connect source capability, pump duty, pressure control, stored water and roof collection before selecting equipment.", "Keep sustained source capacity, peak demand and stored volume as separate quantities. Test dry and high-demand cases, not only annual averages.", '<div class="hero-actions"><a class="button" href="/tools/well-yield-demand-checker/">Check source and demand</a><a class="button secondary" href="/guides/complete-well-water-system-planning/">Read the full workflow</a></div>')}
<div class="status-strip"><span>8 tools</span><span>5 guides</span><span>1 demand reference</span></div>
<section class="section"><h2>The source-to-use sequence</h2><div class="flow-line"><span>Source yield</span><span>Demand</span><span>Pump duty</span><span>Pressure</span><span>Storage</span><span>End use</span></div><div class="notice"><strong>Balance rates and volumes separately.</strong> A source can cover daily volume but still need storage for peaks; a tank cannot correct a sustained daily deficit.</div></section>
<section class="section"><h2>Two connected paths</h2>${cardGrid([["/tools/well-yield-demand-checker/", "Well and borehole path", "Sustained yield → demand → pump duty → pressure tank → bulk storage."], ["/tools/rainwater-harvesting-yield-calculator/", "Rainwater path", "Roof area → rainfall yield → first flush → tank simulation → end use."]], "Start path")}</section>
<section class="section"><h2>Tools on the bench</h2>${cardGrid(phase2ToolLinks, "Use tool")}</section>
<section class="section"><h2>Understand the decisions</h2>${cardGrid(phase2GuideLinks, "Read guide")}</section>
<section class="section"><h2>Check demand assumptions</h2>${cardGrid(phase2ReferenceLinks, "Open reference")}</section>
<section class="section"><h2>Connect pump hydraulics</h2>${cardGrid([[toolLinks[0][0], toolLinks[0][1], toolLinks[0][2]], [toolLinks[1][0], toolLinks[1][1], toolLinks[1][2]], [toolLinks[5][0], toolLinks[5][1], toolLinks[5][2]], [toolLinks[3][0], toolLinks[3][1], toolLinks[3][2]], [toolLinks[6][0], toolLinks[6][1], toolLinks[6][2]]], "Open pump tool")}</section>
<section class="section"><h2>Safety and water quality</h2><p class="lede">Groundwater and rainwater quality cannot be inferred from appearance or quantity. Protect source integrity, separate untreated rainwater from safe piped water, test for the intended use, and follow local well, plumbing, storage and public-health requirements. For a separately plumbed wastewater source, use the <a href="/systems/greywater-reuse/">Greywater Reuse Planning</a> workflow and preserve cross-connection controls.</p></section>`;

const irrigationSystemBody = `${hero("System hub / Phase 3", "Irrigation & Sprinkler Systems", "Move from measured supply to feasible zones, application rate, runtime and fault finding without confusing flow, dynamic pressure and water depth.", "Flow is quantity per time. Dynamic pressure is energy while water is moving. Precipitation rate is depth per time. Runtime supplies a chosen depth.", '<div class="hero-actions"><a class="button" href="/tools/available-water-flow-test-calculator/">Measure available flow</a><a class="button secondary" href="/guides/measure-irrigation-flow-pressure/">Read the measurement guide</a></div>')}
<div class="status-strip"><span>7 tools</span><span>3 guides</span><span>Measure → zone → apply → schedule</span></div>
<section class="section"><h2>The irrigation workflow</h2><div class="flow-line"><span>Source</span><span>Storage</span><span>Pumping</span><span>Irrigation</span><span>Zones</span><span>Use</span></div><p class="lede">First measure flow and dynamic pressure. Then create zones that pass both flow and pressure checks, calculate application rate, schedule water and investigate weak coverage with evidence.</p></section>
<section class="section"><h2>Recommended sequence</h2>${cardGrid([[irrigationToolLinks[0][0], irrigationToolLinks[0][1], "Measure bucket or meter flow and record dynamic pressure."], [irrigationToolLinks[1][0], irrigationToolLinks[1][1], "Check discrete heads against flow and pressure."], [toolLinks[2][0], toolLinks[2][1], "Check pipe velocity before accepting a zone."], [irrigationToolLinks[5][0], irrigationToolLinks[5][1], "Compare a pumped supply at one stated duty."], [irrigationToolLinks[2][0], irrigationToolLinks[2][1], "Convert nozzle discharge and layout into depth per hour."], [irrigationToolLinks[3][0], irrigationToolLinks[3][1], "Set runtime and cycle-and-soak observations."]], "Open step")}</section>
<section class="section"><h2>Sprinkler and drip paths</h2>${cardGrid([[irrigationToolLinks[2][0], irrigationToolLinks[2][1], "For sprays and rotors: use actual nozzle flow and layout."], [irrigationToolLinks[4][0], irrigationToolLinks[4][1], "For drip: total direct emitters or row geometry, never both."], [irrigationToolLinks[6][0], irrigationToolLinks[6][1], "For weak coverage: isolate scope, demand, restriction, leak and source evidence."]], "Use tool")}</section>
<section class="section"><h2>Guides and connected systems</h2>${cardGrid(irrigationGuideLinks, "Read guide")}${cardGrid([["/systems/pumps-pressure-pipe/", "Pumps, Pressure & Pipe Flow", "Use TDH, pipe loss and pump curve tools for complete hydraulic review."], ["/systems/wells-storage-rainwater/", "Wells, Storage & Rainwater", "Connect a well, storage or rainwater source before setting irrigation demand."], ["/systems/greywater-reuse/", "Greywater Reuse Planning", "Match a locally allowed wastewater supply to ET demand and receiving capacity."]], "Open system")}</section>
<section class="section"><div class="notice"><strong>Safety and local requirements.</strong> Use current product data and local watering rules. Do not bypass backflow protection, open energized controls, excavate without utility location or dismantle pressurized piping. These screens do not certify code compliance or distribution uniformity.</div></section>`;

const treatmentSystemBody = `${hero("System hub / Phase 4", "Water Treatment & Water Quality", "Move from source-water evidence to a treatment objective, compatible stages, hydraulic review and ongoing verification without treating one device as a universal solution.", "Laboratory results describe the tested sample and method. They do not make an untested source safe, and a certified product claim applies only to the listed contaminant and operating conditions.", '<div class="hero-actions"><a class="button" href="/guides/read-water-test-report/">Read the water test first</a><a class="button secondary" href="/tools/water-treatment-train-selector/">Build a candidate train</a></div>')}
<div class="status-strip"><span>8 tools</span><span>3 guides</span><span>2 references</span><span>Initial planned scope complete</span></div>
<section class="section"><h2>The source-to-monitoring sequence</h2><div class="flow-line"><span>Source water</span><span>Water testing</span><span>Problem identification</span><span>Pretreatment</span><span>Primary treatment</span><span>Polishing / disinfection</span><span>Storage</span><span>Distribution</span><span>Monitoring</span></div><p class="lede">Start with the source, intended use and an appropriate laboratory test. Select stages for confirmed problems, then check peak flow, pressure loss, waste streams, maintenance and follow-up testing.</p></section>
<section class="section"><h2>Why the order matters</h2><div class="content-layout"><article class="article-body"><p>Observation can identify color, odor, scale or sediment, but it cannot confirm microorganisms, nitrate, toxic chemicals or potable safety. Sediment and turbidity can interfere with fine treatment or disinfection; oxidation can change filter loading; softening creates regeneration waste; RO creates reject water; carbon and UV need defined upstream conditions.</p><p>Peak flow determines whether treatment can serve the property without excessive pressure loss, while daily volume determines capacity, regeneration, reject and storage. Include each device’s pressure drop in pump duty and distinguish potable from non-potable requirements.</p></article><aside class="sidebar"><h2>Responsibility changes</h2><ul><li>Public supply: contact the utility before treating a sudden system-wide change.</li><li>Private well: the owner typically manages testing and corrective action under local rules.</li><li>Rainwater: intended use, separation and local public-health rules govern treatment.</li><li>Surface water: drinking use requires validated multi-barrier and authority review.</li></ul></aside></div></section>
<section class="section"><h2>Recommended workflow</h2>${cardGrid([[treatmentGuideLinks[0][0], treatmentGuideLinks[0][1], "Check sample, units, method, detection limits and jurisdiction."], [treatmentReferenceLinks[0][0], treatmentReferenceLinks[0][1], "Separate hardness, turbidity, TDS, microorganisms and other parameters."], [treatmentToolLinks[7][0], treatmentToolLinks[7][1], "Build evidence-led candidate stages and expose missing data."], [treatmentGuideLinks[1][0], treatmentGuideLinks[1][1], "Compare sediment, carbon, softening, RO and UV boundaries."], [treatmentToolLinks[0][0], treatmentToolLinks[0][1], "Size only the applicable treatment step from measured inputs."], ["/tools/total-dynamic-head-calculator/", "Storage and pumping review", "Add treatment pressure loss, peak flow, storage and controls."], [treatmentGuideLinks[2][0], treatmentGuideLinks[2][1], "Check interactions, drainage, maintenance and monitoring."]], "Open step")}</section>
<section class="section"><h2>Tools on the treatment bench</h2>${cardGrid(treatmentToolLinks, "Use tool")}</section>
<section class="section"><h2>Guides and references</h2>${cardGrid(treatmentGuideLinks, "Read guide")}${cardGrid(treatmentReferenceLinks, "Open reference")}</section>
<section class="section"><h2>Connected source and hydraulic systems</h2>${cardGrid([["/systems/wells-storage-rainwater/", "Wells, Storage & Rainwater", "Connect private-well responsibility, rainwater source control and usable storage."], ["/systems/pumps-pressure-pipe/", "Pumps, Pressure & Pipe Flow", "Account for treatment pressure loss, backwash flow and pump duty."], ["/systems/irrigation-sprinklers/", "Irrigation & Sprinkler Systems", "Match treatment need and water quality to the intended non-potable or locally approved use."], ["/systems/greywater-reuse/", "Greywater Reuse Planning", "Keep wastewater source, exposure, cross-connection and local-rule boundaries explicit."]], "Open system")}</section>
<section class="section"><div class="notice"><strong>Health, chemical and regulatory boundary.</strong> Do not infer drinking-water safety from appearance, symptoms or this site. Use accredited testing, local health or utility guidance, current product labels and SDS, official certification listings and qualified design where required. Never mix hypochlorite with acids, ammonia or other products.</div></section>`;

const greywaterSystemBody = `${hero("System hub / validated expansion", "Greywater Reuse Planning", "Connect measured household greywater supply to an allowed non-potable demand, event distribution, receiving capacity and transparent economics.", "Greywater is wastewater, not drinking water. Source definitions, permitted uses, treatment, storage, setbacks and plumbing rules vary by jurisdiction.", '<div class="hero-actions"><a class="button" href="/tools/greywater-supply-calculator/">Estimate measured supply</a><a class="button secondary" href="/guides/plan-home-greywater-reuse-system/">Read the planning workflow</a></div>')}
<div class="status-strip"><span>5 tools</span><span>2 guides</span><span>1 screening reference</span><span>Supply → demand → event → basin → cost</span></div>
<section class="section"><h2>The reuse workflow</h2><div class="flow-line"><span>Allowed source</span><span>Measured volume</span><span>Allowed end use</span><span>Landscape demand</span><span>Event distribution</span><span>Infiltration</span><span>Diversion & maintenance</span></div><p class="lede">Start with the local rule and actual source volume. Match that volume to seasonal demand, then test each short discharge event against outlets and receiving basins. Economics comes after a feasible and maintainable layout.</p></section>
<section class="section"><h2>Recommended sequence</h2>${cardGrid([[greywaterReferenceLinks[0][0], greywaterReferenceLinks[0][1], "Identify source characteristics, prohibited assumptions and local approvals."], [greywaterToolLinks[0][0], greywaterToolLinks[0][1], "Measure fixtures and appliance cycles instead of relying on household defaults."], [greywaterToolLinks[1][0], greywaterToolLinks[1][1], "Compare weekly supply with local ET, rainfall and plant demand."], [greywaterToolLinks[2][0], greywaterToolLinks[2][1], "Turn one laundry event into a whole-outlet distribution."], [greywaterToolLinks[3][0], greywaterToolLinks[3][1], "Screen receiving capacity and drain-down using field inputs."], [greywaterToolLinks[4][0], greywaterToolLinks[4][1], "Use local tariffs and maintenance costs to screen economics."]], "Open step")}</section>
<section class="section"><h2>Tools on the reuse bench</h2>${cardGrid(greywaterToolLinks, "Use tool")}</section>
<section class="section"><h2>Planning and troubleshooting</h2>${cardGrid(greywaterGuideLinks, "Read guide")}${cardGrid(greywaterReferenceLinks, "Open reference")}</section>
<section class="section"><h2>Connected systems</h2>${cardGrid([["/systems/irrigation-sprinklers/", "Irrigation & Sprinkler Systems", "Use ET demand, hydrozones and field observation to avoid over-application."], ["/systems/water-treatment-quality/", "Water Treatment & Water Quality", "Keep non-potable quality, exposure, treatment and monitoring boundaries visible."], ["/systems/wells-storage-rainwater/", "Wells, Storage & Rainwater", "Compare reuse with other source and storage options without combining unlike water qualities."]], "Open system")}</section>
<section class="section"><div class="notice"><strong>Public-health and plumbing boundary.</strong> Never connect greywater to potable piping, spray it where people can contact it, or assume storage is safe. Preserve sewer/septic diversion, avoid runoff and ponding, and obtain the approvals and qualified work required locally.</div></section>`;

const vehicleWashSystemBody = `${hero("System hub / validated expansion", "Vehicle Wash Water Reclaim Planning", "Connect a metered per-vehicle baseline to reclaim balance, peak buffer capacity, spot-free RO production and transparent retrofit economics.", "Reclaimed vehicle-wash water is non-potable process water. Quantity planning does not establish treatment performance, chemical compatibility, safe exposure or lawful discharge.", '<div class="hero-actions"><a class="button" href="/tools/vehicle-wash-water-use-audit-calculator/">Audit water use</a><a class="button secondary" href="/guides/plan-vehicle-wash-water-reclaim-retrofit/">Read the retrofit workflow</a></div>')}
<div class="status-strip"><span>5 operator tools</span><span>2 field guides</span><span>1 stream-map reference</span><span>Meter → balance → buffer → verify</span></div>
<section class="section"><h2>The operator workflow</h2><div class="flow-line"><span>Meter baseline</span><span>Map streams</span><span>Balance reclaim</span><span>Simulate peak</span><span>Plan spot-free RO</span><span>Check payback</span><span>Monitor</span></div><p class="lede">Start with a meter interval and matching vehicle count. Separate the process streams before applying a recovery claim, then test peak storage and spot-free production. Economics follows a physically feasible balance and current local costs.</p></section>
<section class="section"><h2>Recommended sequence</h2>${cardGrid([[vehicleWashToolLinks[0][0], vehicleWashToolLinks[0][1], "Build the fresh-water baseline from a comparable meter interval."], [vehicleWashReferenceLinks[0][0], vehicleWashReferenceLinks[0][1], "Separate fresh, reclaim, spot-free, reject, carryout and discharge streams."], [vehicleWashToolLinks[1][0], vehicleWashToolLinks[1][1], "Apply entered collection and treatment performance without double counting."], [vehicleWashToolLinks[2][0], vehicleWashToolLinks[2][1], "Test starting storage, delayed return and reserve through a peak window."], [vehicleWashToolLinks[3][0], vehicleWashToolLinks[3][1], "Match measured permeate production and storage to spot-free demand."], [vehicleWashToolLinks[4][0], vehicleWashToolLinks[4][1], "Use current tariffs, operating costs and measured volumes for payback."]], "Open step")}</section>
<section class="section"><h2>Tools on the reclaim bench</h2>${cardGrid(vehicleWashToolLinks, "Use tool")}</section>
<section class="section"><h2>Planning resources</h2>${cardGrid(vehicleWashGuideLinks, "Read guide")}${cardGrid(vehicleWashReferenceLinks, "Open reference")}</section>
<section class="section"><h2>Connected systems</h2>${cardGrid([["/systems/water-treatment-quality/", "Water Treatment & Water Quality", "Use test evidence and verified equipment data without treating wash-water reuse as potable treatment."], ["/systems/pumps-pressure-pipe/", "Pumps, Pressure & Pipe Flow", "Check actual transfer and delivery duty after quantity and storage are defined."], ["/systems/greywater-reuse/", "Greywater Reuse Planning", "Compare reuse principles while keeping household wastewater and vehicle-wash process water separate."]], "Open system")}</section>
<section class="section"><div class="notice"><strong>Environmental and workplace boundary.</strong> Do not route wastewater, reject, sludge or backwash from these quantity results. Confirm oil-water separation, treatment, chemical compatibility, sewer acceptance, stormwater protection, electrical safety and required permits with qualified parties and current authorities.</div></section>`;

const metalSystemBody = `${hero("System hub / validated expansion", "Metal Finishing Rinse Water Optimization", "Connect a matched meter baseline to measured drag-out, countercurrent staging, operating-log verification and transparent economics.", "This workflow addresses quantity and operational comparison only. It never sets chemistry, rinse acceptance, worker exposure or discharge limits.", '<div class="hero-actions"><a class="button" href="/tools/metal-finishing-rinse-water-audit-calculator/">Audit rinse water</a><a class="button secondary" href="/guides/reduce-metal-finishing-rinse-water/">Read the reduction workflow</a></div>')}
<div class="status-strip"><span>5 operator tools</span><span>1 field guide</span><span>1 methods reference</span><span>Audit → drag-out → stage → verify → value</span></div>
<section class="section"><h2>The rinse-water workflow</h2><div class="flow-line"><span>Meter baseline</span><span>Measure drag-out</span><span>Compare stages</span><span>Control flow</span><span>Verify logs</span><span>Check payback</span></div><p class="lede">Define a defensible boundary first. Reduce carried solution before reducing rinse flow, compare staging with an explicit process target, and verify the changed line with production and conductivity evidence.</p></section>
<section class="section"><h2>Recommended sequence</h2>${cardGrid([[metalToolLinks[0][0], metalToolLinks[0][1], "Match meter, time and production loads."], [metalToolLinks[1][0], metalToolLinks[1][1], "Measure solution retained by the work and fixtures."], [metalToolLinks[2][0], metalToolLinks[2][1], "Compare ideal stage configurations with an entered criterion."], [metalToolLinks[3][0], metalToolLinks[3][1], "Check water per load, idle flow and control excursions."], [metalToolLinks[4][0], metalToolLinks[4][1], "Apply current site costs after operational feasibility."], [metalReferenceLinks[0][0], metalReferenceLinks[0][1], "Choose the next method by its required evidence."]], "Open step")}</section>
<section class="section"><h2>Tools on the rinse bench</h2>${cardGrid(metalToolLinks, "Use tool")}</section>
<section class="section"><h2>Field method</h2>${cardGrid(metalGuideLinks, "Read guide")}${cardGrid(metalReferenceLinks, "Open reference")}</section>
<section class="section"><h2>Connected systems</h2>${cardGrid([["/systems/pumps-pressure-pipe/", "Pumps, Pressure & Pipe Flow", "Check delivery hydraulics only after the required rinse flow is defined."], ["/systems/water-treatment-quality/", "Water Treatment & Water Quality", "Keep general treatment calculations separate from process chemistry and discharge approval."]], "Open system")}</section>
<section class="section"><div class="notice"><strong>Chemical, worker and environmental boundary.</strong> Use current SDS, PPE, ventilation, spill, wastewater and permit requirements. Never change a critical rinse or discharge solely from a modeled water-saving result; commission with qualified process and environmental review.</div></section>`;

const monitoringWellSystemBody = `${hero("System hub / validated expansion", "Monitoring Well Purging & Low-Flow Sampling", "Connect well construction and measured water levels to setup geometry, equipment displacement, time-ordered field readings and an auditable stabilization record.", "This workflow supports field preparation and numeric comparison only. The approved sampling plan, site conditions and qualified field lead control method selection and authorization.", '<div class="hero-actions"><a class="button" href="/tools/low-flow-sampling-setup-checker/">Check the field setup</a><a class="button secondary" href="/guides/plan-monitoring-well-purging-low-flow-sampling/">Read the field workflow</a></div>')}
<div class="status-strip"><span>4 field tools</span><span>1 planning guide</span><span>1 parameters reference</span><span>Geometry → displacement → readings → record</span></div>
<section class="section"><h2>The field-evidence workflow</h2><div class="flow-line"><span>Review plan</span><span>Confirm well</span><span>Measure water</span><span>Place intake</span><span>Set flow</span><span>Log readings</span><span>Document handoff</span></div><p class="lede">Start from the governing plan and current well record. Keep screen, intake, water level and equipment volume explicit; then compare a complete local log with criteria copied from that plan.</p></section>
<section class="section"><h2>Recommended sequence</h2>${cardGrid([[monitoringWellGuideLinks[0][0], monitoringWellGuideLinks[0][1], "Confirm scope, roles, well record, safety, instruments and waste route."], [monitoringWellToolLinks[0][0], monitoringWellToolLinks[0][1], "Calculate standing volume only when the approved method needs it."], [monitoringWellToolLinks[1][0], monitoringWellToolLinks[1][1], "Check intake, screen, water level, drawdown and entered flow limits."], [monitoringWellToolLinks[2][0], monitoringWellToolLinks[2][1], "Allow the entered equipment-volume exchanges before each reading."], [monitoringWellToolLinks[3][0], monitoringWellToolLinks[3][1], "Analyze every time-ordered row without silent omission."], [monitoringWellReferenceLinks[0][0], monitoringWellReferenceLinks[0][1], "Keep field parameters, calculations and evidence boundaries visible."]], "Open step")}</section>
<section class="section"><h2>Tools on the field bench</h2>${cardGrid(monitoringWellToolLinks, "Use tool")}</section>
<section class="section"><h2>Planning resources</h2>${cardGrid(monitoringWellGuideLinks, "Read guide")}${cardGrid(monitoringWellReferenceLinks, "Open reference")}</section>
<section class="section"><h2>Connected systems</h2>${cardGrid([["/systems/wells-storage-rainwater/", "Wells, Storage & Rainwater", "Use construction and water-level evidence without confusing monitoring sampling with supply-well sizing."], ["/systems/water-treatment-quality/", "Water Treatment & Water Quality", "Keep field stabilization separate from laboratory interpretation and treatment selection."], ["/systems/pumps-pressure-pipe/", "Pumps, Pressure & Pipe Flow", "Use general hydraulics only where the approved field setup requires a separate equipment review."]], "Open system")}</section>
<section class="section"><div class="notice"><strong>Sampling, health and environmental boundary.</strong> These pages never choose a sampling method, approve a well, establish representativeness, specify bottles or preservation, interpret laboratory results or authorize purge-water routing. Follow the approved plan, current authority requirements and qualified field direction.</div></section>`;

const guideData = [
  {
    path: guideLinks[0][0], h1: "How to Size a Water Pump from Flow and Total Dynamic Head",
    description: "A step-by-step pump sizing workflow from required flow and static head through friction, duty point, efficiency and NPSH.",
    intro: "Pump sizing starts with the system, not a motor rating or nominal pipe size. Define how much water must arrive and the head the system requires at that flow.",
    sections: [
      ["1. Define required flow", "State the demand basis: simultaneous fixtures, a process requirement, irrigation zone demand, refill time or measured draw. Separate average use from peak duty. A storage tank can change the instantaneous pump flow even when daily demand stays the same."],
      ["2. Establish static head", "Measure vertical elevation from the relevant source water level or pump reference to the delivery point. Do not use sloping pipe length as elevation. Check minimum and maximum source levels where they change."],
      ["3. Add delivery pressure", "Convert the required gauge pressure at the delivery point to head. Record the gauge elevation and whether the target is a minimum dynamic pressure or merely a static reading."],
      ["4. Calculate friction and minor losses", "Use actual internal diameter, duty flow, length and a justified roughness or C value. Add valves, fittings, treatment devices and control components using loss coefficients, equivalent length or manufacturer data—without counting the same loss twice."],
      ["5. Build TDH", "Add elevation, delivery pressure head and flow-dependent losses, then subtract available inlet pressure head. Calculate more than one operating case if levels, demands or valve positions change."],
      ["6. Read the pump curve", "Find where the system requirement meets the manufacturer curve. Check efficiency, power, allowable operating region and shutoff behavior. A candidate that barely touches one duty point may not handle variation."],
      ["7. Check suction conditions", "Estimate NPSHA with absolute pressure, water level, suction losses and vapor pressure. Compare it with NPSHR plus the application-specific margin required by the manufacturer and applicable guidance."],
      ["8. Check power and control", "Use duty-point efficiency—not a marketing peak—to estimate shaft and electrical input. Confirm the complete power curve, motor selection, control strategy and minimum flow."],
      ["Common mistakes", "Guessing friction, using nominal rather than internal diameter, treating static pressure as dynamic pressure, choosing a pump by pipe connection size, and adding an arbitrary large safety factor can all move operation away from a reliable region."]
    ],
    example: "Required flow is 120 L/min. Static lift is 18 m, delivery pressure is 250 kPa, pipe and equipment losses total 8.5 m, and flooded inlet pressure contributes 35 kPa. TDH is approximately 48.4 m. The preliminary duty point is therefore 120 L/min at 48.4 m—not simply “a 120 L/min pump.”",
    sources: [sources.doe, sources.hiCurve, sources.hiFaq],
    related: [[toolLinks[0][0], toolLinks[0][1]], [toolLinks[1][0], toolLinks[1][1]], [toolLinks[5][0], toolLinks[5][1]], [toolLinks[3][0], toolLinks[3][1]], [toolLinks[6][0], toolLinks[6][1]]]
  },
  {
    path: guideLinks[1][0], h1: "How to Read a Pump Curve and Find the Duty Point",
    description: "Understand flow, head, system curves, efficiency islands, operating regions and the duty point on a manufacturer pump curve.",
    intro: "A pump curve describes how one pump configuration behaves; a system curve describes what the connected system demands. Their intersection is the operating point.",
    sections: [
      ["Flow and head axes", "Flow is normally on the horizontal axis and total head on the vertical axis. Confirm units before comparing the curve with a system requirement."],
      ["Head-capacity curve", "For many rotodynamic pumps, produced head decreases as flow increases. Curves apply to a stated speed, impeller diameter and fluid condition."],
      ["System curve and duty point", "Static head remains when flow is zero; friction grows strongly with flow. The intersection of system and pump curves is the expected duty point, subject to control and system variation."],
      ["Efficiency island and BEP", "Efficiency contours identify operating efficiency and the best efficiency point. Reliability depends on operating region, not only the peak efficiency number."],
      ["Shutoff and runout", "Shutoff is the zero-flow head at the left end of the curve. Runout is the high-flow end. Neither should be treated as a normal duty point without manufacturer guidance."],
      ["Impeller diameter and speed", "A family chart may show multiple trims or speeds. Confirm the exact curve for the proposed configuration; do not combine points from different trims."],
      ["Series and parallel", "Series pumps add head at a common flow; parallel pumps add flow at a common head in an idealized view. The actual combined operating point still depends on the system curve and controls."],
      ["Power and NPSH curves", "Check shaft/input power across the operating range and confirm motor non-overload. Review NPSHR/NPSH3 and required margin separately from head performance."],
      ["How to verify a candidate", "Use the current manufacturer curve or certified test data, match speed and impeller, plot all expected system cases, and check the allowable or preferred operating region."]
    ],
    example: "A curve gives 53 m at 100 L/min and 31 m at 200 L/min. Linear screening at 120 L/min gives 48.6 m. If the system requires 48 m, the margin is about 1.3%; the full curve and operating tolerance deserve close review.",
    sources: [sources.hiFaq, sources.hiCurve, sources.hiNpsh],
    related: [[toolLinks[5][0], toolLinks[5][1]], [toolLinks[0][0], toolLinks[0][1]], [toolLinks[3][0], toolLinks[3][1]], [toolLinks[6][0], toolLinks[6][1]], [referenceLinks[4][0], referenceLinks[4][1]]]
  },
  {
    path: guideLinks[2][0], h1: "How to Diagnose Low Water Pressure Without Guessing",
    description: "A safe measurement-led workflow for separating pressure, flow, local restrictions, utility supply, PRVs, filters, leaks and pump-system issues.",
    intro: "Low pressure is a symptom. The useful first step is to identify scope and measure how pressure changes when flow begins.",
    sections: [
      ["Pressure is not flow", "Pressure is potential energy per volume; flow is the delivered rate through a path. A static gauge can look normal while a restriction causes severe pressure loss under flow."],
      ["Static versus dynamic pressure", "Record pressure with no intentional draw, then under a known flow. Note gauge location and elevation. A large drop under flow points toward source or path limitations."],
      ["Whole-system versus local", "One weak fixture suggests a local valve, aerator, hose, branch or device. A whole-property change points toward supply, PRV, treatment, main piping or a pumped source."],
      ["Utility or shared supply", "Ask whether neighbors or other zones are affected and whether the issue varies by time. Contact the supplier for sudden widespread changes or meter-side concerns rather than altering utility equipment."],
      ["PRVs and filters", "Compare safe upstream/downstream readings under static and flowing conditions. Do not dismantle a PRV or bypass treatment contrary to manufacturer or water-quality requirements."],
      ["Pipe restriction or undersizing", "Use measured flow, actual ID and length to estimate friction. Corrosion, closed valves, flexible connectors and local restrictions may differ from a clean-pipe calculation."],
      ["Leaks", "A sudden pressure change, unexplained meter movement, damp areas or pump cycling can indicate leakage. Escalate active flooding, electrical exposure or structural risk."],
      ["Well pump and pressure tank", "Record cut-in/cut-out behavior, pressure under demand and cycling symptoms. Do not open electrical controls or a pressurized tank."],
      ["When a booster helps", "A booster can address a genuine pressure deficit only after available flow, minimum inlet pressure, losses and target pressure are understood. It cannot create source capacity."]
    ],
    example: "Static pressure is 310 kPa but falls to 140 kPa at 18 L/min at every outlet. A filter is installed. Compare pressure before and after the filter under the same flow; if the drop is concentrated there, a booster is not the first conclusion.",
    sources: [sources.usgs, sources.doe, sources.hiCurve],
    related: [[toolLinks[8][0], toolLinks[8][1]], [toolLinks[1][0], toolLinks[1][1]], [toolLinks[4][0], toolLinks[4][1]], [referenceLinks[1][0], referenceLinks[1][1]], ["/systems/pumps-pressure-pipe/", "Parent pump system workflow"]]
  }
];

guideData.push(
  {
    path: phase2GuideLinks[0][0], h1: "Well, Borehole & Tube Well Terminology",
    description: "Compare global use of well, borehole and tube-well terms while keeping construction, aquifer and pumping details explicit.",
    intro: "Water-source terms vary by region and trade. A label alone does not define diameter, lining, completion, aquifer, yield or water quality.",
    sections: [
      ["Well", "Well is a broad English term for an excavation or drilled opening used to access groundwater. It may describe hand-dug, driven, bored or drilled construction, so record the method and completion."],
      ["Borehole", "Borehole often emphasizes a drilled hole and is widely used outside North America. Some boreholes are monitoring or investigation holes rather than production water wells."],
      ["Tube well", "Tube well commonly describes a relatively narrow well formed with pipe or casing, often screened in unconsolidated deposits. Regional usage and construction standards differ."],
      ["Static water level", "The nonpumping water level referenced to a stated datum and measured after an appropriate recovery period. Record date and recent pumping."],
      ["Pumping water level and drawdown", "Pumping water level is measured while the well is discharging at a stated rate. Drawdown is the difference between static and pumping level."],
      ["Yield and specific capacity", "Yield is a discharge rate under stated test conditions. Specific capacity is yield per unit drawdown and can vary with pumping rate and time."],
      ["Casing, screen and open interval", "These construction details determine where groundwater enters and how the opening is stabilized. A pump setting must respect the completed well and water-bearing interval."],
      ["A useful record", "Record coordinates, datum, depth, casing and screen, pump setting, test rate and duration, levels over time, recovery, water quality and the local professional’s terminology."]
    ],
    example: "A record reading only “45 m borehole, 20 L/min” is incomplete. Add static level 12 m, pumping level 26 m after a stated test, pump setting 35 m, screen interval, test duration and date.",
    sources: [sources.usgsGlossary, sources.usgsHydrology],
    related: [[phase2ToolLinks[0][0], phase2ToolLinks[0][1]], [phase2ToolLinks[1][0], phase2ToolLinks[1][1]], [phase2GuideLinks[1][0], phase2GuideLinks[1][1]], ["/systems/wells-storage-rainwater/", "Wells, Storage & Rainwater"]]
  },
  {
    path: phase2GuideLinks[1][0], h1: "Complete Well Water System Planning",
    description: "Plan a well water system from sustained yield and demand through pump duty, controls, pressure tank, storage and water quality.",
    intro: "A well system succeeds when source, pump, controls, storage, treatment and end-use demand work together across realistic operating cases.",
    sections: [
      ["1. Document the well", "Collect construction records, datum, static and pumping levels, pump setting, test method, test duration, recovery and seasonal history. Keep test yield separate from a recommended sustained withdrawal."],
      ["2. Build demand cases", "Separate average daily volume, peak flow, peak duration, refill windows and emergency or outage demand. State every assumption instead of using one unexplained per-person number."],
      ["3. Compare source and demand", "Check daily source production at a defensible pumping schedule and calculate the peak-period storage gap. A daily surplus does not guarantee peak flow."],
      ["4. Build the pump duty point", "Use the representative pumping level, discharge elevation, required dynamic pressure and all flow-dependent losses. Check seasonal low-level and maximum-pressure cases."],
      ["5. Read the exact pump curve", "Confirm configuration, efficiency, motor load, allowable region, shutoff pressure and changing water levels. Do not size from horsepower or connection diameter alone."],
      ["6. Plan controls and protection", "Coordinate pressure switch or variable-speed control, dry-run protection, level controls, check valves, relief provisions and safe electrical installation."],
      ["7. Size pressure and bulk storage", "Use pressure-tank drawdown to meet motor run-time objectives. Use bulk storage for slow source flow, peaks, outages or scheduled refill; these are different functions."],
      ["8. Address water quality", "Protect the wellhead, test through an appropriate laboratory, select treatment for measured conditions and include treatment pressure loss and maintenance."],
      ["9. Commission and monitor", "Record dynamic pressure, flow, start frequency, pumping level, recovery and water quality. Preserve baseline data so changes can be diagnosed."]
    ],
    example: "A 12 L/min sustained source covers 4,500 L/day within a 10-hour pumping window, but a 30 L/min 90-minute peak creates a 1,620 L gap before reserve. That storage decision then changes the pump’s required instantaneous flow.",
    sources: [sources.usgsHydrology, sources.usgsGlossary, sources.hiCurve],
    related: [[phase2ToolLinks[1][0], phase2ToolLinks[1][1]], [phase2ToolLinks[0][0], phase2ToolLinks[0][1]], [phase2ToolLinks[2][0], phase2ToolLinks[2][1]], [phase2ToolLinks[4][0], phase2ToolLinks[4][1]], [phase2ReferenceLinks[0][0], phase2ReferenceLinks[0][1]]]
  },
  {
    path: phase2GuideLinks[2][0], h1: "Pressure Tank Drawdown & Pump Short Cycling",
    description: "Understand pressure-tank precharge, cut-in, cut-out, drawdown, minimum pump run time and short-cycling symptoms.",
    intro: "Tank shell volume is not usable drawdown. Pressure settings and air charge determine how much water leaves between pump stops and starts.",
    sections: [
      ["Tank volume versus drawdown", "Nominal tank volume includes the air and water spaces. Manufacturer drawdown tables state usable water between the specified cut-out and cut-in pressures."],
      ["Precharge", "Precharge is checked with electrical power isolated and the water side fully drained. Conventional manufacturer instructions commonly specify a value just below cut-in; follow the exact product instructions."],
      ["Cut-in and cut-out", "Cut-in starts the pump at the lower pressure; cut-out stops it at the upper pressure. Changing either affects drawdown, maximum pressure and system behavior."],
      ["Minimum run time", "Required drawdown can be screened as pump flow multiplied by desired minimum run time. Actual allowable starts and run requirements come from the pump and motor manufacturer."],
      ["Common short-cycle symptoms", "Frequent starts, brief on-time, rapidly swinging pressure or cycling with no intentional demand can point to low drawdown, lost air charge, bladder failure, leaks, check-valve leakage or control faults."],
      ["Measure before adjusting", "Record starts over a defined interval, on/off durations, dynamic demand, cut-in/out pressure and tank drawdown. One symptom does not establish the cause."],
      ["Variable-speed systems", "Small pressure tanks in variable-speed systems serve different control functions. Use the drive and pump manufacturer’s sizing and precharge instructions rather than a conventional rule."],
      ["Safety boundary", "Pressure vessels and electrical controls store hazardous energy. Isolate, depressurize and use qualified service where required."]
    ],
    example: "A 40 L/min pump with a 1-minute run-time target needs at least 40 L rated drawdown. If an existing tank supplies only 20 L, the ideal cycle target cannot be met even if the tank shell is much larger than 40 L.",
    sources: [sources.pentairTank, sources.hiFaq],
    related: [[phase2ToolLinks[2][0], phase2ToolLinks[2][1]], [phase2ToolLinks[3][0], phase2ToolLinks[3][1]], [toolLinks[8][0], toolLinks[8][1]], [phase2GuideLinks[1][0], phase2GuideLinks[1][1]]]
  },
  {
    path: phase2GuideLinks[3][0], h1: "Water Storage for Demand, Outages & Refill",
    description: "Plan water storage by separating average demand, peak use, outage duration, partial refill, reserve, usable volume and water quality.",
    intro: "A storage volume is meaningful only when its demand period, refill assumption, reserve and usable fraction are stated.",
    sections: [
      ["Start with a demand schedule", "List essential and discretionary uses, average daily volume, peak rates and seasonal changes. Do not hide occupancy, irrigation or process assumptions inside a universal default."],
      ["No-refill scenario", "Daily demand multiplied by the outage or autonomy period gives the basic usable volume when no source is available."],
      ["Partial-refill scenario", "Subtract only refill that is credibly available during the same period. A rated source flow is not continuous refill unless operating time and reliability support it."],
      ["Reserve", "Add a transparent reserve for uncertainty or operational policy. Fire storage and regulated emergency storage should remain separate unless an authority directs otherwise."],
      ["Usable versus nominal volume", "Dead storage, pump-off level, sediment allowance, thermal constraints and operating setpoints can make nominal capacity larger than usable capacity."],
      ["Peak flow and delivery", "A tank can hold enough daily volume but still fail to deliver the required peak flow or pressure. Check outlet, pump and pipe hydraulics separately."],
      ["Water age and quality", "Oversized storage can reduce turnover. Protect inlets, vents, overflows and access; use suitable materials and maintenance, testing and treatment for the intended use."],
      ["Sensitivity cases", "Compare lower refill, longer outage, higher demand and reduced usable volume. Report the assumptions with the selected capacity."]
    ],
    example: "For 2,000 L/day over 3 days, no-refill demand is 6,000 L. Reliable 5 L/min refill for 4 hours/day contributes 3,600 L; 20% reserve and 90% usable fraction lead to 3,200 L nominal storage.",
    sources: [sources.epaEmergency, sources.cdcCistern],
    related: [[phase2ToolLinks[4][0], phase2ToolLinks[4][1]], [phase2ToolLinks[1][0], phase2ToolLinks[1][1]], [phase2ReferenceLinks[0][0], phase2ReferenceLinks[0][1]], [phase2ToolLinks[6][0], phase2ToolLinks[6][1]]]
  },
  {
    path: phase2GuideLinks[4][0], h1: "Rainwater Harvesting System Planning",
    description: "Plan a rainwater system from horizontal catchment area and rainfall through first flush, storage, overflow, treatment and intended end use.",
    intro: "Rainwater quantity and quality change with roof, weather, storage and use. Plan the complete path instead of choosing a tank from annual rainfall alone.",
    sections: [
      ["1. Define intended use", "Irrigation, toilet flushing, washing and potable uses have different quality and regulatory implications. Confirm what is permitted and how rainwater must be separated from safe piped water."],
      ["2. Measure catchment area", "Use the horizontal plan area that actually drains to the tank, not the sloping roof surface. Confirm gutters and downpipes can convey the relevant rainfall intensity."],
      ["3. Use local rainfall", "Collect representative monthly or daily records and test dry, typical and wet years. Annual averages hide timing."],
      ["4. Account for losses", "Runoff coefficient, first flush, gutter overflow, leakage and collection efficiency reduce gross area-times-rainfall yield. Keep each assumption visible."],
      ["5. Control debris and first flush", "Screens and source controls reduce debris. Size and maintain any first-flush device to applicable guidance; diverted water reduces available yield."],
      ["6. Simulate storage", "Step inflow, overflow and demand through time. Compare tank capacities using reliability, unmet demand, overflow and empty periods rather than yield alone."],
      ["7. Protect the tank", "Provide safe covers, screened vents and overflows, mosquito control, access, drainage, foundations and maintenance. Prevent floodwater and contaminants entering."],
      ["8. Pump, treat and separate", "Check required pressure and pipe losses. Treatment must address measured hazards and intended use; rainwater must not backflow into treated-water piping."],
      ["9. Operate and verify", "Inspect roof and controls, clean screens and diverters, manage sediment and test water as required. Revisit demand and rainfall assumptions after operation."]
    ],
    example: "A 150 m² roof receiving 80 mm can intercept 12,000 L gross. After 0.9 runoff, 0.85 efficiency and 100 L fixed loss, about 9,080 L reaches storage—but tank overflow and later dry days require a time-step simulation.",
    sources: [sources.cdcRain, sources.doeRain, sources.yourHome],
    related: [[phase2ToolLinks[5][0], phase2ToolLinks[5][1]], [phase2ToolLinks[6][0], phase2ToolLinks[6][1]], [phase2ToolLinks[7][0], phase2ToolLinks[7][1]], [phase2ToolLinks[4][0], phase2ToolLinks[4][1]], ["/systems/wells-storage-rainwater/", "Wells, Storage & Rainwater"]]
  }
);

guideData.push({
  path: metalGuideLinks[0][0], h1: metalGuideLinks[0][1], reviewed: "August 24, 2026",
  description: "A measurement-led workflow to reduce metal-finishing rinse water by limiting drag-out, staging rinses, controlling flow and verifying results.",
  intro: "Effective rinse-water reduction starts with a matched water and production baseline, then prevents contamination carryover before restricting flow.",
  sections: [
    ["1. Define the boundary", "Identify the exact rinse stages, meter, products and operating state. Match meter start/end, elapsed production time and loads; exclude maintenance or document it separately."],
    ["2. Measure drag-out safely", "Use a qualified process-approved retention study for each important rack, barrel or product family. Record drain time, orientation and retained solution; never improvise handling of hazardous chemistry."],
    ["3. Prevent carryover first", "Review drain time, rack orientation, withdrawal rate, drip boards and return practices with process specialists. Less carried solution lowers both chemical loss and rinse duty."],
    ["4. Compare countercurrent stages", "Use measured drag-out and a process-specific dilution criterion. The ideal mixed-stage equation is a screen; geometry, transfer sequence and production variation require commissioning evidence."],
    ["5. Control flow to production", "Avoid unattended idle flow. Consider manual shutoff discipline, flow restrictors, conductivity control or production interlocks only where fail states and process acceptance have been reviewed."],
    ["6. Verify with logs", "Track flow, production loads and a suitable local control signal. Compare like products and bath conditions, investigate excursions and retain evidence around each operating change."],
    ["7. Value the verified change", "Apply current water, sewer, pretreatment, sludge and operating costs to measured baseline and proposed flow. Test downtime and lower-production cases."],
    ["8. Keep the boundary visible", "A quantity result does not authorize chemistry changes or discharge. Maintain SDS, exposure controls, permit conditions, sampling and qualified process/environmental review."]
  ],
  example: "A line measuring 1,000 L/h at 200 loads per eight-hour shift uses 40 L/load. After drag-out controls and staged rinsing, a verified 180 L/h uses 7.2 L/load; annual economics should use the verified 820 L/h reduction, not the modeled target alone.",
  sources: [sources.epaMetalP2, sources.epaMetalGuide, sources.epaMpm, sources.epaConductivity],
  related: [[metalToolLinks[0][0], metalToolLinks[0][1]], [metalToolLinks[1][0], metalToolLinks[1][1]], [metalToolLinks[2][0], metalToolLinks[2][1]], [metalToolLinks[3][0], metalToolLinks[3][1]], ["/systems/metal-finishing-rinse-water/", "Metal Finishing Rinse Water Optimization"]]
});

guideData.push(
  { path: irrigationGuideLinks[0][0], h1: irrigationGuideLinks[0][1], description: "A measurement-led method for irrigation flow and dynamic pressure using bucket, meter and gauge observations.", intro: "Irrigation planning begins with what the supply can deliver while water is moving. Static pressure, dynamic pressure and measured flow answer different questions.", sections: [["1. Start safely", "Do not open energized controllers, pressure vessels or buried equipment. Stop for flooding, damaged piping, electrical hazards or a dry-running pump."], ["2. Separate pressure from flow", "Static pressure is recorded with no intentional draw. Dynamic pressure is recorded at the same gauge location while a defined zone or test outlet is flowing. Flow is volume per time."], ["3. Run a bucket test", "Use a known container, time the fill accurately and calculate litres per minute. Repeat at least three comparable trials; isolate unrelated demand only where it is safe and permitted."], ["4. Run a meter test", "Record a stable start and end meter reading, the exact interval and the units. Subtract readings before converting; an end reading equal to or below the start is not a valid delivered-volume test."], ["5. Record dynamic pressure", "Fit or use an appropriate gauge at a safe accessible point. Record gauge location, elevation, static reading, active zone, nozzle condition and dynamic reading together."], ["6. Compare conditions", "Municipal supplies can vary by time and demand; pumps can react to cycling, water level and controls. Repeat observations under comparable conditions before concluding capacity."], ["7. Use the measured result", "Enter the measured flow in the Available Water Flow Test Calculator, preserve a reserve, then check both zone flow and pressure margin."], ["8. Note uncertainty", "Bucket shape, timing delay, other demand, gauge location, partly closed valves, filters and changing nozzle sets affect a field result. Record what changed rather than averaging unlike conditions."]], example: "Three 10 L bucket trials taking 20, 25 and 30 seconds yield 30, 24 and 20 L/min: average 24.67 L/min with a 40.54% spread. Repeat before using it as zone capacity.", sources: [sources.nrcsIrrigation, sources.okState, sources.epaWatersense], related: [[irrigationToolLinks[0][0], irrigationToolLinks[0][1]], [irrigationToolLinks[1][0], irrigationToolLinks[1][1]], ["/systems/irrigation-sprinklers/", "Irrigation & Sprinkler Systems"], [toolLinks[8][0], toolLinks[8][1]]] },
  { path: irrigationGuideLinks[1][0], h1: irrigationGuideLinks[1][1], description: "Plan sprinkler and drip zones by matching product data, available flow, pressure, elevation and landscape needs.", intro: "A practical zone is both hydraulically feasible and appropriate for the landscape. Similar plants alone do not overcome mismatched nozzles, insufficient flow or pressure loss.", sections: [["1. Inventory devices", "Record type, model, arc, stated flow at stated pressure, count and condition. Keep sprays, rotors and drip separate unless current manufacturer data supports a compatible design."], ["2. Preserve a measured-flow reserve", "Use measured available flow, select a transparent reserve and floor whole heads or rows. A partial head is not a capacity result."], ["3. Check pressure separately", "Start with dynamic pressure, subtract required head pressure, elevation and measured or calculated pipe, valve and filter losses. A zone can pass flow and fail pressure."], ["4. Group landscape conditions", "Group sun, shade, soil, slope, plant material and exposure after the hydraulic screen. Different precipitation rates demand different schedules."], ["5. Check layout", "Follow actual manufacturer spacing and arc data. Head-to-head language is a layout starting point, not a substitute for current nozzle charts or an irrigation audit."], ["6. Convert rate to time", "Use precipitation rate and target depth to determine runtime. Watch for runoff, reduce cycle length and allow soak time where soil intake is lower than application rate."], ["7. Consider pumped supply", "A pump catalogue maximum is not a zone duty point. Compare one operating condition, then use TDH and the exact pump curve for full review."], ["8. Commission in the field", "Observe coverage, pressure, leaks, valve opening and actual nozzle installation. Record changes so future diagnosis has a baseline."]], example: "With 100 L/min measured flow, 10% reserve and 12 L/min per head, seven heads fit hydraulically by flow. At 400 kPa dynamic pressure, 210 kPa required head pressure, 50 kPa loss and 10 m rise, pressure margin is 41.93 kPa.", sources: [sources.nrcsIrrigation, sources.hunter, sources.rainBird], related: [[irrigationToolLinks[1][0], irrigationToolLinks[1][1]], [irrigationToolLinks[2][0], irrigationToolLinks[2][1]], [irrigationToolLinks[4][0], irrigationToolLinks[4][1]], [irrigationToolLinks[3][0], irrigationToolLinks[3][1]], ["/systems/irrigation-sprinklers/", "Irrigation & Sprinkler Systems"]] },
  { path: irrigationGuideLinks[2][0], h1: irrigationGuideLinks[2][1], description: "A safe, evidence-led sequence for diagnosing a weak sprinkler zone without jumping to a pump or pressure conclusion.", intro: "Weak coverage is a symptom. This sequence separates a single-head fault, a zone restriction or leak, excess demand, elevation, source limits and pump behavior.", sections: [["1. Stop for urgent conditions", "Stop the zone and seek qualified help for electrical hazards, flooding, damaged pressure equipment, dry-running indications or a pump alarm/lost-prime condition."], ["2. Define scope", "Identify whether one head, one zone, several zones or all zones are affected. This first distinction prevents a local obstruction from being treated as a source failure."], ["3. Observe changes", "Note new nozzles, recent work, filter service, valve changes, weather, schedule changes, pump cycling and when the symptom began."], ["4. Inspect accessible evidence", "Look for broken heads, blocked nozzles, failure to pop up, leaks and soggy areas. Do not excavate without utility location or dismantle pressurized parts."], ["5. Check demand", "Total current nozzle flow and compare it with measured usable flow. Larger nozzles can produce short reach and weak far heads even when static pressure appears normal."], ["6. Compare dynamic conditions", "Measure static and dynamic pressure at comparable locations. Compare near/far and low/high heads for restriction or elevation evidence."], ["7. Check valve and filter safely", "A restricted filter or partially opening zone valve affects one zone differently from a source-wide shortage. Follow the equipment instructions before any service."], ["8. Escalate correctly", "Pumped systems with collapse across all zones, alarms or lost prime need qualified pump and electrical service. Do not bypass backflow protection or alter controls."], ["9. Document the next test", "The result should be a cause group, a next measurement and an escalation threshold—not a remote diagnosis."]], example: "If far heads are weak, near heads are normal and a soggy patch is visible, an active lateral leak is a high-priority cause group. Stop the zone if safe and repair the leak before pressure changes.", sources: [sources.okState, sources.epaWatersense, sources.nrcsIrrigation], related: [[irrigationToolLinks[6][0], irrigationToolLinks[6][1]], [irrigationToolLinks[0][0], irrigationToolLinks[0][1]], [irrigationToolLinks[5][0], irrigationToolLinks[5][1]], [toolLinks[1][0], toolLinks[1][1]], ["/systems/irrigation-sprinklers/", "Irrigation & Sprinkler Systems"]] }
);

guideData.push(
  {
    path: treatmentGuideLinks[0][0], h1: treatmentGuideLinks[0][1],
    description: "Read a water test report by checking sample context, units, detection limits, methods, guideline comparisons and which results need confirmation.",
    intro: "A laboratory report describes one sample collected at one time using stated methods. Interpret the sample, units and qualifiers before choosing treatment or declaring a source safe.",
    sections: [
      ["1. Confirm sample identity", "Check source, tap or sampling point, date, collection method, preservation, laboratory, report number and intended use. A result from a kitchen tap is not automatically a raw-well result."],
      ["2. Separate result, method and comparison value", "The result is the measured or reported value. The method explains how it was determined. A guideline, screening value or legal limit belongs to a named jurisdiction and use; these columns are not interchangeable."],
      ["3. Read units before numbers", "mg/L, µg/L, NTU, CFU/100 mL, conductivity and mg/L as CaCO₃ describe different quantities. A hardness number in mg/L as CaCO₃ cannot be compared directly with an elemental calcium result."],
      ["4. Understand qualifiers", "ND means not detected at the stated reporting or detection limit, not proven absent. “<” means below the stated quantitation threshold; “>” means above the reportable range and can require dilution or retesting."],
      ["5. Group physical and operational indicators", "pH, alkalinity, hardness, conductivity, TDS, turbidity, color and odor help explain corrosion, scaling, particles or aesthetic concerns, but indicators alone do not prove toxic chemicals or pathogens."],
      ["6. Review common inorganic results", "Iron and manganese can affect color, staining and treatment. Nitrate, nitrite, chloride and sulfate have different health, taste, corrosion and source implications. Use the applicable health authority to interpret elevated results."],
      ["7. Treat microbiology separately", "Total coliforms and other indicator or pathogen results require the laboratory’s method, sample validity and local public-health response. Do not use appearance or a single household filter to override a positive result."],
      ["8. Compare source responsibility", "A public-supply customer should review the utility report and contact the utility for sudden changes. A private-well owner generally arranges testing and corrective action under local guidance. Rainwater and surface water require source- and use-specific assessment."],
      ["9. Repeat or expand testing", "Retest unexpected or health-significant results as directed, investigate changed source conditions and add locally relevant analytes. One normal sample does not guarantee future quality."],
      ["10. Move to treatment only after an objective", "Define which verified parameter must change, for which use, at what peak flow and with what follow-up verification. Then use the treatment selector and certified product claims."]
    ],
    example: "A report shows hardness 220 mg/L as CaCO₃, iron 0.8 mg/L, turbidity 2.1 NTU and microbiology marked ND with a reporting limit. Do not read this as “safe” or “needs only a softener.” Confirm the microbiology method/limit, investigate iron and turbidity pretreatment, then size any softener from actual usable capacity and peak flow.",
    sources: [sources.epaPrivateWells, sources.cdcWellTesting, sources.usgsWaterQuality, sources.whoDrinking],
    related: [[treatmentReferenceLinks[0][0], treatmentReferenceLinks[0][1]], [treatmentToolLinks[7][0], treatmentToolLinks[7][1]], [treatmentToolLinks[0][0], treatmentToolLinks[0][1]], ["/systems/water-treatment-quality/", "Water Treatment & Water Quality"]]
  },
  {
    path: treatmentGuideLinks[1][0], h1: treatmentGuideLinks[1][1],
    description: "Compare sediment filtration, activated carbon, softening, reverse osmosis and ultraviolet treatment by target, limits, flow, pressure, waste and maintenance.",
    intro: "These technologies solve different problems. Selection begins with the tested contaminant or operational objective, not with the number of stages in a package.",
    sections: [
      ["What each technology primarily does", "Sediment filters retain particles; activated carbon adsorbs selected compounds and can reduce chlorine, taste or odor under verified conditions; softeners exchange hardness ions; RO separates water through a membrane; UV inactivates susceptible microorganisms under validated dose and water-quality conditions."],
      ["What they do not prove", "A sediment filter does not remove dissolved salts. Carbon is not a universal pathogen or chemical barrier. A softener does not remove viruses or bacteria. RO claims vary by system and contaminant. UV does not remove dissolved chemicals and leaves no distribution residual."],
      ["Pressure and peak flow", "Every housing, bed and membrane adds pressure loss. Confirm certified or manufacturer service flow at peak demand and include dirty-filter or end-of-run conditions in the pump and pressure review."],
      ["Waste and consumables", "Cartridges create replacement waste; carbon and media require replacement or backwash; softeners use salt and regeneration water; RO creates reject water; UV uses electricity and lamps and usually needs pretreatment."],
      ["Order and pretreatment", "Remove damaging sediment before fine filters and membranes. Manage iron, manganese, hardness, oxidants or turbidity according to the membrane, carbon, softener or UV requirements. Do not place stages by marketing convention alone."],
      ["Certification and claims", "Check the official certification listing for the exact model and contaminant-reduction claim. Certification to one standard or claim does not mean the product treats every possible contaminant."],
      ["Maintenance and monitoring", "Record pressure drop, flow, breakthrough indicators, salt, reject, lamp status and replacement intervals. Verify treatment with appropriate follow-up testing rather than relying only on elapsed time."],
      ["Scenario: hardness only", "Confirmed hardness with adequate peak flow may support a softener review. Adding RO and UV without a demonstrated objective adds waste, energy and maintenance."],
      ["Scenario: high TDS and drinking use", "RO may be a candidate only after identifying the dissolved constituents, recovery, reject disposal, storage and certified claim. Carbon or softening alone does not demonstrate TDS reduction."],
      ["Scenario: positive microbiology", "Use the alternate-safe-source and public-health response first. Source correction, pretreatment and validated disinfection require local guidance; do not purchase one device based only on this comparison."]
    ],
    example: "A private well has confirmed hardness and fine sediment but no microbiological problem. A practical sequence may be sediment control before a correctly sized softener, with pressure-drop monitoring. Carbon, RO and UV remain unnecessary unless testing or the intended use establishes another objective.",
    sources: [sources.cdcHomeTreatment, sources.nsfTreatment, sources.nsfListings, sources.epaTreatment],
    related: [[treatmentReferenceLinks[1][0], treatmentReferenceLinks[1][1]], [treatmentToolLinks[7][0], treatmentToolLinks[7][1]], [treatmentToolLinks[4][0], treatmentToolLinks[4][1]], [treatmentToolLinks[0][0], treatmentToolLinks[0][1]], ["/systems/water-treatment-quality/", "Water Treatment & Water Quality"]]
  },
  {
    path: treatmentGuideLinks[2][0], h1: treatmentGuideLinks[2][1],
    description: "Build a water-treatment train from laboratory evidence, intended use, flow, pressure, waste, storage, maintenance and monitoring without unnecessary equipment.",
    intro: "A treatment train is a sequence of objectives and barriers. Add a stage only when it protects a downstream process or addresses a confirmed requirement.",
    sections: [
      ["1. Define source and intended use", "Municipal, private-well, rainwater, surface and process sources have different responsibility and variability. Drinking, household, irrigation, equipment and process uses need different evidence and controls."],
      ["2. Test before selecting", "Use an appropriate accredited laboratory and local guidance. Identify health-significant results, operational indicators, seasonal change and sample limitations."],
      ["3. Write treatment objectives", "State a measurable objective for each stage: remove sediment, control iron, reduce hardness, address a listed dissolved contaminant, disinfect under validated conditions or protect a downstream membrane."],
      ["4. Put pretreatment first", "Source protection, sediment control, oxidation, pH adjustment or hardness control may be necessary before carbon, fine cartridges, RO or UV. The correct order depends on chemistry and product requirements."],
      ["5. Check peak flow and pressure loss", "Size housings and vessels at peak service flow, not daily average. Add clean and dirty pressure drops to the pump duty and confirm bypass, backwash and simultaneous-demand behavior."],
      ["6. Balance production and storage", "Slow RO production can use storage to serve peaks. Storage introduces turnover, sanitation, pressure and monitoring needs; nominal volume is not always usable volume."],
      ["7. Plan every waste stream", "Backwash, regeneration brine, spent media, cartridges and RO reject need legal and practical disposal. A treatment train that cannot drain or regenerate is not operable."],
      ["8. Avoid interference", "Oxidants can damage some membranes; hardness or iron can foul media; carbon can remove disinfectant residual; poorly filtered turbidity can reduce UV performance. Verify the exact product sequence."],
      ["9. Commission and verify", "Measure flow, pressure drop and water quality before and after relevant stages. Record baseline data, settings, product identifiers and maintenance triggers."],
      ["10. Remove stages that lack a purpose", "Extra equipment can increase stagnation, pressure loss, waste and failure points. Reassess each stage against the current laboratory result and intended use."]
    ],
    example: "A well test confirms sediment, oxidizable iron and hardness; peak household flow is 35 L/min. A candidate train is source protection → sediment control → oxidation/contact as designed → iron media → softening → final monitoring. RO or UV is not added without a confirmed dissolved-contaminant or microbiological objective.",
    sources: [sources.epaPrivateWells, sources.cdcHomeTreatment, sources.cdcTreatment, sources.whoDrinking],
    related: [[treatmentToolLinks[7][0], treatmentToolLinks[7][1]], [treatmentReferenceLinks[1][0], treatmentReferenceLinks[1][1]], [toolLinks[0][0], toolLinks[0][1]], [phase2ToolLinks[4][0], phase2ToolLinks[4][1]], ["/systems/water-treatment-quality/", "Water Treatment & Water Quality"]]
  }
);

guideData.push(
  {
    path: greywaterGuideLinks[0][0], h1: greywaterGuideLinks[0][1], reviewed: "August 8, 2026",
    description: "Plan a home greywater reuse workflow from local permission and measured source volume through demand, distribution, diversion and maintenance.",
    intro: "A useful greywater plan starts with an allowed source and end use, not a tank or product. Keep wastewater risk, potable separation and a reliable diversion path visible at every step.",
    sections: [
      ["1. Check the governing rule", "Ask the local health, plumbing, building, wastewater or environmental authority which sources, uses, treatment, storage, setbacks, permits and qualified trades apply. Regional examples are not global permission."],
      ["2. Define the source", "List showers, baths, bathroom basins and clothes washers separately. Do not include toilets. Kitchen and utility sources are treated differently across jurisdictions and may have higher fats, solids, chemical and pathogen concerns."],
      ["3. Measure real volume", "Measure fixture flow and typical duration, appliance water per cycle and weekly frequency. Keep short event volume separate from the daily average because receiving basins must accept the event when it happens."],
      ["4. Define one allowed end use", "State the hydrozone, plant types, soil, slope, exposure controls and seasonal need. Keep edible-crop, surface discharge, spray, indoor reuse and toilet-flushing questions with the local authority and validated treatment requirements."],
      ["5. Match supply to demand", "Use local reference evapotranspiration, effective rainfall, plant factor, area and irrigation efficiency. Plan a diversion destination when supply exceeds demand or when soil is saturated, frozen or not actively growing."],
      ["6. Distribute each event", "Use whole outlets or branched paths that produce a defensible volume per receiving basin. Check pipe routing, air entry, cleanouts, appliance requirements and access without creating a potable cross-connection."],
      ["7. Check receiving capacity", "Use field infiltration evidence and realistic basin void volume. Stop and redesign if water surfaces, ponds, runs off, reaches structures or approaches prohibited wells, property lines or water bodies."],
      ["8. Preserve diversion and labeling", "Keep the original sewer or septic path available where required. Clearly identify non-potable components and make maintenance positions understandable to future occupants."],
      ["9. Commission by observation", "Run one source at a time, confirm every outlet, watch a complete event, check the receiving area later, and record actual volumes. Correct weak or overloaded branches before normal use."],
      ["10. Maintain the system", "Inspect filters, diverters, valves, outlets, mulch or subsurface emitters and signs of odor, surfacing or plant stress. Update the plan when occupants, appliances, soaps, plants or climate change."]
    ],
    example: "A household measures 180 L/day of potentially reusable water but its peak hydrozone needs only 140 L/day. The plan sizes outlets for the washing-machine event, verifies basin acceptance, and keeps at least 40 L/day plus wet-weather supply on an approved diversion path rather than forcing reuse.",
    sources: [sources.sfGreywater, sources.waGreywater, sources.epaWaterBudget, sources.auRecycling],
    related: [[greywaterToolLinks[0][0], greywaterToolLinks[0][1]], [greywaterToolLinks[1][0], greywaterToolLinks[1][1]], [greywaterToolLinks[3][0], greywaterToolLinks[3][1]], [greywaterReferenceLinks[0][0], greywaterReferenceLinks[0][1]], ["/systems/greywater-reuse/", "Greywater Reuse Planning"]]
  },
  {
    path: greywaterGuideLinks[1][0], h1: greywaterGuideLinks[1][1], reviewed: "August 8, 2026",
    description: "Troubleshoot greywater irrigation runoff, ponding, odor, blocked or uneven outlets and plant stress with a safe observation sequence.",
    intro: "Troubleshooting begins by diverting flow and limiting exposure. Separate a source problem, distribution problem and receiving-soil problem before changing the layout.",
    sections: [
      ["1. Divert first when unsafe", "Send flow to the approved sewer or septic path if water surfaces, runs off, smells strongly, reaches people or buildings, or the system condition is unknown. Keep children and animals away from the affected area."],
      ["2. Confirm the source event", "Measure the current appliance or fixture volume. A new washer cycle, higher occupancy or changed routine can overload a layout that previously appeared balanced."],
      ["3. Check source quality changes", "Review detergents, bleach, salts, cleaners, oils and other products. Source composition can affect plants, soil and maintenance even when water volume has not changed."],
      ["4. Inspect the diversion path", "Confirm valve position, labeling, accessible cleanouts and unobstructed backup drainage. Do not open energized equipment or dismantle pressurized or contaminated piping without qualified precautions."],
      ["5. Compare outlets", "Observe one controlled event. One weak outlet suggests a local restriction or elevation imbalance; all weak outlets suggest a source, valve, pump or main distribution problem."],
      ["6. Investigate ponding and runoff", "Compare delivered event volume with basin void capacity, infiltration and recent rain. Reduce or redirect the event; do not solve ponding by allowing surface discharge."],
      ["7. Investigate odor", "Long residence time, trapped solids, inaccessible filters, anaerobic conditions or prohibited storage can contribute. Divert, avoid contact and obtain local or qualified public-health/plumbing guidance."],
      ["8. Investigate plant stress", "Check overwatering, underwatering, salt or boron exposure, seasonal dormancy, unsuitable source products and root-zone distribution. Plant symptoms do not establish human-health safety."],
      ["9. Recommission", "After correction, measure the same source event, verify each outlet and inspect the area after the entered drain-down window. Record the change and maintenance trigger."]
    ],
    example: "Four outlets once received a 60 L laundry event evenly. One basin now ponds while the others remain dry. Divert the next load, inspect the affected branch and basin, then recommission with a measured event instead of increasing pump pressure or enlarging every outlet.",
    sources: [sources.sfGreywater, sources.waGreywater, sources.auRecycling],
    related: [[greywaterToolLinks[2][0], greywaterToolLinks[2][1]], [greywaterToolLinks[3][0], greywaterToolLinks[3][1]], [greywaterReferenceLinks[0][0], greywaterReferenceLinks[0][1]], ["/systems/greywater-reuse/", "Greywater Reuse Planning"]]
  }
);

guideData.push(
  {
    path: vehicleWashGuideLinks[0][0], h1: vehicleWashGuideLinks[0][1], reviewed: "August 11, 2026",
    description: "Measure professional vehicle-wash fresh-water use per vehicle with a repeatable meter, throughput and operating-condition record.",
    intro: "A useful reclaim plan starts with a defensible baseline. Meter volume and vehicle count must describe the same interval and comparable operating conditions.",
    sections: [
      ["1. Define the boundary", "Decide which meter and equipment are included. Record whether landscaping, restrooms, make-up water, RO feed or another tenant shares the meter."],
      ["2. Record comparable readings", "Capture start and end readings in the same unit. Confirm rollover, multiplier and decimal conventions before subtracting."],
      ["3. Match throughput", "Use the actual vehicle count for exactly the meter interval. Separate test washes, maintenance cycles and unusually long rewash events where possible."],
      ["4. Describe operating conditions", "Record wash type, active arches or options, reclaim status, RO status, weather, leaks, maintenance and known downtime."],
      ["5. Calculate per-vehicle use", "Divide interval water by interval vehicles. Also calculate per-day use so a low-volume interval does not hide continuous leaks or cleaning demand."],
      ["6. Repeat the baseline", "Use several comparable intervals and retain the individual results. Investigate changes rather than averaging unlike seasons, wash packages or equipment states."],
      ["7. Map each stream", "Separate fresh process water, reclaimed water, spot-free permeate, RO reject, carryout/evaporation, backwash and discharge before proposing a retrofit."],
      ["8. Keep evidence", "Retain meter photos or exports, vehicle counts, dates, equipment notes and calculation inputs so post-project performance can be compared fairly."]
    ],
    example: "An interval rises from 100,000 to 115,000 L while 300 vehicles are processed in five days. The baseline is 50 L/vehicle and 3,000 L/day; across 300 comparable operating days that projects to 900 m³/year.",
    sources: [sources.epaVehicleWash, sources.doeVehicleWash, sources.icaVehicleWash],
    related: [[vehicleWashToolLinks[0][0], vehicleWashToolLinks[0][1]], [vehicleWashReferenceLinks[0][0], vehicleWashReferenceLinks[0][1]], [vehicleWashToolLinks[1][0], vehicleWashToolLinks[1][1]], ["/systems/vehicle-wash-water-reclaim/", "Vehicle Wash Water Reclaim Planning"]]
  },
  {
    path: vehicleWashGuideLinks[1][0], h1: vehicleWashGuideLinks[1][1], reviewed: "August 11, 2026",
    description: "Plan a professional vehicle-wash reclaim retrofit from measured baseline through stream balance, buffer, spot-free production, economics and monitoring.",
    intro: "A reclaim package is not a percentage claim. A feasible retrofit connects measured demand, recoverable return, peak timing, water-quality duties, storage, discharge and operating evidence.",
    sections: [
      ["1. Establish the baseline", "Use matching meter and vehicle intervals. Record fresh water per vehicle, daily throughput, cleaning demand and operating variation."],
      ["2. Draw the stream map", "Identify which arches or functions require fresh, spot-free or reclaimed water. Show carryout, evaporation, RO reject, backwash, sludge and sewer paths separately."],
      ["3. Verify reclaim eligibility", "Confirm with the equipment supplier and applicable authority which wash steps can accept reclaimed water and what pretreatment, separation and monitoring are required."],
      ["4. Build the quantity balance", "Use measured gross applied water and entered collection/recovery performance. Cap reclaim by the process volume actually eligible to receive it."],
      ["5. Test the peak window", "Model the busiest realistic throughput, starting tank level, return delay, working tank volume and reserve. A daily average cannot prove peak continuity."],
      ["6. Plan spot-free production", "Use measured RO permeate production at actual feed conditions, not nameplate output alone. Compare daily and peak demand, storage and reject routing."],
      ["7. Check economics", "Apply current water and sewer tariff rules, added power, consumables, maintenance and installed cost. Test lower throughput and lower recovery cases."],
      ["8. Commission and monitor", "Repeat per-vehicle water use and stream measurements after commissioning. Track tank levels, product quality, odor, solids, alarms, filter service and abnormal discharge."],
      ["9. Stop at the safety boundary", "Quantity tools do not select treatment or approve discharge. Use qualified environmental, electrical, plumbing, equipment and workplace review for the actual site."]
    ],
    example: "A 120 vehicle/day site reduces fresh use from 180 to 72 L/vehicle. At 300 operating days, the fresh-water reduction is 3,888 m³/year; the final decision still depends on verified sewer savings, operating cost, peak tank behavior and acceptable reclaimed-water quality.",
    sources: [sources.epaVehicleWash, sources.doeVehicleWash, sources.icaVehicleWash, sources.doeWaterEvaluation],
    related: [[vehicleWashToolLinks[1][0], vehicleWashToolLinks[1][1]], [vehicleWashToolLinks[2][0], vehicleWashToolLinks[2][1]], [vehicleWashToolLinks[3][0], vehicleWashToolLinks[3][1]], [vehicleWashToolLinks[4][0], vehicleWashToolLinks[4][1]], ["/systems/vehicle-wash-water-reclaim/", "Vehicle Wash Water Reclaim Planning"]]
  }
);

guideData.push({
  path: monitoringWellGuideLinks[0][0], h1: monitoringWellGuideLinks[0][1], reviewed: "August 31, 2026",
  description: "Plan monitoring-well purging and low-flow sampling from the governing plan, well construction and water levels through equipment setup, field readings and documented handoff.",
  intro: "A defensible field run is a chain of evidence, not one stabilization number. Confirm authority, construction, equipment, calibration, water levels, waste handling and the complete time-ordered record before collection.",
  sections: [
    ["1. Start with the governing plan", "Identify the approved method, analytes, roles, decision criteria, collection sequence, documentation, quality controls and purge-water route. Do not replace project requirements with example values from a general guide or calculator."],
    ["2. Confirm the well and work area", "Match the well ID to the construction record. Record casing and screen dimensions, reference point, total depth, condition, access, potential hazards and any discrepancy that changes intake placement or volume."],
    ["3. Prepare calibrated equipment", "Record instrument IDs, calibration checks, tubing internal diameter and wetted length, pump or chamber volume, flow-cell volume and other wetted components. Prevent cross-contamination using the approved decontamination or dedicated-equipment approach."],
    ["4. Measure water levels before pumping", "Use the specified reference point and record initial depth to water before disturbing the well. Recheck total depth only when the plan and conditions support doing so safely."],
    ["5. Place the intake deliberately", "Compare intake depth with the screen interval and measured water level. Maintain submergence and follow the plan for screen position; the setup checker reports geometry conflicts but does not choose the placement."],
    ["6. Establish and observe flow", "Begin and adjust pumping under the approved method. Record actual flow and depth to water together so drawdown is tied to the same operating condition. A nominal pump setting is not a measured rate."],
    ["7. Respect equipment displacement", "Calculate the wetted equipment volume and the time required for the entered number of exchanges. Schedule readings so the water observed at the instruments can be related to the field interval."],
    ["8. Keep a complete time-ordered log", "Record every required parameter, time, flow and depth-to-water observation. Preserve checks, adjustments, calibration events, interruptions, unusual appearance and field decisions rather than deleting inconvenient rows."],
    ["9. Compare only approved criteria", "Use the analyzer with criteria transcribed from the governing plan. Review each parameter result separately; MET means only that the entered numeric comparisons passed for the selected consecutive window."],
    ["10. Hand off the complete record", "Retain the original field sheet or local file, well and equipment identifiers, units, calibration evidence, water-level reference, pump changes, purge volume, criteria source, field lead decision and required chain-of-custody material under the project procedure."]
  ],
  example: "A 50 mm ID well with an 8 m water column contains about 15.7 L. A 6 mm ID, 20 m tubing run plus 400 mL of other wetted equipment totals about 0.97 L, so one entered exchange needs about 3.86 minutes at 0.25 L/min. These calculations support scheduling; they do not determine when sampling is authorized.",
  sources: [sources.epaLowFlowSop, sources.epaLowFlow, sources.usgsPurgeAnalyzer],
  related: [[monitoringWellToolLinks[1][0], monitoringWellToolLinks[1][1]], [monitoringWellToolLinks[2][0], monitoringWellToolLinks[2][1]], [monitoringWellToolLinks[3][0], monitoringWellToolLinks[3][1]], [monitoringWellReferenceLinks[0][0], monitoringWellReferenceLinks[0][1]], ["/systems/monitoring-well-sampling/", "Monitoring Well Purging & Low-Flow Sampling"]]
});

function guideBody(guide) {
  const phase2 = phase2GuideLinks.some(([path]) => path === guide.path);
  const irrigation = irrigationGuideLinks.some(([path]) => path === guide.path);
  const treatment = treatmentGuideLinks.some(([path]) => path === guide.path);
  const greywater = greywaterGuideLinks.some(([path]) => path === guide.path);
  const vehicleWash = vehicleWashGuideLinks.some(([path]) => path === guide.path);
  const metal = metalGuideLinks.some(([path]) => path === guide.path);
  const monitoringWell = monitoringWellGuideLinks.some(([path]) => path === guide.path);
  return `${hero("Field guide", guide.h1, guide.intro, "Use this guide to order measurements and calculations. Final equipment selection still requires current manufacturer data and project-specific review.")}<p class="meta-line">Last reviewed: ${guide.reviewed || reviewed} · Technical guide</p><div class="content-layout"><article class="article-body">${guide.sections.map(([title, text]) => `<h2>${title}</h2><p>${text}</p>`).join("")}<div class="worked-example"><h2>Worked example</h2><p>${guide.example}</p></div><div class="notice"><strong>Safety boundary.</strong> Stop and obtain qualified help for electrical hazards, active flooding, unsafe pressure, sealed pressure vessels, contamination risks, chemical handling or regulated work. Water-treatment, greywater, vehicle-wash, metal-finishing and monitoring-well guidance does not certify quality or approve sampling, wastewater treatment or discharge.</div><h2>Sources</h2>${sourceList(guide.sources)}${related(guide.related)}</article><aside class="sidebar"><h2>Guide bench</h2><ul><li><a href="${monitoringWell ? "/systems/monitoring-well-sampling/" : metal ? "/systems/metal-finishing-rinse-water/" : vehicleWash ? "/systems/vehicle-wash-water-reclaim/" : greywater ? "/systems/greywater-reuse/" : treatment ? "/systems/water-treatment-quality/" : irrigation ? "/systems/irrigation-sprinklers/" : phase2 ? "/systems/wells-storage-rainwater/" : "/systems/pumps-pressure-pipe/"}">System workflow</a></li><li><a href="/tools/">Working tools</a></li><li><a href="/reference/">Technical references</a></li></ul></aside></div>`;
}

const referenceData = [
  {
    path: referenceLinks[0][0], h1: "Water Flow, Pressure & Volume Conversion Tables",
    description: "Convert common water flow, pressure, head and volume units without splitting the reference into thin pages.",
    intro: "Use these factors for transparent preliminary conversions. Keep enough precision during calculation and round only the displayed result.",
    body: `<h2>Flow</h2><table><thead><tr><th>From</th><th>To</th><th>Multiply by</th></tr></thead><tbody><tr><td>1 L/min</td><td>L/s</td><td>0.0166667</td></tr><tr><td>1 L/min</td><td>m³/h</td><td>0.06</td></tr><tr><td>1 L/min</td><td>US GPM</td><td>0.264172</td></tr><tr><td>1 US GPM</td><td>L/min</td><td>3.785412</td></tr></tbody></table><h2>Pressure and water head near 20 °C</h2><table><thead><tr><th>From</th><th>kPa</th><th>bar</th><th>psi</th><th>m water</th><th>ft water</th></tr></thead><tbody><tr><td>1 kPa</td><td>1</td><td>0.01</td><td>0.145038</td><td>0.1022</td><td>0.3353</td></tr><tr><td>1 bar</td><td>100</td><td>1</td><td>14.5038</td><td>10.22</td><td>33.53</td></tr><tr><td>1 psi</td><td>6.89476</td><td>0.0689476</td><td>1</td><td>0.7032</td><td>2.307</td></tr></tbody></table><h2>Volume</h2><table><thead><tr><th>From</th><th>To</th><th>Multiply by</th></tr></thead><tbody><tr><td>1 L</td><td>m³</td><td>0.001</td></tr><tr><td>1 L</td><td>US gallon</td><td>0.264172</td></tr><tr><td>1 m³</td><td>L</td><td>1,000</td></tr><tr><td>1 US gallon</td><td>L</td><td>3.785412</td></tr></tbody></table><h2>Catchment area and rainfall depth</h2><table><thead><tr><th>From</th><th>To</th><th>Multiply by</th></tr></thead><tbody><tr><td>1 m²</td><td>ft²</td><td>10.76391</td></tr><tr><td>1 ft²</td><td>m²</td><td>0.092903</td></tr><tr><td>1 mm rain</td><td>inch rain</td><td>0.0393701</td></tr><tr><td>1 inch rain</td><td>mm rain</td><td>25.4</td></tr></tbody></table><div class="formula">1 mm rainfall × 1 m² horizontal catchment = 1 litre gross rainfall</div>`,
    sources: [sources.usgs, sources.nist],
    related: [[toolLinks[0][0], toolLinks[0][1]], [toolLinks[1][0], toolLinks[1][1]], [referenceLinks[1][0], referenceLinks[1][1]], [referenceLinks[4][0], referenceLinks[4][1]]]
  },
  {
    path: referenceLinks[1][0], h1: "Water Pressure & Head Conversion Reference",
    description: "Relate pressure to metres and feet of water, including density, temperature and gauge-elevation context.",
    intro: "Pressure head expresses pressure energy as an equivalent column of fluid. The relationship changes slightly with water density.",
    body: `<div class="formula">H = p/(ρg) &nbsp; and &nbsp; p = ρgH</div><p>Near 20 °C with density about 998.2 kg/m³, 1 m of water is about 9.79 kPa and 1 ft of water is about 0.433 psi. Rounded field factors are useful only when their assumptions are understood.</p><h2>Quick table near 20 °C</h2><table><thead><tr><th>Pressure</th><th>Metres of water</th><th>Feet of water</th></tr></thead><tbody><tr><td>10 kPa</td><td>1.02 m</td><td>3.35 ft</td></tr><tr><td>100 kPa</td><td>10.22 m</td><td>33.53 ft</td></tr><tr><td>1 bar</td><td>10.22 m</td><td>33.53 ft</td></tr><tr><td>10 psi</td><td>7.03 m</td><td>23.07 ft</td></tr><tr><td>50 psi</td><td>35.16 m</td><td>115.35 ft</td></tr></tbody></table><h2>Gauge position and elevation</h2><p>A gauge reading changes with elevation even in the same static water column. Record the gauge elevation and use pressure head plus elevation head consistently. Absolute pressure is required for vapor-pressure and NPSH work; most delivery-pressure calculations use gauge pressure.</p>`,
    sources: [sources.usgs, sources.nist],
    related: [[toolLinks[0][0], toolLinks[0][1]], [toolLinks[4][0], toolLinks[4][1]], [toolLinks[6][0], toolLinks[6][1]], [referenceLinks[0][0], referenceLinks[0][1]]]
  },
  {
    path: referenceLinks[2][0], h1: "Hazen–Williams C Values by Pipe Material",
    description: "Review typical preliminary Hazen–Williams C-value ranges and why age, condition and method limits matter.",
    intro: "The Hazen–Williams C value is an empirical resistance coefficient, not an immutable material property.",
    body: `<h2>Preliminary screening ranges</h2><table><thead><tr><th>Pipe condition</th><th>Indicative C range</th><th>Use note</th></tr></thead><tbody><tr><td>New smooth plastic lining or pipe</td><td>145–150</td><td>Confirm product and fitting basis.</td></tr><tr><td>New cement-lined ductile iron</td><td>140–150</td><td>Use current manufacturer or agency data.</td></tr><tr><td>New steel</td><td>130–145</td><td>Condition and lining matter.</td></tr><tr><td>Older unlined metal pipe</td><td>80–130</td><td>Field C-factor testing may be more appropriate.</td></tr></tbody></table><p>These broad bands are planning cues, not a design table. Values vary with age, deposits, lining, installation and source conventions. The calculator requires the user to choose the value.</p><h2>Method boundary</h2><p>Hazen–Williams is empirical and conventionally applied to water. USACE guidance notes its viscosity and flow limitations; Darcy–Weisbach represents Reynolds number and relative roughness directly and is preferred for more general fluid-mechanics treatment.</p>`,
    sources: [sources.usace, sources.epa],
    related: [[toolLinks[1][0], toolLinks[1][1]], [toolLinks[2][0], toolLinks[2][1]], [referenceLinks[3][0], referenceLinks[3][1]], [referenceLinks[4][0], referenceLinks[4][1]]]
  },
  {
    path: referenceLinks[3][0], h1: "Common Water Pipe Internal Diameter Reference",
    description: "Compare representative Schedule 40 and Schedule 80 PVC internal diameters and understand why nominal size is not flow diameter.",
    intro: "Friction and velocity depend on actual internal diameter. Nominal pipe size is a naming system, not the number to insert automatically.",
    body: `<h2>Representative PVC pressure-pipe dimensions</h2><table><thead><tr><th>Nominal size</th><th>Schedule 40 ID</th><th>Schedule 80 ID</th></tr></thead><tbody><tr><td>½ in</td><td>0.622 in / 15.8 mm</td><td>0.546 in / 13.9 mm</td></tr><tr><td>¾ in</td><td>0.824 in / 20.9 mm</td><td>0.742 in / 18.8 mm</td></tr><tr><td>1 in</td><td>1.049 in / 26.6 mm</td><td>0.957 in / 24.3 mm</td></tr><tr><td>1½ in</td><td>1.610 in / 40.9 mm</td><td>1.500 in / 38.1 mm</td></tr><tr><td>2 in</td><td>2.067 in / 52.5 mm</td><td>1.939 in / 49.3 mm</td></tr><tr><td>3 in</td><td>3.068 in / 77.9 mm</td><td>2.900 in / 73.7 mm</td></tr><tr><td>4 in</td><td>4.026 in / 102.3 mm</td><td>3.826 in / 97.2 mm</td></tr></tbody></table><p>These representative manufacturer values are for preliminary comparison. Material, schedule, pressure class, dimensional standard, tolerance and product line change the actual ID. Always use the current product specification for the installed or proposed pipe.</p>`,
    sources: [sources.westlake],
    related: [[toolLinks[2][0], toolLinks[2][1]], [toolLinks[1][0], toolLinks[1][1]], [referenceLinks[2][0], referenceLinks[2][1]], [guideLinks[0][0], guideLinks[0][1]]]
  },
  {
    path: referenceLinks[4][0], h1: "Pump Formulas & Hydraulic Terms",
    description: "A compact reference for flow, head, TDH, hydraulic power, system curves, Reynolds number, NPSH and duty points.",
    intro: "Use consistent symbols and units before comparing a system requirement with a pump curve.",
    body: `<h2>Core formulas</h2><table><thead><tr><th>Term</th><th>Formula or definition</th><th>Units / condition</th></tr></thead><tbody><tr><td>Velocity</td><td>V = Q/A</td><td>m/s when Q is m³/s and A is m²</td></tr><tr><td>Pressure head</td><td>H = p/(ρg)</td><td>m of the stated fluid</td></tr><tr><td>TDH</td><td>Elevation + delivery pressure head + losses − available inlet pressure head</td><td>m or ft</td></tr><tr><td>Hydraulic power</td><td>P = ρgQH</td><td>W</td></tr><tr><td>Reynolds number</td><td>Re = VD/ν</td><td>Dimensionless</td></tr><tr><td>Darcy loss</td><td>h<sub>f</sub> = f(L/D)V²/(2g)</td><td>m or ft</td></tr><tr><td>NPSHA</td><td>Absolute suction head above vapor-pressure head</td><td>m or ft absolute</td></tr></tbody></table><h2>Hydraulic terms</h2><dl><dt><strong>Flow</strong></dt><dd>Volume passing a point per time.</dd><dt><strong>Head</strong></dt><dd>Energy per unit weight expressed as fluid-column length.</dd><dt><strong>System curve</strong></dt><dd>Required system head as flow changes, combining static and flow-dependent components.</dd><dt><strong>Duty point</strong></dt><dd>The operating intersection of pump and system curves.</dd><dt><strong>Pump efficiency</strong></dt><dd>Hydraulic power delivered to the fluid divided by pump shaft input power.</dd><dt><strong>NPSHR / NPSH3</strong></dt><dd>Manufacturer/test-based suction performance value; it is not the same as a complete reliability margin.</dd><dt><strong>Friction factor</strong></dt><dd>Dimensionless Darcy factor determined by Reynolds number and relative roughness.</dd></dl>`,
    sources: [sources.hiFaq, sources.hiNpsh, sources.usace, sources.doeManual],
    related: [[toolLinks[0][0], toolLinks[0][1]], [toolLinks[3][0], toolLinks[3][1]], [toolLinks[5][0], toolLinks[5][1]], [toolLinks[6][0], toolLinks[6][1]]]
  }
];

referenceData.push({
  path: phase2ReferenceLinks[0][0], h1: "Water Demand Planning Factors",
  description: "Build explicit water-demand scenarios from users, end uses, average volume, peak flow, outage duration, refill and reserve instead of universal defaults.",
  intro: "Water demand is a scenario, not one universal number. Document the users, uses, time period, climate, occupancy and reliability objective behind every input.",
  body: `<h2>Separate four demand questions</h2><table><thead><tr><th>Question</th><th>Useful quantity</th><th>Why it matters</th></tr></thead><tbody><tr><td>How much over a day?</td><td>Average daily volume</td><td>Source production and operating schedule</td></tr><tr><td>How fast at the busiest time?</td><td>Peak flow</td><td>Pump, pipe and pressure duty</td></tr><tr><td>How long does the peak last?</td><td>Peak duration</td><td>Short-term storage gap</td></tr><tr><td>How long must service continue?</td><td>Outage / autonomy period</td><td>Bulk usable storage</td></tr></tbody></table><h2>Demand inventory</h2><p>List occupants or process units, indoor essential uses, discretionary uses, irrigation, livestock or production needs, seasonal variation, losses and any treatment reject or backwash. Use measured records where available and keep unusually high days visible rather than averaging them away.</p><h2>Refill and source factors</h2><p>Record sustained source rate, available pumping or refill hours, seasonal low conditions, maintenance downtime and the probability that refill remains available during the planned outage. A source rating multiplied by 24 hours is not a defensible daily supply unless continuous operation is actually available.</p><h2>Reserve and safety margin</h2><p>State the reason for any margin: uncertain demand, uncertain refill, inaccessible volume or an operational policy. Do not mix fire storage, mandated emergency volume or water-quality turnover into an unexplained percentage.</p><h2>Scenario worksheet</h2><table><thead><tr><th>Scenario</th><th>Demand</th><th>Source / refill</th><th>Storage question</th></tr></thead><tbody><tr><td>Typical day</td><td>Measured average plus known uses</td><td>Normal sustainable availability</td><td>Turnover and normal cycling</td></tr><tr><td>Peak period</td><td>Peak rate × duration</td><td>Source contribution during peak</td><td>Peak gap and delivery rate</td></tr><tr><td>Outage</td><td>Essential daily demand × days</td><td>None or credible partial refill</td><td>Usable volume plus stated reserve</td></tr><tr><td>Dry / stressed case</td><td>Seasonal demand</td><td>Reduced well yield or rainfall</td><td>Reliability and contingency</td></tr></tbody></table><div class="notice"><strong>No universal default.</strong> Health, emergency, building, fire and utility requirements vary. Use current local requirements and qualified review for regulated storage and service levels.</div>`,
  sources: [sources.epaEmergency, sources.cdcCistern, sources.usgsHydrology],
  related: [[phase2ToolLinks[1][0], phase2ToolLinks[1][1]], [phase2ToolLinks[4][0], phase2ToolLinks[4][1]], [phase2ToolLinks[6][0], phase2ToolLinks[6][1]], [phase2GuideLinks[3][0], phase2GuideLinks[3][1]], ["/systems/wells-storage-rainwater/", "Wells, Storage & Rainwater"]]
});

referenceData.push({
  path: metalReferenceLinks[0][0], h1: metalReferenceLinks[0][1], reviewed: "August 24, 2026",
  description: "Compare metal-finishing rinse-water audit, drag-out prevention, countercurrent staging, flow control and verification methods.",
  intro: "Use this reference to choose a measurement or control method by the evidence it requires. It does not supply chemistry, rinse-quality or discharge limits.",
  body: `<h2>Method comparison</h2><div class="table-scroll" role="region" aria-label="Metal finishing rinse control methods table" tabindex="0" style="--table-min-width: 820px;"><table><thead><tr><th>Method</th><th>Primary evidence</th><th>Quantity decision</th><th>Critical boundary</th></tr></thead><tbody><tr><td>Matched water audit</td><td>Meter, elapsed time and production loads</td><td>Water/load and flow baseline</td><td>Exclude or document leaks, maintenance and shared uses</td></tr><tr><td>Drag-out measurement</td><td>Retained volume by rack, barrel or product</td><td>Solution and active mass carried per hour</td><td>Qualified chemical handling and representative drain conditions</td></tr><tr><td>Drain-time / physical controls</td><td>Before-and-after retention and quality evidence</td><td>Prevent carryover before reducing rinse flow</td><td>Process quality, line timing and worker controls</td></tr><tr><td>Countercurrent rinsing</td><td>Drag-out, stage count and process-specific dilution criterion</td><td>Compare ideal stage flow</td><td>Ideal mixing is not a final-rinse guarantee</td></tr><tr><td>Flow restriction or interlock</td><td>Actual flow, production state and fail-state review</td><td>Reduce excess and idle flow</td><td>Minimum required flow and safe failure behavior</td></tr><tr><td>Conductivity control</td><td>Local correlation, setpoint, maintenance and log trend</td><td>Adjust flow to measured carryover signal</td><td>No universal conductivity limit; probe location and fouling matter</td></tr><tr><td>Economics</td><td>Verified flow, hours, tariffs, treatment and operating costs</td><td>Annual savings and simple payback</td><td>Not a permit or process approval</td></tr></tbody></table></div><h2>Minimum record</h2><ul><li>Meter IDs, units, multipliers and exact boundaries.</li><li>Products, loads, bath state, drain time and production hours.</li><li>Baseline and changed rinse flow under comparable conditions.</li><li>User-defined rinse criterion and its qualified basis.</li><li>Conductivity instrument, location, maintenance and entered alert.</li><li>Current water, sewer, treatment, sludge and operating costs.</li></ul><div class="notice"><strong>Do not turn an example into a limit.</strong> Process acceptance, exposure and discharge requirements come from current site evidence, SDS, permits, authorities and qualified review.</div>`,
  sources: [sources.epaMetalP2, sources.epaMetalGuide, sources.epaMpm, sources.epaConductivity],
  related: [[metalToolLinks[0][0], metalToolLinks[0][1]], [metalToolLinks[1][0], metalToolLinks[1][1]], [metalToolLinks[2][0], metalToolLinks[2][1]], [metalToolLinks[3][0], metalToolLinks[3][1]], ["/systems/metal-finishing-rinse-water/", "Metal Finishing Rinse Water Optimization"]]
});

referenceData.push(
  {
    path: treatmentReferenceLinks[0][0], h1: treatmentReferenceLinks[0][1],
    description: "Understand common water-quality parameters, units, treatment connections and the limits of interpreting any single laboratory value.",
    intro: "A parameter has meaning only with its unit, method, sample context, intended use and applicable jurisdiction. Use this glossary to ask the next question, not to declare water safe.",
    body: `<h2>Core physical and chemical parameters</h2><table><thead><tr><th>Parameter</th><th>Common unit</th><th>What it describes</th><th>Treatment connection and limitation</th></tr></thead><tbody><tr><td>pH</td><td>pH units</td><td>Hydrogen-ion activity; acidic/basic condition</td><td>Affects corrosion, scaling, oxidation and disinfection; pH alone does not define correction chemistry.</td></tr><tr><td>Alkalinity</td><td>mg/L as CaCO₃</td><td>Acid-neutralizing or buffering capacity</td><td>Important for pH stability and dosing; not the same as pH or hardness.</td></tr><tr><td>Hardness</td><td>mg/L as CaCO₃ or grains/US gal</td><td>Primarily calcium and magnesium</td><td>Connects to softening and scale; does not indicate microorganisms or all dissolved solids.</td></tr><tr><td>Conductivity</td><td>µS/cm</td><td>Ability to conduct electricity from dissolved ions</td><td>Useful trend/salinity indicator; does not identify which ions are present.</td></tr><tr><td>Total dissolved solids</td><td>mg/L</td><td>Aggregate dissolved material by the stated method</td><td>Can connect to RO or source review; one total does not identify health risk or membrane design.</td></tr><tr><td>Turbidity</td><td>NTU</td><td>Light scattering from suspended or colloidal material</td><td>Can interfere with filtration/disinfection; it is not a direct pathogen count.</td></tr><tr><td>Color</td><td>Method-specific units</td><td>Apparent or true color under the stated method</td><td>May involve metals or organics; identify cause before selecting treatment.</td></tr><tr><td>Odor</td><td>Qualitative or threshold method</td><td>Perceived smell under stated conditions</td><td>Can guide testing but cannot diagnose a contaminant or safety.</td></tr></tbody></table><h2>Common ions, nutrients and metals</h2><table><thead><tr><th>Parameter</th><th>Common unit</th><th>Planning meaning</th></tr></thead><tbody><tr><td>Iron / manganese</td><td>mg/L</td><td>Oxidation state, pH and form affect removal; visible staining does not replace a test.</td></tr><tr><td>Chloride / sulfate</td><td>mg/L</td><td>Can affect taste, corrosion or source interpretation; applicable guidance varies.</td></tr><tr><td>Nitrate / nitrite / ammonia</td><td>mg/L with chemical basis stated</td><td>Forms and reporting bases differ; health-significant results require local-authority interpretation.</td></tr><tr><td>Chlorine residual</td><td>mg/L as stated chlorine species</td><td>Must be measured at a defined location/time; does not by itself prove CT or distribution safety.</td></tr></tbody></table><h2>Biological and operational indicators</h2><dl><dt><strong>Bacteria and indicator organisms</strong></dt><dd>Reported by method-specific presence/absence, counts or most-probable-number units. Indicators and pathogens are not interchangeable; positive or invalid results require the laboratory and health authority’s response.</dd><dt><strong>Dissolved oxygen</strong></dt><dd>Usually mg/L; influences corrosion, oxidation-reduction conditions and biological activity.</dd><dt><strong>Total organic carbon (TOC)</strong></dt><dd>Usually mg/L carbon; an aggregate organic indicator that does not identify individual compounds.</dd><dt><strong>ND and reporting limits</strong></dt><dd>Not detected means below the method/reporting threshold, not proven zero. Always read the qualifier and limit.</dd></dl><div class="notice"><strong>No universal table.</strong> Drinking-water standards and guidance vary by country, jurisdiction, source and use. Compare results only with the current requirement applicable to the specific project.</div>`,
    sources: [sources.usgsWaterQuality, sources.epaPrivateWells, sources.cdcWellTesting, sources.whoDrinking],
    related: [[treatmentGuideLinks[0][0], treatmentGuideLinks[0][1]], [treatmentToolLinks[7][0], treatmentToolLinks[7][1]], [treatmentReferenceLinks[1][0], treatmentReferenceLinks[1][1]], ["/systems/water-treatment-quality/", "Water Treatment & Water Quality"]]
  },
  {
    path: treatmentReferenceLinks[1][0], h1: treatmentReferenceLinks[1][1],
    description: "Compare water-treatment technologies by primary purpose, flow and pressure effects, waste, power, consumables, upstream needs and limitations.",
    intro: "Use this matrix as a fast screening reference. Confirm the exact model, certified claim, operating conditions and local requirements before specifying equipment.",
    body: `<h2>Technology comparison</h2><table><thead><tr><th>Technology</th><th>Primary purpose</th><th>Flow / pressure</th><th>Waste / power / consumables</th><th>Common requirements and limits</th></tr></thead><tbody><tr><td>Sediment screen</td><td>Coarse debris protection</td><td>Low when clean; rises with blockage</td><td>Cleaning or purge</td><td>Does not remove dissolved chemicals or establish microbial safety.</td></tr><tr><td>Cartridge filter</td><td>Defined particle-size polishing</td><td>Pressure drop rises toward replacement</td><td>Spent cartridges</td><td>Claim depends on media/pore rating; not every cartridge removes germs or chemicals.</td></tr><tr><td>Media filter</td><td>Particle, turbidity or media-specific treatment</td><td>Area and loading govern service flow</td><td>Backwash, media replacement</td><td>Requires media-specific loading, bed depth and water chemistry.</td></tr><tr><td>Activated carbon</td><td>Selected chlorine, taste, odor or organic reduction</td><td>Contact time and pressure drop matter</td><td>Media replacement/backwash</td><td>Can exhaust and can remove protective residual; use certified contaminant claims.</td></tr><tr><td>Oxidation</td><td>Convert selected dissolved species for removal</td><td>May need mixing/contact and downstream filtration</td><td>Chemical or energy, residuals</td><td>pH, dose, contact and by-products are source-specific.</td></tr><tr><td>Softener</td><td>Exchange hardness ions</td><td>Check peak service flow and pressure loss</td><td>Salt, regeneration water/brine</td><td>Not a pathogen barrier; actual capacity depends on salt setting and feed quality.</td></tr><tr><td>Iron/manganese media</td><td>Media-specific metal removal</td><td>Loading and backwash govern sizing</td><td>Backwash, oxidant/media as applicable</td><td>Oxidation state, pH and competing constituents matter.</td></tr><tr><td>Reverse osmosis</td><td>Membrane separation of selected dissolved constituents</td><td>Production can be slow; pressure and storage matter</td><td>Reject water, cartridges, membrane, power as applicable</td><td>Pretreatment, recovery and exact certified claims are essential.</td></tr><tr><td>Ultraviolet</td><td>Inactivate susceptible microorganisms</td><td>Rated flow and UV transmittance matter</td><td>Electricity, lamp/sleeve service</td><td>Needs validated dose and pretreatment; no dissolved-chemical removal or residual.</td></tr><tr><td>Chlorination</td><td>Chemical disinfection and possible residual</td><td>Needs mixing, contact and monitoring</td><td>Chemical handling, residual/by-products</td><td>Dose and CT depend on source, organism, pH, temperature and regulation.</td></tr><tr><td>Storage / recirculation</td><td>Buffer production and peaks</td><td>Changes pump duty and turnover</td><td>Cleaning, energy and monitoring</td><td>Can create stagnation or recontamination; not treatment by itself.</td></tr></tbody></table><h2>How to use the matrix</h2><p>Start with the tested problem and intended use, remove technologies without an applicable objective, check upstream protection and downstream monitoring, then compare service flow, pressure loss, waste and maintenance. Use the longer comparison guide for scenarios and ordering decisions.</p>`,
    sources: [sources.cdcHomeTreatment, sources.nsfTreatment, sources.nsfListings, sources.epaTreatment],
    related: [[treatmentGuideLinks[1][0], treatmentGuideLinks[1][1]], [treatmentGuideLinks[2][0], treatmentGuideLinks[2][1]], [treatmentToolLinks[7][0], treatmentToolLinks[7][1]], ["/systems/water-treatment-quality/", "Water Treatment & Water Quality"]]
  }
);

referenceData.push({
  path: greywaterReferenceLinks[0][0], h1: greywaterReferenceLinks[0][1], reviewed: "August 8, 2026",
  description: "Screen common household greywater sources, non-potable reuse questions, water-quality characteristics and local approval gates.",
  intro: "Use this matrix to identify what must be measured or confirmed before planning. It is not a universal list of permitted sources or uses.",
  body: `<h2>Source screening</h2><div class="table-scroll" role="region" aria-label="Source screening table" tabindex="0" style="--table-min-width: 760px;"><table><thead><tr><th>Potential source</th><th>Planning evidence</th><th>Common concerns</th><th>Gate before reuse</th></tr></thead><tbody><tr><td>Clothes washer</td><td>Measured volume per selected cycle, loads/week, products used</td><td>Salts, boron, bleach, lint, hot water, variable event volume</td><td>Appliance requirements, approved diversion, subsurface distribution and local source definition</td></tr><tr><td>Shower / bath</td><td>Measured flow, duration, bath volume and occupancy</td><td>Pathogens, hair, soaps, oils and warm wastewater</td><td>Allowed collection, exposure control, treatment/storage rule and maintenance access</td></tr><tr><td>Bathroom basin</td><td>Measured or observed daily use</td><td>Personal-care products, hair and pathogens</td><td>Local light-greywater definition and approved end use</td></tr><tr><td>Kitchen / dishwasher</td><td>Separate flow and composition evidence</td><td>Food, fats, oils, grease, detergents and higher organic load</td><td>Often treated differently or excluded; obtain explicit local confirmation</td></tr><tr><td>Toilet / urinal</td><td>Not included as greywater by these tools</td><td>Blackwater and high pathogen risk</td><td>Use the applicable wastewater system and authority requirements</td></tr></tbody></table></div><h2>End-use screening</h2><div class="table-scroll" role="region" aria-label="End-use screening table" tabindex="0" style="--table-min-width: 700px;"><table><thead><tr><th>Potential use</th><th>Quantity question</th><th>Safety / regulatory question</th></tr></thead><tbody><tr><td>Subsurface landscape irrigation</td><td>Does seasonal plant demand and receiving capacity match each event?</td><td>Are the source, method, setbacks, crops, exposure controls and season allowed locally?</td></tr><tr><td>Laundry-to-landscape</td><td>Can whole outlets accept the measured appliance event?</td><td>Are appliance, valve, labeling, diversion and subsurface rules satisfied?</td></tr><tr><td>Toilet flushing</td><td>Do daily supply, peak demand and treatment/storage capacity match?</td><td>Requires explicit plumbing, cross-connection, treatment, disinfection and monitoring review; not covered by the sizing tools here.</td></tr><tr><td>Surface spray</td><td>Not evaluated</td><td>Exposure and aerosol risk; do not assume it is allowed.</td></tr><tr><td>Edible-crop irrigation</td><td>Not sufficient by itself</td><td>Crop-contact and local public-health rules must be checked explicitly.</td></tr><tr><td>Potable use</td><td>Outside scope</td><td>These tools never make wastewater safe to drink or design potable reuse.</td></tr></tbody></table></div><h2>Evidence to keep with the plan</h2><ul><li>Authority and rule checked, date and jurisdiction.</li><li>Measured source volumes and event timing.</li><li>Allowed end use, season, setbacks and diversion destination.</li><li>Local ET, effective rainfall, plant factor and hydrozone area.</li><li>Field infiltration evidence and receiving-basin dimensions.</li><li>Products used, maintenance schedule and recommissioning observations.</li></ul><div class="notice"><strong>Terminology varies.</strong> Greywater and graywater are spelling variants; legal definitions can differ materially. Never infer permission from the label alone.</div>`,
  sources: [sources.sfGreywater, sources.waGreywater, sources.auRecycling, sources.epaWaterBudget],
  related: [[greywaterGuideLinks[0][0], greywaterGuideLinks[0][1]], [greywaterToolLinks[0][0], greywaterToolLinks[0][1]], [greywaterToolLinks[3][0], greywaterToolLinks[3][1]], ["/systems/greywater-reuse/", "Greywater Reuse Planning"]]
});

referenceData.push({
  path: vehicleWashReferenceLinks[0][0], h1: vehicleWashReferenceLinks[0][1], reviewed: "August 11, 2026",
  description: "Map professional vehicle-wash fresh, reclaimed, spot-free, reject, carryout and discharge streams before doing quantity or cost calculations.",
  intro: "Use this map to keep unlike water streams and measurement points separate. It does not classify wastewater, select treatment or approve reuse or discharge.",
  body: `<h2>Stream map</h2><div class="table-scroll" role="region" aria-label="Vehicle wash water stream map" tabindex="0" style="--table-min-width: 760px;"><table><thead><tr><th>Stream</th><th>Quantity evidence</th><th>Planning role</th><th>Boundary to verify</th></tr></thead><tbody><tr><td>Fresh process water</td><td>Dedicated meter or isolated interval; litres or gallons per vehicle</td><td>Baseline, make-up and fresh-only wash steps</td><td>Meter boundary, tariff, pressure and equipment requirement</td></tr><tr><td>Reclaimed wash water</td><td>Reclaim meter or tank balance; measured return and delivery</td><td>Offsets eligible process demand</td><td>Treatment performance, compatible wash steps, exposure and labeling</td></tr><tr><td>Spot-free permeate</td><td>Measured RO production and rinse volume</td><td>Final-rinse demand and product-water storage</td><td>Actual feed conditions, membrane performance and final-rinse quality</td></tr><tr><td>RO reject</td><td>Feed minus permeate or verified recovery</td><td>Potential reclaim input or discharge load</td><td>Chemistry, treatment compatibility and approved routing</td></tr><tr><td>Carryout / evaporation</td><td>Measured study, facility balance or entered estimate</td><td>Non-returning loss that limits closed-loop recovery</td><td>Weather, vehicle type, blowers and wash configuration</td></tr><tr><td>Backwash / purge / sludge</td><td>Cycle volume, frequency and service records</td><td>Operating water and waste balance</td><td>Waste characterization, handling and lawful disposal</td></tr><tr><td>Sewer discharge</td><td>Discharge meter or defensible water balance</td><td>Sewer volume and cost baseline</td><td>Utility acceptance, pretreatment and billing method</td></tr><tr><td>Stormwater</td><td>Physically separate drainage evidence</td><td>Outside the reclaim quantity loop</td><td>Prevent wash wastewater from entering storm drains unless explicitly authorized</td></tr></tbody></table></div><h2>Measurement record</h2><ul><li>Meter IDs, units, multipliers, start/end readings and exact interval.</li><li>Vehicles processed, wash packages, test washes and downtime.</li><li>Fresh, reclaim and permeate production or delivery measurements.</li><li>Tank working levels, reserve and overflow or bypass events.</li><li>RO feed, permeate, reject and operating hours at actual conditions.</li><li>Backwash, purge, cleaning and sludge-handling events.</li><li>Current tariff, sewer method, equipment data and authority checks.</li></ul><div class="notice"><strong>A loop is not lossless.</strong> Carryout, evaporation, reject, backwash, purge, leaks and maintenance prevent 100% recovery. Never count the same returned volume as both reclaim and avoided discharge without a complete boundary.</div>`,
  sources: [sources.epaVehicleWash, sources.doeVehicleWash, sources.icaVehicleWash, sources.doeWaterEvaluation],
  related: [[vehicleWashGuideLinks[0][0], vehicleWashGuideLinks[0][1]], [vehicleWashToolLinks[0][0], vehicleWashToolLinks[0][1]], [vehicleWashToolLinks[1][0], vehicleWashToolLinks[1][1]], ["/systems/vehicle-wash-water-reclaim/", "Vehicle Wash Water Reclaim Planning"]]
});

referenceData.push({
  path: monitoringWellReferenceLinks[0][0], h1: monitoringWellReferenceLinks[0][1], reviewed: "August 31, 2026",
  description: "Compare groundwater low-flow field parameters, numeric variation methods, equipment context and evidence boundaries without treating examples as universal criteria.",
  intro: "Field parameters support an operating record only when the instrument, units, timing, flow, water level and project-specific criterion remain attached to each reading.",
  body: `<h2>Field parameter comparison</h2><div class="table-scroll" role="region" aria-label="Groundwater low-flow field parameters table" tabindex="0" style="--table-min-width: 860px;"><table><thead><tr><th>Parameter</th><th>Typical field evidence</th><th>Analyzer method</th><th>Critical boundary</th></tr></thead><tbody><tr><td>pH</td><td>Calibrated reading with time and temperature context</td><td>Absolute range across entered consecutive readings</td><td>No universal acceptance value is supplied</td></tr><tr><td>Temperature</td><td>Flow-cell or approved field measurement</td><td>Relative range = range ÷ |mean| × 100</td><td>Unit conversion and instrument equilibration matter</td></tr><tr><td>Conductivity</td><td>Calibrated reading with stated units and compensation</td><td>Relative range</td><td>Trend does not identify individual dissolved constituents</td></tr><tr><td>Dissolved oxygen</td><td>Maintained sensor under approved flow-cell conditions</td><td>Relative range</td><td>Air contact, bubbles and sensor response can alter readings</td></tr><tr><td>Oxidation-reduction potential</td><td>Electrode reading with reference and maintenance context</td><td>Absolute range in mV</td><td>Response can be slow and method-dependent</td></tr><tr><td>Turbidity</td><td>Appropriate clean field cell and instrument record</td><td>Relative range</td><td>Disturbance and bubbles may dominate a reading</td></tr><tr><td>Depth to water</td><td>Consistent surveyed reference and time</td><td>Absolute range over the comparison window</td><td>Setup checker separately compares total drawdown</td></tr><tr><td>Flow</td><td>Measured rate at the same operating condition</td><td>Absolute range in selected flow units</td><td>Pump setting alone is not a measured rate</td></tr></tbody></table></div><h2>Calculation and record rules</h2><ul><li>Use at least three consecutive, strictly time-ordered data rows.</li><li>Do not silently omit blank, malformed or inconvenient rows.</li><li>Keep criteria values and their governing source with the result.</li><li>Integrate purge volume from each time interval and its preceding measured flow.</li><li>Report each parameter as PASS or CHECK; one CHECK keeps the overall result at NOT YET MET.</li><li>Retain calibration, equipment, water-level, adjustment and interruption records outside the numeric table.</li></ul><div class="notice"><strong>MET is deliberately narrow.</strong> It means only that the selected consecutive readings passed every user-entered numeric criterion. It does not establish representativeness, approve sample collection, specify laboratory handling or authorize purge-water disposal.</div>`,
  sources: [sources.epaLowFlowSop, sources.epaLowFlow, sources.usgsPurgeAnalyzer],
  related: [[monitoringWellToolLinks[1][0], monitoringWellToolLinks[1][1]], [monitoringWellToolLinks[2][0], monitoringWellToolLinks[2][1]], [monitoringWellToolLinks[3][0], monitoringWellToolLinks[3][1]], [monitoringWellGuideLinks[0][0], monitoringWellGuideLinks[0][1]], ["/systems/monitoring-well-sampling/", "Monitoring Well Purging & Low-Flow Sampling"]]
});

function referenceBody(ref) {
  const phase2 = ref.path === phase2ReferenceLinks[0][0];
  const treatment = treatmentReferenceLinks.some(([path]) => path === ref.path);
  const greywater = greywaterReferenceLinks.some(([path]) => path === ref.path);
  const vehicleWash = vehicleWashReferenceLinks.some(([path]) => path === ref.path);
  const metal = metalReferenceLinks.some(([path]) => path === ref.path);
  const monitoringWell = monitoringWellReferenceLinks.some(([path]) => path === ref.path);
  return `${hero("Technical reference", ref.h1, ref.intro, "Values are provided for transparent preliminary work. Confirm source conditions, product data and project-specific requirements.")}<p class="meta-line">Last reviewed: ${ref.reviewed || reviewed} · Reference</p><div class="content-layout"><article class="article-body">${ref.body}<div class="notice"><strong>Reference boundary.</strong> Do not convert an indicative value into a universal design, health or legal requirement. Check the cited source, laboratory context, certified claim and applicable jurisdiction.</div><h2>Sources</h2>${sourceList(ref.sources)}${related(ref.related)}</article><aside class="sidebar"><h2>Reference bench</h2><ul><li><a href="${monitoringWell ? "/systems/monitoring-well-sampling/" : metal ? "/systems/metal-finishing-rinse-water/" : vehicleWash ? "/systems/vehicle-wash-water-reclaim/" : greywater ? "/systems/greywater-reuse/" : treatment ? "/systems/water-treatment-quality/" : phase2 ? "/systems/wells-storage-rainwater/" : "/systems/pumps-pressure-pipe/"}">System workflow</a></li><li><a href="/tools/">Working tools</a></li><li><a href="/guides/">Field guides</a></li></ul></aside></div>`;
}

const aboutBody = `${hero("Project information", "About Water Systems Bench", "An independent, English-language workflow hub for sizing, checking, troubleshooting and planning real-world water systems.", "The project publishes transparent methods, assumptions and sources. It does not claim project-specific design, potable-safety or regulatory approval.")}<section class="section content-layout"><article class="article-body"><h2>Why a bench?</h2><p>Water decisions rarely fit one calculator. A field bench keeps measurements, assumptions, formulas and next steps together. The implemented scope connects Pumps, Pressure & Pipe Flow; Wells, Storage & Rainwater; Irrigation & Sprinkler Systems; Water Treatment & Water Quality; Greywater Reuse Planning; and Vehicle Wash Water Reclaim Planning.</p><h2>Editorial approach</h2><ul><li>Static, readable content alongside interactive tools.</li><li>SI-first calculations with common US customary units.</li><li>Methods and limitations visible near every result.</li><li>Primary technical and public-agency sources where available.</li><li>No invented ratings, reviews, certifications or professional credentials.</li></ul><h2>Technology</h2><p>The site uses static HTML, CSS and vanilla JavaScript and is deployed with GitHub Pages and Cloudflare.</p></article><aside class="sidebar"><h2>Project links</h2><ul><li><a href="/contact/">Contact</a></li><li><a href="/privacy/">Privacy</a></li><li><a href="https://github.com/canghun13/watersystemsbench">GitHub repository</a></li></ul></aside></section>`;

const contactBody = `${hero("Project contact", "Contact", "Report a calculation issue, unclear assumption, broken source or accessibility problem by email.", "Messages are reviewed when possible, but a response or project-specific technical advice is not guaranteed.")}<section class="section content-layout"><article class="article-body"><h2>Email the project</h2><p><a class="button" href="mailto:canghun13@naver.com">Email canghun13@naver.com</a></p><p>Helpful reports include the page URL, entered units and values, expected result, observed result, browser, and a public technical source when relevant. Do not send passwords, payment details, private infrastructure information or sensitive personal data.</p><h2>What this contact is for</h2><ul><li>Corrections to formulas, units, copy or citations</li><li>Accessibility and browser issues</li><li>Broken links or asset failures</li><li>General project feedback</li></ul><h2>What it cannot provide</h2><p>This email is not an emergency service, utility support line, formal engineering review, equipment approval or guaranteed design consultancy.</p></article><aside class="sidebar"><h2>Before writing</h2><ul><li><a href="/about/">About the project</a></li><li><a href="/privacy/">Privacy information</a></li><li><a href="/systems/pumps-pressure-pipe/">Current system scope</a></li></ul></aside></section>`;

const privacyBody = `${hero("Site information", "Privacy", "A plain-language summary of the data practices supported by the current static site.", "This summary describes the present implementation and may change as the site changes. It is general information, not legal advice.")}<p class="meta-line">Last updated: ${reviewed}</p><section class="section content-layout"><article class="article-body"><h2>Current site operation</h2><p>Water Systems Bench has no account system, no contact form and no project-operated user database. Calculator entries are processed in the browser and are not intentionally submitted to Water Systems Bench.</p><h2>Email</h2><p>The contact link opens the user’s email application. Messages are handled by the user’s and recipient’s email providers under their own terms and practices.</p><h2>Google Analytics</h2><p>The site uses Google Analytics 4. It may process general usage and device information such as visited pages, approximate location derived from network information, referrer, browser and interaction data. Google’s services and applicable browser settings govern associated identifiers and controls.</p><h2>External links</h2><p>Links to public agencies, technical bodies, manufacturers and GitHub lead to external services with their own privacy practices.</p><h2>Changes and questions</h2><p>This page may be updated when site functionality or measurement practices change. Questions can be sent to <a href="mailto:canghun13@naver.com">canghun13@naver.com</a>.</p></article><aside class="sidebar"><h2>Site links</h2><ul><li><a href="/about/">About</a></li><li><a href="/contact/">Contact</a></li><li><a href="/">Home</a></li></ul></aside></section>`;

const pages = [
  { path: "/", title: "Water Systems Bench | Pumps, Reuse & Treatment", h1: "Plan the water path. Check the duty point.", description: "Practical pump, storage, monitoring, irrigation, reuse, industrial and treatment tools for connected water-system planning.", schemaType: "WebPage", crumbs: [["Home", "/"]], body: homeBody, dateModified: "2026-08-31" },
  { path: "/tools/", title: "Water System Tools | Water Systems Bench", h1: "Tools", description: "Use 51 working tools for hydraulics, wells, monitoring, irrigation, reuse, industrial rinse water and water treatment.", schemaType: "CollectionPage", crumbs: [["Home", "/"], ["Tools", "/tools/"]], body: hubBody("Tools"), pageStyle: "/assets/css/tool-finder.css", pageScript: "/assets/js/tool-finder.js", dateModified: "2026-08-31" },
  { path: "/guides/", title: "Water System Guides | Water Systems Bench", h1: "Guides", description: "Read 20 practical guides for pump, well, monitoring, storage, irrigation, reuse, industrial and water-treatment planning.", schemaType: "CollectionPage", crumbs: [["Home", "/"], ["Guides", "/guides/"]], body: hubBody("Guides"), dateModified: "2026-08-31" },
  { path: "/reference/", title: "Water System Reference | Water Systems Bench", h1: "Reference", description: "Check water conversions, demand factors, reuse stream maps, water-quality terms, pipe values and hydraulic formulas.", schemaType: "CollectionPage", crumbs: [["Home", "/"], ["Reference", "/reference/"]], body: hubBody("Reference"), dateModified: "2026-08-11" },
  { path: "/about/", title: "About | Water Systems Bench", h1: "About Water Systems Bench", description: "Learn the purpose, editorial approach and technical structure of Water Systems Bench.", schemaType: "AboutPage", crumbs: [["Home", "/"], ["About", "/about/"]], body: aboutBody, dateModified: "2026-08-08" },
  { path: "/contact/", title: "Contact | Water Systems Bench", h1: "Contact", description: "Contact Water Systems Bench about calculation, source, accessibility or site issues.", schemaType: "ContactPage", crumbs: [["Home", "/"], ["Contact", "/contact/"]], body: contactBody },
  { path: "/privacy/", title: "Privacy | Water Systems Bench", h1: "Privacy", description: "Read how the current static Water Systems Bench site handles calculator inputs, email links, analytics and external links.", schemaType: "WebPage", crumbs: [["Home", "/"], ["Privacy", "/privacy/"]], body: privacyBody },
  { path: "/systems/pumps-pressure-pipe/", title: "Pumps, Pressure & Pipe Flow | Water Systems Bench", h1: "Pumps, Pressure & Pipe Flow", description: "Follow the complete workflow from required flow and TDH through pump curves, power, NPSH and operating cost.", schemaType: "CollectionPage", crumbs: [["Home", "/"], ["Systems", "/systems/pumps-pressure-pipe/"], ["Pumps, Pressure & Pipe Flow", "/systems/pumps-pressure-pipe/"]], body: systemBody, dateModified: "2026-08-08" },
  { path: "/systems/wells-storage-rainwater/", title: "Wells, Storage & Rainwater | Water Systems Bench", h1: "Wells, Storage & Rainwater", description: "Connect well yield, pump duty, pressure tanks, water storage and rainwater harvesting from source to demand.", schemaType: "CollectionPage", crumbs: [["Home", "/"], ["Systems", "/systems/wells-storage-rainwater/"], ["Wells, Storage & Rainwater", "/systems/wells-storage-rainwater/"]], body: wellsSystemBody, dateModified: "2026-08-08" },
  { path: "/systems/irrigation-sprinklers/", title: "Irrigation & Sprinkler Systems | Water Systems Bench", h1: "Irrigation & Sprinkler Systems", description: "Measure irrigation supply, plan sprinkler and drip zones, calculate precipitation and runtime, and troubleshoot weak coverage.", schemaType: "CollectionPage", crumbs: [["Home", "/"], ["Systems", "/systems/irrigation-sprinklers/"], ["Irrigation & Sprinkler Systems", "/systems/irrigation-sprinklers/"]], body: irrigationSystemBody, dateModified: "2026-08-08" },
  { path: "/systems/water-treatment-quality/", title: "Water Treatment & Water Quality | Water Systems Bench", h1: "Water Treatment & Water Quality", description: "Interpret water tests, compare treatment stages, size softening and RO, calculate user-supplied dosing and plan monitoring.", schemaType: "CollectionPage", crumbs: [["Home", "/"], ["Systems", "/systems/water-treatment-quality/"], ["Water Treatment & Water Quality", "/systems/water-treatment-quality/"]], body: treatmentSystemBody, dateModified: "2026-08-08" },
  { path: "/systems/greywater-reuse/", title: "Greywater Reuse Planning | Water Systems Bench", h1: "Greywater Reuse Planning", description: "Estimate household greywater supply, match irrigation demand, plan laundry outlets, check surge basins and screen reuse savings.", schemaType: "CollectionPage", crumbs: [["Home", "/"], ["Systems", "/systems/greywater-reuse/"], ["Greywater Reuse Planning", "/systems/greywater-reuse/"]], body: greywaterSystemBody, dateModified: "2026-08-08" },
  { path: "/systems/vehicle-wash-water-reclaim/", title: "Vehicle Wash Water Reclaim Planning | Water Systems Bench", h1: "Vehicle Wash Water Reclaim Planning", description: "Meter vehicle-wash water use, balance reclaim streams, size peak buffers, plan spot-free RO production and check payback.", schemaType: "CollectionPage", crumbs: [["Home", "/"], ["Systems", "/systems/vehicle-wash-water-reclaim/"], ["Vehicle Wash Water Reclaim Planning", "/systems/vehicle-wash-water-reclaim/"]], body: vehicleWashSystemBody, dateModified: "2026-08-11" },
  { path: "/systems/metal-finishing-rinse-water/", title: "Metal Finishing Rinse Water Optimization | Water Systems Bench", h1: "Metal Finishing Rinse Water Optimization", description: "Audit rinse water, quantify plating drag-out, compare countercurrent stages, analyze logs and check savings.", schemaType: "CollectionPage", crumbs: [["Home", "/"], ["Systems", "/systems/metal-finishing-rinse-water/"], ["Metal Finishing Rinse Water Optimization", "/systems/metal-finishing-rinse-water/"]], body: metalSystemBody, dateModified: "2026-08-24" },
  { path: "/systems/monitoring-well-sampling/", title: "Monitoring Well Purging & Low-Flow Sampling | Water Systems Bench", h1: "Monitoring Well Purging & Low-Flow Sampling", description: "Plan monitoring-well volume, low-flow setup, equipment exchange intervals and field-log stabilization checks.", schemaType: "CollectionPage", crumbs: [["Home", "/"], ["Systems", "/systems/monitoring-well-sampling/"], ["Monitoring Well Purging & Low-Flow Sampling", "/systems/monitoring-well-sampling/"]], body: monitoringWellSystemBody, dateModified: "2026-08-31" },
  ...toolData.map((tool) => ({ path: tool.path, title: `${tool.h1} | Water Systems Bench`, h1: tool.h1, description: tool.description, schemaType: "WebApplication", crumbs: [["Home", "/"], ["Tools", "/tools/"], [tool.h1, tool.path]], body: toolBody(tool), toolScript: tool.script, dateModified: tool.modified || (tool.cluster === "Metal finishing rinse water optimization" ? "2026-08-24" : tool.cluster === "Vehicle wash water reclaim planning" ? "2026-08-11" : tool.reviewed ? "2026-08-08" : undefined) })),
  ...guideData.map((guide) => ({ path: guide.path, title: `${guide.h1} | Water Systems Bench`, h1: guide.h1, description: guide.description, schemaType: "TechArticle", crumbs: [["Home", "/"], ["Guides", "/guides/"], [guide.h1, guide.path]], body: guideBody(guide), dateModified: monitoringWellGuideLinks.some(([path]) => path === guide.path) ? "2026-08-31" : metalGuideLinks.some(([path]) => path === guide.path) ? "2026-08-24" : vehicleWashGuideLinks.some(([path]) => path === guide.path) ? "2026-08-11" : guide.reviewed ? "2026-08-08" : undefined })),
  ...referenceData.map((ref) => ({ path: ref.path, title: `${ref.h1} | Water Systems Bench`, h1: ref.h1, description: ref.description, schemaType: "TechArticle", crumbs: [["Home", "/"], ["Reference", "/reference/"], [ref.h1, ref.path]], body: referenceBody(ref), dateModified: monitoringWellReferenceLinks.some(([path]) => path === ref.path) ? "2026-08-31" : metalReferenceLinks.some(([path]) => path === ref.path) ? "2026-08-24" : vehicleWashReferenceLinks.some(([path]) => path === ref.path) ? "2026-08-11" : ref.reviewed ? "2026-08-08" : undefined }))
];

if (pages.length !== 98) throw new Error(`Expected 98 pages, received ${pages.length}.`);

for (const page of pages) {
  const output = page.path === "/" ? join(root, "index.html") : join(root, page.path.slice(1), "index.html");
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, pageTemplate(page), "utf8");
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `  <url><loc>${domain}${page.path}</loc><lastmod>${page.dateModified || "2026-07-29"}</lastmod></url>`).join("\n")}
</urlset>
`;
await writeFile(join(root, "sitemap.xml"), sitemap, "utf8");
await writeFile(join(root, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${domain}/sitemap.xml\n`, "utf8");
await writeFile(join(root, "llms.txt"), `# Water Systems Bench

> A practical workflow hub for sizing, checking, troubleshooting and planning real-world water systems from source to use.

## Current implemented clusters

- [Pumps, Pressure & Pipe Flow](${domain}/systems/pumps-pressure-pipe/)
- [Wells, Storage & Rainwater](${domain}/systems/wells-storage-rainwater/)
- [Irrigation & Sprinkler Systems](${domain}/systems/irrigation-sprinklers/)
- [Water Treatment & Water Quality](${domain}/systems/water-treatment-quality/)
- [Greywater Reuse Planning](${domain}/systems/greywater-reuse/)
- [Vehicle Wash Water Reclaim Planning](${domain}/systems/vehicle-wash-water-reclaim/)
- [Metal Finishing Rinse Water Optimization](${domain}/systems/metal-finishing-rinse-water/)
- [Monitoring Well Purging & Low-Flow Sampling](${domain}/systems/monitoring-well-sampling/)

## Tools

${toolLinks.map(([href, title]) => `- [${title}](${domain}${href})`).join("\n")}

## Guides

${guideLinks.map(([href, title]) => `- [${title}](${domain}${href})`).join("\n")}

## Reference

${referenceLinks.map(([href, title]) => `- [${title}](${domain}${href})`).join("\n")}

## Safety and limitations

The site supports preliminary planning. Outputs are not formal engineering approval, sampling authorization, potable-water certification, legal advice, manufacturer selection, or a universal regulatory determination. Verify measurements, accredited laboratory results, applicable requirements, official certified-product listings and current manufacturer data. Chemical dose and CT tools use user-supplied targets and never recommend legal or health values. Greywater tools never approve a source, potable use, plumbing connection, storage method, setback or jurisdictional compliance. Vehicle-wash tools never select treatment, approve reclaimed-water quality, or authorize wastewater, reject, backwash or sludge discharge. Metal-finishing tools never set chemistry, rinse acceptance, exposure or discharge limits. Monitoring-well tools never select a sampling method, establish representativeness, authorize sample collection or approve purge-water disposal.

## Contact and source

- Contact: canghun13@naver.com
- Repository: https://github.com/canghun13/watersystemsbench
`, "utf8");

console.log(`Generated ${pages.length} public HTML pages.`);
