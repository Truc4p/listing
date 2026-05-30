import { cookies } from "next/headers";

export async function isAdminAuthed(): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const cookieStore = await cookies();
  return cookieStore.get("admin_token")?.value === adminPassword;
}
