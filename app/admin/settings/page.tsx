"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userResponse = await fetch("/api/auth/user");
        if (!userResponse.ok) {
          router.push("/login");
          return;
        }

        const userData = await userResponse.json();
        if (userData.role !== "admin") {
          router.push(`/dashboard/${userData.role}`);
          return;
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <main className="p-4 md:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600 mt-1">Configure system parameters</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Organization Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Organization Name</Label>
              <Input placeholder="Opal SACCO" disabled />
            </div>
            <div className="space-y-2">
              <Label>Organization Email</Label>
              <Input type="email" placeholder="info@Opal.com" disabled />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Maintenance Mode</Label>
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-sm text-gray-600">
                  Enable maintenance mode
                </span>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Update Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
