"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFieldArray } from "react-hook-form";
import ErrorMessage from "./error";
import style from "./forms.module.css";

const ImageUrls = ({ control, register, errors }) => {
    const { fields, append, remove } = useFieldArray({ control, name: "images" });

    return (
        <div className={style.section}>
            <h2>画像</h2>
            {fields.map((field, index) => (
                <div className={style.inputContainer} key={field.id}>
                    <div className={style.inputWithLabel}>
                        <label>URL {index + 1}</label>
                        <Input placeholder="画像のURLを入力" {...register(`images.${index}`)} />
                        <Button type="button" onClick={() => remove(index)} variant="destructive">
                            削除
                        </Button>
                    </div>
                    <ErrorMessage message={errors.images?.[index]?.message} className={style.errorMessage} />
                </div>
            ))}

            <ErrorMessage message={errors.images?.root?.message || errors.images?.message} className={style.errorMessage} />

            <div className={style.addButton}>
                <Button type="button" onClick={() => append("")}>
                    画像を追加
                </Button>
            </div>
        </div>
    );
};

export default ImageUrls;
