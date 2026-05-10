"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/src/lib/supabase/client"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const run = async () => {
      const code = new URLSearchParams(window.location.search).get("code")
      if (code) {
        await supabase.auth.exchangeCodeForSession(code)
      }
      router.replace("/admin/update-password")
    }
    run()
  }, [router])

  return (
    <div className="min-h-screen bg-[#0b0d12] text-gray-300 flex items-center justify-center">
      Finalizing secure session...
    </div>
  )
}
