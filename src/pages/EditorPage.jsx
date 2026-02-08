import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./EditorPage.module.css";
import { getDoc, updateDoc } from "../data/docsStore";

export default function EditorPage() {
  const navigate = useNavigate();
  const { docId } = useParams();

  const [doc, setDoc] = useState(null);

  useEffect(() => {
    const found = getDoc(docId);
    setDoc(found);
  }, [docId]);

  const total = useMemo(() => {
    if (!doc) return 0;
    return doc.lineItems.reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.rate) || 0), 0);
  }, [doc]);

  if (!doc) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.topBar}>
            <button className={styles.back} onClick={() => navigate("/templates")}>
              ← Back
            </button>
            <div className={styles.status}>Doc not found</div>
          </div>
        </div>
      </div>
    );
  }

  const setTitle = (title) => {
    const updated = updateDoc(docId, { title });
    setDoc(updated);
  };

  const setClient = (patch) => {
    const updated = updateDoc(docId, { client: { ...doc.client, ...patch } });
    setDoc(updated);
  };

  const setLineItem = (itemId, patch) => {
    const next = doc.lineItems.map((li) => (li.id === itemId ? { ...li, ...patch } : li));
    const updated = updateDoc(docId, { lineItems: next });
    setDoc(updated);
  };

  const setNotes = (notes) => {
    const updated = updateDoc(docId, { notes });
    setDoc(updated);
  };

  const setTerms = (terms) => {
    const updated = updateDoc(docId, { terms });
    setDoc(updated);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <button className={styles.back} onClick={() => navigate("/home")}>
            ← Home
          </button>
          <div className={styles.status}>
            Draft • Last edited {new Date(doc.lastEditedAt).toLocaleString()}
          </div>
        </div>

        <div className={styles.paper}>
          <input
            className={styles.titleInput}
            value={doc.title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className={styles.sectionTitle}>Client info</div>
          <div className={styles.grid2}>
            <input className={styles.input} placeholder="Client name" value={doc.client.name} onChange={(e) => setClient({ name: e.target.value })} />
            <input className={styles.input} placeholder="Phone" value={doc.client.phone} onChange={(e) => setClient({ phone: e.target.value })} />
            <input className={styles.input} placeholder="Email" value={doc.client.email} onChange={(e) => setClient({ email: e.target.value })} />
            <input className={styles.input} placeholder="Address" value={doc.client.address} onChange={(e) => setClient({ address: e.target.value })} />
          </div>

          <div className={styles.sectionTitle}>Line items</div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Item</th>
                <th className={styles.th} style={{ width: 90 }}>Qty</th>
                <th className={styles.th} style={{ width: 120 }}>Rate</th>
                <th className={styles.th} style={{ width: 120 }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {doc.lineItems.map((li) => (
                <tr key={li.id}>
                  <td className={styles.td}>
                    <input className={styles.smallInput} value={li.name} onChange={(e) => setLineItem(li.id, { name: e.target.value })} />
                  </td>
                  <td className={styles.td}>
                    <input className={styles.smallInput} value={li.qty} onChange={(e) => setLineItem(li.id, { qty: e.target.value })} />
                  </td>
                  <td className={styles.td}>
                    <input className={styles.smallInput} value={li.rate} onChange={(e) => setLineItem(li.id, { rate: e.target.value })} />
                  </td>
                  <td className={styles.td}>${((Number(li.qty)||0) * (Number(li.rate)||0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.sectionTitle}>Total</div>
          <div style={{ fontSize: 18, fontWeight: 800 }}>${total.toFixed(2)}</div>

          <div className={styles.sectionTitle}>Notes</div>
          <textarea className={styles.textarea} value={doc.notes} onChange={(e) => setNotes(e.target.value)} />

          <div className={styles.sectionTitle}>Terms</div>
          <textarea className={styles.textarea} value={doc.terms} onChange={(e) => setTerms(e.target.value)} />
        </div>
      </div>
    </div>
  );
}
