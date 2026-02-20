'use client'

import { useRouter, useParams } from 'next/navigation'
import { createDocFromTemplate } from '../../../src/data/docsStore'
import { getTemplatesByIndustry } from '../../../src/data/templates'

const INDUSTRY_LABELS = {
  'construction': 'Construction',
  'house-cleaning': 'House Cleaning',
  'painting': 'Painting',
  'pest-control': 'Pest Control',
}

export default function IndustryTemplatesPage() {
  const router = useRouter()
  const { industry } = useParams()

  const industryName = INDUSTRY_LABELS[industry] ?? industry
  const templates = getTemplatesByIndustry(industry)

  return (
    <div className="min-h-screen bg-[#f7f7f8] px-5 py-12">
      <div className="max-w-[1100px] mx-auto">

        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[26px] font-extrabold tracking-[-0.02em] m-0">
              {industryName} templates
            </h1>
            <p className="text-sm text-[#555] mt-2 mb-0">
              {templates.length ? 'Pick a starting point.' : 'Coming soon.'}
            </p>
          </div>

          <button
            className="border border-black/10 bg-white rounded-xl px-3 py-2.5 cursor-pointer text-sm"
            onClick={() => router.push('/templates')}
          >
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-[22px]">
          {templates.map((t) => (
            <div
              key={t.id}
              className="bg-white border border-black/10 rounded-2xl p-4 min-h-[150px] flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(0,0,0,0.10)] cursor-pointer"
              onClick={() => {
                const doc = createDocFromTemplate({ industry, templateId: t.id, language: 'en' })
                router.push(`/editor/${doc.id}`)
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const doc = createDocFromTemplate({ industry, templateId: t.id, language: 'en' })
                  router.push(`/editor/${doc.id}`)
                }
              }}
            >
              <div className="h-[86px] rounded-xl bg-gradient-to-b from-[#f1f2f4] to-[#e9eaee]" />
              <div>
                <div className="font-extrabold text-[#111] mt-3">{t.name.en}</div>
                <p className="text-[#555] text-[13px] leading-[1.35] mt-2 mb-0">{t.description.en}</p>
              </div>
            </div>
          ))}
        </div>

        {!templates.length && (
          <div className="mt-[18px] text-[#666]">No templates here yet.</div>
        )}

      </div>
    </div>
  )
}
