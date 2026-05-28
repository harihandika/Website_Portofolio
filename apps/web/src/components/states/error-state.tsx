import { AlertTriangle } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

type ErrorStateProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function ErrorState({
  title = 'Something went wrong',
  description = 'Please try again or check the API connection.',
  action,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('rounded-lg border border-destructive/30 bg-destructive/10 p-6', className)}>
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-destructive/15 text-destructive">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium text-foreground">{title}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
          {action ? <div className="mt-4">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}
