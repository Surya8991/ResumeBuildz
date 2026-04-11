'use client';

import { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '/home', label: 'Home' },
  { href: '/templates', label: 'Templates' },
  { href: '/ats-guide', label: 'ATS Guide' },
  { href: '/resume-tips', label: 'Resume Tips' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const sections = [
  {
    title: 'Data Collection',
    content: "We don't collect any data. Period. ResumeForge is a fully client-side application that runs entirely in your browser. We have no servers collecting your information, no databases storing your data, and no analytics tracking your behavior.",
  },
  {
    title: 'Local Storage',
    content: "ResumeForge uses your browser's localStorage to save your work locally on your device. This includes your resume data (personal information, experience, education, skills, etc.), your API key for AI features (if you choose to use them), and your theme preference (light/dark mode). This data never leaves your browser and is stored only on your device. You can clear this data at any time through your browser settings.",
  },
  {
    title: 'Third-Party Services',
    content: 'ResumeForge offers an optional AI-powered feature that uses the Groq API. This feature requires your own API key, which you obtain directly from Groq. When you use this feature, your resume data is sent directly from your browser to Groq\'s servers — it never passes through our servers. We do not have access to your API key or the data you send to Groq. Please review Groq\'s privacy policy for information about how they handle your data.',
  },
  {
    title: 'Cookies',
    content: "We don't use cookies. Not first-party cookies, not third-party cookies, not tracking cookies. None.",
  },
  {
    title: 'Analytics',
    content: "We don't track you. There are no analytics scripts, no pixel trackers, no heatmaps, and no session recordings. We have no idea how many people use ResumeForge, and we're fine with that.",
  },
  {
    title: 'Data Security',
    content: 'All your data lives in your browser and is never transmitted to our servers. Since we don\'t collect or store any data, there\'s no risk of a data breach on our end. Your resume information stays on your device, under your control. We recommend keeping your browser updated to the latest version for the best security.',
  },
  {
    title: "Children's Privacy",
    content: 'ResumeForge is not directed at children under the age of 13. We do not knowingly collect personal information from children. Since we don\'t collect any data at all, this is inherently enforced by our architecture.',
  },
  {
    title: 'Changes to This Policy',
    content: 'We may update this privacy policy from time to time. Any changes will be reflected on this page with an updated revision date. Since we don\'t collect your email or any contact information, we cannot notify you of changes directly. We encourage you to review this page periodically.',
  },
  {
    title: 'Contact',
    content: 'If you have any questions about this privacy policy or ResumeForge\'s data practices, please contact us at Suryaraj8147@gmail.com.',
  },
];

export default function PrivacyPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/home" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-white font-bold text-xl">ResumeForge</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-gray-300 hover:text-white text-sm transition-colors">
                  {link.label}
                </Link>
              ))}
              <Link href="/" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Build Resume
              </Link>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-300 hover:text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block text-gray-300 hover:text-white text-sm py-2 transition-colors">
                  {link.label}
                </Link>
              ))}
              <Link href="/" className="block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center transition-colors">
                Build Resume
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-300">Last updated: April 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 mt-auto">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-white font-bold text-lg">ResumeForge</span>
            </div>
            <p className="text-sm">Build professional, ATS-optimized resumes right in your browser.</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Product</h3>
            <div className="space-y-2 text-sm">
              <Link href="/home" className="block hover:text-white transition-colors">Home</Link>
              <Link href="/templates" className="block hover:text-white transition-colors">Templates</Link>
              <Link href="/" className="block hover:text-white transition-colors">Build Resume</Link>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Resources</h3>
            <div className="space-y-2 text-sm">
              <Link href="/ats-guide" className="block hover:text-white transition-colors">ATS Guide</Link>
              <Link href="/resume-tips" className="block hover:text-white transition-colors">Resume Tips</Link>
              <Link href="/faq" className="block hover:text-white transition-colors">FAQ</Link>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Legal</h3>
            <div className="space-y-2 text-sm">
              <Link href="/privacy" className="block hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/about" className="block hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="block hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-sm text-center">
          &copy; {new Date().getFullYear()} ResumeForge. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
