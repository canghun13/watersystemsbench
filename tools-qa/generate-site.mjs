import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const domain = "https://watersystemsbench.com";
const reviewed = "July 27, 2026";
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
  westlake: ["Westlake Pipe & Fittings — Schedule 40 and 80 PVC Pressure Pipe", "https://www.westlakepipe.com/sites/default/files/PL-PS-025-CA-EN-0522.1_Sch40-Sch80-Pressure-Pipe.pdf"]
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
    dateModified: "2026-07-27",
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
</body>
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

function toolBody(tool) {
  return `${hero(`Pump systems / ${tool.type}`, tool.h1, tool.description, "Preliminary planning output only. Use measured data where possible and verify manufacturer and jurisdiction-specific requirements.")}
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
  </article><aside class="sidebar"><h2>Bench sequence</h2><ul><li><a href="/systems/pumps-pressure-pipe/">Start with the system workflow</a></li><li><a href="/guides/how-to-size-a-water-pump/">Build flow and TDH</a></li><li><a href="/reference/pump-formulas-hydraulic-terms/">Check formulas and terms</a></li><li><a href="/contact/">Report a content issue</a></li></ul></aside></div>`;
}

const homeBody = `${hero("Hydraulic field bench", "Plan the water path. Check the duty point.", "Practical tools, field-oriented guides and technical references for pump, pressure and pipe-flow decisions—from required flow to operating cost.", "Built for global use with SI-first calculations and common US customary units. Results support preliminary planning; they are not formal design approval.", '<div class="hero-actions"><a class="button" href="/systems/pumps-pressure-pipe/">Start the pump workflow</a><a class="button secondary" href="/tools/">Open all tools</a></div>')}
<div class="status-strip"><span>Phase 1 live</span><span>9 working tools</span><span>3 field guides</span><span>5 references</span></div>
<section class="section"><div class="section-heading"><p class="eyebrow">System, not a card catalogue</p><h2>Follow water from source to use</h2><p class="lede">Water-system decisions depend on each other. Storage changes pump duty. Pipe size changes friction. Pressure requirements change power. Treatment and end use shape the whole path.</p></div><div class="flow-line"><span>Source</span><span>Storage</span><span>Pumping</span><span>Pipes</span><span>Treatment</span><span>Use</span></div></section>
<section class="section"><div class="section-heading"><p class="eyebrow">Pumps, Pressure & Pipe Flow</p><h2>One completed cluster, ordered around the work</h2></div>${cardGrid([toolLinks[0], toolLinks[1], toolLinks[2], toolLinks[7], toolLinks[8]], "Use tool")}</section>
<section class="section"><div class="section-heading"><p class="eyebrow">Three ways in</p><h2>Calculate, understand, verify</h2></div>${cardGrid([["/tools/", "Tools", "Use interactive forms with transparent methods and limitations."], ["/guides/", "Guides", "Work through pump sizing, curves and low-pressure diagnosis."], ["/reference/", "Reference", "Check conversions, pipe data, formulas and hydraulic terms."]])}</section>
<section class="section"><h2>What comes next</h2><p class="lede">Future work will connect wells and storage, rainwater, irrigation, treatment, drainage and wastewater. Those areas are not published as empty pages or inactive links.</p><div class="notice"><strong>Use the result as evidence, not approval.</strong> Verify measurements, manufacturer curves, fluid properties, local codes and qualified engineering requirements for the actual project.</div></section>`;

function hubBody(kind) {
  const isTools = kind === "Tools";
  const isGuides = kind === "Guides";
  const items = isTools ? toolLinks : isGuides ? guideLinks : referenceLinks;
  const description = isTools ? "Working calculators, comparators, checks and troubleshooting for the current pump-system cluster." : isGuides ? "Field-oriented explanations that connect measurements, formulas and the next useful tool." : "Conversion tables, formulas, material values and hydraulic terms used across the pump workflow.";
  return `${hero(`${kind} index`, kind, description, "Only completed Phase 1 resources are linked. Planned future clusters remain documented without empty public pages.")}<p class="meta-line">Updated: ${reviewed} · ${items.length} published ${kind.toLowerCase()}</p><section class="section">${cardGrid(items, isTools ? "Use tool" : "Read")}</section><section class="section"><div class="notice"><strong>Practical boundary.</strong> These resources support preliminary decisions and transparent checking. They do not replace manufacturer data, local requirements or project-specific professional review.</div></section>`;
}

const systemBody = `${hero("System hub / Phase 1", "Pumps, Pressure & Pipe Flow", "Build the duty point in the right order: required flow, static head, delivery pressure, pipe loss, pump curve, power, suction conditions and operating cost.", "Measured values describe the present system. Estimated values describe a planning assumption. Label both before comparing equipment.", '<div class="hero-actions"><a class="button" href="/tools/total-dynamic-head-calculator/">Start with total dynamic head</a><a class="button secondary" href="/guides/how-to-size-a-water-pump/">Read the sizing workflow</a></div>')}
<div class="status-strip"><span>9 tools</span><span>3 guides</span><span>5 references</span></div>
<section class="section"><h2>The recommended sequence</h2><div class="flow-line"><span>Required flow</span><span>Static head</span><span>Required pressure</span><span>Pipe loss</span><span>Duty point</span><span>Power & NPSH</span></div><div class="notice"><strong>Start with flow.</strong> A pump does not have one universal head or flow. It operates where its curve and the system curve meet.</div></section>
<section class="section"><h2>Inputs to collect</h2>${cardGrid([["/guides/how-to-size-a-water-pump/", "Demand and required flow", "Peak, simultaneous or process flow with a stated basis."], ["/tools/total-dynamic-head-calculator/", "Elevation and pressure", "Gauge locations, elevation datum and target pressure."], ["/tools/pipe-friction-loss-calculator/", "Pipe path and fittings", "Actual ID, length, material/roughness and duty flow."], ["/tools/pump-curve-duty-point-comparator/", "Manufacturer curve points", "Exact speed, impeller and fluid condition."], ["/tools/npsh-available-calculator/", "Suction conditions", "Absolute pressure, temperature, level and losses."], ["/tools/pump-operating-cost-comparator/", "Operating schedule", "Input power, hours, tariff and maintenance."]], "Open step")}</section>
<section class="section"><h2>Tools on the bench</h2>${cardGrid(toolLinks, "Use tool")}</section>
<section class="section"><h2>Understand the decisions</h2>${cardGrid(guideLinks, "Read guide")}</section>
<section class="section"><h2>Check the underlying data</h2>${cardGrid(referenceLinks, "Open reference")}</section>
<section class="section"><h2>Connections beyond this cluster</h2><p class="lede">Well yield and storage will define available source flow; irrigation will create zone demand; treatment equipment will add pressure loss. Those future clusters will connect here after they are implemented.</p></section>`;

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

function guideBody(guide) {
  return `${hero("Field guide", guide.h1, guide.intro, "Use this guide to order measurements and calculations. Final equipment selection still requires current manufacturer data and project-specific review.")}<p class="meta-line">Last reviewed: ${reviewed} · Technical guide</p><div class="content-layout"><article class="article-body">${guide.sections.map(([title, text]) => `<h2>${title}</h2><p>${text}</p>`).join("")}<div class="worked-example"><h2>Worked example</h2><p>${guide.example}</p></div><div class="notice"><strong>Safety boundary.</strong> Stop and obtain qualified help for electrical hazards, gas appliances, active flooding, unsafe pressure, sealed pressure vessels or regulated work.</div><h2>Sources</h2>${sourceList(guide.sources)}${related(guide.related)}</article><aside class="sidebar"><h2>Guide bench</h2><ul><li><a href="/systems/pumps-pressure-pipe/">System workflow</a></li><li><a href="/tools/">Working tools</a></li><li><a href="/reference/">Technical references</a></li></ul></aside></div>`;
}

const referenceData = [
  {
    path: referenceLinks[0][0], h1: "Water Flow, Pressure & Volume Conversion Tables",
    description: "Convert common water flow, pressure, head and volume units without splitting the reference into thin pages.",
    intro: "Use these factors for transparent preliminary conversions. Keep enough precision during calculation and round only the displayed result.",
    body: `<h2>Flow</h2><table><thead><tr><th>From</th><th>To</th><th>Multiply by</th></tr></thead><tbody><tr><td>1 L/min</td><td>L/s</td><td>0.0166667</td></tr><tr><td>1 L/min</td><td>m³/h</td><td>0.06</td></tr><tr><td>1 L/min</td><td>US GPM</td><td>0.264172</td></tr><tr><td>1 US GPM</td><td>L/min</td><td>3.785412</td></tr></tbody></table><h2>Pressure and water head near 20 °C</h2><table><thead><tr><th>From</th><th>kPa</th><th>bar</th><th>psi</th><th>m water</th><th>ft water</th></tr></thead><tbody><tr><td>1 kPa</td><td>1</td><td>0.01</td><td>0.145038</td><td>0.1022</td><td>0.3353</td></tr><tr><td>1 bar</td><td>100</td><td>1</td><td>14.5038</td><td>10.22</td><td>33.53</td></tr><tr><td>1 psi</td><td>6.89476</td><td>0.0689476</td><td>1</td><td>0.7032</td><td>2.307</td></tr></tbody></table><h2>Volume</h2><table><thead><tr><th>From</th><th>To</th><th>Multiply by</th></tr></thead><tbody><tr><td>1 L</td><td>m³</td><td>0.001</td></tr><tr><td>1 L</td><td>US gallon</td><td>0.264172</td></tr><tr><td>1 m³</td><td>L</td><td>1,000</td></tr><tr><td>1 US gallon</td><td>L</td><td>3.785412</td></tr></tbody></table>`,
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

function referenceBody(ref) {
  return `${hero("Technical reference", ref.h1, ref.intro, "Values are provided for transparent preliminary work. Confirm source conditions, product data and project-specific requirements.")}<p class="meta-line">Last reviewed: ${reviewed} · Reference</p><div class="content-layout"><article class="article-body">${ref.body}<div class="notice"><strong>Reference boundary.</strong> Do not convert an indicative value into a universal design requirement. Check the cited source and the actual project context.</div><h2>Sources</h2>${sourceList(ref.sources)}${related(ref.related)}</article><aside class="sidebar"><h2>Reference bench</h2><ul><li><a href="/systems/pumps-pressure-pipe/">System workflow</a></li><li><a href="/tools/">Working tools</a></li><li><a href="/guides/">Field guides</a></li></ul></aside></div>`;
}

const aboutBody = `${hero("Project information", "About Water Systems Bench", "An independent, English-language workflow hub for sizing, checking, troubleshooting and planning real-world water systems.", "The project publishes transparent methods, assumptions and sources. It does not claim project-specific design approval.")}<section class="section content-layout"><article class="article-body"><h2>Why a bench?</h2><p>Water decisions rarely fit one calculator. A field bench keeps measurements, assumptions, formulas and next steps together. The site begins with Pumps, Pressure & Pipe Flow and will expand only when each connected cluster is implemented.</p><h2>Editorial approach</h2><ul><li>Static, readable content alongside interactive tools.</li><li>SI-first calculations with common US customary units.</li><li>Methods and limitations visible near every result.</li><li>Primary technical and public-agency sources where available.</li><li>No invented ratings, reviews, certifications or professional credentials.</li></ul><h2>Technology</h2><p>The site uses static HTML, CSS and vanilla JavaScript and is deployed with GitHub Pages and Cloudflare.</p></article><aside class="sidebar"><h2>Project links</h2><ul><li><a href="/contact/">Contact</a></li><li><a href="/privacy/">Privacy</a></li><li><a href="https://github.com/canghun13/watersystemsbench">GitHub repository</a></li></ul></aside></section>`;

const contactBody = `${hero("Project contact", "Contact", "Report a calculation issue, unclear assumption, broken source or accessibility problem by email.", "Messages are reviewed when possible, but a response or project-specific technical advice is not guaranteed.")}<section class="section content-layout"><article class="article-body"><h2>Email the project</h2><p><a class="button" href="mailto:canghun13@naver.com">Email canghun13@naver.com</a></p><p>Helpful reports include the page URL, entered units and values, expected result, observed result, browser, and a public technical source when relevant. Do not send passwords, payment details, private infrastructure information or sensitive personal data.</p><h2>What this contact is for</h2><ul><li>Corrections to formulas, units, copy or citations</li><li>Accessibility and browser issues</li><li>Broken links or asset failures</li><li>General project feedback</li></ul><h2>What it cannot provide</h2><p>This email is not an emergency service, utility support line, formal engineering review, equipment approval or guaranteed design consultancy.</p></article><aside class="sidebar"><h2>Before writing</h2><ul><li><a href="/about/">About the project</a></li><li><a href="/privacy/">Privacy information</a></li><li><a href="/systems/pumps-pressure-pipe/">Current system scope</a></li></ul></aside></section>`;

const privacyBody = `${hero("Site information", "Privacy", "A plain-language summary of the data practices supported by the current static site.", "This summary describes the present implementation and may change as the site changes. It is general information, not legal advice.")}<p class="meta-line">Last updated: ${reviewed}</p><section class="section content-layout"><article class="article-body"><h2>Current site operation</h2><p>Water Systems Bench has no account system, no contact form and no project-operated user database. Calculator entries are processed in the browser and are not intentionally submitted to Water Systems Bench.</p><h2>Email</h2><p>The contact link opens the user’s email application. Messages are handled by the user’s and recipient’s email providers under their own terms and practices.</p><h2>Google Analytics</h2><p>The site uses Google Analytics 4. It may process general usage and device information such as visited pages, approximate location derived from network information, referrer, browser and interaction data. Google’s services and applicable browser settings govern associated identifiers and controls.</p><h2>External links</h2><p>Links to public agencies, technical bodies, manufacturers and GitHub lead to external services with their own privacy practices.</p><h2>Changes and questions</h2><p>This page may be updated when site functionality or measurement practices change. Questions can be sent to <a href="mailto:canghun13@naver.com">canghun13@naver.com</a>.</p></article><aside class="sidebar"><h2>Site links</h2><ul><li><a href="/about/">About</a></li><li><a href="/contact/">Contact</a></li><li><a href="/">Home</a></li></ul></aside></section>`;

const pages = [
  { path: "/", title: "Water Systems Bench | Pump, Pressure & Pipe Tools", h1: "Plan the water path. Check the duty point.", description: "Practical pump, pressure and pipe-flow calculators, guides and references for real-world water-system planning.", schemaType: "WebPage", crumbs: [["Home", "/"]], body: homeBody },
  { path: "/tools/", title: "Water System Tools | Water Systems Bench", h1: "Tools", description: "Use nine working pump, pressure and pipe-flow calculators, comparators, checks and troubleshooting tools.", schemaType: "CollectionPage", crumbs: [["Home", "/"], ["Tools", "/tools/"]], body: hubBody("Tools") },
  { path: "/guides/", title: "Pump & Pipe Guides | Water Systems Bench", h1: "Guides", description: "Read practical guides to pump sizing, pump curves and low-water-pressure diagnosis.", schemaType: "CollectionPage", crumbs: [["Home", "/"], ["Guides", "/guides/"]], body: hubBody("Guides") },
  { path: "/reference/", title: "Water System Reference | Water Systems Bench", h1: "Reference", description: "Check water unit conversions, pressure and head, pipe values, dimensions and pump formulas.", schemaType: "CollectionPage", crumbs: [["Home", "/"], ["Reference", "/reference/"]], body: hubBody("Reference") },
  { path: "/about/", title: "About | Water Systems Bench", h1: "About Water Systems Bench", description: "Learn the purpose, editorial approach and technical structure of Water Systems Bench.", schemaType: "AboutPage", crumbs: [["Home", "/"], ["About", "/about/"]], body: aboutBody },
  { path: "/contact/", title: "Contact | Water Systems Bench", h1: "Contact", description: "Contact Water Systems Bench about calculation, source, accessibility or site issues.", schemaType: "ContactPage", crumbs: [["Home", "/"], ["Contact", "/contact/"]], body: contactBody },
  { path: "/privacy/", title: "Privacy | Water Systems Bench", h1: "Privacy", description: "Read how the current static Water Systems Bench site handles calculator inputs, email links, analytics and external links.", schemaType: "WebPage", crumbs: [["Home", "/"], ["Privacy", "/privacy/"]], body: privacyBody },
  { path: "/systems/pumps-pressure-pipe/", title: "Pumps, Pressure & Pipe Flow | Water Systems Bench", h1: "Pumps, Pressure & Pipe Flow", description: "Follow the complete workflow from required flow and TDH through pump curves, power, NPSH and operating cost.", schemaType: "CollectionPage", crumbs: [["Home", "/"], ["Systems", "/systems/pumps-pressure-pipe/"], ["Pumps, Pressure & Pipe Flow", "/systems/pumps-pressure-pipe/"]], body: systemBody },
  ...toolData.map((tool) => ({ path: tool.path, title: `${tool.h1} | Water Systems Bench`, h1: tool.h1, description: tool.description, schemaType: "WebApplication", crumbs: [["Home", "/"], ["Tools", "/tools/"], [tool.h1, tool.path]], body: toolBody(tool), toolScript: tool.script })),
  ...guideData.map((guide) => ({ path: guide.path, title: `${guide.h1} | Water Systems Bench`, h1: guide.h1, description: guide.description, schemaType: "TechArticle", crumbs: [["Home", "/"], ["Guides", "/guides/"], [guide.h1, guide.path]], body: guideBody(guide) })),
  ...referenceData.map((ref) => ({ path: ref.path, title: `${ref.h1} | Water Systems Bench`, h1: ref.h1, description: ref.description, schemaType: "TechArticle", crumbs: [["Home", "/"], ["Reference", "/reference/"], [ref.h1, ref.path]], body: referenceBody(ref) }))
];

if (pages.length !== 25) throw new Error(`Expected 25 pages, received ${pages.length}.`);

for (const page of pages) {
  const output = page.path === "/" ? join(root, "index.html") : join(root, page.path.slice(1), "index.html");
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, pageTemplate(page), "utf8");
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `  <url><loc>${domain}${page.path}</loc><lastmod>2026-07-27</lastmod></url>`).join("\n")}
</urlset>
`;
await writeFile(join(root, "sitemap.xml"), sitemap, "utf8");
await writeFile(join(root, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${domain}/sitemap.xml\n`, "utf8");
await writeFile(join(root, "llms.txt"), `# Water Systems Bench

> A practical workflow hub for sizing, checking, troubleshooting and planning real-world water systems from source to use.

## Current implemented cluster

- [Pumps, Pressure & Pipe Flow](${domain}/systems/pumps-pressure-pipe/)

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
