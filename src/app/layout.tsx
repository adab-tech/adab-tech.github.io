import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adamu Abubakar — Computational Linguist & AI Researcher",
  description: "Official research platform, speech AI synthesis demo, and philology archive for Adamu Abubakar (adab-tech / adamu.tech).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-parchment-50 dark:bg-midnight-950 text-zinc-900 dark:text-zinc-50 antialiased selection:bg-amber-500/20">
        {children}
      </body>
    </html>
  );
}
