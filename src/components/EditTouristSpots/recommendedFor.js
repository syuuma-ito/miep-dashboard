import { Textarea } from "@/components/ui/textarea";
import style from "./forms.module.css";

import ErrorMessage from "./error";

const RecommendedFor = ({ control, errors }) => {
    return (
        <div className={style.section}>
            <h2>こんな人におすすめ！！</h2>
            <div className={style.inputContainer}>
                <div className={style.inputWithLabel}>
                    <label>日本語</label>
                    <Textarea {...control.register("recommended_for.ja")} />
                </div>
                <ErrorMessage message={errors?.recommended_for?.ja?.message} className={style.errorMessage} />
            </div>
            <div className={style.inputContainer}>
                <div className={style.inputWithLabel}>
                    <label>英語</label>
                    <Textarea {...control.register("recommended_for.en")} />
                </div>
                <ErrorMessage message={errors?.recommended_for?.en?.message} className={style.errorMessage} />
            </div>
            <div className={style.inputContainer}>
                <div className={style.inputWithLabel}>
                    <label>韓国語</label>
                    <Textarea {...control.register("recommended_for.ko")} />
                </div>
                <ErrorMessage message={errors?.recommended_for?.ko?.message} className={style.errorMessage} />
            </div>
        </div>
    );
};

export default RecommendedFor;
