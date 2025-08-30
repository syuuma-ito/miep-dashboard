"use client";

import { useState } from "react";
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

const allTags = [
    {
        name: "タグ1",
        color: "#ff0000",
        id: 1,
    },
    {
        name: "タグ2",
        color: "#00ff00",
        id: 2,
    },
    {
        name: "タグ3",
        color: "#0000ff",
        id: 3,
    },
];

const allTouristSpots = [
    { id: 1, name: "観光地A" },
    { id: 2, name: "観光地B" },
    { id: 3, name: "観光地C" },
];

const data = {
    name: {
        ja: "",
        en: "",
        ko: "",
    },
    icon: "",
    images: [],
    tags: ["id", "id2"],
    latitude: 0,
    longitude: 0,
    description: {
        ja: "",
        en: "",
        ko: "",
    },
    recommended_for: {
        ja: "",
        en: "",
        ko: "",
    },
    info: [
        {
            key: {
                ja: "",
                en: "",
                ko: "",
            },
            value: {
                ja: "",
                en: "",
                ko: "",
            },
        },
        {
            key: {
                ja: "",
                en: "",
                ko: "",
            },
            value: {
                ja: "",
                en: "",
                ko: "",
            },
        },
    ],
    nearby_recommendations: ["id", "id2"],
    sns_links: [
        {
            platform: "",
            url: "",
        },
        {
            platform: "",
            url: "",
        },
    ],
};

export default function EditTouristSpots() {
    const [name_ja, setName_ja] = useState("");
    const [name_en, setName_en] = useState("");
    const [name_ko, setName_ko] = useState("");

    const [iconUrl, setIconUrl] = useState("");

    const [imageUrls, setImageUrls] = useState([]);

    const [selectedTags, setSelectedTags] = useState([]);

    const [location, setLocation] = useState({ latitude: 34.7303, longitude: 136.5086 });

    const [description_ja, setDescription_ja] = useState("");
    const [description_en, setDescription_en] = useState("");
    const [description_ko, setDescription_ko] = useState("");

    const [recommendedFor_jp, setRecommendedFor_jp] = useState("");
    const [recommendedFor_en, setRecommendedFor_en] = useState("");
    const [recommendedFor_ko, setRecommendedFor_ko] = useState("");

    const [info, setInfo] = useState([]);

    const [nearbyRecommendations, setNearbyRecommendations] = useState([]);

    const [snsLinks, setSnsLinks] = useState([]);

    return (
        <div className={style.container}>
            <h1 className={style.title}>観光地の編集</h1>
            <div className={style.editorContainer}>
                <TouristSpotsName name_ja={name_ja} name_en={name_en} name_ko={name_ko} setName_ja={setName_ja} setName_en={setName_en} setName_ko={setName_ko} />
                <IconUrl iconUrl={iconUrl} setIconUrl={setIconUrl} />
                <ImageUrls imageUrls={imageUrls} setImageUrls={setImageUrls} />

                <Location location={location} setLocation={setLocation} />

                <TagSelector selectedTags={selectedTags} setSelectedTags={setSelectedTags} allTags={allTags} />

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

                <NearbyRecommendations nearbyRecommendations={nearbyRecommendations} setNearbyRecommendations={setNearbyRecommendations} allTouristSpots={allTouristSpots} />

                <SnsLinks snsLinks={snsLinks} setSnsLinks={setSnsLinks} />
            </div>
        </div>
    );
}
