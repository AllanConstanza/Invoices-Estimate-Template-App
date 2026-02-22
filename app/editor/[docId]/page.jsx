'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getDoc, updateDoc } from '../../../src/data/docsStore'
import AuthGuard from '../../../src/components/AuthGuard'

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
      <div className="flex-1 px-6 py-7">
        <div className="max-w-[1050px] mx-auto">
          <div className="flex justify-between items-center gap-3 mb-4 no-print">
            <button
              className="border border-white/[0.08] bg-[#1a1b21] rounded-xl px-3 py-2.5 cursor-pointer text-sm text-[#888] hover:bg-[#22232e] hover:text-white transition-colors"
              onClick={() => router.push('/templates')}
            >
              ← Back
            </button>
            <div className="text-sm text-[#444]">Doc not found</div>
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

  const addLineItem = () => {
    const next = [...(doc.lineItems || []), { id: crypto.randomUUID(), name: '', qty: 1, rate: 0 }]
    patchDoc({ lineItems: next })
  }

  const removeLineItem = (itemId) => {
    const next = (doc.lineItems || []).filter((li) => li.id !== itemId)
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
    <AuthGuard>
    <div className="flex-1 px-6 py-7">
      <div className="max-w-[1050px] mx-auto">

        {/* Toolbar */}
        <div className="flex justify-between items-center gap-3 mb-4 no-print">
          <button
            className="border border-white/[0.08] bg-[#1a1b21] rounded-xl px-3 py-2.5 cursor-pointer text-sm text-[#888] hover:bg-[#22232e] hover:text-white transition-colors"
            onClick={() => router.push('/home')}
          >
            ← Home
          </button>

          <div className="flex items-center gap-3">
            <div className="text-sm text-[#444]">
              Last edited {new Date(doc.lastEditedAt).toLocaleString()}
            </div>
            <button
              className="bg-[#3b63f5] text-white rounded-xl px-3.5 py-2.5 cursor-pointer text-sm hover:bg-[#2f53e0] transition-colors border-0"
              onClick={onDownloadPdf}
            >
              Download PDF
            </button>
          </div>
        </div>

        {/* ── ESTIMATE ────────────────────────────────────── */}
        {isEstimate && (
          <div className="bg-white border border-black/10 rounded-[18px] p-4 print-avoid-break">
            <div className="border-2 border-[#111] rounded-xl p-3">

              {/* Page number row */}
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

                  {/* Logo + company */}
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
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={onLogoSelected} className="hidden" />
                      <button
                        className="border border-black/10 bg-white rounded-[10px] px-2.5 py-2 cursor-pointer text-xs hover:bg-[#f7f7f8] transition-colors"
                        onClick={triggerLogoPick}
                      >
                        {doc.company?.logoDataUrl ? 'Change logo' : 'Upload logo'}
                      </button>
                      {doc.company?.logoDataUrl ? (
                        <button
                          className="border border-black/10 bg-transparent rounded-[10px] px-2.5 py-2 cursor-pointer text-xs text-[#333] hover:bg-[#f7f7f8] transition-colors"
                          onClick={removeLogo}
                        >
                          Remove
                        </button>
                      ) : (
                        <span className="text-xs text-[#aaa]">Optional</span>
                      )}
                    </div>

                    <div className="mt-2.5">
                      <input
                        className="w-full border-0 outline-none text-xs font-black uppercase tracking-[0.04em] py-0.5"
                        value={doc.company?.name ?? ''}
                        onChange={(e) => setCompany({ name: e.target.value })}
                        placeholder="Company Name"
                      />
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="min-w-[44px] font-black uppercase tracking-[0.06em] text-[10px]">Phone:</span>
                        <input
                          className="flex-1 border-0 border-b border-[#111] outline-none text-[11px] py-0.5"
                          value={doc.company?.phone ?? ''}
                          onChange={(e) => setCompany({ phone: e.target.value })}
                          placeholder="(###) ###-####"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="min-w-[44px] font-black uppercase tracking-[0.06em] text-[10px]">Email:</span>
                        <input
                          className="flex-1 border-0 border-b border-[#111] outline-none text-[11px] py-0.5"
                          value={doc.company?.email ?? ''}
                          onChange={(e) => setCompany({ email: e.target.value })}
                          placeholder="email@company.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right: meta grid */}
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

              {/* Scope area */}
              <div className="mt-3 text-xs font-extrabold text-[#111]">
                We hereby submit specifications and estimates for:
              </div>
              <div className="mt-2.5 border-2 border-[#111] rounded-[10px] overflow-hidden">
                <textarea
                  className="lined-textarea w-full min-h-[160px] border-0 outline-none px-3 py-3 text-[13px] resize-none bg-transparent"
                  value={doc.description ?? ''}
                  onChange={(e) => { patchDoc({ description: e.target.value }); autoGrow(e.target) }}
                  onInput={(e) => autoGrow(e.target)}
                  placeholder="Type the scope of work here…"
                />
              </div>

              {/* Terms + total + signatures */}
              <div className="mt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.07em] mb-1.5">Terms</div>
                    <textarea
                      className="w-full min-h-[56px] border border-[#111] rounded-[10px] px-2.5 py-2.5 outline-none text-xs leading-[1.35] resize-none"
                      value={doc.terms ?? ''}
                      onChange={(e) => { patchDoc({ terms: e.target.value }); autoGrow(e.target) }}
                      onInput={(e) => autoGrow(e.target)}
                      placeholder="Payment terms, validity, etc…"
                    />
                  </div>
                </div>

                <div className="mt-2.5 grid grid-cols-[1fr_210px] gap-2.5 items-center">
                  <div className="text-xs font-[650] text-[#111]">
                    We propose hereby to furnish material and labor — complete in accordance with above specifications, for the sum of:
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

        {/* ── INVOICE ─────────────────────────────────────── */}
        {isInvoice && (
          <div className="bg-white border border-black/10 rounded-[18px] p-4 print-avoid-break">
            <div className="border-2 border-[#111] rounded-xl p-3">

              {/* Header box */}
              <div className="border-2 border-[#111] rounded-[10px] p-2.5 mb-3">
                <div className="text-center font-black text-lg uppercase tracking-[0.08em] mb-2.5">
                  Invoice
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[210px_1fr] gap-2.5 items-start">

                  {/* Logo + company */}
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
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={onLogoSelected} className="hidden" />
                      <button
                        className="border border-black/10 bg-white rounded-[10px] px-2.5 py-2 cursor-pointer text-xs hover:bg-[#f7f7f8] transition-colors"
                        onClick={triggerLogoPick}
                      >
                        {doc.company?.logoDataUrl ? 'Change logo' : 'Upload logo'}
                      </button>
                      {doc.company?.logoDataUrl ? (
                        <button
                          className="border border-black/10 bg-transparent rounded-[10px] px-2.5 py-2 cursor-pointer text-xs text-[#333] hover:bg-[#f7f7f8] transition-colors"
                          onClick={removeLogo}
                        >
                          Remove
                        </button>
                      ) : (
                        <span className="text-xs text-[#aaa]">Optional</span>
                      )}
                    </div>

                    <div className="mt-2.5">
                      <input
                        className="w-full border-0 outline-none text-xs font-black uppercase tracking-[0.04em] py-0.5"
                        value={doc.company?.name ?? ''}
                        onChange={(e) => setCompany({ name: e.target.value })}
                        placeholder="Company Name"
                      />
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="min-w-[44px] font-black uppercase tracking-[0.06em] text-[10px]">Phone:</span>
                        <input
                          className="flex-1 border-0 border-b border-[#111] outline-none text-[11px] py-0.5"
                          value={doc.company?.phone ?? ''}
                          onChange={(e) => setCompany({ phone: e.target.value })}
                          placeholder="(###) ###-####"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="min-w-[44px] font-black uppercase tracking-[0.06em] text-[10px]">Email:</span>
                        <input
                          className="flex-1 border-0 border-b border-[#111] outline-none text-[11px] py-0.5"
                          value={doc.company?.email ?? ''}
                          onChange={(e) => setCompany({ email: e.target.value })}
                          placeholder="email@company.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right: invoice meta + client */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid grid-cols-[90px_1fr] items-center gap-2">
                      <div className="text-[11px] font-black uppercase tracking-[0.06em]">Invoice #</div>
                      <input
                        className="w-full border border-[#111] rounded-lg px-2 py-1.5 text-xs outline-none"
                        value={doc.meta?.invoiceNumber ?? ''}
                        onChange={(e) => setMeta({ invoiceNumber: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-[90px_1fr] items-center gap-2 no-print">
                      <div className="text-[11px] font-black uppercase tracking-[0.06em]">Name</div>
                      <input
                        className="w-full border border-[#111] rounded-lg px-2 py-1.5 text-xs outline-none"
                        value={doc.title ?? ''}
                        onChange={(e) => patchDoc({ title: e.target.value })}
                        placeholder="Roof repair — Martinez"
                      />
                    </div>
                    <div className="grid grid-cols-[90px_1fr] items-center gap-2">
                      <div className="text-[11px] font-black uppercase tracking-[0.06em]">Issue Date</div>
                      <input
                        className="w-full border border-[#111] rounded-lg px-2 py-1.5 text-xs outline-none"
                        type="date"
                        value={doc.meta?.issueDate ?? ''}
                        onChange={(e) => setMeta({ issueDate: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-[90px_1fr] items-center gap-2">
                      <div className="text-[11px] font-black uppercase tracking-[0.06em]">Due Date</div>
                      <input
                        className="w-full border border-[#111] rounded-lg px-2 py-1.5 text-xs outline-none"
                        type="date"
                        value={doc.meta?.dueDate ?? ''}
                        onChange={(e) => setMeta({ dueDate: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-[90px_1fr] items-center gap-2">
                      <div className="text-[11px] font-black uppercase tracking-[0.06em]">Bill To</div>
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

              {/* Line items table */}
              <div className="text-[10px] font-black uppercase tracking-[0.07em] mb-2">Line Items</div>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#111]">
                    <th className="text-left text-[10px] font-black uppercase tracking-[0.06em] pb-2 pr-2">Description</th>
                    <th className="text-center text-[10px] font-black uppercase tracking-[0.06em] pb-2 px-2 w-[70px]">Qty</th>
                    <th className="text-right text-[10px] font-black uppercase tracking-[0.06em] pb-2 px-2 w-[110px]">Rate</th>
                    <th className="text-right text-[10px] font-black uppercase tracking-[0.06em] pb-2 pl-2 w-[110px]">Amount</th>
                    <th className="w-[28px] no-print" />
                  </tr>
                </thead>
                <tbody>
                  {(doc.lineItems || []).map((li) => (
                    <tr key={li.id} className="border-b border-black/10 group">
                      <td className="py-2 pr-2">
                        <input
                          className="w-full border-0 outline-none text-sm bg-transparent"
                          value={li.name}
                          onChange={(e) => setLineItem(li.id, { name: e.target.value })}
                          placeholder="Item description"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          className="w-full border-0 outline-none text-sm text-center bg-transparent"
                          value={li.qty}
                          onChange={(e) => setLineItem(li.id, { qty: e.target.value })}
                          inputMode="decimal"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          className="w-full border-0 outline-none text-sm text-right bg-transparent"
                          value={li.rate}
                          onChange={(e) => setLineItem(li.id, { rate: e.target.value })}
                          placeholder="0.00"
                          inputMode="decimal"
                        />
                      </td>
                      <td className="py-2 pl-2 text-sm text-right font-semibold">
                        ${((Number(li.qty) || 0) * (Number(li.rate) || 0)).toFixed(2)}
                      </td>
                      <td className="py-2 pl-1 no-print">
                        <button
                          className="w-6 h-6 rounded-md text-[#ccc] hover:text-[#c0392b] hover:bg-red-50 transition-colors text-xs cursor-pointer border-0 bg-transparent opacity-0 group-hover:opacity-100"
                          onClick={() => removeLineItem(li.id)}
                          aria-label="Remove row"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Add row + total */}
              <div className="mt-3 flex items-center justify-between gap-4">
                <button
                  className="no-print text-xs text-[#555] border border-black/[0.09] bg-white rounded-[10px] px-3 py-2 cursor-pointer hover:bg-[#f7f7f8] transition-colors shadow-sm"
                  onClick={addLineItem}
                >
                  + Add row
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black uppercase tracking-[0.07em] text-[#111]">Total</span>
                  <span className="text-[20px] font-black text-[#111]">${totalFromItems.toFixed(2)}</span>
                </div>
              </div>

              {/* Notes + Terms */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.07em] mb-1.5">Notes</div>
                  <textarea
                    className="w-full min-h-[56px] border border-[#111] rounded-[10px] px-2.5 py-2.5 outline-none text-xs leading-[1.35] resize-none"
                    value={doc.notes ?? ''}
                    onChange={(e) => { patchDoc({ notes: e.target.value }); autoGrow(e.target) }}
                    onInput={(e) => autoGrow(e.target)}
                    placeholder="Thank you for your business…"
                  />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.07em] mb-1.5">Terms</div>
                  <textarea
                    className="w-full min-h-[56px] border border-[#111] rounded-[10px] px-2.5 py-2.5 outline-none text-xs leading-[1.35] resize-none"
                    value={doc.terms ?? ''}
                    onChange={(e) => { patchDoc({ terms: e.target.value }); autoGrow(e.target) }}
                    onInput={(e) => autoGrow(e.target)}
                    placeholder="Payment due within 15 days…"
                  />
                </div>
              </div>

              {/* Signatures */}
              <div className="mt-3 grid grid-cols-2 gap-2.5">
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
        )}

      </div>
    </div>
    </AuthGuard>
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
