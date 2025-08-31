import { Textarea } from "@/components/ui/textarea";
import { memo } from "react";
import style from "./index.module.css";

const Description = ({ description_ja, description_en, description_ko, setDescription_ja, setDescription_en, setDescription_ko }) => {
    return (
        <div className={style.container}>
            <h2>説明文</h2>
            <div className={style.inputContainer}>
                <p>日本語</p>
                <Textarea value={description_ja} onChange={(e) => setDescription_ja(e.target.value)} />
            </div>
            <div className={style.inputContainer}>
                <p>英語</p>
                <Textarea value={description_en} onChange={(e) => setDescription_en(e.target.value)} />
            </div>
            <div className={style.inputContainer}>
                <p>韓国語</p>
                <Textarea value={description_ko} onChange={(e) => setDescription_ko(e.target.value)} />
            </div>
        </div>
    );
};

export default memo(Description);
