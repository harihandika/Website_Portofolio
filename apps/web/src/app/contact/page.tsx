import { ContactPage } from '@/components/contact/contact-page';
import { getPortfolioData } from '@/lib/data/portfolio';

export default async function ContactRoutePage() {
  const { profile } = await getPortfolioData();

  return <ContactPage profile={profile} />;
}
