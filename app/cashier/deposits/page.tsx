"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DepositsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
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
        console.error("Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
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
        <h1 className="text-3xl font-bold text-gray-900">Deposit Transactions</h1>
        <p className="text-gray-600 mt-1">Process member deposits</p>
      </div>

      <div className="mb-6">
        <Button onClick={() => setShowForm(!showForm)} className="bg-green-600 hover:bg-green-700">
          {showForm ? "Cancel" : "New Deposit"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6 max-w-2xl">
          <CardHeader>
            <CardTitle>Process Deposit</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label>Member Number</Label>
                <Input placeholder="Enter member number" />
              </div>
              <div className="space-y-2">
                <Label>Amount (ETB)</Label>
                <Input type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label>Deposit Type</Label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option>Mandatory Savings</option>
                  <option>Voluntary Savings</option>
                  <option>Fixed Deposit</option>
                </select>
              </div>
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                Process Deposit
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Deposits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">No deposits recorded</div>
        </CardContent>
      </Card>
    </main>
  )
}
