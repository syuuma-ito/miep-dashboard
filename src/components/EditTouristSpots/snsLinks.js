"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { TbWorld } from "react-icons/tb";
import ErrorMessage from "./error";
import style from "./forms.module.css";

const platforms = ["website", "x", "instagram", "facebook", "youtube", "twitter"];

const SnsLinks = ({ control, register, errors, name = "sns_links" }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });

    const [pendingDelete, setPendingDelete] = useState(null);

    const addLink = () => {
        append({ platform: "", url: "" });
    };

    const confirmRemove = () => {
        if (pendingDelete !== null) {
            remove(pendingDelete);
            setPendingDelete(null);
        }
    };

    const snsErrors = errors?.[name];

    return (
        <div className={style.section}>
            <h2>SNSリンク</h2>
            {fields.map((field, index) => {
                return (
                    <div className={style.inputContainer} key={field.id}>
                        <div className={style.inputWithLabel}>
                            <div style={{ width: "8rem" }}>
                                <Controller
                                    control={control}
                                    name={`${name}.${index}.platform`}
                                    render={({ field: controllerField }) => (
                                        <>
                                            <Select value={controllerField.value} onValueChange={controllerField.onChange}>
                                                <SelectTrigger style={{ width: "90%" }}>
                                                    <SelectValue placeholder="選択..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {platforms.map((p) => (
                                                        <SelectItem value={p} key={p}>
                                                            {p}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <ErrorMessage message={snsErrors?.[index]?.platform?.message} />
                                        </>
                                    )}
                                />
                            </div>

                            <div className={style.icon}>
                                {field.platform === "x" && <FaXTwitter />}
                                {field.platform === "instagram" && <FaInstagram />}
                                {field.platform === "facebook" && <FaFacebook />}
                                {field.platform === "youtube" && <FaYoutube />}
                                {field.platform === "twitter" && <FaXTwitter />}
                                {field.platform === "website" && <TbWorld />}
                            </div>

                            <div style={{ flex: 1 }}>
                                <Input placeholder="URLを入力" {...register(`${name}.${index}.url`)} />
                                <ErrorMessage message={snsErrors?.[index]?.url?.message} />
                            </div>

                            <Button type="button" onClick={() => setPendingDelete(index)} variant="destructive">
                                削除
                            </Button>
                        </div>
                    </div>
                );
            })}

            <div className={style.addButton}>
                <Button type="button" onClick={addLink}>
                    リンクを追加
                </Button>
            </div>

            <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>SNSリンクを削除しますか？</AlertDialogTitle>
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

export default SnsLinks;
