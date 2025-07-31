"use client";

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
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          DNA Archive
        </div>
        
        {user && (
          <div className="p-4 border-b border-gray-700">
            <div className="text-sm">
              <div className="font-medium">{user.name}</div>
              <div className="text-gray-400">{user.role?.role_name}</div>
            </div>
          </div>
        )}
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="block p-2 rounded hover:bg-gray-700">
            📊 Dashboard
          </Link>
          <Link href="/dashboard/samples" className="block p-2 rounded hover:bg-gray-700">
            🧬 Samples
          </Link>
          <Link href="/dashboard/reports" className="block p-2 rounded hover:bg-gray-700">
            📄 Reports
          </Link>
          <Link href="/dashboard/cases" className="block p-2 rounded hover:bg-gray-700">
            📋 Cases
          </Link>
          <Link href="/dashboard/users" className="block p-2 rounded hover:bg-gray-700">
            👥 Users
          </Link>
          <Link href="/dashboard/storage" className="block p-2 rounded hover:bg-gray-700">
            🏪 Storage
          </Link>
          <Link href="/dashboard/movements" className="block p-2 rounded hover:bg-gray-700">
            📦 Movements
          </Link>
          <Link href="/dashboard/analytics" className="block p-2 rounded hover:bg-gray-700">
            📈 Analytics
          </Link>
          <Link href="/dashboard/audit-logs" className="block p-2 rounded hover:bg-gray-700">
            📝 Audit Logs
          </Link>
        </nav>
        
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={handleLogout}
            className="w-full p-2 rounded bg-red-600 hover:bg-red-700 text-white"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
