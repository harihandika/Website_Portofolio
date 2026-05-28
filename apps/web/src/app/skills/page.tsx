import { SkillsSection } from '@/components/sections/skills-section';
import { getPortfolioData } from '@/lib/data/portfolio';

export default async function SkillsPage() {
  const { skills } = await getPortfolioData();

  return <SkillsSection skills={skills} />;
}
