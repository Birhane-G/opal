"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CSODashboard() {
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

        if (userData.role !== "cso") {
          router.push(`/dashboard/${userData.role}`)
          return
        }
      } catch (error) {
        console.error("Error loading data:", error)
        router.push("/login")
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
        <h1 className="text-3xl font-bold text-gray-900">CSO Dashboard</h1>
        <p className="text-gray-600 mt-1">Customer Service Officer operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Member Services</CardTitle>
            <CardDescription>Register and manage members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/cso/register-member">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Register New Member</Button>
            </Link>
            <Link href="/cso/members">
              <Button variant="outline" className="w-full bg-transparent">
                View Members
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>Process deposits and withdrawals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/cso/transactions">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Process Transaction</Button>
            </Link>
            <Link href="/cso/statements">
              <Button variant="outline" className="w-full bg-transparent">
                Issue Statements
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loan Processing</CardTitle>
            <CardDescription>Handle loan applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/cso/loans/new">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">New Loan Application</Button>
            </Link>
            <Link href="/cso/loans/pending">
              <Button variant="outline" className="w-full bg-transparent">
                Pending Applications
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>Generate daily reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/cso/reports">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Daily Reports</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
