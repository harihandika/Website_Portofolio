import { PublicLayout } from "@/components/layout/public-layout";
import "./globals.css";

export const metadata = {
  title: "Hari Handika Setiawan",
  description:
    "Personal portfolio and interactive CV for Hari Handika Setiawan.",
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
