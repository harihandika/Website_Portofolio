'use client';

import { motion } from 'framer-motion';
import { Building2, Database, GitBranch, Layers3, ServerCog } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { SectionTitle } from '@/components/layout/section-title';
import { Card, CardContent } from '@/components/ui/card';
import type { ProfileData } from '@/lib/data/portfolio';
import { fadeUp, staggerContainer } from '@/lib/motion';

const highlights = [
  {
    title: 'Backend Engineering',
    description: 'Clean NestJS service boundaries, DTO validation, JWT auth, and maintainable API contracts.',
    icon: ServerCog,
  },
  {
    title: 'ERP Integration',
    description: 'Business workflows, approval flows, operational data movement, and integration-oriented design.',
    icon: GitBranch,
  },
  {
    title: 'Business Process',
    description: 'Applications shaped around real user tasks, reporting needs, and repeatable operational flows.',
    icon: Building2,
  },
  {
    title: 'Database Design',
    description: 'PostgreSQL schemas, Prisma relations, data integrity, and query patterns for admin-managed content.',
    icon: Database,
  },
  {
    title: 'Full Stack Delivery',
    description: 'Next.js interfaces connected to backend APIs with responsive layouts and production-minded structure.',
    icon: Layers3,
  },
];

type AboutSectionProps = {
  profile: ProfileData;
};

export function AboutSection({ profile }: AboutSectionProps) {
  return (
    <section id="about" className="py-20">
      <Container>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}>
          <motion.div variants={fadeUp}>
            <SectionTitle
              eyebrow="About"
              title="Backend-minded full stack developer for practical business applications."
              description={profile.bio}
            />
          </motion.div>

          <motion.div variants={fadeUp} className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <Card key={item.title} className="h-full">
                  <CardContent className="p-5">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
