"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Dna,
  FileText,
  FolderArchive,
  Users,
  Warehouse,
  Move3d,
  LineChart,
  ClipboardList,
  LogOut,
} from "lucide-react";

interface Props {
  user: any;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onClose?: () => void;
}

export default function DashboardSidebar({
  user,
  onLogout,
  isMobileOpen = false,
  onClose,
}: Props) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    { href: "/dashboard/samples", label: "Samples", icon: <Dna size={20} /> },
    {
      href: "/dashboard/reports",
      label: "Reports",
      icon: <FileText size={20} />,
    },
    {
      href: "/dashboard/cases",
      label: "Cases",
      icon: <FolderArchive size={20} />,
    },
    { href: "/dashboard/users", label: "Users", icon: <Users size={20} /> },
    {
      href: "/dashboard/storage",
      label: "Storage",
      icon: <Warehouse size={20} />,
    },
    {
      href: "/dashboard/movements",
      label: "Movements",
      icon: <Move3d size={20} />,
    },
    {
      href: "/dashboard/analytics",
      label: "Analytics",
      icon: <LineChart size={20} />,
    },
    {
      href: "/dashboard/audit-logs",
      label: "Audit Logs",
      icon: <ClipboardList size={20} />,
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:relative z-50 h-screen transition-all duration-300 ease-in-out
          bg-gradient-to-b from-blue-900 to-blue-950 text-white
          ${
            isMobile
              ? isMobileOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : ""
          }
          ${isCollapsed ? "w-20" : "w-64"}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div
            className={`p-4 border-b border-blue-800 flex items-center ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            {!isCollapsed && (
              <h1 className="text-xl font-bold whitespace-nowrap">
                DNA Archive
              </h1>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded-full hover:bg-blue-800 transition-colors"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight width={20} height={20} />
              ) : (
                <ChevronLeft width={20} height={20} />
              )}
            </button>
          </div>

          {/* User Profile */}
          {user && (
            <div
              className={`p-4 border-b border-blue-800 ${
                isCollapsed ? "text-center" : "flex items-center gap-3"
              }`}
            >
              <div
                className={`rounded-full bg-blue-700 flex items-center justify-center ${
                  isCollapsed ? "w-8 h-8 mx-auto" : "w-10 h-10"
                }`}
              >
                <span className="font-medium">
                  {user.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </span>
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <div className="font-medium truncate">{user.name}</div>
                  <div className="text-xs text-blue-300 truncate">
                    {user.role?.role_name}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
        flex items-center p-3 rounded-lg transition-colors
        ${isActive ? "bg-blue-800/80" : "hover:bg-blue-800/50"}
        ${isCollapsed ? "justify-center" : ""}
      `}
                  onClick={isMobile ? onClose : undefined}
                >
                  <span
                    className={isActive ? "text-blue-200" : "text-blue-400"}
                  >
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="ml-3 whitespace-nowrap">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-blue-800">
            <button
              onClick={onLogout}
              className={`
                w-full font-semibold flex items-center justify-center p-2 rounded-lg transition-colors
                bg-sky-900 hover:bg-sky-800
                ${isCollapsed ? "" : "gap-2"}
              `}
            >
              <LogOut size={20} />
              {!isCollapsed && "Logout"}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
