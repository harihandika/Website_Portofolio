// Run with a local Playwright installation: NODE_PATH=<playwright parent> node scripts/print-cv.cjs
const { chromium } = require("playwright-core");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
require.extensions[".ts"] = (module, file) =>
  module._compile(
    ts.transpile(fs.readFileSync(file, "utf8"), {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    }),
    file,
  );
const {
  cvProfile: p,
  cvExperiences,
  cvProjects,
  cvSkills,
} = require("../src/lib/data/cv.ts");
const esc = (text) =>
  String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const fmt = (value) =>
  new Date(value).toLocaleString("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
function role(e) {
  return `<section><h3>${esc(e.company)} <small>${fmt(e.startDate)} - ${e.isCurrent ? "Present" : fmt(e.endDate)}</small></h3><strong>${esc(e.role)}</strong><p>${esc(e.description)}</p><ul>${e.achievements.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></section>`;
}
const footer = (n) =>
  `<footer>HARI HANDIKA SETIAWAN / CURRICULUM VITAE <span>${n} / 02</span></footer>`;
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Hari Handika Setiawan | Curriculum Vitae</title><style>
@page{size:A4;margin:0}*{box-sizing:border-box}body{margin:0;font:9.8pt/1.32 Arial,sans-serif;color:#242924}article{position:relative;width:210mm;height:297mm;padding:12mm 16mm;break-after:page}article:last-child{break-after:auto}header{border-top:4px solid #b75020;padding-top:7mm}h1{font-size:31pt;line-height:1.05;margin:0 0 2mm}h2{font:700 9pt Consolas,monospace;text-transform:uppercase;letter-spacing:.09em;margin:4mm 0 1.4mm;color:#914017;border-bottom:1px solid #bdc2bb;padding-bottom:1.2mm}h3{font-size:11pt;margin:2mm 0 .6mm}header strong{color:#8d411f}address{font-style:normal;font-size:9pt;margin-top:2mm}small,footer{font:8pt Consolas,monospace;color:#495449}small,footer span{float:right}p{margin:1mm 0}ul{margin:1mm 0;padding-left:5mm}li{margin:.4mm 0}a{color:inherit;text-decoration:none}footer{position:absolute;bottom:10mm;left:17mm;right:17mm;border-top:1px solid #bcc2bb;padding-top:2mm}.field{margin:1.15mm 0}.running{font:9pt Consolas,monospace;letter-spacing:.08em;color:#87411f}</style>
<article><header><h1>${esc(p.fullName)}</h1><strong>${esc(p.headline)}</strong><address>${p.location} | ${p.phone} | <a href="mailto:${p.email}">${p.email}</a><br><a href="${p.linkedinUrl}">linkedin.com/in/hari-handika-setiawan</a> | <a href="${p.githubUrl}">github.com/harihandika</a></address></header>
<h2>Professional summary</h2><p>${esc(p.bio)} I build maintainable applications using Java/Spring Boot, React/TypeScript, REST APIs, databases and GitLab CI/CD.</p>
<h2>Business process &amp; ERP expertise</h2><p><b>Procurement &amp; budget.</b> Material and non-material requisitions, supplier and PO workflows, approval routing, cost centers, spending controls and master data.</p><p><b>Manufacturing &amp; warehouse.</b> Production plans, shifts, quality inspections, material transfers, safety stock, warehouse mapping and quantity conversions.</p><p><b>Integration &amp; governance.</b> API transaction mapping, status reconciliation, validation, role-based approvals, audit trails and operational reporting.</p>
<h2>Professional experience</h2>${role(cvExperiences[0])}<p>Facilitate user reviews, track feedback and explain technical findings in plain language. Support office and cloud deployments with GitLab Runner, Linux/Windows, NGINX, migrations and release documentation.</p>
<h2>Selected ERP implementation work</h2>${cvProjects.map((r, i) => `<p class="field"><b>${esc(r.title)}.</b> ${esc(r.summary)} ${i < 2 ? esc(r.solution) + " " + esc(r.impact) : ""}</p>`).join("")}${footer("01")}</article>
<article><header class="running">HARI HANDIKA SETIAWAN / SOFTWARE ENGINEER</header><h2>Earlier experience</h2>${cvExperiences.slice(1).map(role).join("")}
<h2>Communication &amp; professional strengths</h2><p><b>Business and IT liaison.</b> Active listening, requirements workshops, cross-functional coordination and progress updates.</p><p><b>Negotiation and solution advocacy.</b> Discuss trade-offs, explain constraints, compare feasible options and align teams on process changes.</p><p><b>Issue resolution.</b> Investigate concerns, communicate blockers and coordinate follow-ups. Respect differing priorities and clarify misunderstandings.</p><p><b>Professional strengths.</b> Analytical thinking, adaptability, ownership, attention to detail, collaboration, time management and continuous learning.</p>
<h2>Technical skills</h2>${cvSkills.map((g) => `<p class="field"><b>${esc(g.category)}.</b> ${g.skills.map((s) => esc(s.name)).join(", ")}.</p>`).join("")}
<h2>Education</h2><h3>Sriwijaya University <small>Aug 2016 - Aug 2021</small></h3><strong>Bachelor of Electrical Engineering | GPA 3.91 / 4.00</strong><p>Thesis: Steering Control Optimization Using PID and Particle Swarm Optimization.</p>${footer("02")}</article></html>`;
(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  try {
    const page = await browser.newPage();
    await page.setContent(html);
    await page.emulateMedia({ media: "print" });
    const overlaps = await page
      .locator("footer")
      .evaluateAll((fs) =>
        fs.map(
          (f) =>
            f.previousElementSibling.getBoundingClientRect().bottom >
            f.getBoundingClientRect().top,
        ),
      );
    if (overlaps.some(Boolean))
      throw new Error("CV content exceeds page height");
    await page.pdf({
      path: path.join(__dirname, "../public", p.cvUrl),
      preferCSSPageSize: true,
      printBackground: true,
      tagged: true,
    });
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
