'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import { submitContactMessage } from '@/lib/leads';

// Client-side rate limit: 3 submits per session per 5 minutes. Not a
// security control (bypassable with devtools) — a courtesy to slow down
// accidental double-submits and casual bots. Real rate limit lives on
// the server-side API route.
const SUBMIT_WINDOW_MS = 5 * 60 * 1000;
const SUBMIT_MAX = 3;

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General',
    message: '',
    // Hidden honeypot field. Real users leave blank; bots that auto-fill
    // every input will populate it, and we reject any submission that
    // arrives with website filled in.
    website: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    // Honeypot: bots fill every field. Silently succeed so the bot moves on.
    if (formData.website.trim() !== '') {
      setSubmitted(true);
      return;
    }
    // Client-side rate limit via sessionStorage timestamps.
    try {
      const raw = sessionStorage.getItem('contact-submit-log');
      const log: number[] = raw ? JSON.parse(raw) : [];
      const now = Date.now();
      const recent = log.filter((t) => now - t < SUBMIT_WINDOW_MS);
      if (recent.length >= SUBMIT_MAX) {
        setError('Too many submissions in a short window. Please wait a few minutes and retry.');
        return;
      }
      recent.push(now);
      sessionStorage.setItem('contact-submit-log', JSON.stringify(recent));
    } catch {
      // sessionStorage can fail in private-mode Safari; fall through.
    }

    setSubmitting(true);
    setError(null);

    const result = await submitContactMessage({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
    });

    setSubmitting(false);
    if (result.ok) {
      setSubmitted(true);
    } else {
      setError(result.error || 'Something went wrong. Please try again or email us directly.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteNavbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-900 to-black py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">Have a Bug? Feature Idea? Let&apos;s Chat.</h1>
          <p className="text-xl text-gray-300 animate-fade-in-up delay-100">We typically respond within 24 to 48 hours.</p>
        </div>
      </section>

      {/* Contact Card + Form */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          {/* Contact Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-fade-in-up delay-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <a href="mailto:Suryaraj8147@gmail.com" className="text-blue-400 hover:underline">Suryaraj8147@gmail.com</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">GitHub</h3>
                  <a href="https://github.com/Surya8991" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">github.com/Surya8991</a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 animate-scale-in delay-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
            {submitted ? (
              <div className="text-center py-12" role="status" aria-live="polite">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Message sent.</h3>
                <p className="text-gray-600 mb-4">Thanks. We read every message, usually within a day. If you need a faster response, email us at Suryaraj8147@gmail.com.</p>
                <button onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: 'General', message: '', website: '' }); }} className="text-indigo-600 hover:underline text-sm">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot: hidden from real users (CSS + aria-hidden +
                    tabIndex -1 + autocomplete=off). Bots filling every
                    field will populate this; handleSubmit rejects. */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
                  <label htmlFor="website">Website (leave blank)</label>
                  <input
                    id="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input id="name" type="text" required maxLength={100} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value.slice(0, 100) })} disabled={submitting} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none disabled:opacity-60" placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input id="email" type="email" required maxLength={254} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value.slice(0, 254) })} disabled={submitting} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none disabled:opacity-60" placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select id="subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} disabled={submitting} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none bg-white disabled:opacity-60">
                    <option value="General">General</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Commercial Licensing">Commercial Licensing</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                    <span className="text-xs text-gray-400 ml-2">{formData.message.length}/5000</span>
                  </label>
                  <textarea id="message" required rows={5} maxLength={5000} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value.slice(0, 5000) })} disabled={submitting} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none resize-none disabled:opacity-60" placeholder="Your message..." />
                </div>
                {error && (
                  <p role="alert" className="text-sm text-red-600">{error}</p>
                )}
                <button type="submit" disabled={submitting} aria-busy={submitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
                <p className="text-xs text-gray-500 text-center">We read every message, usually within a day.</p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Connect With Us</h2>
          <a href="https://github.com/Surya8991" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4 hover:shadow-md transition-shadow">
            <svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <div className="text-left">
              <div className="font-semibold text-gray-900">GitHub</div>
              <div className="text-sm text-gray-500">github.com/Surya8991</div>
            </div>
          </a>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Have Questions?</h2>
          <p className="text-gray-600 mb-6">Check out our frequently asked questions for quick answers.</p>
          <Link href="/faq" className="inline-flex items-center gap-2 text-blue-400 hover:underline font-medium">
            Visit our FAQ
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
