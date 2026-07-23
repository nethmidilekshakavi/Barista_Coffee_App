import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  firstName: string;
  email?: string;
  mobile?: string;
  [key: string]: any;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = "@barista_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load any previously saved session on app start
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setUser(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to load stored user:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (userData: User) => {
    setUser(userData);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch (err) {
      console.error("Failed to persist user:", err);
    }
  };

  const logout = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear stored user:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}