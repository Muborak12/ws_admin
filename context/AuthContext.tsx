"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, Role } from "@/types";
import { authApi, usersApi, getErrorMessage } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useToast } from "./ToastContext";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfileName: (name: string) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  const refreshUser = useCallback(async () => {
    const storedToken = localStorage.getItem("accessToken");
    if (!storedToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }
    try {
      const userData = await authApi.me();
      setUser(userData);
      setToken(storedToken);
      localStorage.setItem("authUser", JSON.stringify(userData));
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("authUser");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial load from cache then verify with server
    const cachedUser = localStorage.getItem("authUser");
    const cachedToken = localStorage.getItem("accessToken");
    if (cachedUser && cachedToken) {
      try {
        setUser(JSON.parse(cachedUser));
        setToken(cachedToken);
      } catch {
        // ignore
      }
    }
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const data = await authApi.login({ email, password });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      setUser(data.user);
      setToken(data.accessToken);

      toast.success(`Xush kelibsiz, ${data.user.name}!`);

      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
      return data.user;
    } catch (err) {
      const msg = getErrorMessage(err, "Kirishda xatolik yuz berdi");
      toast.error(msg);
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<User> => {
    try {
      const data = await authApi.register({ name, email, password });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      setUser(data.user);
      setToken(data.accessToken);

      toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
      return data.user;
    } catch (err) {
      const msg = getErrorMessage(err, "Ro'yxatdan o'tishda xatolik yuz berdi");
      toast.error(msg);
      throw err;
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken") || undefined;
    await authApi.logout(refreshToken);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authUser");
    setUser(null);
    setToken(null);
    toast.info("Tizimdan chiqdingiz");
    router.push("/login");
  };

  const updateProfileName = async (name: string) => {
    try {
      const updated = await usersApi.updateProfile({ name });
      setUser((prev) => (prev ? { ...prev, name: updated.name } : updated));
      localStorage.setItem("authUser", JSON.stringify({ ...user, name: updated.name }));
      toast.success("Ismingiz muvaffaqiyatli yangilandi");
    } catch (err) {
      const msg = getErrorMessage(err, "Profilni yangilashda xatolik");
      toast.error(msg);
      throw err;
    }
  };

  const updateAvatar = async (file: File) => {
    try {
      const res = await usersApi.uploadAvatar(file);
      setUser((prev) => (prev ? { ...prev, avatarUrl: res.avatarUrl } : null));
      if (user) {
        localStorage.setItem(
          "authUser",
          JSON.stringify({ ...user, avatarUrl: res.avatarUrl })
        );
      }
      toast.success("Avatar muvaffaqiyatli yuklandi");
    } catch (err) {
      const msg = getErrorMessage(err, "Rasm yuklashda xatolik");
      toast.error(msg);
      throw err;
    }
  };

  const isAdmin = user?.role === "ADMIN";
  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        isAuthenticated,
        login,
        register,
        logout,
        refreshUser,
        updateProfileName,
        updateAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
