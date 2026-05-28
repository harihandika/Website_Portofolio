import type { LucideIcon } from 'lucide-react';
import { ArrowRight, BarChart3, BriefcaseBusiness, Mail, Sparkles, UserRound, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const pageIcons: Record<string, LucideIcon> = {
  Dashboard: BarChart3,
  Profile: UserRound,
  Projects: BriefcaseBusiness,
  Skills: Wrench,
  Experiences: Sparkles,
  Messages: Mail,
};

type AdminPlaceholderPageProps = {
  title: string;
  description: string;
};

export function AdminPlaceholderPage({ title, description }: AdminPlaceholderPageProps) {
  const Icon = pageIcons[title] ?? BarChart3;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="max-w-3xl">
              <Badge variant="outline" className="mb-4">
                Protected Admin Page
              </Badge>
              <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>
            </div>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
              <Icon className="h-7 w-7" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {['Protected by JWT token check', 'CRUD forms not added yet', 'Ready for next admin slice'].map((item) => (
          <Card key={item}>
            <CardContent className="flex items-center gap-3 p-5">
              <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
              <p className="text-sm text-muted-foreground">{item}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
