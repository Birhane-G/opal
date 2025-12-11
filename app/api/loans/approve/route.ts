import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { loanId, approved, approvalAmount } = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

    const allowedRoles = ["manager", "credit_officer", "admin"]
    if (!userData || !allowedRoles.includes(userData.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const status = approved ? "approved" : "rejected"

    const { error: updateError, data: updatedLoan } = await supabase
      .from("loans")
      .update({
        status,
        approved_by: user.id,
        approved_at: new Date().toISOString(),
        loan_amount: approvalAmount || undefined,
      })
      .eq("id", loanId)
      .select()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    if (approved && updatedLoan?.[0]) {
      const loan = updatedLoan[0]
      const monthlyPayment = loan.loan_amount / loan.loan_period

      for (let i = 1; i <= loan.loan_period; i++) {
        const dueDate = new Date()
        dueDate.setMonth(dueDate.getMonth() + i)

        await supabase.from("loan_repayments").insert([
          {
            loan_id: loanId,
            due_date: dueDate.toISOString().split("T")[0],
            amount_due: monthlyPayment,
            status: "pending",
          },
        ])
      }
    }

    return NextResponse.json({
      success: true,
      loan: updatedLoan?.[0],
      message: `Loan ${status} successfully`,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
