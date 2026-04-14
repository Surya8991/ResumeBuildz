# Contributing to ResumeForge

Welcome, and thank you for your interest in contributing to ResumeForge! This is an open-source, client-side ATS resume builder, and we appreciate contributions of all kinds: bug fixes, new features, documentation improvements, and more.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Setup

1. **Fork** the repository on GitHub: [github.com/Surya8991/ResumeForge](https://github.com/Surya8991/ResumeForge)
2. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/ResumeForge.git
   cd ResumeForge
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Coding Standards

### TypeScript

- Use TypeScript for all new files. Avoid `any` types whenever possible.
- Define interfaces and types in dedicated files or co-located with the component.
- Use strict mode -- the project has `strict: true` in `tsconfig.json`.

### Tailwind CSS

- Use Tailwind utility classes for styling. Avoid writing custom CSS unless absolutely necessary.
- Follow the existing dark mode pattern: use `dark:` variants consistently.
- Use the project's color tokens (defined in `tailwind.config.ts`) rather than hard-coded color values.

### Component Patterns

- Place new components in the appropriate directory under `components/`.
- Use functional components with hooks.
- Keep components focused on a single responsibility.
- Co-locate related utilities and types with their components.
- Use Zustand for state management -- see `lib/store.ts` for the existing store.

## File Structure Overview

```
ResumeForge/
├── app/                    # Next.js app directory (pages, layouts)
├── components/
│   ├── ats/                # ATS analysis tools and scoring
│   ├── editor/             # Resume editor components
│   ├── templates/          # Resume templates (1-20)
│   └── ui/                 # Shared UI components
├── lib/                    # Utilities, store, types
├── public/                 # Static assets
└── styles/                 # Global styles
```

## How to Add a New Template

1. Create a new file in `components/templates/` following the naming convention: `Template<Number>.tsx` (e.g., `Template21.tsx`).
2. Export a React component that accepts the standard `ResumeData` props.
3. Follow the existing template structure -- look at any existing template for reference.
4. Ensure the template:
   - Renders all resume sections (contact, summary, experience, education, skills, projects, certifications).
   - Is responsive and print-friendly.
   - Supports dark mode.
   - Makes contact links clickable (email, phone, LinkedIn, GitHub).
5. Register the template in the template registry so it appears in the template selector.
6. Add a thumbnail/preview image if possible.

## How to Add a New ATS Feature

1. Create a new analysis component in `components/ats/`.
2. Implement the analysis logic that takes resume text and returns a score and feedback.
3. Register the new tool in the ATS tools configuration so it appears in the ATS analysis panel.
4. Include clear, actionable feedback for the user.
5. Add appropriate HelpTip tooltips to explain the feature.

## Pull Request Process

### Branch Naming

Use descriptive branch names with a prefix:

- `feat/` -- new features (e.g., `feat/template-21`)
- `fix/` -- bug fixes (e.g., `fix/pdf-export-margin`)
- `docs/` -- documentation changes (e.g., `docs/update-readme`)
- `refactor/` -- code refactoring (e.g., `refactor/store-cleanup`)

### Commit Messages

Write clear, concise commit messages:

- Use the imperative mood: "Add feature" not "Added feature"
- Prefix with type: `feat:`, `fix:`, `docs:`, `refactor:`, `style:`, `test:`
- Example: `feat: add drag-and-drop reordering for experience entries`

### Review Process

1. Create a pull request against the `main` branch.
2. Fill out the PR template completely.
3. Ensure all checks pass (TypeScript, build).
4. A maintainer will review your PR and may request changes.
5. Once approved, your PR will be merged.

## Issue Guidelines

- **Search first** -- check if a similar issue already exists before creating a new one.
- Use the provided issue templates (Bug Report or Feature Request).
- Include as much detail as possible: steps to reproduce, expected behavior, screenshots.
- Be respectful and constructive in all discussions.

## Code of Conduct

We are committed to providing a welcoming and respectful environment for everyone. By participating in this project, you agree to:

- Be respectful and inclusive in your language and actions.
- Accept constructive criticism gracefully.
- Focus on what is best for the community and the project.
- Show empathy toward other contributors.

Harassment, trolling, and disrespectful behavior will not be tolerated. Maintainers reserve the right to remove any content or contributor that violates these principles.

## Testing

Before submitting a PR, please verify:

1. **Build passes:**
   ```bash
   npm run build
   ```
2. **TypeScript compiles without errors:**
   ```bash
   npx tsc --noEmit
   ```
3. **Manual testing across browsers:**
   - Chrome (latest)
   - Firefox (latest)
   - Safari (latest)
   - Edge (latest)
4. **Test responsive layouts:**
   - Desktop (1440px+)
   - Tablet (768px)
   - Mobile (375px)
5. **Test on mobile** (see the Testing on Mobile section below).
6. **Test PDF export** if your changes affect templates or the print layout.

## Testing on Mobile

ResumeForge must work correctly across a range of mobile devices. Before submitting any PR that touches layout, tabs, navigation, or responsive styles, verify your changes at the following 10 breakpoints:

| Width | Device class |
|-------|-------------|
| 280px | Smallest phones (Galaxy Fold) |
| 320px | Small phones (iPhone SE) |
| 360px | Mid-range Android phones |
| 375px | iPhone 12 mini / iPhone SE 2 |
| 390px | iPhone 14 |
| 412px | Pixel 7 |
| 428px | iPhone 14 Pro Max |
| 768px | Tablet portrait (iPad mini) |
| 1024px | Tablet landscape (iPad) |
| 1440px | Desktop |

Key things to verify on mobile:

- **No horizontal overflow** -- nothing should scroll sideways at any breakpoint.
- **Swipeable tabs** work correctly (swipe left/right between Edit, Preview, Style, ATS, AI).
- **Bottom sheet section picker** opens and closes cleanly.
- **Touch drag handles** on Experience, Education, and Projects are large enough to grab.
- **Resume preview** scales to fit the viewport without clipping.
- **Mobile action bar** icons and labels are legible and tappable.
- **Tab row below navbar** is evenly spaced and text is visible against the dark background.

Use Chrome DevTools device toolbar or a physical device to test these breakpoints.

## Questions?

If you have questions about contributing, feel free to open a discussion or issue on the repository. We are happy to help!

Thank you for helping make ResumeForge better!
