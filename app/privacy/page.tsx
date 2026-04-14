'use client';

import { useEffect } from 'react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';

const sections = [
  {
    title: 'Data Collection',
    content: "We don't collect any data. Not some data -- zero data. ResumeForge runs entirely in your browser. There are no servers storing your information, no databases with your resume, and no analytics tracking what you do. This isn't a marketing claim; it's how the app is built.",
  },
  {
    title: 'Local Storage',
    content: "ResumeForge uses your browser's localStorage to save your work locally on your device. This includes your resume data (personal information, experience, education, skills, etc.), your API key for AI features (if you choose to use them), and your theme preference (light/dark mode). This data never leaves your browser and is stored only on your device. You can clear this data at any time through your browser settings.",
  },
  {
    title: 'Third-Party Services',
    content: 'ResumeForge offers an optional AI-powered feature that uses the Groq API. This feature requires your own API key, which you obtain directly from Groq. When you use this feature, your resume data is sent directly from your browser to Groq\'s servers  -  it never passes through our servers. We do not have access to your API key or the data you send to Groq. Please review Groq\'s privacy policy for information about how they handle your data.',
  },
  {
    title: 'Cookies',
    content: "We don't use cookies. Not first-party cookies, not third-party cookies, not tracking cookies. None.",
  },
  {
    title: 'Analytics',
    content: "We don't track you. No analytics scripts, no pixel trackers, no heatmaps, no session recordings. We genuinely don't know how many people use ResumeForge, and we're fine with that.",
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
  useEffect(() => {
    document.title = 'Privacy Policy - ResumeForge';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'ResumeForge privacy policy. We don\'t collect data, use cookies, or track users. All resume data stays in your browser.');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', 'ResumeForge privacy policy. We don\'t collect data, use cookies, or track users. All resume data stays in your browser.');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Privacy Policy - ResumeForge');
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">Privacy Policy</h1>
          <p className="text-xl text-gray-300 animate-fade-in-up delay-100">Last updated: April 14, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          {sections.map((section, i) => (
            <div key={section.title} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-fade-in-up delay-${Math.min((i + 1) * 100, 500)}`}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
