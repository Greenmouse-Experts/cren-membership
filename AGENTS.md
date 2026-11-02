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

- Migrated portal screens live in `src/app/` (kept as `// @ts-nocheck` TSX) and are mounted by thin route files in `src/routes/`; why: preserves the original CRA app while routing runs on TanStack.
- Legacy screens import navigation from `@/lib/router-compat` (relative paths resolve per section); why: avoids rewriting every Link/NavLink/useNavigate call.
- `defaultSsr: false` in `src/start.ts`; why: screens read the login token from localStorage during render.
- Data comes from the external REST API (`src/app/services/env.ts`); there is no Lovable Cloud backend.
