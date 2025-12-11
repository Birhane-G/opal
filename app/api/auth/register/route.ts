import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, phone, sharesHeld } =
      await request.json();

    const shares = Number.parseInt(sharesHeld) || 2;
    if (shares < 2) {
      return NextResponse.json(
        { error: "Minimum share purchase is 2 shares (2,000 ETB)" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error: signUpError, data } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 400 });
    }

    if (data.user) {
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: data.user.id,
          email,
          full_name: fullName || email.split("@")[0],
          phone,
          role: "member",
          is_active: true,
        },
      ]);

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 400 }
        );
      }

      const shareCapital = shares * 1000;
      const memberNumber = `MEM${Date.now()}${Math.floor(
        Math.random() * 10000
      )}`;
      const { error: memberError } = await supabase.from("members").insert([
        {
          user_id: data.user.id,
          member_number: memberNumber,
          membership_status: "active",
          share_capital: shareCapital,
          shares_held: shares,
        },
      ]);

      if (memberError) {
        return NextResponse.json(
          { error: memberError.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ success: true, user: data.user });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
