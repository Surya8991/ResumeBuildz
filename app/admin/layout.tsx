import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin — ResumeBuildz',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/');

  const [profile] = await db
    .select({ role: profiles.role })
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1);

  if (!profile || profile.role !== 'superadmin') redirect('/');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-6xl flex items-center gap-1 px-4 py-3">
          <span className="mr-4 text-[11px] font-bold uppercase tracking-widest text-purple-600">⚡ Superadmin</span>
          <Link href="/admin/users" className="rounded px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            Users
          </Link>
          <div className="ml-auto">
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              ← Back to app
            </Link>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
