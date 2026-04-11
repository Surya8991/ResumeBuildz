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

const siteUrl = "https://surya8991.github.io/resumeforge";

export const metadata: Metadata = {
  title: "ResumeForge by Surya L - Free ATS-Friendly Resume Generator",
  description: "Create professional, ATS-optimized resumes with 20 templates, AI writing assistant, cover letter builder, and JD keyword matcher. 100% free, no sign-up required. Built by Surya L.",
  keywords: [
    "resume builder", "resume generator", "ATS resume", "ATS-friendly resume",
    "free resume builder", "resume maker", "CV builder", "cover letter generator",
    "resume templates", "professional resume", "AI resume writer",
    "job application", "career tools", "resume creator online",
  ],
  authors: [{ name: "Surya L", url: "https://github.com/Surya8991" }],
  creator: "Surya L",
  publisher: "Surya L",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "ResumeForge",
    title: "ResumeForge - Free ATS Resume Builder with 20 Templates & AI",
    description: "Build professional resumes in minutes. 20 ATS-optimized templates, AI writing assistant, cover letter builder, JD keyword matcher. No sign-up, 100% free.",
    images: [
      {
        url: `${siteUrl}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: "ResumeForge - Free ATS-Friendly Resume Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumeForge - Free ATS Resume Builder",
    description: "20 templates, AI writing assistant, cover letter builder. No sign-up required.",
    images: [`${siteUrl}/og-image.svg`],
    creator: "@surya_l",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icon-512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: { url: "/icon-192.svg", sizes: "192x192" },
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ResumeForge" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "ResumeForge",
              url: siteUrl,
              description: "Free ATS-friendly resume builder with 20 templates, AI writing assistant, and cover letter builder.",
              applicationCategory: "BusinessApplication",
              operatingSystem: "All",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Person",
                name: "Surya L",
                url: "https://github.com/Surya8991",
              },
              featureList: [
                "20 ATS-optimized resume templates",
                "AI-powered writing assistant",
                "Cover letter builder",
                "Job description keyword matcher",
                "Multi-format export (PDF, DOCX, HTML)",
                "Resume import (DOCX, TXT, MD, JSON)",
                "Dark/Light mode",
                "100% client-side, no data sent to servers",
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
