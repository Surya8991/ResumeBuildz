'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Search, Users, Download, TrendingUp, UserCheck, Zap, Calendar, Sparkles, FileDown, MoonStar, History } from 'lucide-react';

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

type Stats = {
  total: number;
  paid: number;
  free: number;
  newToday: number;
  newThisWeek: number;
  activeLast7d: number;
  byPlan: Record<string, number>;
  aiRewritesToday: number;
  pdfExportsToday: number;
  inactive30d: number;
};

type AuditEntry = {
  id: string;
  action: string;
  createdAt: string;
  metadata: Record<string, unknown> | null;
  actorEmail: string | null;
  actorName: string | null;
  targetUserId: string | null;
  targetEmail: string | null;
};

const PLAN_ORDER = ['free', 'starter', 'pro', 'team', 'lifetime'];
const PLAN_BAR_COLOR: Record<string, string> = {
  free: 'bg-gray-400',
  starter: 'bg-teal-500',
  pro: 'bg-emerald-500',
  team: 'bg-blue-500',
  lifetime: 'bg-amber-500',
};

const ACTION_LABEL: Record<string, string> = {
  'role.change': 'Changed role',
  'plan.change': 'Changed plan',
  'managedBy.change': 'Reassigned admin',
  'user.delete': 'Deleted user',
  'user.impersonate': 'Impersonated',
  'broadcast.send': 'Broadcast email',
};

const PLANS = ['', 'free', 'starter', 'pro', 'team', 'lifetime'];
const ROLES = ['', 'user', 'admin', 'superadmin'];
const SORTS = [
  { value: 'createdAt:desc', label: 'Newest first' },
  { value: 'createdAt:asc', label: 'Oldest first' },
  { value: 'lastSeen:desc', label: 'Recently active' },
  { value: 'lastSeen:asc', label: 'Least active' },
];

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

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          {icon}
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 leading-tight">{value.toLocaleString()}</p>
          {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [view, setView] = useState<'all' | 'inactive'>('all');
  const [inactiveTotal, setInactiveTotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortVal, setSortVal] = useState('createdAt:desc');
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setStats(d); })
      .catch(() => {});
    fetch('/api/admin/audit')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.entries) setAudit(d.entries); })
      .catch(() => {});
  }, []);

  const fetchUsers = useCallback(async (query: string, pg: number, plan: string, role: string, sv: string) => {
    setLoading(true);
    try {
      const [sort, order] = sv.split(':');
      const params = new URLSearchParams({ q: query, page: String(pg), sort, order });
      if (plan) params.set('plan', plan);
      if (role) params.set('role', role);
      const res = await fetch(`/api/admin/users?${params}`);
      if (!res.ok) return;
      const data = await res.json();
      setUsers(data.users);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInactive = useCallback(async (pg: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/inactive?page=${pg}&days=30`);
      if (!res.ok) return;
      const data = await res.json();
      setUsers(data.users);
      setInactiveTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view === 'inactive') fetchInactive(page);
    else fetchUsers(q, page, planFilter, roleFilter, sortVal);
  }, [page, planFilter, roleFilter, sortVal, view]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSearch(value: string) {
    setQ(value);
    setPage(1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchUsers(value, 1, planFilter, roleFilter, sortVal), 300);
  }

  function handleFilter(plan: string, role: string, sv: string) {
    setPlanFilter(plan);
    setRoleFilter(role);
    setSortVal(sv);
    setPage(1);
  }

  const displayedTotal = view === 'inactive' ? inactiveTotal : total;
  const totalPages = Math.max(1, Math.ceil(displayedTotal / 50));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Stats */}
      {stats && (
        <>
          <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard icon={<Users className="h-4 w-4" />} label="Total users" value={stats.total} />
            <StatCard icon={<TrendingUp className="h-4 w-4" />} label="Paid" value={stats.paid} sub={`${stats.free} free`} />
            <StatCard icon={<UserCheck className="h-4 w-4" />} label="Active 7d" value={stats.activeLast7d} />
            <StatCard icon={<Zap className="h-4 w-4" />} label="New today" value={stats.newToday} />
            <StatCard icon={<Calendar className="h-4 w-4" />} label="This week" value={stats.newThisWeek} />
          </div>
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <StatCard icon={<Sparkles className="h-4 w-4" />} label="AI rewrites today" value={stats.aiRewritesToday} />
            <StatCard icon={<FileDown className="h-4 w-4" />} label="PDF exports today" value={stats.pdfExportsToday} />
            <StatCard icon={<MoonStar className="h-4 w-4" />} label="Inactive 30d+" value={stats.inactive30d} />
          </div>

          {/* Plan distribution */}
          <div className="mb-8 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Plan distribution</h2>
            <div className="space-y-2">
              {PLAN_ORDER.map((p) => {
                const count = stats.byPlan[p] ?? 0;
                const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                return (
                  <div key={p} className="flex items-center gap-3 text-xs">
                    <span className="w-16 text-gray-500 capitalize">{p}</span>
                    <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full ${PLAN_BAR_COLOR[p] ?? 'bg-gray-400'} transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-24 text-right text-gray-600 tabular-nums">
                      {count.toLocaleString()} · {pct.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* View tabs */}
      <div className="mb-4 flex items-center gap-1 border-b border-gray-200">
        <button
          onClick={() => { setView('all'); setPage(1); }}
          className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${view === 'all' ? 'border-indigo-500 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          All users
        </button>
        <button
          onClick={() => { setView('inactive'); setPage(1); }}
          className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${view === 'inactive' ? 'border-indigo-500 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Inactive 30d+ {stats && stats.inactive30d > 0 && <span className="ml-1 inline-flex items-center justify-center rounded-full bg-amber-100 text-amber-700 text-[10px] font-semibold px-1.5">{stats.inactive30d}</span>}
        </button>
      </div>

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">{view === 'inactive' ? 'Inactive users (30d+)' : 'Users'}</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">{displayedTotal.toLocaleString()} results</span>
          <button
            onClick={() => { window.location.href = '/api/admin/users/export'; }}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      {view === 'all' && (
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search by email or name…"
            value={q}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
        </div>
        <select
          value={planFilter}
          onChange={(e) => handleFilter(e.target.value, roleFilter, sortVal)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        >
          <option value="">All plans</option>
          {PLANS.slice(1).map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select
          value={roleFilter}
          onChange={(e) => handleFilter(planFilter, e.target.value, sortVal)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        >
          <option value="">All roles</option>
          {ROLES.slice(1).map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select
          value={sortVal}
          onChange={(e) => handleFilter(planFilter, roleFilter, e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        >
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Last seen</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-400">Loading…</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-400">No users found</td>
              </tr>
            ) : users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800 max-w-[200px] truncate">{u.email}</td>
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
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded border border-gray-200 px-3 py-1 disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            ← Prev
          </button>
          <span className="text-gray-500">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded border border-gray-200 px-3 py-1 disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            Next →
          </button>
        </div>
      )}

      {/* Recent admin activity */}
      <div className="mt-10">
        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <History className="h-4 w-4" /> Recent admin activity
        </h2>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {audit.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-gray-400">No admin actions recorded yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="px-4 py-2.5">When</th>
                  <th className="px-4 py-2.5">Actor</th>
                  <th className="px-4 py-2.5">Action</th>
                  <th className="px-4 py-2.5">Target</th>
                  <th className="px-4 py-2.5">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {audit.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-2 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(e.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-700 max-w-[180px] truncate">
                      {e.actorEmail || '—'}
                    </td>
                    <td className="px-4 py-2 text-xs">
                      <span className="inline-flex rounded bg-indigo-50 text-indigo-700 px-1.5 py-0.5 font-medium">
                        {ACTION_LABEL[e.action] ?? e.action}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-600 max-w-[180px] truncate">
                      {e.targetEmail || (e.targetUserId ? <span className="text-gray-400">(deleted)</span> : '—')}
                    </td>
                    <td className="px-4 py-2 text-xs text-gray-500 font-mono max-w-[260px] truncate">
                      {e.metadata ? JSON.stringify(e.metadata) : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
