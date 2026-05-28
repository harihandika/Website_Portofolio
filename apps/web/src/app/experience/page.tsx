import { ExperienceSection } from '@/components/sections/experience-section';
import { getPortfolioData } from '@/lib/data/portfolio';

export default async function ExperiencePage() {
  const { experiences } = await getPortfolioData();

  return <ExperienceSection experiences={experiences} />;
}
