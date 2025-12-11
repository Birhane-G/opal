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

    if (userData?.role !== "manager") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { count: memberCount } = await supabase.from("members").select("*", { count: "exact", head: true })

    const { count: pendingLoans } = await supabase
      .from("loans")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")

    const { data: savingsData } = await supabase.from("savings_accounts").select("balance")
    const totalSavings = savingsData?.reduce((sum: number, acc: any) => sum + (acc.balance || 0), 0) || 0

    return NextResponse.json({
      memberCount: memberCount || 0,
      pendingLoans: pendingLoans || 0,
      totalSavings,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
