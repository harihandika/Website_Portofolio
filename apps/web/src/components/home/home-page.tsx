"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CircuitBoard,
  Code2,
  Download,
  Factory,
  GitFork,
  GraduationCap,
  MapPin,
  Workflow,
} from "lucide-react";
import { RobotStage } from "./robot-stage";
import { cvFile, cvProjects } from "@/lib/data/cv";
import { fetchProjects } from "@/lib/data/projects";
import {
  formatExperiencePeriod,
  type PortfolioData,
} from "@/lib/data/portfolio";

const domains = [
  {
    icon: Workflow,
    name: "ERP Integration",
    detail:
      "MCFrame synchronization, transaction mapping and role-based approvals.",
    tag: "MCFRAME / REST API",
  },
  {
    icon: Factory,
    name: "Manufacturing Systems",
    detail:
      "Production planning, quality inspection and shop-floor device integration.",
    tag: "PLC / MODBUS RTU",
  },
  {
    icon: Boxes,
    name: "Procurement & Inventory",
    detail:
      "Purchase workflows, budget controls, stock movements and warehouse mapping.",
    tag: "PURCHASING / WAREHOUSE",
  },
];
function Label({ children }: { children: ReactNode }) {
  return (
    <p className="kicker">
      <span aria-hidden="true">//</span> {children}
    </p>
  );
}
function SectionHead({
  no,
  title,
  accent,
  href,
  link,
}: {
  no: string;
  title: string;
  accent: string;
  href?: string;
  link?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <Label>SECTION {no}</Label>
        <h2>
          {title} <em>{accent}</em>
        </h2>
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {link} <ArrowUpRight size={15} />
        </Link>
      )}
    </div>
  );
}
export function HomePage({ profile, skills, experiences }: PortfolioData) {
  const [projects, setProjects] = useState(cvProjects),
    [filter, setFilter] = useState("All work"),
    [skill, setSkill] = useState(0);
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_PORTFOLIO_SOURCE !== "api") return;
    const c = new AbortController();
    fetchProjects(c.signal)
      .then(setProjects)
      .catch(() => {});
    return () => c.abort();
  }, []);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("entered");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.06 },
    );
    document
      .querySelectorAll(".cv-site .entry")
      .forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const names = profile.fullName.trim().split(/\s+/),
    surname = names.pop();
  const categories = [
    "All work",
    ...new Set(projects.map((p) => p.techStacks[0]?.category).filter(Boolean)),
  ];
  const selected = skills[skill];
  return (
    <div className="cv-site">
      <section className="hero-field" id="overview">
        <div className="cv-wrap hero-wrap">
          <RobotStage />
          <div className="hero-copy">
            <div className="hero-overline">
              <i /> ENGINEERING PORTFOLIO <b>/</b> VOL. 01
            </div>
            <h1>
              {names.length > 0 && (
                <>
                  {names.join(" ")}
                  <br />
                </>
              )}
              {surname}
              <span>.</span>
            </h1>
            <p className="hero-role">
              <Code2 size={19} /> Software Engineer
            </p>
            <p className="hero-summary">
              I connect MCFrame ERP with production and warehouse workflows,
              including scanner and PLC data from the factory floor.
            </p>
            <div className="hero-actions">
              <Link href="#work" className="solid-action">
                Explore my work <ArrowDown size={16} />
              </Link>
              <a className="line-action" href={cvFile} download>
                <Download size={15} /> Download CV
              </a>
            </div>
            <div className="hero-meta">
              <MapPin size={13} /> {profile.location || "North Jakarta"},
              Indonesia
            </div>
          </div>
        </div>
      </section>
      <div className="fact-band">
        <div className="cv-wrap fact-grid">
          {[
            ["04", "Years of experience"],
            [
              String(projects.length).padStart(2, "0"),
              "Selected implementations",
            ],
            [String(experiences.length).padStart(2, "0"), "Companies"],
            ["3.91", "University GPA / 4.00"],
          ].map(([n, label]) => (
            <div className="fact" key={label}>
              <strong>{n}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <section id="expertise" className="cv-wrap cv-section entry">
        <SectionHead
          no="01 / SPECIALIZATION"
          title="Core"
          accent="expertise."
          href="/about"
          link="About me"
        />
        <div className="domain-grid">
          {domains.map(({ icon: Icon, name, detail, tag }, i) => (
            <article className="domain-item" key={name}>
              <div className="domain-top">
                <Icon size={26} strokeWidth={1.5} />
                <span>SYS / 0{i + 1}</span>
              </div>
              <h3>{name}</h3>
              <p>{detail}</p>
              <small>{tag}</small>
            </article>
          ))}
        </div>
      </section>
      <section id="work" className="cv-wrap cv-section entry">
        <SectionHead
          no="02 / PROJECT INDEX"
          title="Selected"
          accent="work."
          href="/system-map"
          link="System map"
        />
        <div className="work-filters" aria-label="Filter projects">
          {categories.map((c) => (
            <button
              key={c}
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div>
          {projects.map(
            (p, i) =>
              (filter === "All work" ||
                p.techStacks[0]?.category === filter) && (
                <Link
                  className="work-row"
                  key={p.slug}
                  href={"/projects/" + p.slug}
                >
                  <span className="row-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="row-title">
                    <small>{p.techStacks[0]?.category}</small>
                    <h3>{p.title}</h3>
                  </div>
                  <p>{p.summary}</p>
                  <ArrowUpRight size={19} />
                </Link>
              ),
          )}
        </div>
      </section>
      <section id="experience" className="contrast-band">
        <div className="cv-wrap cv-section entry">
          <SectionHead
            no="03 / CAREER LOG"
            title="Professional"
            accent="experience."
            href="/experience"
            link="Full experience"
          />
          {experiences.map((e) => (
            <article className="career-row" key={e.id}>
              <div className="row-date">
                {formatExperiencePeriod(e)}
                {e.isCurrent && (
                  <small>
                    <i /> Current role
                  </small>
                )}
              </div>
              <div>
                <h3>{e.company}</h3>
                <strong>{e.role}</strong>
                <p>{e.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section id="skills" className="cv-wrap cv-section entry">
        <SectionHead
          no="04 / TECHNICAL INDEX"
          title="Engineering"
          accent="toolkit."
          href="/skills"
          link="All skills"
        />
        <div className="toolkit">
          <div className="tool-menu">
            {skills.map((s, i) => (
              <button
                key={s.category}
                aria-pressed={skill === i}
                onClick={() => setSkill(i)}
              >
                {s.category}
                <ArrowRight size={14} />
              </button>
            ))}
          </div>
          {selected && (
            <div className="tool-detail" key={selected.category}>
              <CircuitBoard size={36} strokeWidth={1.2} />
              <h3>{selected.category}</h3>
              <div className="tech-tags">
                {selected.skills.map((s) => (
                  <span key={s.id}>{s.name}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="cv-wrap cv-section entry" id="background">
        <SectionHead no="05 / BACKGROUND" title="Beyond" accent="the code." />
        <div className="background-grid">
          <article>
            <GraduationCap />
            <h3>Electrical Engineering</h3>
            <strong>Sriwijaya University</strong>
            <small>AUG 2016 - AUG 2021 / GPA 3.91 OF 4.00</small>
            <p>
              Thesis: Steering Control Optimization Using PID and Particle Swarm
              Optimization.
            </p>
          </article>
          <article>
            <GitFork />
            <h3>Business &amp; IT liaison</h3>
            <strong>Stakeholder collaboration</strong>
            <p>
              I run requirements workshops, discuss priorities and trade-offs,
              and translate operational needs into clear technical decisions.
              User reviews and follow-ups keep changes grounded in daily work.
            </p>
          </article>
        </div>
      </section>
      <section id="connect" className="contact-band">
        <div className="cv-wrap">
          <Label>06 / CONTACT</Label>
          <h2>
            Get in touch<span>.</span>
          </h2>
          <div className="connect-links">
            <a href={"mailto:" + profile.email}>
              {profile.email}
              <ArrowUpRight size={17} />
            </a>
            <Link href="/contact">
              Contact details <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
