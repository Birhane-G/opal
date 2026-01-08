import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const allowedRoles = [
      "admin",
      "manager",
      "cso",
      "cashier",
      "credit_officer",
      "auditor",
    ];
    if (!userData || !allowedRoles.includes(userData.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: members, error } = await supabase
      .from("users")
      .select("id, email, full_name, is_active, created_at, role")
      // .eq("role", "member")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (members && members.length > 0) {
      const userIds = members.map((m) => m.id);
      const { data: memberDetails } = await supabase
        .from("members")
        .select("user_id, member_number, share_capital, shares_held")
        .in("user_id", userIds);

      const memberDetailsMap = new Map(
        memberDetails?.map((m: any) => [m.user_id, m]) || []
      );
      const enrichedMembers = members.map((user: any) => ({
        ...user,
        member_number: memberDetailsMap.get(user.id)?.member_number || "N/A",
        share_capital: memberDetailsMap.get(user.id)?.share_capital || 0,
        shares_held: memberDetailsMap.get(user.id)?.shares_held || 0,
      }));
      return NextResponse.json({ members: enrichedMembers });
    }

    return NextResponse.json({ members: [] });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
