'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/layout/container';
import { SectionTitle } from '@/components/layout/section-title';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SkillCategoryData } from '@/lib/data/portfolio';
import { fadeUp, staggerContainer } from '@/lib/motion';

type SkillsSectionProps = {
  skills: SkillCategoryData[];
};

export function SkillsSection({ skills }: SkillsSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="skills" className="py-20">
      <Container>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <motion.div variants={fadeUp}>
            <SectionTitle
              eyebrow="Skills"
              title="Skills grouped by the way real projects are delivered."
              description="Backend, frontend, database, DevOps, integration, and business-domain skills for scalable portfolio and business applications."
            />
          </motion.div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {skills.map((group) => (
              <motion.div key={group.category} variants={fadeUp}>
                <Card className="h-full transition-all duration-300 hover:border-primary/35 hover:shadow-[0_0_34px_hsl(var(--primary)/0.14)]">
                  <CardHeader>
                    <CardTitle>{group.category}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {group.skills.map((skill, index) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.04, duration: 0.25 }}
                        whileHover={reduceMotion ? undefined : { y: -2, scale: 1.03 }}
                      >
                        <Badge className="transition-shadow duration-200 hover:shadow-[0_0_24px_hsl(var(--primary)/0.24)]">
                          {skill.name}
                        </Badge>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
