import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/lib/db';
import { user, session, account, verification, profiles } from '@/lib/db/schema';

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
      ...(isProd ? [] : ['http://localhost:3000']),
    ],

    emailAndPassword: {
      enabled: true,
      async sendResetPassword({ user, url }) {
        const resendKey = process.env.RESEND_API_KEY;
        if (!resendKey) return;
        const from = process.env.SHARE_INVITE_FROM || 'ResumeBuildz <noreply@resumebuildz.tech>';
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from,
            to: [user.email],
            subject: 'Reset your ResumeBuildz password',
            html: `<p>Click <a href="${url}">here</a> to reset your password. This link expires in 1 hour.</p>`,
          }),
        });
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
          },
        },
      },
    },
  });
}

// Lazy singleton — defers initialization until first use so the module
// can be imported during CI builds without DATABASE_URL / auth secrets.
let _auth: ReturnType<typeof createAuth> | undefined;
export const auth = new Proxy({} as ReturnType<typeof createAuth>, {
  get(_target, prop, receiver) {
    if (!_auth) _auth = createAuth();
    return Reflect.get(_auth, prop, receiver);
  },
});
