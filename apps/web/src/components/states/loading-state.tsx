import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type LoadingStateProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function LoadingState({
  title = 'Loading',
  description = 'Fetching the latest portfolio content.',
  className,
}: LoadingStateProps) {
  return (
    <div className={cn('flex min-h-48 flex-col items-center justify-center rounded-lg border bg-card/70 p-8 text-center', className)}>
      <Loader2 className="mb-4 h-6 w-6 animate-spin text-primary" />
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}
