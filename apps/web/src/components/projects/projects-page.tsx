"use client";

import { useReducedMotion } from "@/lib/use-reduced-motion";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Github,
  MonitorUp,
  RotateCw,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { LoadingState } from "@/components/states/loading-state";
import { Button } from "@/components/ui/button";
import { ProjectArtwork } from "./project-artwork";
import { fetchProjects, type ProjectData } from "@/lib/data/projects";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ProjectStatus = "loading" | "success" | "error";
const PROJECTS_FETCH_TIMEOUT_MS = 6000;

export function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [status, setStatus] = useState<ProjectStatus>("loading");
  const [reloadKey, setReloadKey] = useState(0);
  const [filter, setFilter] = useState("All work");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;
    const timeout = setTimeout(
      () => controller.abort(),
      PROJECTS_FETCH_TIMEOUT_MS,
    );
    async function loadProjects() {
      setStatus("loading");
      try {
        const response = await fetchProjects(controller.signal);
        if (isActive) {
          setProjects(response);
          setStatus("success");
        }
      } catch {
        if (isActive) setStatus("error");
      } finally {
        clearTimeout(timeout);
      }
    }
    void loadProjects();
    return () => {
      isActive = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [reloadKey]);

  const categories = [
    "All work",
    "Featured",
    ...Array.from(
      new Set(
        projects.flatMap((project) =>
          project.techStacks.map((tech) => tech.category),
        ),
      ),
    )
      .filter(Boolean)
      .slice(0, 4),
  ];
  const visibleProjects = projects.filter(
    (project) =>
      filter === "All work" ||
      (filter === "Featured"
        ? project.isFeatured
        : project.techStacks.some((tech) => tech.category === filter)),
  );

  return (
    <section className="relative min-h-[calc(100vh-4rem)] py-20 sm:py-28">
      <Container>
        <div className="flex flex-col justify-between gap-8 border-b border-border pb-12 lg:flex-row lg:items-end">
          <div>
            <p className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-primary">
              <span className="h-px w-8 bg-primary" />
              Selected work
            </p>
            <h1 className="text-5xl font-medium leading-[1.05] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
              Ideas into
              <br />
              <span className="text-muted-foreground">real systems.</span>
            </h1>
          </div>
          <p className="max-w-sm text-base leading-7 text-muted-foreground">
            A closer look at the applications, integrations, and thoughtful
            engineering behind my work.
          </p>
        </div>

        {status === "success" ? (
          <div className="mb-10 mt-8 flex flex-wrap items-center justify-between gap-5">
            <div className="flex flex-wrap gap-2" aria-label="Filter projects">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  aria-pressed={filter === category}
                  onClick={() => setFilter(category)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
                    filter === category
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              {String(visibleProjects.length).padStart(2, "0")} projects
            </p>
          </div>
        ) : null}

        <div className="mt-10">
          {status === "loading" ? (
            <LoadingState
              title="Loading projects"
              description="Good work is worth a moment. Your projects are on their way."
            />
          ) : null}
          {status === "error" ? (
            <ErrorState
              title="Projects could not be loaded"
              description="Please try again in a moment."
              action={
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setReloadKey((key) => key + 1)}
                >
                  <RotateCw className="h-4 w-4" />
                  Retry
                </Button>
              }
            />
          ) : null}
          {status === "success" && visibleProjects.length === 0 ? (
            <EmptyState
              title={
                projects.length
                  ? "No projects in this collection yet"
                  : "New work is on its way"
              }
              description="Explore another collection or check back for the latest projects."
            />
          ) : null}
          {status === "success" && visibleProjects.length > 0 ? (
            <motion.div
              key={filter}
              variants={staggerContainer}
              initial={reduceMotion ? false : "hidden"}
              animate="visible"
              className="grid gap-x-8 gap-y-14 md:grid-cols-2"
            >
              {visibleProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  reduceMotion={reduceMotion}
                />
              ))}
            </motion.div>
          ) : null}
        </div>

        <div className="mt-20 flex flex-col justify-between gap-5 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="text-xl tracking-tight text-muted-foreground">
            Have something in mind?
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 text-sm font-medium text-primary"
          >
            Let’s build it together
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </section>
  );
}

function ProjectCard({
  project,
  index,
  reduceMotion,
}: {
  project: ProjectData;
  index: number;
  reduceMotion: boolean | null;
}) {
  return (
    <motion.article
      variants={fadeUp}
      className="group"
      whileHover={reduceMotion ? undefined : { y: -4 }}
    >
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`View ${project.title} case study`}
        className="relative block overflow-hidden rounded-2xl border border-border bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <div className="aspect-[16/10]">
          <ProjectArtwork project={project} index={index} />
        </div>
        {project.isFeatured ? (
          <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-background/80 px-3 py-1.5 text-[10px] font-medium backdrop-blur">
            <Sparkles className="h-3 w-3 text-primary" />
            Featured
          </span>
        ) : null}
        <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-background/70 text-foreground transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </Link>
      <div className="mt-6 flex gap-4">
        <span className="pt-1 font-mono text-xs text-primary/70">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-medium tracking-tight sm:text-2xl">
            <Link
              href={`/projects/${project.slug}`}
              className="transition-colors hover:text-primary"
            >
              {project.title}
            </Link>
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
            {project.summary}
          </p>
          <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2">
            {project.techStacks.slice(0, 5).map((tech) => (
              <span
                key={tech.id}
                className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
              >
                {tech.name}
              </span>
            ))}
          </div>
          <div className="mt-5 flex gap-5">
            {project.githubUrl ? (
              <Link
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <Github className="h-3.5 w-3.5" />
                Source
              </Link>
            ) : null}
            {project.demoUrl ? (
              <Link
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <MonitorUp className="h-3.5 w-3.5" />
                Live demo
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
