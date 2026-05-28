import { Container } from '@/components/layout/container';
import { LoadingState } from '@/components/states/loading-state';

export default function ProjectCaseStudyLoading() {
  return (
    <main className="min-h-[calc(100vh-4rem)] py-24">
      <Container>
        <LoadingState title="Loading case study" description="Preparing the project detail page." />
      </Container>
    </main>
  );
}
