import Loading from "@/components/Loading";
import styles from "./loading.module.css";

import { memo } from "react";

const LoadingOverlay = function LoadingOverlay({ loading }) {
    return (
        <div className={`${styles.loadingOverlay} ${loading ? "" : styles.loadingFadeOut}`}>
            <Loading />
            <div>ロード中...</div>
            <img src="/image/logo-full.png" alt="ロゴ" className={styles.loadingLogo} />
        </div>
    );
};

export default memo(LoadingOverlay);
