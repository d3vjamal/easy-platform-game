# Project Guidelines

## Code Style

- TypeScript strict mode enabled with comprehensive checks (`noUnusedLocals`, `noUnusedParameters`, `noUncheckedSideEffectImports`)
- React components explicitly typed as `React.FC<Props>`
- Component organization: Game UI in `src/components/game/`, utilities in `src/utils/`, state in `src/state/`, styles in `src/styles/`
- Zustand selective subscriptions pattern: `const { gameState, level } = useGameStore();` to prevent unnecessary re-renders
- Canvas rendering: Use `useRef` for mutable game state separate from React state during animation loops

## Architecture

- **State Management**: Single Zustand store in `src/state/gameStore.ts` with game states: menu → themeSelect → generating → playing → levelComplete/gameOver
- **Component Hierarchy**: GameController renders screens based on gameState; GameCanvas handles 2D canvas with physics loop
- **Game Loop**: Physics engine (gravity, collision detection), particle system, entity updates using `requestAnimationFrame`
- **Level Generation**: Procedural in `src/utils/level.ts` with themes from `src/utils/themes.tsx`
- **Internationalization**: i18next with English/Bengali support in `public/locales/`

## Build and Test

- Install: `npm install`
- Dev server: `npm run dev` (Vite with hot reload)
- Build: `npm run build` (TypeScript check + production build)
- Lint: `npm run lint` (ESLint)
- Preview: `npm run preview`
- **Note**: No test suite configured—consider adding Vitest for testing

## Conventions

- Physics constants in `src/constants.ts` (GRAVITY=0.8, JUMP_FORCE=-15, etc.)
- Theme system with 16 themes, custom input allowed
- i18n debug mode enabled in development (logs to console)
- Tailwind CSS v4 + PostCSS with custom variables in `src/styles/main.css`
- Material-UI integrated alongside Tailwind

See [README.md](README.md) for project overview (note: currently describes outdated QR generator functionality).
