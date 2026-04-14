'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';

export default function ContactPage() {
  useEffect(() => {
    document.title = 'Contact Us - ResumeForge';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'Get in touch with the ResumeForge team. Report bugs, request features, or inquire about commercial licensing.');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', 'Get in touch with the ResumeForge team. Report bugs, request features, or inquire about commercial licensing.');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Contact Us - ResumeForge');
  }, []);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600 mb-4">Thank you for reaching out. We&apos;ll get back to you soon.</p>
                <button onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: 'General', message: '' }); }} className="text-blue-400 hover:underline text-sm">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input id="name" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <select id="subject" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white">
                    <option value="General">General</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Commercial Licensing">Commercial Licensing</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea id="message" required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none" placeholder="Your message..." />
                </div>
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors">
                  Send Message
                </button>
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
