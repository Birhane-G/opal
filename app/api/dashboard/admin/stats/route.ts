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

    if (userData?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { count: totalMembers } = await supabase
      .from("members")
      .select("*", { count: "exact", head: true });

    const { data: savingsData } = await supabase
      .from("savings_accounts")
      .select("balance");

    const totalSavings =
      savingsData?.reduce(
        (sum: number, acc: any) => sum + (acc.balance || 0),
        0
      ) || 0;

    const { data: shareData } = await supabase
      .from("members")
      .select("share_capital, shares_held");

    const totalShareCapital =
      shareData?.reduce(
        (sum: number, member: any) => sum + (member.share_capital || 0),
        0
      ) || 0;
    const totalSharesHeld =
      shareData?.reduce(
        (sum: number, member: any) => sum + (member.shares_held || 0),
        0
      ) || 0;

    const { count: totalLoans } = await supabase
      .from("loans")
      .select("*", { count: "exact", head: true });

    const { count: activeLoans } = await supabase
      .from("loans")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved");

    return NextResponse.json({
      totalMembers: totalMembers || 0,
      totalSavings,
      totalLoans: totalLoans || 0,
      activeLoans: activeLoans || 0,
      totalShareCapital,
      totalSharesHeld,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
