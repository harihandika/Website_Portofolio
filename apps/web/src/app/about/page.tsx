import { AboutSection } from '@/components/sections/about-section';
import { getPortfolioData } from '@/lib/data/portfolio';

export default async function AboutPage() {
  const { profile } = await getPortfolioData();

  return <AboutSection profile={profile} />;
}
