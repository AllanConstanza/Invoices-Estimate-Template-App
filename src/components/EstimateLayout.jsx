'use client'

export default function EstimateLayout({
  doc,
  total,
  setClient,
  setMeta,
  setNotes,
  setTerms,
}) {
  return (
    <div className="w-[8.5in] min-h-[11in] bg-white px-[44px] py-[36px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] font-[Arial,Helvetica,sans-serif] text-[#111]">

      {/* HEADER */}
      <div className="flex justify-between text-[11px] mb-3">
        <div>State Lic #</div>
        <div className="text-center font-semibold">Page No ___ of ___</div>
      </div>

      <div className="border-2 border-[#111] rounded-[10px] p-[18px] text-center mb-3.5">
        <div className="text-[20px] tracking-[0.12em] font-extrabold mb-3.5">PROPOSAL</div>
        <input className="w-full border-0 outline-none text-center font-bold" placeholder="Company Name" />
        <textarea
          className="w-full border-0 outline-none text-center text-sm resize-none mt-1"
          placeholder="Address • City, State ZIP • Phone • Email"
        />
      </div>

      <div className="h-px bg-[#111] my-3.5" />

      {/* CLIENT INFO GRID */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex flex-col gap-1">
          <div className="text-[11px] font-bold uppercase tracking-[0.06em]">Proposal Submitted To</div>
          <input
            className="border-0 border-b border-[#111] outline-none py-1"
            value={doc.client.name}
            onChange={(e) => setClient({ name: e.target.value })}
          />
          <div className="text-[11px] font-bold uppercase tracking-[0.06em] mt-2">Street</div>
          <input
            className="border-0 border-b border-[#111] outline-none py-1"
            value={doc.client.address}
            onChange={(e) => setClient({ address: e.target.value })}
          />
          <div className="text-[11px] font-bold uppercase tracking-[0.06em] mt-2">City, State ZIP</div>
          <input className="border-0 border-b border-[#111] outline-none py-1" />
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-[11px] font-bold uppercase tracking-[0.06em]">Phone</div>
          <input
            className="border-0 border-b border-[#111] outline-none py-1"
            value={doc.client.phone}
            onChange={(e) => setClient({ phone: e.target.value })}
          />
          <div className="text-[11px] font-bold uppercase tracking-[0.06em] mt-2">Date</div>
          <input
            className="border-0 border-b border-[#111] outline-none py-1"
            type="date"
            value={doc.meta.issueDate}
            onChange={(e) => setMeta({ issueDate: e.target.value })}
          />
          <div className="text-[11px] font-bold uppercase tracking-[0.06em] mt-2">Job Name</div>
          <input className="border-0 border-b border-[#111] outline-none py-1" />
          <div className="text-[11px] font-bold uppercase tracking-[0.06em] mt-2">Job Location</div>
          <input className="border-0 border-b border-[#111] outline-none py-1" />
        </div>
      </div>

      <div className="h-px bg-[#111] my-3.5" />

      {/* DESCRIPTION */}
      <div className="text-[11px] font-black uppercase tracking-[0.1em] mb-1.5">
        We hereby submit specifications and estimates for:
      </div>

      <textarea
        className="lined-textarea w-full min-h-[180px] border-0 outline-none px-3 py-3 text-[13px] resize-none"
        placeholder="Project description..."
        value={doc.notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <div className="flex items-center gap-3 my-2">
        Total: <span className="font-bold">${total.toFixed(2)}</span>
      </div>

      <div className="h-px bg-[#111] my-3.5" />

      {/* TERMS */}
      <div className="text-[11px] font-black uppercase tracking-[0.1em] mb-1.5">
        Payment to be made as follows:
      </div>

      <textarea
        className="w-full min-h-[80px] border border-[#111] rounded-lg p-2.5 text-sm outline-none resize-none"
        value={doc.terms}
        onChange={(e) => setTerms(e.target.value)}
      />

      {/* SIGNATURE */}
      <div className="mt-6 flex justify-between gap-10">
        <div className="flex-1">
          <div className="text-[11px] font-bold uppercase tracking-[0.06em]">Authorized Signature</div>
          <div className="border-b-2 border-[#111] h-8 mt-1.5" />
        </div>
        <div className="flex-1">
          <div className="text-[11px] font-bold uppercase tracking-[0.06em]">Date</div>
          <div className="border-b-2 border-[#111] h-8 mt-1.5" />
        </div>
      </div>

    </div>
  )
}
