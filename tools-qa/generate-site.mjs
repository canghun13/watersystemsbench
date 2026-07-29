import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const domain = "https://watersystemsbench.com";
const reviewed = "July 28, 2026";
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
};

const toolLinks = [
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

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function cardGrid(items, label = "Open") {
  return `<div class="grid three">${items.map(([href, title, text], index) => `<article class="bench-card" data-step="${String(index + 1).padStart(2, "0")}"><h3>${title}</h3><p>${text}</p><a class="card-link" href="${href}">${label} →</a></article>`).join("")}</div>`;
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
    dateModified: "2026-07-28",
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
${page.toolScript ? '  <link rel="stylesheet" href="/assets/css/calculator.css">' : ""}
  ${ga4}
  <script type="application/ld+json">${schemaFor(page)}</script>
  <script type="module" src="/assets/js/partials.js"></script>
  <script type="module" src="/assets/js/main.js"></script>
${page.toolScript ? `  <script type="module" src="${page.toolScript}"></script>` : ""}
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
    <a href="https://kittylaunch.com/p/water-systems-bench" target="_blank" rel="noopener" style="display:inline-block;">
      <img src="https://kittylaunch.com/api/public/badges/launch_badge.svg?theme=light&name=Water%20Systems%20Bench" alt="Water Systems Bench on KittyLaunch" data-kittylaunch-badge="1" style="margin:0 2px;height:36px;" />
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

const irrigationToolCommon = {
  cluster: "Irrigation & sprinkler systems",
  sources: [sources.nrcsIrrigation, sources.hunter, sources.rainBird],
  assumptions: "Entered measurements represent the same operating condition. Calculations use unrounded SI values and convert only for display.",
  limitations: "This is a preliminary planning screen, not a design approval, irrigation audit, pump curve analysis or distribution-uniformity test.",
  warning: "Use current manufacturer data and local requirements. Isolate electrical and pressurized equipment before service; use qualified help for backflow, pump controls and buried piping."
};
toolData.push(
  { ...irrigationToolCommon, path: irrigationToolLinks[0][0], script: "/assets/js/tools/irrigation-tools.js", type: "Calculator", h1: irrigationToolLinks[0][1], description: "Calculate available irrigation flow from bucket or meter measurements, with repeat-test spread and SI/US results.", purpose: "Converts a measured container volume or meter difference and timed trial into flow; it keeps dynamic pressure as a separate required observation.", when: "Use before designing or altering a zone, with other demand isolated where safe.", method: `<div class="formula">Flow (L/min) = measured litres × 60 / seconds</div><p>Repeat comparable trials and investigate a large spread rather than treating one reading as a permanent capacity.</p>`, example: "10 L collected in 20 seconds equals 30 L/min (0.5 L/s, 1.8 m³/h, 7.93 GPM).", related: [[irrigationToolLinks[1][0], irrigationToolLinks[1][1]], [irrigationGuideLinks[0][0], irrigationGuideLinks[0][1]], [toolLinks[2][0], toolLinks[2][1]], ["/systems/irrigation-sprinklers/", "Irrigation workflow"]], form: `<form data-tool-form="irrigation-flow">${unitSelect}<div class="field-grid">${select("mode", "Measurement method", [["bucket", "Bucket / container"], ["meter", "Meter difference"]], "full")}${input("volume", "Collected volume or meter difference", "10", "volume")}${input("seconds", "Measurement time (seconds)", "20")}${input("trial2", "Optional second trial time (seconds)", "", "", { optional: true })}${input("trial3", "Optional third trial time (seconds)", "", "", { optional: true })}</div>${actions("Calculate flow")}</form>` },
  { ...irrigationToolCommon, path: irrigationToolLinks[1][0], script: "/assets/js/tools/irrigation-tools.js", type: "Planner", h1: irrigationToolLinks[1][1], description: "Plan whole sprinkler-head capacity using measured flow, reserve, dynamic pressure, head demand and losses.", purpose: "Screens both flow and pressure margins so a flow-only head count is not mistaken for a feasible zone.", when: "Use after measuring available flow and dynamic pressure at comparable conditions.", method: `<div class="formula">Usable flow = available flow × (1 − reserve); pressure margin = dynamic − required head − losses − elevation head</div>`, example: "100 L/min with 10% reserve and 12 L/min/head yields seven whole heads and 6 L/min unused.", related: [[irrigationToolLinks[0][0], irrigationToolLinks[0][1]], [irrigationToolLinks[5][0], irrigationToolLinks[5][1]], [irrigationGuideLinks[1][0], irrigationGuideLinks[1][1]], ["/systems/irrigation-sprinklers/", "Irrigation workflow"]], form: `<form data-tool-form="irrigation-zone">${unitSelect}<div class="field-grid">${input("available", "Available measured flow", "100", "flow")}${input("reserve", "Flow reserve (%)", "10")}${input("perHead", "Per-head flow", "12", "flow")}${input("heads", "Proposed head count", "7", "", { optional: true, step: "1" })}${input("dynamic", "Dynamic pressure", "400", "pressure")}${input("required", "Required head pressure", "210", "pressure")}${input("loss", "Pipe / valve / filter loss", "50", "pressure")}${input("rise", "Elevation rise", "0", "head")}</div>${actions("Plan capacity")}</form>` },
  { ...irrigationToolCommon, path: irrigationToolLinks[2][0], script: "/assets/js/tools/irrigation-tools.js", type: "Calculator", h1: irrigationToolLinks[2][1], description: "Calculate sprinkler precipitation rate from total flow and area or from head flow, arc and rectangular or triangular spacing.", purpose: "Converts a verified nozzle discharge and wetted layout into theoretical applied depth per hour.", when: "Use with current nozzle data and an actual layout; precipitation rate is not a distribution-uniformity score.", method: `<div class="formula">mm/h = total L/min × 60 / area m²</div>`, example: "120 L/min over 4,000 m² produces 1.8 mm/h; 45 minutes applies 1.35 mm.", related: [[irrigationToolLinks[3][0], irrigationToolLinks[3][1]], [irrigationGuideLinks[1][0], irrigationGuideLinks[1][1]], ["/systems/irrigation-sprinklers/", "Irrigation workflow"]], form: `<form data-tool-form="irrigation-precipitation">${unitSelect}<div class="field-grid">${select("mode", "Calculation mode", [["total", "Total flow and area"], ["spacing", "Head flow and spacing"]], "full")}${input("flow", "Total or per-head flow", "120", "flow")}${input("area", "Irrigated area", "4000", "area")}${input("x", "Head spacing", "4", "length")}${input("y", "Row spacing", "4", "length")}${select("layout", "Spacing layout", [["rect", "Rectangular"], ["tri", "Triangular"]])}${input("runtime", "Optional runtime (minutes)", "45", "", { optional: true })}</div>${actions("Calculate precipitation")}</form>` },
  { ...irrigationToolCommon, path: irrigationToolLinks[3][0], script: "/assets/js/tools/irrigation-tools.js", type: "Planner", h1: irrigationToolLinks[3][1], description: "Plan irrigation runtime, gross water depth, event and cycle length from target depth, application rate and efficiency.", purpose: "Converts net target depth into a transparent gross application and cycle-and-soak schedule.", when: "Use after confirming precipitation rate and observing infiltration/runoff.", method: `<div class="formula">Gross depth = net target / efficiency; runtime = gross depth / precipitation rate</div>`, example: "20 mm net at 80% efficiency and 10 mm/h needs 25 mm gross and 150 minutes.", related: [[irrigationToolLinks[2][0], irrigationToolLinks[2][1]], [irrigationToolLinks[4][0], irrigationToolLinks[4][1]], [irrigationGuideLinks[1][0], irrigationGuideLinks[1][1]], ["/systems/irrigation-sprinklers/", "Irrigation workflow"]], form: `<form data-tool-form="irrigation-runtime">${unitSelect}<div class="field-grid">${input("depth", "Target net water depth", "20", "rainfall")}${input("rate", "Precipitation rate", "10", "rainfall")}${input("efficiency", "Application efficiency (%)", "80")}${input("area", "Optional irrigated area", "500", "area", { optional: true })}${input("events", "Watering events", "1", "", { step: "1" })}${input("cycles", "Cycles per event", "1", "", { step: "1" })}${input("intake", "Optional soil intake rate", "", "rainfall", { optional: true })}</div>${actions("Plan runtime")}</form>` },
  { ...irrigationToolCommon, path: irrigationToolLinks[4][0], script: "/assets/js/tools/irrigation-tools.js", type: "Calculator", h1: irrigationToolLinks[4][1], description: "Calculate direct emitter or row-geometry drip flow, event volume and practical zone splitting.", purpose: "Totals emitters without allowing direct and geometry input to be counted at once.", when: "Use with the actual emitter discharge at operating pressure and field row geometry.", method: `<div class="formula">Total L/h = emitters × emitter L/h; geometry uses floor(row length / spacing) + 1 endpoints.</div>`, example: "100 m rows at 0.5 m spacing, 10 rows and 2 L/h emitters total 4,020 L/h.", related: [[irrigationToolLinks[3][0], irrigationToolLinks[3][1]], [irrigationGuideLinks[1][0], irrigationGuideLinks[1][1]], ["/systems/irrigation-sprinklers/", "Irrigation workflow"]], form: `<form data-tool-form="irrigation-drip">${unitSelect}<div class="field-grid">${select("mode", "Input mode", [["direct", "Direct emitter count"], ["rows", "Row geometry"]], "full")}${input("emitters", "Direct emitter count", "100", "", { step: "1" })}${input("emitter", "Emitter flow", "4", "", { hint: "L/h" })}${input("rowLength", "Row length", "100", "length")}${input("spacing", "Emitter spacing", "0.5", "length")}${input("rows", "Row count", "10", "", { step: "1" })}${input("available", "Optional available flow", "50", "flow", { optional: true })}${input("reserve", "Flow reserve (%)", "10")}${input("hours", "Event duration (hours)", "1.5")}</div>${actions("Calculate drip zones")}</form>` },
  { ...irrigationToolCommon, path: irrigationToolLinks[5][0], script: "/assets/js/tools/irrigation-tools.js", type: "Comparator", h1: irrigationToolLinks[5][1], description: "Compare one entered pump duty condition against one irrigation zone's flow and head requirement, including reserve.", purpose: "Makes the single-duty-condition screen explicit and links onward to TDH and pump curve work.", when: "Use only after a current pump curve or manufacturer duty condition is available.", method: `<div class="formula">Required head = operating pressure head + elevation + pipe/valve loss; reserve applies to both flow and head screen.</div>`, example: "100 L/min at 60 m against an 80 L/min, 200 kPa zone with 10 m rise and 5 m loss is a Match with 10% reserve.", related: [[toolLinks[0][0], toolLinks[0][1]], [toolLinks[5][0], toolLinks[5][1]], [irrigationToolLinks[1][0], irrigationToolLinks[1][1]], ["/systems/irrigation-sprinklers/", "Irrigation workflow"]], form: `<form data-tool-form="irrigation-pump">${unitSelect}<div class="field-grid">${input("pumpFlow", "Pump available flow", "100", "flow")}${input("pumpHead", "Pump available head", "60", "head")}${input("zoneFlow", "Zone required flow", "80", "flow")}${input("pressure", "Zone operating pressure", "200", "pressure")}${input("rise", "Elevation rise", "10", "head")}${input("loss", "Pipe / valve / filter loss", "5", "head")}${input("reserve", "Safety margin (%)", "10")}</div>${actions("Match pump and zone")}</form>` },
  { ...irrigationToolCommon, path: irrigationToolLinks[6][0], script: "/assets/js/tools/irrigation-tools.js", type: "Troubleshooter", h1: irrigationToolLinks[6][1], description: "Prioritize likely irrigation low-pressure cause groups from zone scope, pressure, flow, nozzle, valve, filter, leak and pump evidence.", purpose: "Provides triage and the next measurement, not a confirmed diagnosis.", when: "Use after a safe visual inspection and, where appropriate, comparable static/dynamic pressure and flow measurements.", method: `<p>Rules weigh evidence for local head/nozzle issues, zone restrictions or leaks, excess demand, source-wide limits and pumped-source faults.</p>`, example: "One weak zone with a restricted filter leads with zone valve/filter restriction and a safe filter/valve check before changing pressure equipment.", related: [[irrigationToolLinks[0][0], irrigationToolLinks[0][1]], [irrigationToolLinks[1][0], irrigationToolLinks[1][1]], [irrigationGuideLinks[2][0], irrigationGuideLinks[2][1]], ["/systems/irrigation-sprinklers/", "Irrigation workflow"]], form: `<form data-tool-form="irrigation-troubleshoot"><div class="field-grid">${select("scope", "Affected area", [["one", "One head"], ["zone", "One zone"], ["all", "All zones"]])}${select("filter", "Filter restricted?", [["unknown", "Unknown"], ["yes", "Yes"], ["no", "No"]])}${select("leak", "Leak or soggy patch?", [["no", "No"], ["yes", "Yes"]])}${select("nozzle", "Nozzles recently enlarged?", [["no", "No"], ["yes", "Yes"]])}${select("pump", "Pump alarm, lost prime or dry-run sign?", [["no", "No"], ["yes", "Yes"]])}${select("dynamic", "Dynamic pressure / flow low across all zones?", [["no", "No / unknown"], ["yes", "Yes"]])}</div>${actions("Analyze symptoms")}</form>` }
);

function toolBody(tool) {
  const phase2 = tool.cluster;
  const irrigation = phase2 === "Irrigation & sprinkler systems";
  const systemPath = irrigation ? "/systems/irrigation-sprinklers/" : phase2 ? "/systems/wells-storage-rainwater/" : "/systems/pumps-pressure-pipe/";
  const systemName = irrigation ? "Irrigation & Sprinkler Systems workflow" : phase2 ? "Wells, Storage & Rainwater workflow" : "Start with the pump-system workflow";
  return `${hero(`${phase2 || "Pump systems"} / ${tool.type}`, tool.h1, tool.description, "Preliminary planning output only. Use measured data where possible and verify manufacturer and jurisdiction-specific requirements.")}
  <p class="meta-line">Last reviewed: ${reviewed} · SI first · US customary supported</p>
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
  </article><aside class="sidebar"><h2>Bench sequence</h2><ul><li><a href="${systemPath}">${systemName}</a></li><li><a href="${irrigation ? irrigationGuideLinks[0][0] : phase2 ? phase2GuideLinks[1][0] : "/guides/how-to-size-a-water-pump/"}">${irrigation ? "Measure supply first" : phase2 ? "Plan the connected source system" : "Build flow and TDH"}</a></li><li><a href="${irrigation ? irrigationToolLinks[1][0] : phase2 ? phase2ReferenceLinks[0][0] : "/reference/pump-formulas-hydraulic-terms/"}">${irrigation ? "Build a feasible zone" : phase2 ? "Check demand factors" : "Check formulas and terms"}</a></li><li><a href="/contact/">Report a content issue</a></li></ul></aside></div>`;
}

const homeBody = `${hero("Hydraulic field bench", "Plan the water path. Check the duty point.", "Practical tools, field-oriented guides and technical references for pumps, wells, pressure tanks, storage and rainwater—from source capacity to daily use.", "Built for global use with SI-first calculations and common US customary units. Results support preliminary planning; they are not formal design approval.", '<div class="hero-actions"><a class="button" href="/systems/wells-storage-rainwater/">Start the source workflow</a><a class="button secondary" href="/tools/">Open all tools</a></div>')}
<div class="status-strip"><span>Irrigation cluster live</span><span>24 working tools</span><span>11 field guides</span><span>6 references</span></div>
<section class="section"><div class="section-heading"><p class="eyebrow">System, not a card catalogue</p><h2>Follow water from source to use</h2><p class="lede">Water-system decisions depend on each other. Storage changes pump duty. Pipe size changes friction. Pressure requirements change power. Treatment and end use shape the whole path.</p></div><div class="flow-line"><span>Source</span><span>Storage</span><span>Pumping</span><span>Pipes</span><span>Treatment</span><span>Use</span></div></section>
<section class="section"><div class="section-heading"><p class="eyebrow">Three connected system clusters</p><h2>Start with the system you are planning</h2></div>${cardGrid([["/systems/pumps-pressure-pipe/", "Pumps, Pressure & Pipe Flow", "Build flow, TDH, loss, duty point, power and suction checks."], ["/systems/wells-storage-rainwater/", "Wells, Storage & Rainwater", "Connect source yield, pumping, pressure, stored volume and roof collection."], ["/systems/irrigation-sprinklers/", "Irrigation & Sprinkler Systems", "Measure supply, build zones, set runtime and troubleshoot coverage."]], "Open system")}</section>
<section class="section"><div class="section-heading"><p class="eyebrow">Wells, storage and rainwater</p><h2>New source-to-use planning tools</h2></div>${cardGrid([phase2ToolLinks[0], phase2ToolLinks[1], phase2ToolLinks[4], phase2ToolLinks[5], phase2ToolLinks[6]], "Use tool")}</section>
<section class="section"><div class="section-heading"><p class="eyebrow">Three ways in</p><h2>Calculate, understand, verify</h2></div>${cardGrid([["/tools/", "Tools", "Use interactive forms with transparent methods and limitations."], ["/guides/", "Guides", "Work through pump sizing, curves and low-pressure diagnosis."], ["/reference/", "Reference", "Check conversions, pipe data, formulas and hydraulic terms."]])}</section>
<section class="section"><h2>What comes next</h2><p class="lede">Future work will connect irrigation and treatment. Those areas are not published as empty pages or inactive links.</p><div class="notice"><strong>Use the result as evidence, not approval.</strong> Verify measurements, manufacturer curves, water quality, local rules and qualified engineering requirements for the actual project.</div></section>`;

function hubBody(kind) {
  const isTools = kind === "Tools";
  const isGuides = kind === "Guides";
  const items = isTools ? toolLinks : isGuides ? guideLinks : referenceLinks;
  const description = isTools ? "Working calculators, planners, checks and troubleshooting across pump, well, storage and rainwater systems." : isGuides ? "Field-oriented explanations that connect source measurements, formulas and the next useful tool." : "Conversion tables, formulas, demand factors, pipe values and hydraulic terms used across both implemented workflows.";
  return `${hero(`${kind} index`, kind, description, "Only completed Phase 1 and Phase 2 resources are linked. Planned future clusters remain documented without empty public pages.")}<p class="meta-line">Updated: ${reviewed} · ${items.length} published ${kind.toLowerCase()}</p><section class="section">${cardGrid(items, isTools ? "Use tool" : "Read")}</section><section class="section"><div class="notice"><strong>Practical boundary.</strong> These resources support preliminary decisions and transparent checking. They do not replace manufacturer data, local requirements or project-specific professional review.</div></section>`;
}

const systemBody = `${hero("System hub / Phase 1", "Pumps, Pressure & Pipe Flow", "Build the duty point in the right order: required flow, static head, delivery pressure, pipe loss, pump curve, power, suction conditions and operating cost.", "Measured values describe the present system. Estimated values describe a planning assumption. Label both before comparing equipment.", '<div class="hero-actions"><a class="button" href="/tools/total-dynamic-head-calculator/">Start with total dynamic head</a><a class="button secondary" href="/guides/how-to-size-a-water-pump/">Read the sizing workflow</a></div>')}
<div class="status-strip"><span>9 tools</span><span>3 guides</span><span>5 references</span></div>
<section class="section"><h2>The recommended sequence</h2><div class="flow-line"><span>Required flow</span><span>Static head</span><span>Required pressure</span><span>Pipe loss</span><span>Duty point</span><span>Power & NPSH</span></div><div class="notice"><strong>Start with flow.</strong> A pump does not have one universal head or flow. It operates where its curve and the system curve meet.</div></section>
<section class="section"><h2>Inputs to collect</h2>${cardGrid([["/guides/how-to-size-a-water-pump/", "Demand and required flow", "Peak, simultaneous or process flow with a stated basis."], ["/tools/total-dynamic-head-calculator/", "Elevation and pressure", "Gauge locations, elevation datum and target pressure."], ["/tools/pipe-friction-loss-calculator/", "Pipe path and fittings", "Actual ID, length, material/roughness and duty flow."], ["/tools/pump-curve-duty-point-comparator/", "Manufacturer curve points", "Exact speed, impeller and fluid condition."], ["/tools/npsh-available-calculator/", "Suction conditions", "Absolute pressure, temperature, level and losses."], ["/tools/pump-operating-cost-comparator/", "Operating schedule", "Input power, hours, tariff and maintenance."]], "Open step")}</section>
<section class="section"><h2>Tools on the bench</h2>${cardGrid(toolLinks, "Use tool")}</section>
<section class="section"><h2>Understand the decisions</h2>${cardGrid(guideLinks, "Read guide")}</section>
<section class="section"><h2>Check the underlying data</h2>${cardGrid(referenceLinks, "Open reference")}</section>
<section class="section"><h2>Connections beyond this cluster</h2><p class="lede"><a href="/systems/wells-storage-rainwater/">Wells, Storage & Rainwater</a> now defines source yield, stored volume and source-side pump duty. Future irrigation and treatment clusters will connect after they are fully implemented.</p></section>`;

const wellsSystemBody = `${hero("System hub / Phase 2", "Wells, Storage & Rainwater", "Connect source capability, pump duty, pressure control, stored water and roof collection before selecting equipment.", "Keep sustained source capacity, peak demand and stored volume as separate quantities. Test dry and high-demand cases, not only annual averages.", '<div class="hero-actions"><a class="button" href="/tools/well-yield-demand-checker/">Check source and demand</a><a class="button secondary" href="/guides/complete-well-water-system-planning/">Read the full workflow</a></div>')}
<div class="status-strip"><span>8 tools</span><span>5 guides</span><span>1 demand reference</span></div>
<section class="section"><h2>The source-to-use sequence</h2><div class="flow-line"><span>Source yield</span><span>Demand</span><span>Pump duty</span><span>Pressure</span><span>Storage</span><span>End use</span></div><div class="notice"><strong>Balance rates and volumes separately.</strong> A source can cover daily volume but still need storage for peaks; a tank cannot correct a sustained daily deficit.</div></section>
<section class="section"><h2>Two connected paths</h2>${cardGrid([["/tools/well-yield-demand-checker/", "Well and borehole path", "Sustained yield → demand → pump duty → pressure tank → bulk storage."], ["/tools/rainwater-harvesting-yield-calculator/", "Rainwater path", "Roof area → rainfall yield → first flush → tank simulation → end use."]], "Start path")}</section>
<section class="section"><h2>Tools on the bench</h2>${cardGrid(phase2ToolLinks, "Use tool")}</section>
<section class="section"><h2>Understand the decisions</h2>${cardGrid(phase2GuideLinks, "Read guide")}</section>
<section class="section"><h2>Check demand assumptions</h2>${cardGrid(phase2ReferenceLinks, "Open reference")}</section>
<section class="section"><h2>Connect pump hydraulics</h2>${cardGrid([[toolLinks[0][0], toolLinks[0][1], toolLinks[0][2]], [toolLinks[1][0], toolLinks[1][1], toolLinks[1][2]], [toolLinks[5][0], toolLinks[5][1], toolLinks[5][2]], [toolLinks[3][0], toolLinks[3][1], toolLinks[3][2]], [toolLinks[6][0], toolLinks[6][1], toolLinks[6][2]]], "Open pump tool")}</section>
<section class="section"><h2>Safety and water quality</h2><p class="lede">Groundwater and rainwater quality cannot be inferred from appearance or quantity. Protect source integrity, separate untreated rainwater from safe piped water, test for the intended use, and follow local well, plumbing, storage and public-health requirements.</p></section>`;

const irrigationSystemBody = `${hero("System hub / Phase 3", "Irrigation & Sprinkler Systems", "Move from measured supply to feasible zones, application rate, runtime and fault finding without confusing flow, dynamic pressure and water depth.", "Flow is quantity per time. Dynamic pressure is energy while water is moving. Precipitation rate is depth per time. Runtime supplies a chosen depth.", '<div class="hero-actions"><a class="button" href="/tools/available-water-flow-test-calculator/">Measure available flow</a><a class="button secondary" href="/guides/measure-irrigation-flow-pressure/">Read the measurement guide</a></div>')}
<div class="status-strip"><span>7 tools</span><span>3 guides</span><span>Measure → zone → apply → schedule</span></div>
<section class="section"><h2>The irrigation workflow</h2><div class="flow-line"><span>Source</span><span>Storage</span><span>Pumping</span><span>Irrigation</span><span>Zones</span><span>Use</span></div><p class="lede">First measure flow and dynamic pressure. Then create zones that pass both flow and pressure checks, calculate application rate, schedule water and investigate weak coverage with evidence.</p></section>
<section class="section"><h2>Recommended sequence</h2>${cardGrid([[irrigationToolLinks[0][0], irrigationToolLinks[0][1], "Measure bucket or meter flow and record dynamic pressure."], [irrigationToolLinks[1][0], irrigationToolLinks[1][1], "Check discrete heads against flow and pressure."], [toolLinks[2][0], toolLinks[2][1], "Check pipe velocity before accepting a zone."], [irrigationToolLinks[5][0], irrigationToolLinks[5][1], "Compare a pumped supply at one stated duty."], [irrigationToolLinks[2][0], irrigationToolLinks[2][1], "Convert nozzle discharge and layout into depth per hour."], [irrigationToolLinks[3][0], irrigationToolLinks[3][1], "Set runtime and cycle-and-soak observations."]], "Open step")}</section>
<section class="section"><h2>Sprinkler and drip paths</h2>${cardGrid([[irrigationToolLinks[2][0], irrigationToolLinks[2][1], "For sprays and rotors: use actual nozzle flow and layout."], [irrigationToolLinks[4][0], irrigationToolLinks[4][1], "For drip: total direct emitters or row geometry, never both."], [irrigationToolLinks[6][0], irrigationToolLinks[6][1], "For weak coverage: isolate scope, demand, restriction, leak and source evidence."]], "Use tool")}</section>
<section class="section"><h2>Guides and connected systems</h2>${cardGrid(irrigationGuideLinks, "Read guide")}${cardGrid([["/systems/pumps-pressure-pipe/", "Pumps, Pressure & Pipe Flow", "Use TDH, pipe loss and pump curve tools for complete hydraulic review."], ["/systems/wells-storage-rainwater/", "Wells, Storage & Rainwater", "Connect a well, storage or rainwater source before setting irrigation demand."]], "Open system")}</section>
<section class="section"><div class="notice"><strong>Safety and local requirements.</strong> Use current product data and local watering rules. Do not bypass backflow protection, open energized controls, excavate without utility location or dismantle pressurized piping. These screens do not certify code compliance or distribution uniformity.</div></section>`;

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

guideData.push(
  { path: irrigationGuideLinks[0][0], h1: irrigationGuideLinks[0][1], description: "A measurement-led method for irrigation flow and dynamic pressure using bucket, meter and gauge observations.", intro: "Irrigation planning begins with what the supply can deliver while water is moving. Static pressure, dynamic pressure and measured flow answer different questions.", sections: [["1. Start safely", "Do not open energized controllers, pressure vessels or buried equipment. Stop for flooding, damaged piping, electrical hazards or a dry-running pump."], ["2. Separate pressure from flow", "Static pressure is recorded with no intentional draw. Dynamic pressure is recorded at the same gauge location while a defined zone or test outlet is flowing. Flow is volume per time."], ["3. Run a bucket test", "Use a known container, time the fill accurately and calculate litres per minute. Repeat at least three comparable trials; isolate unrelated demand only where it is safe and permitted."], ["4. Run a meter test", "Record a stable start and end meter reading, the exact interval and the units. Subtract readings before converting; an end reading equal to or below the start is not a valid delivered-volume test."], ["5. Record dynamic pressure", "Fit or use an appropriate gauge at a safe accessible point. Record gauge location, elevation, static reading, active zone, nozzle condition and dynamic reading together."], ["6. Compare conditions", "Municipal supplies can vary by time and demand; pumps can react to cycling, water level and controls. Repeat observations under comparable conditions before concluding capacity."], ["7. Use the measured result", "Enter the measured flow in the Available Water Flow Test Calculator, preserve a reserve, then check both zone flow and pressure margin."], ["8. Note uncertainty", "Bucket shape, timing delay, other demand, gauge location, partly closed valves, filters and changing nozzle sets affect a field result. Record what changed rather than averaging unlike conditions."]], example: "Three 10 L bucket trials taking 20, 25 and 30 seconds yield 30, 24 and 20 L/min: average 24.67 L/min with a 40.54% spread. Repeat before using it as zone capacity.", sources: [sources.nrcsIrrigation, sources.okState, sources.epaWatersense], related: [[irrigationToolLinks[0][0], irrigationToolLinks[0][1]], [irrigationToolLinks[1][0], irrigationToolLinks[1][1]], ["/systems/irrigation-sprinklers/", "Irrigation & Sprinkler Systems"], [toolLinks[8][0], toolLinks[8][1]]] },
  { path: irrigationGuideLinks[1][0], h1: irrigationGuideLinks[1][1], description: "Plan sprinkler and drip zones by matching product data, available flow, pressure, elevation and landscape needs.", intro: "A practical zone is both hydraulically feasible and appropriate for the landscape. Similar plants alone do not overcome mismatched nozzles, insufficient flow or pressure loss.", sections: [["1. Inventory devices", "Record type, model, arc, stated flow at stated pressure, count and condition. Keep sprays, rotors and drip separate unless current manufacturer data supports a compatible design."], ["2. Preserve a measured-flow reserve", "Use measured available flow, select a transparent reserve and floor whole heads or rows. A partial head is not a capacity result."], ["3. Check pressure separately", "Start with dynamic pressure, subtract required head pressure, elevation and measured or calculated pipe, valve and filter losses. A zone can pass flow and fail pressure."], ["4. Group landscape conditions", "Group sun, shade, soil, slope, plant material and exposure after the hydraulic screen. Different precipitation rates demand different schedules."], ["5. Check layout", "Follow actual manufacturer spacing and arc data. Head-to-head language is a layout starting point, not a substitute for current nozzle charts or an irrigation audit."], ["6. Convert rate to time", "Use precipitation rate and target depth to determine runtime. Watch for runoff, reduce cycle length and allow soak time where soil intake is lower than application rate."], ["7. Consider pumped supply", "A pump catalogue maximum is not a zone duty point. Compare one operating condition, then use TDH and the exact pump curve for full review."], ["8. Commission in the field", "Observe coverage, pressure, leaks, valve opening and actual nozzle installation. Record changes so future diagnosis has a baseline."]], example: "With 100 L/min measured flow, 10% reserve and 12 L/min per head, seven heads fit hydraulically by flow. At 400 kPa dynamic pressure, 210 kPa required head pressure, 50 kPa loss and 10 m rise, pressure margin is 41.93 kPa.", sources: [sources.nrcsIrrigation, sources.hunter, sources.rainBird], related: [[irrigationToolLinks[1][0], irrigationToolLinks[1][1]], [irrigationToolLinks[2][0], irrigationToolLinks[2][1]], [irrigationToolLinks[4][0], irrigationToolLinks[4][1]], [irrigationToolLinks[3][0], irrigationToolLinks[3][1]], ["/systems/irrigation-sprinklers/", "Irrigation & Sprinkler Systems"]] },
  { path: irrigationGuideLinks[2][0], h1: irrigationGuideLinks[2][1], description: "A safe, evidence-led sequence for diagnosing a weak sprinkler zone without jumping to a pump or pressure conclusion.", intro: "Weak coverage is a symptom. This sequence separates a single-head fault, a zone restriction or leak, excess demand, elevation, source limits and pump behavior.", sections: [["1. Stop for urgent conditions", "Stop the zone and seek qualified help for electrical hazards, flooding, damaged pressure equipment, dry-running indications or a pump alarm/lost-prime condition."], ["2. Define scope", "Identify whether one head, one zone, several zones or all zones are affected. This first distinction prevents a local obstruction from being treated as a source failure."], ["3. Observe changes", "Note new nozzles, recent work, filter service, valve changes, weather, schedule changes, pump cycling and when the symptom began."], ["4. Inspect accessible evidence", "Look for broken heads, blocked nozzles, failure to pop up, leaks and soggy areas. Do not excavate without utility location or dismantle pressurized parts."], ["5. Check demand", "Total current nozzle flow and compare it with measured usable flow. Larger nozzles can produce short reach and weak far heads even when static pressure appears normal."], ["6. Compare dynamic conditions", "Measure static and dynamic pressure at comparable locations. Compare near/far and low/high heads for restriction or elevation evidence."], ["7. Check valve and filter safely", "A restricted filter or partially opening zone valve affects one zone differently from a source-wide shortage. Follow the equipment instructions before any service."], ["8. Escalate correctly", "Pumped systems with collapse across all zones, alarms or lost prime need qualified pump and electrical service. Do not bypass backflow protection or alter controls."], ["9. Document the next test", "The result should be a cause group, a next measurement and an escalation threshold—not a remote diagnosis."]], example: "If far heads are weak, near heads are normal and a soggy patch is visible, an active lateral leak is a high-priority cause group. Stop the zone if safe and repair the leak before pressure changes.", sources: [sources.okState, sources.epaWatersense, sources.nrcsIrrigation], related: [[irrigationToolLinks[6][0], irrigationToolLinks[6][1]], [irrigationToolLinks[0][0], irrigationToolLinks[0][1]], [irrigationToolLinks[5][0], irrigationToolLinks[5][1]], [toolLinks[1][0], toolLinks[1][1]], ["/systems/irrigation-sprinklers/", "Irrigation & Sprinkler Systems"]] }
);

function guideBody(guide) {
  const phase2 = phase2GuideLinks.some(([path]) => path === guide.path);
  const irrigation = irrigationGuideLinks.some(([path]) => path === guide.path);
  return `${hero("Field guide", guide.h1, guide.intro, "Use this guide to order measurements and calculations. Final equipment selection still requires current manufacturer data and project-specific review.")}<p class="meta-line">Last reviewed: ${reviewed} · Technical guide</p><div class="content-layout"><article class="article-body">${guide.sections.map(([title, text]) => `<h2>${title}</h2><p>${text}</p>`).join("")}<div class="worked-example"><h2>Worked example</h2><p>${guide.example}</p></div><div class="notice"><strong>Safety boundary.</strong> Stop and obtain qualified help for electrical hazards, active flooding, unsafe pressure, sealed pressure vessels, contamination risks or regulated work.</div><h2>Sources</h2>${sourceList(guide.sources)}${related(guide.related)}</article><aside class="sidebar"><h2>Guide bench</h2><ul><li><a href="${irrigation ? "/systems/irrigation-sprinklers/" : phase2 ? "/systems/wells-storage-rainwater/" : "/systems/pumps-pressure-pipe/"}">System workflow</a></li><li><a href="/tools/">Working tools</a></li><li><a href="/reference/">Technical references</a></li></ul></aside></div>`;
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

function referenceBody(ref) {
  const phase2 = ref.path === phase2ReferenceLinks[0][0];
  return `${hero("Technical reference", ref.h1, ref.intro, "Values are provided for transparent preliminary work. Confirm source conditions, product data and project-specific requirements.")}<p class="meta-line">Last reviewed: ${reviewed} · Reference</p><div class="content-layout"><article class="article-body">${ref.body}<div class="notice"><strong>Reference boundary.</strong> Do not convert an indicative value into a universal design requirement. Check the cited source and the actual project context.</div><h2>Sources</h2>${sourceList(ref.sources)}${related(ref.related)}</article><aside class="sidebar"><h2>Reference bench</h2><ul><li><a href="${phase2 ? "/systems/wells-storage-rainwater/" : "/systems/pumps-pressure-pipe/"}">System workflow</a></li><li><a href="/tools/">Working tools</a></li><li><a href="/guides/">Field guides</a></li></ul></aside></div>`;
}

const aboutBody = `${hero("Project information", "About Water Systems Bench", "An independent, English-language workflow hub for sizing, checking, troubleshooting and planning real-world water systems.", "The project publishes transparent methods, assumptions and sources. It does not claim project-specific design approval.")}<section class="section content-layout"><article class="article-body"><h2>Why a bench?</h2><p>Water decisions rarely fit one calculator. A field bench keeps measurements, assumptions, formulas and next steps together. The implemented clusters cover Pumps, Pressure & Pipe Flow and Wells, Storage & Rainwater; additional clusters publish only when their connected resources are complete.</p><h2>Editorial approach</h2><ul><li>Static, readable content alongside interactive tools.</li><li>SI-first calculations with common US customary units.</li><li>Methods and limitations visible near every result.</li><li>Primary technical and public-agency sources where available.</li><li>No invented ratings, reviews, certifications or professional credentials.</li></ul><h2>Technology</h2><p>The site uses static HTML, CSS and vanilla JavaScript and is deployed with GitHub Pages and Cloudflare.</p></article><aside class="sidebar"><h2>Project links</h2><ul><li><a href="/contact/">Contact</a></li><li><a href="/privacy/">Privacy</a></li><li><a href="https://github.com/canghun13/watersystemsbench">GitHub repository</a></li></ul></aside></section>`;

const contactBody = `${hero("Project contact", "Contact", "Report a calculation issue, unclear assumption, broken source or accessibility problem by email.", "Messages are reviewed when possible, but a response or project-specific technical advice is not guaranteed.")}<section class="section content-layout"><article class="article-body"><h2>Email the project</h2><p><a class="button" href="mailto:canghun13@naver.com">Email canghun13@naver.com</a></p><p>Helpful reports include the page URL, entered units and values, expected result, observed result, browser, and a public technical source when relevant. Do not send passwords, payment details, private infrastructure information or sensitive personal data.</p><h2>What this contact is for</h2><ul><li>Corrections to formulas, units, copy or citations</li><li>Accessibility and browser issues</li><li>Broken links or asset failures</li><li>General project feedback</li></ul><h2>What it cannot provide</h2><p>This email is not an emergency service, utility support line, formal engineering review, equipment approval or guaranteed design consultancy.</p></article><aside class="sidebar"><h2>Before writing</h2><ul><li><a href="/about/">About the project</a></li><li><a href="/privacy/">Privacy information</a></li><li><a href="/systems/pumps-pressure-pipe/">Current system scope</a></li></ul></aside></section>`;

const privacyBody = `${hero("Site information", "Privacy", "A plain-language summary of the data practices supported by the current static site.", "This summary describes the present implementation and may change as the site changes. It is general information, not legal advice.")}<p class="meta-line">Last updated: ${reviewed}</p><section class="section content-layout"><article class="article-body"><h2>Current site operation</h2><p>Water Systems Bench has no account system, no contact form and no project-operated user database. Calculator entries are processed in the browser and are not intentionally submitted to Water Systems Bench.</p><h2>Email</h2><p>The contact link opens the user’s email application. Messages are handled by the user’s and recipient’s email providers under their own terms and practices.</p><h2>Google Analytics</h2><p>The site uses Google Analytics 4. It may process general usage and device information such as visited pages, approximate location derived from network information, referrer, browser and interaction data. Google’s services and applicable browser settings govern associated identifiers and controls.</p><h2>External links</h2><p>Links to public agencies, technical bodies, manufacturers and GitHub lead to external services with their own privacy practices.</p><h2>Changes and questions</h2><p>This page may be updated when site functionality or measurement practices change. Questions can be sent to <a href="mailto:canghun13@naver.com">canghun13@naver.com</a>.</p></article><aside class="sidebar"><h2>Site links</h2><ul><li><a href="/about/">About</a></li><li><a href="/contact/">Contact</a></li><li><a href="/">Home</a></li></ul></aside></section>`;

const pages = [
  { path: "/", title: "Water Systems Bench | Pumps, Wells, Storage & Rainwater", h1: "Plan the water path. Check the duty point.", description: "Practical pump, well, pressure, storage and rainwater calculators, guides and references for connected water-system planning.", schemaType: "WebPage", crumbs: [["Home", "/"]], body: homeBody },
  { path: "/tools/", title: "Water System Tools | Water Systems Bench", h1: "Tools", description: "Use 17 working tools for pump hydraulics, well yield, pressure tanks, storage and rainwater planning.", schemaType: "CollectionPage", crumbs: [["Home", "/"], ["Tools", "/tools/"]], body: hubBody("Tools") },
  { path: "/guides/", title: "Water System Guides | Water Systems Bench", h1: "Guides", description: "Read eight practical guides for pump, pressure, well, storage and rainwater-system planning.", schemaType: "CollectionPage", crumbs: [["Home", "/"], ["Guides", "/guides/"]], body: hubBody("Guides") },
  { path: "/reference/", title: "Water System Reference | Water Systems Bench", h1: "Reference", description: "Check water conversions, demand factors, pressure, head, pipe values and hydraulic formulas.", schemaType: "CollectionPage", crumbs: [["Home", "/"], ["Reference", "/reference/"]], body: hubBody("Reference") },
  { path: "/about/", title: "About | Water Systems Bench", h1: "About Water Systems Bench", description: "Learn the purpose, editorial approach and technical structure of Water Systems Bench.", schemaType: "AboutPage", crumbs: [["Home", "/"], ["About", "/about/"]], body: aboutBody },
  { path: "/contact/", title: "Contact | Water Systems Bench", h1: "Contact", description: "Contact Water Systems Bench about calculation, source, accessibility or site issues.", schemaType: "ContactPage", crumbs: [["Home", "/"], ["Contact", "/contact/"]], body: contactBody },
  { path: "/privacy/", title: "Privacy | Water Systems Bench", h1: "Privacy", description: "Read how the current static Water Systems Bench site handles calculator inputs, email links, analytics and external links.", schemaType: "WebPage", crumbs: [["Home", "/"], ["Privacy", "/privacy/"]], body: privacyBody },
  { path: "/systems/pumps-pressure-pipe/", title: "Pumps, Pressure & Pipe Flow | Water Systems Bench", h1: "Pumps, Pressure & Pipe Flow", description: "Follow the complete workflow from required flow and TDH through pump curves, power, NPSH and operating cost.", schemaType: "CollectionPage", crumbs: [["Home", "/"], ["Systems", "/systems/pumps-pressure-pipe/"], ["Pumps, Pressure & Pipe Flow", "/systems/pumps-pressure-pipe/"]], body: systemBody },
  { path: "/systems/wells-storage-rainwater/", title: "Wells, Storage & Rainwater | Water Systems Bench", h1: "Wells, Storage & Rainwater", description: "Connect well yield, pump duty, pressure tanks, water storage and rainwater harvesting from source to demand.", schemaType: "CollectionPage", crumbs: [["Home", "/"], ["Systems", "/systems/wells-storage-rainwater/"], ["Wells, Storage & Rainwater", "/systems/wells-storage-rainwater/"]], body: wellsSystemBody },
  { path: "/systems/irrigation-sprinklers/", title: "Irrigation & Sprinkler Systems | Water Systems Bench", h1: "Irrigation & Sprinkler Systems", description: "Measure irrigation supply, plan sprinkler and drip zones, calculate precipitation and runtime, and troubleshoot weak coverage.", schemaType: "CollectionPage", crumbs: [["Home", "/"], ["Systems", "/systems/irrigation-sprinklers/"], ["Irrigation & Sprinkler Systems", "/systems/irrigation-sprinklers/"]], body: irrigationSystemBody },
  ...toolData.map((tool) => ({ path: tool.path, title: `${tool.h1} | Water Systems Bench`, h1: tool.h1, description: tool.description, schemaType: "WebApplication", crumbs: [["Home", "/"], ["Tools", "/tools/"], [tool.h1, tool.path]], body: toolBody(tool), toolScript: tool.script })),
  ...guideData.map((guide) => ({ path: guide.path, title: `${guide.h1} | Water Systems Bench`, h1: guide.h1, description: guide.description, schemaType: "TechArticle", crumbs: [["Home", "/"], ["Guides", "/guides/"], [guide.h1, guide.path]], body: guideBody(guide) })),
  ...referenceData.map((ref) => ({ path: ref.path, title: `${ref.h1} | Water Systems Bench`, h1: ref.h1, description: ref.description, schemaType: "TechArticle", crumbs: [["Home", "/"], ["Reference", "/reference/"], [ref.h1, ref.path]], body: referenceBody(ref) }))
];

if (pages.length !== 51) throw new Error(`Expected 51 pages, received ${pages.length}.`);

for (const page of pages) {
  const output = page.path === "/" ? join(root, "index.html") : join(root, page.path.slice(1), "index.html");
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, pageTemplate(page), "utf8");
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `  <url><loc>${domain}${page.path}</loc><lastmod>2026-07-28</lastmod></url>`).join("\n")}
</urlset>
`;
await writeFile(join(root, "sitemap.xml"), sitemap, "utf8");
await writeFile(join(root, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${domain}/sitemap.xml\n`, "utf8");
await writeFile(join(root, "llms.txt"), `# Water Systems Bench

> A practical workflow hub for sizing, checking, troubleshooting and planning real-world water systems from source to use.

## Current implemented clusters

- [Pumps, Pressure & Pipe Flow](${domain}/systems/pumps-pressure-pipe/)
- [Wells, Storage & Rainwater](${domain}/systems/wells-storage-rainwater/)

## Tools

${toolLinks.map(([href, title]) => `- [${title}](${domain}${href})`).join("\n")}

## Guides

${guideLinks.map(([href, title]) => `- [${title}](${domain}${href})`).join("\n")}

## Reference

${referenceLinks.map(([href, title]) => `- [${title}](${domain}${href})`).join("\n")}

## Safety and limitations

The site supports preliminary planning. Outputs are not formal engineering approval, legal advice, manufacturer selection, or a universal regulatory determination. Verify measurements, applicable requirements and current manufacturer data.

## Contact and source

- Contact: canghun13@naver.com
- Repository: https://github.com/canghun13/watersystemsbench
`, "utf8");

console.log(`Generated ${pages.length} public HTML pages.`);
