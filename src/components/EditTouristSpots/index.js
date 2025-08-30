"use client";

import { useState } from "react";
import IconUrl from "./iconUrl";
import ImageUrls from "./imageUrls";
import style from "./index.module.css";
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

export default function EditTouristSpots() {
    const [name_ja, setName_ja] = useState("");
    const [name_en, setName_en] = useState("");
    const [name_ko, setName_ko] = useState("");

    const [iconUrl, setIconUrl] = useState("");

    const [imageUrls, setImageUrls] = useState([""]);

    const [selectedTags, setSelectedTags] = useState([]);

    return (
        <div className={style.container}>
            <h1 className={style.title}>観光地の編集</h1>
            <div className={style.editorContainer}>
                <TouristSpotsName name_ja={name_ja} name_en={name_en} name_ko={name_ko} setName_ja={setName_ja} setName_en={setName_en} setName_ko={setName_ko} />
                <IconUrl iconUrl={iconUrl} setIconUrl={setIconUrl} />
                <ImageUrls imageUrls={imageUrls} setImageUrls={setImageUrls} />

                <TagSelector selectedTags={selectedTags} setSelectedTags={setSelectedTags} allTags={allTags} />
            </div>
        </div>
    );
}
