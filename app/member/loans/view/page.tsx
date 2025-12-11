"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Loan {
  id: string
  loan_number: string
  loan_amount: number
  interest_rate: number
  loan_period: number
  status: string
  purpose: string
  total_repaid: number
  next_payment_date: string | null
}

export default function ViewLoansPage() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadLoans = async () => {
      try {
        const userResponse = await fetch("/api/auth/user")
        if (!userResponse.ok) {
          router.push("/login")
          return
        }

        const loansResponse = await fetch("/api/members/loans")
        if (loansResponse.ok) {
          const data = await loansResponse.json()
          setLoans(data.loans || [])
        }
      } catch (err) {
        console.error("Error loading loans:", err)
        setError("Failed to load loans")
      } finally {
        setIsLoading(false)
      }
    }

    loadLoans()
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
        <h1 className="text-3xl font-bold text-gray-900">My Loans</h1>
        <div className="flex gap-2">
          <Link href="/member/loans/apply">
            <Button className="bg-blue-600 hover:bg-blue-700">Apply for Loan</Button>
          </Link>
          <Link href="/dashboard/member">
            <Button variant="outline">Back</Button>
          </Link>
        </div>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-900">{error}</div>}

      {loans.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">No loans found.</p>
            <Link href="/member/loans/apply">
              <Button className="bg-blue-600 hover:bg-blue-700">Apply for Your First Loan</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {loans.map((loan) => (
            <Card key={loan.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Loan {loan.loan_number}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{loan.purpose}</p>
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                      loan.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : loan.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : loan.status === "disbursed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    {loan.status.toUpperCase()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Loan Amount</p>
                    <p className="font-semibold">
                      {new Intl.NumberFormat("en-ET", {
                        style: "currency",
                        currency: "ETB",
                      }).format(loan.loan_amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Interest Rate</p>
                    <p className="font-semibold">{loan.interest_rate}% p.a</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Period</p>
                    <p className="font-semibold">{loan.loan_period} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Repaid</p>
                    <p className="font-semibold">
                      {new Intl.NumberFormat("en-ET", {
                        style: "currency",
                        currency: "ETB",
                      }).format(loan.total_repaid)}
                    </p>
                  </div>
                </div>
                {loan.next_payment_date && (
                  <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                    <p className="text-sm text-blue-900">
                      Next payment due: {new Date(loan.next_payment_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}
