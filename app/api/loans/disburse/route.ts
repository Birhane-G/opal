import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { loanId, disbursementDate } = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

    const allowedRoles = ["cashier", "manager", "admin"]
    if (!userData || !allowedRoles.includes(userData.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { error: updateError, data: updatedLoan } = await supabase
      .from("loans")
      .update({
        status: "active",
        disbursed_at: disbursementDate || new Date().toISOString(),
        disbursed_by: user.id,
      })
      .eq("id", loanId)
      .select()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      loan: updatedLoan?.[0],
      message: "Loan disbursed successfully",
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
