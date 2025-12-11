"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  LogOut,
  Home,
  Users,
  FileText,
  Settings,
  BarChart3,
  DollarSign,
  CreditCard,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface DashboardSidebarProps {
  role: string;
  userEmail: string;
}

const roleNavigation: Record<string, NavItem[]> = {
  admin: [
    {
      label: "Dashboard",
      href: "/dashboard/admin",
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: "Members",
      href: "/admin/members",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "Loans",
      href: "/admin/loans",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      label: "Transactions",
      href: "/admin/transactions",
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      label: "Reports",
      href: "/admin/reports",
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      label: "Audit Logs",
      href: "/admin/audit-logs",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ],
  manager: [
    {
      label: "Dashboard",
      href: "/dashboard/manager",
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: "Members",
      href: "/manager/members",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "Loans",
      href: "/manager/loans",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      label: "Reports",
      href: "/manager/reports",
      icon: <BarChart3 className="w-5 h-5" />,
    },
  ],
  cso: [
    {
      label: "Dashboard",
      href: "/dashboard/cso",
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: "Members",
      href: "/cso/members",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "Savings",
      href: "/cso/savings",
      icon: <DollarSign className="w-5 h-5" />,
    },
  ],
  cashier: [
    {
      label: "Dashboard",
      href: "/dashboard/cashier",
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: "Deposits",
      href: "/cashier/deposits",
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      label: "Withdrawals",
      href: "/cashier/withdrawals",
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      label: "Transactions",
      href: "/cashier/transactions",
      icon: <FileText className="w-5 h-5" />,
    },
  ],
  "credit-officer": [
    {
      label: "Dashboard",
      href: "/dashboard/credit-officer",
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: "Loan Requests",
      href: "/credit-officer/requests",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      label: "Approvals",
      href: "/credit-officer/approvals",
      icon: <FileText className="w-5 h-5" />,
    },
  ],
  member: [
    {
      label: "Dashboard",
      href: "/dashboard/member",
      icon: <Home className="w-5 h-5" />,
    },
    {
      label: "Profile",
      href: "/member/profile",
      icon: <Users className="w-5 h-5" />,
    },
    {
      label: "Savings",
      href: "/member/savings",
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      label: "Loans",
      href: "/member/loans/view",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      label: "Transactions",
      href: "/member/transactions",
      icon: <FileText className="w-5 h-5" />,
    },
  ],
};

export default function DashboardSidebar({
  role,
  userEmail,
}: DashboardSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = roleNavigation[role as keyof typeof roleNavigation] || [];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-blue-600 text-white md:hidden"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-blue-900 text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 p-4 border-b border-blue-800">
            <img
              src="/logo-light.png"
              alt="Opal SACCO logo"
              className="h-14 w-14 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold">Opal</h1>
              <p className="text-sm text-blue-300">SACCO Portal</p>
            </div>
          </div>

          <div className="p-4 border-b border-blue-800">
            <div className="text-xs text-blue-300">Logged in as</div>
            <div className="text-sm font-semibold truncate">{userEmail}</div>
            <div className="text-xs text-blue-400 capitalize mt-1">{role}</div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <button
                        onClick={() => setIsOpen(false)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-blue-700 text-white"
                            : "text-blue-100 hover:bg-blue-800"
                        }`}
                      >
                        {item.icon}
                        <span className="text-sm">{item.label}</span>
                      </button>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-blue-800">
            <Button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div className="hidden md:block w-64" />
    </>
  );
}
