"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardSidebar from "@/components/dashboard-sidebar"

export default function CashierLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [userEmail, setUserEmail] = useState("")
  const [userRole, setUserRole] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch("/api/auth/user")
        if (!response.ok) {
          router.push("/login")
          return
        }
        const userData = await response.json()
        if (userData.role !== "cashier") {
          router.push(`/dashboard/${userData.role}`)
          return
        }
        setUserEmail(userData.email)
        setUserRole(userData.role)
      } catch (error) {
        console.error("Error loading user:", error)
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar role={userRole} userEmail={userEmail} />
      <div className="flex-1 md:ml-0">{children}</div>
    </div>
  )
}
