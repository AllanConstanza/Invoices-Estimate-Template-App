'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { listDeletedDocs, restoreDoc, deleteDoc } from '../../src/data/docsStore'
import AuthGuard from '../../src/components/AuthGuard'

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
    <AuthGuard>
    <div className="flex-1 px-6 py-8">
      <div className="max-w-[1100px] mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[28px] font-extrabold tracking-[-0.02em] m-0 text-white">
              Recently Deleted
            </h1>
            <p className="text-sm text-[#555] mt-1.5 mb-0">
              Items here are removed from your docs list.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {trashed.length > 0 && (
              <button
                className="text-xs text-red-400 border border-red-500/20 bg-transparent rounded-xl px-3 py-2 cursor-pointer hover:bg-red-500/10 transition-colors"
                onClick={handleEmptyTrash}
              >
                Empty Trash
              </button>
            )}
            <button
              className="border border-white/[0.08] bg-[#1a1b21] rounded-xl px-3 py-2 cursor-pointer text-sm text-[#888] hover:bg-[#1e1e22] hover:text-white transition-colors"
              onClick={() => router.push('/home')}
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Empty state */}
        {trashed.length === 0 && (
          <div className="mt-20 flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#1a1b21] border border-white/[0.06] flex items-center justify-center text-2xl text-[#333]">
              🗑
            </div>
            <p className="text-[#333] text-sm m-0">Trash is empty</p>
          </div>
        )}

        {/* Trash grid */}
        {trashed.length > 0 && (
          <>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#333] mt-8 mb-4">
              {trashed.length} item{trashed.length !== 1 ? 's' : ''}
            </p>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {trashed.map((d) => (
                <div
                  key={d.id}
                  className="bg-[#1a1b21]/80 border border-white/[0.06] rounded-2xl p-3 flex flex-col gap-3"
                >
                  {/* Muted thumbnail */}
                  <div
                    className="h-[100px] rounded-xl opacity-20"
                    style={{ background: 'linear-gradient(150deg, #1e1e24 0%, #252528 100%)' }}
                  />

                  {/* Info */}
                  <div>
                    <p className="text-[13px] font-semibold text-[#666] mb-0 truncate">
                      {d.title || 'Untitled'}
                    </p>
                    <p className="text-[11px] text-[#333] mt-1 mb-0">
                      Deleted {new Date(d.deletedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1.5">
                    <button
                      className="w-full text-xs border border-white/[0.08] bg-[#1f2029] rounded-[10px] px-2.5 py-2 cursor-pointer hover:bg-[#252630] transition-colors text-[#ccc] font-medium"
                      onClick={() => handleRestore(d.id)}
                    >
                      Restore
                    </button>
                    <button
                      className="w-full text-xs border border-red-500/20 bg-transparent rounded-[10px] px-2.5 py-2 cursor-pointer hover:bg-red-500/10 transition-colors text-red-400"
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
    </AuthGuard>
  )
}
