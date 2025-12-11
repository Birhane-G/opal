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

    const { data: memberData } = await supabase.from("members").select("*").eq("user_id", user.id).single()

    if (!memberData) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    const { data: savingsData } = await supabase
      .from("savings_accounts")
      .select("balance")
      .eq("member_id", memberData.id)
      .single()

    return NextResponse.json({
      member: memberData,
      balance: savingsData?.balance || 0,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
