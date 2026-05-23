import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/lib/db';
import { user, session, account, verification, profiles } from '@/lib/db/schema';
import { sendEmail } from '@/lib/email';
import {
  welcomeEmail,
  verifyEmail,
  resetPasswordEmail,
  passwordChangedEmail,
  changeEmailConfirmEmail,
  accountDeletedEmail,
} from '@/lib/emails/templates';

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
    },

    databaseHooks: {
      user: {
        create: {
          after: async (newUser) => {
            await db.insert(profiles).values({ id: newUser.id }).onConflictDoNothing();
            // Branded welcome email. No-ops without RESEND_API_KEY and never
            // throws, so a slow/failed Resend call can't break signup.
            const { subject, html } = welcomeEmail(newUser.name || '');
            await sendEmail({ to: newUser.email, subject, html });
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
