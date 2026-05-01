"use client"

import { useEffect } from "react"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    const timer = setTimeout(onComplete, 4000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 bg-[#2d2d30] font-['Segoe_UI_Light','Segoe_UI',system-ui,sans-serif]">
      <div className="absolute left-[136px] top-[132px] text-left">
        <p className="text-[40px] leading-[1.08] font-[300] tracking-[-0.01em] text-[#f1f1f1]">Presents</p>
        <h1 className="mt-3 text-[85px] leading-[1.08] font-[300] tracking-[-0.01em] text-[#f1f1f1]">
          Apon Kumar Das Portfolio
        </h1>
      </div>

      <div className="absolute left-[136px] top-[80%] text-left">
        <p className="text-[16px] leading-[1.2] font-[300] text-[#c5c4c6]">v1.3</p>
        <p className="mt-4 text-[16px] leading-[1.2] font-[300] text-[#5d6365]">© {currentYear} AP.</p>
        <p className="text-[16px] leading-[1.2] font-[300] text-[#5d6365]">All rights reserved.</p>
      </div>
    </div>
  )
}
