'use client'

import { useRouter, useParams } from 'next/navigation'
import { createDocFromTemplate } from '../../../src/data/docsStore'
import { getTemplatesByIndustry } from '../../../src/data/templates'
import AuthGuard from '../../../src/components/AuthGuard'

// Each industry has its own color palette so cards look distinct
const INDUSTRY_THEME = {
  'construction': {
    name: 'Construction',
    estimateBg: 'linear-gradient(150deg, #fff7ed 0%, #fed7aa 100%)',
    invoiceBg: 'linear-gradient(150deg, #ffedd5 0%, #fb923c 100%)',
    rgb: '154, 52, 18',
  },
  'house-cleaning': {
    name: 'House Cleaning',
    estimateBg: 'linear-gradient(150deg, #eff6ff 0%, #bfdbfe 100%)',
    invoiceBg: 'linear-gradient(150deg, #dbeafe 0%, #93c5fd 100%)',
    rgb: '29, 78, 216',
  },
  'painting': {
    name: 'Painting',
    estimateBg: 'linear-gradient(150deg, #f5f3ff 0%, #ddd6fe 100%)',
    invoiceBg: 'linear-gradient(150deg, #ede9fe 0%, #c4b5fd 100%)',
    rgb: '109, 40, 217',
  },
  'pest-control': {
    name: 'Pest Control',
    estimateBg: 'linear-gradient(150deg, #f0fdf4 0%, #bbf7d0 100%)',
    invoiceBg: 'linear-gradient(150deg, #dcfce7 0%, #6ee7b7 100%)',
    rgb: '21, 128, 61',
  },
}

// Estimate: flowing description/proposal style
function EstimateThumbnail({ bg, rgb }) {
  const line = `rgba(${rgb}, 0.2)`
  const heavy = `rgba(${rgb}, 0.38)`
  const soft = `rgba(${rgb}, 0.09)`
  return (
    <div className="relative h-[88px] rounded-xl overflow-hidden" style={{ background: bg }}>
      <div className="absolute top-4 left-4 right-4 bottom-3 flex flex-col gap-[5px] pointer-events-none">
        <div className="h-[7px] rounded-full w-[48%]" style={{ background: heavy }} />
        <div className="h-px rounded-full mt-[7px]" style={{ background: line }} />
        <div className="h-px rounded-full w-[88%]" style={{ background: line }} />
        <div className="h-px rounded-full w-[72%]" style={{ background: line }} />
        <div className="h-px rounded-full w-[80%]" style={{ background: line }} />
        <div className="flex justify-end mt-auto">
          <div className="h-[5px] w-[32%] rounded-full" style={{ background: soft }} />
        </div>
      </div>
    </div>
  )
}

// Invoice: structured table style with a bold total bar
function InvoiceThumbnail({ bg, rgb }) {
  const heavy = `rgba(${rgb}, 0.42)`
  const row = `rgba(${rgb}, 0.1)`
  const line = `rgba(${rgb}, 0.22)`
  const totalBar = `rgba(${rgb}, 0.18)`
  return (
    <div className="relative h-[88px] rounded-xl overflow-hidden" style={{ background: bg }}>
      <div className="absolute top-4 left-4 right-4 bottom-3 flex flex-col gap-[4px] pointer-events-none">
        <div className="h-[7px] rounded-full w-[40%]" style={{ background: heavy }} />
        {[1, 0.82, 0.91].map((w, i) => (
          <div
            key={i}
            className="h-[9px] rounded-[4px] flex items-center px-1.5 mt-[2px]"
            style={{ background: row }}
          >
            <div className="h-px rounded-full" style={{ background: line, width: `${w * 100}%` }} />
          </div>
        ))}
        <div
          className="h-[9px] rounded-[4px] flex items-center justify-end px-2 mt-[2px]"
          style={{ background: totalBar }}
        >
          <div className="h-[4px] w-[26%] rounded-full" style={{ background: heavy }} />
        </div>
      </div>
    </div>
  )
}

export default function IndustryTemplatesPage() {
  const router = useRouter()
  const { industry } = useParams()

  const theme = INDUSTRY_THEME[industry] ?? {
    name: industry,
    estimateBg: 'linear-gradient(150deg, #f1f5f9 0%, #e2e8f0 100%)',
    invoiceBg: 'linear-gradient(150deg, #e2e8f0 0%, #cbd5e1 100%)',
    rgb: '100, 116, 139',
  }

  const templates = getTemplatesByIndustry(industry)

  const handleSelect = (templateId) => {
    const doc = createDocFromTemplate({ industry, templateId, language: 'en' })
    router.push(`/editor/${doc.id}`)
  }

  return (
    <AuthGuard>
    <div className="flex-1 px-6 py-8">
      <div className="max-w-[1100px] mx-auto">

        <div className="flex items-start justify-between gap-3 mb-8">
          <div>
            <h1 className="text-[26px] font-extrabold tracking-[-0.02em] m-0 text-white">
              {theme.name}
            </h1>
            <p className="text-sm text-[#555] mt-2 mb-0">
              {templates.length ? 'Pick a starting point.' : 'No templates yet.'}
            </p>
          </div>
          <button
            className="flex items-center gap-1.5 text-sm text-[#444] hover:text-[#888] transition-colors cursor-pointer bg-transparent border-0 p-0"
            onClick={() => router.push('/templates')}
          >
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((t) => {
            const isInvoice = t.docType === 'invoice'
            return (
              <div
                key={t.id}
                className="bg-[#1a1b21] border border-white/[0.07] rounded-2xl p-4 flex flex-col gap-3 transition-all hover:-translate-y-0.5 hover:border-white/[0.14] hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)] cursor-pointer"
                onClick={() => handleSelect(t.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSelect(t.id)}
              >
                {isInvoice ? (
                  <InvoiceThumbnail bg={theme.invoiceBg} rgb={theme.rgb} />
                ) : (
                  <EstimateThumbnail bg={theme.estimateBg} rgb={theme.rgb} />
                )}

                <div className="flex flex-col gap-1.5">
                  <span className={`self-start text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
                    isInvoice
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-700/30'
                      : 'bg-blue-950/60 text-blue-400 border-blue-700/30'
                  }`}>
                    {isInvoice ? 'Invoice' : 'Estimate'}
                  </span>
                  <div className="font-bold text-[14px] text-[#e0e0e0] leading-snug">{t.name.en}</div>
                  <p className="text-[12px] text-[#555] leading-[1.4] m-0">{t.description.en}</p>
                  {/* Line item preview chips */}
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {(t.defaults.lineItems || []).slice(0, 3).map((li, i) => (
                      <span
                        key={i}
                        className="text-[10px] text-[#444] border border-white/[0.06] rounded-full px-2 py-0.5"
                      >
                        {li.name.en}
                      </span>
                    ))}
                    {(t.defaults.lineItems || []).length > 3 && (
                      <span className="text-[10px] text-[#333] px-1 py-0.5">
                        +{t.defaults.lineItems.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {!templates.length && (
          <div className="mt-12 text-center text-[#333] text-sm">No templates here yet.</div>
        )}

      </div>
    </div>
    </AuthGuard>
  )
}
