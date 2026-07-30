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
    { name: ".NET Core", category: "Backend", displayOrder: 11 },
    { name: "Microsoft SQL Server", category: "Database", displayOrder: 12 },
    { name: "ExpressJS", category: "Backend", displayOrder: 13 },
    { name: "MongoDB", category: "Database", displayOrder: 14 },
    { name: "Material UI", category: "Frontend", displayOrder: 15 },
    { name: "Redux", category: "Frontend", displayOrder: 16 },
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
      title: "ProcureFlow ERP (Purchase App)",
      slug: "procureflow-erp",
      summary: "ERP-integrated procurement system with requisition, approval, and warehouse modules.",
      description:
        "Developed a comprehensive Purchase application for material and non-material goods integrated with the company ERP.",
      problem:
        "Required robust master data management, multi-level approvals, budget control, and field device integration for logistics.",
      solution:
        "Implemented master data modules, packaging conversion logic, automated ERP synchronization, and field hardware integrations.",
      impact:
        "Streamlined the procurement process from requisition to receiving, ensuring precise stock accuracy and budget adherence.",
      imageUrl: "https://harihandika.dev/images/projects/procureflow.jpg",
      demoUrl: "https://procureflow-demo.vercel.app",
      githubUrl: "https://github.com/harihandika/procureflow-erp",
      isFeatured: true,
      displayOrder: 1,
      stacks: ["Next.js", "NestJS", "TypeScript", "Prisma ORM", "PostgreSQL", "Docker"],
    },
    {
      title: "Individual Performance (I-Perform)",
      slug: "individual-performance",
      summary: "KPI tracking and performance evaluation system with employee promotion logic.",
      description:
        "Built an internal HR system at PT Acset Indonusa to manage employee KPIs, calculate performance scores, and run background jobs for ranks.",
      problem:
        "Manual performance evaluation processes lacked automation and real-time tracking.",
      solution:
        "Developed a robust KPI calculation engine with promotion logic and scheduled background tasks using .NET Core.",
      impact:
        "Automated the performance tracking cycle, increasing transparency and efficiency for HR and employees.",
      imageUrl: "https://harihandika.dev/images/projects/i-perform.jpg",
      demoUrl: null,
      githubUrl: null,
      isFeatured: true,
      displayOrder: 2,
      stacks: [".NET Core", "Microsoft SQL Server"],
    },
    {
      title: "Electronic Documentation (E-Doc)",
      slug: "electronic-documentation",
      summary: "Internal document management system with project/location-based folder access.",
      description:
        "Developed a secure document management platform at PT Acset Indonusa supporting permissions, hard-copy tracking, and transfer workflows.",
      problem:
        "Document tracking across multiple projects and locations was fragmented and lacked strict permission controls.",
      solution:
        "Implemented location-based access, document viewing/downloading workflows, and a physical hard-copy tracking mechanism.",
      impact:
        "Improved document security and tracking accuracy across all operational projects.",
      imageUrl: "https://harihandika.dev/images/projects/e-doc.jpg",
      demoUrl: null,
      githubUrl: null,
      isFeatured: true,
      displayOrder: 3,
      stacks: ["React", "Material UI", "Redux", "ExpressJS", "Microsoft SQL Server"],
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
      displayOrder: 4,
      stacks: ["Next.js", "React", "TypeScript", "Tailwind CSS", "NestJS", "Prisma ORM", "PostgreSQL", "Railway"],
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
    { name: "Next.js", category: "Frontend", level: SkillLevel.ADVANCED, displayOrder: 1 },
    { name: "React", category: "Frontend", level: SkillLevel.ADVANCED, displayOrder: 2 },
    { name: "Tailwind CSS", category: "Frontend", level: SkillLevel.ADVANCED, displayOrder: 3 },
    { name: "Framer Motion", category: "Frontend", level: SkillLevel.INTERMEDIATE, displayOrder: 4 },
    { name: "NestJS", category: "Backend", level: SkillLevel.ADVANCED, displayOrder: 1 },
    { name: "REST API Design", category: "Backend", level: SkillLevel.ADVANCED, displayOrder: 2 },
    { name: "JWT Authentication", category: "Backend", level: SkillLevel.ADVANCED, displayOrder: 3 },
    { name: "Prisma ORM", category: "Database", level: SkillLevel.ADVANCED, displayOrder: 1 },
    { name: "PostgreSQL", category: "Database", level: SkillLevel.ADVANCED, displayOrder: 2 },
    { name: "Schema Design", category: "Database", level: SkillLevel.ADVANCED, displayOrder: 3 },
    { name: "Docker", category: "Cloud & DevOps", level: SkillLevel.INTERMEDIATE, displayOrder: 1 },
    { name: "Railway", category: "Cloud & DevOps", level: SkillLevel.INTERMEDIATE, displayOrder: 2 },
    { name: "Vercel", category: "Cloud & DevOps", level: SkillLevel.INTERMEDIATE, displayOrder: 3 },
    { name: "Monorepo Management", category: "Cloud & DevOps", level: SkillLevel.INTERMEDIATE, displayOrder: 4 },
    { name: "CI/CD Pipelines", category: "Cloud & DevOps", level: SkillLevel.INTERMEDIATE, displayOrder: 5 },
    { name: "API Integration", category: "Integration", level: SkillLevel.ADVANCED, displayOrder: 1 },
    { name: "ERP Workflow Modeling", category: "Integration", level: SkillLevel.INTERMEDIATE, displayOrder: 2 },
    { name: "ERP System Architecture", category: "Enterprise Development", level: SkillLevel.INTERMEDIATE, displayOrder: 1 },
    { name: "B2B Workflow Modeling", category: "Enterprise Development", level: SkillLevel.INTERMEDIATE, displayOrder: 2 },
    { name: "Complex State Management", category: "Enterprise Development", level: SkillLevel.ADVANCED, displayOrder: 3 },
    { name: "AI Integration", category: "AI & Data", level: SkillLevel.INTERMEDIATE, displayOrder: 1 },
    { name: "Data Visualization", category: "AI & Data", level: SkillLevel.INTERMEDIATE, displayOrder: 2 },
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
      company: "PT FTS Automotive Indonesia",
      role: "Software Engineer - Purchase",
      location: "Indonesia",
      startDate: new Date("2025-07-01"),
      endDate: null,
      isCurrent: true,
      description:
        "Develop and maintain a Purchase application for material and non-material goods integrated with company ERP.",
      achievements: [
        "Implemented master data modules with validation, versioning, and audit trails.",
        "Built multi-level role-based approval workflows for requisitions and POs.",
        "Developed budget management and cost-center setup with overspend alerts.",
        "Integrated field devices (barcode scanners, cameras) for receiving and picking.",
      ],
      displayOrder: 1,
    },
    {
      company: "PT Acset Indonusa Tbk (Member of Astra)",
      role: "Fullstack Developer",
      location: "Indonesia",
      startDate: new Date("2023-08-01"),
      endDate: new Date("2025-07-01"),
      isCurrent: false,
      description:
        "Developed and maintained internal enterprise applications: E-Doc, I-Perform, Portal Inovasi, Portal API, and E-Permit.",
      achievements: [
        "Implemented cross-functional features using ReactJS, TypeScript, Java Spring Boot, and .NET.",
        "Deployed applications to Linux/Windows servers using Docker, NGINX, and GitLab CI/CD.",
        "Managed application data workflows across SQL Server, PostgreSQL, and MongoDB.",
      ],
      displayOrder: 2,
    },
    {
      company: "PT Integrasi Logistic Cipta Solusi",
      role: "Fullstack Developer",
      location: "Indonesia",
      startDate: new Date("2022-10-01"),
      endDate: new Date("2023-09-01"),
      isCurrent: false,
      description:
        "Improved logistics web applications for document tracking, truck assignments, and operational workflows.",
      achievements: [
        "Performed bug fixing, application monitoring, and manual database patching.",
        "Implemented robust frontend and backend architectures using TypeScript, Material UI, and ExpressJS.",
        "Monitored application health using Prometheus and Grafana.",
      ],
      displayOrder: 3,
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
