'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, MapPin } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { SectionTitle } from '@/components/layout/section-title';
import { Card, CardContent } from '@/components/ui/card';
import { formatExperiencePeriod, type ExperienceData } from '@/lib/data/portfolio';
import { fadeUp, staggerContainer, timelineSlide } from '@/lib/motion';

type ExperienceSectionProps = {
  experiences: ExperienceData[];
};

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="experience" className="py-20">
      <Container>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <motion.div variants={fadeUp}>
            <SectionTitle
              eyebrow="Experience"
              title="Timeline of backend, integration, and full stack work."
              description="Each experience highlights the work context, practical responsibilities, and measurable implementation focus."
            />
          </motion.div>

          <div className="relative mt-12">
            <div className="absolute left-4 top-0 hidden h-full w-px bg-border md:block" />
            <div className="space-y-6">
              {experiences.map((experience, index) => (
                <motion.article
                  key={experience.id}
                  variants={reduceMotion ? fadeUp : timelineSlide}
                  custom={index}
                  className="relative md:pl-12"
                >
                  <span className="absolute left-[0.7rem] top-6 hidden h-3 w-3 rounded-full bg-primary shadow-[0_0_24px_hsl(var(--primary)/0.55)] md:block" />
                  <Card className="transition-all duration-300 hover:border-primary/30 hover:shadow-[0_18px_64px_hsl(var(--primary)/0.1)]">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">{experience.role}</h3>
                          <p className="mt-1 text-primary">{experience.company}</p>
                        </div>
                        <div className="shrink-0 rounded-md border bg-secondary/60 px-3 py-2 text-sm text-muted-foreground">
                          {formatExperiencePeriod(experience)}
                        </div>
                      </div>

                      {experience.location ? (
                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary" />
                          {experience.location}
                        </div>
                      ) : null}

                      <p className="mt-5 leading-7 text-muted-foreground">{experience.description}</p>

                      {experience.achievements.length ? (
                        <ul className="mt-5 space-y-3">
                          {experience.achievements.map((achievement) => (
                            <li key={achievement} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </CardContent>
                  </Card>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
