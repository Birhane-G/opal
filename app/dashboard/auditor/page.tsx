"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Stats {
  totalAuditLogs: number;
  totalMembers: number;
  totalTransactions: number;
  totalLoans: number;
  recentActivity: number;
}

export default function AuditorDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalAuditLogs: 0,
    totalMembers: 0,
    totalTransactions: 0,
    totalLoans: 0,
    recentActivity: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const userResponse = await fetch("/api/auth/user");
        if (!userResponse.ok) {
          router.push("/login");
          return;
        }
        const userData = await userResponse.json();

        if (userData.role !== "auditor") {
          router.push(`/dashboard/${userData.role}`);
          return;
        }
        const statsResponse = await fetch("/api/dashboard/auditor/stats");
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <main className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Auditor Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Monitor and review all system activities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Total Audit Logs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {stats.totalAuditLogs}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              System activity records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats.totalMembers}
            </div>
            <p className="text-xs text-gray-500 mt-1">Active members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {stats.totalTransactions}
            </div>
            <p className="text-xs text-gray-500 mt-1">All transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {stats.totalLoans}
            </div>
            <p className="text-xs text-gray-500 mt-1">Loan portfolio</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">
              {stats.recentActivity}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Activities in the last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audit Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">System Status:</span>
              <span className="font-semibold text-green-600">Operational</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Audit:</span>
              <span className="font-semibold">Today</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
