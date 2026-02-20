'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getDoc, updateDoc } from '../../../src/data/docsStore'

export default function EditorPage() {
  const router = useRouter()
  const { docId } = useParams()
  const fileInputRef = useRef(null)

  const [doc, setDoc] = useState(null)

  useEffect(() => {
    const found = getDoc(docId)
    setDoc(found)
  }, [docId])

  const totalFromItems = useMemo(() => {
    if (!doc?.lineItems) return 0
    return doc.lineItems.reduce(
      (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.rate) || 0),
      0
    )
  }, [doc])

  const estimateTotal = useMemo(() => {
    const val = doc?.pricing?.totalCost
    const num = Number(val)
    return Number.isFinite(num) ? num : totalFromItems
  }, [doc, totalFromItems])

  if (!doc) {
    return (
      <div className="min-h-screen bg-[#f7f7f8] px-5 py-7">
        <div className="max-w-[1050px] mx-auto">
          <div className="flex justify-between items-center gap-3 mb-4 no-print">
            <button
              className="border border-black/10 bg-white rounded-xl px-3 py-2.5 cursor-pointer text-sm"
              onClick={() => router.push('/templates')}
            >
              ← Back
            </button>
            <div className="text-sm text-[#555]">Doc not found</div>
          </div>
        </div>
      </div>
    )
  }

  const isEstimate = doc.docType === 'estimate'
  const isInvoice = doc.docType === 'invoice'

  const patchDoc = (patch) => {
    const updated = updateDoc(docId, patch)
    setDoc(updated)
  }

  const setMeta = (patch) => patchDoc({ meta: { ...(doc.meta || {}), ...patch } })
  const setCompany = (patch) => patchDoc({ company: { ...(doc.company || {}), ...patch } })
  const setClient = (patch) => patchDoc({ client: { ...(doc.client || {}), ...patch } })
  const setPricing = (patch) => patchDoc({ pricing: { ...(doc.pricing || {}), ...patch } })

  const setLineItem = (itemId, patch) => {
    const next = (doc.lineItems || []).map((li) =>
      li.id === itemId ? { ...li, ...patch } : li
    )
    patchDoc({ lineItems: next })
  }

  const onDownloadPdf = () => window.print()
  const triggerLogoPick = () => fileInputRef.current?.click()

  const onLogoSelected = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, etc.)')
      return
    }
    const dataUrl = await readFileAsDataURL(file)
    setCompany({ logoDataUrl: dataUrl })
    e.target.value = ''
  }

  const removeLogo = () => setCompany({ logoDataUrl: '' })

  return (
    <div className="min-h-screen bg-[#f7f7f8] px-5 py-7">
      <div className="max-w-[1050px] mx-auto">

        {/* Toolbar — hidden in print */}
        <div className="flex justify-between items-center gap-3 mb-4 no-print">
          <button
            className="border border-black/10 bg-white rounded-xl px-3 py-2.5 cursor-pointer text-sm"
            onClick={() => router.push('/home')}
          >
            ← Home
          </button>

          <div className="flex items-center gap-3">
            <div className="text-sm text-[#555]">
              Draft • Last edited {new Date(doc.lastEditedAt).toLocaleString()}
            </div>
            <button
              className="border border-black/10 bg-[#111] text-white rounded-xl px-3 py-2.5 cursor-pointer text-sm"
              onClick={onDownloadPdf}
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* ── ESTIMATE ─────────────────────────────────────── */}
        {isEstimate && (
          <div className="bg-white border border-black/10 rounded-[18px] p-4 print-avoid-break">
            <div className="border-2 border-[#111] rounded-xl p-3">

              {/* Top tiny row: page no */}
              <div className="grid grid-cols-2 items-start gap-3 mb-2.5">
                <div className="text-xs font-bold text-[#111]">
                  Page No.{' '}
                  <input
                    className="w-[34px] border-0 border-b border-[#111] outline-none px-0.5 text-xs text-center"
                    value={doc.meta?.pageNo ?? '1'}
                    onChange={(e) => setMeta({ pageNo: e.target.value })}
                  />{' '}
                  of{' '}
                  <input
                    className="w-[34px] border-0 border-b border-[#111] outline-none px-0.5 text-xs text-center"
                    value={doc.meta?.pageCount ?? '1'}
                    onChange={(e) => setMeta({ pageCount: e.target.value })}
                  />
                </div>
              </div>

              {/* Header box */}
              <div className="border-2 border-[#111] rounded-[10px] p-2.5">
                <div className="text-center font-black text-lg uppercase tracking-[0.08em] mb-2.5">
                  Estimate
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[210px_1fr] gap-2.5 items-start">

                  {/* Logo + company info */}
                  <div>
                    {doc.company?.logoDataUrl ? (
                      <div className="w-full h-[85px] border border-[#111] rounded-lg flex items-center justify-center overflow-hidden bg-white">
                        <img
                          src={doc.company.logoDataUrl}
                          alt="Company logo"
                          className="w-full h-full object-contain p-1.5"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-full h-[85px] border border-[#111] rounded-lg bg-white grid place-items-center cursor-pointer"
                        onClick={triggerLogoPick}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="font-black text-xs text-[#111] uppercase tracking-[0.06em]">Logo</div>
                      </div>
                    )}

                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={onLogoSelected}
                        className="hidden"
                      />
                      <button
                        className="border border-black/10 bg-white rounded-[10px] px-2.5 py-2 cursor-pointer text-xs"
                        onClick={triggerLogoPick}
                      >
                        {doc.company?.logoDataUrl ? 'Change logo' : 'Upload logo'}
                      </button>
                      {doc.company?.logoDataUrl ? (
                        <button
                          className="border border-black/10 bg-transparent rounded-[10px] px-2.5 py-2 cursor-pointer text-xs text-[#333]"
                          onClick={removeLogo}
                        >
                          Remove
                        </button>
                      ) : (
                        <span className="text-xs text-[#666]">Optional</span>
                      )}
                    </div>

                    <div className="mt-2.5 text-[11px]">
                      <input
                        className="w-full border-0 outline-none text-xs font-black uppercase tracking-[0.04em] py-0.5"
                        value={doc.company?.name ?? ''}
                        onChange={(e) => setCompany({ name: e.target.value })}
                        placeholder="Company Name"
                      />
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold">
                        <span className="min-w-[44px] font-black uppercase tracking-[0.06em] text-[10px]">Phone:</span>
                        <input
                          className="flex-1 border-0 border-b border-[#111] outline-none text-[11px] py-0.5 px-0.5"
                          value={doc.company?.phone ?? ''}
                          onChange={(e) => setCompany({ phone: e.target.value })}
                          placeholder="(###) ###-####"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold">
                        <span className="min-w-[44px] font-black uppercase tracking-[0.06em] text-[10px]">Email:</span>
                        <input
                          className="flex-1 border-0 border-b border-[#111] outline-none text-[11px] py-0.5 px-0.5"
                          value={doc.company?.email ?? ''}
                          onChange={(e) => setCompany({ email: e.target.value })}
                          placeholder="email@company.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right: doc + client meta */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid grid-cols-[90px_1fr] items-center gap-2">
                      <div className="text-[11px] font-black uppercase tracking-[0.06em]">Date</div>
                      <input
                        className="w-full border border-[#111] rounded-lg px-2 py-1.5 text-xs outline-none"
                        type="date"
                        value={doc.meta?.issueDate ?? ''}
                        onChange={(e) => setMeta({ issueDate: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-[90px_1fr] items-center gap-2 no-print">
                      <div className="text-[11px] font-black uppercase tracking-[0.06em]">Name</div>
                      <input
                        className="w-full border border-[#111] rounded-lg px-2 py-1.5 text-xs outline-none"
                        value={doc.title ?? ''}
                        onChange={(e) => patchDoc({ title: e.target.value })}
                        placeholder="Fence install — Hernandez"
                      />
                    </div>

                    <div className="grid grid-cols-[90px_1fr] items-center gap-2">
                      <div className="text-[11px] font-black uppercase tracking-[0.06em]">Client</div>
                      <input
                        className="w-full border border-[#111] rounded-lg px-2 py-1.5 text-xs outline-none"
                        value={doc.client?.name ?? ''}
                        onChange={(e) => setClient({ name: e.target.value })}
                        placeholder="Client name"
                      />
                    </div>

                    <div className="grid grid-cols-[90px_1fr] items-center gap-2">
                      <div className="text-[11px] font-black uppercase tracking-[0.06em]">Phone</div>
                      <input
                        className="w-full border border-[#111] rounded-lg px-2 py-1.5 text-xs outline-none"
                        value={doc.client?.phone ?? ''}
                        onChange={(e) => setClient({ phone: e.target.value })}
                        placeholder="(###) ###-####"
                      />
                    </div>

                    <div className="grid grid-cols-[90px_1fr] items-center gap-2 col-span-2">
                      <div className="text-[11px] font-black uppercase tracking-[0.06em]">Address</div>
                      <input
                        className="w-full border border-[#111] rounded-lg px-2 py-1.5 text-xs outline-none"
                        value={doc.client?.address ?? ''}
                        onChange={(e) => setClient({ address: e.target.value })}
                        placeholder="Street address"
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Specs area */}
              <div className="mt-3 text-xs font-extrabold text-[#111]">
                We hereby submit specifications and estimates for:
              </div>

              <div className="mt-2.5 border-2 border-[#111] rounded-[10px] overflow-hidden">
                <textarea
                  className="lined-textarea w-full min-h-[160px] border-0 outline-none px-3 py-3 text-[13px] resize-none bg-transparent"
                  value={doc.description ?? ''}
                  onChange={(e) => {
                    patchDoc({ description: e.target.value })
                    autoGrow(e.target)
                  }}
                  onInput={(e) => autoGrow(e.target)}
                  placeholder="Type the scope of work here…"
                />
              </div>

              {/* Bottom: Terms + Total + Signatures */}
              <div className="mt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.07em] mb-1.5">Terms</div>
                    <textarea
                      className="w-full min-h-[56px] border border-[#111] rounded-[10px] px-2.5 py-2.5 outline-none text-xs leading-[1.35] resize-none"
                      value={doc.terms ?? ''}
                      onChange={(e) => {
                        patchDoc({ terms: e.target.value })
                        autoGrow(e.target)
                      }}
                      onInput={(e) => autoGrow(e.target)}
                      placeholder="Payment terms, validity, etc…"
                    />
                  </div>
                </div>

                <div className="mt-2.5 grid grid-cols-[1fr_210px] gap-2.5 items-center">
                  <div className="text-xs font-[650] text-[#111]">
                    We propose hereby to furnish material and labor — complete in accordance with above specifications,
                    for the sum of:
                  </div>
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="font-black">$</span>
                    <input
                      className="w-[170px] border border-[#111] rounded-[10px] px-2.5 py-2.5 text-[13px] outline-none text-right"
                      value={doc.pricing?.totalCost ?? ''}
                      onChange={(e) => setPricing({ totalCost: e.target.value })}
                      placeholder={estimateTotal.toFixed(2)}
                      inputMode="decimal"
                    />
                  </div>
                </div>

                <div className="mt-2.5 grid grid-cols-2 gap-2.5">
                  <div>
                    <div className="text-[11px] font-black text-[#111] mb-1.5">Client Signature</div>
                    <div className="h-px bg-[#111] mt-[34px]" />
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-[#111] mb-1.5">Authorized Contractor</div>
                    <div className="h-px bg-[#111] mt-[34px]" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── INVOICE ──────────────────────────────────────── */}
        {isInvoice && (
          <div className="bg-white border border-black/10 rounded-[18px] p-4">
            <div style={{ fontWeight: 900, fontSize: 20 }}>Invoice</div>
            <div style={{ color: '#666', marginTop: 6 }}>
              Invoice layout upgrade next (proposal-style box header + client block + table).
            </div>

            <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 6 }}>Invoice #</div>
                <input
                  className="w-full border border-[#111] rounded-lg px-2 py-1.5 text-xs outline-none"
                  value={doc.meta?.invoiceNumber ?? ''}
                  onChange={(e) => setMeta({ invoiceNumber: e.target.value })}
                />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 6 }}>Issue date</div>
                <input
                  className="w-full border border-[#111] rounded-lg px-2 py-1.5 text-xs outline-none"
                  type="date"
                  value={doc.meta?.issueDate ?? ''}
                  onChange={(e) => setMeta({ issueDate: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: 16, fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Line items
            </div>

            <table className="w-full border-collapse mt-2">
              <thead>
                <tr>
                  <th className="text-left px-2 py-2.5 border-b border-black/10 text-sm">Item</th>
                  <th className="text-left px-2 py-2.5 border-b border-black/10 text-sm w-[90px]">Qty</th>
                  <th className="text-left px-2 py-2.5 border-b border-black/10 text-sm w-[120px]">Rate</th>
                  <th className="text-left px-2 py-2.5 border-b border-black/10 text-sm w-[120px]">Amount</th>
                </tr>
              </thead>
              <tbody>
                {(doc.lineItems || []).map((li) => (
                  <tr key={li.id}>
                    <td className="px-2 py-2.5 border-b border-black/10 text-sm">
                      <input
                        className="w-full px-2.5 py-2 rounded-[10px] border border-black/10 outline-none text-sm"
                        value={li.name}
                        onChange={(e) => setLineItem(li.id, { name: e.target.value })}
                      />
                    </td>
                    <td className="px-2 py-2.5 border-b border-black/10 text-sm">
                      <input
                        className="w-full px-2.5 py-2 rounded-[10px] border border-black/10 outline-none text-sm"
                        value={li.qty}
                        onChange={(e) => setLineItem(li.id, { qty: e.target.value })}
                      />
                    </td>
                    <td className="px-2 py-2.5 border-b border-black/10 text-sm">
                      <input
                        className="w-full px-2.5 py-2 rounded-[10px] border border-black/10 outline-none text-sm"
                        value={li.rate}
                        onChange={(e) => setLineItem(li.id, { rate: e.target.value })}
                      />
                    </td>
                    <td className="px-2 py-2.5 border-b border-black/10 text-sm">
                      ${((Number(li.qty) || 0) * (Number(li.rate) || 0)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end items-center gap-3 mt-3">
              <div className="font-[850] text-sm">Total</div>
              <div className="text-[18px] font-black">${totalFromItems.toFixed(2)}</div>
            </div>

            <div style={{ marginTop: 18, fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Notes
            </div>
            <textarea
              className="w-full min-h-[56px] border border-[#111] rounded-[10px] px-2.5 py-2.5 outline-none text-xs leading-[1.35] resize-none mt-1"
              value={doc.notes ?? ''}
              onChange={(e) => patchDoc({ notes: e.target.value })}
            />

            <div style={{ marginTop: 14, fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Terms
            </div>
            <textarea
              className="w-full min-h-[56px] border border-[#111] rounded-[10px] px-2.5 py-2.5 outline-none text-xs leading-[1.35] resize-none mt-1"
              value={doc.terms ?? ''}
              onChange={(e) => patchDoc({ terms: e.target.value })}
            />
          </div>
        )}

      </div>
    </div>
  )
}

function autoGrow(el) {
  if (!el) return
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
