"use client";

import FileGridView from "@/components/FileGridView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import ErrorMessage from "./error";
import style from "./forms.module.css";

const ImageUrls = ({ control, register, errors, setValue }) => {
    const { fields, append, remove } = useFieldArray({ control, name: "images" });
    const [isFilePickerOpen, setIsFilePickerOpen] = useState(false);
    const [currentFieldIndex, setCurrentFieldIndex] = useState(null);

    const handleFileSelect = (file) => {
        if (file && file.absoluteUrl && currentFieldIndex !== null) {
            setValue(`images.${currentFieldIndex}`, file.absoluteUrl, { shouldDirty: true, shouldValidate: true });
        }
        setIsFilePickerOpen(false);
        setCurrentFieldIndex(null);
    };

    const openFilePicker = (index) => {
        setCurrentFieldIndex(index);
        setIsFilePickerOpen(true);
    };

    return (
        <div className={style.section}>
            <h2>画像</h2>
            {fields.map((field, index) => (
                <div className={style.inputContainer} key={field.id}>
                    <div className={style.inputWithLabel}>
                        <label>URL {index + 1}</label>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <Input placeholder="画像のURLを入力" {...register(`images.${index}`)} />
                            <Button type="button" variant="outline" size="sm" onClick={() => openFilePicker(index)}>
                                画像を選択
                            </Button>
                            <Button type="button" onClick={() => remove(index)} variant="destructive" size="sm">
                                削除
                            </Button>
                        </div>
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

            <FileGridView onFileSelect={handleFileSelect} isOpen={isFilePickerOpen} setOpen={setIsFilePickerOpen} />
        </div>
    );
};

export default ImageUrls;
