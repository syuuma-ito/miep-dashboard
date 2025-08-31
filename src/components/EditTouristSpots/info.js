"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import ErrorMessage from "./error";
import style from "./forms.module.css";

const Info = ({ control, register, errors, name = "info" }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });

    const [pendingDelete, setPendingDelete] = useState(null);

    const addNewInfoField = () => {
        append({
            key: { ja: "", en: "", ko: "" },
            value: { ja: "", en: "", ko: "" },
            display_order: fields.length,
        });
    };

    const confirmRemove = () => {
        if (pendingDelete !== null) {
            remove(pendingDelete);
            setPendingDelete(null);
        }
    };

    const infoErrors = errors?.[name];

    return (
        <div className={style.section}>
            <h2>詳細情報</h2>
            {fields.map((field, index) => (
                <div key={field.id}>
                    <div className={style.inputHeader}>
                        <h3>詳細情報 {index + 1}</h3>
                        <Button type="button" variant="destructive" onClick={() => setPendingDelete(index)}>
                            削除
                        </Button>
                    </div>

                    <div className={style.inputContainer}>
                        <div className={style.inputWithLabel}>
                            <label>日本語</label>
                            <div style={{ flex: 1 }}>
                                <Input placeholder="ラベル" {...register(`${name}.${index}.key.ja`)} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <Input placeholder="内容" {...register(`${name}.${index}.value.ja`)} />
                            </div>
                        </div>
                        <ErrorMessage message={infoErrors?.[index]?.key?.ja?.message} className={style.errorMessage} />
                        <ErrorMessage message={infoErrors?.[index]?.value?.ja?.message} className={style.errorMessage} />
                    </div>

                    <div className={style.inputContainer}>
                        <div className={style.inputWithLabel}>
                            <label>英語</label>
                            <div style={{ flex: 1 }}>
                                <Input placeholder="ラベル" {...register(`${name}.${index}.key.en`)} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <Input placeholder="内容" {...register(`${name}.${index}.value.en`)} />
                            </div>
                        </div>
                        <ErrorMessage message={infoErrors?.[index]?.key?.en?.message} className={style.errorMessage} />
                        <ErrorMessage message={infoErrors?.[index]?.value?.en?.message} className={style.errorMessage} />
                    </div>

                    <div className={style.inputContainer}>
                        <div className={style.inputWithLabel}>
                            <label>韓国語</label>
                            <div style={{ flex: 1 }}>
                                <Input placeholder="ラベル" {...register(`${name}.${index}.key.ko`)} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <Input placeholder="内容" {...register(`${name}.${index}.value.ko`)} />
                            </div>
                        </div>
                    </div>
                    <ErrorMessage message={infoErrors?.[index]?.key?.ko?.message} className={style.errorMessage} />
                    <ErrorMessage message={infoErrors?.[index]?.value?.ko?.message} className={style.errorMessage} />
                    <hr />
                </div>
            ))}

            <div className={style.addButton}>
                <Button type="button" onClick={addNewInfoField}>
                    フィールドを追加
                </Button>
            </div>

            <AlertDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => {
                    if (!open) setPendingDelete(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>フィールドを削除しますか？</AlertDialogTitle>
                        <AlertDialogDescription>この操作は元に戻せません。</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPendingDelete(null)}>キャンセル</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmRemove}>削除する</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Info;
