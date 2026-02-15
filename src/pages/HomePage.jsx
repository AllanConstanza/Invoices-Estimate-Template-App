import styles from "./HomePage.module.css";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listDocs } from "../data/docsStore";

export default function HomePage() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    const docs = listDocs();
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return docs;
        return docs.filter((d) => (d.title || "").toLowerCase().includes(q));
    }, [query, docs]);

    const onCreate = () => navigate("/templates");

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.titleWrap}>
                    <h1 className={styles.title}>Free Invoices + Estimates Templates</h1>
                </div>

                <div className={styles.createWrap}>
                    <button className={styles.createBtn} onClick={onCreate} aria-label="Create new">
                        +
                    </button>
                </div>

                <div className={styles.searchWrap}>
                    <input
                        className={styles.search}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search your docs by title…"
                    />
                </div>

                <div className={styles.gridWrap}>
                    <div className={styles.grid}>
                        {filtered.map((d) => (
                            <div
                                key={d.id}
                                className={styles.card}
                                onClick={() => navigate(`/editor/${d.id}`)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") navigate(`/editor/${d.id}`);
                                }}
                            >
                                <div className={styles.preview} />
                                <div>
                                    <p className={styles.cardTitle}>{d.title || "Untitled"}</p>
                                    <div className={styles.metaRow}>
                                        <span>{d.industry?.replaceAll("-", " ")}</span>
                                        <span>{new Date(d.lastEditedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filtered.length === 0 && (
                            <div style={{ color: "#666" }}>
                                No docs found{query ? ` for “${query}”` : ""}.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
