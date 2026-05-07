import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Full Stack Internship Tracker",
  description: "A 1-year internship readiness dashboard for full-stack developers."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
