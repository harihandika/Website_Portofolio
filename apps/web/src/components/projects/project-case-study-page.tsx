'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Database,
  Github,
  Layers3,
  MonitorUp,
  Network,
  RotateCw,
  Star,
  Target,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { ErrorState } from '@/components/states/error-state';
import { LoadingState } from '@/components/states/loading-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { fetchProjectBySlug, type ProjectData } from '@/lib/data/projects';
import { fadeUp, pageTransition, staggerContainer } from '@/lib/motion';

type ProjectDetailStatus = 'loading' | 'success' | 'error';
const PROJECT_DETAIL_FETCH_TIMEOUT_MS = 6000;

export function ProjectCaseStudyPage({ slug }: { slug: string }) {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [status, setStatus] = useState<ProjectDetailStatus>('loading');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;
    const timeout = setTimeout(() => controller.abort(), PROJECT_DETAIL_FETCH_TIMEOUT_MS);

    async function loadProject() {
      setStatus('loading');

      try {
        const response = await fetchProjectBySlug(slug, controller.signal);
        if (!isActive) {
          return;
        }

        setProject(response);
        setStatus('success');
      } catch {
        if (!isActive) {
          return;
        }

        setStatus('error');
      } finally {
        clearTimeout(timeout);
      }
    }

    loadProject();

    return () => {
      isActive = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [reloadKey, slug]);

  return (
    <motion.main
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      className="relative min-h-[calc(100vh-4rem)] overflow-hidden py-24"
    >
      <div className="animated-gradient absolute inset-0 -z-10 opacity-80" />
      <div className="surface-grid absolute inset-0 -z-10 opacity-40" />
      <Container>
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </Button>

        {status === 'loading' ? (
          <LoadingState title="Loading case study" description="Fetching the project details from the backend API." />
        ) : null}

        {status === 'error' ? (
          <ErrorState
            title="Case study could not be loaded"
            description="The project may not exist, or the backend API is currently unavailable."
            action={
              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="outline" onClick={() => setReloadKey((key) => key + 1)}>
                  <RotateCw className="h-4 w-4" />
                  Retry
                </Button>
                <Button asChild>
                  <Link href="/projects">Back to Projects</Link>
                </Button>
              </div>
            }
          />
        ) : null}

        {status === 'success' && project ? <CaseStudyContent project={project} /> : null}
      </Container>
    </motion.main>
  );
}

function CaseStudyContent({ project }: { project: ProjectData }) {
  const features = useMemo(() => buildFeatureList(project), [project]);
  const architecturePoints = useMemo(() => buildArchitecturePoints(project), [project]);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <motion.header variants={fadeUp} className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            {project.isFeatured ? (
              <Badge className="gap-1 border-primary/40 bg-primary/15 text-primary">
                <Star className="h-3.5 w-3.5" />
                Featured Case Study
              </Badge>
            ) : null}
            <Badge variant="outline">Technical Portfolio</Badge>
          </div>
          <h1 className="text-balance text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">{project.summary}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            {project.githubUrl ? (
              <Button asChild>
                <Link href={project.githubUrl} target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4" />
                  GitHub
                </Link>
              </Button>
            ) : null}
            {project.demoUrl ? (
              <Button asChild variant="outline">
                <Link href={project.demoUrl} target="_blank" rel="noreferrer">
                  <MonitorUp className="h-4 w-4" />
                  Live Demo
                </Link>
              </Button>
            ) : null}
          </div>
        </div>

        <ProjectHeroImage project={project} />
      </motion.header>

      <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(320px,0.28fr)]">
        <motion.div variants={staggerContainer} className="space-y-6">
          <CaseStudySection title="Overview" icon={Layers3}>
            <p>{project.description}</p>
          </CaseStudySection>

          <div className="grid gap-6 md:grid-cols-2">
            <CaseStudySection title="Problem" icon={Target}>
              <p>{project.problem}</p>
            </CaseStudySection>
            <CaseStudySection title="Goal" icon={CheckCircle2}>
              <p>{project.summary}</p>
            </CaseStudySection>
          </div>

          <CaseStudySection title="Solution" icon={Code2}>
            <p>{project.solution}</p>
          </CaseStudySection>

          <CaseStudySection title="Architecture Explanation" icon={Network}>
            <div className="grid gap-4 md:grid-cols-3">
              {architecturePoints.map((item) => (
                <div key={item.title} className="rounded-md border border-border/70 bg-secondary/35 p-4">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </CaseStudySection>

          <CaseStudySection title="Features" icon={CheckCircle2}>
            <ul className="grid gap-3 md:grid-cols-2">
              {features.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CaseStudySection>

          <CaseStudySection title="Impact" icon={Star}>
            <p>{project.impact}</p>
          </CaseStudySection>

          <CaseStudySection title="Screenshots Placeholder" icon={MonitorUp}>
            <div className="grid gap-4 md:grid-cols-3">
              {['Dashboard View', 'Workflow Detail', 'Admin Management'].map((label) => (
                <div
                  key={label}
                  className="flex aspect-[16/10] items-center justify-center rounded-lg border border-dashed border-border bg-secondary/35 text-sm text-muted-foreground"
                >
                  {label}
                </div>
              ))}
            </div>
          </CaseStudySection>
        </motion.div>

        <motion.aside variants={fadeUp} className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Tech Stack</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.techStacks.map((tech) => (
                  <Badge key={tech.id} variant="outline">
                    {tech.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Review Focus</p>
              <ReviewItem label="Backend" value="API contracts, validation, service boundaries" />
              <ReviewItem label="Database" value="Schema design, relations, data integrity" />
              <ReviewItem label="Integration" value="Business process flow and external touchpoints" />
              <ReviewItem label="Frontend" value="Usability, responsive layout, admin workflow readiness" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3 p-6">
              <Button asChild className="w-full">
                <Link href="/projects">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Projects
                </Link>
              </Button>
              {project.githubUrl ? (
                <Button asChild variant="outline" className="w-full">
                  <Link href={project.githubUrl} target="_blank" rel="noreferrer">
                    <Github className="h-4 w-4" />
                    Source Code
                  </Link>
                </Button>
              ) : null}
              {project.demoUrl ? (
                <Button asChild variant="ghost" className="w-full">
                  <Link href={project.demoUrl} target="_blank" rel="noreferrer">
                    <ArrowUpRight className="h-4 w-4" />
                    Open Demo
                  </Link>
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </motion.aside>
      </div>
    </motion.div>
  );
}

function CaseStudySection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Layers3;
  children: React.ReactNode;
}) {
  return (
    <motion.section variants={fadeUp}>
      <Card>
        <CardContent className="p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          </div>
          <div className="text-sm leading-7 text-muted-foreground sm:text-base">{children}</div>
        </CardContent>
      </Card>
    </motion.section>
  );
}

function ProjectHeroImage({ project }: { project: ProjectData }) {
  return (
    <div className="group overflow-hidden rounded-lg border border-border/80 bg-card/80 shadow-[0_22px_80px_hsl(222_36%_4%/0.36)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_35%_25%,hsl(var(--primary)/0.24),transparent_34%),linear-gradient(135deg,hsl(var(--secondary)),hsl(var(--card)))]">
            <div className="text-center">
              <Database className="mx-auto h-10 w-10 text-primary" />
              <p className="mt-4 text-sm font-medium text-foreground">Project screenshot placeholder</p>
              <p className="mt-2 text-xs text-muted-foreground">Replace with product screens later</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border/70 bg-secondary/35 p-4">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{value}</p>
    </div>
  );
}

function buildArchitecturePoints(project: ProjectData) {
  const stackNames = project.techStacks.map((tech) => tech.name).join(', ') || 'the selected project stack';

  return [
    {
      title: 'Frontend Layer',
      description: 'Responsive case-study and workflow screens designed for scanning by recruiters and technical reviewers.',
    },
    {
      title: 'Backend Layer',
      description: `API-first implementation designed around maintainable services and ${stackNames}.`,
    },
    {
      title: 'Data Layer',
      description: 'Relational data modeling, clear ownership of records, and query paths suitable for admin-managed content.',
    },
  ];
}

function buildFeatureList(project: ProjectData) {
  return [
    'Structured project overview for quick recruiter screening.',
    'Problem and solution framing for technical interview discussion.',
    'Backend-oriented implementation details and architecture explanation.',
    'Tech stack visibility with project-specific tools and frameworks.',
    'Business impact section focused on the value delivered by the project.',
    project.demoUrl ? 'Live demo available for reviewing the user-facing workflow.' : 'Prepared demo area for future deployment link.',
  ];
}
