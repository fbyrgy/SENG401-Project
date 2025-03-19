'use client'

import { createContext, useContext, useState, useEffect } from "react";
import { BACKEND_URL } from "../config";

interface AuthContextType {
  isLoggedIn: boolean;
  userId: string | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Access localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
      const storedUserId = localStorage.getItem("userId");

      if (storedIsLoggedIn === "true" && storedUserId) {
        setIsLoggedIn(true);
        setUserId(storedUserId);
      }
    }
  }, []);

  // Function to set user Id and login status
  const login = async (email: string) => {
    try {

      // Get the user ID
      const response = await fetch(`${BACKEND_URL}/connection/get_user_id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        const retrievedUserId = data.user_id;
        setIsLoggedIn(true);
        setUserId(retrievedUserId);

        
        if (typeof window !== "undefined") {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userId", retrievedUserId);
          localStorage.setItem("email", email);
        }
      } else {
        throw new Error(data.error || "Failed to fetch user ID");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Function to clear userId and login status
  const logout = () => {
    setIsLoggedIn(false);
    setUserId(null);

    // Remove from localStorage (only in the browser)
    if (typeof window !== "undefined") {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userId");
      localStorage.removeItem("email");
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
