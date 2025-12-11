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

    const { data: userData, error: userError } = await supabase.from("users").select("*").eq("id", user.id).single()

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 400 })
    }

    const { data: memberData, error: memberError } = await supabase
      .from("members")
      .select("*")
      .eq("user_id", user.id)
      .single()

    return NextResponse.json({
      user: userData,
      member: memberData || null,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { fullName, phone, address } = body

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error: updateUserError } = await supabase
      .from("users")
      .update({
        full_name: fullName,
        phone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateUserError) {
      return NextResponse.json({ error: updateUserError.message }, { status: 400 })
    }

    if (address) {
      const { error: updateMemberError } = await supabase
        .from("members")
        .update({ address, updated_at: new Date().toISOString() })
        .eq("user_id", user.id)

      if (updateMemberError) {
        return NextResponse.json({ error: updateMemberError.message }, { status: 400 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
