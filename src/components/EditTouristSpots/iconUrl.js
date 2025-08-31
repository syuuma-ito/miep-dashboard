import { Input } from "@/components/ui/input";
import { memo } from "react";
import style from "./index.module.css";

const IconUrl = ({ iconUrl, setIconUrl }) => {
    return (
        <div className={style.container}>
            <h2>アイコン</h2>
            <div className={style.inputContainer}>
                <p>URL</p>
                <Input placeholder="アイコンのURLを入力" value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} />
            </div>
        </div>
    );
};

export default memo(IconUrl);
