// Role-specific bullet starter packs. Inserted as a one-click "Insert
// preset" in ExperienceForm / ProjectsForm so a user staring at an empty
// Achievements box has something concrete to edit instead of a cursor.
//
// Every bullet is written to pass bulletEvaluator.ts rules: action-verb
// start, quantified metric, specific tech or scope, 8-28 words. Users are
// expected to personalise the numbers and specifics.

export interface RolePreset {
  role: string;
  bullets: string[];
}

export const ROLE_PRESETS: RolePreset[] = [
  {
    role: 'Software Engineer',
    bullets: [
      'Shipped a caching layer in Redis that cut p99 API latency from 820ms to 140ms across 3 services.',
      'Led migration of a 200k-LOC monolith to 12 microservices on Kubernetes, reducing deploy time by 68%.',
      'Mentored 4 junior engineers through code review, pairing, and weekly architecture sessions.',
      'Designed and rolled out a feature-flag framework adopted by 9 teams within the first quarter.',
      'Reduced CI pipeline runtime from 22 to 7 minutes by parallelising test suites and caching dependencies.',
    ],
  },
  {
    role: 'New Grad SDE',
    bullets: [
      'Built a React dashboard that surfaced 12 KPIs, cutting daily stand-up reporting time by 35%.',
      'Wrote unit and integration tests that raised backend coverage from 41% to 78% in 6 weeks.',
      'Investigated and patched a memory leak in the notification service, stabilising uptime above 99.95%.',
      'Shipped a REST endpoint consumed by 4 downstream services, documented with OpenAPI + example payloads.',
      'Partnered with design to ship 6 accessibility improvements, passing WCAG 2.1 AA on the account flow.',
    ],
  },
  {
    role: 'Product Manager',
    bullets: [
      'Launched 3 retention experiments that lifted 30-day retention by 18% and saved $420k in projected churn.',
      'Drove a 0-to-1 mobile checkout that reached 82k DAU and $2.1M ARR within 6 months of GA.',
      'Ran weekly discovery calls with 50+ users; findings reshaped the Q3 roadmap and killed 2 planned features.',
      'Defined NSM + 6 guardrail metrics for the growth team, aligning 3 squads on a single measurement stack.',
      'Cut onboarding drop-off from 47% to 22% by rewriting the empty-state flow with eng and design.',
    ],
  },
  {
    role: 'Data Analyst',
    bullets: [
      'Built a self-serve BI dashboard in Looker, cutting ad-hoc analyst requests by 61%.',
      'Ran a causal impact analysis on a pricing test that informed a $1.3M revenue decision.',
      'Automated weekly exec reporting with dbt + scheduled Airflow, saving ~5 analyst-hours per week.',
      'Owned the definition layer for 27 core metrics; reduced conflicting numbers across 4 teams to zero.',
      'Partnered with PM on A/B tests covering 140k users, shipping 3 variants that won on primary metric.',
    ],
  },
  {
    role: 'Marketing Manager',
    bullets: [
      'Scaled paid acquisition from $80k to $420k monthly while holding CAC under $47 for 11 straight months.',
      'Launched a lifecycle email program (12 journeys) that drove a 22% lift in MRR from existing accounts.',
      'Rebuilt the content calendar around SEO intent clusters, growing organic sessions 3.4x in 9 months.',
      'Led rebrand rollout across site, ads, and 28 collateral pieces with a 4-person cross-functional team.',
      'Ran 14 webinars averaging 320 registrations each; sourced $1.8M in pipeline over 2 quarters.',
    ],
  },
  {
    role: 'Designer',
    bullets: [
      'Redesigned the onboarding flow, improving activation rate from 31% to 54% across 2 user cohorts.',
      'Built and shipped a 42-component design system in Figma, adopted by 5 product teams.',
      'Ran 11 usability studies with 48 participants; findings shaped 7 shipped improvements.',
      'Partnered with eng to cut mobile checkout from 6 screens to 3, lifting completion 26%.',
      'Led accessibility audit of the flagship app; shipped 14 WCAG 2.1 AA fixes in one quarter.',
    ],
  },
  {
    role: 'Customer Success',
    bullets: [
      'Owned a book of 48 strategic accounts worth $7.2M ARR; retained 96% through renewal.',
      'Built a QBR framework adopted across the CSM team; NPS from strategic accounts climbed from 32 to 57.',
      'Reduced time-to-value from 42 days to 19 days by rewriting the implementation playbook with engineering.',
      'Caught 3 at-risk accounts totalling $480k ARR; recovered all three through escalation workshops.',
      'Created a monthly usage-insights report that drove $310k in expansion across 12 accounts.',
    ],
  },
];

export function getPreset(role: string): string[] | null {
  const p = ROLE_PRESETS.find((r) => r.role.toLowerCase() === role.toLowerCase());
  return p ? p.bullets : null;
}
