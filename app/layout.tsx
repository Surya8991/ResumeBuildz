import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import PageLoader from "@/components/PageLoader";
import { Analytics } from "@vercel/analytics/react";
import { SITE_URL } from "@/lib/siteConfig";
import { jsonLd } from "@/lib/articleSchema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  title: "ResumeBuildz by Surya L - Free ATS-Friendly Resume Generator",
  description: "Create professional, ATS-optimized resumes with 20 templates, AI writing assistant, cover letter builder, and JD keyword matcher. Free to start, no sign-up required. Built by Surya L.",
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
    locale: "en_IN",
    url: siteUrl,
    siteName: "ResumeBuildz",
    title: "ResumeBuildz - Free ATS Resume Builder with 20 Templates & AI",
    description: "Build professional resumes in minutes. 20 ATS-optimized templates, AI writing assistant, cover letter builder, JD keyword matcher. Free to start, no sign-up required.",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "ResumeBuildz - Free ATS-Friendly Resume Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumeBuildz - Free ATS Resume Builder",
    description: "20 templates, AI writing assistant, cover letter builder. No sign-up required.",
    images: [`${siteUrl}/opengraph-image`],
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
        <meta name="theme-color" content="#2563eb" />
        {/* Modern + Apple-specific PWA install hints. Chrome/Android uses
            `mobile-web-app-capable`; Safari still needs the `apple-`
            prefix for legacy parity. Keeping both silences the console
            deprecation warning without dropping iOS support. */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ResumeBuildz" />
        {/* Apply dark mode class before first paint to avoid FOUC.
            Plain inline script in <head> runs synchronously at HTML parse time,
            before React hydration — no flash, no React script-in-component warning. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('resumeforge-dark')==='1')document.documentElement.classList.add('dark');}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  name: "ResumeBuildz",
                  url: siteUrl,
                  description: "Free ATS-friendly resume builder with 20 templates, AI writing assistant, and ATS score checker.",
                },
                {
                  "@type": "WebApplication",
                  name: "ResumeBuildz",
                  url: siteUrl,
                  applicationCategory: "BusinessApplication",
                  operatingSystem: "Web",
                  description: "Free ATS-friendly resume builder with 20 templates, Groq AI writing assistant, 12-point ATS score checker, and multi-format export. No sign-up required.",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                  },
                  featureList: [
                    "20 ATS-friendly resume templates",
                    "AI-powered writing assistant",
                    "ATS score checker",
                    "PDF, DOCX, HTML export",
                    "Cover letter builder",
                    "No sign-up required",
                  ],
                  author: {
                    "@type": "Person",
                    name: "Surya L",
                    url: "https://github.com/Surya8991",
                  },
                },
                {
                  "@type": "Organization",
                  name: "ResumeBuildz",
                  url: siteUrl,
                  logo: `${siteUrl}/icon-512.svg`,
                  founder: {
                    "@type": "Person",
                    name: "Surya L",
                  },
                  sameAs: [
                    "https://github.com/Surya8991/ResumeBuildz",
                  ],
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>
          <PageLoader />
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
