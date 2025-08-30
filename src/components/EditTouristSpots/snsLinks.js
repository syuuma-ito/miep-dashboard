"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { TbWorld } from "react-icons/tb";
import style from "./index.module.css";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const platforms = ["website", "x", "instagram", "facebook", "youtube"];

export default function SnsLinks({ snsLinks, setSnsLinks }) {
    const addLink = () => setSnsLinks((prev) => [...prev, { platform: "", url: "" }]);
    const updateLink = (index, field, value) => setSnsLinks((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
    const removeLink = (index) => setSnsLinks((prev) => prev.filter((_, i) => i !== index));

    const [pendingDelete, setPendingDelete] = useState(null);
    const confirmRemove = () => {
        if (pendingDelete !== null) {
            removeLink(pendingDelete);
            setPendingDelete(null);
        }
    };

    return (
        <div className={style.container}>
            <h2>SNSリンク</h2>
            {snsLinks.map((item, idx) => (
                <div className={style.inputContainer} key={idx}>
                    <p>リンク{idx + 1}</p>
                    <div className={style.imageInputRow} style={{ alignItems: "center" }}>
                        <div style={{ width: 180 }}>
                            <Select value={item.platform} onValueChange={(val) => updateLink(idx, "platform", val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="" />
                                </SelectTrigger>
                                <SelectContent>
                                    {platforms.map((p) => (
                                        <SelectItem value={p} key={p}>
                                            {p}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className={style.icon}>
                            {item.platform === "x" && <FaXTwitter />}
                            {item.platform === "instagram" && <FaInstagram />}
                            {item.platform === "facebook" && <FaFacebook />}
                            {item.platform === "youtube" && <FaYoutube />}
                            {item.platform === "website" && <TbWorld />}
                        </div>

                        <Input placeholder="URLを入力" value={item.url} onChange={(e) => updateLink(idx, "url", e.target.value)} />

                        <Button onClick={() => setPendingDelete(idx)}>削除</Button>
                    </div>
                </div>
            ))}

            <div className={style.inputContainer}>
                <p />
                <div>
                    <Button onClick={addLink}>リンクを追加</Button>
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
                        <AlertDialogTitle>SNSリンクを削除しますか？</AlertDialogTitle>
                        <AlertDialogDescription>この操作は元に戻せません。URL : {pendingDelete !== null ? snsLinks[pendingDelete]?.url : ""}</AlertDialogDescription>
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
