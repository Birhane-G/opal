import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (!userData || userData.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { count: totalMembers } = await supabase.from("members").select("*", { count: "exact" })
    const { count: totalLoans } = await supabase.from("loans").select("*", { count: "exact" })
    const { count: activeLoans } = await supabase.from("loans").select("*", { count: "exact" }).eq("status", "active")

    const { data: totalSavings } = await supabase.from("savings_accounts").select("balance")

    const totalSavingsAmount = totalSavings?.reduce((sum, acc) => sum + (acc.balance || 0), 0) || 0

    return NextResponse.json({
      stats: {
        totalMembers: totalMembers || 0,
        totalLoans: totalLoans || 0,
        activeLoans: activeLoans || 0,
        totalSavings: totalSavingsAmount,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
