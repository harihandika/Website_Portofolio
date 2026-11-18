export type ProfileData = {
  fullName: string;
  headline: string;
  bio: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  cvUrl?: string | null;
  photoUrl?: string | null;
};

export type SkillData = {
  id: string;
  name: string;
  category: string;
  level: string;
  order: number;
};

export type SkillCategoryData = {
  category: string;
  skills: SkillData[];
};

export type ExperienceData = {
  id: string;
  company: string;
  role: string;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  description: string;
  achievements: string[];
  order: number;
};

export type PortfolioData = {
  profile: ProfileData;
  skills: SkillCategoryData[];
  experiences: ExperienceData[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const API_TIMEOUT_MS = 2500;

import { cvExperiences, cvProfile, cvSkills } from "./cv";

async function fetchFromApi<T>(path: string): Promise<T | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getPortfolioData(): Promise<PortfolioData> {
  if (process.env.NEXT_PUBLIC_PORTFOLIO_SOURCE !== "api") {
    return { profile: cvProfile, skills: cvSkills, experiences: cvExperiences };
  }
  const [profile, skills, experiences] = await Promise.all([
    fetchFromApi<ProfileData>("/profile"),
    fetchFromApi<SkillCategoryData[]>("/skills"),
    fetchFromApi<ExperienceData[]>("/experiences"),
  ]);

  return {
    profile: profile ?? cvProfile,
    skills: skills?.length ? skills : cvSkills,
    experiences: experiences?.length ? experiences : cvExperiences,
  };
}

export function formatExperiencePeriod(experience: ExperienceData): string {
  const start = formatMonthYear(experience.startDate);
  const end = experience.isCurrent
    ? "Present"
    : experience.endDate
      ? formatMonthYear(experience.endDate)
      : "Present";

  return `${start} - ${end}`;
}

function formatMonthYear(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(date);
}
