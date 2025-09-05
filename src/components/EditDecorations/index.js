"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import style from "./index.module.css";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const textSchema = z.object({
    ja: z.string().max(100, { message: "テキストは100文字以内で入力してください" }).trim().min(1, { message: "テキスト(日本語)は必須です" }),
    en: z.string().max(100, { message: "テキストは100文字以内で入力してください" }).trim().optional(),
    ko: z.string().max(100, { message: "テキストは100文字以内で入力してください" }).trim().optional(),
});

const imageTypeOptionSchema = z.object({
    src: z.url({ message: "画像URLは有効なURL形式で入力してください" }).min(1, { message: "画像URLは必須です" }),
    size: z.coerce
        .number()
        .min(0.01, {
            message: "サイズは0.01以上の数値で入力してください",
        })
        .max(100, { message: "サイズは100以下の数値で入力してください" }),
});

const speechBubble1TypeOptionSchema = z.object({
    text: textSchema,
    arrowPosition: z.enum(["left", "right", "center"], { message: "矢印の位置を選択してください" }),
    size: z.coerce
        .number()
        .min(0.01, {
            message: "サイズは0.01以上の数値で入力してください",
        })
        .max(100, { message: "サイズは100以下の数値で入力してください" }),
});

const speechBubble2TypeOptionSchema = z.object({
    text: textSchema,
    size: z.coerce
        .number()
        .min(0.01, {
            message: "サイズは0.01以上の数値で入力してください",
        })
        .max(100, { message: "サイズは100以下の数値で入力してください" }),
});

const maskingTapeTypeOptionSchema = z.object({
    text: textSchema,
    size: z.coerce
        .number()
        .min(0.01, {
            message: "サイズは0.01以上の数値で入力してください",
        })
        .max(100, { message: "サイズは100以下の数値で入力してください" }),
});

const schema = z
    .object({
        id: z.uuid({ message: "無効なUUIDです" }).optional(),
        latitude: z.coerce
            .number({
                required_error: "緯度は必須です",
                invalid_type_error: "緯度は数値で入力してください",
            })
            .min(-90, { message: "緯度は-90以上で入力してください" })
            .max(90, { message: "緯度は90以下で入力してください" }),
        longitude: z.coerce
            .number({
                required_error: "経度は必須です",
                invalid_type_error: "経度は数値で入力してください",
            })
            .min(-180, { message: "経度は-180以上で入力してください" })
            .max(180, { message: "経度は180以下で入力してください" }),

        type: z.enum(["SpeechBubble1", "SpeechBubble2", "Image", "MaskingTape"], { message: "タイプを選択してください" }),

        options: z.any(),
    })
    .superRefine((data, ctx) => {
        if (!data.type) return;

        let validationResult;

        switch (data.type) {
            case "Image":
                validationResult = imageTypeOptionSchema.safeParse(data.options);
                break;
            case "SpeechBubble1":
                validationResult = speechBubble1TypeOptionSchema.safeParse(data.options);
                break;
            case "SpeechBubble2":
                validationResult = speechBubble2TypeOptionSchema.safeParse(data.options);
                break;
            case "MaskingTape":
                validationResult = maskingTapeTypeOptionSchema.safeParse(data.options);
                break;
            default:
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "無効なタイプです",
                    path: ["type"],
                });
                return;
        }

        if (!validationResult.success) {
            validationResult.error.issues.forEach((issue) => {
                ctx.addIssue({
                    ...issue,
                    path: ["options", ...issue.path],
                });
            });
        }
    });

const decorationTypes = [
    { value: "SpeechBubble1", label: "吹き出し1" },
    { value: "SpeechBubble2", label: "吹き出し2" },
    { value: "MaskingTape", label: "マスキングテープ" },
    { value: "Image", label: "画像" },
];

const arrowPositionOptions = [
    { value: "left", label: "左" },
    { value: "center", label: "中央" },
    { value: "right", label: "右" },
];

const ErrorMessage = ({ message, className }) =>
    message ? (
        <div className={className} style={{ color: "red" }}>
            {message}
        </div>
    ) : null;

export default function EditDecorations({ mapDecoration, onSave, onPreview, onDelete, className, isEdit, onCancel }) {
    const {
        register,
        control,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            latitude: 35,
            longitude: 135,
            type: "",
            options: {
                size: 1,
            },
        },
    });
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [validatedData, setValidatedData] = useState(null);

    const watchedType = watch("type");

    useEffect(() => {
        if (mapDecoration) {
            reset(mapDecoration);
        } else {
            reset({
                latitude: 35,
                longitude: 135,
                type: "",
                options: {
                    size: 1,
                },
            });
        }
    }, [mapDecoration, reset]);

    // タイプが変更された時にoptionsフィールドをリセット
    useEffect(() => {
        if (watchedType && !mapDecoration) {
            setValue("options", {
                size: 1,
            });
        }
    }, [watchedType, setValue, mapDecoration]);

    const saveHandler = handleSubmit((data) => {
        setValidatedData(data);
        setConfirmOpen(true);
    });

    const deleteHandler = handleSubmit((data) => {
        setValidatedData(data);
        setDeleteConfirmOpen(true);
    });

    const previewHandler = handleSubmit((data) => {
        if (onPreview) onPreview(data);
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
        <div className={`${style.main} ${className}`}>
            <div className={style.header}>
                <h1 className={style.title}>{isEdit ? "編集" : "新規作成"}</h1>
                <div className={style.buttonContainer}>
                    {isEdit && (
                        <Button variant="destructive" onClick={deleteHandler}>
                            削除
                        </Button>
                    )}
                    <Button variant="outline" onClick={previewHandler}>
                        プレビュー
                    </Button>
                </div>
            </div>
            <div className={style.editorContainer}>
                <div className={style.section}>
                    <h2>基本情報</h2>
                    <div className={style.inputContainer}>
                        <div className={style.inputWithLabel}>
                            <label>緯度</label>
                            <Input placeholder="緯度を入力" {...register("latitude")} type="number" />
                        </div>
                        <ErrorMessage message={errors.latitude?.message} className={style.errorMessage} />
                    </div>
                    <div className={style.inputContainer}>
                        <div className={style.inputWithLabel}>
                            <label>経度</label>
                            <Input placeholder="経度を入力" {...register("longitude")} type="number" />
                        </div>
                        <ErrorMessage message={errors.longitude?.message} className={style.errorMessage} />
                    </div>
                    {watchedType && (
                        <div className={style.inputContainer}>
                            <div className={style.inputWithLabel}>
                                <label>サイズ</label>
                                <Input placeholder="サイズを入力" {...register("options.size")} type="number" />
                            </div>
                            <ErrorMessage message={errors.options?.size?.message} className={style.errorMessage} />
                        </div>
                    )}
                </div>
                <div className={style.section}>
                    <h2>タイプ選択</h2>
                    <div className={style.inputContainer}>
                        <div className={style.inputWithLabel}>
                            <label>タイプ</label>
                            <Controller
                                control={control}
                                name="type"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="選択してください" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {decorationTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <ErrorMessage message={errors.type?.message} className={style.errorMessage} />
                    </div>
                </div>

                {(watchedType === "SpeechBubble1" || watchedType === "SpeechBubble2" || watchedType === "MaskingTape") && (
                    <div className={style.section}>
                        <h2>テキスト</h2>
                        <div className={style.inputContainer}>
                            <div className={style.inputWithLabel}>
                                <label>日本語</label>
                                <Input placeholder="" {...register("options.text.ja")} />
                            </div>
                            <ErrorMessage message={errors.options?.text?.ja?.message} className={style.errorMessage} />
                        </div>
                        <div className={style.inputContainer}>
                            <div className={style.inputWithLabel}>
                                <label>英語</label>
                                <Input placeholder="" {...register("options.text.en")} />
                            </div>
                            <ErrorMessage message={errors.options?.text?.en?.message} className={style.errorMessage} />
                        </div>
                        <div className={style.inputContainer}>
                            <div className={style.inputWithLabel}>
                                <label>韓国語</label>
                                <Input placeholder="" {...register("options.text.ko")} />
                            </div>
                            <ErrorMessage message={errors.options?.text?.ko?.message} className={style.errorMessage} />
                        </div>
                    </div>
                )}

                {watchedType === "SpeechBubble1" && (
                    <div className={style.inputContainer}>
                        <div className={style.inputWithLabel}>
                            <label>矢印の位置</label>
                            <Controller
                                control={control}
                                name="options.arrowPosition"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="選択してください" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {arrowPositionOptions.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <ErrorMessage message={errors.options?.arrowPosition?.message} className={style.errorMessage} />
                    </div>
                )}

                {watchedType === "Image" && (
                    <div className={style.section}>
                        <h2>画像URL</h2>
                        <div className={style.inputContainer}>
                            <div className={style.inputWithLabel}>
                                <label>URL</label>
                                <Input placeholder="" {...register("options.src")} />
                            </div>
                            <ErrorMessage message={errors.options?.src?.message} className={style.errorMessage} />
                        </div>
                    </div>
                )}

                <div className={style.footer}>
                    <Button onClick={saveHandler}>{isEdit ? "保存" : "作成"}</Button>
                    <Button variant="outline" onClick={onCancel}>
                        キャンセル
                    </Button>
                </div>
            </div>
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{isEdit ? "変更を保存してもいいですか？" : "装飾マーカーを新規作成してもいいですか？"}</AlertDialogTitle>
                        <AlertDialogDescription>保存されるとすぐに反映されます。</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <AlertDialogAction onClick={performSave}>{isEdit ? "保存" : "作成"}</AlertDialogAction>
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
        </div>
    );
}
