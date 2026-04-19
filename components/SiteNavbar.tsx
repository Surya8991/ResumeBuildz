'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Menu, X, ArrowRight, LogOut, User, ChevronDown, Settings, KeyRound, Crown, Download, Trash2 } from 'lucide-react';
import { useAuthContext as useAuth } from '@/components/Providers';
import { useLoginGateway } from '@/components/LoginGateway';

// Main nav. Clean, flat set of top-level links. Blog is a single link; the
// /blog hub has its own filter chips so a mega-dropdown here would duplicate
// that UI and clutter the header.
const NAV_LINKS = [
  { href: '/templates', label: 'Templates' },
  { href: '/cover-letter', label: 'Cover Letter' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
];

export default function SiteNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, profile, signOut, loading, isPro, exportUserData, deleteAccount } = useAuth();
  const { openGateway } = useLoginGateway();

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone. All your data will be permanently erased.')) return;
    if (!confirm('Last warning: This will permanently delete your account, profile, and all resume data. Continue?')) return;
    const { error } = await deleteAccount();
    if (error) alert('Failed to delete account: ' + error.message);
    else alert('Your account has been deleted.');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-sm">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-gray-900 font-bold text-lg">
              Resume<span className="text-blue-500">Buildz</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-blue-600 text-sm px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth + CTA + Mobile toggle */}
          <div className="flex items-center gap-1.5">
            {!loading && (
              user ? (
                <>
                  <button
                    onClick={() => openGateway('/builder')}
                    className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
                  >
                    Build Resume <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  {/* Profile dropdown - visible on all screens */}
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center gap-1.5 px-2 py-1.5 text-gray-700 hover:text-gray-900 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="h-7 w-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                        {(profile?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                      </div>
                      <ChevronDown className={`h-3 w-3 transition-transform hidden sm:block ${profileOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {profileOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                        <div className="absolute right-0 top-full mt-2 z-50 bg-white border border-gray-200 rounded-xl shadow-xl py-2 w-56 animate-in fade-in slide-in-from-top-1 duration-150">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900 truncate">{profile?.full_name || 'User'}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            {isPro() && (
                              <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold text-amber-600">
                                <Crown className="h-3 w-3" /> PRO
                              </span>
                            )}
                          </div>
                          <div className="py-1">
                            <button
                              onClick={() => { setProfileOpen(false); openGateway('/builder'); }}
                              className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors sm:hidden"
                            >
                              <ArrowRight className="h-3.5 w-3.5" /> Build Resume
                            </button>
                            <Link
                              href="/account"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                            >
                              <Settings className="h-3.5 w-3.5" /> Account settings
                            </Link>
                            <Link
                              href="/forgot-password"
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                            >
                              <KeyRound className="h-3.5 w-3.5" /> Reset Password
                            </Link>
                            {!isPro() && (
                              <Link
                                href="/pricing"
                                onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2 text-sm text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                              >
                                <Crown className="h-3.5 w-3.5" /> Upgrade to Pro
                              </Link>
                            )}
                          </div>
                          <div className="border-t border-gray-100 pt-1">
                            <button
                              onClick={() => { exportUserData(); setProfileOpen(false); }}
                              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors w-full"
                            >
                              <Download className="h-3.5 w-3.5" /> Export My Data
                            </button>
                            <button
                              onClick={() => { signOut(); setProfileOpen(false); }}
                              className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors w-full"
                            >
                              <LogOut className="h-3.5 w-3.5" /> Sign Out
                            </button>
                            <button
                              onClick={() => { handleDeleteAccount(); setProfileOpen(false); }}
                              className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors w-full"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Delete Account
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 px-3 py-2 text-gray-700 hover:text-blue-600 text-sm rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    <User className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Log in</span>
                  </Link>
                  <button
                    onClick={() => openGateway('/builder')}
                    className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
                  >
                    Get started free <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </>
              )
            )}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1 animate-fade-in-up">
            {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-gray-700 hover:text-blue-600 text-sm px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {link.label}
                </Link>
            ))}
            <Link
              href="/faq"
              onClick={() => setMobileOpen(false)}
              className="block text-gray-700 hover:text-blue-600 text-sm px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
            >
              FAQ
            </Link>
            <button
              onClick={() => { setMobileOpen(false); openGateway('/builder'); }}
              className="block w-full text-center mt-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600"
            >
              Get started free
            </button>
            {!loading && (
              user ? (
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="block w-full text-center mt-2 px-4 py-2 text-gray-700 text-sm rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  Sign out
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center mt-2 px-4 py-2 text-gray-700 text-sm rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  Log in
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
