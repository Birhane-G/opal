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

    const { data: memberData } = await supabase.from("members").select("id").eq("user_id", user.id).single()

    if (!memberData) {
      return NextResponse.json({ savings: [] })
    }

    const { data: savingsData, error } = await supabase
      .from("savings_accounts")
      .select("*")
      .eq("member_id", memberData.id)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ savings: savingsData || [] })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
