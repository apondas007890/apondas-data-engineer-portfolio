"use client"

import { FormEvent, useEffect, useState } from "react"
import { Eye, EyeOff, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import "@/admin/src/index.css"
import { supabase } from "@/src/lib/supabase/client"
import { FloatingTechIcons } from "@/admin/src/components/FloatingTechIcons"

function SsmsServerMark() {
  return (
    <div className="infra-server-mark" aria-hidden="true">
      <span className="infra-server-layer">
        <i />
        <b />
      </span>
      <span className="infra-server-layer">
        <i />
        <b />
      </span>
      <span className="infra-server-layer">
        <i />
        <b />
      </span>
      <span className="infra-server-status">
        <span className="infra-server-check" />
      </span>
      <span className="infra-server-tag" aria-hidden="true">
        <svg viewBox="0 0 64 48" className="infra-server-tag-mark">
          <path
            d="M6 38 L20 10 L34 38 L30 45 L20 24 L10 45 Z
               M32 10 H46 C54 10 60 16 60 24 C60 32 54 38 46 38 H36
               M36 10 V46
               M36 24 H50"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  )
}

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) return
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setMessage("Password updated successfully.")
    setLoading(false)
    setTimeout(() => router.replace("/admin/login"), 1200)
  }

  return (
    <div className="min-h-screen bg-surface-bg overflow-hidden relative font-sans flex items-center justify-end p-6 md:p-12 lg:pr-32">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden tech-bg-layer">
        <FloatingTechIcons />
      </div>
      <div className="fixed top-7 left-7 z-30">
        <div className="logo-container infra-server-pulse group transition-all duration-500 relative shrink-0">
          <SsmsServerMark />
        </div>
      </div>
      <div className="w-full max-w-md z-20">
        <div className="bg-surface-card/85 backdrop-blur-3xl border border-white/10 p-10 sm:p-14 rounded-[3.5rem] shadow-[0_64px_128px_-16px_rgba(0,0,0,0.9)] relative overflow-hidden">
          <div className="mb-10 relative z-10">
            <h3 className="text-4xl font-display font-bold text-white mb-3 tracking-tighter">Update Password</h3>
            <p className="text-surface-text/60 font-semibold text-sm leading-relaxed">Set a new password for admin access.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {error ? <div className="p-4 rounded-2xl bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-bold">{error}</div> : null}
            {message ? <div className="p-4 rounded-2xl bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-xs font-bold">{message}</div> : null}

            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-brand-blue transition-colors duration-300" />
              <input type={showNew ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" className="w-full bg-surface-bg/50 border-[1.5px] border-white/5 focus:border-brand-blue/40 rounded-[1.75rem] py-5.5 pl-16 pr-16 text-white font-bold focus:outline-none transition-all" required />
              <button type="button" onClick={() => setShowNew((v) => !v)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors">
                {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative group">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-brand-blue transition-colors duration-300" />
              <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="w-full bg-surface-bg/50 border-[1.5px] border-white/5 focus:border-brand-blue/40 rounded-[1.75rem] py-5.5 pl-16 pr-16 text-white font-bold focus:outline-none transition-all" required />
              <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors">
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-brand-indigo text-white font-black py-6 rounded-[2rem] transition-all shadow-[0_20px_40px_-12px_rgba(80,80,133,0.5)] uppercase tracking-[0.3em] text-xs disabled:opacity-60">
              {loading ? "UPDATING..." : "UPDATE PASSWORD"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
