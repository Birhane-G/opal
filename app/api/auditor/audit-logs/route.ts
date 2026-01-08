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

    const { data: logs, error } = await supabase
      .from("audit_logs")
      .select(
        `
        id,
        action,
        table_name,
        ip_address,
        created_at,
        user_id,
        users!inner(email)
      `
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    const formattedLogs = logs?.map((log: any) => ({
      id: log.id,
      action: log.action,
      table_name: log.table_name,
      ip_address: log.ip_address,
      created_at: log.created_at,
      user_email: log.users?.email || "Unknown",
    }));

    return NextResponse.json({ logs: formattedLogs || [] });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
