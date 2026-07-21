"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, ApiError, getToken, setToken } from "./api";

const USER_KEY = "aichat:user";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // "ready" flips true once we've checked localStorage, so pages can tell
  // "still loading" apart from "definitely logged out".
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    const raw = window.localStorage.getItem(USER_KEY);
    if (token && raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    }
    setReady(true);
  }, []);

  const persist = useCallback((accessToken, nextUser) => {
    setToken(accessToken);
    window.localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const data = await api.post("/auth/login", { email, password });
      persist(data.accessToken, data.user);
      return data.user;
    },
    [persist],
  );

  const register = useCallback(
    async (name, email, password) => {
      const data = await api.post("/auth/register", { name, email, password });
      persist(data.accessToken, data.user);
      return data.user;
    },
    [persist],
  );

  const logout = useCallback(() => {
    setToken(null);
    window.localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, register, logout }),
    [user, ready, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export { ApiError };
