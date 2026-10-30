"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  Braces,
  Database,
  GitBranch,
  Layers3,
} from "lucide-react";
import type { ProjectData } from "@/lib/data/projects";

export function ProjectArtwork({
  project,
  index = 0,
}: {
  project: ProjectData;
  index?: number;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  if (project.imageUrl && !imageFailed) {
    return (
      <img
        src={project.imageUrl}
        alt={`${project.title} project`}
        onError={() => setImageFailed(true)}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    );
  }

  const Icon = [GitBranch, Layers3, Braces, Database][index % 4];
  const technologies = project.techStacks.slice(0, 3);

  return (
    <div
      className="relative flex h-full min-h-56 w-full items-center justify-center overflow-hidden bg-[#0b1419] px-7 py-12"
      aria-hidden="true"
    >
      <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(#4b6b73_1px,transparent_1px)] [background-size:20px_20px]" />
      <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-primary/10" />
      <div className="absolute -right-8 -top-12 h-48 w-48 rounded-full border border-primary/10" />
      <div className="relative w-full max-w-sm rounded-xl border border-white/10 bg-[#101b22] p-5 shadow-[0_24px_70px_#0006] transition-transform duration-500 group-hover:-translate-y-1">
        <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">
              System architecture
            </span>
          </div>
          <ArrowUpRight className="h-3 w-3 text-white/30" />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
            <Icon className="h-6 w-6" strokeWidth={1.4} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-white/90">
              {project.title}
            </p>
            <p className="mt-1 font-mono text-[10px] text-white/35">
              {project.slug}
            </p>
          </div>
        </div>
        <div className="mx-auto h-6 w-px bg-primary/30" />
        <div className="mx-auto mb-3 h-px w-[70%] bg-primary/30" />
        <div className="grid grid-cols-3 gap-2">
          {(technologies.length
            ? technologies
            : [{ id: "application", name: "Application" }]
          ).map((technology) => (
            <div
              key={technology.id}
              className="rounded-lg border border-white/10 bg-white/[0.025] px-2 py-3 text-center text-[10px] text-white/55"
            >
              {technology.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
