import { PublicLayout } from "@/components/layout/public-layout";
import "./globals.css";
import "@fontsource-variable/space-grotesk";
import "./workshop.css";

export const metadata = {
  title: "Hari Handika Setiawan | Software Engineer",
  description:
    "Explore Hari Handika Setiawan's experience connecting MCFrame ERP, manufacturing systems and shop-floor devices in North Jakarta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
