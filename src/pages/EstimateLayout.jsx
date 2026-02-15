import styles from "./EstimateLayout.module.css";

export default function EstimateLayout({
  doc,
  total,
  setTitle,
  setMeta,
  setClient,
  setLineItem,
  setNotes,
  setTerms
}) {
  return (
    <div className={styles.paper}>

      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div>State Lic #</div>
        </div>

        <div className={styles.headerCenter}>
          <div className={styles.proposal}>PROPOSAL</div>
          <input
            className={styles.companyName}
            placeholder="Company Name"
          />
          <textarea
            className={styles.companyInfo}
            placeholder="Address • City, State ZIP • Phone • Email"
          />
        </div>

        <div className={styles.headerRight}>
          Page No ___ of ___
        </div>
      </div>

      <div className={styles.hr} />

      {/* CLIENT INFO GRID */}
      <div className={styles.infoGrid}>
        <div>
          <div className={styles.label}>Proposal Submitted To</div>
          <input value={doc.client.name} onChange={(e)=>setClient({name:e.target.value})} />
          
          <div className={styles.label}>Street</div>
          <input value={doc.client.address} onChange={(e)=>setClient({address:e.target.value})} />

          <div className={styles.label}>City, State ZIP</div>
          <input />
        </div>

        <div>
          <div className={styles.label}>Phone</div>
          <input value={doc.client.phone} onChange={(e)=>setClient({phone:e.target.value})} />

          <div className={styles.label}>Date</div>
          <input type="date" value={doc.meta.issueDate} onChange={(e)=>setMeta({issueDate:e.target.value})} />

          <div className={styles.label}>Job Name</div>
          <input />

          <div className={styles.label}>Job Location</div>
          <input />
        </div>
      </div>

      <div className={styles.hr} />

      {/* DESCRIPTION AREA */}
      <div className={styles.sectionTitle}>
        We hereby submit specifications and estimates for:
      </div>

      <textarea
        className={styles.descriptionBox}
        placeholder="Project description..."
        value={doc.notes}
        onChange={(e)=>setNotes(e.target.value)}
      />

      <div className={styles.totalRow}>
        Total: <span>${total.toFixed(2)}</span>
      </div>

      <div className={styles.hr} />

      {/* TERMS */}
      <div className={styles.sectionTitle}>Payment to be made as follows:</div>

      <textarea
        className={styles.termsBox}
        value={doc.terms}
        onChange={(e)=>setTerms(e.target.value)}
      />

      {/* SIGNATURE */}
      <div className={styles.signatureSection}>
        <div>
          Authorized Signature
          <div className={styles.signatureLine}></div>
        </div>

        <div>
          Date
          <div className={styles.signatureLine}></div>
        </div>
      </div>

    </div>
  );
}
