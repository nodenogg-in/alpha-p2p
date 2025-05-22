# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build, Lint & Test Commands
- Build: `pnpm build`
- Lint: `pnpm lint` 
- Format: `pnpm format`
- Dev: `pnpm dev:app`
- Tests: `pnpm test`
- Watch Tests: `pnpm test:watch`
- Single Test: `pnpm test -- -t "test name"`
- Docs: `pnpm docs:dev`

## Code Style Guidelines
- TypeScript with Vue 3 composition API
- Formatting: No semicolons, single quotes, 2-space indentation, 100 char width
- Components: Use .vue extension with multi-word names
- Imports: Group by external/internal, alphabetical order
- Testing: Component tests in `__tests__` directory or using `.spec.ts` suffix
- Error handling: Prefer typed responses over exceptions
- CSS: Tailwind utility classes with BEM for custom components
- Git commits: Follow conventional commits (feat, fix, chore, docs, etc.)