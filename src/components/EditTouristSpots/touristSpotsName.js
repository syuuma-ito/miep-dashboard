import { Input } from "@/components/ui/input";
import style from "./index.module.css";

import { memo } from "react";

const TouristSpotsName = ({ name_ja, name_en, name_ko, setName_ja, setName_en, setName_ko }) => {
    return (
        <div className={style.container}>
            <h2>観光地名</h2>
            <div className={style.inputContainer}>
                <p>日本語</p>
                <Input placeholder="観光地名を入力" value={name_ja} onChange={(e) => setName_ja(e.target.value)} />
            </div>
            <div className={style.inputContainer}>
                <p>英語</p>
                <Input placeholder="観光地名を入力" value={name_en} onChange={(e) => setName_en(e.target.value)} />
            </div>
            <div className={style.inputContainer}>
                <p>韓国語</p>
                <Input placeholder="観光地名を入力" value={name_ko} onChange={(e) => setName_ko(e.target.value)} />
            </div>
        </div>
    );
};

export default memo(TouristSpotsName);
