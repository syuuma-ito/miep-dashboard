import { Textarea } from "@/components/ui/textarea";
import ErrorMessage from "./error";
import style from "./forms.module.css";

const Description = ({ control, errors }) => {
    return (
        <div className={style.section}>
            <h2>詳細</h2>
            <div className={style.inputContainer}>
                <div className={style.inputWithLabel}>
                    <label>日本語</label>
                    <Textarea {...control.register("description.ja")} required />
                </div>
                <ErrorMessage message={errors?.description?.ja?.message} className={style.errorMessage} />
            </div>
            <div className={style.inputContainer}>
                <div className={style.inputWithLabel}>
                    <label>英語</label>
                    <Textarea {...control.register("description.en")} required />
                </div>
                <ErrorMessage message={errors?.description?.en?.message} className={style.errorMessage} />
            </div>
            <div className={style.inputContainer}>
                <div className={style.inputWithLabel}>
                    <label>韓国語</label>
                    <Textarea {...control.register("description.ko")} required />
                </div>
                <ErrorMessage message={errors?.description?.ko?.message} className={style.errorMessage} />
            </div>
        </div>
    );
};

export default Description;
