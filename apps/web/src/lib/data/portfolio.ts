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

export const mockProfile: ProfileData = {
  fullName: "Hari Handika Setiawan",
  headline:
    "Full Stack Developer focused on Backend, System Integration, and Scalable Web Applications",
  bio: "I build clean, maintainable, and business-oriented applications with a strong focus on backend architecture, ERP-style business processes, API integration, database design, and full stack delivery.",
  email: "hari.handika@example.com",
  location: "Indonesia / Remote",
  githubUrl: "https://github.com/harihandika",
  linkedinUrl: "https://www.linkedin.com/in/harihandika",
  cvUrl: "/assets/CV Hari_Handika_Setiawan.pdf",
};

export const mockSkills: SkillCategoryData[] = [
  {
    category: "Backend",
    skills: [
      {
        id: "backend-nestjs",
        name: "NestJS",
        category: "Backend",
        level: "ADVANCED",
        order: 1,
      },
      {
        id: "backend-rest-api",
        name: "REST API Design",
        category: "Backend",
        level: "ADVANCED",
        order: 2,
      },
      {
        id: "backend-jwt",
        name: "JWT Authentication",
        category: "Backend",
        level: "ADVANCED",
        order: 3,
      },
    ],
  },
  {
    category: "Frontend",
    skills: [
      {
        id: "frontend-nextjs",
        name: "Next.js",
        category: "Frontend",
        level: "ADVANCED",
        order: 1,
      },
      {
        id: "frontend-react",
        name: "React",
        category: "Frontend",
        level: "ADVANCED",
        order: 2,
      },
      {
        id: "frontend-tailwind",
        name: "Tailwind CSS",
        category: "Frontend",
        level: "ADVANCED",
        order: 3,
      },
    ],
  },
  {
    category: "Database",
    skills: [
      {
        id: "database-postgresql",
        name: "PostgreSQL",
        category: "Database",
        level: "ADVANCED",
        order: 1,
      },
      {
        id: "database-prisma",
        name: "Prisma ORM",
        category: "Database",
        level: "ADVANCED",
        order: 2,
      },
      {
        id: "database-schema",
        name: "Schema Design",
        category: "Database",
        level: "ADVANCED",
        order: 3,
      },
    ],
  },
  {
    category: "DevOps",
    skills: [
      {
        id: "devops-vercel",
        name: "Vercel",
        category: "DevOps",
        level: "INTERMEDIATE",
        order: 1,
      },
      {
        id: "devops-railway",
        name: "Railway",
        category: "DevOps",
        level: "INTERMEDIATE",
        order: 2,
      },
      {
        id: "devops-docker",
        name: "Docker",
        category: "DevOps",
        level: "INTERMEDIATE",
        order: 3,
      },
    ],
  },
  {
    category: "Integration",
    skills: [
      {
        id: "integration-api",
        name: "API Integration",
        category: "Integration",
        level: "ADVANCED",
        order: 1,
      },
      {
        id: "integration-erp-sync",
        name: "ERP Sync Flow",
        category: "Integration",
        level: "INTERMEDIATE",
        order: 2,
      },
      {
        id: "integration-workflow",
        name: "Workflow Automation",
        category: "Integration",
        level: "INTERMEDIATE",
        order: 3,
      },
    ],
  },
  {
    category: "Business Domain",
    skills: [
      {
        id: "domain-procurement",
        name: "Procurement Flow",
        category: "Business Domain",
        level: "INTERMEDIATE",
        order: 1,
      },
      {
        id: "domain-approval",
        name: "Approval Process",
        category: "Business Domain",
        level: "INTERMEDIATE",
        order: 2,
      },
      {
        id: "domain-reporting",
        name: "Operational Reporting",
        category: "Business Domain",
        level: "INTERMEDIATE",
        order: 3,
      },
    ],
  },
];

export const mockExperiences: ExperienceData[] = [
  {
    id: "exp-full-stack-portfolio",
    company: "Freelance / Portfolio Projects",
    role: "Full Stack Developer",
    location: "Remote",
    startDate: "2024-01-01",
    endDate: null,
    isCurrent: true,
    description:
      "Building portfolio-grade full stack applications with backend-first architecture, admin workflows, and deployment-ready project structure.",
    achievements: [
      "Created modular NestJS APIs with Prisma, PostgreSQL, JWT authentication, and validation.",
      "Designed Next.js interfaces with reusable design systems and responsive layouts.",
      "Modeled business workflows such as portfolio content management and procurement-style processes.",
    ],
    order: 1,
  },
  {
    id: "exp-business-app",
    company: "Internal Business Application Project",
    role: "Backend and Web Application Developer",
    location: "Indonesia",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    isCurrent: false,
    description:
      "Maintained operational web application flows for material requests, delivery schedule data, and reporting needs.",
    achievements: [
      "Improved create-order flows and editable business fields.",
      "Added date-only delivery schedule support across UI, DTO, entity, service, and reporting layers.",
      "Resolved navigation and modal-state issues in shared operational flows.",
    ],
    order: 2,
  },
];

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
  const [profile, skills, experiences] = await Promise.all([
    fetchFromApi<ProfileData>("/profile"),
    fetchFromApi<SkillCategoryData[]>("/skills"),
    fetchFromApi<ExperienceData[]>("/experiences"),
  ]);

  return {
    profile: profile ?? mockProfile,
    skills: skills?.length ? skills : mockSkills,
    experiences: experiences?.length ? experiences : mockExperiences,
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
    year: "numeric",
  }).format(date);
}
