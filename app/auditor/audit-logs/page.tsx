"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface AuditLog {
  id: string;
  user_email: string;
  action: string;
  table_name: string;
  created_at: string;
  ip_address: string;
}

export default function AuditorAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const response = await fetch("/api/auditor/audit-logs");
        if (response.ok) {
          const data = await response.json();
          setLogs(data.logs || []);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    loadLogs();
  }, []);

  const filteredLogs = logs.filter(
    (log) =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.table_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <main className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-600 mt-1">
          View all system activity and changes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Audit Trail</CardTitle>
          <Input
            type="text"
            placeholder="Search logs by action, user, or table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-4"
          />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Date/Time</th>
                  <th className="text-left p-3">User</th>
                  <th className="text-left p-3">Action</th>
                  <th className="text-left p-3">Table</th>
                  <th className="text-left p-3">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-gray-500">
                      No audit logs found
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="p-3">{log.user_email}</td>
                      <td className="p-3">{log.action}</td>
                      <td className="p-3">{log.table_name || "-"}</td>
                      <td className="p-3">{log.ip_address || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
