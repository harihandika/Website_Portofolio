"use client";

import { useReducedMotion } from "@/lib/use-reduced-motion";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Loader2, MapPin } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Container } from "@/components/layout/container";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ApiError, api } from "@/lib/api";
import type { ProfileData } from "@/lib/data/portfolio";
import { fadeUp, pageTransition, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(120, "Name is too long."),
  email: z
    .string()
    .trim()
    .email("Use a valid email address.")
    .max(180, "Email is too long."),
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters.")
    .max(180, "Subject is too long."),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(5000, "Message is too long."),
  website: z.string().max(0).optional(),
});

type ContactFormInput = z.input<typeof contactFormSchema>;
type ContactSubmitResponse = {
  id: string;
  status: "received";
  message: string;
};

type ContactPageProps = {
  profile: ProfileData;
};

const fieldClass =
  "w-full rounded-xl border border-input bg-background/60 px-4 py-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary/70 focus:shadow-[0_0_0_3px_hsl(var(--primary)/0.08)]";

export function ContactPage({ profile }: ContactPageProps) {
  const reduceMotion = useReducedMotion();
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
      name: "",
      email: "",
      subject: "",
      message: "",
      website: "",
    },
  });

  async function onSubmit(values: ContactFormInput) {
    setSuccessMessage(null);
    setSubmitError(null);

    try {
      const payload = contactFormSchema.parse(values);
      const response = await api.post<ContactSubmitResponse>(
        "/contact",
        payload,
      );
      reset();
      setSuccessMessage(
        response.message || "Message sent. I will get back to you soon.",
      );
    } catch (error) {
      setSubmitError(getSubmitErrorMessage(error));
    }
  }

  return (
    <motion.section
      variants={pageTransition}
      initial={reduceMotion ? false : "hidden"}
      animate="visible"
      className="relative min-h-[calc(100vh-4rem)] py-20 sm:py-28"
    >
      <Container>
        <motion.div
          variants={staggerContainer}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
        >
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <motion.div variants={fadeUp}>
              <p className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-primary">
                <span className="h-px w-8 bg-primary" />
                Get in touch
              </p>
              <h1 className="text-[clamp(2.375rem,10vw,3rem)] font-medium leading-[1.05] tracking-[-0.055em] sm:text-7xl">
                Great things
                <br />
                start with a<br />
                <span className="text-primary">conversation.</span>
              </h1>
              <p className="mt-7 max-w-sm text-base leading-7 text-muted-foreground">
                Have a project to build, a role to discuss, or an interesting
                problem to solve? I’d love to hear from you.
              </p>
              <div className="mt-10 border-t border-border pt-7">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Prefer a direct hello?
                </p>
                <a
                  href={`mailto:${profile.email}`}
                  className="group inline-flex max-w-full items-center gap-3 break-all text-lg tracking-tight hover:text-primary sm:text-xl"
                >
                  {profile.email}
                  <ArrowUpRight className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </a>
              </div>
              <div className="mt-9 flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {profile.location ?? "Indonesia / Remote"}
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                {profile.githubUrl ? (
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                ) : null}
                {profile.linkedinUrl ? (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                ) : null}
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Card className="rounded-2xl border-border bg-card/70">
                <CardContent className="p-6 sm:p-9">
                  <div className="mb-8 flex items-center justify-between border-b border-border pb-6">
                    <h2 className="text-xl font-medium tracking-tight">
                      Tell me about your idea
                    </h2>
                    <span className="font-mono text-xs text-primary">↗</span>
                  </div>
                  <form
                    className="space-y-6"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                  >
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      className="hidden"
                      {...register("website")}
                    />

                    <div className="grid gap-5 md:grid-cols-2">
                      <FormField label="Your name" error={errors.name?.message}>
                        <input
                          type="text"
                          autoComplete="name"
                          placeholder="Your name"
                          className={fieldClass}
                          aria-invalid={Boolean(errors.name)}
                          {...register("name")}
                        />
                      </FormField>

                      <FormField
                        label="Email address"
                        error={errors.email?.message}
                      >
                        <input
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          className={fieldClass}
                          aria-invalid={Boolean(errors.email)}
                          {...register("email")}
                        />
                      </FormField>
                    </div>

                    <FormField label="Subject" error={errors.subject?.message}>
                      <input
                        type="text"
                        placeholder="What are you working on?"
                        className={fieldClass}
                        aria-invalid={Boolean(errors.subject)}
                        {...register("subject")}
                      />
                    </FormField>

                    <FormField label="Message" error={errors.message?.message}>
                      <textarea
                        rows={7}
                        placeholder="A little about your project, what you need, and when you’d like to get started…"
                        className={cn(
                          fieldClass,
                          "min-h-40 resize-y leading-6",
                        )}
                        aria-invalid={Boolean(errors.message)}
                        {...register("message")}
                      />
                    </FormField>

                    {successMessage ? (
                      <Alert role="status">
                        <AlertDescription>{successMessage}</AlertDescription>
                      </Alert>
                    ) : null}

                    {submitError ? (
                      <Alert variant="destructive" role="alert">
                        <AlertDescription>{submitError}</AlertDescription>
                      </Alert>
                    ) : null}

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full justify-between"
                    >
                      {isSubmitting ? "Sending your message…" : "Send message"}
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </Button>
                    <p className="text-center text-xs leading-5 text-muted-foreground">
                      Your details stay private and are only used to reply.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </Container>
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
      <span className="mb-2.5 block text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <div className="transition-transform duration-200 group-focus-within:-translate-y-0.5">
        {children}
      </div>
      {error ? (
        <span role="alert" className="mt-2 block text-xs text-destructive">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function getSubmitErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const details = error.details as { message?: unknown } | undefined;

    if (Array.isArray(details?.message)) {
      return details.message.join(" ");
    }

    if (typeof details?.message === "string") {
      return details.message;
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Message could not be sent. Please try again.";
}
