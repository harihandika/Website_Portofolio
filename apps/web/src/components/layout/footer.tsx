import { Container } from "@/components/layout/container";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Skills", href: "/skills" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.08] bg-background">
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:gap-16">
          <div>
            <Link href="/" className="text-2xl font-bold tracking-[-0.06em] text-foreground">harihandika<span className="text-primary">.</span></Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">Thoughtful interfaces. Reliable systems.<br />Digital experiences built to make a difference.</p>
            <div className="mt-6 flex items-center gap-3">
              <a href="https://github.com/harihandika" target="_blank" rel="noopener noreferrer" aria-label="Hari Handika on GitHub (opens in a new tab)" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"><Github className="h-4 w-4" /></a>
              <a href="https://www.linkedin.com/in/harihandika" target="_blank" rel="noopener noreferrer" aria-label="Hari Handika on LinkedIn (opens in a new tab)" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"><Linkedin className="h-4 w-4" /></a>
            </div>
          </div>
          <div className="flex gap-16 md:gap-24">
            <nav aria-label="Footer navigation">
              <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Explore</p>
              <div className="flex flex-col items-start gap-3">
                {footerLinks.map((link) => <Link key={link.href} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">{link.label}</Link>)}
              </div>
            </nav>
            <div>
              <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Have an idea?</p>
              <Link href="/contact" className="group inline-flex items-center gap-3 border-b border-primary/40 pb-2 text-base font-medium text-foreground transition-colors hover:text-primary">Let’s talk <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
              <p className="mt-5 text-xs text-muted-foreground">Based in Indonesia <span aria-hidden="true">↗</span></p>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Hari Handika Setiawan.</p>
          <p className="font-mono text-[10px] tracking-wide">DESIGNED WITH INTENT. BUILT WITH CARE.</p>
        </div>
      </Container>
    </footer>
  );
}
