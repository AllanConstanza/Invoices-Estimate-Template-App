'use client'

import { useRouter } from 'next/navigation'
import { INDUSTRIES } from '../../src/data/templates'
import AuthGuard from '../../src/components/AuthGuard'

const INDUSTRY_ICON = {
  'construction': '🏗️',
  'house-cleaning': '🧹',
  'painting': '🎨',
  'pest-control': '🌿',
}

export default function TemplatesPage() {
  const router = useRouter()

  return (
    <AuthGuard>
    <div className="flex-1 px-6 py-8">
      <div className="max-w-[1100px] mx-auto">

        {/* Back link */}
        <button
          className="flex items-center gap-1.5 text-sm text-[#444] hover:text-[#888] transition-colors cursor-pointer bg-transparent border-0 p-0 mb-6"
          onClick={() => router.push('/home')}
        >
          ← Back to documents
        </button>

        {/* Header */}
        <h1 className="text-[32px] font-extrabold tracking-[-0.02em] m-0 text-white">
          Select Industry
        </h1>
        <p className="text-[#555] text-sm mt-1 mb-8">
          Choose your industry to see relevant templates
        </p>

        {/* Industry grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {INDUSTRIES.map((ind) => (
            <div
              key={ind.slug}
              className="bg-[#1a1b21] border border-white/[0.07] rounded-xl p-6 flex flex-col gap-4 cursor-pointer transition-all hover:border-white/[0.16] hover:bg-[#1f2029] hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
              onClick={() => router.push(`/templates/${ind.slug}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && router.push(`/templates/${ind.slug}`)}
            >
              <span className="text-[36px] leading-none">
                {INDUSTRY_ICON[ind.slug] ?? '📄'}
              </span>
              <span className="font-bold text-[16px] text-white">{ind.name}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
    </AuthGuard>
  )
}
