"use client";

import { useReducedMotion } from "@/lib/use-reduced-motion";

import { motion } from "framer-motion";
import {
  Boxes,
  Braces,
  Cloud,
  Database,
  GitBranch,
  Layers3,
  Monitor,
  ServerCog,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import type { SkillCategoryData } from "@/lib/data/portfolio";
import { fadeUp, staggerContainer } from "@/lib/motion";

type SkillsSectionProps = { skills: SkillCategoryData[] };

function categoryIcon(category: string): LucideIcon {
  const name = category.toLowerCase();
  if (name.includes("frontend")) return Monitor;
  if (name.includes("backend")) return ServerCog;
  if (name.includes("database")) return Database;
  if (name.includes("devops") || name.includes("cloud")) return Cloud;
  if (name.includes("integration")) return GitBranch;
  if (name.includes("business")) return Boxes;
  if (name.includes("language")) return Braces;
  return Layers3;
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const reduceMotion = useReducedMotion();
  const total = skills.reduce((count, group) => count + group.skills.length, 0);

  return (
    <section id="skills" className="py-20 sm:py-28">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial={reduceMotion ? false : "hidden"}
          animate={reduceMotion ? "visible" : undefined}
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          <motion.header
            variants={fadeUp}
            className="grid gap-8 border-b border-border pb-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end"
          >
            <div>
              <p className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-primary">
                <span className="h-px w-8 bg-primary" /> Tools of the trade
              </p>
              <h1 className="text-4xl font-medium leading-[1.1] tracking-[-0.045em] sm:text-6xl">
                The right tools.
                <br />
                <span className="text-muted-foreground">
                  Thoughtfully applied.
                </span>
              </h1>
            </div>
            <div>
              <p className="max-w-md text-base leading-8 text-muted-foreground">
                A practical toolkit for turning complex requirements into
                dependable products, from the interface to the infrastructure.
              </p>
              <p className="mt-5 font-mono text-xs uppercase tracking-wider text-primary">
                {String(total).padStart(2, "0")} skills /{" "}
                {String(skills.length).padStart(2, "0")} disciplines
              </p>
            </div>
          </motion.header>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {skills.map((group, groupIndex) => {
              const Icon = categoryIcon(group.category);
              return (
                <motion.article
                  key={group.category}
                  variants={fadeUp}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card/50 p-6 transition-colors hover:border-primary/40 sm:p-7"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      /{String(groupIndex + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 className="text-xl font-medium tracking-tight">
                    {group.category}
                  </h2>
                  <ul className="mt-6 divide-y divide-border/60">
                    {group.skills.map((skill) => (
                      <li
                        key={skill.id}
                        className="flex items-start justify-between gap-4 py-3 text-sm"
                      >
                        <span className="text-foreground/90">{skill.name}</span>
                        <span className="pt-0.5 text-right font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                          {skill.level.toLowerCase().replace(/_/g, " ")}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-7 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent transition-colors group-hover:via-primary/60"
                  />
                </motion.article>
              );
            })}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
