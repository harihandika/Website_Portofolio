'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowLeft, LockKeyhole, Loader2, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ApiError, api } from '@/lib/api';
import {
  getAdminToken,
  storeAdminSession,
  type AdminLoginResponse,
} from '@/lib/auth/admin-session';
import { fadeUp, pageTransition, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';

const adminLoginSchema = z.object({
  email: z.string().trim().email('Use a valid admin email address.').max(180, 'Email is too long.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

type AdminLoginInput = z.input<typeof adminLoginSchema>;

const fieldClass =
  'focus-lift w-full rounded-md border border-input bg-background/70 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-primary/70 focus:bg-background focus:shadow-[0_0_0_4px_hsl(var(--primary)/0.12)] focus-visible:ring-0';

export function AdminLoginPage() {
  const [loginError, setLoginError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginInput>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (getAdminToken()) {
      window.location.replace('/admin/dashboard');
    }
  }, []);

  async function onSubmit(values: AdminLoginInput) {
    setLoginError(null);

    try {
      const payload = adminLoginSchema.parse(values);
      const response = await api.post<AdminLoginResponse>('/auth/login', {
        email: payload.email.toLowerCase(),
        password: payload.password,
      });

      storeAdminSession(response);
      window.location.replace('/admin/dashboard');
    } catch (error) {
      setLoginError(getLoginErrorMessage(error));
    }
  }

  return (
    <motion.section
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      className="relative min-h-[calc(100vh-4rem)] overflow-hidden py-24"
    >
      <div className="animated-gradient absolute inset-0 -z-10 opacity-80" />
      <div className="surface-grid absolute inset-0 -z-10 opacity-40" />

      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={fadeUp} className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-sm text-primary">
            <ShieldCheck className="h-4 w-4" />
            Admin access only
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-balance text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Sign in to manage portfolio content.
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
            Use your admin account to access the portfolio dashboard. Project, skill, profile, experience, and message
            management will be added in later slices.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <Button asChild variant="ghost">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Website
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="mx-auto w-full max-w-md">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-7 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <LockKeyhole className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">Admin Login</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">Enter your credentials to continue.</p>
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
                <FormField label="Email" error={errors.email?.message}>
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="admin@example.com"
                    className={fieldClass}
                    aria-invalid={Boolean(errors.email)}
                    {...register('email')}
                  />
                </FormField>

                <FormField label="Password" error={errors.password?.message}>
                  <input
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter password"
                    className={fieldClass}
                    aria-invalid={Boolean(errors.password)}
                    {...register('password')}
                  />
                </FormField>

                {loginError ? (
                  <Alert variant="destructive">
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                ) : null}

                <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
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

function getLoginErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const details = error.details as { message?: unknown } | undefined;

    if (Array.isArray(details?.message)) {
      return details.message.join(' ');
    }

    if (typeof details?.message === 'string') {
      return details.message;
    }

    if (error.status === 401) {
      return 'Invalid email or password.';
    }

    return error.message;
  }

  return 'Unable to sign in. Please check the API connection and try again.';
}
