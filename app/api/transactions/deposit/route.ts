import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { memberId, amount, description } = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

    const allowedRoles = ["cashier", "cso", "admin"]
    if (!userData || !allowedRoles.includes(userData.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data: account, error: accountError } = await supabase
      .from("savings_accounts")
      .select("*")
      .eq("member_id", memberId)
      .eq("account_type", "mandatory")
      .single()

    if (accountError || !account) {
      return NextResponse.json({ error: "Savings account not found" }, { status: 404 })
    }

    const newBalance = account.balance + amount

    const referenceNumber = `DEP${Date.now()}${Math.floor(Math.random() * 10000)}`

    const { error: txnError, data: transaction } = await supabase
      .from("transactions")
      .insert([
        {
          member_id: memberId,
          account_id: account.id,
          transaction_type: "deposit",
          amount,
          balance_after: newBalance,
          reference_number: referenceNumber,
          description: description || "Deposit",
          processed_by: user.id,
        },
      ])
      .select()

    if (txnError) {
      return NextResponse.json({ error: txnError.message }, { status: 400 })
    }

    const { error: updateError } = await supabase
      .from("savings_accounts")
      .update({ balance: newBalance })
      .eq("id", account.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      transaction: transaction?.[0],
      newBalance,
      referenceNumber,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
