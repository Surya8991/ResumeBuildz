import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { createAuthMiddleware } from 'better-auth/api';
import { db } from '@/lib/db';
import { user, session, account, verification, profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sendEmail } from '@/lib/email';
import {
  welcomeEmail,
  verifyEmail,
  resetPasswordEmail,
  passwordChangedEmail,
  changeEmailConfirmEmail,
  accountDeletedEmail,
} from '@/lib/emails/templates';

// Sends the branded welcome email. Shared by the social-signup path
// (create.after, already verified) and the credential path (after the user
// verifies their email) so each user receives exactly one welcome.
async function sendWelcome(to: string, name: string | null | undefined) {
  const { subject, html } = welcomeEmail(name || '');
  await sendEmail({ to, subject, html });
}

const isProd = process.env.NODE_ENV === 'production';

function createAuth() {
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema: { user, session, account, verification },
    }),

    secret: process.env.BETTER_AUTH_SECRET!,
    baseURL: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://resumebuildz.tech',

    trustedOrigins: [
      'https://resumebuildz.tech',
      'https://www.resumebuildz.tech',
      // Dev only: allow any localhost port so the dev server works regardless
      // of which port Next picks (3000, 3847, etc.). Never widened in prod.
      ...(isProd ? [] : ['http://localhost:*']),
    ],

    emailAndPassword: {
      enabled: true,
      async sendResetPassword({ user, url }) {
        // No-ops when RESEND_API_KEY is unset; never throws.
        const { subject, html } = resetPasswordEmail(url);
        await sendEmail({ to: user.email, subject, html });
      },
      // Security alert after a successful password reset.
      async onPasswordReset({ user }) {
        const { subject, html } = passwordChangedEmail(user.name || '');
        await sendEmail({ to: user.email, subject, html });
      },
    },

    // Email verification. sendOnSignUp fires for email/password signups; social
    // signups arrive pre-verified so Better Auth skips them. Verification is not
    // required to sign in (non-breaking) — the link just confirms the address.
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      async sendVerificationEmail({ user, url }) {
        const { subject, html } = verifyEmail(url);
        await sendEmail({ to: user.email, subject, html });
      },
    },

    user: {
      // Let users change their email; a confirmation goes to the CURRENT address
      // and a verification to the new one (via sendVerificationEmail above).
      changeEmail: {
        enabled: true,
        async sendChangeEmailConfirmation({ user, newEmail, url }) {
          const { subject, html } = changeEmailConfirmEmail({ newEmail, url });
          await sendEmail({ to: user.email, subject, html });
        },
      },
      // Enables auth.api.deleteUser (used by /api/account/delete). No verification
      // step so deletion stays immediate; afterDelete sends a confirmation email.
      deleteUser: {
        enabled: true,
        async afterDelete(deletedUser) {
          const { subject, html } = accountDeletedEmail(deletedUser.name || '');
          await sendEmail({ to: deletedUser.email, subject, html });
        },
      },
    },

    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },

    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
      // freshAge 0 disables Better Auth's "fresh session" requirement for ALL
      // sensitive ops (notably deleteUser AND changeEmail), not just one.
      // Rationale: both are initiated only from the authenticated /account
      // settings page, and our server-side delete (auth.api.deleteUser, no
      // password) would otherwise throw SESSION_EXPIRED on sessions older than
      // the default freshAge, silently breaking account deletion. Change-email
      // still requires email verification of the new address, so dropping the
      // freshness gate here does not weaken that flow.
      freshAge: 0,
    },

    // Request-lifecycle hook: Better Auth's changePassword endpoint has no
    // dedicated callback, so we send the security alert here when an
    // authenticated user changes their password. Reaching the `after` hook
    // means the endpoint succeeded; guarded so a failure can't break the request.
    hooks: {
      after: createAuthMiddleware(async (ctx) => {
        if (ctx.path !== '/change-password') return;
        try {
          const u = ctx.context.session?.user;
          if (u?.email) {
            const { subject, html } = passwordChangedEmail(u.name || '');
            await sendEmail({ to: u.email, subject, html });
          }
        } catch (e) {
          console.error('[auth] password-changed alert failed:', e);
        }
      }),
    },

    databaseHooks: {
      user: {
        create: {
          after: async (newUser) => {
            await db.insert(profiles).values({ id: newUser.id, lastSeenAt: new Date() }).onConflictDoNothing();
            // Bootstrap superadmin: comma-separated list of emails that are
            // auto-promoted on first signup. e.g. SUPERADMIN_EMAIL=a@x.com,b@x.com
            const superadminEmails = (process.env.SUPERADMIN_EMAIL ?? '')
              .split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
            if (superadminEmails.includes(newUser.email.toLowerCase())) {
              await db.update(profiles).set({ role: 'superadmin' }).where(eq(profiles.id, newUser.id)).catch(() => {});
            }
            // Welcome every new user immediately, regardless of signup method or
            // verification state. (Email/password users may also receive a
            // separate verification email — an acceptable duplicate, far better
            // than missing the welcome if they never verify.)
            // No-ops without RESEND_API_KEY and never throws.
            await sendWelcome(newUser.email, newUser.name);
          },
        },
      },
    },
  });
}

// Lazy singleton — defers initialization until first use so the module
// can be imported during CI builds without DATABASE_URL / auth secrets.
// The `has` trap is required: toNextJsHandler() does `"handler" in auth`
// to decide whether `auth` is the instance or the raw handler. Without it,
// `in` hits the empty target, returns false, and the handler is invoked as
// a function — throwing "auth is not a function".
let _auth: ReturnType<typeof createAuth> | undefined;
function getAuth() {
  if (!_auth) _auth = createAuth();
  return _auth;
}
export const auth = new Proxy({} as ReturnType<typeof createAuth>, {
  get(_target, prop, receiver) {
    return Reflect.get(getAuth(), prop, receiver);
  },
  has(_target, prop) {
    return Reflect.has(getAuth(), prop);
  },
});
