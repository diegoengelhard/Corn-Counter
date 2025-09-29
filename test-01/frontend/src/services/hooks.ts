import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "clientId";

export function useClientId() {
  // Initialize state from localStorage
  const [clientId, setClientIdState] = useState<string>(
    () => localStorage.getItem(STORAGE_KEY) || ""
  );

  // Sets the clientId both in state and localStorage
  const login = useCallback((rawId: string) => {
    const normalized = rawId.trim() || "Guest";
    localStorage.setItem(STORAGE_KEY, normalized);
    setClientIdState(normalized);
  }, []);

  // Clears the clientId from state and localStorage
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('nextAllowedAt');
    setClientIdState("");
  }, []);

  // Sinchronize state across tabs
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setClientIdState(e.newValue || "");
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // Return the clientId, login and logout functions, and authentication status
  return {
    clientId,
    login,
    logout,
    isAuthenticated: !!clientId, // Boolean indicating if user is logged in
  };
}
