'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { listDocs, softDeleteDoc, initStore } from '../../src/data/docsStore'
import { useAuth } from '../../src/context/AuthContext'
import AuthGuard from '../../src/components/AuthGuard'

function DocIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
        stroke="#2a2a30"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline points="14 2 14 8 20 8" stroke="#2a2a30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="16" y1="13" x2="8" y2="13" stroke="#2a2a30" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="17" x2="8" y2="17" stroke="#2a2a30" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="9" x2="8" y2="9" stroke="#2a2a30" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CardThumbnail({ docType }) {
  const isInvoice = docType === 'invoice'
  const bg = isInvoice
    ? 'linear-gradient(150deg, #f0fdf4 0%, #dcfce7 100%)'
    : 'linear-gradient(150deg, #eff6ff 0%, #dbeafe 100%)'
  const lineColor = isInvoice ? 'rgba(16,120,60,0.15)' : 'rgba(37,99,235,0.15)'

  return (
    <div className="absolute inset-0 rounded-xl overflow-hidden" style={{ background: bg }}>
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
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [docs, setDocs] = useState([])
  const [menuOpenId, setMenuOpenId] = useState(null)

  // Load docs from Firestore when user is available
  useEffect(() => {
    if (!user) return
    initStore(user.uid).then(() => setDocs(listDocs()))
  }, [user])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return docs
    return docs.filter((d) => (d.title || '').toLowerCase().includes(q))
  }, [query, docs])

  const onCreate = () => router.push('/templates')

  return (
    <AuthGuard>
    <div
      className="flex-1 px-6 py-8"
      onClick={() => setMenuOpenId(null)}
    >
      <div className="max-w-[1100px] mx-auto">

        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[32px] font-extrabold tracking-[-0.02em] m-0 text-white">
              Documents
            </h1>
            <p className="text-[#555] text-sm mt-1 mb-0">
              Create professional estimates and invoices
            </p>
          </div>
          <button
            className="flex items-center gap-2 bg-[#3b63f5] text-white text-sm font-semibold px-4 py-2.5 rounded-lg cursor-pointer border-0 hover:bg-[#2f53e0] transition-colors shrink-0 shadow-sm"
            onClick={onCreate}
          >
            <span className="text-[18px] leading-none font-light">+</span>
            New Document
          </button>
        </div>

        {/* Search + recently deleted */}
        {docs.length > 0 && (
          <div className="flex items-center justify-between gap-3 mb-6">
            <input
              className="w-full max-w-[360px] px-4 py-2.5 rounded-lg border border-white/[0.08] text-sm bg-[#1a1b21] text-white outline-none placeholder:text-[#444] focus:border-[#3b63f5]/50 transition-colors"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documents…"
            />
            <button
              className="text-xs text-[#444] hover:text-[#888] transition-colors cursor-pointer bg-transparent border-0 p-0 shrink-0"
              onClick={() => router.push('/trash')}
            >
              Recently Deleted
            </button>
          </div>
        )}

        {/* Document grid */}
        {docs.length > 0 && (
          <>
            {filtered.length > 0 ? (
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filtered.map((d) => (
                  <div
                    key={d.id}
                    className="bg-[#1a1b21] border border-white/[0.07] rounded-2xl p-3 h-[190px] flex flex-col justify-between transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] cursor-pointer"
                    onClick={() => router.push(`/editor/${d.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/editor/${d.id}`) }}
                  >
                    <div className="relative h-[116px] rounded-xl">
                      <CardThumbnail docType={d.docType} />
                      <button
                        className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-black/50 border border-white/[0.1] flex items-center justify-center text-[#888] text-base leading-none cursor-pointer hover:bg-black/70 hover:text-white transition-all z-10"
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
                          className="absolute top-10 right-2 z-20 bg-[#20212c] border border-white/[0.08] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.7)] py-1 min-w-[148px]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="w-full text-left px-3.5 py-2.5 text-[13px] text-red-400 hover:bg-red-500/10 cursor-pointer border-0 bg-transparent transition-colors"
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

                    <div className="pt-2.5">
                      <p className="text-[13px] font-semibold text-[#e0e0e0] mb-0 truncate leading-snug">
                        {d.title || 'Untitled'}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${
                          d.docType === 'invoice'
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-700/30'
                            : 'bg-blue-950/60 text-blue-400 border-blue-700/30'
                        }`}>
                          {d.docType === 'invoice' ? 'Invoice' : 'Estimate'}
                        </span>
                        <span className="text-[11px] text-[#333]">
                          {new Date(d.lastEditedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#444] text-sm mt-4">
                No documents match &ldquo;{query}&rdquo;
              </p>
            )}
          </>
        )}

        {/* Empty state */}
        {docs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <DocIcon />
            <div className="text-center">
              <p className="text-[18px] font-bold text-white m-0">No documents yet</p>
              <p className="text-[#444] text-sm mt-1 mb-0">
                Get started by creating your first estimate or invoice
              </p>
            </div>
            <button
              className="flex items-center gap-2 bg-[#3b63f5] text-white text-sm font-semibold px-6 py-3 rounded-full cursor-pointer border-0 hover:bg-[#2f53e0] transition-colors mt-2"
              onClick={onCreate}
            >
              <span className="text-[18px] leading-none font-light">+</span>
              Create Document
            </button>
          </div>
        )}

      </div>
    </div>
    </AuthGuard>
  )
}
