import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.user.id)
      .single();

    if (userData?.role !== "auditor") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [auditLogsResult, membersResult, transactionsResult, loansResult] =
      await Promise.all([
        supabase
          .from("audit_logs")
          .select("id", { count: "exact", head: true }),
        supabase.from("members").select("id", { count: "exact", head: true }),
        supabase
          .from("transactions")
          .select("id", { count: "exact", head: true }),
        supabase.from("loans").select("id", { count: "exact", head: true }),
      ]);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { count: recentActivity } = await supabase
      .from("audit_logs")
      .select("id", { count: "exact", head: true })
      .gte("created_at", yesterday.toISOString());

    return NextResponse.json({
      totalAuditLogs: auditLogsResult.count || 0,
      totalMembers: membersResult.count || 0,
      totalTransactions: transactionsResult.count || 0,
      totalLoans: loansResult.count || 0,
      recentActivity: recentActivity || 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
