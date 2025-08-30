"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import style from "./index.module.css";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function ImageUrls({ imageUrls, setImageUrls }) {
    const addImage = () => setImageUrls((prev) => [...prev, ""]);
    const updateImage = (index, value) => setImageUrls((prev) => prev.map((v, i) => (i === index ? value : v)));
    const removeImage = (index) => setImageUrls((prev) => prev.filter((_, i) => i !== index));

    const [pendingDelete, setPendingDelete] = useState(null);
    const confirmRemove = () => {
        if (pendingDelete !== null) {
            removeImage(pendingDelete);
            setPendingDelete(null);
        }
    };

    return (
        <div className={style.container}>
            <h2>画像</h2>
            {imageUrls.map((url, idx) => (
                <div className={style.inputContainer} key={idx}>
                    <p>URL {idx + 1}</p>
                    <div className={style.imageInputRow}>
                        <Input placeholder="画像のURLを入力" value={url} onChange={(e) => updateImage(idx, e.target.value)} />
                        <Button onClick={() => setPendingDelete(idx)}>削除</Button>
                    </div>
                </div>
            ))}

            <div className={style.inputContainer}>
                <p />
                <div>
                    <Button onClick={addImage}>画像を追加</Button>
                </div>
            </div>
            <AlertDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => {
                    if (!open) setPendingDelete(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>画像URLを削除しますか？</AlertDialogTitle>
                        <AlertDialogDescription>この操作は元に戻せません。URL : {pendingDelete !== null ? imageUrls[pendingDelete] : ""}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPendingDelete(null)}>キャンセル</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmRemove}>削除する</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
