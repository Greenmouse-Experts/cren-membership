<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

# Architecture & Development Guidelines

- **Routing & SSR**:
  - Thin route files reside in `src/routes/` and mount screen components from `src/app/`.
  - `defaultSsr: false` is configured in `src/start.ts` because authentication tokens (`igbo_token`) are read from `localStorage`.
  - Legacy screens use navigation compatibility layer `@/lib/router-compat` so relative paths and hooks resolve cleanly.

- **Data Fetching & State Management (TanStack Query)**:
  - `useGetHook<T>(url, options?)` (`src/app/hook/useGet.tsx`): Powered by TanStack Query's `useQuery`. Provides caching, background refetching, and query observer results while maintaining backward compatibility with `{ data, loading, isLoading, isError, error, refetch, query }`.
  - `usePostHook()` (`src/app/hook/usePost.tsx`): Powered by TanStack Query's `useMutation`. Automatically invalidates queries on success, safely handles `FormData` / `application/json`, and parses validation errors into user notifications via `react-toastify`.
  - `usePostRead()` (`src/app/hook/usePostRead.tsx`): Mutation wrapper for POST read operations.

- **Data Types & API Contracts**:
  - `src/types/api.ts` defines standard response contracts:
    - `ApiResponse<T>`: `{ code: number, message: string, data: T }`
    - `Member`: Strongly typed member interface matching backend schema.
  - Re-exported via `@/api/simpleApi` and `@/client/api` for convenience.

- **UI Components & Layout**:
  - **shadcn/ui**: Preconfigured in `components.json` with 40+ components located in `src/components/ui/` (`Table`, `Button`, `Input`, `Badge`, `AlertDialog`, `Dialog`, `Card`, `Skeleton`, etc.).
  - **Global Loaders**:
    - `PageLoader` (`src/components/layout/PageLoader.tsx`): Full-featured query observer layout with animated spinner rings, 403 Access Denied views, error recovery ("Try Again"), and empty states.
    - `QueryCompLayout` (`src/components/layout/QueryCompLayout.tsx`): Lightweight container for query states.
  - **Design System & Tailwind**:
    - Tailwind CSS v4 configured in `src/styles.css`.
    - Theme variables map OKLCH color definitions under `@theme inline` (`primary`, `destructive`, `error`, `base-content`, `base-100`, etc.).
