"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CreditOfficerDashboard() {
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

        if (userData.role !== "credit-officer") {
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
        <h1 className="text-3xl font-bold text-gray-900">Credit Officer Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage loans, credit assessment, and portfolio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Loan Processing</CardTitle>
            <CardDescription>Review and process loan applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/credit-officer/loans/pending">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Review Applications</Button>
            </Link>
            <Link href="/credit-officer/credit-assessment">
              <Button variant="outline" className="w-full bg-transparent">
                Credit Assessment
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loan Portfolio</CardTitle>
            <CardDescription>Manage active loans and arrears</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/credit-officer/active-loans">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Active Loans</Button>
            </Link>
            <Link href="/credit-officer/arrears">
              <Button variant="outline" className="w-full bg-transparent">
                Manage Arrears
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guarantor Management</CardTitle>
            <CardDescription>View and manage guarantor information</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/credit-officer/guarantors">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Guarantor Details</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>Generate loan and portfolio reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/credit-officer/reports">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Loan Reports</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
