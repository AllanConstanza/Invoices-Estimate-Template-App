'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { listDocs, softDeleteDoc } from '../../src/data/docsStore'

function CardThumbnail({ docType }) {
  const isInvoice = docType === 'invoice'
  const bg = isInvoice
    ? 'linear-gradient(150deg, #f0fdf4 0%, #dcfce7 100%)'
    : 'linear-gradient(150deg, #eff6ff 0%, #dbeafe 100%)'
  const lineColor = isInvoice ? 'rgba(16,120,60,0.12)' : 'rgba(37,99,235,0.12)'

  return (
    <div className="absolute inset-0 rounded-xl overflow-hidden" style={{ background: bg }}>
      {/* Mini document preview lines */}
      <div className="absolute left-4 right-4 top-4 flex flex-col gap-[6px] pointer-events-none">
        <div className="h-[7px] rounded-full w-[55%]" style={{ background: lineColor, opacity: 1.6 }} />
        <div className="h-px rounded-full mt-2" style={{ background: lineColor }} />
        <div className="h-px rounded-full w-[80%]" style={{ background: lineColor }} />
        <div className="h-px rounded-full w-[65%]" style={{ background: lineColor }} />
        <div className="h-px rounded-full mt-1.5" style={{ background: lineColor }} />
        <div className="h-px rounded-full w-[75%]" style={{ background: lineColor }} />
      </div>
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [docs, setDocs] = useState([])
  const [menuOpenId, setMenuOpenId] = useState(null)

  useEffect(() => {
    setDocs(listDocs())
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return docs
    return docs.filter((d) => (d.title || '').toLowerCase().includes(q))
  }, [query, docs])

  const onCreate = () => router.push('/templates')

  return (
    <div
      className="min-h-screen bg-[#f4f4f6] px-5 py-12"
      onClick={() => setMenuOpenId(null)}
    >
      <div className="max-w-[1100px] mx-auto">

        <div className="text-center">
          <h1 className="text-[34px] font-extrabold leading-tight tracking-[-0.02em] m-0 text-[#111]">
            My Documents
          </h1>
          <p className="text-[#888] text-sm mt-2 mb-0">Invoices &amp; estimates, ready to edit and print.</p>
        </div>

        <div className="flex justify-center mt-7">
          <button
            className="w-[80px] h-[80px] rounded-[18px] bg-[#111] text-white text-[42px] shadow-[0_12px_28px_rgba(0,0,0,0.20)] transition-all hover:-translate-y-px hover:scale-[1.03] hover:shadow-[0_18px_40px_rgba(0,0,0,0.26)] active:translate-y-0 active:scale-[0.99] active:opacity-95 cursor-pointer border-0 leading-none"
            onClick={onCreate}
            aria-label="Create new"
          >
            +
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 mt-5">
          <input
            className="w-full max-w-[520px] px-4 py-3 rounded-[14px] border border-black/[0.09] text-sm bg-white outline-none shadow-sm placeholder:text-[#aaa]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title…"
          />
          <button
            className="text-xs text-[#aaa] hover:text-[#555] transition-colors cursor-pointer bg-transparent border-0 p-0"
            onClick={() => router.push('/trash')}
          >
            Recently Deleted
          </button>
        </div>

        <div className="mt-10">
          {docs.length > 0 && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#aaa] mb-4">
              {filtered.length} doc{filtered.length !== 1 ? 's' : ''}
            </p>
          )}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((d) => (
              <div
                key={d.id}
                className="bg-white border border-black/[0.07] rounded-2xl p-3 h-[190px] flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.09)] cursor-pointer shadow-sm"
                onClick={() => router.push(`/editor/${d.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') router.push(`/editor/${d.id}`)
                }}
              >
                {/* Thumbnail */}
                <div className="relative h-[116px] rounded-xl">
                  <CardThumbnail docType={d.docType} />
                  <button
                    className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-white/90 border border-black/[0.09] flex items-center justify-center text-[#555] text-base leading-none cursor-pointer hover:bg-white hover:shadow-sm transition-all z-10"
                    onClick={(e) => {
                      e.stopPropagation()
                      setMenuOpenId(menuOpenId === d.id ? null : d.id)
                    }}
                    aria-label="More options"
                  >
                    ⋯
                  </button>
                  {menuOpenId === d.id && (
                    <div
                      className="absolute top-10 right-2 z-20 bg-white border border-black/[0.09] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.13)] py-1 min-w-[148px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="w-full text-left px-3.5 py-2.5 text-[13px] text-[#c0392b] hover:bg-[#fff5f5] cursor-pointer border-0 bg-transparent transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          softDeleteDoc(d.id)
                          setDocs(listDocs())
                          setMenuOpenId(null)
                        }}
                      >
                        Move to Trash
                      </button>
                    </div>
                  )}
                </div>

                {/* Card footer */}
                <div className="pt-2.5">
                  <p className="text-[13px] font-semibold text-[#111] mb-0 truncate leading-snug">
                    {d.title || 'Untitled'}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
                      d.docType === 'invoice'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-blue-50 text-blue-700 border-blue-100'
                    }`}>
                      {d.docType === 'invoice' ? 'Invoice' : 'Estimate'}
                    </span>
                    <span className="text-[11px] text-[#bbb]">
                      {new Date(d.lastEditedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && docs.length > 0 && (
              <div className="col-span-full text-[#aaa] text-sm mt-4">
                No docs match &ldquo;{query}&rdquo;
              </div>
            )}

            {docs.length === 0 && (
              <div className="col-span-full text-center py-16 text-[#bbb] text-sm">
                No documents yet. Hit <strong className="text-[#888]">+</strong> to create one.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
