import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: memberData, error: memberError } = await supabase
      .from("members")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (memberError || !memberData) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }
    
    const loanNumber = `LOAN${Date.now()}${Math.floor(Math.random() * 10000)}`

    const { error: loanError, data: loanData } = await supabase
      .from("loans")
      .insert([
        {
          member_id: memberData.id,
          loan_number: loanNumber,
          loan_amount: body.loan_amount,
          interest_rate: body.interest_rate || 10,
          loan_period: body.loan_period,
          purpose: body.purpose,
          collateral_description: body.collateral_description,
          status: "pending",
        },
      ])
      .select()

    if (loanError) {
      return NextResponse.json({ error: loanError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, loan: loanData?.[0] })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
