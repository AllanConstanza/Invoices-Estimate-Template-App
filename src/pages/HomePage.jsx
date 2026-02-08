import styles from "./HomePage.module.css";
import { useNavigate } from "react-router-dom";


const mockTemplates = Array.from({ length: 15 }).map((_, i) => ({
    id: `${i + 1}`,
    title: `Template ${i + 1}`,
}));


export default function HomePage() {
    const onCreate = () => navigate("/templates");

    const navigate = useNavigate();


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

                <div className={styles.gridWrap}>
                    <div className={styles.grid}>
                        {mockTemplates.map((t) => (
                            <div key={t.id} className={styles.card}>
                                <div className={styles.preview} />
                                <p className={styles.cardTitle}>{t.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


