"use client";

import { useReducedMotion } from "@/lib/use-reduced-motion";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Code2,
  Github,
  Layers3,
  MonitorUp,
  Network,
  RotateCw,
  Star,
  Target,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { ErrorState } from "@/components/states/error-state";
import { LoadingState } from "@/components/states/loading-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectArtwork } from "./project-artwork";
import { fetchProjectBySlug, type ProjectData } from "@/lib/data/projects";
import { fadeUp, pageTransition, staggerContainer } from "@/lib/motion";

type ProjectDetailStatus = "loading" | "success" | "error";
const PROJECT_DETAIL_FETCH_TIMEOUT_MS = 6000;

export function ProjectCaseStudyPage({ slug }: { slug: string }) {
  const reduceMotion = useReducedMotion();
  const [project, setProject] = useState<ProjectData | null>(null);
  const [status, setStatus] = useState<ProjectDetailStatus>("loading");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;
    const timeout = setTimeout(
      () => controller.abort(),
      PROJECT_DETAIL_FETCH_TIMEOUT_MS,
    );

    async function loadProject() {
      setStatus("loading");

      try {
        const response = await fetchProjectBySlug(slug, controller.signal);
        if (!isActive) {
          return;
        }

        setProject(response);
        setStatus("success");
      } catch {
        if (!isActive) {
          return;
        }

        setStatus("error");
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
    <motion.section
      variants={pageTransition}
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
      className="relative min-h-[calc(100vh-4rem)] py-16 sm:py-24"
    >
      <Container>
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </Button>

        {status === "loading" ? (
          <LoadingState
            title="Loading case study"
            description="Taking a closer look at the work."
          />
        ) : null}

        {status === "error" ? (
          <ErrorState
            title="Case study could not be loaded"
            description="This project is currently unavailable. Please try again or explore the other projects."
            action={
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setReloadKey((key) => key + 1)}
                >
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

        {status === "success" && project ? (
          <CaseStudyContent project={project} />
        ) : null}
      </Container>
    </motion.section>
  );
}

function CaseStudyContent({ project }: { project: ProjectData }) {
  const reduceMotion = useReducedMotion();
  const architecturePoints = useMemo(
    () => buildArchitecturePoints(project),
    [project],
  );

  return (
    <motion.div
      variants={staggerContainer}
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
    >
      <motion.header
        variants={fadeUp}
        className="grid gap-10 border-b border-border pb-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
      >
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            {project.isFeatured ? (
              <Badge className="gap-1 border-primary/40 bg-primary/15 text-primary">
                <Star className="h-3.5 w-3.5" />
                Featured Case Study
              </Badge>
            ) : null}
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Engineering case study
            </span>
          </div>
          <h1 className="text-balance text-4xl font-medium leading-[1.08] tracking-[-0.05em] text-foreground sm:text-6xl">
            {project.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            {project.summary}
          </p>
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

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,0.7fr)_minmax(260px,0.3fr)]">
        <motion.div variants={staggerContainer} className="space-y-6">
          <CaseStudySection title="01 / The overview" icon={Layers3}>
            <p>{project.description}</p>
          </CaseStudySection>

          <CaseStudySection title="02 / The challenge" icon={Target}>
            <p>{project.problem}</p>
          </CaseStudySection>

          <CaseStudySection title="03 / The approach" icon={Code2}>
            <p>{project.solution}</p>
          </CaseStudySection>

          <CaseStudySection title="04 / Built with" icon={Network}>
            <div className="grid gap-4 md:grid-cols-3">
              {architecturePoints.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border/70 bg-secondary/20 p-4"
                >
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </CaseStudySection>

          <CaseStudySection title="05 / The outcome" icon={Star}>
            <p className="text-lg leading-8 text-foreground">
              {project.impact}
            </p>
          </CaseStudySection>
        </motion.div>

        <motion.aside
          variants={fadeUp}
          className="space-y-6 lg:sticky lg:top-24 lg:self-start"
        >
          <Card>
            <CardContent className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Tech Stack
              </p>
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
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                Project at a glance
              </p>
              <ReviewItem label="Project" value={project.title} />
              <ReviewItem
                label="Focus"
                value={
                  Array.from(
                    new Set(
                      project.techStacks.map(
                        (technology) => technology.category,
                      ),
                    ),
                  )
                    .filter(Boolean)
                    .join(" · ") || "Software engineering"
                }
              />
              <ReviewItem
                label="Stack"
                value={`${project.techStacks.length} technologies`}
              />
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
                  <Link
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
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
      <div className="border-b border-border pb-9">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-medium tracking-tight text-foreground">
              {title}
            </h2>
          </div>
          <div className="text-sm leading-7 text-muted-foreground sm:text-base">
            {children}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function ProjectHeroImage({ project }: { project: ProjectData }) {
  return (
    <div className="group aspect-[16/11] overflow-hidden rounded-2xl border border-border bg-card">
      <ProjectArtwork project={project} />
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-secondary/20 p-4">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{value}</p>
    </div>
  );
}

function buildArchitecturePoints(project: ProjectData) {
  const categories = Array.from(
    new Set(project.techStacks.map((technology) => technology.category)),
  ).filter(Boolean);
  return categories.map((category) => ({
    title: category,
    description: project.techStacks
      .filter((technology) => technology.category === category)
      .map((technology) => technology.name)
      .join(" · "),
  }));
}
