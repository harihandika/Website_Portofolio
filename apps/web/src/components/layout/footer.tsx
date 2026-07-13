import { Container } from "@/components/layout/container";
import Link from "next/link";

const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Skills", href: "/skills" },
  { label: "Projects", href: "/#projects" },
  { label: "Contact", href: "/#contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-background/80">
      <Container className="flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-foreground">Hari Handika Setiawan</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Full Stack Developer and Backend Engineer.
          </p>
        </div>

        <nav
          className="flex flex-wrap gap-x-5 gap-y-2"
          aria-label="Footer navigation"
        >
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
