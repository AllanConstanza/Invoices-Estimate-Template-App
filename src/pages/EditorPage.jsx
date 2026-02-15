import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./EditorPage.module.css";
import { getDoc, updateDoc } from "../data/docsStore";

export default function EditorPage() {
  const navigate = useNavigate();
  const { docId } = useParams();
  const fileInputRef = useRef(null);

  const [doc, setDoc] = useState(null);

  useEffect(() => {
    const found = getDoc(docId);
    setDoc(found);
  }, [docId]);

  const totalFromItems = useMemo(() => {
    if (!doc?.lineItems) return 0;
    return doc.lineItems.reduce(
      (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.rate) || 0),
      0
    );
  }, [doc]);

  const estimateTotal = useMemo(() => {
    const val = doc?.pricing?.totalCost;
    const num = Number(val);
    return Number.isFinite(num) ? num : totalFromItems;
  }, [doc, totalFromItems]);

  if (!doc) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.toolbar}>
            <button className={styles.btnGhost} onClick={() => navigate("/templates")}>
              ← Back
            </button>
            <div className={styles.status}>Doc not found</div>
          </div>
        </div>
      </div>
    );
  }

  const isEstimate = doc.docType === "estimate";
  const isInvoice = doc.docType === "invoice";

  const patchDoc = (patch) => {
    const updated = updateDoc(docId, patch);
    setDoc(updated);
  };

  const setMeta = (patch) => patchDoc({ meta: { ...(doc.meta || {}), ...patch } });
  const setCompany = (patch) => patchDoc({ company: { ...(doc.company || {}), ...patch } });
  const setClient = (patch) => patchDoc({ client: { ...(doc.client || {}), ...patch } });
  const setJob = (patch) => patchDoc({ job: { ...(doc.job || {}), ...patch } });
  const setPricing = (patch) => patchDoc({ pricing: { ...(doc.pricing || {}), ...patch } });

  const setLineItem = (itemId, patch) => {
    const next = (doc.lineItems || []).map((li) =>
      li.id === itemId ? { ...li, ...patch } : li
    );
    patchDoc({ lineItems: next });
  };

  const onDownloadPdf = () => {
    window.print();
  };

  const triggerLogoPick = () => fileInputRef.current?.click();

  const onLogoSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (PNG, JPG, etc.)");
      return;
    }

    const dataUrl = await readFileAsDataURL(file);
    setCompany({ logoDataUrl: dataUrl });
    e.target.value = "";
  };

  const removeLogo = () => setCompany({ logoDataUrl: "" });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Toolbar (hidden in print) */}
        <div className={styles.toolbar}>
          <button className={styles.btnGhost} onClick={() => navigate("/home")}>
            ← Home
          </button>

          <div className={styles.toolbarRight}>
            <div className={styles.status}>
              Draft • Last edited {new Date(doc.lastEditedAt).toLocaleString()}
            </div>
            <button className={styles.btnPrimary} onClick={onDownloadPdf}>
              Download PDF
            </button>
          </div>
        </div>

        {/* =========================
            ESTIMATE: Proposal
           ========================= */}
        {isEstimate && (
          <div className={styles.paperProposal}>
            <div className={styles.proposalBorder}>
              {/* top tiny row: state license + page no */}
              <div className={styles.proposalTopMeta}>
                {/*
<div className={styles.smallText}>
  State Lic. #{" "}
  <input
    className={styles.inlineInput}
    value={doc.company?.license ?? ""}
    onChange={(e) => setCompany({ license: e.target.value })}
    placeholder="_____"
  />
</div>
*/}


                <div className={styles.smallText}>
                  Page No.{" "}
                  <input
                    className={styles.inlineInputShort}
                    value={doc.meta?.pageNo ?? "1"}
                    onChange={(e) => setMeta({ pageNo: e.target.value })}
                  />{" "}
                  of{" "}
                  <input
                    className={styles.inlineInputShort}
                    value={doc.meta?.pageCount ?? "1"}
                    onChange={(e) => setMeta({ pageCount: e.target.value })}
                  />
                </div>
              </div>

              {/* Header box */}
              <div className={styles.proposalHeaderBox}>
                <div className={styles.proposalHeaderTitle}>Estimate</div>

                <div className={styles.companyHeaderGrid}>
                  {/* Logo (optional) */}
                  <div className={styles.logoCell}>
                    {doc.company?.logoDataUrl ? (
                      <div className={styles.logoPreviewWrap}>
                        <img
                          src={doc.company.logoDataUrl}
                          alt="Company logo"
                          className={styles.logoPreview}
                        />
                      </div>
                    ) : (
                      <div
                        className={styles.logoPlaceholder}
                        onClick={triggerLogoPick}
                        role="button"
                        tabIndex={0}
                      >
                        <div className={styles.logoPlaceholderTitle}>Logo</div>
                        <div className={styles.logoPlaceholderSub}>Click to upload</div>
                      </div>
                    )}

                    <div className={styles.logoActions}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={onLogoSelected}
                        style={{ display: "none" }}
                      />
                      <button className={styles.btnSmall} onClick={triggerLogoPick}>
                        {doc.company?.logoDataUrl ? "Change logo" : "Upload logo"}
                      </button>
                      {doc.company?.logoDataUrl ? (
                        <button className={styles.btnSmallGhost} onClick={removeLogo}>
                          Remove
                        </button>
                      ) : (
                        <span className={styles.hint}>Optional</span>
                      )}
                    </div>

                    {/* Company info beneath logo (prints nicely) */}
                    <div className={styles.logoCompanyInfo}>
                      <input
                        className={styles.logoCompanyName}
                        value={doc.company?.name ?? ""}
                        onChange={(e) => setCompany({ name: e.target.value })}
                        placeholder="Company Name"
                      />
                      <div className={styles.logoCompanyLine}>
                        <span>Phone:</span>
                        <input
                          className={styles.logoCompanyInlineInput}
                          value={doc.company?.phone ?? ""}
                          onChange={(e) => setCompany({ phone: e.target.value })}
                          placeholder="(###) ###-####"
                        />
                      </div>
                      <div className={styles.logoCompanyLine}>
                        <span>Email:</span>
                        <input
                          className={styles.logoCompanyInlineInput}
                          value={doc.company?.email ?? ""}
                          onChange={(e) => setCompany({ email: e.target.value })}
                          placeholder="email@company.com"
                        />
                      </div>
                    </div>



                  </div>

                  {/* Center company block */}
                  {/* Right: compact doc + client info (HORIZONTAL) */}
                  <div className={styles.docMetaCell}>
                    <div className={styles.metaGrid2}>
                      {/* Row 1 */}
                      <div className={styles.metaFieldRow}>
                        <div className={styles.metaLabel}>Date</div>
                        <input
                          className={styles.metaBox}
                          type="date"
                          value={doc.meta?.issueDate ?? ""}
                          onChange={(e) => setMeta({ issueDate: e.target.value })}
                        />
                      </div>

                      {/* Document name (saved for Home/search but not part of the printed form) */}
                      <div className={`${styles.metaFieldRow} ${styles.metaHideOnPrint}`}>
                        <div className={styles.metaLabel}>Name</div>
                        <input
                          className={styles.metaBox}
                          value={doc.title ?? ""}
                          onChange={(e) => patchDoc({ title: e.target.value })}
                          placeholder="Fence install — Hernandez"
                        />
                      </div>



                      {/* Row 2 */}
                      <div className={styles.metaFieldRow}>
                        <div className={styles.metaLabel}>Client</div>
                        <input
                          className={styles.metaBox}
                          value={doc.client?.name ?? ""}
                          onChange={(e) => setClient({ name: e.target.value })}
                          placeholder="Client name"
                        />
                      </div>

                      <div className={styles.metaFieldRow}>
                        <div className={styles.metaLabel}>Phone</div>
                        <input
                          className={styles.metaBox}
                          value={doc.client?.phone ?? ""}
                          onChange={(e) => setClient({ phone: e.target.value })}
                          placeholder="(###) ###-####"
                        />
                      </div>

                      {/* Row 3 (full width) */}
                      <div className={styles.metaFieldRowWide}>
                        <div className={styles.metaLabel}>Address</div>
                        <input
                          className={styles.metaBox}
                          value={doc.client?.address ?? ""}
                          onChange={(e) => setClient({ address: e.target.value })}
                          placeholder="Street address"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* REMOVE the huge client info grid completely (this was the page killer) */}
              {/* If you want job fields later, we can add a single compact row under the header. */}

              {/* Specs area */}
              <div className={styles.specsTitleRow}>
                <div className={styles.specsTitle}>
                  We hereby submit specifications and estimates for:
                </div>
              </div>

              <div className={styles.linedWriteArea}>
                <textarea
                  className={styles.linedTextarea}
                  value={doc.description ?? ""}
                  onChange={(e) => {
                    patchDoc({ description: e.target.value });
                    autoGrow(e.target);
                  }}
                  onInput={(e) => autoGrow(e.target)}
                  placeholder="Type the scope of work here…"
                />
              </div>

              {/* Bottom: Notes/Terms + Total + signature lines */}
              <div className={styles.bottomArea}>
                <div className={styles.bottomTwoCol}>
                  {/*
<div>
  <div className={styles.bottomLabel}>Notes</div>
  <textarea
    className={styles.bottomTextarea}
    value={doc.notes ?? ""}
    onChange={(e) => {
      patchDoc({ notes: e.target.value });
      autoGrow(e.target);
    }}
    onInput={(e) => autoGrow(e.target)}
    placeholder="Optional notes…"
  />
</div>
*/}


                  <div>
                    <div className={styles.bottomLabel}>Terms</div>
                    <textarea
                      className={styles.bottomTextarea}
                      value={doc.terms ?? ""}
                      onChange={(e) => {
                        patchDoc({ terms: e.target.value });
                        autoGrow(e.target);
                      }}
                      onInput={(e) => autoGrow(e.target)}
                      placeholder="Payment terms, validity, etc…"
                    />
                  </div>
                </div>

                <div className={styles.totalLineRow}>
                  <div className={styles.totalLineText}>
                    We propose hereby to furnish material and labor — complete in accordance with above specifications,
                    for the sum of:
                  </div>

                  <div className={styles.totalLineAmount}>
                    <span className={styles.dollarSign}>$</span>
                    <input
                      className={styles.totalAmountInput}
                      value={doc.pricing?.totalCost ?? ""}
                      onChange={(e) => setPricing({ totalCost: e.target.value })}
                      placeholder={estimateTotal.toFixed(2)}
                      inputMode="decimal"
                    />
                  </div>
                </div>

                <div className={styles.signatureRowProposal}>
                  <div className={styles.signatureCell}>
                    <div className={styles.sigLabel}>Client Signature</div>
                    <div className={styles.sigLine} />
                  </div>

                  <div className={styles.signatureCell}>
                    <div className={styles.sigLabel}>Authorized Contractor</div>
                    <div className={styles.sigLine} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================
            INVOICE (unchanged)
           ========================= */}
        {isInvoice && (
          <div className={styles.paper}>
            <div style={{ fontWeight: 900, fontSize: 20 }}>Invoice</div>
            <div style={{ color: "#666", marginTop: 6 }}>
              Invoice layout upgrade next (proposal-style box header + client block + table).
            </div>

            <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 6 }}>Invoice #</div>
                <input
                  className={styles.metaBox}
                  value={doc.meta?.invoiceNumber ?? ""}
                  onChange={(e) => setMeta({ invoiceNumber: e.target.value })}
                />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 6 }}>Issue date</div>
                <input
                  className={styles.metaBox}
                  type="date"
                  value={doc.meta?.issueDate ?? ""}
                  onChange={(e) => setMeta({ issueDate: e.target.value })}
                />
              </div>
            </div>

            <div style={{ marginTop: 16, fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Line items
            </div>

            <table className={styles.table} style={{ marginTop: 8 }}>
              <thead>
                <tr>
                  <th className={styles.th}>Item</th>
                  <th className={styles.th} style={{ width: 90 }}>Qty</th>
                  <th className={styles.th} style={{ width: 120 }}>Rate</th>
                  <th className={styles.th} style={{ width: 120 }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {(doc.lineItems || []).map((li) => (
                  <tr key={li.id}>
                    <td className={styles.td}>
                      <input
                        className={styles.smallInput}
                        value={li.name}
                        onChange={(e) => setLineItem(li.id, { name: e.target.value })}
                      />
                    </td>
                    <td className={styles.td}>
                      <input
                        className={styles.smallInput}
                        value={li.qty}
                        onChange={(e) => setLineItem(li.id, { qty: e.target.value })}
                      />
                    </td>
                    <td className={styles.td}>
                      <input
                        className={styles.smallInput}
                        value={li.rate}
                        onChange={(e) => setLineItem(li.id, { rate: e.target.value })}
                      />
                    </td>
                    <td className={styles.td}>
                      ${((Number(li.qty) || 0) * (Number(li.rate) || 0)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.totalRowInvoice}>
              <div className={styles.totalLabel}>Total</div>
              <div className={styles.totalValue}>${totalFromItems.toFixed(2)}</div>
            </div>

            <div style={{ marginTop: 18, fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Notes
            </div>
            <textarea
              className={styles.bottomTextarea}
              value={doc.notes ?? ""}
              onChange={(e) => patchDoc({ notes: e.target.value })}
            />

            <div style={{ marginTop: 14, fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Terms
            </div>
            <textarea
              className={styles.bottomTextarea}
              value={doc.terms ?? ""}
              onChange={(e) => patchDoc({ terms: e.target.value })}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function autoGrow(el) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
