/**
 * Small adapter so the migrated screens keep their original navigation calls
 * (Link, NavLink, useNavigate, useParams) while running on TanStack Router.
 * Relative paths ("members") resolve against the current section ("/dashboard", "/admin").
 */
import {
  Link as TsLink,
  useNavigate as useTsNavigate,
  useParams as useTsParams,
  useRouterState,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

function normalize(path: string) {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

function useResolve() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (to: string) => {
    if (to.startsWith("/")) return normalize(to);
    const section = pathname.split("/")[1];
    return normalize(`/${section}/${to}`);
  };
}

type LinkProps = {
  to: string;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
  [key: string]: unknown;
};

export function Link({ to, ...rest }: LinkProps) {
  const resolve = useResolve();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <TsLink to={resolve(to) as any} {...(rest as any)} />;
}

export function NavLink({ to, className = "", ...rest }: LinkProps) {
  const resolve = useResolve();
  return (
    <TsLink
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      to={resolve(to) as any}
      className={className}
      activeProps={{ className: `${className} active` }}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(rest as any)}
    />
  );
}

export function useNavigate() {
  const navigate = useTsNavigate();
  const resolve = useResolve();
  return (to: string | number) => {
    if (typeof to === "number") {
      window.history.go(to);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate({ to: resolve(to) as any });
  };
}

export function useParams<T extends Record<string, string>>() {
  return (useTsParams as (o: { strict: false }) => unknown)({ strict: false }) as T;
}
