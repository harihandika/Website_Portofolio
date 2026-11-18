"use client";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Code2, Mail, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navLinks = [
  { label: "Overview", href: "/" },
  { label: "Expertise", href: "/about" },
  { label: "Work", href: "/projects" },
  { label: "System Map", href: "/system-map" },
  { label: "Experience", href: "/experience" },
  { label: "Skills", href: "/skills" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const mobileNavigation = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 12);
    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileOpen(false);
        menuButton.current?.focus();
      }
      if (event.key === "Tab") {
        const links = Array.from(
          mobileNavigation.current?.querySelectorAll<HTMLAnchorElement>(
            "a[href]",
          ) ?? [],
        );
        const first = menuButton.current;
        const last = links.at(-1);
        if (event.shiftKey && document.activeElement === first && last) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === last &&
          first
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-background/90 transition-colors duration-300 backdrop-blur-xl",
        isScrolled && "bg-background/95 shadow-[0_8px_36px_rgba(0,0,0,0.2)]",
      )}
    >
      <Container className="flex h-20 items-center justify-between gap-6">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3"
          aria-label="Hari Handika Setiawan — home"
          onClick={() => setIsMobileOpen(false)}
        >
          <span aria-hidden="true" className="brand-mark">
            <Code2 size={22} strokeWidth={2.4} />
          </span>
          <span className="brand-word">
            Hari Handika<span className="text-primary">.</span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-6 xl:gap-8 lg:flex"
          aria-label="Primary navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "group relative py-2 text-xs font-medium transition-colors hover:text-foreground",
                isActive(link.href)
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary transition-opacity",
                  isActive(link.href)
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100",
                )}
              />
            </Link>
          ))}
        </nav>

        <Button
          asChild
          size="sm"
          variant="outline"
          className="hidden rounded-md border-white/25 bg-transparent lg:inline-flex"
        >
          <Link href="/contact">
            Get in touch <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>

        <Button
          ref={menuButton}
          type="button"
          variant="outline"
          size="icon"
          className="lg:hidden"
          aria-label={
            isMobileOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-controls="mobile-navigation"
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

      {isMobileOpen && (
        <div className="absolute inset-x-0 top-full lg:hidden">
          <button
            className="absolute inset-x-0 top-0 -z-10 h-[calc(100dvh-5rem)] bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
            tabIndex={-1}
            aria-label="Close navigation menu"
          />
          <nav
            ref={mobileNavigation}
            id="mobile-navigation"
            className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-white/10 bg-background px-6 pb-8 pt-4"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "group flex items-center justify-between border-b border-white/[0.06] py-4 text-2xl font-medium tracking-tight",
                  isActive(link.href) ? "text-primary" : "text-foreground",
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                <span>
                  <span className="mr-4 align-middle font-mono text-[10px] text-muted-foreground">
                    0{index + 1}
                  </span>
                  {link.label}
                </span>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            ))}
            <Button asChild className="mt-6 w-full">
              <Link href="/contact" onClick={() => setIsMobileOpen(false)}>
                <Mail className="h-4 w-4" /> Get in touch
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
