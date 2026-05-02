import type { PadelApiClient } from "@padel/api-client";
import type { AuthSessionResponse, AuthUser } from "@padel/schemas";
import { create } from "zustand";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialize: (apiClient: PadelApiClient) => Promise<void>;
  signIn: (
    apiClient: PadelApiClient,
    email: string,
    password: string,
  ) => Promise<void>;
  signUp: (
    apiClient: PadelApiClient,
    name: string,
    email: string,
    password: string,
  ) => Promise<void>;
  signOut: (apiClient: PadelApiClient) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  async initialize(apiClient) {
    try {
      const session = await apiClient.getSession();
      if (session.authenticated) {
        set({
          user: session.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  async signIn(apiClient, email, password) {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.signInWithEmail({ email, password });
      const session = await apiClient.getSession();
      if (session.authenticated) {
        set({
          user: session.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Sign in failed.";
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  async signUp(apiClient, name, email, password) {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.signUpWithEmail({
        name,
        email,
        password,
      });
      const session = await apiClient.getSession();
      if (session.authenticated) {
        set({
          user: session.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Sign up failed.";
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  async signOut(apiClient) {
    set({ isLoading: true, error: null });
    try {
      await apiClient.signOut();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Sign out failed.";
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  clearError() {
    set({ error: null });
  },
}));

export function selectAuthUser(state: AuthState): AuthUser | null {
  return state.user;
}

export function selectIsAuthenticated(state: AuthState): boolean {
  return state.isAuthenticated;
}

export function selectAuthIsLoading(state: AuthState): boolean {
  return state.isLoading;
}

export function selectAuthError(state: AuthState): string | null {
  return state.error;
}
