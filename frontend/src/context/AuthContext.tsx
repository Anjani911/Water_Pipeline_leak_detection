import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, username?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedRole = localStorage.getItem("userRole") as UserRole | null;
    const storedUsername = localStorage.getItem("username") || null;
    if (storedRole) {
      return { role: storedRole, ...(storedUsername ? { username: storedUsername } : {}) } as User;
    }
    return null;
  });

  const login = (role: UserRole, username?: string) => {
    const newUser: User = { role, ...(username ? { username } : {}) };
    setUser(newUser);
    localStorage.setItem("userRole", role);
    if (username) {
      localStorage.setItem("username", username);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
