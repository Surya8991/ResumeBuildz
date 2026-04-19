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

| Path | Test |
|---|---|
| `/` | Loads, has H1, Blog link in nav |
| `/sitemap.xml` | 200, ≥50 URLs |
| `/robots.txt` | 200, disallows `/account` + `/login` |
| `/builder` | sr-only H1 in server HTML, no page errors on mount |
| `/pricing` | Product + Offer schema present, ≥3 tier labels visible |
| `/templates` | H1 visible, ≥10 template cards |
| 10 key routes | Unique `<title>` (not root-layout fallback) + canonical tag |

## What is NOT covered

- Actual resume-building flow (typing, template switch, export) —
  too flaky for smoke, belongs in a focused regression suite
- Auth flow (signup, OAuth) — covered by Supabase integration tests
  we don't have yet
- Mobile viewport interactions beyond layout — covered by the
  `mobile-chrome` project but minimal assertions

## When to expand

Add tests when a specific bug gets through. Don't grow the suite
proactively. Small, fast, reliable > large and flaky.
