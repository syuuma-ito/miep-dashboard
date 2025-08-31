"use client";

import Tag from "@/components/Tag";
import { getAllTagsByLang } from "@/lib/supabase/getAllTags";
import { memo, useEffect, useState } from "react";
import { useController } from "react-hook-form";
import style from "./tagSelector.module.css";

import ErrorMessage from "./error";

const TagSelector = ({ control, name, errors }) => {
    const [allTags, setAllTags] = useState([]);

    const { field } = useController({
        name,
        control,
        defaultValue: [],
    });

    useEffect(() => {
        const fetchTags = async () => {
            const tags = await getAllTagsByLang("ja");
            setAllTags(tags);
        };
        fetchTags();
    }, []);

    const toggleTag = (tagId) => {
        const currentTags = field.value || [];
        const updatedTags = currentTags.includes(tagId) ? currentTags.filter((id) => id !== tagId) : [...currentTags, tagId];
        field.onChange(updatedTags);
    };

    const availableTags = allTags.filter((tag) => !field.value.includes(tag.id));
    const displaySelectedTags = allTags.filter((tag) => field.value.includes(tag.id));

    const tagElements = (tags) => (
        <div className={style.tags}>
            {tags.map((tag) => (
                <div key={tag.id} onClick={() => toggleTag(tag.id)} className={style.tag}>
                    <Tag name={tag.name} color={tag.color} />
                </div>
            ))}
        </div>
    );

    const error = errors?.[name];

    return (
        <div className={style.section}>
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
            <ErrorMessage message={error?.message} />
        </div>
    );
};

export default memo(TagSelector);
