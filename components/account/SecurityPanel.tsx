'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext as useAuth } from '@/components/Providers';
import { authClient } from '@/lib/auth-client';
import { passwordSchema } from '@/lib/accountSchema';
import { Field, SaveBar, inputCls, useSaveState } from './shared';

export default function SecurityPanel() {
  const { signOut } = useAuth();
  const router = useRouter();

  const pwSave = useSaveState();
  const [pw, setPw] = useState({ new_password: '', confirm_password: '' });
  const [pwFieldErrors, setPwFieldErrors] = useState<Record<string, string>>({});

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwFieldErrors({});
    const parsed = passwordSchema.safeParse(pw);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const iss of parsed.error.issues) errs[iss.path.join('.')] = iss.message;
      setPwFieldErrors(errs);
      return;
    }
    pwSave.start();
    const { error: upErr } = await authClient.changePassword({
      newPassword: parsed.data.new_password,
      currentPassword: '',
      revokeOtherSessions: false,
    });
    pwSave.done(upErr?.message || null);
    if (!upErr) setPw({ new_password: '', confirm_password: '' });
  }

  async function handleSignOutEverywhere() {
    if (!confirm('Sign out from all devices? You will need to log in again on every browser.')) return;
    await authClient.revokeOtherSessions();
    await signOut();
    router.replace('/login');
  }

  async function connectGoogle() {
    await authClient.linkSocial({ provider: 'google' });
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Security</h2>

      <section className="mb-10">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Change password</h3>
        <form onSubmit={handlePasswordChange} className="grid sm:grid-cols-2 gap-4">
          <Field label="New password" hint="Minimum 8 characters" error={pwFieldErrors['new_password']}>
            <input type="password" minLength={8} maxLength={72} value={pw.new_password} onChange={(e) => setPw({ ...pw, new_password: e.target.value })} className={inputCls} autoComplete="new-password" required />
          </Field>
          <Field label="Confirm password" error={pwFieldErrors['confirm_password']}>
            <input type="password" value={pw.confirm_password} onChange={(e) => setPw({ ...pw, confirm_password: e.target.value })} className={inputCls} autoComplete="new-password" required />
          </Field>
          <div className="sm:col-span-2">
            <SaveBar saving={pwSave.saving} saved={pwSave.saved} error={pwSave.error} />
          </div>
        </form>
      </section>

      <section className="mb-10">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Connected accounts</h3>
        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
          <span className="text-sm text-gray-900">Google</span>
          <button onClick={connectGoogle} className="text-xs text-indigo-600 font-medium hover:underline">Connect</button>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Sessions</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={async () => { await signOut(); router.replace('/'); }} className="border border-gray-300 hover:border-gray-400 text-sm font-medium px-4 py-2 rounded-lg">
            Sign out this device
          </button>
          <button onClick={handleSignOutEverywhere} className="border border-red-200 hover:border-red-300 text-red-700 text-sm font-medium px-4 py-2 rounded-lg">
            Sign out everywhere
          </button>
        </div>
      </section>
    </div>
  );
}
