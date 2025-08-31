"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import ColorPicker from "../ColorPicker";
import { Input } from "../ui/input";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const schema = z
    .object({
        color: z
            .string()
            .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, {
                message: "カラーコードは#FF0000または#F00の形式で入力してください",
            })
            .transform((s) => s.toUpperCase()),
        name: z
            .object({
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
            })
            .strict(),
    })
    .strict();

export default function EditTag({ tag }) {
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

    useEffect(() => {
        if (tag) {
            reset(tag);
        }
    }, [tag, reset]);

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>タグの編集</CardTitle>
                    <CardDescription>タグの編集を行います。</CardDescription>
                    <CardAction>保存</CardAction>
                </CardHeader>
                <CardContent>
                    <form>
                        <Controller name="color" control={control} render={({ field }) => <ColorPicker color={field.value} onChange={field.onChange} />} />
                        {errors.color && <p className="text-red-500 text-sm">{errors.color.message}</p>}

                        <Input {...register("name.ja")} maxLength={50} />
                        {errors.name?.ja && <p className="text-red-500 text-sm">{errors.name.ja.message}</p>}
                        <Input {...register("name.en")} maxLength={50} />
                        {errors.name?.en && <p className="text-red-500 text-sm">{errors.name.en.message}</p>}
                        <Input {...register("name.ko")} maxLength={50} />
                        {errors.name?.ko && <p className="text-red-500 text-sm">{errors.name.ko.message}</p>}
                    </form>
                </CardContent>
            </Card>
        </>
    );
}
