"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import style from "./index.module.css";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function Info({ info, setInfo }) {
    const addInfo = () => setInfo((prev) => [...prev, { key: { ja: "", en: "", ko: "" }, value: { ja: "", en: "", ko: "" } }]);

    const updateInfo = (idx, path, value) => {
        setInfo((prev) =>
            prev.map((it, i) => {
                if (i !== idx) return it;
                const copy = {
                    key: { ...it.key },
                    value: { ...it.value },
                };
                const parts = path.split(".");
                if (parts.length === 2) {
                    const [top, sub] = parts;
                    if (top in copy && sub) {
                        copy[top] = { ...copy[top], [sub]: value };
                    }
                }
                return copy;
            })
        );
    };

    const [pendingDelete, setPendingDelete] = useState(null);

    const removeInfo = (idx) => {
        setInfo((prev) => prev.filter((_, i) => i !== idx));
    };
    const confirmRemove = () => {
        if (pendingDelete !== null) {
            removeInfo(pendingDelete);
            setPendingDelete(null);
        }
    };

    return (
        <div className={style.container}>
            <h2>詳細情報</h2>
            {info.map((item, idx) => (
                <div key={idx}>
                    <div className={style.inputHeader}>
                        <h3>詳細情報 {idx + 1}</h3>
                        <Button onClick={() => setPendingDelete(idx)}>削除</Button>
                    </div>
                    <div className={style.inputContainer}>
                        <p>日本語</p>
                        <div className={style.imageInputRow}>
                            <Input placeholder="ラベル" value={item.key.ja} onChange={(e) => updateInfo(idx, "key.ja", e.target.value)} />
                            <Input placeholder="内容" value={item.value.ja} onChange={(e) => updateInfo(idx, "value.ja", e.target.value)} />
                        </div>
                    </div>
                    <div className={style.inputContainer}>
                        <p>英語</p>
                        <div className={style.imageInputRow}>
                            <Input placeholder="ラベル" value={item.key.en} onChange={(e) => updateInfo(idx, "key.en", e.target.value)} />
                            <Input placeholder="内容" value={item.value.en} onChange={(e) => updateInfo(idx, "value.en", e.target.value)} />
                        </div>
                    </div>
                    <div className={style.inputContainer}>
                        <p>韓国語</p>
                        <div className={style.imageInputRow}>
                            <Input placeholder="ラベル" value={item.key.ko} onChange={(e) => updateInfo(idx, "key.ko", e.target.value)} />
                            <Input placeholder="内容" value={item.value.ko} onChange={(e) => updateInfo(idx, "value.ko", e.target.value)} />
                        </div>
                    </div>
                    <hr />
                </div>
            ))}

            <div className={style.inputContainer}>
                <p />
                <div>
                    <Button onClick={addInfo}>フィールドを追加</Button>
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
}
