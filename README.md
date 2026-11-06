# CREN Portal

Membership and administrative portal application built with TanStack Start, TanStack Query, React, Tailwind CSS v4, and shadcn/ui.

---

## Features

- **TanStack Start & Router**: File-based routing with client-side hydration and SSR controls.
- **TanStack Query (v5)**: Automated caching, background synchronization, and optimistic UI updates for GET requests and POST mutations.
- **shadcn/ui & Tailwind CSS v4**: Beautiful, accessible UI components (Tables, Cards, Dialogs, Badges, Buttons, Inputs, Skeletons) styled using modern `@theme inline` CSS variables and OKLCH color definitions.
- **Global Data Loaders**: `PageLoader` and `QueryCompLayout` components providing unified loading states, access-denied boundaries (403), retry handlers, and empty states.
- **Type Safety**: Centralized API definitions for responses (`ApiResponse<T>`) and resources (e.g., `Member`).

---

## Getting Started

### Prerequisites

Ensure you have [Bun](https://bun.sh/) installed:

```bash
bun --version
```

### Installation

```bash
bun install
```

### Development Server

```bash
bun run dev
```

### Production Build

```bash
bun run build
bun run preview
```

### Static Build (cPanel / shared hosting)

cPanel can only serve static files, so a dedicated static SPA build mode is
available. It disables the Nitro server and emits a client-only build
(`dist/client/index.html`) with Apache rewrite rules from `public/.htaccess`:

```bash
STATIC_BUILD=1 bun run build
```

The default `bun run build` (Netlify/Nitro server output) is unaffected.

---

## cPanel Deployment

Pushing to `main` (or running the **Deploy frontend to cPanel** workflow
manually) triggers `.github/workflows/deploy-cpanel.yml`, which installs
dependencies with Bun, typechecks, runs tests, builds the static SPA, tars
`dist/client/`, and SCPs it over SSH for remote extraction into
`CPANEL_APP_PATH`.

### Required GitHub Secrets

| Secret              | Description                                                        |
| ------------------- | ------------------------------------------------------------------ |
| `CPANEL_SSH_KEY`    | Private key used for SSH/SCP access (format: `-----BEGIN ... KEY-----`) |
| `CPANEL_HOST`       | cPanel hostname or server IP                                       |
| `CPANEL_USER`       | cPanel SSH username                                                |
| `CPANEL_APP_PATH`   | Absolute path to the app directory on the server (e.g. `/home/user/app`) |
| `VITE_API_URL`      | Backend API base URL injected at build time                        |

### Optional GitHub Secrets

| Secret                | Description                                                       |
| --------------------- | ----------------------------------------------------------------- |
| `CPANEL_PORT`         | SSH port (defaults to `22`)                                        |
| `CPANEL_KNOWN_HOSTS`   | Pre-populated `known_hosts` entries; when omitted, `ssh-keyscan` is run automatically |

---

## Data Fetching & Hooks

### `useGetHook`

Wraps TanStack Query's `useQuery`:

```tsx
import useGetHook from "@/app/hook/useGet";
import type { Member } from "@/types/api";

const { data, loading, refetch, query } = useGetHook<Member[]>("admin/member/retrieve/all");
```

### `usePostHook`

Wraps TanStack Query's `useMutation` with automatic query invalidation and error toast notifications:

```tsx
import usePostHook from "@/app/hook/usePost";

const { handlePost, isPending } = usePostHook();

await handlePost("admin/member/add", payload, "application/json", (result) => {
  console.log("Member created:", result);
});
```

---

## UI Components & Loaders

- **shadcn/ui**: Add or update components anytime via:
  ```bash
  bunx --bun shadcn@latest add <component>
  ```
- **PageLoader**:
  ```tsx
  import PageLoader from "@/components/layout/PageLoader";

  <PageLoader query={query} emptyState={{ title: "No Members Found" }}>
    {(data) => <MembersTable members={data.data} />}
  </PageLoader>;
  ```
