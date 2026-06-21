import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User, AuthState } from "../types";

interface AuthContextValue extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

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

// Convenience hook — throws if used outside AuthProvider
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
