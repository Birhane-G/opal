"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Member {
  id: string;
  email: string;
  full_name: string;
  member_number: string;
  is_active: boolean;
  created_at: string;
  share_capital: number;
  shares_held: number;
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const response = await fetch("/api/members");
        if (response.ok) {
          const data = await response.json();
          const membersList = data.members || data || [];
          setMembers(membersList);
          setFilteredMembers(membersList);
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
        member.member_number.toLowerCase().includes(term.toLowerCase()) ||
        member.email.toLowerCase().includes(term.toLowerCase())
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
        <h1 className="text-3xl font-bold text-gray-900">Member Management</h1>
        <p className="text-gray-600 mt-1">View and manage all members</p>
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
            placeholder="Search by name, member number, or email..."
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
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Member Number
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Shares Held
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Share Capital (ETB)
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Date Joined
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {member.member_number}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {member.full_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {member.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {member.shares_held || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {new Intl.NumberFormat("en-ET", {
                          style: "currency",
                          currency: "ETB",
                        }).format(member.share_capital || 0)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            member.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {member.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(member.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-4 text-center text-gray-500"
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
