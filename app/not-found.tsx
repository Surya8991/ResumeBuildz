'use client';

import Link from 'next/link';
import { FileText, Home, ArrowLeft } from 'lucide-react';
import { useLoginGateway } from '@/components/LoginGateway';

export default function NotFound() {
  const { openGateway } = useLoginGateway();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white px-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">
            Resume<span className="text-blue-400">Forge</span>
          </span>
        </Link>

        {/* 404 */}
        <h1 className="text-7xl md:text-8xl font-bold mb-4 bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
        <p className="text-gray-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            <Home className="h-4 w-4" /> Back to Home
          </Link>
          <button
            onClick={() => openGateway('/builder')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-700 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Open Builder
          </button>
        </div>

        {/* Helpful links */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-500 mb-3">Popular pages:</p>
          <div className="flex flex-wrap gap-3 justify-center text-sm">
            <Link href="/templates" className="text-gray-400 hover:text-white transition-colors">
              Templates
            </Link>
            <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/ats-guide" className="text-gray-400 hover:text-white transition-colors">
              ATS Guide
            </Link>
            <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
