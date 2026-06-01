'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Search, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

type UserRow = {
  id: string;
  email: string;
  name: string;
  plan: string;
  role: string;
  managedBy: string | null;
  createdAt: string;
  lastSeenAt: string | null;
};

const ROLE_BADGE: Record<string, string> = {
  superadmin: 'bg-purple-100 text-purple-700 border border-purple-200',
  admin: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
  user: 'bg-gray-100 text-gray-600 border border-gray-200',
};

const PLAN_BADGE: Record<string, string> = {
  lifetime: 'bg-amber-100 text-amber-700',
  team: 'bg-blue-100 text-blue-700',
  pro: 'bg-emerald-100 text-emerald-700',
  starter: 'bg-teal-100 text-teal-700',
  free: 'bg-gray-100 text-gray-500',
};

export default function AdminUsersPage() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchUsers = useCallback(async (query: string, pg: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ q: query, page: String(pg) });
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) return;
      const data = await res.json();
      setUsers(data.users);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(q, page);
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSearch(value: string) {
    setQ(value);
    setPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchUsers(value, 1), 300);
  }

  const totalPages = Math.max(1, Math.ceil(total / 50));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6" /> Admin Dashboard
          </h1>
          {profile && (
            <p className="mt-1 text-sm text-gray-500">
              Signed in as {profile.email}
              <span className={`ml-2 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${ROLE_BADGE[profile.role]}`}>
                {profile.role}
              </span>
            </p>
          )}
        </div>
        <span className="text-sm text-gray-500">Total: {total.toLocaleString()}</span>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="search"
          placeholder="Search users by email or name…"
          value={q}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Last seen</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading…</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">No users found</td>
              </tr>
            ) : users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800">{u.email}</td>
                <td className="px-4 py-3 text-gray-600">{u.name || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded px-1.5 py-0.5 text-[11px] font-semibold ${PLAN_BADGE[u.plan] ?? PLAN_BADGE.free}`}>
                    {u.plan}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded px-1.5 py-0.5 text-[11px] font-semibold ${ROLE_BADGE[u.role] ?? ROLE_BADGE.user}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {u.lastSeenAt ? new Date(u.lastSeenAt).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/users/${u.id}`}
                    className="rounded border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded border border-gray-200 px-3 py-1 disabled:opacity-40"
          >
            ← Prev
          </button>
          <span className="text-gray-500">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded border border-gray-200 px-3 py-1 disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
