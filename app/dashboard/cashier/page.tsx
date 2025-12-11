"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CashierDashboard() {
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

        if (userData.role !== "cashier") {
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
        <h1 className="text-3xl font-bold text-gray-900">Cashier Dashboard</h1>
        <p className="text-gray-600 mt-1">Process transactions and manage cash flow</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Transactions</CardTitle>
            <CardDescription>Process deposits and withdrawals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/cashier/deposit">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Process Deposit</Button>
            </Link>
            <Link href="/cashier/withdrawal">
              <Button variant="outline" className="w-full bg-transparent">
                Process Withdrawal
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loan Transactions</CardTitle>
            <CardDescription>Handle loan disbursement and repayment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/cashier/disburse">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Disburse Loan</Button>
            </Link>
            <Link href="/cashier/repayment">
              <Button variant="outline" className="w-full bg-transparent">
                Loan Repayment
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cash Management</CardTitle>
            <CardDescription>Monitor cash balance and reconciliation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/cashier/balance">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Daily Balance</Button>
            </Link>
            <Link href="/cashier/reconciliation">
              <Button variant="outline" className="w-full bg-transparent">
                Reconciliation
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>View transaction history and reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/cashier/transactions">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Transaction History</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
