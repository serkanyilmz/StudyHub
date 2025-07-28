"use client"

import { useState } from "react"
import { AuthForm } from "@/shared/components/auth/auth-form"
import { DashboardLayout } from "@/shared/components/layout/dashboard-layout"
import type { User } from "@/shared/types/user"

export default function Home() {
  const [user, setUser] = useState<User | null>(null)

  if (!user) {
    return <AuthForm onLogin={setUser} />
  }

  return <DashboardLayout user={user} onLogout={() => setUser(null)} />
}
