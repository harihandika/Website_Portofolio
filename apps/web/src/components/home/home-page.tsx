"use client";

import { useReducedMotion } from "@/lib/use-reduced-motion";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Database,
  Download,
  GitBranch,
  Globe2,
  Layers3,
  MapPin,
  Terminal,
  Workflow,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import {
  formatExperiencePeriod,
  type ExperienceData,
  type ProfileData,
  type SkillCategoryData,
} from "@/lib/data/portfolio";
import { fetchProjects } from "@/lib/data/projects";

type HomePageProps = {
  profile: ProfileData;
  skills: SkillCategoryData[];
  experiences: ExperienceData[];
};
type FeaturedProject = {
  slug: string;
  title: string;
  summary: string;
  techStacks: { name: string }[];
};
const initialProjects: FeaturedProject[] = [
  {
    slug: "procureflow-erp",
    title: "ProcureFlow ERP",
    summary:
      "Bringing clarity to complex procurement. One connected flow from requisition to warehouse.",
    techStacks: [
      { name: "Next.js" },
      { name: "NestJS" },
      { name: "PostgreSQL" },
    ],
  },
  {
    slug: "individual-performance",
    title: "Individual Performance",
    summary:
      "Turning performance data into clear insights, meaningful evaluations, and better decisions.",
    techStacks: [{ name: ".NET Core" }, { name: "Microsoft SQL Server" }],
  },
  {
    slug: "electronic-documentation",
    title: "Electronic Documentation",
    summary:
      "A central place for documents, with access built around the way teams work.",
    techStacks: [{ name: "Document Management" }, { name: "Access Control" }],
  },
];
const stack = [
  "TypeScript",
  "Next.js",
  "React",
  "NestJS",
  "PostgreSQL",
  "Prisma",
  "Docker",
];
const skillIcons = [Terminal, Code2, Database, Layers3, Workflow, Globe2];

export function HomePage({ profile, skills, experiences }: HomePageProps) {
  const reducedMotion = useReducedMotion();
  const [projects, setProjects] = useState(initialProjects);
  useEffect(() => {
    const controller = new AbortController();
    fetchProjects(controller.signal)
      .then((data) => {
        if (data.length) {
          const featured = data.filter((project) => project.isFeatured);
          setProjects((featured.length >= 2 ? featured : data).slice(0, 3));
        }
      })
      .catch(() => {
        /* Seeded case studies remain available when the API is offline. */
      });
    return () => controller.abort();
  }, []);

  return (
    <div className="overflow-hidden">
      <section id="home" className="relative isolate border-b border-border/60">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-64 top-0 -z-10 h-[650px] w-[900px] rounded-full bg-primary/[0.045] blur-[100px]"
        />
        <Container
          size="xl"
          className="relative pb-10 pt-16 sm:pt-24 lg:pb-12 lg:pt-28"
        >
          <div className="grid items-center gap-10 lg:grid-cols-[1.12fr_1fr] lg:gap-4">
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="relative z-10"
            >
              <div className="mb-7 flex items-center gap-3 font-mono text-[10px] tracking-[0.16em] text-muted-foreground sm:text-xs">
                <span className="h-px w-8 bg-primary" />
                HELLO, I’M{" "}
                {profile.fullName
                  .split(" ")
                  .slice(0, 2)
                  .join(" ")
                  .toUpperCase()}
              </div>
              <h1 className="max-w-[780px] text-[clamp(3.6rem,7.7vw,6.8rem)] font-medium leading-[0.99] tracking-[-0.065em]">
                Complex ideas.
                <br />
                <span className="text-primary">Elegant</span>
                <br />
                systems<span className="text-primary">.</span>
              </h1>
              <p className="mt-7 max-w-md text-base leading-[1.8] text-muted-foreground sm:text-lg">
                {profile.headline}. Thoughtful interfaces. Robust backends.
                Everything connected.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-5 sm:gap-7">
                <Link
                  href="#projects"
                  className="group inline-flex items-center gap-5 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  Explore my work{" "}
                  <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                </Link>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 py-3 text-sm font-medium text-foreground transition hover:text-primary"
                >
                  Let’s talk{" "}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
              <div className="mt-9 flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-wide text-muted-foreground sm:text-xs">
                <MapPin className="h-3.5 w-3.5" />
                {profile.location ?? "Indonesia / Remote"}
                <span className="mx-2 text-border">/</span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Open to opportunities
                </span>
              </div>
            </motion.div>
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15 }}
              className="relative -mx-3 sm:mx-0 lg:-ml-8"
            >
              <SystemIllustration reducedMotion={Boolean(reducedMotion)} />
            </motion.div>
          </div>
          <div className="mt-10 flex items-end justify-between border-t border-border/50 pt-7 lg:mt-16">
            <p className="max-w-[220px] font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-muted-foreground">
              From the first line of code
              <br />
              <span className="text-foreground/80">to the bigger picture.</span>
            </p>
            <Link
              href="#projects"
              aria-label="Scroll to selected projects"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary/50 hover:text-primary"
            >
              <ArrowDown className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </section>

      <div className="border-b border-border/60 py-7">
        <Container
          size="xl"
          className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between"
        >
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            The tools behind the work
          </span>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3 sm:gap-x-9">
            {stack.map((name) => (
              <span
                key={name}
                className="text-sm font-medium tracking-tight text-foreground/60 transition hover:text-primary sm:text-base"
              >
                {name}
              </span>
            ))}
          </div>
        </Container>
      </div>

      <Reveal id="projects" className="py-20 sm:py-28">
        <Container size="xl">
          <SectionHeader
            number="01"
            label="Selected work"
            title={
              <>
                Built to solve.
                <br />
                <span className="text-muted-foreground">
                  Designed to matter.
                </span>
              </>
            }
            link="/projects"
            linkLabel="All projects"
          />
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:mt-14 lg:gap-10">
            {projects.slice(0, 2).map((project, index) => (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="group block min-w-0 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-primary"
              >
                <div
                  className={`relative flex aspect-[1.2] items-center justify-center overflow-hidden rounded-2xl border border-border/70 p-6 transition duration-500 group-hover:border-primary/35 sm:aspect-[1.35] sm:p-10 ${index === 0 ? "bg-[#111b1d]" : "bg-[#171820]"}`}
                >
                  <div
                    aria-hidden="true"
                    className={`absolute h-[70%] w-[70%] rounded-full blur-[65px] transition duration-500 group-hover:opacity-80 ${index === 0 ? "bg-primary/[0.07]" : "bg-violet-400/[0.07]"}`}
                  />
                  <ProjectIllustration variant={index} title={project.title} />
                  <span className="absolute left-5 top-5 font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
                    {index === 0 ? "Business systems" : "Data & insights"}
                  </span>
                  <span className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/15 text-white/60 backdrop-blur transition group-hover:border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <h3 className="text-xl font-medium tracking-tight transition group-hover:text-primary sm:text-2xl">
                    {project.title}
                  </h3>
                  <span className="mt-1.5 font-mono text-[10px] text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
                <p className="mt-2 max-w-lg text-sm leading-7 text-muted-foreground">
                  {project.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.techStacks.slice(0, 3).map((tech) => (
                    <span
                      key={tech.name}
                      className="rounded-full border border-border/80 px-3 py-1 font-mono text-[10px] text-muted-foreground"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
          {projects[2] && (
            <Link
              href={`/projects/${projects[2].slug}`}
              className="group mt-10 flex flex-wrap items-center justify-between gap-4 border-y border-border/80 px-2 py-6 transition hover:px-4 hover:text-primary"
            >
              <div className="flex items-center gap-5">
                <span className="font-mono text-xs text-muted-foreground">
                  03
                </span>
                <div>
                  <h3 className="text-lg font-medium tracking-tight">
                    {projects[2].title}
                  </h3>
                  <p className="mt-1 text-xs leading-6 text-muted-foreground">
                    Explore the thinking behind the build.
                  </p>
                </div>
              </div>
              <span className="flex items-center gap-4 text-xs text-muted-foreground group-hover:text-primary">
                View case study <ArrowUpRight className="h-5 w-5" />
              </span>
            </Link>
          )}
        </Container>
      </Reveal>

      <Reveal
        id="about"
        className="border-y border-border/60 bg-card/35 py-20 sm:py-28"
      >
        <Container
          size="xl"
          className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24"
        >
          <div>
            <Eyebrow number="02" label="A little about me" />
            <h2 className="mt-6 text-4xl font-medium leading-[1.12] tracking-[-0.045em] sm:text-5xl">
              Good software
              <br />
              starts with
              <br />
              <span className="text-primary">understanding.</span>
            </h2>
          </div>
          <div className="lg:pt-10">
            <p className="text-lg leading-[1.85] text-foreground/85 sm:text-xl">
              {profile.bio}
            </p>
            <p className="mt-5 text-sm leading-8 text-muted-foreground">
              I enjoy connecting the dots between people, processes, and
              technology. From a well-considered interface to the API and data
              behind it, every detail has a purpose.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link
                href="/about"
                className="inline-flex items-center gap-3 text-sm font-medium transition hover:text-primary"
              >
                More about me <ArrowUpRight className="h-4 w-4 text-primary" />
              </Link>
              {profile.cvUrl && (
                <Link
                  href={profile.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs text-muted-foreground transition hover:text-primary"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download résumé
                </Link>
              )}
            </div>
          </div>
        </Container>
      </Reveal>

      <Reveal id="skills" className="py-20 sm:py-28">
        <Container size="xl">
          <SectionHeader
            number="03"
            label="My toolkit"
            title={
              <>
                Different layers.
                <br />
                <span className="text-muted-foreground">
                  One connected vision.
                </span>
              </>
            }
            link="/skills"
            linkLabel="Explore expertise"
          />
          <div className="mt-12 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((category, index) => {
              const Icon = skillIcons[index % skillIcons.length];
              return (
                <div
                  key={category.category}
                  className="border-t border-border/70 py-7"
                >
                  <div className="flex items-center justify-between">
                    <Icon
                      className="h-5 w-5 text-primary/80"
                      strokeWidth={1.5}
                    />
                    <span className="font-mono text-[10px] text-muted-foreground/60">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-medium tracking-tight">
                    {category.category}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {category.skills.map((skill) => skill.name).join(" · ")}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </Reveal>

      <Reveal id="experience" className="pb-20 sm:pb-28">
        <Container
          size="xl"
          className="grid gap-10 border-t border-border/70 pt-16 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24"
        >
          <div>
            <Eyebrow number="04" label="The journey" />
            <h2 className="mt-6 text-4xl font-medium leading-[1.1] tracking-[-0.045em]">
              Always building.
              <br />
              <span className="text-muted-foreground">Always learning.</span>
            </h2>
            <Link
              href="/experience"
              className="mt-7 inline-flex items-center gap-3 text-sm text-muted-foreground transition hover:text-primary"
            >
              Full experience <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div>
            {experiences.slice(0, 3).map((experience) => (
              <article
                key={experience.id}
                className="relative border-l border-border pb-9 pl-7 last:pb-0"
              >
                <span
                  className={`absolute -left-[4px] top-1.5 h-[7px] w-[7px] rounded-full ${experience.isCurrent ? "bg-primary shadow-[0_0_14px_hsl(var(--primary)/0.4)]" : "bg-muted-foreground"}`}
                />
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {formatExperiencePeriod(experience)}
                  {experience.isCurrent && (
                    <span className="ml-3 text-primary">Current</span>
                  )}
                </p>
                <h3 className="mt-3 text-xl font-medium tracking-tight">
                  {experience.role}
                </h3>
                <p className="mt-1 text-sm text-primary/85">
                  {experience.company}
                </p>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {experience.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Reveal>

      <Reveal
        id="contact"
        className="relative isolate border-t border-border/60 py-20 sm:py-28"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_100%,hsl(var(--primary)/0.07),transparent_70%)]"
        />
        <Container size="xl">
          <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
            <div>
              <p className="mb-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Have something in mind?
              </p>
              <h2 className="text-[clamp(3rem,7vw,6.5rem)] font-medium leading-[1.02] tracking-[-0.06em]">
                Let’s build
                <br />
                <span className="text-primary">what’s next.</span>
              </h2>
            </div>
            <div className="max-w-xs lg:pb-2">
              <p className="text-sm leading-7 text-muted-foreground">
                A new idea, an interesting challenge, or your next team member.
                It starts with a conversation.
              </p>
              <Link
                href="/contact"
                className="group mt-7 inline-flex items-center gap-8 rounded-full border border-primary/60 px-6 py-4 text-sm font-medium text-primary transition hover:bg-primary hover:text-primary-foreground"
              >
                Start a conversation{" "}
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </Container>
      </Reveal>
    </div>
  );
}

function Eyebrow({ number, label }: { number: string; label: string }) {
  return (
    <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
      <span className="text-primary">{number} /</span>
      {label}
    </p>
  );
}
function SectionHeader({
  number,
  label,
  title,
  link,
  linkLabel,
}: {
  number: string;
  label: string;
  title: ReactNode;
  link: string;
  linkLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-7">
      <div>
        <Eyebrow number={number} label={label} />
        <h2 className="mt-5 text-4xl font-medium leading-[1.1] tracking-[-0.045em] sm:text-5xl">
          {title}
        </h2>
      </div>
      <Link
        href={link}
        className="group inline-flex items-center gap-4 border-b border-border pb-2 text-xs font-medium text-foreground/80 transition hover:border-primary hover:text-primary"
      >
        {linkLabel}
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
function Reveal({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.section
      id={id}
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      animate={reducedMotion ? { opacity: 1, y: 0 } : undefined}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: reducedMotion ? 0 : 0.6 }}
    >
      {children}
    </motion.section>
  );
}

function SystemIllustration({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div
      role="img"
      aria-label="A system blueprint connecting a thoughtful interface, a modular API, and a reliable database"
      className="relative mx-auto aspect-square w-full max-w-[560px] select-none"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 560 560"
        className="absolute inset-0 h-full w-full text-primary"
      >
        <defs>
          <pattern
            id="home-dots"
            x="0"
            y="0"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="0.7" fill="currentColor" opacity="0.18" />
          </pattern>
          <radialGradient id="home-fade">
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </radialGradient>
          <mask id="home-grid-mask">
            <rect width="560" height="560" fill="url(#home-fade)" />
          </mask>
        </defs>
        <rect
          width="560"
          height="560"
          fill="url(#home-dots)"
          mask="url(#home-grid-mask)"
        />
        <g fill="none" stroke="currentColor">
          <circle cx="280" cy="276" r="210" opacity="0.08" />
          <circle
            cx="280"
            cy="276"
            r="160"
            opacity="0.1"
            strokeDasharray="3 9"
          />
          <ellipse
            cx="280"
            cy="276"
            rx="237"
            ry="110"
            transform="rotate(-35 280 276)"
            opacity="0.13"
          />
          <path
            d="M130 180H204Q220 180 220 196V247M343 274H416V365M190 385H268Q280 385 280 373V320"
            opacity="0.4"
            strokeDasharray="4 5"
          />
        </g>
        <g fill="currentColor">
          <circle cx="130" cy="180" r="3" />
          <circle cx="416" cy="365" r="3" />
          <circle cx="190" cy="385" r="3" />
          <circle cx="459" cy="149" r="2" opacity="0.5" />
          <circle cx="89" cy="351" r="2" opacity="0.5" />
        </g>
        <g stroke="currentColor" opacity="0.35">
          <path d="M96 101h10m-5-5v10M443 435h10m-5-5v10M476 271h10m-5-5v10" />
        </g>
      </svg>
      <motion.div
        animate={reducedMotion ? undefined : { y: [0, -7, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[8%] top-[11%] w-[70%] rounded-xl border border-white/[0.12] bg-[#11161a] shadow-[0_24px_70px_#0006]"
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
          <span className="flex gap-1.5">
            <i className="h-1.5 w-1.5 rounded-full bg-[#ff6b62]/70" />
            <i className="h-1.5 w-1.5 rounded-full bg-[#efc16b]/70" />
            <i className="h-1.5 w-1.5 rounded-full bg-[#65c89c]/70" />
          </span>
          <span className="font-mono text-[8px] text-white/40 sm:text-[10px]">
            system.config.ts
          </span>
          <Code2 className="h-3 w-3 text-white/25" />
        </div>
        <div className="space-y-2.5 px-4 py-5 font-mono text-[9px] leading-[1.6] sm:px-6 sm:text-[11px]">
          <p className="text-white/35">
            01 <span className="ml-3 text-[#b5a4f8]">const</span>{" "}
            <span className="text-white/85">vision</span> ={" "}
            <span className="text-primary">build</span>({"{"}
          </p>
          <p className="text-white/35">
            02 <span className="ml-6 text-white/70">interface:</span>{" "}
            <span className="text-[#c9d8a1]">"thoughtful"</span>,
          </p>
          <p className="text-white/35">
            03 <span className="ml-6 text-white/70">architecture:</span>{" "}
            <span className="text-[#c9d8a1]">"scalable"</span>,
          </p>
          <p className="text-white/35">
            04 <span className="ml-6 text-white/70">possibilities:</span>{" "}
            <span className="text-[#efc58a]">Infinity</span>
          </p>
          <p className="text-white/35">
            05 <span className="ml-3 text-white/75">{"}"});</span>
          </p>
        </div>
      </motion.div>
      <motion.div
        animate={reducedMotion ? undefined : { y: [0, 6, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute left-[35%] top-[43%] flex aspect-square w-[27%] items-center justify-center rounded-[25%] border border-primary/40 bg-[#101f23] shadow-[0_0_65px_hsl(var(--primary)/0.12),0_25px_60px_#0009]"
      >
        <div className="absolute inset-[10%] rounded-[20%] border border-primary/10" />
        <Code2 className="h-[38%] w-[38%] text-primary" strokeWidth={1.2} />
        <span className="absolute -bottom-3 rounded-full border border-primary/20 bg-[#112326] px-3 py-1 font-mono text-[7px] tracking-[0.12em] text-primary sm:text-[9px]">
          BUILD WITH PURPOSE
        </span>
      </motion.div>
      <div className="absolute right-[2%] top-[44%] rounded-lg border border-white/10 bg-[#12191d] px-3 py-2.5 shadow-xl sm:px-4">
        <div className="flex items-center gap-2">
          <GitBranch className="h-3.5 w-3.5 text-primary" />
          <span className="font-mono text-[9px] text-white/80 sm:text-[10px]">
            Modular API
          </span>
        </div>
        <p className="mt-1.5 font-mono text-[7px] text-white/35 sm:text-[8px]">
          Clean. Connected. Extensible.
        </p>
      </div>
      <div className="absolute bottom-[15%] left-[7%] w-[38%] rounded-lg border border-white/10 bg-[#12181c] px-4 py-3 shadow-xl">
        <div className="flex items-center gap-2">
          <Database className="h-3.5 w-3.5 text-[#c3b2ed]" />
          <span className="font-mono text-[9px] text-white/80 sm:text-[10px]">
            Data, with structure.
          </span>
        </div>
        <div className="mt-3 grid grid-cols-5 gap-1.5">
          {Array.from({ length: 15 }, (_, i) => (
            <span
              key={i}
              className={`h-1 rounded-sm ${[2, 6, 9, 12].includes(i) ? "bg-primary/45" : "bg-white/10"}`}
            />
          ))}
        </div>
      </div>
      <div className="absolute bottom-[10%] right-[8%] flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.15em] text-white/40 sm:text-[9px]">
        <span className="h-1 w-1 rounded-full bg-primary" />
        Ideas → systems
      </div>
    </div>
  );
}

function ProjectIllustration({
  variant,
  title,
}: {
  variant: number;
  title: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`relative w-full max-w-md overflow-hidden rounded-lg border border-white/15 bg-[#101619] shadow-[0_20px_50px_#0006] transition duration-500 group-hover:-translate-y-2 ${variant === 0 ? "-rotate-3 group-hover:-rotate-1" : "rotate-3 group-hover:rotate-1"}`}
    >
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.025] px-3 py-2">
        <div className="flex items-center gap-1">
          <span className="h-1 w-1 rounded-full bg-white/25" />
          <span className="h-1 w-1 rounded-full bg-white/15" />
          <span className="h-1 w-1 rounded-full bg-white/10" />
        </div>
        <span className="max-w-[65%] truncate font-mono text-[6px] uppercase text-white/35 sm:text-[8px]">
          {title} / overview
        </span>
        <div className="h-1 w-5 rounded bg-white/10" />
      </div>
      <div className="flex min-h-[180px] sm:min-h-[220px]">
        <div className="w-[19%] shrink-0 space-y-4 border-r border-white/[0.06] bg-white/[0.02] px-2 py-4">
          <div
            className={`mb-5 flex h-5 w-5 items-center justify-center rounded ${variant === 0 ? "bg-primary/20 text-primary" : "bg-violet-400/20 text-violet-300"}`}
          >
            <Layers3 className="h-3 w-3" />
          </div>
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={`h-1 w-full rounded ${i === 0 ? (variant === 0 ? "bg-primary/40" : "bg-violet-300/40") : "bg-white/10"}`}
            />
          ))}
        </div>
        <div className="w-[81%] p-3 sm:p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-medium text-white/90 sm:text-xs">
                {variant === 0
                  ? "Procurement overview"
                  : "Performance overview"}
              </p>
              <p className="mt-1 text-[6px] text-white/35 sm:text-[8px]">
                {variant === 0
                  ? "Every request. One clear workflow."
                  : "A clearer picture of your team's growth."}
              </p>
            </div>
            <div
              className={`h-4 w-9 rounded ${variant === 0 ? "bg-primary/20" : "bg-violet-400/20"}`}
            />
          </div>
          <div className="mb-4 grid grid-cols-3 gap-2">
            {["Requests", "In review", "Completed"].map((label, i) => (
              <div
                key={label}
                className="rounded border border-white/[0.07] bg-white/[0.025] p-2"
              >
                <p className="text-[5px] text-white/40 sm:text-[7px]">
                  {variant === 0 ? label : ["Goals", "Team score", "Growth"][i]}
                </p>
                <div
                  className={`mt-2 h-2 w-7 rounded-sm ${i === 2 ? (variant === 0 ? "bg-primary/55" : "bg-violet-300/55") : "bg-white/45"}`}
                />
              </div>
            ))}
          </div>
          {variant === 0 ? (
            <div className="rounded border border-white/[0.07]">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-2 py-2">
                <span className="text-[7px] text-white/65">
                  Recent requisitions
                </span>
                <span className="text-[6px] text-primary">
                  View all <ArrowRight className="inline h-2 w-2" />
                </span>
              </div>
              {[
                "Office equipment",
                "Production materials",
                "IT infrastructure",
              ].map((row, i) => (
                <div
                  key={row}
                  className="flex items-center justify-between border-b border-white/[0.04] px-2 py-2 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded bg-white/5" />
                    <span className="text-[6px] text-white/50 sm:text-[7px]">
                      {row}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[5px] ${i === 1 ? "bg-amber-300/10 text-amber-200/70" : "bg-primary/10 text-primary/80"}`}
                  >
                    {i === 1 ? "In review" : "Approved"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="relative rounded border border-white/[0.07] p-3">
              <p className="mb-3 text-[7px] text-white/60">
                Progress over time
              </p>
              <div className="relative flex h-20 items-end justify-between gap-2 border-b border-white/10 px-1">
                {[30, 50, 40, 65, 55, 75, 70, 95, 85, 100].map((height, i) => (
                  <span
                    key={i}
                    style={{ height: `${height}%` }}
                    className={`w-full rounded-t-sm ${i > 6 ? "bg-violet-300/70" : "bg-violet-400/20"}`}
                  />
                ))}
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <Check className="h-2 w-2 text-violet-300" />
                <span className="text-[6px] text-white/40">
                  Built for meaningful progress
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
