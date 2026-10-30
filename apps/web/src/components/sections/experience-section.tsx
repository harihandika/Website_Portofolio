"use client";

import { useReducedMotion } from "@/lib/use-reduced-motion";

import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import {
  formatExperiencePeriod,
  type ExperienceData,
} from "@/lib/data/portfolio";
import { fadeUp, staggerContainer } from "@/lib/motion";

type ExperienceSectionProps = { experiences: ExperienceData[] };

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="experience" className="py-20 sm:py-28">
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
            className="grid gap-7 pb-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end"
          >
            <div>
              <p className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-primary">
                <span className="h-px w-8 bg-primary" /> The journey so far
              </p>
              <h1 className="text-4xl font-medium leading-[1.1] tracking-[-0.045em] sm:text-6xl">
                Built through
                <br />
                <span className="text-muted-foreground">real experience.</span>
              </h1>
            </div>
            <p className="max-w-md text-base leading-8 text-muted-foreground lg:pb-1">
              A journey through business applications, connected systems, and
              the challenges that make better software engineers.
            </p>
          </motion.header>
          <div className="border-t border-border">
            {experiences.map((experience, index) => (
              <motion.article
                key={experience.id}
                variants={fadeUp}
                className="group grid gap-7 border-b border-border py-10 md:grid-cols-[0.75fr_1.7fr] md:gap-12 md:py-12"
              >
                <div className="relative">
                  <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    <span className="text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{formatExperiencePeriod(experience)}</span>
                  </div>
                  {experience.isCurrent ? (
                    <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Current role
                    </span>
                  ) : null}
                  {experience.location ? (
                    <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {experience.location}
                    </p>
                  ) : null}
                </div>
                <div>
                  <h2 className="text-2xl font-medium leading-tight tracking-tight transition-colors group-hover:text-primary sm:text-3xl">
                    {experience.role}
                  </h2>
                  <p className="mt-2 text-base text-primary">
                    {experience.company}
                  </p>
                  <p className="mt-6 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
                    {experience.description}
                  </p>
                  {experience.achievements.length ? (
                    <ul className="mt-6 grid gap-4">
                      {experience.achievements.map((achievement) => (
                        <li
                          key={achievement}
                          className="flex gap-3 text-sm leading-6 text-muted-foreground"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </motion.article>
            ))}
          </div>
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center justify-between gap-4"
          >
            <p className="text-sm text-muted-foreground">
              The next chapter could be something we build together.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-foreground"
            >
              Start a conversation
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
