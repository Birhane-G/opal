import { createClient as createServerClient } from "@/lib/supabase/server"

export async function getCurrentUser() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getCurrentUserRole() {
  const supabase = await createServerClient()
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", (await supabase.auth.getUser()).data?.user?.id)
    .single()

  return userData?.role || null
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export async function requireRole(...roles: string[]) {
  const userRole = await getCurrentUserRole()
  if (!userRole || !roles.includes(userRole)) {
    throw new Error("Forbidden")
  }
  return userRole
}
