'use client'

import { useRouter } from 'next/navigation'
import { INDUSTRIES } from '../../src/data/templates'

const INDUSTRY_VISUAL = {
  'construction': {
    icon: '🏗️',
    bg: 'linear-gradient(150deg, #fff7ed 0%, #fed7aa 100%)',
    ready: true,
  },
  'house-cleaning': {
    icon: '🧹',
    bg: 'linear-gradient(150deg, #eff6ff 0%, #bfdbfe 100%)',
    ready: false,
  },
  'painting': {
    icon: '🎨',
    bg: 'linear-gradient(150deg, #f5f3ff 0%, #ddd6fe 100%)',
    ready: false,
  },
  'pest-control': {
    icon: '🌿',
    bg: 'linear-gradient(150deg, #f0fdf4 0%, #bbf7d0 100%)',
    ready: false,
  },
}

export default function TemplatesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#f4f4f6] px-5 py-12">
      <div className="max-w-[900px] mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-10">
          <div>
            <h1 className="text-[30px] font-extrabold tracking-[-0.02em] m-0 text-[#111]">
              What kind of business?
            </h1>
            <p className="text-sm text-[#999] mt-2 mb-0">
              Pick an industry and we&apos;ll load the right template.
            </p>
          </div>
          <button
            className="border border-black/[0.09] bg-white rounded-xl px-3 py-2 cursor-pointer text-sm shadow-sm hover:bg-[#f7f7f8] transition-colors shrink-0"
            onClick={() => router.push('/home')}
          >
            ← Back
          </button>
        </div>

        {/* Industry grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {INDUSTRIES.map((ind) => {
            const visual = INDUSTRY_VISUAL[ind.slug] ?? {
              icon: '📄',
              bg: 'linear-gradient(150deg, #f1f5f9 0%, #e2e8f0 100%)',
              ready: false,
            }
            const isReady = visual.ready

            return (
              <div
                key={ind.slug}
                className={`rounded-2xl flex flex-col overflow-hidden border transition-all ${
                  isReady
                    ? 'border-black/[0.07] shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(0,0,0,0.10)]'
                    : 'border-black/[0.05] opacity-55 cursor-default'
                }`}
                onClick={() => isReady && router.push(`/templates/${ind.slug}`)}
                role={isReady ? 'button' : undefined}
                tabIndex={isReady ? 0 : undefined}
                onKeyDown={(e) => isReady && e.key === 'Enter' && router.push(`/templates/${ind.slug}`)}
              >
                {/* Icon area */}
                <div
                  className="flex items-center justify-center h-[110px] text-[44px]"
                  style={{ background: visual.bg }}
                >
                  {visual.icon}
                </div>

                {/* Label area */}
                <div className="bg-white px-4 py-3.5 flex flex-col gap-2">
                  <div className="font-bold text-[14px] text-[#111] leading-snug">{ind.name}</div>
                  {isReady ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full">
                        Available
                      </span>
                    </div>
                  ) : (
                    <p className="text-[12px] text-[#bbb] m-0 leading-snug">Coming soon</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
