"use client"

import { FormEvent, useEffect, useState } from "react"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import "@/admin/src/index.css"
import { supabase } from "@/src/lib/supabase/client"
import { FloatingTechIcons } from "@/admin/src/components/FloatingTechIcons"
import { signOutInvalidUser, verifyAdminAccess } from "@/src/lib/supabase/admin-auth"

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

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  useEffect(() => {
    const check = async () => {
      const result = await verifyAdminAccess()
      if (result.ok) {
        router.replace("/admin")
        return
      }
      const { data } = await supabase.auth.getSession()
      if (data.session && !result.ok) {
        await signOutInvalidUser()
      }
    }
    check()
  }, [router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const nextEmailError =
      !email.trim() ? "Email is required." : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Enter a valid email address." : null
    const nextPasswordError =
      !password ? "Password is required." : password.length < 6 ? "Password must be at least 6 characters." : null

    setEmailError(nextEmailError)
    setPasswordError(nextPasswordError)
    if (nextEmailError || nextPasswordError) return

    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError("Invalid login credentials")
        return
      }

      const access = await verifyAdminAccess()
      if (!access.ok) {
        await signOutInvalidUser()
        setError("Access denied. Admin account required.")
        return
      }

      setLoading(false)
      router.replace("/admin")
      return
    } catch (err) {
      console.error("Login flow failed:", err)
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
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
          <div className="mb-12 relative z-10">
            <h3 className="text-4xl font-display font-bold text-white mb-3 tracking-tighter">Admin Login Page</h3>
            <p className="text-brand-gold/90 font-semibold text-sm leading-relaxed">
              Future is Data
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7 relative z-10">
            {error ? (
              <div className="p-4 rounded-2xl bg-brand-orange/10 border border-brand-orange/30 text-brand-orange text-xs font-bold">
                {error}
              </div>
            ) : null}

            <div className="space-y-4">
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-brand-blue transition-colors duration-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    const v = e.target.value
                    setEmail(v)
                    setEmailError(
                      !v.trim() ? "Email is required." : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email address." : null
                    )
                  }}
                  className="w-full bg-surface-bg/50 border-[1.5px] border-white/5 focus:border-brand-blue/40 rounded-[1.75rem] py-5.5 pl-16 pr-6 text-white font-bold placeholder:text-gray-700/30 focus:outline-none transition-all"
                  placeholder="admin1@gmail.com"
                  required
                />
              </div>
              {emailError ? <p className="text-[11px] text-brand-orange font-bold ml-2">{emailError}</p> : null}

              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-brand-blue transition-colors duration-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    const v = e.target.value
                    setPassword(v)
                    setPasswordError(!v ? "Password is required." : v.length < 6 ? "Password must be at least 6 characters." : null)
                  }}
                  className="w-full bg-surface-bg/50 border-[1.5px] border-white/5 focus:border-brand-blue/40 rounded-[1.75rem] py-5.5 pl-16 pr-16 text-white font-bold placeholder:text-gray-700/30 focus:outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError ? <p className="text-[11px] text-brand-orange font-bold ml-2">{passwordError}</p> : null}
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-indigo text-white font-black py-6 rounded-[2rem] transition-all shadow-[0_20px_40px_-12px_rgba(80,80,133,0.5)] uppercase tracking-[0.3em] text-xs disabled:opacity-60"
              >
                {loading ? "AUTHENTICATING..." : "INITIALIZE LINK"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/admin/recovery")}
                className="text-center text-[10px] font-black text-gray-600 hover:text-brand-blue uppercase tracking-widest transition-colors py-2"
              >
                Forgot password?
              </button>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="text-center text-[10px] font-black text-gray-600 hover:text-white uppercase tracking-widest transition-colors py-1"
              >
                Back to Portfolio
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
