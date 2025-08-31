import { Input } from "@/components/ui/input";
import style from "./forms.module.css";

import ErrorMessage from "./error";

const IconUrl = ({ register, errors }) => {
    return (
        <div className={style.section}>
            <h2>アイコン</h2>
            <div className={style.inputContainer}>
                <div className={style.inputWithLabel}>
                    <label>URL</label>
                    <Input placeholder="アイコンのURLを入力" {...register("icon")} />
                </div>
                <ErrorMessage message={errors.icon?.message} className={style.errorMessage} />
            </div>
        </div>
    );
};

export default IconUrl;
