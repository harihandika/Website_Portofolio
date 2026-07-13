"use client";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Download, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Skills", href: "/skills" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 12);

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-transparent transition-all duration-300",
        isScrolled &&
          "border-border/70 bg-background/78 shadow-[0_12px_36px_hsl(222_36%_4%/0.32)] backdrop-blur-xl",
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 font-semibold text-foreground"
          onClick={() => setIsMobileOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-sm text-primary shadow-[0_0_30px_hsl(var(--primary)/0.16)]">
            HH
          </span>
          <span>Hari Handika Setiawan</span>
        </Link>

        <nav
          className="hidden items-center gap-7 lg:flex"
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
              <span className="absolute -bottom-2 left-0 h-px w-full origin-left scale-x-0 bg-primary shadow-[0_0_14px_hsl(var(--primary)/0.45)] transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild size="sm">
            <Link href="/assets/CV Hari_Handika_Setiawan.pdf" target="_blank">
              <Download className="h-4 w-4" />
              Download CV
            </Link>
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label={isMobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileOpen}
          onClick={() => setIsMobileOpen((current) => !current)}
        >
          {isMobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </Container>

      <div
        className={cn(
          "grid border-t border-border/70 bg-background/96 backdrop-blur-xl transition-all duration-300 lg:hidden",
          isMobileOpen
            ? "grid-rows-[1fr]"
            : "grid-rows-[0fr] border-transparent",
        )}
      >
        <div className="overflow-hidden">
          <Container className="flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                onClick={() => setIsMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="mt-3 w-full">
              <Link
                href="/assets/CV Hari_Handika_Setiawan.pdf"
                target="_blank"
                onClick={() => setIsMobileOpen(false)}
              >
                <Download className="h-4 w-4" />
                Download CV
              </Link>
            </Button>
          </Container>
        </div>
      </div>
    </header>
  );
}
