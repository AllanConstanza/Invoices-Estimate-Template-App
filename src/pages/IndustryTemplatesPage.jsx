// src/pages/IndustryTemplatesPage.jsx
import { useNavigate, useParams } from "react-router-dom";
import styles from "./IndustryTemplatesPage.module.css";
import { createDocFromTemplate } from "../data/docsStore";
import { getTemplatesByIndustry } from "../data/templates";

const INDUSTRY_LABELS = {
  "construction": "Construction",
  "house-cleaning": "House Cleaning",
  "painting": "Painting",
  "pest-control": "Pest Control",
};

export default function IndustryTemplatesPage() {
  const navigate = useNavigate();
  const { industry } = useParams();

  const industryName = INDUSTRY_LABELS[industry] ?? industry;
  const templates = getTemplatesByIndustry(industry);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>{industryName} templates</h1>
            <p className={styles.subtitle}>
              {templates.length ? "Pick a starting point." : "Coming soon."}
            </p>
          </div>

          <button className={styles.back} onClick={() => navigate("/templates")}>
            ← Back
          </button>
        </div>

        <div className={styles.grid}>
          {templates.map((t) => (
            <div
              key={t.id}
              className={styles.card}
              onClick={() => {
                const doc = createDocFromTemplate({
                  industry,
                  templateId: t.id,
                  language: "en",
                });
                navigate(`/editor/${doc.id}`);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const doc = createDocFromTemplate({ industry, templateId: t.id, language: "en" });
                  navigate(`/editor/${doc.id}`);
                }
              }}
            >
              <div className={styles.preview} />
              <div>
                <div className={styles.cardTitle}>{t.name.en}</div>
                <p className={styles.cardDesc}>{t.description.en}</p>
              </div>
            </div>
          ))}
        </div>

        {!templates.length && (
          <div style={{ marginTop: 18, color: "#666" }}>
            No templates here yet.
          </div>
        )}
      </div>
    </div>
  );
}
