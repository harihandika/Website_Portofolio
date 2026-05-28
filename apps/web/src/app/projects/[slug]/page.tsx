import { ProjectCaseStudyPage } from '@/components/projects/project-case-study-page';

type ProjectCaseStudyRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectCaseStudyRoutePage({ params }: ProjectCaseStudyRouteProps) {
  const { slug } = await params;

  return <ProjectCaseStudyPage slug={slug} />;
}
