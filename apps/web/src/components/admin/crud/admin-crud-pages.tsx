'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Edit3, Eye, Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { EmptyState } from '@/components/states/empty-state';
import { ErrorState } from '@/components/states/error-state';
import { LoadingState } from '@/components/states/loading-state';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ApiError, api } from '@/lib/api';
import { getAdminToken } from '@/lib/auth/admin-session';
import type { ProfileData } from '@/lib/data/portfolio';
import type { ProjectData } from '@/lib/data/projects';
import { cn } from '@/lib/utils';

type LoadStatus = 'loading' | 'success' | 'error';

type SkillData = {
  id: string;
  name: string;
  category: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  order: number;
  createdAt: string;
  updatedAt: string;
};

type SkillGroupData = {
  category: string;
  skills: SkillData[];
};

type ExperienceData = {
  id: string;
  company: string;
  role: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
  achievements: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
};

type ContactMessageData = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: 'NEW' | 'READ' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
};

const fieldClass =
  'focus-lift w-full rounded-md border border-input bg-background/70 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-primary/70 focus:bg-background focus:shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]';

const profileSchema = z.object({
  fullName: z.string().trim().min(2).max(140),
  headline: z.string().trim().min(5).max(180),
  bio: z.string().trim().min(20),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().max(40).optional(),
  location: z.string().trim().max(120).optional(),
  githubUrl: optionalUrl(),
  linkedinUrl: optionalUrl(),
  cvUrl: optionalUrl(),
  photoUrl: optionalUrl(),
});

const projectSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug: z.string().trim().toLowerCase().min(2).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only.'),
  summary: z.string().trim().min(10).max(280),
  description: z.string().trim().min(20),
  problem: z.string().trim().min(20),
  solution: z.string().trim().min(20),
  impact: z.string().trim().min(20),
  imageUrl: optionalUrl(),
  demoUrl: optionalUrl(),
  githubUrl: optionalUrl(),
  isFeatured: z.boolean(),
  displayOrder: z.coerce.number().int().min(0),
});

const skillSchema = z.object({
  name: z.string().trim().min(2).max(100),
  category: z.string().trim().min(2).max(100),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
  order: z.coerce.number().int().min(0),
});

const experienceSchema = z.object({
  company: z.string().trim().min(2).max(160),
  role: z.string().trim().min(2).max(160),
  location: z.string().trim().max(120).optional(),
  startDate: z.string().min(1, 'Start date is required.'),
  endDate: z.string().optional(),
  isCurrent: z.boolean(),
  description: z.string().trim().min(20),
  achievementsText: z.string().optional(),
  order: z.coerce.number().int().min(0),
});

type ProfileFormInput = z.input<typeof profileSchema>;
type ProjectFormInput = z.input<typeof projectSchema>;
type SkillFormInput = z.input<typeof skillSchema>;
type ExperienceFormInput = z.input<typeof experienceSchema>;

export function AdminProfileCrudPage() {
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const form = useForm<ProfileFormInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: defaultProfileValues(),
  });

  useEffect(() => {
    async function loadProfile() {
      setStatus('loading');
      setError(null);
      try {
        const profile = await api.get<ProfileData>('/profile');
        form.reset(toProfileForm(profile));
        setStatus('success');
      } catch (caught) {
        setError(getApiMessage(caught));
        setStatus('error');
      }
    }

    loadProfile();
  }, [form]);

  async function onSubmit(values: ProfileFormInput) {
    setSuccess(null);
    setError(null);
    try {
      await api.patch<ProfileData>('/profile', cleanPayload(profileSchema.parse(values)), getRequiredToken());
      setSuccess('Profile updated successfully.');
    } catch (caught) {
      setError(getApiMessage(caught));
    }
  }

  return (
    <AdminCrudShell title="Profile" description="View and update public profile data shown across the portfolio.">
      {status === 'loading' ? <LoadingState title="Loading profile" /> : null}
      {status === 'error' ? <ErrorState description={error ?? undefined} /> : null}
      {status === 'success' ? (
        <Card>
          <CardContent className="p-6">
            <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-5 md:grid-cols-2">
                <TextField label="Full Name" error={form.formState.errors.fullName?.message} {...form.register('fullName')} />
                <TextField label="Email" type="email" error={form.formState.errors.email?.message} {...form.register('email')} />
              </div>
              <TextField label="Headline" error={form.formState.errors.headline?.message} {...form.register('headline')} />
              <TextAreaField label="Bio" rows={5} error={form.formState.errors.bio?.message} {...form.register('bio')} />
              <div className="grid gap-5 md:grid-cols-2">
                <TextField label="Phone" error={form.formState.errors.phone?.message} {...form.register('phone')} />
                <TextField label="Location" error={form.formState.errors.location?.message} {...form.register('location')} />
                <TextField label="GitHub URL" error={form.formState.errors.githubUrl?.message} {...form.register('githubUrl')} />
                <TextField label="LinkedIn URL" error={form.formState.errors.linkedinUrl?.message} {...form.register('linkedinUrl')} />
                <TextField label="CV URL" error={form.formState.errors.cvUrl?.message} {...form.register('cvUrl')} />
                <TextField label="Photo URL" error={form.formState.errors.photoUrl?.message} {...form.register('photoUrl')} />
              </div>
              <FormFeedback success={success} error={error} />
              <Button type="submit" disabled={form.formState.isSubmitting} className="w-full sm:w-fit">
                {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}
    </AdminCrudShell>
  );
}

export function AdminProjectsCrudPage() {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [editing, setEditing] = useState<ProjectData | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const form = useForm<ProjectFormInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: defaultProjectValues(),
  });

  async function loadProjects() {
    setStatus('loading');
    setError(null);
    try {
      setProjects(await api.get<ProjectData[]>('/projects'));
      setStatus('success');
    } catch (caught) {
      setError(getApiMessage(caught));
      setStatus('error');
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function openCreate() {
    setEditing(null);
    form.reset(defaultProjectValues());
    setIsFormOpen(true);
  }

  function openEdit(project: ProjectData) {
    setEditing(project);
    form.reset(toProjectForm(project));
    setIsFormOpen(true);
  }

  async function onSubmit(values: ProjectFormInput) {
    const payload = cleanPayload(projectSchema.parse(values));
    if (editing) {
      await api.patch<ProjectData>(`/projects/${editing.id}`, payload, getRequiredToken());
    } else {
      await api.post<ProjectData>('/projects', payload, getRequiredToken());
    }
    setIsFormOpen(false);
    await loadProjects();
  }

  async function deleteProject(project: ProjectData) {
    if (!window.confirm(`Delete project "${project.title}"?`)) return;
    await api.delete<void>(`/projects/${project.id}`, getRequiredToken());
    await loadProjects();
  }

  return (
    <AdminCrudShell title="Projects" description="Create, update, delete, and feature portfolio projects." action={<Button onClick={openCreate}><Plus className="h-4 w-4" />New Project</Button>}>
      {isFormOpen ? (
        <AdminFormCard title={editing ? 'Edit Project' : 'Create Project'} onCancel={() => setIsFormOpen(false)}>
          <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-5 md:grid-cols-2">
              <TextField label="Title" error={form.formState.errors.title?.message} {...form.register('title')} />
              <TextField label="Slug" error={form.formState.errors.slug?.message} {...form.register('slug')} />
            </div>
            <TextAreaField label="Summary" rows={3} error={form.formState.errors.summary?.message} {...form.register('summary')} />
            <TextAreaField label="Description" rows={4} error={form.formState.errors.description?.message} {...form.register('description')} />
            <div className="grid gap-5 md:grid-cols-3">
              <TextAreaField label="Problem" rows={4} error={form.formState.errors.problem?.message} {...form.register('problem')} />
              <TextAreaField label="Solution" rows={4} error={form.formState.errors.solution?.message} {...form.register('solution')} />
              <TextAreaField label="Impact" rows={4} error={form.formState.errors.impact?.message} {...form.register('impact')} />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <TextField label="Image URL" error={form.formState.errors.imageUrl?.message} {...form.register('imageUrl')} />
              <TextField label="Demo URL" error={form.formState.errors.demoUrl?.message} {...form.register('demoUrl')} />
              <TextField label="GitHub URL" error={form.formState.errors.githubUrl?.message} {...form.register('githubUrl')} />
              <TextField label="Display Order" type="number" error={form.formState.errors.displayOrder?.message} {...form.register('displayOrder')} />
            </div>
            <CheckboxField label="Featured project" {...form.register('isFeatured')} />
            <SubmitButton isSubmitting={form.formState.isSubmitting} label={editing ? 'Update Project' : 'Create Project'} />
          </form>
        </AdminFormCard>
      ) : null}
      <ResourceState status={status} error={error} empty={projects.length === 0} emptyTitle="No projects found" />
      {status === 'success' && projects.length ? (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-foreground">{project.title}</h3>
                    {project.isFeatured ? <Badge>Featured</Badge> : <Badge variant="outline">Standard</Badge>}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{project.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.techStacks.map((tech) => <Badge key={tech.id} variant="outline">{tech.name}</Badge>)}
                  </div>
                </div>
                <RowActions onEdit={() => openEdit(project)} onDelete={() => deleteProject(project)} />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </AdminCrudShell>
  );
}

export function AdminSkillsCrudPage() {
  const [groups, setGroups] = useState<SkillGroupData[]>([]);
  const [editing, setEditing] = useState<SkillData | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const form = useForm<SkillFormInput>({ resolver: zodResolver(skillSchema), defaultValues: defaultSkillValues() });
  const skills = useMemo(() => groups.flatMap((group) => group.skills), [groups]);

  async function loadSkills() {
    setStatus('loading');
    try {
      setGroups(await api.get<SkillGroupData[]>('/skills'));
      setStatus('success');
    } catch (caught) {
      setError(getApiMessage(caught));
      setStatus('error');
    }
  }

  useEffect(() => { loadSkills(); }, []);

  function openCreate() {
    setEditing(null);
    form.reset(defaultSkillValues());
    setIsFormOpen(true);
  }

  function openEdit(skill: SkillData) {
    setEditing(skill);
    form.reset({ name: skill.name, category: skill.category, level: skill.level, order: skill.order });
    setIsFormOpen(true);
  }

  async function onSubmit(values: SkillFormInput) {
    const payload = skillSchema.parse(values);
    if (editing) await api.patch<SkillData>(`/skills/${editing.id}`, payload, getRequiredToken());
    else await api.post<SkillData>('/skills', payload, getRequiredToken());
    setIsFormOpen(false);
    await loadSkills();
  }

  async function deleteSkill(skill: SkillData) {
    if (!window.confirm(`Delete skill "${skill.name}"?`)) return;
    await api.delete<void>(`/skills/${skill.id}`, getRequiredToken());
    await loadSkills();
  }

  return (
    <AdminCrudShell title="Skills" description="Manage skills grouped by category." action={<Button onClick={openCreate}><Plus className="h-4 w-4" />New Skill</Button>}>
      {isFormOpen ? (
        <AdminFormCard title={editing ? 'Edit Skill' : 'Create Skill'} onCancel={() => setIsFormOpen(false)}>
          <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-5 md:grid-cols-2">
              <TextField label="Name" error={form.formState.errors.name?.message} {...form.register('name')} />
              <TextField label="Category" error={form.formState.errors.category?.message} {...form.register('category')} />
              <SelectField label="Level" error={form.formState.errors.level?.message} {...form.register('level')}>
                {['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'].map((level) => <option key={level} value={level}>{level}</option>)}
              </SelectField>
              <TextField label="Order" type="number" error={form.formState.errors.order?.message} {...form.register('order')} />
            </div>
            <SubmitButton isSubmitting={form.formState.isSubmitting} label={editing ? 'Update Skill' : 'Create Skill'} />
          </form>
        </AdminFormCard>
      ) : null}
      <ResourceState status={status} error={error} empty={skills.length === 0} emptyTitle="No skills found" />
      {status === 'success' && groups.map((group) => (
        <Card key={group.category}>
          <CardContent className="p-5">
            <h3 className="mb-4 font-semibold text-foreground">{group.category}</h3>
            <div className="grid gap-3">
              {group.skills.map((skill) => (
                <div key={skill.id} className="flex flex-col gap-3 rounded-md border border-border bg-secondary/25 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-foreground">{skill.name}</span>
                    <Badge variant="outline">{skill.level}</Badge>
                    <span className="text-sm text-muted-foreground">Order {skill.order}</span>
                  </div>
                  <RowActions onEdit={() => openEdit(skill)} onDelete={() => deleteSkill(skill)} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </AdminCrudShell>
  );
}

export function AdminExperiencesCrudPage() {
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [editing, setEditing] = useState<ExperienceData | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const form = useForm<ExperienceFormInput>({ resolver: zodResolver(experienceSchema), defaultValues: defaultExperienceValues() });

  async function loadExperiences() {
    setStatus('loading');
    try {
      setExperiences(await api.get<ExperienceData[]>('/experiences'));
      setStatus('success');
    } catch (caught) {
      setError(getApiMessage(caught));
      setStatus('error');
    }
  }

  useEffect(() => { loadExperiences(); }, []);

  function openCreate() {
    setEditing(null);
    form.reset(defaultExperienceValues());
    setIsFormOpen(true);
  }

  function openEdit(experience: ExperienceData) {
    setEditing(experience);
    form.reset(toExperienceForm(experience));
    setIsFormOpen(true);
  }

  async function onSubmit(values: ExperienceFormInput) {
    const parsed = experienceSchema.parse(values);
    const payload = cleanPayload({
      company: parsed.company,
      role: parsed.role,
      location: parsed.location,
      startDate: parsed.startDate,
      endDate: parsed.isCurrent ? null : parsed.endDate,
      isCurrent: parsed.isCurrent,
      description: parsed.description,
      achievements: toLines(parsed.achievementsText),
      order: parsed.order,
    });
    if (editing) await api.patch<ExperienceData>(`/experiences/${editing.id}`, payload, getRequiredToken());
    else await api.post<ExperienceData>('/experiences', payload, getRequiredToken());
    setIsFormOpen(false);
    await loadExperiences();
  }

  async function deleteExperience(experience: ExperienceData) {
    if (!window.confirm(`Delete experience "${experience.role}" at "${experience.company}"?`)) return;
    await api.delete<void>(`/experiences/${experience.id}`, getRequiredToken());
    await loadExperiences();
  }

  return (
    <AdminCrudShell title="Experiences" description="Manage the public work timeline." action={<Button onClick={openCreate}><Plus className="h-4 w-4" />New Experience</Button>}>
      {isFormOpen ? (
        <AdminFormCard title={editing ? 'Edit Experience' : 'Create Experience'} onCancel={() => setIsFormOpen(false)}>
          <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-5 md:grid-cols-2">
              <TextField label="Company" error={form.formState.errors.company?.message} {...form.register('company')} />
              <TextField label="Role" error={form.formState.errors.role?.message} {...form.register('role')} />
              <TextField label="Location" error={form.formState.errors.location?.message} {...form.register('location')} />
              <TextField label="Order" type="number" error={form.formState.errors.order?.message} {...form.register('order')} />
              <TextField label="Start Date" type="date" error={form.formState.errors.startDate?.message} {...form.register('startDate')} />
              <TextField label="End Date" type="date" error={form.formState.errors.endDate?.message} {...form.register('endDate')} />
            </div>
            <CheckboxField label="Current role" {...form.register('isCurrent')} />
            <TextAreaField label="Description" rows={4} error={form.formState.errors.description?.message} {...form.register('description')} />
            <TextAreaField label="Achievements (one per line)" rows={5} error={form.formState.errors.achievementsText?.message} {...form.register('achievementsText')} />
            <SubmitButton isSubmitting={form.formState.isSubmitting} label={editing ? 'Update Experience' : 'Create Experience'} />
          </form>
        </AdminFormCard>
      ) : null}
      <ResourceState status={status} error={error} empty={experiences.length === 0} emptyTitle="No experiences found" />
      {status === 'success' && experiences.length ? (
        <div className="grid gap-4">
          {experiences.map((experience) => (
            <Card key={experience.id}>
              <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{experience.role}</h3>
                  <p className="mt-1 text-sm text-primary">{experience.company}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{formatDate(experience.startDate)} - {experience.isCurrent ? 'Present' : formatDate(experience.endDate)}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{experience.description}</p>
                </div>
                <RowActions onEdit={() => openEdit(experience)} onDelete={() => deleteExperience(experience)} />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </AdminCrudShell>
  );
}

export function AdminMessagesCrudPage() {
  const [messages, setMessages] = useState<ContactMessageData[]>([]);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  async function loadMessages() {
    setStatus('loading');
    try {
      setMessages(await api.get<ContactMessageData[]>('/contact/messages', getRequiredToken()));
      setStatus('success');
    } catch (caught) {
      setError(getApiMessage(caught));
      setStatus('error');
    }
  }

  useEffect(() => { loadMessages(); }, []);

  async function markRead(message: ContactMessageData) {
    await api.patch<ContactMessageData>(`/contact/messages/${message.id}/read`, {}, getRequiredToken());
    await loadMessages();
  }

  async function deleteMessage(message: ContactMessageData) {
    if (!window.confirm(`Delete message from "${message.name}"?`)) return;
    await api.delete<void>(`/contact/messages/${message.id}`, getRequiredToken());
    await loadMessages();
  }

  return (
    <AdminCrudShell title="Messages" description="Review contact messages and keep the inbox clean.">
      <ResourceState status={status} error={error} empty={messages.length === 0} emptyTitle="No contact messages found" />
      {status === 'success' && messages.length ? (
        <div className="grid gap-4">
          {messages.map((message) => (
            <Card key={message.id}>
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground">{message.subject ?? 'No subject'}</h3>
                      <Badge variant={message.status === 'READ' ? 'outline' : 'default'}>{message.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-primary">{message.name} - {message.email}</p>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{message.message}</p>
                    <p className="mt-3 text-xs text-muted-foreground">{formatDate(message.createdAt)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {message.status !== 'READ' ? <Button size="sm" variant="outline" onClick={() => markRead(message)}><Eye className="h-4 w-4" />Mark read</Button> : null}
                    <Button size="sm" variant="destructive" onClick={() => deleteMessage(message)}><Trash2 className="h-4 w-4" />Delete</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </AdminCrudShell>
  );
}

function AdminCrudShell({ title, description, action, children }: { title: string; description: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Manage Content</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground sm:text-3xl">{title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">{description}</p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </div>
  );
}

function AdminFormCard({ title, onCancel, children }: { title: string; onCancel: () => void; children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}><X className="h-4 w-4" />Cancel</Button>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, className, ...props }, ref) => (
    <Field label={label} error={error}>
      <input ref={ref} className={cn(fieldClass, className)} {...props} />
    </Field>
  ),
);
TextField.displayName = 'TextField';

type TextAreaFieldProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

const TextAreaField = React.forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ label, error, className, ...props }, ref) => (
    <Field label={label} error={error}>
      <textarea ref={ref} className={cn(fieldClass, 'resize-y', className)} {...props} />
    </Field>
  ),
);
TextAreaField.displayName = 'TextAreaField';

type SelectFieldProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
};

const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, className, children, ...props }, ref) => (
    <Field label={label} error={error}>
      <select ref={ref} className={cn(fieldClass, className)} {...props}>
        {children}
      </select>
    </Field>
  ),
);
SelectField.displayName = 'SelectField';

function CheckboxField({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex items-center gap-3 rounded-md border border-border bg-secondary/25 p-3 text-sm text-foreground">
      <input type="checkbox" className="h-4 w-4 accent-cyan-400" {...props} />
      {label}
    </label>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-sm text-destructive">{error}</span> : null}
    </label>
  );
}

function SubmitButton({ isSubmitting, label }: { isSubmitting: boolean; label: string }) {
  return <Button type="submit" disabled={isSubmitting} className="w-full sm:w-fit">{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{label}</Button>;
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" onClick={onEdit}><Edit3 className="h-4 w-4" />Edit</Button>
      <Button size="sm" variant="destructive" onClick={onDelete}><Trash2 className="h-4 w-4" />Delete</Button>
    </div>
  );
}

function ResourceState({ status, error, empty, emptyTitle }: { status: LoadStatus; error: string | null; empty: boolean; emptyTitle: string }) {
  if (status === 'loading') return <LoadingState />;
  if (status === 'error') return <ErrorState description={error ?? undefined} />;
  if (empty) return <EmptyState title={emptyTitle} />;
  return null;
}

function FormFeedback({ success, error }: { success: string | null; error: string | null }) {
  return (
    <>
      {success ? <Alert><AlertDescription>{success}</AlertDescription></Alert> : null}
      {error ? <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert> : null}
    </>
  );
}

function optionalUrl() {
  return z.string().trim().optional().refine((value) => !value || /^https?:\/\/.+/i.test(value), 'Use a full URL starting with http:// or https://');
}

function getRequiredToken() {
  const token = getAdminToken();
  if (!token) {
    window.location.replace('/admin/login');
    throw new Error('Admin session is missing.');
  }
  return token;
}

function getApiMessage(error: unknown) {
  if (error instanceof ApiError) {
    const details = error.details as { message?: unknown } | undefined;
    if (Array.isArray(details?.message)) return details.message.join(' ');
    if (typeof details?.message === 'string') return details.message;
    return error.message;
  }
  return error instanceof Error ? error.message : 'Request failed.';
}

function cleanPayload<T extends Record<string, unknown>>(payload: T) {
  return Object.fromEntries(Object.entries(payload).map(([key, value]) => [key, value === '' ? undefined : value]).filter(([, value]) => value !== undefined)) as T;
}

function defaultProfileValues(): ProfileFormInput {
  return { fullName: '', headline: '', bio: '', email: '', phone: '', location: '', githubUrl: '', linkedinUrl: '', cvUrl: '', photoUrl: '' };
}

function toProfileForm(profile: ProfileData): ProfileFormInput {
  return { fullName: profile.fullName, headline: profile.headline, bio: profile.bio, email: profile.email, phone: profile.phone ?? '', location: profile.location ?? '', githubUrl: profile.githubUrl ?? '', linkedinUrl: profile.linkedinUrl ?? '', cvUrl: profile.cvUrl ?? '', photoUrl: profile.photoUrl ?? '' };
}

function defaultProjectValues(): ProjectFormInput {
  return { title: '', slug: '', summary: '', description: '', problem: '', solution: '', impact: '', imageUrl: '', demoUrl: '', githubUrl: '', isFeatured: false, displayOrder: 0 };
}

function toProjectForm(project: ProjectData): ProjectFormInput {
  return { title: project.title, slug: project.slug, summary: project.summary, description: project.description, problem: project.problem, solution: project.solution, impact: project.impact, imageUrl: project.imageUrl ?? '', demoUrl: project.demoUrl ?? '', githubUrl: project.githubUrl ?? '', isFeatured: project.isFeatured, displayOrder: project.displayOrder };
}

function defaultSkillValues(): SkillFormInput {
  return { name: '', category: '', level: 'INTERMEDIATE', order: 0 };
}

function defaultExperienceValues(): ExperienceFormInput {
  return { company: '', role: '', location: '', startDate: '', endDate: '', isCurrent: false, description: '', achievementsText: '', order: 0 };
}

function toExperienceForm(experience: ExperienceData): ExperienceFormInput {
  return { company: experience.company, role: experience.role, location: experience.location ?? '', startDate: toInputDate(experience.startDate), endDate: toInputDate(experience.endDate), isCurrent: experience.isCurrent, description: experience.description, achievementsText: experience.achievements.join('\n'), order: experience.order };
}

function toInputDate(value: string | null) {
  if (!value) return '';
  return value.slice(0, 10);
}

function toLines(value?: string) {
  return (value ?? '').split('\n').map((line) => line.trim()).filter(Boolean);
}

function formatDate(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(date);
}
