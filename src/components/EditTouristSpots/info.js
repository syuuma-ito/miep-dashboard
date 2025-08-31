"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import style from "./index.module.css";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

import { memo } from "react";

const Info = ({ info, setInfo }) => {
    const sortedInfo = [...info].sort((a, b) => a.display_order - b.display_order);

    const renumberDisplayOrder = (arr) => {
        return arr.map((item, idx) => ({ ...item, display_order: idx }));
    };

    const addInfo = () => {
        setInfo((prev) => {
            const maxOrder = prev.length > 0 ? Math.max(...prev.map((i) => i.display_order ?? 0)) : -1;
            const newArr = [...prev, { key: { ja: "", en: "", ko: "" }, value: { ja: "", en: "", ko: "" }, display_order: maxOrder + 1 }];
            return renumberDisplayOrder(newArr);
        });
    };

    const updateInfo = (idx, path, value) => {
        setInfo((prev) => {
            const sorted = [...prev].sort((a, b) => a.display_order - b.display_order);
            const newArr = sorted.map((it, i) => {
                if (i !== idx) return it;
                const copy = {
                    ...it,
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
            });
            return renumberDisplayOrder(newArr);
        });
    };

    const [pendingDelete, setPendingDelete] = useState(null);

    const removeInfo = (idx) => {
        setInfo((prev) => {
            const sorted = [...prev].sort((a, b) => a.display_order - b.display_order);
            const newArr = sorted.filter((_, i) => i !== idx);
            return renumberDisplayOrder(newArr);
        });
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
            {sortedInfo.map((item, idx) => (
                <div key={item.display_order}>
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
};

export default memo(Info);
