import { Input } from "@/components/ui/input";
import style from "./forms.module.css";

import ErrorMessage from "./error";

const SpotsName = ({ register, errors }) => {
    return (
        <div className={style.section}>
            <h2>観光地名</h2>
            <div className={style.inputContainer}>
                <div className={style.inputWithLabel}>
                    <label>日本語</label>
                    <Input placeholder="観光地名を入力" {...register("name.ja")} />
                </div>
                <ErrorMessage message={errors.name?.ja?.message} className={style.errorMessage} />
            </div>
            <div className={style.inputContainer}>
                <div className={style.inputWithLabel}>
                    <label>英語</label>
                    <Input placeholder="観光地名を入力" {...register("name.en")} />
                </div>
                <ErrorMessage message={errors.name?.en?.message} className={style.errorMessage} />
            </div>
            <div className={style.inputContainer}>
                <div className={style.inputWithLabel}>
                    <label>韓国語</label>
                    <Input placeholder="観光地名を入力" {...register("name.ko")} />
                </div>
                <ErrorMessage message={errors.name?.ko?.message} className={style.errorMessage} />
            </div>
        </div>
    );
};

export default SpotsName;
