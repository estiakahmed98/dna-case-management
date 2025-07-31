"use client";

import DashboardSidebar from "@/components/dashboard-sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true for development
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // For development, we'll skip authentication
    // In production, you would check for a valid token here
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token) {
      // For now, we'll create a demo token to avoid constant redirects
      localStorage.setItem("token", "demo-token");
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(true);
    }
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <DashboardSidebar user={user} onLogout={handleLogout} />
      {/* Main Content */}
      <main className="flex-1 bg-gray-50 overflow-y-auto">{children}</main>
    </div>
  );
}
