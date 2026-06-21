import { useState, useEffect, type ReactNode } from "react";
import { AuthContext } from "./auth";
import type { User, AuthState } from "../types";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(() => {
    // Initialise from localStorage so refreshing the page doesn't log the user out
    const token = localStorage.getItem("token");
    const raw = localStorage.getItem("user");
    const user = raw ? (JSON.parse(raw) as User) : null;
    return { token, user, isAuthenticated: !!token && !!user };
  });

  // Keep localStorage in sync whenever state changes
  useEffect(() => {
    if (state.token && state.user) {
      localStorage.setItem("token", state.token);
      localStorage.setItem("user", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [state.token, state.user]);

  const login = (token: string, user: User) => {
    setState({ token, user, isAuthenticated: true });
  };

  const logout = () => {
    setState({ token: null, user: null, isAuthenticated: false });
  };

  const updateUser = (user: User) => {
    setState((prev) => ({ ...prev, user }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// This file intentionally exports only the `AuthProvider` component so
// React Fast Refresh remains enabled for component updates.
