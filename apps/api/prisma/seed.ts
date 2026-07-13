import { ContactMessageStatus, PrismaClient, SkillLevel } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

const adminEmail = process.env.ADMIN_EMAIL ?? "admin@harihandika.dev";
const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";

async function main() {
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: "Hari Handika Setiawan",
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      name: "Hari Handika Setiawan",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  await prisma.profile.upsert({
    where: { email: "hari.handika@example.com" },
    update: {
      fullName: "Hari Handika Setiawan",
      headline:
        "Full Stack Developer | Backend Engineer | Cloud-Native Backend Engineer",
      bio: "Full stack developer focused on building reliable backend systems, clean web applications, API integrations, and business-oriented digital products.",
      phone: "+62 812-0000-0000",
      location: "Indonesia",
      githubUrl: "https://github.com/harihandika",
      linkedinUrl: "https://www.linkedin.com/in/harihandika",
      cvUrl: "/assets/CV Hari_Handika_Setiawan.pdf",
      photoUrl: "https://harihandika.dev/images/profile.jpg",
    },
    create: {
      fullName: "Hari Handika Setiawan",
      headline:
        "Full Stack Developer | Backend Engineer | Cloud-Native Backend Engineer",
      bio: "Full stack developer focused on building reliable backend systems, clean web applications, API integrations, and business-oriented digital products.",
      email: "hari.handika@example.com",
      phone: "+62 812-0000-0000",
      location: "Indonesia",
      githubUrl: "https://github.com/harihandika",
      linkedinUrl: "https://www.linkedin.com/in/harihandika",
      cvUrl: "/assets/CV Hari_Handika_Setiawan.pdf",
      photoUrl: "https://harihandika.dev/images/profile.jpg",
    },
  });

  const techStacks = [
    { name: "Next.js", category: "Frontend", displayOrder: 1 },
    { name: "React", category: "Frontend", displayOrder: 2 },
    { name: "TypeScript", category: "Language", displayOrder: 3 },
    { name: "Tailwind CSS", category: "Frontend", displayOrder: 4 },
    { name: "NestJS", category: "Backend", displayOrder: 5 },
    { name: "Prisma ORM", category: "Backend", displayOrder: 6 },
    { name: "PostgreSQL", category: "Database", displayOrder: 7 },
    { name: "JWT", category: "Security", displayOrder: 8 },
    { name: "Docker", category: "DevOps", displayOrder: 9 },
    { name: "Railway", category: "Deployment", displayOrder: 10 },
  ];

  for (const tech of techStacks) {
    await prisma.techStack.upsert({
      where: { name: tech.name },
      update: tech,
      create: tech,
    });
  }

  const projects = [
    {
      title: "ProcureFlow ERP",
      slug: "procureflow-erp",
      summary:
        "Procurement workflow platform with approvals, budget control, receiving, and ERP integration simulation.",
      description:
        "A portfolio-grade ERP procurement system designed to demonstrate backend architecture, role-based access, workflow modeling, and operational dashboards.",
      problem:
        "Manual procurement requests often lack approval traceability, budget visibility, and a consistent flow between request, purchase order, receiving, and ERP sync.",
      solution:
        "Built modular backend services and a structured UI for purchase requests, approvals, budget checks, receiving records, and integration events.",
      impact:
        "Shows practical experience in designing enterprise workflows, normalized data models, API contracts, and maintainable full stack architecture.",
      imageUrl: "https://harihandika.dev/images/projects/procureflow.jpg",
      demoUrl: "https://procureflow-demo.vercel.app",
      githubUrl: "https://github.com/harihandika/procureflow-erp",
      isFeatured: true,
      displayOrder: 1,
      stacks: [
        "Next.js",
        "NestJS",
        "TypeScript",
        "Prisma ORM",
        "PostgreSQL",
        "JWT",
      ],
    },
    {
      title: "Transfer Request Portal",
      slug: "transfer-request-portal",
      summary:
        "Internal transfer request application for material order tracking and interplant delivery scheduling.",
      description:
        "A business application for managing material transfer requests, order data, delivery schedules, and reporting workflows.",
      problem:
        "Operational teams needed a clearer way to create, track, and export transfer request data while reducing manual spreadsheet handling.",
      solution:
        "Implemented structured create-order flows, editable business fields, date-only delivery schedules, and reporting data preparation.",
      impact:
        "Improved clarity of transfer request records and demonstrates experience maintaining real business workflows.",
      imageUrl: "https://harihandika.dev/images/projects/transfer-request.jpg",
      demoUrl: null,
      githubUrl: null,
      isFeatured: true,
      displayOrder: 2,
      stacks: ["TypeScript", "PostgreSQL"],
    },
    {
      title: "Hari Handika Setiawan Portfolio",
      slug: "hari-handika-portfolio",
      summary:
        "Interactive CV, project showcase, and admin-managed personal branding website.",
      description:
        "A modern portfolio application with dynamic profile, skills, experience, projects, case studies, contact messages, and protected admin content management.",
      problem:
        "A static CV does not show enough technical depth, project context, or product thinking for recruiter and technical interview review.",
      solution:
        "Designed a full stack portfolio with a SaaS-style public site, case study pages, PostgreSQL-backed content, and JWT-protected admin management.",
      impact:
        "Creates a stronger job application asset and demonstrates end-to-end product delivery across frontend, backend, database, auth, and deployment.",
      imageUrl: "https://harihandika.dev/images/projects/portfolio.jpg",
      demoUrl: "https://harihandika.dev",
      githubUrl: "https://github.com/harihandika/portfolio",
      isFeatured: true,
      displayOrder: 3,
      stacks: [
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "NestJS",
        "Prisma ORM",
        "PostgreSQL",
        "Railway",
      ],
    },
  ];

  for (const projectSeed of projects) {
    const { stacks, ...projectData } = projectSeed;

    const project = await prisma.project.upsert({
      where: { slug: projectData.slug },
      update: projectData,
      create: projectData,
    });

    await prisma.projectTechStack.deleteMany({
      where: { projectId: project.id },
    });

    for (const stackName of stacks) {
      const techStack = await prisma.techStack.findUniqueOrThrow({
        where: { name: stackName },
      });

      await prisma.projectTechStack.create({
        data: {
          projectId: project.id,
          techStackId: techStack.id,
        },
      });
    }
  }

  const skills = [
    {
      name: "Next.js",
      category: "Frontend",
      level: SkillLevel.ADVANCED,
      displayOrder: 1,
    },
    {
      name: "React",
      category: "Frontend",
      level: SkillLevel.ADVANCED,
      displayOrder: 2,
    },
    {
      name: "Tailwind CSS",
      category: "Frontend",
      level: SkillLevel.ADVANCED,
      displayOrder: 3,
    },
    {
      name: "Framer Motion",
      category: "Frontend",
      level: SkillLevel.INTERMEDIATE,
      displayOrder: 4,
    },
    {
      name: "NestJS",
      category: "Backend",
      level: SkillLevel.ADVANCED,
      displayOrder: 1,
    },
    {
      name: "REST API Design",
      category: "Backend",
      level: SkillLevel.ADVANCED,
      displayOrder: 2,
    },
    {
      name: "JWT Authentication",
      category: "Backend",
      level: SkillLevel.ADVANCED,
      displayOrder: 3,
    },
    {
      name: "Prisma ORM",
      category: "Database",
      level: SkillLevel.ADVANCED,
      displayOrder: 1,
    },
    {
      name: "PostgreSQL",
      category: "Database",
      level: SkillLevel.ADVANCED,
      displayOrder: 2,
    },
    {
      name: "Schema Design",
      category: "Database",
      level: SkillLevel.ADVANCED,
      displayOrder: 3,
    },
    {
      name: "Docker",
      category: "Cloud & DevOps",
      level: SkillLevel.INTERMEDIATE,
      displayOrder: 1,
    },
    {
      name: "Railway",
      category: "Cloud & DevOps",
      level: SkillLevel.INTERMEDIATE,
      displayOrder: 2,
    },
    {
      name: "Vercel",
      category: "Cloud & DevOps",
      level: SkillLevel.INTERMEDIATE,
      displayOrder: 3,
    },
    {
      name: "API Integration",
      category: "Integration",
      level: SkillLevel.ADVANCED,
      displayOrder: 1,
    },
    {
      name: "ERP Workflow Modeling",
      category: "Integration",
      level: SkillLevel.INTERMEDIATE,
      displayOrder: 2,
    },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: {
        name_category: {
          name: skill.name,
          category: skill.category,
        },
      },
      update: skill,
      create: skill,
    });
  }

  const experiences = [
    {
      company: "Freelance / Portfolio Projects",
      role: "Full Stack Developer",
      location: "Remote",
      startDate: new Date("2024-01-01"),
      endDate: null,
      isCurrent: true,
      description:
        "Designing and building full stack business applications, portfolio systems, API integrations, and backend-focused case studies.",
      achievements: [
        "Built portfolio-grade applications using Next.js, NestJS, Prisma, and PostgreSQL.",
        "Designed normalized database schemas for admin-managed content and business workflows.",
        "Implemented JWT-based admin authentication and backend service structure.",
      ],
      displayOrder: 1,
    },
    {
      company: "Internal Business Application Project",
      role: "Backend and Web Application Developer",
      location: "Indonesia",
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-12-31"),
      isCurrent: false,
      description:
        "Maintained operational web application flows for material transfer requests, delivery schedule data, and reporting needs.",
      achievements: [
        "Improved create-order data flow and user-editable business fields.",
        "Added date-only delivery schedule support across UI, DTO, entity, service, and reporting layers.",
        "Resolved modal and navigation state issues in shared user flows.",
      ],
      displayOrder: 2,
    },
  ];

  for (const experience of experiences) {
    await prisma.experience.upsert({
      where: {
        company_role_startDate: {
          company: experience.company,
          role: experience.role,
          startDate: experience.startDate,
        },
      },
      update: experience,
      create: experience,
    });
  }

  const contactMessages = [
    {
      name: "Dewi Anggraini",
      email: "dewi.recruiter@example.com",
      subject: "Backend Engineer Opportunity",
      message:
        "Halo Hari, kami melihat portfolio Anda dan tertarik untuk berdiskusi mengenai posisi Backend Engineer yang fokus pada NestJS, PostgreSQL, dan integrasi API.",
      status: ContactMessageStatus.NEW,
    },
    {
      name: "Rizky Pratama",
      email: "rizky.techlead@example.com",
      subject: "Technical Interview Review",
      message:
        "Saya ingin mereview case study project ProcureFlow ERP Anda, terutama bagian database design, workflow approval, dan struktur backend service.",
      status: ContactMessageStatus.READ,
    },
    {
      name: "Maya Putri",
      email: "maya.client@example.com",
      subject: "Freelance Web Application",
      message:
        "Kami membutuhkan aplikasi internal untuk tracking request, approval, dan reporting. Apakah Anda tersedia untuk diskusi kebutuhan project freelance?",
      status: ContactMessageStatus.NEW,
    },
  ];

  await prisma.contactMessage.deleteMany({
    where: {
      email: {
        in: contactMessages.map((message) => message.email),
      },
    },
  });

  await prisma.contactMessage.createMany({
    data: contactMessages,
  });

  console.log("Seed completed.");
  console.log(`Admin email: ${adminEmail}`);
  console.log(`Admin password: ${adminPassword}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
