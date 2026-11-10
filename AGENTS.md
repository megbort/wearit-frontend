# AGENTS.md

Guidance for coding agents working in this repository.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run storybook    # Component explorer (localhost:6006)
```

> **Note:** The GraphQL endpoint comes from `NEXT_PUBLIC_GRAPHQL_URL` (`.env`), either a local backend or the public production API. There is no mock fallback; `src/services/mocks/` only feeds `Categories.tsx` and Storybook stories.

## Architecture

**WearIt 2.0** is an urban clothing e-commerce app using the **Next.js 16 App Router**.

### Routing (`src/app/`)
Pages follow Next.js file-system routing. The root layout (`layout.tsx`) nests `AppRouterCacheProvider` > `ThemeProvider` > `IntlProvider` (wraps `NextIntlClientProvider`) > `AuthProvider` around the page shell, which renders `<Navbar>`, page content, `<Footer>`, and `<GlobalToast>`. Dynamic product routes live at `/product/[id]`.

### Components (`src/components/`)
- `ui/` — generic primitives: `Button` (3 variants: primary/secondary/text), `ProductCard`, `ProductCardSkeleton`, `ProductSlider`, `CategoryCard`, `BoxSelect`, `Select`
- Top-level components are feature-scoped: `CartDrawer`, `Navbar`, `Featured`, `Categories`, `Footer`

### State (`src/services/store/useStore.ts`)
Single Zustand store with persistence middleware. Holds the cart line items (`cart: CartItem[]` with add/update/remove/clear actions) and auth state (`user`, `isAuthenticated`, `isLoading`). The access token is NOT persisted — it lives in memory in the Apollo client (`setAccessToken`/`getAccessToken` in `src/services/apollo/client.ts`); an httpOnly refresh cookie restores the session on reload via `<AuthProvider>` (`src/components/AuthProvider.tsx`).

### GraphQL / Auth (`src/services/`)
- Apollo Client config: `src/services/apollo/client.ts` — link chain is `ErrorLink → SetContextLink (Bearer header) → HttpLink (credentials: 'include')`; on `UNAUTHENTICATED` it refreshes the access token via the refresh cookie and retries once
- Queries & mutations: `src/services/graphql/queries/auth.ts` (`LOGIN_MUTATION`, `REGISTER_MUTATION`, `GET_ME_QUERY`, `REFRESH_TOKEN_MUTATION`, `LOGOUT_MUTATION`)
- TS models for API responses: `src/services/graphql/models/auth.ts`
- Custom hooks wrapping Apollo + Zustand updates: `src/hooks/useAuth.ts` (`useLogin`, `useMe`, `useLogout`)

### Data Models (`src/services/models/`)
- `Product` — id, name, price, imageUrl, colors[], sizes[], details[], featured, sale, category
- `Category` / `CategoryType` enum — Pants, Tees, Sweaters, Shorts, Jackets

### Styling
Tailwind CSS v4 is the default (no Sass — Tailwind v4 doesn't support preprocessors). There is no `tailwind.config.ts`: theme tokens live in the `@theme` block of `src/app/globals.css` (WearIt palette, e.g. `wearit-blue`, `wearit-green`, `wearit-pink`), and custom text styles (`title`, `subtitle-1`, `text-body-1`, `text-caption`) are `@utility` definitions in `src/styles/typography.css`. Dark mode is class-based (`@custom-variant dark`). MUI is used for form controls, menus and feedback (`TextField`, `Select`, `Menu`, `Button`, `Snackbar`/`Alert`, `Badge`, `CircularProgress`) with overrides in `src/theme/theme.ts`; MUI styles are emitted into `@layer mui` (`AppRouterCacheProvider` in `layout.tsx`; `StyledEngineProvider` plus a `GlobalStyles` layer-order declaration in `.storybook/preview.tsx`), so Tailwind utilities on MUI components override MUI's own styles. Font is **Comfortaa** (400, 700).

### Images
All images go through a custom Cloudinary loader (`src/utils/custom-image-loader.ts`). Always use Next.js `<Image>` — never raw `<img>`.

### Storybook
Stories live in `src/stories/` mirroring the component tree. Create a story for every new UI component in `src/components/ui/`.

## Deployment

This app is deployed as a **static export** (`output: 'export'` in `next.config.mjs`, production only). CI (`.github/workflows/deploy.yml`) builds it and rsyncs `out/` to the server — there is no Next.js server running at runtime.

Consequences:
- **No ISR** — never use `next: { revalidate: N }` in `fetch()` calls; it requires a running server and will break the build.
- **No middleware** — `middleware.ts` will not run.
- All dynamic routes (`/product/[id]`) must implement `generateStaticParams`.
- `getMessages()` / `getTranslations()` from `next-intl/server` are fine — they execute at build time.

## Conventions

- **File naming:** Components → PascalCase; utilities/models/hooks → camelCase; stories → `ComponentName.stories.ts`
- **Path alias:** `@/` maps to `src/` (e.g., `import Foo from '@/components/ui/Foo'`)
- **Static data** (e.g., size/color arrays) belongs outside the component function to avoid re-creation on each render
- **Imports order:** React → third-party → internal (`@/`) → type imports
- **Exports:** default export for components, named exports for utilities and types
