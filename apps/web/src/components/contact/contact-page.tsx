'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Github, Linkedin, Loader2, Mail, MapPin, Send, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Container } from '@/components/layout/container';
import { SectionTitle } from '@/components/layout/section-title';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ApiError, api } from '@/lib/api';
import type { ProfileData } from '@/lib/data/portfolio';
import { fadeUp, pageTransition, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';

const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters.').max(120, 'Name is too long.'),
  email: z.string().trim().email('Use a valid email address.').max(180, 'Email is too long.'),
  subject: z.string().trim().min(3, 'Subject must be at least 3 characters.').max(180, 'Subject is too long.'),
  message: z.string().trim().min(10, 'Message must be at least 10 characters.').max(5000, 'Message is too long.'),
  website: z.string().max(0).optional(),
});

type ContactFormInput = z.input<typeof contactFormSchema>;
type ContactSubmitResponse = {
  id: string;
  status: 'received';
  message: string;
};

type ContactPageProps = {
  profile: ProfileData;
};

const fieldClass =
  'focus-lift w-full rounded-md border border-input bg-background/70 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-primary/70 focus:bg-background focus:shadow-[0_0_0_4px_hsl(var(--primary)/0.12)] focus-visible:ring-0';

export function ContactPage({ profile }: ContactPageProps) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      website: '',
    },
  });

  async function onSubmit(values: ContactFormInput) {
    setSuccessMessage(null);
    setSubmitError(null);

    try {
      const payload = contactFormSchema.parse(values);
      const response = await api.post<ContactSubmitResponse>('/contact', payload);
      reset();
      setSuccessMessage(response.message || 'Message sent. I will get back to you soon.');
    } catch (error) {
      setSubmitError(getSubmitErrorMessage(error));
    }
  }

  return (
    <motion.main
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      className="relative min-h-[calc(100vh-4rem)] overflow-hidden py-24"
    >
      <div className="animated-gradient absolute inset-0 -z-10 opacity-80" />
      <div className="surface-grid absolute inset-0 -z-10 opacity-40" />
      <Container>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={fadeUp}>
            <SectionTitle
              eyebrow="Contact"
              title="Let us discuss backend, full stack, or integration work."
              description="Send a short message about the role, project, or technical problem. The form submits directly to the portfolio backend and stores the message for admin review."
            />
          </motion.div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.64fr)_minmax(320px,0.36fr)]">
            <motion.div variants={fadeUp}>
              <Card>
                <CardContent className="p-6 sm:p-8">
                  <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register('website')} />

                    <div className="grid gap-5 md:grid-cols-2">
                      <FormField label="Name" error={errors.name?.message}>
                        <input
                          type="text"
                          autoComplete="name"
                          placeholder="Your name"
                          className={fieldClass}
                          aria-invalid={Boolean(errors.name)}
                          {...register('name')}
                        />
                      </FormField>

                      <FormField label="Email" error={errors.email?.message}>
                        <input
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          className={fieldClass}
                          aria-invalid={Boolean(errors.email)}
                          {...register('email')}
                        />
                      </FormField>
                    </div>

                    <FormField label="Subject" error={errors.subject?.message}>
                      <input
                        type="text"
                        placeholder="Full Stack Developer opportunity"
                        className={fieldClass}
                        aria-invalid={Boolean(errors.subject)}
                        {...register('subject')}
                      />
                    </FormField>

                    <FormField label="Message" error={errors.message?.message}>
                      <textarea
                        rows={7}
                        placeholder="Tell me about the role, project, timeline, or technical context."
                        className={cn(fieldClass, 'min-h-40 resize-y leading-6')}
                        aria-invalid={Boolean(errors.message)}
                        {...register('message')}
                      />
                    </FormField>

                    {successMessage ? (
                      <Alert>
                        <AlertDescription>{successMessage}</AlertDescription>
                      </Alert>
                    ) : null}

                    {submitError ? (
                      <Alert variant="destructive">
                        <AlertDescription>{submitError}</AlertDescription>
                      </Alert>
                    ) : null}

                    <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.aside variants={fadeUp} className="space-y-5">
              <ContactInfoCard
                icon={Mail}
                label="Email"
                value={profile.email}
                href={`mailto:${profile.email}`}
              />
              <ContactInfoCard
                icon={Github}
                label="GitHub"
                value={profile.githubUrl ?? 'GitHub profile'}
                href={profile.githubUrl ?? undefined}
              />
              <ContactInfoCard
                icon={Linkedin}
                label="LinkedIn"
                value={profile.linkedinUrl ?? 'LinkedIn profile'}
                href={profile.linkedinUrl ?? undefined}
              />
              <ContactInfoCard icon={MapPin} label="Location" value={profile.location ?? 'Indonesia / Remote'} />
            </motion.aside>
          </div>
        </motion.div>
      </Container>
    </motion.main>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="group block">
      <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
      <div className="transition-transform duration-200 group-focus-within:-translate-y-0.5">{children}</div>
      {error ? <span className="mt-2 block text-sm text-destructive">{error}</span> : null}
    </label>
  );
}

function ContactInfoCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <Card className="transition-all duration-200 hover:border-primary/50 hover:shadow-[0_0_34px_hsl(var(--primary)/0.12)]">
      <CardContent className="flex gap-4 p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="mt-1 break-words text-sm leading-6 text-muted-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
      {content}
    </Link>
  );
}

function getSubmitErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const details = error.details as { message?: unknown } | undefined;

    if (Array.isArray(details?.message)) {
      return details.message.join(' ');
    }

    if (typeof details?.message === 'string') {
      return details.message;
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Message could not be sent. Please try again.';
}
