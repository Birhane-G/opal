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

    const { data: memberData, error: memberError } = await supabase
      .from("members")
      .select("id")
      .eq("user_id", user.id)
      .single()

    if (memberError || !memberData) {
      return NextResponse.json({ loans: [] })
    }

    const { data: loansData, error: loansError } = await supabase
      .from("loans")
      .select("*")
      .eq("member_id", memberData.id)
      .order("created_at", { ascending: false })

    if (loansError) {
      return NextResponse.json({ error: loansError.message }, { status: 400 })
    }

    return NextResponse.json({ loans: loansData || [] })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
