// src/pages/TemplatesPage.jsx
import { useNavigate } from "react-router-dom";
import styles from "./TemplatesPage.module.css";
import { INDUSTRIES } from "../data/templates";

export default function TemplatesPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Choose an industry</h1>
            <p className={styles.subtitle}>Start with a template and customize it like a doc.</p>
          </div>

          <button className={styles.back} onClick={() => navigate("/home")}>
            ← Back
          </button>
        </div>

        <div className={styles.grid}>
          {INDUSTRIES.map((ind) => (
            <div
              key={ind.slug}
              className={styles.card}
              onClick={() => navigate(`/templates/${ind.slug}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate(`/templates/${ind.slug}`)}
            >
              <div className={styles.cardTop}>
                <span className={styles.badge}>Templates</span>
              </div>

              <div>
                <div className={styles.cardTitle}>{ind.name}</div>
                <p className={styles.cardDesc}>
                  {ind.slug === "construction"
                    ? "Estimates + invoices ready to use."
                    : "Coming soon."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
