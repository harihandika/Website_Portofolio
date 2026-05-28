import { HomePage } from '@/components/home/home-page';
import { getPortfolioData } from '@/lib/data/portfolio';

export default async function Page() {
  const data = await getPortfolioData();

  return <HomePage profile={data.profile} skills={data.skills} experiences={data.experiences} />;
}
