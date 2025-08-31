import { Textarea } from "@/components/ui/textarea";
import style from "./index.module.css";

import { memo } from "react";

const RecommendedFor = ({ recommendedFor_jp, recommendedFor_en, recommendedFor_ko, setRecommendedFor_jp, setRecommendedFor_en, setRecommendedFor_ko }) => {
    return (
        <div className={style.container}>
            <h2>こんな人におすすめ！！</h2>
            <div className={style.inputContainer}>
                <p>日本語</p>
                <Textarea value={recommendedFor_jp} onChange={(e) => setRecommendedFor_jp(e.target.value)} />
            </div>
            <div className={style.inputContainer}>
                <p>英語</p>
                <Textarea value={recommendedFor_en} onChange={(e) => setRecommendedFor_en(e.target.value)} />
            </div>
            <div className={style.inputContainer}>
                <p>韓国語</p>
                <Textarea value={recommendedFor_ko} onChange={(e) => setRecommendedFor_ko(e.target.value)} />
            </div>
        </div>
    );
};

export default memo(RecommendedFor);
