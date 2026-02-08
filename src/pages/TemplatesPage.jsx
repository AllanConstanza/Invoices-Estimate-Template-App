import { useNavigate } from "react-router-dom";
import styles from "./TemplatesPage.module.css";

const industries = [
  {
    slug: "construction",
    name: "Construction",
    desc: "Estimates, change orders, labor/material breakdowns.",
  },
  {
    slug: "house-cleaning",
    name: "House Cleaning",
    desc: "Recurring services, add-ons, room-based pricing.",
  },
  {
    slug: "painting",
    name: "Painting",
    desc: "Prep + paint scope, coats, areas, supplies.",
  },
  {
    slug: "pest-control",
    name: "Pest Control",
    desc: "Treatment plans, follow-ups, service intervals.",
  },
];

export default function TemplatesPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Choose an industry</h1>
            <p className={styles.subtitle}>
              Start with a template and customize it like a doc.
            </p>
          </div>

          <button className={styles.back} onClick={() => navigate("/home")}>
            ← Back
          </button>
        </div>

        <div className={styles.grid}>
          {industries.map((ind) => (
            <div
              key={ind.slug}
              className={styles.card}
              onClick={() => navigate(`/templates/${ind.slug}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") navigate(`/templates/${ind.slug}`);
              }}
            >
              <div className={styles.cardTop}>
                <span className={styles.badge}>Templates</span>
              </div>

              <div>
                <div className={styles.cardTitle}>{ind.name}</div>
                <p className={styles.cardDesc}>{ind.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
