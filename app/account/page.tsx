'use client';

// Account page shell. Each tab is lazy-loaded via next/dynamic so Turbopack
// only compiles the panel the user opens. Keeps the initial route small and
// avoids the 90-second cold-compile we saw with one monolithic file.

import { useEffect, useState } from 'react';
// Metadata for /account lives in app/account/layout.tsx.
import dynamic from 'next/dynamic';
import {
  User as UserIcon,
  Briefcase,
  Sliders,
  Link as LinkIcon,
  Bell,
  Shield,
  CreditCard,
  Loader2,
  LogOut,
} from 'lucide-react';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import { useAuthContext as useAuth } from '@/components/Providers';
import { useRouter } from 'next/navigation';

const ProfilePanel = dynamic(() => import('@/components/account/ProfilePanel'), { ssr: false, loading: PanelSkeleton });
const JobSearchPanel = dynamic(() => import('@/components/account/JobSearchPanel'), { ssr: false, loading: PanelSkeleton });
const DefaultsPanel = dynamic(() => import('@/components/account/DefaultsPanel'), { ssr: false, loading: PanelSkeleton });
const LinksPanel = dynamic(() => import('@/components/account/LinksPanel'), { ssr: false, loading: PanelSkeleton });
const NotificationsPanel = dynamic(() => import('@/components/account/NotificationsPanel'), { ssr: false, loading: PanelSkeleton });
const SecurityPanel = dynamic(() => import('@/components/account/SecurityPanel'), { ssr: false, loading: PanelSkeleton });
const BillingPanel = dynamic(() => import('@/components/account/BillingPanel'), { ssr: false, loading: PanelSkeleton });

type TabId = 'profile' | 'job-search' | 'defaults' | 'links' | 'notifications' | 'security' | 'billing';

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'job-search', label: 'Job search', icon: Briefcase },
  { id: 'defaults', label: 'Builder defaults', icon: Sliders },
  { id: 'links', label: 'Links', icon: LinkIcon },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

function PanelSkeleton() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
    </div>
  );
}

export default function AccountPage() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<TabId>('profile');

  useEffect(() => {
    if (!loading && !user) router.replace('/login?next=/account');
  }, [loading, user, router]);

  if (loading || !user || !profile) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <SiteNavbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteNavbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Account settings</h1>
          <p className="text-sm text-gray-600 mt-1">
            Signed in as <strong className="text-gray-900">{user.email}</strong>
          </p>
        </header>

        <div className="grid md:grid-cols-[220px_1fr] gap-8">
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition whitespace-nowrap ${
                    active ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {t.label}
                </button>
              );
            })}
            <button
              onClick={async () => { await signOut(); router.replace('/'); }}
              className="hidden md:flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-100 mt-4 border-t pt-4"
            >
              <LogOut className="h-4 w-4 shrink-0" /> Sign out
            </button>
          </nav>

          <section className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 min-h-[420px]">
            {tab === 'profile' && <ProfilePanel />}
            {tab === 'job-search' && <JobSearchPanel />}
            {tab === 'defaults' && <DefaultsPanel />}
            {tab === 'links' && <LinksPanel />}
            {tab === 'notifications' && <NotificationsPanel />}
            {tab === 'security' && <SecurityPanel />}
            {tab === 'billing' && <BillingPanel />}
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
