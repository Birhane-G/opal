"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ManagerStats {
  memberCount: number
  pendingLoans: number
  totalSavings: number
}

export default function ManagerDashboard() {
  const [stats, setStats] = useState<ManagerStats>({
    memberCount: 0,
    pendingLoans: 0,
    totalSavings: 0,
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

        if (userData.role !== "manager") {
          router.push(`/dashboard/${userData.role}`)
          return
        }

        const statsResponse = await fetch("/api/dashboard/manager/stats")
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
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage loans, members, and cooperative operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.memberCount}</div>
            <p className="text-xs text-gray-500 mt-1">Active members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.pendingLoans}</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB" }).format(stats.totalSavings)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Combined savings</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Loan Management</CardTitle>
            <CardDescription>Review and approve loan applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/manager/loans">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Review Pending Loans</Button>
            </Link>
            <Link href="/manager/loans/approved">
              <Button variant="outline" className="w-full bg-transparent">
                View Approved Loans
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Member Management</CardTitle>
            <CardDescription>Manage member accounts and information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/manager/members">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">View All Members</Button>
            </Link>
            <Link href="/manager/reports">
              <Button variant="outline" className="w-full bg-transparent">
                Generate Reports
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
