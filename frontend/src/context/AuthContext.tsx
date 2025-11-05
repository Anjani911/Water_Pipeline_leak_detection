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
    
    console.log("🔧 AuthContext initializing from localStorage:", {
      storedRole,
      storedUsername,
    });
    
    if (storedRole) {
      const initialUser = { role: storedRole, ...(storedUsername ? { username: storedUsername } : {}) } as User;
      console.log("✅ User restored from localStorage:", initialUser);
      return initialUser;
    }
    
    console.log("⚠️ No user in localStorage, starting with null");
    return null;
  });

  const login = (role: UserRole, username?: string) => {
    const newUser: User = { role, ...(username ? { username } : {}) };
    console.log("🔑 Login called:", newUser);
    setUser(newUser);
    localStorage.setItem("userRole", role);
    if (username) {
      localStorage.setItem("username", username);
    }
    console.log("💾 User saved to localStorage");
  };

  const logout = () => {
    console.log("🚪 Logout called");
    setUser(null);
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    console.log("🗑️ User cleared from localStorage");
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
