"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Description from "./description";
import IconUrl from "./iconUrl";
import ImageUrls from "./imageUrls";
import style from "./index.module.css";
import Info from "./info";
import Location from "./location";
import SpotsName from "./name";
import NearbyRecommendations from "./nearbyRecommendations";
import RecommendedFor from "./recommendedFor";
import SnsLinks from "./snsLinks";
import TagSelector from "./tagSelector";

import { placeSchema } from "@/lib/placeSchema";

export default function EditTouristSpots({ touristSpot, onSave, onPreview, onDelete, isEdit, onDirtyChange }) {
    const {
        register,
        control,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors, isDirty },
    } = useForm({
        resolver: zodResolver(placeSchema),
        mode: "onChange",
        defaultValues: {
            name: { ja: "", en: "", ko: "" },
            icon: "",
            images: [],
            latitude: 35,
            longitude: 135,
            tags: [],
            description: { ja: "", en: "", ko: "" },
            recommended_for: { ja: "", en: "", ko: "" },
            info: [],
            nearby_recommendations: [],
            sns_links: [],
        },
    });

    const isFirstRenderRef = useRef(true);
    const skipNextAutoPreviewRef = useRef(false);
    const autoPreviewTimerRef = useRef(null);

    useEffect(() => {
        if (touristSpot) {
            reset(touristSpot);
            // 親からのリセット直後は自動プレビューを一度スキップ
            skipNextAutoPreviewRef.current = true;
        }
    }, [touristSpot, reset]);

    // フォームの未保存状態の変化を親へ通知
    useEffect(() => {
        if (typeof onDirtyChange === "function") {
            onDirtyChange(!!isDirty);
        }
    }, [isDirty, onDirtyChange]);

    const saveHandler = handleSubmit((data) => {
        if (onSave) onSave(data);
    });

    const previewHandler = handleSubmit((data) => {
        if (onPreview) onPreview(data);
    });

    // 入力停止後0.5秒で自動プレビュー（初回・reset直後はスキップ）。
    // watch の購読で実際の値変更時のみタイマーを起動する。
    useEffect(() => {
        const subscription = watch(() => {
            // 初回（マウント直後）のイベントはスキップ
            if (isFirstRenderRef.current) {
                isFirstRenderRef.current = false;
                return;
            }
            // reset による直後の一度はスキップ
            if (skipNextAutoPreviewRef.current) {
                skipNextAutoPreviewRef.current = false;
                return;
            }
            if (!onPreview) return;

            if (autoPreviewTimerRef.current) {
                clearTimeout(autoPreviewTimerRef.current);
            }
            autoPreviewTimerRef.current = setTimeout(() => {
                handleSubmit((data) => onPreview(data))();
            }, 500);
        });

        return () => {
            subscription?.unsubscribe?.();
            if (autoPreviewTimerRef.current) clearTimeout(autoPreviewTimerRef.current);
        };
    }, [watch, onPreview, handleSubmit]);

    return (
        <div className={style.main}>
            <div className={style.header}>
                <h1 className={style.title}>{isEdit ? "編集" : "新規作成"}</h1>
                <div className={style.buttonContainer}>
                    <Button onClick={saveHandler}>{isEdit ? "保存" : "作成"}</Button>
                    {isEdit && (
                        <Button variant="destructive" onClick={onDelete}>
                            削除
                        </Button>
                    )}
                </div>
            </div>
            <div className={style.editorContainer}>
                <SpotsName register={register} errors={errors} />
                <IconUrl register={register} errors={errors} setValue={setValue} />
                <ImageUrls register={register} errors={errors} control={control} setValue={setValue} />
                <Location register={register} errors={errors} />
                <TagSelector control={control} name="tags" errors={errors} />
                <Description control={control} errors={errors} />
                <RecommendedFor control={control} errors={errors} />
                <Info control={control} register={register} errors={errors} name="info" />
                <NearbyRecommendations control={control} errors={errors} name="nearby_recommendations" myId={touristSpot?.id} />
                <SnsLinks control={control} errors={errors} register={register} name="sns_links" />
            </div>
        </div>
    );
}
