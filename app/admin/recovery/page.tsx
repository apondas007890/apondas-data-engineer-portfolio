"use client"

import { FormEvent, useState } from "react"
import { CalendarDays, Mail, Phone, User } from "lucide-react"
import { useRouter } from "next/navigation"
import "@/admin/src/index.css"
import { supabase } from "@/src/lib/supabase/client"
import { FloatingTechIcons } from "@/admin/src/components/FloatingTechIcons"

const ADMIN_EMAIL = "apondas007890@gmail.com"
const ADMIN_UID = "09dca501-2a12-491a-9990-2e73b5013572"
const GENERIC_MSG = "If the recovery details are valid, a reset link has been sent to the admin email."

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

export default function AdminRecoveryPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [recoveryEmail, setRecoveryEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [dob, setDob] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [errors, setErrors] = useState<{
    fullName?: string
    recoveryEmail?: string
    phoneNumber?: string
    dob?: string
  }>({})

  const validateName = (v: string) =>
    !v.trim() ? "Tell us your full name for verification." : v.trim().length < 3 ? "Full name looks too short." : ""
  const validateEmail = (v: string) =>
    !v.trim() ? "Recovery email is required." : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid recovery email." : ""
  const validatePhone = (v: string) =>
    !v.trim() ? "Phone number is required." : v.trim().length < 8 ? "Phone number looks incomplete." : ""
  const validateDob = (v: string) => (!v ? "Date of birth is required." : "")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const nextErrors = {
      fullName: validateName(fullName),
      recoveryEmail: validateEmail(recoveryEmail),
      phoneNumber: validatePhone(phoneNumber),
      dob: validateDob(dob),
    }
    setErrors(nextErrors)
    if (nextErrors.fullName || nextErrors.recoveryEmail || nextErrors.phoneNumber || nextErrors.dob) return

    setLoading(true)
    setMessage(null)

    const { data, error } = await supabase
      .from("admin_profiles")
      .select("auth_user_id")
      .eq("full_name", fullName.trim())
      .eq("recovery_email", recoveryEmail.trim().toLowerCase())
      .eq("phone_number", phoneNumber.trim())
      .eq("dob", dob)
      .eq("auth_user_id", ADMIN_UID)
      .limit(1)

    if (!error && (data?.length ?? 0) > 0) {
      await supabase.auth.resetPasswordForEmail(ADMIN_EMAIL, {
        redirectTo: `${window.location.origin}/admin/update-password`,
      })
    }

    setMessage(GENERIC_MSG)
    setLoading(false)
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
            <h3 className="text-4xl font-display font-bold text-white mb-3 tracking-tighter">Identity Proof</h3>
            <p className="text-surface-text/60 font-semibold text-sm leading-relaxed">
              Verify recovery details to recover your admin password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {message ? (
              <div className="p-4 rounded-2xl bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-xs font-bold">
                {message}
              </div>
            ) : null}

            <div className="relative group">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-brand-blue transition-colors duration-300" />
              <input value={fullName} onChange={(e) => { const v = e.target.value; setFullName(v); setErrors((p) => ({ ...p, fullName: validateName(v) || undefined })); }} placeholder="Full name" className="w-full bg-surface-bg/50 border-[1.5px] border-white/5 focus:border-brand-blue/40 rounded-[1.75rem] py-5.5 pl-16 pr-6 text-white font-bold focus:outline-none transition-all" required />
            </div>
            {errors.fullName ? <p className="text-[11px] text-brand-orange font-bold ml-2">{errors.fullName}</p> : null}

            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-brand-blue transition-colors duration-300" />
              <input value={recoveryEmail} onChange={(e) => { const v = e.target.value; setRecoveryEmail(v); setErrors((p) => ({ ...p, recoveryEmail: validateEmail(v) || undefined })); }} type="email" placeholder="Recovery email" className="w-full bg-surface-bg/50 border-[1.5px] border-white/5 focus:border-brand-blue/40 rounded-[1.75rem] py-5.5 pl-16 pr-6 text-white font-bold focus:outline-none transition-all" required />
            </div>
            {errors.recoveryEmail ? <p className="text-[11px] text-brand-orange font-bold ml-2">{errors.recoveryEmail}</p> : null}

            <div className="relative group">
              <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-brand-blue transition-colors duration-300" />
              <input value={phoneNumber} onChange={(e) => { const v = e.target.value; setPhoneNumber(v); setErrors((p) => ({ ...p, phoneNumber: validatePhone(v) || undefined })); }} type="tel" placeholder="Phone number" className="w-full bg-surface-bg/50 border-[1.5px] border-white/5 focus:border-brand-blue/40 rounded-[1.75rem] py-5.5 pl-16 pr-6 text-white font-bold focus:outline-none transition-all" required />
            </div>
            {errors.phoneNumber ? <p className="text-[11px] text-brand-orange font-bold ml-2">{errors.phoneNumber}</p> : null}

            <div className="relative group">
              <CalendarDays className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-brand-blue transition-colors duration-300" />
              <input value={dob} onChange={(e) => { const v = e.target.value; setDob(v); setErrors((p) => ({ ...p, dob: validateDob(v) || undefined })); }} type="date" className="w-full bg-surface-bg/50 border-[1.5px] border-white/5 focus:border-brand-blue/40 rounded-[1.75rem] py-5.5 pl-16 pr-6 text-white font-bold focus:outline-none transition-all [color-scheme:dark]" required />
            </div>
            {errors.dob ? <p className="text-[11px] text-brand-orange font-bold ml-2">{errors.dob}</p> : null}

            <button type="submit" disabled={loading} className="w-full bg-brand-indigo text-white font-black py-6 rounded-[2rem] transition-all shadow-[0_20px_40px_-12px_rgba(80,80,133,0.5)] uppercase tracking-[0.3em] text-xs disabled:opacity-60">
              {loading ? "VERIFYING..." : "REQUEST RECOVERY"}
            </button>

            <button type="button" onClick={() => router.push("/admin/login")} className="w-full text-center text-[10px] font-black text-gray-600 hover:text-white uppercase tracking-widest transition-colors py-2">
              Back to login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
