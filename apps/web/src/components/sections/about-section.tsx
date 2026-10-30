"use client";

import { useReducedMotion } from "@/lib/use-reduced-motion";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Building2,
  Database,
  GitBranch,
  Layers3,
  ServerCog,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import type { ProfileData } from "@/lib/data/portfolio";
import { fadeUp, staggerContainer } from "@/lib/motion";

const highlights = [
  {
    title: "Backend engineering",
    description:
      "Reliable services. Clear API contracts. Systems designed to grow without getting in the way.",
    icon: ServerCog,
    detail: "Architecture / REST APIs / Authentication",
  },
  {
    title: "Connected systems",
    description:
      "Bringing business tools together through thoughtful integrations and dependable data flows.",
    icon: GitBranch,
    detail: "ERP / Integrations / Workflows",
  },
  {
    title: "Data with purpose",
    description:
      "Carefully modeled relationships and queries that keep operational information useful and consistent.",
    icon: Database,
    detail: "PostgreSQL / Prisma / Data integrity",
  },
  {
    title: "End-to-end delivery",
    description:
      "From the first database table to the interface people use every day. One coherent experience.",
    icon: Layers3,
    detail: "Next.js / Responsive UI / Deployment",
  },
];

type AboutSectionProps = { profile: ProfileData };

export function AboutSection({ profile }: AboutSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="about" className="relative py-20 sm:py-28">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion ? "visible" : undefined}
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          <motion.div
            variants={fadeUp}
            className="grid gap-10 border-b border-border pb-14 lg:grid-cols-[1.15fr_1fr] lg:gap-24"
          >
            <div>
              <p className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-primary">
                <span className="h-px w-8 bg-primary" /> The person behind the
                code
              </p>
              <h1 className="max-w-2xl text-4xl font-medium leading-[1.1] tracking-[-0.045em] sm:text-6xl">
                Curious by nature.
                <br />
                <span className="text-muted-foreground">
                  Engineer by craft.
                </span>
              </h1>
            </div>
            <div className="lg:pt-10">
              <p className="text-lg leading-8 text-muted-foreground">
                {profile.bio}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-5">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4 text-primary" />
                  {profile.location || "Indonesia"}
                </span>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-foreground"
                >
                  Let’s connect
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </motion.div>

          <div className="mt-14 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-medium tracking-tight">
              What I bring to the table
            </h2>
            <span className="hidden font-mono text-xs text-muted-foreground sm:block">
              STRATEGY → SYSTEMS → EXPERIENCE
            </span>
          </div>
          <div className="mt-8 grid border-l border-t border-border sm:grid-cols-2">
            {highlights.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.title}
                  variants={fadeUp}
                  className="group border-b border-r border-border bg-card/30 p-7 transition-colors hover:bg-card sm:p-9"
                >
                  <div className="mb-9 flex items-center justify-between">
                    <Icon className="h-6 w-6 text-primary" />
                    <span className="font-mono text-xs text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium tracking-tight sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                  <p className="mt-7 font-mono text-[10px] uppercase tracking-wider text-primary/80">
                    {item.detail}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
