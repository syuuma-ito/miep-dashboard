"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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

export default function EditTouristSpots({ touristSpot, onSave, onPreview }) {
    const {
        register,
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
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

    useEffect(() => {
        if (touristSpot) {
            reset(touristSpot);
        }
    }, [touristSpot, reset]);

    const saveHandler = handleSubmit((data) => {
        if (onSave) onSave(data);
    });

    const previewHandler = handleSubmit((data) => {
        if (onPreview) onPreview(data);
    });

    return (
        <div className={style.main}>
            <div className={style.header}>
                <h1 className={style.title}>観光地の編集</h1>
                <div className={style.buttonContainer}>
                    <Button onClick={saveHandler}>保存</Button>
                    <Button variant="outline" onClick={previewHandler}>
                        プレビュー
                    </Button>
                </div>
            </div>
            <div className={style.editorContainer}>
                <SpotsName register={register} errors={errors} />
                <IconUrl register={register} errors={errors} />
                <ImageUrls register={register} errors={errors} control={control} />
                <Location register={register} errors={errors} />
                <TagSelector control={control} name="tags" errors={errors} />
                <Description control={control} errors={errors} />
                <RecommendedFor control={control} errors={errors} />
                <Info control={control} register={register} errors={errors} name="info" />
                <NearbyRecommendations control={control} errors={errors} name="nearby_recommendations" />
                <SnsLinks control={control} errors={errors} register={register} name="sns_links" />
            </div>
        </div>
    );
}
