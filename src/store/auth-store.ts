import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { MemberSubscription } from "@/types/api";

export interface AuthUser {
  email: string;
  /** Organization / member name shown across the dashboard. */
  name: string;
  /** Normalize of the login's `isSubscribed` flag (accepts 1/0/"1"/"0"/true/false). */
  isSubscribed: boolean | string | number;
}

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  /** The member's current subscription plan (`GET /member/subscription`). */
  subscription: MemberSubscription | null;
  setAuth: (payload: {
    token?: string | null;
    user?: AuthUser;
    subscription?: MemberSubscription | null;
  }) => void;
  setSubscription: (subscription: MemberSubscription | null) => void;
  /** Flip the subscribed flag (keeps legacy `igbo_sub` localStorage keys in sync). */
  setSubscribed: (value: boolean) => void;
  clearAuth: () => void;
}

/** Normalize truthiness across the API's inconsistent 1/"1"/true/"published" style values. */
export const normalizeSubscribed = (value: boolean | string | number | null | undefined): boolean =>
  value === true ||
  value === 1 ||
  value === "1" ||
  value === "true" ||
  (typeof value === "string" && value.toLowerCase() === "active");

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      subscription: null,
      setAuth: ({ token, user, subscription }) =>
        set((state) => ({
          token: token === undefined ? state.token : token,
          user: user ?? state.user,
          subscription: subscription === undefined ? state.subscription : subscription,
        })),
      setSubscription: (subscription) => set({ subscription }),
      setSubscribed: (value) =>
        set((state) => ({
          user: state.user ? { ...state.user, isSubscribed: value } : state.user,
        })),
      clearAuth: () => set({ token: null, user: null, subscription: null }),
    }),
    {
      name: "igbo-auth-store",
      // Never let persist crash: fall back to a noop storage if localStorage
      // is unavailable (SSR, constrained test environments, privacy mode, etc.).
      storage: createJSONStorage(() => {
        try {
          if (typeof window !== "undefined" && window.localStorage) {
            return window.localStorage;
          }
        } catch {
          // ignore — fall through to noop storage
        }
        return {
          getItem: () => null,
          setItem: () => undefined,
          removeItem: () => undefined,
        };
      }),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        subscription: state.subscription,
      }),
      onRehydrateStorage: () => (state) => {
        // Keep legacy inline-storage keys in sync for pages that still read them.
        if (typeof window !== "undefined" && state?.token) {
          window.localStorage.setItem("igbo_token", state.token);
          if (state.user) {
            window.localStorage.setItem("igbo_email", state.user.email);
            window.localStorage.setItem("fName", state.user.name);
            window.localStorage.setItem(
              "igbo_sub",
              String(normalizeSubscribed(state.user.isSubscribed) ? 1 : 0),
            );
          }
        }
      },
    },
  ),
);

export { useAuthStore };
export default useAuthStore;
