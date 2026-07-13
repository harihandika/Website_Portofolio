"use client";

import { Container } from "@/components/layout/container";
import { SectionTitle } from "@/components/layout/section-title";
import { AboutSection } from "@/components/sections/about-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  ExperienceData,
  ProfileData,
  SkillCategoryData,
} from "@/lib/data/portfolio";
import { cardHover, fadeUp, staggerContainer } from "@/lib/motion";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Download, Mail, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";

const techStacks = [
  "Next.js",
  "NestJS",
  "TypeScript",
  "Prisma",
  "PostgreSQL",
  "Railway",
  "Vercel",
  "JWT",
];

const featuredProjects = [
  {
    title: "ProcureFlow ERP",
    summary:
      "Procurement workflow platform with approvals, budget control, receiving, and ERP sync simulation.",
    stacks: ["Next.js", "NestJS", "Prisma"],
  },
  {
    title: "Transfer Request Portal",
    summary:
      "Operational application for material transfer requests, interplant schedules, and reporting flows.",
    stacks: ["Backend", "Database", "Workflow"],
  },
  {
    title: "Portfolio CMS",
    summary:
      "Admin-managed portfolio system with profile, projects, skills, experiences, and contact messages.",
    stacks: ["JWT", "PostgreSQL", "API"],
  },
];

type HomePageProps = {
  profile: ProfileData;
  skills: SkillCategoryData[];
  experiences: ExperienceData[];
};

export function HomePage({ profile, skills, experiences }: HomePageProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative">
      <section id="home" className="relative overflow-hidden">
        <div className="animated-gradient absolute inset-0 -z-10" />
        <div className="surface-grid absolute inset-0 -z-10 opacity-50" />
        <Container className="grid min-h-[calc(100vh-4rem)] items-center gap-12 py-20 lg:grid-cols-[1.12fr_0.88fr] lg:py-28">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={fadeUp}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-sm text-primary"
            >
              <Sparkles className="h-4 w-4" />
              Available for backend and full stack roles
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-balance text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Full Stack Developer focused on Backend, System Integration, and
              Scalable Web Applications
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg"
            >
              I build clean, maintainable, and business-oriented applications
              using Next.js, NestJS, Prisma, PostgreSQL, and modern cloud
              deployment.
            </motion.p>
            <motion.div
              variants={staggerContainer}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <motion.div variants={fadeUp}>
                <Button asChild size="lg">
                  <Link href="/projects">
                    View Projects
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div variants={fadeUp}>
                <Button asChild size="lg" variant="outline">
                  <Link
                    href={
                      profile.cvUrl ?? "/assets/CV Hari_Handika_Setiawan.pdf"
                    }
                    target="_blank"
                  >
                    <Download className="h-4 w-4" />
                    Download CV
                  </Link>
                </Button>
              </motion.div>
              <motion.div variants={fadeUp}>
                <Button asChild size="lg" variant="ghost">
                  <Link href="/contact">
                    <Mail className="h-4 w-4" />
                    Contact Me
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-md lg:ml-auto"
          >
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-lg border border-primary/25 bg-card/90 p-5 shadow-[0_22px_80px_hsl(222_36%_4%/0.42)] backdrop-blur"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-2xl font-semibold text-primary">
                  HH
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    {profile.fullName}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {profile.headline}
                  </p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <ProfileMetric label="Primary Stack" value="Next + Nest" />
                <ProfileMetric label="Database" value="PostgreSQL" />
                <ProfileMetric label="Delivery" value="Vercel" />
                <ProfileMetric label="Backend" value="Prisma ORM" />
              </div>
              <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                {profile.location ?? "Indonesia / Remote"}
              </div>
            </motion.div>

            <FloatingBadge
              className="-left-3 top-8"
              delay={0}
              label="NestJS"
              reduceMotion={reduceMotion}
            />
            <FloatingBadge
              className="-right-2 top-28"
              delay={0.8}
              label="Prisma"
              reduceMotion={reduceMotion}
            />
            <FloatingBadge
              className="bottom-10 left-4"
              delay={1.4}
              label="PostgreSQL"
              reduceMotion={reduceMotion}
            />
          </motion.div>
        </Container>
      </section>

      <RevealSection id="tech-stack" className="py-10">
        <Container>
          <div className="flex flex-wrap justify-center gap-3">
            {techStacks.map((tech) => (
              <Badge key={tech} className="px-3 py-1.5 text-sm">
                {tech}
              </Badge>
            ))}
          </div>
        </Container>
      </RevealSection>

      <AboutSection profile={profile} />

      <RevealSection id="projects" className="py-20">
        <Container>
          <SectionTitle
            eyebrow="Featured Projects"
            title="Selected work built around practical engineering problems."
            description="These previews will connect to detailed case studies as the project pages are added."
            actions={
              <Button asChild variant="outline">
                <Link href="/projects">View All</Link>
              </Button>
            }
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {featuredProjects.map((project) => (
              <motion.div
                key={project.title}
                whileHover={reduceMotion ? undefined : cardHover}
              >
                <Card className="h-full transition-all duration-300 hover:border-primary/35 hover:shadow-[0_22px_70px_hsl(var(--primary)/0.13)]">
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.summary}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {project.stacks.map((stack) => (
                      <Badge key={stack} variant="outline">
                        {stack}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </RevealSection>

      <SkillsSection skills={skills} />
      <ExperienceSection experiences={experiences} />

      <RevealSection id="contact" className="py-20">
        <Container>
          <Card className="overflow-hidden">
            <div className="animated-gradient border-b border-border/70 px-6 py-12 sm:px-10">
              <div className="max-w-3xl">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                  Contact
                </p>
                <h2 className="text-balance text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
                  Need a developer who can connect product thinking with backend
                  execution?
                </h2>
                <p className="mt-4 text-base leading-7 text-muted-foreground">
                  Let's discuss full stack roles, backend engineering
                  opportunities, integration work, or freelance business
                  applications.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg">
                    <Link href="/contact">
                      <Mail className="h-4 w-4" />
                      Contact Me
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/projects">Review Projects</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </Container>
      </RevealSection>
    </div>
  );
}

function ProfileMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border/70 bg-secondary/45 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function FloatingBadge({
  className,
  delay,
  label,
  reduceMotion,
}: {
  className: string;
  delay: number;
  label: string;
  reduceMotion: boolean | null;
}) {
  return (
    <motion.div
      animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 5, delay, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute hidden rounded-md border border-primary/30 bg-background/90 px-3 py-2 text-sm font-medium text-primary shadow-[0_10px_36px_hsl(222_36%_4%/0.35)] backdrop-blur sm:block ${className}`}
    >
      {label}
    </motion.div>
  );
}

function RevealSection({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.section>
  );
}
