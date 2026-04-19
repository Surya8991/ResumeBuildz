import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "**/.next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored, minified assets served under /public — never our code.
    "public/**",
    // Deno-runtime Edge Functions (TS config excludes them too).
    "supabase/functions/**",
    // Claude Code tooling state (worktrees, caches). Not ours, not for commit.
    ".claude/**",
    // Supabase CLI temp state.
    "supabase/.temp/**",
    // Standalone HTML reference docs at repo root (RESEND_SETUP, README.html, etc).
    "*.html",
    // Playwright test output
    "test-results/**",
    "playwright-report/**",
    "blob-report/**",
    "playwright/.cache/**",
  ]),
  // Resume template files render the user's resume in the print preview.
  // next.config.ts sets `images.unoptimized: true`, so `<img>` is no worse
  // than `<Image />` here. Suppress the no-img-element warning for the
  // templates directory specifically.
  {
    files: ["components/templates/**/*.tsx"],
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
