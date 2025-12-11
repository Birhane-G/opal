"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Member {
  id: string;
  email: string;
  full_name: string;
  member_number: string;
  is_active: boolean;
}

export default function ManagerMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const userResponse = await fetch("/api/auth/user");
        if (!userResponse.ok) {
          router.push("/login");
          return;
        }

        const userData = await userResponse.json();
        if (userData.role !== "manager") {
          router.push(`/dashboard/${userData.role}`);
          return;
        }

        const response = await fetch("/api/members");
        if (response.ok) {
          const data = await response.json();
          setMembers(data);
          setFilteredMembers(data);
        }
      } catch (error) {
        console.error("Error loading members:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMembers();
  }, [router]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = members.filter(
      (member) =>
        member.full_name.toLowerCase().includes(term.toLowerCase()) ||
        member.member_number.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredMembers(filtered);
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Members Overview</h1>
        <p className="text-gray-600 mt-1">View and monitor all members</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by name or member number..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Members ({filteredMembers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Member Number
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Full Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">
                        {member.member_number}
                      </td>
                      <td className="px-4 py-3">{member.full_name}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            member.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {member.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      No members found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
