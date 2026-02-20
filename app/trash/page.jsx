'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { listDeletedDocs, restoreDoc, deleteDoc } from '../../src/data/docsStore'

export default function TrashPage() {
  const router = useRouter()
  const [trashed, setTrashed] = useState([])

  useEffect(() => {
    setTrashed(listDeletedDocs())
  }, [])

  const handleRestore = (docId) => {
    restoreDoc(docId)
    setTrashed(listDeletedDocs())
  }

  const handleDeleteForever = (docId) => {
    deleteDoc(docId)
    setTrashed(listDeletedDocs())
  }

  const handleEmptyTrash = () => {
    if (!confirm('Permanently delete all items in trash? This cannot be undone.')) return
    trashed.forEach((d) => deleteDoc(d.id))
    setTrashed([])
  }

  return (
    <div className="min-h-screen bg-[#f4f4f6] px-5 py-12">
      <div className="max-w-[1100px] mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[28px] font-extrabold tracking-[-0.02em] m-0 text-[#111]">
              Recently Deleted
            </h1>
            <p className="text-sm text-[#999] mt-1.5 mb-0">
              Items here are removed from your docs list.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {trashed.length > 0 && (
              <button
                className="text-xs text-[#c0392b] border border-[#c0392b]/20 bg-white rounded-xl px-3 py-2 cursor-pointer hover:bg-red-50 transition-colors shadow-sm"
                onClick={handleEmptyTrash}
              >
                Empty Trash
              </button>
            )}
            <button
              className="border border-black/[0.09] bg-white rounded-xl px-3 py-2 cursor-pointer text-sm shadow-sm hover:bg-[#f7f7f8] transition-colors"
              onClick={() => router.push('/home')}
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Empty state */}
        {trashed.length === 0 && (
          <div className="mt-20 flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white border border-black/[0.07] shadow-sm flex items-center justify-center text-2xl text-[#ccc]">
              🗑
            </div>
            <p className="text-[#bbb] text-sm m-0">Trash is empty</p>
          </div>
        )}

        {/* Trash grid */}
        {trashed.length > 0 && (
          <>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#aaa] mt-8 mb-4">
              {trashed.length} item{trashed.length !== 1 ? 's' : ''}
            </p>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {trashed.map((d) => (
                <div
                  key={d.id}
                  className="bg-white/60 border border-black/[0.07] rounded-2xl p-3 flex flex-col gap-3 shadow-sm"
                >
                  {/* Muted thumbnail */}
                  <div
                    className="h-[100px] rounded-xl opacity-30"
                    style={{ background: 'linear-gradient(150deg, #e5e7eb 0%, #d1d5db 100%)' }}
                  />

                  {/* Info */}
                  <div>
                    <p className="text-[13px] font-semibold text-[#666] mb-0 truncate">
                      {d.title || 'Untitled'}
                    </p>
                    <p className="text-[11px] text-[#bbb] mt-1 mb-0">
                      Deleted {new Date(d.deletedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1.5">
                    <button
                      className="w-full text-xs border border-black/[0.09] bg-white rounded-[10px] px-2.5 py-2 cursor-pointer hover:bg-[#f7f7f8] transition-colors text-[#111] font-medium shadow-sm"
                      onClick={() => handleRestore(d.id)}
                    >
                      Restore
                    </button>
                    <button
                      className="w-full text-xs border border-[#c0392b]/15 bg-white rounded-[10px] px-2.5 py-2 cursor-pointer hover:bg-red-50 transition-colors text-[#c0392b]"
                      onClick={() => handleDeleteForever(d.id)}
                    >
                      Delete Forever
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  )
}
