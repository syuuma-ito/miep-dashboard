"use client";

import Tag from "@/components/Tag";
import { getAllTagsByLang } from "@/lib/supabase/getAllTags";
import { useEffect, useState } from "react";
import style from "./tagSelector.module.css";

import { memo } from "react";

const TagSelector = ({ selectedTags, setSelectedTags }) => {
    const [allTags, setAllTags] = useState([]);

    useEffect(() => {
        const fetchTags = async () => {
            const tags = await getAllTagsByLang("ja");
            setAllTags(tags);
        };
        fetchTags();
    }, []);

    const toggleTag = (tag) => {
        setSelectedTags((prev) => (prev.includes(tag.id) ? prev.filter((id) => id !== tag.id) : [...prev, tag.id]));
    };

    const availableTags = allTags.filter((tag) => !selectedTags.includes(tag.id));

    const tagElements = (tags) => (
        <div className={style.tags}>
            {tags.map((tag) => (
                <div key={tag.id} onClick={() => toggleTag(tag)} className={style.tag}>
                    <Tag name={tag.name} color={tag.color} />
                </div>
            ))}
        </div>
    );

    const displaySelectedTags = allTags.filter((tag) => selectedTags.includes(tag.id));

    return (
        <div className={style.container}>
            <h2>タグ</h2>
            <div className={style.tagSelectorContainer}>
                <div className={style.tagsContainer}>
                    <p>選択されたタグ</p>
                    {tagElements(displaySelectedTags)}
                </div>
                <div className={style.tagsContainer}>
                    <p>すべてのタグ</p>
                    {tagElements(availableTags)}
                </div>
            </div>
        </div>
    );
};

export default memo(TagSelector);
