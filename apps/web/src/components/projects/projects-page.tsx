'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Github, MonitorUp, RotateCw, Star } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { SectionTitle } from '@/components/layout/section-title';
import { EmptyState } from '@/components/states/empty-state';
import { ErrorState } from '@/components/states/error-state';
import { LoadingState } from '@/components/states/loading-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchProjects, type ProjectData } from '@/lib/data/projects';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';

type ProjectStatus = 'loading' | 'success' | 'error';
const PROJECTS_FETCH_TIMEOUT_MS = 6000;

export function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [status, setStatus] = useState<ProjectStatus>('loading');
  const [reloadKey, setReloadKey] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;
    const timeout = setTimeout(() => controller.abort(), PROJECTS_FETCH_TIMEOUT_MS);

    async function loadProjects() {
      setStatus('loading');

      try {
        const response = await fetchProjects(controller.signal);
        if (!isActive) {
          return;
        }

        setProjects(response);
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

    loadProjects();

    return () => {
      isActive = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [reloadKey]);

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden py-24">
      <div className="animated-gradient absolute inset-0 -z-10 opacity-80" />
      <div className="surface-grid absolute inset-0 -z-10 opacity-40" />
      <Container>
        <SectionTitle
          eyebrow="Projects"
          title="Portfolio projects shaped as practical engineering case studies."
          description="A collection of backend, integration, database, and full stack work built around maintainable systems and business workflows."
        />

        <div className="mt-10">
          {status === 'loading' ? (
            <LoadingState title="Loading projects" description="Fetching portfolio projects from the backend API." />
          ) : null}

          {status === 'error' ? (
            <ErrorState
              title="Projects could not be loaded"
              description="The backend API is unavailable or returned an unexpected response."
              action={
                <Button type="button" variant="outline" onClick={() => setReloadKey((key) => key + 1)}>
                  <RotateCw className="h-4 w-4" />
                  Retry
                </Button>
              }
            />
          ) : null}

          {status === 'success' && projects.length === 0 ? (
            <EmptyState
              title="No projects published yet"
              description="Projects created from the admin dashboard will appear here after they are available from the API."
            />
          ) : null}

          {status === 'success' && projects.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            >
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} reduceMotion={reduceMotion} />
              ))}
            </motion.div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

function ProjectCard({ project, reduceMotion }: { project: ProjectData; reduceMotion: boolean | null }) {
  return (
    <motion.article variants={fadeUp} whileHover={reduceMotion ? undefined : { y: -7, scale: 1.01 }} transition={{ duration: 0.24, ease: 'easeOut' }}>
      <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:border-primary/35 hover:shadow-[0_24px_80px_hsl(var(--primary)/0.18)]">
        <div className="relative aspect-[16/10] overflow-hidden border-b border-border/70 bg-secondary/60">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <ProjectImagePlaceholder title={project.title} />
          )}

          <div className="absolute left-4 top-4">
            <Badge
              className={cn(
                'gap-1 bg-background/86 text-foreground backdrop-blur',
                project.isFeatured && 'border-primary/40 bg-primary/15 text-primary',
              )}
              variant={project.isFeatured ? 'default' : 'outline'}
            >
              {project.isFeatured ? <Star className="h-3.5 w-3.5" /> : null}
              {project.isFeatured ? 'Featured' : 'Project'}
            </Badge>
          </div>
        </div>

        <CardHeader>
          <CardTitle className="leading-tight">{project.title}</CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">{project.summary}</p>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-5">
          <div className="flex flex-wrap gap-2">
            {project.techStacks.map((tech) => (
              <Badge key={tech.id} variant="outline">
                {tech.name}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap">
          <Button asChild size="sm">
            <Link href={`/projects/${project.slug}`}>
              View Case Study
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>

          {project.githubUrl ? (
            <Button asChild size="sm" variant="outline">
              <Link href={project.githubUrl} target="_blank">
                <Github className="h-4 w-4" />
                GitHub
              </Link>
            </Button>
          ) : null}

          {project.demoUrl ? (
            <Button asChild size="sm" variant="ghost">
              <Link href={project.demoUrl} target="_blank">
                <MonitorUp className="h-4 w-4" />
                Demo
              </Link>
            </Button>
          ) : null}
        </CardFooter>
      </Card>
    </motion.article>
  );
}

function ProjectImagePlaceholder({ title }: { title: string }) {
  const initials = title
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_35%_25%,hsl(var(--primary)/0.24),transparent_34%),linear-gradient(135deg,hsl(var(--secondary)),hsl(var(--card)))] transition-transform duration-500 ease-out group-hover:scale-105">
      <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-primary/30 bg-background/70 text-2xl font-semibold text-primary shadow-[0_0_42px_hsl(var(--primary)/0.18)] backdrop-blur">
        {initials || 'HH'}
      </div>
    </div>
  );
}
