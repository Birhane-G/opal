"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface MemberStats {
  member: any
  balance: number
}

export default function MemberDashboard() {
  const [stats, setStats] = useState<MemberStats>({
    member: null,
    balance: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        const userResponse = await fetch("/api/auth/user")
        if (!userResponse.ok) {
          router.push("/login")
          return
        }

        const userData = await userResponse.json()

        if (userData.role !== "member") {
          router.push(`/dashboard/${userData.role}`)
          return
        }

        const statsResponse = await fetch("/api/dashboard/member/stats")
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <main className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Member Portal</h1>
        <p className="text-gray-600 mt-1">Manage your savings, loans, and account</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB" }).format(stats.balance)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total savings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Member Number</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.member?.member_number || "N/A"}</div>
            <p className="text-xs text-gray-500 mt-1">Your ID</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 capitalize">
              {stats.member?.membership_status || "Active"}
            </div>
            <p className="text-xs text-gray-500 mt-1">Membership status</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Savings</CardTitle>
            <CardDescription>Manage your savings accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/member/savings">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">View Savings</Button>
            </Link>
            <Link href="/member/transactions">
              <Button variant="outline" className="w-full bg-transparent">
                Transaction History
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loans</CardTitle>
            <CardDescription>Apply and manage loans</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/member/loans/apply">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Apply for Loan</Button>
            </Link>
            <Link href="/member/loans/view">
              <Button variant="outline" className="w-full bg-transparent">
                View My Loans
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/member/profile">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Edit Profile</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-transparent">
              Change Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
