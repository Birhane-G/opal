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

    const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

    if (userData?.role !== "cso" && userData?.role !== "admin" && userData?.role !== "manager") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const memberNumber = `MEM${Date.now()}${Math.floor(Math.random() * 10000)}`
    const accountNumber = `ACC${Date.now()}${Math.floor(Math.random() * 10000)}`

    const { error: memberError, data: memberData } = await supabase
      .from("members")
      .insert([
        {
          member_number: memberNumber,
          full_name: body.full_name,
          national_id: body.national_id,
          date_of_birth: body.date_of_birth,
          address: body.address,
          next_of_kin: body.next_of_kin,
          next_of_kin_phone: body.next_of_kin_phone,
          employment_status: body.employment_status,
          membership_status: "active",
        },
      ])
      .select()

    if (memberError) {
      return NextResponse.json({ error: memberError.message }, { status: 400 })
    }
    
    if (memberData && memberData[0]) {
      const { error: savingsError } = await supabase.from("savings_accounts").insert([
        {
          member_id: memberData[0].id,
          account_number: accountNumber,
          account_type: "mandatory",
          is_active: true,
        },
      ])

      if (savingsError) {
        return NextResponse.json({ error: savingsError.message }, { status: 400 })
      }
    }

    return NextResponse.json({
      success: true,
      member: memberData?.[0],
      message: `Member ${memberNumber} registered successfully`,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
