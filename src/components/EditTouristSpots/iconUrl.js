import { Input } from "@/components/ui/input";
import style from "./index.module.css";

export default function IconUrl({ iconUrl, setIconUrl }) {
    return (
        <div className={style.container}>
            <h2>アイコン</h2>
            <div className={style.inputContainer}>
                <p>URL</p>
                <Input placeholder="アイコンのURLを入力" value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} />
            </div>
        </div>
    );
}
