"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import ColorPicker from "../ColorPicker";
import style from "./EditTag.module.css";

const schema = z.object({
    id: z.uuid({ message: "無効なUUIDです" }).optional(),
    color: z
        .string()
        .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, {
            message: "カラーコードは#FF0000または#F00の形式で入力してください",
        })
        .transform((s) => s.toUpperCase()),
    name: z.object({
        ja: z
            .string()
            .nonempty({
                message: "タグ名(日本語)は必須です",
            })
            .max(50, { message: "タグ名(日本語)は50文字以内で入力してください" })
            .trim(),
        en: z
            .string()
            .nonempty({
                message: "タグ名(英語)は必須です",
            })
            .max(50, { message: "タグ名(英語)は50文字以内で入力してください" })
            .trim(),
        ko: z
            .string()
            .nonempty({
                message: "タグ名(韓国語)は必須です",
            })
            .max(50, { message: "タグ名(韓国語)は50文字以内で入力してください" })
            .trim(),
    }),
});

const ErrorMessage = ({ message, className }) =>
    message ? (
        <p className={className} style={{ color: "red" }}>
            {message}
        </p>
    ) : null;

export default function EditTag({ tag, onSave, isEditing, onCancel, onDelete, className }) {
    const {
        register,
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            color: "#FFFFFF",
            name: { ja: "", en: "", ko: "" },
        },
    });

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [validatedData, setValidatedData] = useState(null);

    useEffect(() => {
        if (tag) {
            reset(tag);
        }
    }, [tag, reset]);

    const saveHandler = handleSubmit((data) => {
        setValidatedData(data);
        setConfirmOpen(true);
    });

    const deleteHandler = handleSubmit((data) => {
        setValidatedData(data);
        setDeleteConfirmOpen(true);
    });

    const performSave = () => {
        if (onSave && validatedData) {
            onSave(validatedData);
        }
        setConfirmOpen(false);
        setValidatedData(null);
    };

    const performDelete = () => {
        if (onDelete && validatedData) {
            onDelete(validatedData);
        }
        setDeleteConfirmOpen(false);
        setValidatedData(null);
    };

    return (
        <>
            <Card className={`${style.card} ${className}`}>
                <CardHeader>
                    <CardTitle>{isEditing ? "タグの編集" : "タグの作成"}</CardTitle>
                    <CardDescription className="sr-only">{isEditing ? "タグの編集を行います。" : "新しいタグを作成します。"}</CardDescription>
                    <CardAction>
                        {isEditing && (
                            <Button variant="destructive" onClick={deleteHandler}>
                                削除
                            </Button>
                        )}
                    </CardAction>
                </CardHeader>

                <CardContent>
                    <form className={style.form}>
                        <div className={style.formGroup}>
                            <label>タグの色</label>
                            <Controller name="color" control={control} render={({ field }) => <ColorPicker color={field.value} onChange={field.onChange} />} />
                        </div>
                        <ErrorMessage message={errors.color?.message} className={style.errorMessage} />

                        <div className={style.formGroup}>
                            <label>タグ名 (日本語)</label>
                            <Input {...register("name.ja")} maxLength={50} />
                        </div>
                        <ErrorMessage message={errors.name?.ja?.message} className={style.errorMessage} />
                        <div className={style.formGroup}>
                            <label>タグ名 (英語)</label>
                            <Input {...register("name.en")} maxLength={50} />
                        </div>
                        <ErrorMessage message={errors.name?.en?.message} className={style.errorMessage} />
                        <div className={style.formGroup}>
                            <label>タグ名 (韓国語)</label>
                            <Input {...register("name.ko")} maxLength={50} />
                        </div>
                        <ErrorMessage message={errors.name?.ko?.message} className={style.errorMessage} />
                    </form>
                </CardContent>
                <CardFooter className={style.cardFooter}>
                    <Button variant="outline" onClick={onCancel}>
                        キャンセル
                    </Button>
                    <Button type="submit" onClick={saveHandler}>
                        {isEditing ? "保存" : "作成"}
                    </Button>
                </CardFooter>
            </Card>

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{isEditing ? "変更を保存してもいいですか？" : "タグを新規作成してもいいですか？"}</AlertDialogTitle>
                        <AlertDialogDescription>保存されるとすぐに反映されます。</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <AlertDialogAction onClick={performSave}>{isEditing ? "保存" : "作成"}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                        <AlertDialogDescription>削除すると元に戻せません。</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <Button variant="destructive" onClick={performDelete}>
                            削除
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
