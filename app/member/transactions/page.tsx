"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Transaction {
  id: string
  created_at: string
  transaction_type: string
  amount: number
  balance_after: number
  reference_number: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const userResponse = await fetch("/api/auth/user")
        if (!userResponse.ok) {
          router.push("/login")
          return
        }

        const transResponse = await fetch("/api/members/transactions")
        if (transResponse.ok) {
          const data = await transResponse.json()
          setTransactions(data.transactions || [])
        }
      } catch (err) {
        console.error("Error loading transactions:", err)
        setError("Failed to load transactions")
      } finally {
        setIsLoading(false)
      }
    }

    loadTransactions()
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
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
        <Link href="/dashboard/member">
          <Button variant="outline">Back</Button>
        </Link>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-900">{error}</div>}

      {transactions.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">No transactions found.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-right py-3 px-4 font-semibold">Amount</th>
                    <th className="text-right py-3 px-4 font-semibold">Balance</th>
                    <th className="text-left py-3 px-4 font-semibold">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{new Date(txn.created_at).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                            txn.transaction_type === "deposit"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {txn.transaction_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">
                        {new Intl.NumberFormat("en-ET", {
                          style: "currency",
                          currency: "ETB",
                        }).format(txn.amount)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {new Intl.NumberFormat("en-ET", {
                          style: "currency",
                          currency: "ETB",
                        }).format(txn.balance_after || 0)}
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-600">{txn.reference_number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
