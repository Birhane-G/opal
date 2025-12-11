export async function updateSession(request: Request) {
  let response = new Response()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const res = await fetch(`${supabaseUrl}/auth/v1/verify`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${request.headers.get("Authorization") || ""}`,
      APIKey: supabaseAnonKey || "",
    },
  })

  if (res.ok) {
    const oidcResponse = await res.json()

    response = new Response(response.body, response)
    response.headers.set("Set-Cookie", oidcResponse.session)
  }

  return response
}
