"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface SavingsAccount {
  id: string
  account_type: string
  account_number: string
  balance: number
  monthly_target: number
  accumulated_interest: number
}

export default function SavingsPage() {
  const [savings, setSavings] = useState<SavingsAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadSavings = async () => {
      try {
        const userResponse = await fetch("/api/auth/user")
        if (!userResponse.ok) {
          router.push("/login")
          return
        }

        const savingsResponse = await fetch("/api/members/savings")
        if (savingsResponse.ok) {
          const data = await savingsResponse.json()
          setSavings(data.savings || [])
        }
      } catch (err) {
        console.error("Error loading savings:", err)
        setError("Failed to load savings accounts")
      } finally {
        setIsLoading(false)
      }
    }

    loadSavings()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Savings Accounts</h1>
        <Link href="/dashboard/member">
          <Button variant="outline">Back</Button>
        </Link>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-900">{error}</div>}

      {savings.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">No savings accounts found. Contact us to open an account.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savings.map((saving) => (
            <Card key={saving.id}>
              <CardHeader>
                <CardTitle className="text-lg capitalize">{saving.account_type}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Account Number</p>
                    <p className="font-semibold">{saving.account_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Balance</p>
                    <p className="text-2xl font-bold text-green-600">
                      {new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB" }).format(saving.balance)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Monthly Target</p>
                      <p className="font-semibold">
                        {new Intl.NumberFormat("en-ET", {
                          style: "currency",
                          currency: "ETB",
                        }).format(saving.monthly_target)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Interest</p>
                      <p className="font-semibold">
                        {new Intl.NumberFormat("en-ET", {
                          style: "currency",
                          currency: "ETB",
                        }).format(saving.accumulated_interest)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
