import * as React from 'react';
import { cn } from '@/lib/utils';

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  actions?: React.ReactNode;
  className?: string;
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = 'left',
  actions,
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'items-center text-center md:flex-col md:items-center',
        className,
      )}
    >
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className={cn("mb-4 flex items-center gap-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-primary", align === 'center' && 'justify-center')}><span aria-hidden="true" className="h-px w-7 bg-primary/60" />{eyebrow}</p>
        ) : null}
        <h2 className="text-balance text-3xl font-medium leading-[1.1] tracking-[-0.045em] text-foreground sm:text-4xl lg:text-5xl">{title}</h2>
        {description ? <p className="mt-4 text-base leading-7 text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
    </div>
  );
}
