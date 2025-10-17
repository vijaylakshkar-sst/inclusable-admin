"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContextType, User } from "@/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Check token on mount
  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        
        if (data.status && data.data) {
          // 🚫 Block Admin login         
           
          if (data.data.role === "Admin") {
            setUser(data.data);
           
          } else {
            alert("You are not authorized to access this panel.");
            localStorage.removeItem("token");
            setUser(null);
            router.push("/admin/signin");
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  } else {
    setLoading(false);
  }
}, []);


  const login = async (email: string, password: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log(data);
    
    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      setUser(data.data.user);
      router.push("/admin/dashboard");
    } else {
      throw new Error(data.message || "Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/admin/signin");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
