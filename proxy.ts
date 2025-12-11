import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function proxy(request: Request) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const cookieStore = await cookies()
  const authToken =
    cookieStore.get("sb-auth-token")?.value || request.headers.get("Authorization")?.replace("Bearer ", "")

  if (authToken) {
    const res = await fetch(`${supabaseUrl}/auth/v1/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        APIKey: supabaseAnonKey || "",
      },
    })

    if (res.ok) {
      response.headers.set("Authorization", `Bearer ${authToken}`)
    }
  }

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
}
