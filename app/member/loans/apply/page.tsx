"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoanApplicationPage() {
  const [loanAmount, setLoanAmount] = useState("")
  const [loanPeriod, setLoanPeriod] = useState("12")
  const [purpose, setPurpose] = useState("")
  const [memberNumber, setMemberNumber] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadMember = async () => {
      try {
        const userResponse = await fetch("/api/auth/user")
        if (!userResponse.ok) {
          router.push("/login")
          return
        }

        const profileResponse = await fetch("/api/members/profile")
        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          setMemberNumber(profileData.member.member_number)
        }
      } catch (error) {
        console.error("Error loading member:", error)
        setMessage({ type: "error", text: "Failed to load member information" })
      } finally {
        setIsLoading(false)
      }
    }

    loadMember()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch("/api/loans/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loan_amount: Number.parseFloat(loanAmount),
          loan_period: Number.parseInt(loanPeriod),
          purpose,
          interest_rate: 10,
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Failed to submit application")

      setMessage({
        type: "success",
        text: `Loan application submitted! Loan Number: ${data.loan?.loan_number || "Processing..."}`,
      })

      setTimeout(() => {
        router.push("/member/loans/view")
      }, 2000)
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to submit application",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

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
    <main className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Apply for Loan</CardTitle>
          <CardDescription>Submit your loan application</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                Member Number: <span className="font-semibold">{memberNumber}</span>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="loanAmount">Loan Amount (ETB)</Label>
              <Input
                id="loanAmount"
                type="number"
                placeholder="10000"
                required
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                min="1000"
                step="100"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="loanPeriod">Loan Period (Months)</Label>
              <select
                id="loanPeriod"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={loanPeriod}
                onChange={(e) => setLoanPeriod(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="6">6 months</option>
                <option value="12">12 months</option>
                <option value="24">24 months</option>
                <option value="36">36 months</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose of Loan</Label>
              <textarea
                id="purpose"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the purpose of this loan"
                required
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={4}
                disabled={isSubmitting}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-sm border border-gray-200">
              <p className="font-semibold mb-2 text-gray-900">Loan Details:</p>
              <p className="text-gray-700">Amount: ETB {Number.parseFloat(loanAmount || "0").toLocaleString()}</p>
              <p className="text-gray-700">Period: {loanPeriod} months</p>
              <p className="text-gray-700">Interest Rate: 10% per annum</p>
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg border ${
                  message.type === "success"
                    ? "bg-green-50 text-green-900 border-green-200"
                    : "bg-red-50 text-red-900 border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={isSubmitting || !loanAmount} className="bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
