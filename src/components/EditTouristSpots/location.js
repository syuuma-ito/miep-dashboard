import { Input } from "@/components/ui/input";
import style from "./forms.module.css";

import ErrorMessage from "./error";

const Location = ({ register, errors }) => {
    return (
        <div className={style.section}>
            <h2>緯度・経度</h2>
            <div className={style.inputContainer}>
                <div className={style.inputWithLabel}>
                    <label>緯度</label>
                    <Input type="number" {...register("latitude")} />
                </div>
                <ErrorMessage message={errors.latitude?.message} className={style.errorMessage} />
            </div>
            <div className={style.inputContainer}>
                <div className={style.inputWithLabel}>
                    <label>経度</label>
                    <Input type="number" {...register("longitude")} />
                </div>
                <ErrorMessage message={errors.longitude?.message} className={style.errorMessage} />
            </div>
        </div>
    );
};

export default Location;
