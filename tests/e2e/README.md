# Playwright smoke tests

3-path smoke suite. Not full E2E coverage — just enough to fail a PR
if something obviously broken ships.

## First-time setup

```bash
# Install Playwright browsers (one-time, ~400 MB download)
npx playwright install chromium
```

## Run

```bash
# Against a local dev server (Playwright spins it up at :3847)
npm run test:e2e

# Interactive UI mode — better for debugging
npm run test:e2e:ui

# Against production
npm run test:e2e:prod
```

## What is covered

| File | Path | Test |
|---|---|---|
| `smoke.spec.ts` | `/` | Loads, has H1, Blog link in nav |
| `smoke.spec.ts` | `/sitemap.xml` | 200, ≥50 URLs |
| `smoke.spec.ts` | `/robots.txt` | 200, disallows `/account` + `/login` |
| `smoke.spec.ts` | `/builder` | sr-only H1 in server HTML, no page errors on mount |
| `smoke.spec.ts` | `/pricing` | Product + Offer schema present, ≥3 tier labels visible |
| `smoke.spec.ts` | `/templates` | H1 visible, ≥10 template cards |
| `smoke.spec.ts` | 10 key routes | Unique `<title>` (not root-layout fallback) + canonical tag |
| `builder.spec.ts` | `/builder` | sr-only H1 in SSR HTML |
| `builder.spec.ts` | `/builder` | No JS errors on initial load |
| `builder.spec.ts` | `/builder` | Personal info section visible after hydration |
| `builder.spec.ts` | `/builder` | Can type into full name field |
| `builder.spec.ts` | `/builder` | Live preview updates when name is typed |
| `builder.spec.ts` | `/builder` | Experience section can be expanded and role filled |
| `builder.spec.ts` | `/builder` | Bullet scorer appears when an achievement is typed |
| `builder.spec.ts` | `/builder` | Export panel contains PDF/DOCX buttons |
| `builder.spec.ts` | `/builder` | Template switcher shows multiple templates |
| `builder.spec.ts` | `/builder` | ATS tab renders without errors |

## What is NOT covered

- Auth flow (signup, OAuth) — requires a live database and auth
  provider, not covered yet
- Mobile viewport interactions beyond layout — covered by the
  `mobile-chrome` project but minimal assertions
- Actual file downloads (PDF/DOCX) — require a live database
  and are out of scope for local CI

## When to expand

Add tests when a specific bug gets through. Don't grow the suite
proactively. Small, fast, reliable > large and flaky.
