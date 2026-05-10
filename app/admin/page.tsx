"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import "@/admin/src/index.css"
import { supabase } from "@/src/lib/supabase/client"
import { signOutInvalidUser, verifyAdminAccess } from "@/src/lib/supabase/admin-auth"

const AdminApp = dynamic(() => import("@/admin/src/App"), { ssr: false })

export default function AdminPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let active = true
    const check = async () => {
      if (!active) return
      const result = await verifyAdminAccess()
      if (!active) return
      if (!result.ok) {
        await signOutInvalidUser()
        router.replace("/admin/login")
        return
      }
      setChecking(false)
    }
    check()

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/admin/login")
      }
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [router])

  if (checking) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center text-gray-400">
        Verifying admin session...
      </div>
    )
  }

  return (
    <AdminApp
      onLogout={async () => {
        await supabase.auth.signOut()
        router.replace("/admin/login")
      }}
    />
  )
}
