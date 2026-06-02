'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, X, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

type UserDetail = {
  id: string;
  email: string;
  name: string;
  plan: string;
  role: string;
  managedBy: string | null;
  createdAt: string;
  lastSeenAt: string | null;
  aiRewritesUsed: number;
  aiRewritesResetDate: string | null;
  pdfExportsUsed: number;
  pdfExportsResetDate: string | null;
};

const PLANS = ['free', 'starter', 'pro', 'team', 'lifetime'];
const ROLES = ['user', 'admin', 'superadmin'];

const today = () => new Date().toISOString().slice(0, 10);

export default function AdminUserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const { profile: myProfile } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // managedBy assignment state (superadmin only)
  const [adminInput, setAdminInput] = useState('');
  const [managedByEmail, setManagedByEmail] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/users/${userId}`)
      .then((r) => r.json())
      .then((data: UserDetail) => {
        setUser(data);
        setLoading(false);
        // Fetch the managing admin's email for display
        if (data.managedBy) {
          fetch(`/api/admin/users/${data.managedBy}`)
            .then((r) => r.ok ? r.json() : null)
            .then((admin) => { if (admin?.email) setManagedByEmail(admin.email); })
            .catch(() => {});
        }
      })
      .catch(() => setLoading(false));
  }, [userId]);

  async function patch(body: Record<string, unknown>) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Update failed'); return; }
      setUser((u) => u ? { ...u, ...body } as UserDetail : u);
      toast.success('Saved');
    } finally {
      setSaving(false);
    }
  }

  async function handleAssignAdmin() {
    const id = adminInput.trim();
    if (!id) return;
    await patch({ managedBy: id });
    // Refresh the admin email label
    fetch(`/api/admin/users/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((admin) => setManagedByEmail(admin?.email ?? id))
      .catch(() => setManagedByEmail(id));
    setAdminInput('');
  }

  async function handleUnassignAdmin() {
    await patch({ managedBy: null });
    setManagedByEmail(null);
  }

  async function handleDelete() {
    if (!user) return;
    const confirmed = window.confirm(
      `Permanently delete ${user.email}?\n\nThis cannot be undone. All their data will be erased.`,
    );
    if (!confirmed) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Delete failed'); return; }
      toast.success('User deleted');
      router.push('/admin/users');
    } finally {
      setSaving(false);
    }
  }

  async function handleImpersonate() {
    const res = await fetch('/api/admin/impersonate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    if (!res.ok) { toast.error(data.error ?? 'Impersonation failed'); return; }
    window.location.href = data.redirectTo ?? '/';
  }

  if (loading) {
    return <div className="mx-auto max-w-2xl px-4 py-8 text-gray-400">Loading…</div>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <p className="text-red-500">User not found.</p>
        <Link href="/admin/users" className="text-sm text-indigo-600 hover:underline">← Back to users</Link>
      </div>
    );
  }

  const isSuperadmin = myProfile?.role === 'superadmin';
  const aiUsed = user.aiRewritesResetDate === today() ? (user.aiRewritesUsed ?? 0) : 0;
  const pdfUsed = user.pdfExportsResetDate === today() ? (user.pdfExportsUsed ?? 0) : 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link href="/admin/users" className="mb-6 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Back to users
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-gray-100 px-6 py-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{user.name || user.email}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <div className="mt-1 flex gap-1.5">
              <RoleBadge role={user.role} />
              <PlanBadge plan={user.plan} />
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="divide-y divide-gray-50 px-6">
          <Field label="Plan">
            <select
              value={user.plan}
              onChange={(e) => patch({ plan: e.target.value })}
              disabled={saving}
              className="rounded border border-gray-200 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
            >
              {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </Field>

          {isSuperadmin && (
            <Field label="Role">
              <select
                value={user.role}
                onChange={(e) => patch({ role: e.target.value })}
                disabled={saving}
                className="rounded border border-gray-200 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
              >
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
          )}

          {isSuperadmin && (
            <div className="py-3">
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium text-gray-500 w-36 shrink-0 pt-1">Assigned admin</span>
                <div className="flex-1 text-right">
                  {user.managedBy ? (
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm text-gray-700 truncate max-w-[180px]" title={user.managedBy}>
                        {managedByEmail ?? user.managedBy}
                      </span>
                      <button
                        onClick={handleUnassignAdmin}
                        disabled={saving}
                        title="Unassign"
                        className="shrink-0 rounded border border-red-200 bg-red-50 p-0.5 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-40"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm text-gray-400">None</span>
                      <input
                        value={adminInput}
                        onChange={(e) => setAdminInput(e.target.value)}
                        placeholder="Admin user ID"
                        className="w-40 rounded border border-gray-200 px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAssignAdmin(); }}
                      />
                      <button
                        onClick={handleAssignAdmin}
                        disabled={saving || !adminInput.trim()}
                        className="shrink-0 rounded border border-indigo-200 bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition-colors disabled:opacity-40"
                      >
                        Assign
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <Field label="Joined">
            {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Field>

          <Field label="Last seen">
            {user.lastSeenAt
              ? new Date(user.lastSeenAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
              : '—'}
          </Field>

          <Field label="AI rewrites today">{aiUsed} used</Field>
          <Field label="PDF exports today">{pdfUsed} used</Field>
        </div>

        {/* Actions */}
        <div className="px-6 py-5 border-t border-gray-100 flex items-center gap-3 flex-wrap">
          {user.role === 'user' && (
            <button
              onClick={handleImpersonate}
              className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100 transition-colors"
            >
              🎭 Impersonate User
            </button>
          )}
          {user.role !== 'superadmin' && (
            <button
              onClick={handleDelete}
              disabled={saving}
              className="ml-auto flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4" />
              Delete User
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm font-medium text-gray-500 w-36 shrink-0">{label}</span>
      <span className="text-sm text-gray-800">{children}</span>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const cls = role === 'superadmin'
    ? 'bg-purple-100 text-purple-700 border border-purple-200'
    : role === 'admin'
    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
    : 'bg-gray-100 text-gray-600 border border-gray-200';
  return <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${cls}`}>{role}</span>;
}

function PlanBadge({ plan }: { plan: string }) {
  const cls = plan === 'lifetime' ? 'bg-amber-100 text-amber-700'
    : plan === 'team' ? 'bg-blue-100 text-blue-700'
    : plan === 'pro' ? 'bg-emerald-100 text-emerald-700'
    : plan === 'starter' ? 'bg-teal-100 text-teal-700'
    : 'bg-gray-100 text-gray-500';
  return <span className={`inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold ${cls}`}>{plan}</span>;
}
