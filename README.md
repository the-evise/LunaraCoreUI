# Lunara Core UI (`@lunara/core-ui`)

Reusable React UI component library for Lunara products.

This repo contains:

- Production component exports (`src/components`)
- A local demo/playground app (`src/App.tsx`)
- Library build output (`dist`)
- GitHub Pages demo build output (`dist-pages`)

## What It Includes

- React + TypeScript component library
- Tailwind v4 styling with a local Lunara theme (`src/styles/theme.css`)
- UI primitives (buttons, inputs, toggles, tabs, modal, tooltip)
- Product UI blocks (roadmap, quiz, streak, dashboard, notifications, etc.)
- Demo playground for manual verification

## Installation

Install the package and required peers in your app:

```bash
pnpm add @lunara/core-ui react react-dom tailwindcss
pnpm add motion recharts @rive-app/react-canvas
```

Notes:

- `react`, `react-dom`, `tailwindcss`, `motion`, `recharts`, and `@rive-app/react-canvas` are peer dependencies.
- Some components require only a subset of peers, but the package declares the full set.

## Usage

### 1. Import styles

```tsx
import "@lunara/core-ui/core-ui.css";
```

### 2. Import components

```tsx
import { Button, Card, TopBar } from "@lunara/core-ui";

export function ExampleScreen() {
  return (
    <div className="p-6 space-y-4">
      <TopBar />
      <Card>
        <Button>Start</Button>
      </Card>
    </div>
  );
}
```

### 3. Optional subpath imports

The package also exposes subpath exports (for selected components) and a generic `./*` dist mapping. Prefer the main barrel import unless you have a specific bundling reason.

## Available Exports

Main public exports are re-exported from:

- `src/components/index.ts`
- `src/index.ts`

Examples currently included:

- Primitives: `Button`, `Checkbox`, `Radio`, `Toggle`, `Tabs`, `Input`, `InputGroup`, `Modal`, `Tooltip`, `Icon`
- Layout/navigation: `TopBar`, `MenuPanel`, `Navigation`, `Breadcrumb`, `BreadcrumbBar`
- Learning UI: `Quiz`, `QuizAnimated`, `QuizCard`, `ReadingCard`, `GrammarCard`, `VocabularyCard`, `VocabularyNavigator`
- Dashboard/engagement: `DashboardCard`, `StreakCard`, `StreakButton`, `MilestoneTrackerCard`, `NotificationIsland`

## Local Development

Run from this repo root (`ui/core-ui` in the monorepo, or the standalone `LunaraCoreUI` repo root):

```bash
pnpm install
pnpm dev
```

Useful scripts:

- `pnpm dev` - run the local demo app
- `pnpm lint` - TypeScript type-check (`tsc --noEmit`)
- `pnpm build` - library build (`dist`) + type declarations
- `pnpm build:pages` - static demo build for GitHub Pages (`dist-pages`)
- `pnpm preview` - preview standard Vite app build
- `pnpm preview:pages` - preview the Pages build output

If you are running this repo nested inside another pnpm workspace, use:

```bash
pnpm install --ignore-workspace
```

## GitHub Pages Demo

The repo includes a GitHub Actions workflow for publishing the demo app:

- `ui/core-ui/.github/workflows/deploy-gh-pages.yml` (inside the standalone `LunaraCoreUI` repo, this is `.github/workflows/deploy-gh-pages.yml`)

How it works:

- Builds with `pnpm build:pages`
- Emits static files to `dist-pages`
- Auto-configures the base path as `/${repo-name}` on GitHub Actions

Local Pages-style build example (PowerShell):

```powershell
$env:BASE_PATH = "/LunaraCoreUI"
pnpm build:pages
```

GitHub setup:

1. Push to the repo (`main` or `root` branch)
2. In GitHub repository settings, set Pages source to `GitHub Actions`

## Project Structure

```text
src/
  components/       Reusable components and feature UI blocks
  hooks/            Shared hooks used by components/demo
  utils/            Helpers
  assets/           Repo-specific assets
  styles/           Local Lunara theme and vendored fonts for standalone builds
  App.tsx           Demo playground entry component
  main.tsx          Demo app bootstrap
  index.ts          Library barrel export
  index.css         Library CSS entrypoint
```

## Contributing

### Contribution Entry Points

Use these paths depending on what you are changing:

- New or updated component: `src/components/*`
- Component exports/barrels: `src/components/index.ts`, `src/index.ts`
- Demo examples/manual QA states: `src/App.tsx`
- Styling/theme changes: `src/index.css`, `src/styles/theme.css`, `tailwind.config.ts`
- Build/deploy changes: `vite.config.ts`, `package.json`, `.github/workflows/*`

### Adding a New Component

1. Create the component in `src/components` (use `PascalCase.tsx`).
2. Export it from `src/components/index.ts`.
3. Ensure it is re-exported via `src/index.ts` (barrel path is already wired through `src/components`).
4. Add one or more demo states in `src/App.tsx` so behavior can be reviewed visually.
5. If you want a stable public subpath import, update `package.json` `exports`.

### Styling Guidelines

- Prefer utility-first styling with Tailwind classes.
- Reuse Lunara theme tokens from `src/styles/theme.css` instead of redefining colors.
- Avoid hardcoding visual tokens if a reusable token already exists.
- Keep component-specific styles close to the component unless a pattern is shared widely.

### Quality Checks Before PR / Push

```bash
pnpm lint
pnpm build
pnpm build:pages
```

For UI-heavy changes, also run:

```bash
pnpm dev
```

and verify the affected states in the demo app.

## Notes

- The demo build can be large because components like `MermaidDiagram` pull in heavy runtime dependencies.
- This does not block Pages deployment, but you may want to code-split demo routes/states later if startup size becomes a concern.
