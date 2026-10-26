import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const title = "Jeff Fontenot | Cloud & DevOps Engineer";
const description =
  "Cloud and DevOps engineer in New Orleans with an active Secret clearance, building Terraform, Kubernetes, CI/CD, and observability projects.";

export const metadata: Metadata = {
  metadataBase: new URL("https://jeff.itodyssey.io"),
  title,
  description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    url: "https://jeff.itodyssey.io",
    siteName: "Jeff Fontenot",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport = {
  themeColor: "#08090d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://api.github.com" />
        <link rel="preconnect" href="https://github-contributions-api.jogruber.de" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
