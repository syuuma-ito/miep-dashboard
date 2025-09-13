import FileGridView from "@/components/FileGridView";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import style from "./forms.module.css";

import ErrorMessage from "./error";

const IconUrl = ({ register, errors, setValue }) => {
    const [isFilePickerOpen, setIsFilePickerOpen] = useState(false);

    const handleFileSelect = (file) => {
        if (file && file.absoluteUrl) {
            setValue("icon", file.absoluteUrl, { shouldDirty: true, shouldValidate: true });
        }
        setIsFilePickerOpen(false);
    };

    return (
        <div className={style.section}>
            <h2>アイコン</h2>
            <div className={style.inputContainer}>
                <div className={style.inputWithLabel}>
                    <label>URL</label>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", width: "100%" }}>
                        <Input placeholder="アイコンのURLを入力" {...register("icon")} className="flex-1" />
                        <Button type="button" variant="outline" size="sm" onClick={() => setIsFilePickerOpen(true)}>
                            画像を選択
                        </Button>
                    </div>
                </div>
                <ErrorMessage message={errors.icon?.message} className={style.errorMessage} />
            </div>
            <FileGridView onFileSelect={handleFileSelect} isOpen={isFilePickerOpen} setOpen={setIsFilePickerOpen} />
        </div>
    );
};

export default IconUrl;
