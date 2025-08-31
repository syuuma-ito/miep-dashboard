"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Description from "./description";
import IconUrl from "./iconUrl";
import ImageUrls from "./imageUrls";
import style from "./index.module.css";
import Info from "./info";
import Location from "./location";
import NearbyRecommendations from "./nearbyRecommendations";
import RecommendedFor from "./recommendedFor";
import SnsLinks from "./snsLinks";
import TagSelector from "./tagSelector";
import TouristSpotsName from "./touristSpotsName";

export default function EditTouristSpots({ touristSpot, onSave, onPreview }) {
    const [name_ja, setName_ja] = useState("");
    const [name_en, setName_en] = useState("");
    const [name_ko, setName_ko] = useState("");
    const [iconUrl, setIconUrl] = useState("");
    const [images, setImages] = useState([]);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [tags, setTags] = useState([]);
    const [description_ja, setDescription_ja] = useState("");
    const [description_en, setDescription_en] = useState("");
    const [description_ko, setDescription_ko] = useState("");
    const [recommendedFor_jp, setRecommendedFor_jp] = useState("");
    const [recommendedFor_en, setRecommendedFor_en] = useState("");
    const [recommendedFor_ko, setRecommendedFor_ko] = useState("");
    const [info, setInfo] = useState([]);
    const [nearbyRecommendations, setNearbyRecommendations] = useState([]);
    const [snsLinks, setSnsLinks] = useState({});

    useEffect(() => {
        if (touristSpot && Object.keys(touristSpot).length > 0) {
            setName_ja(touristSpot.name.ja);
            setName_en(touristSpot.name.en);
            setName_ko(touristSpot.name.ko);
            setIconUrl(touristSpot.icon);
            setImages(touristSpot.images);
            setLatitude(touristSpot.latitude);
            setLongitude(touristSpot.longitude);
            setTags(touristSpot.tags);
            setDescription_ja(touristSpot.description_ja);
            setDescription_en(touristSpot.description_en);
            setDescription_ko(touristSpot.description_ko);
            setRecommendedFor_jp(touristSpot.recommendedFor_jp);
            setRecommendedFor_en(touristSpot.recommendedFor_en);
            setRecommendedFor_ko(touristSpot.recommendedFor_ko);
            setInfo(touristSpot.info);
            setNearbyRecommendations(touristSpot.nearby_recommendations);
            setSnsLinks(touristSpot.sns_links);
        }
    }, [touristSpot]);

    const data = {
        name: {
            ja: name_ja,
            en: name_en,
            ko: name_ko,
        },
        icon: iconUrl,
        images: images,
        latitude: latitude,
        longitude: longitude,
        tags: tags,
        description: {
            ja: description_ja,
            en: description_en,
            ko: description_ko,
        },
        recommendedFor: {
            ja: recommendedFor_jp,
            en: recommendedFor_en,
            ko: recommendedFor_ko,
        },
        info: info,
        nearby_recommendations: nearbyRecommendations,
        sns_links: snsLinks,
    };

    return (
        <div className={style.main}>
            <div className={style.header}>
                <h1 className={style.title}>{name_ja || "観光地の編集"}</h1>
                <div className={style.buttonContainer}>
                    <Button onClick={() => onSave(data)}>保存</Button>
                    <Button variant="outline" onClick={() => onPreview(data)}>
                        プレビュー
                    </Button>
                </div>
            </div>
            <div className={style.editorContainer}>
                <TouristSpotsName name_ja={name_ja} name_en={name_en} name_ko={name_ko} setName_ja={setName_ja} setName_en={setName_en} setName_ko={setName_ko} />
                <IconUrl iconUrl={iconUrl} setIconUrl={setIconUrl} />
                <ImageUrls images={images} setImages={setImages} />

                <Location latitude={latitude} setLatitude={setLatitude} longitude={longitude} setLongitude={setLongitude} />

                <TagSelector selectedTags={tags} setSelectedTags={setTags} />

                <Description
                    description_ja={description_ja}
                    description_en={description_en}
                    description_ko={description_ko}
                    setDescription_ja={setDescription_ja}
                    setDescription_en={setDescription_en}
                    setDescription_ko={setDescription_ko}
                />

                <RecommendedFor
                    recommendedFor_jp={recommendedFor_jp}
                    recommendedFor_en={recommendedFor_en}
                    recommendedFor_ko={recommendedFor_ko}
                    setRecommendedFor_jp={setRecommendedFor_jp}
                    setRecommendedFor_en={setRecommendedFor_en}
                    setRecommendedFor_ko={setRecommendedFor_ko}
                />

                <Info info={info} setInfo={setInfo} />

                <NearbyRecommendations nearbyRecommendations={nearbyRecommendations} setNearbyRecommendations={setNearbyRecommendations} />

                <SnsLinks snsLinks={snsLinks} setSnsLinks={setSnsLinks} />
            </div>
        </div>
    );
}
