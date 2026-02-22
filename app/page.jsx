'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../src/context/AuthContext'

export default function LandingPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  // Already signed in → skip landing, go straight to app
  useEffect(() => {
    if (!loading && user) router.replace('/home')
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-[#3b63f5] border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden px-6">

      {/* Blue glow blob */}
      <div
        className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(59,99,245,0.14) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-[560px]">

        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 border border-white/[0.08] bg-white/[0.04] rounded-full px-4 py-1.5 text-xs text-[#666] tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3b63f5] shrink-0" />
          Free · No account required
        </div>

        {/* Headline */}
        <h1 className="text-[76px] font-black tracking-[-0.045em] leading-[0.95] mb-6 m-0 text-white">
          Just<span className="text-[#3b63f5]">Write</span>
        </h1>

        <p className="text-[17px] text-[#6b7280] leading-[1.7] mb-10 m-0 max-w-[400px]">
          Professional estimates & invoices for contractors and service businesses.
          No spreadsheets. No complexity.
        </p>

        {/* CTA buttons */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <button
            onClick={() => router.push('/login')}
            className="bg-[#3b63f5] text-white font-semibold px-7 py-3.5 rounded-xl cursor-pointer border-0 hover:bg-[#2f53e0] transition-all text-[15px] shadow-[0_0_48px_rgba(59,99,245,0.4)]"
          >
            Get started free →
          </button>
          <button
            onClick={() => router.push('/login')}
            className="text-[#6b7280] font-medium px-7 py-3.5 rounded-xl cursor-pointer border border-white/[0.08] hover:border-white/[0.18] hover:text-[#c0c4cc] transition-all text-[15px] bg-transparent"
          >
            Log in
          </button>
        </div>

      </div>

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#111318] to-transparent pointer-events-none" />

    </div>
  )
}
