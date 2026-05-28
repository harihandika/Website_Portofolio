import { Inbox } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed bg-card/55 p-8 text-center', className)}>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border bg-secondary">
        <Inbox className="h-5 w-5 text-primary" />
      </div>
      <p className="font-medium text-foreground">{title}</p>
      {description ? <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
