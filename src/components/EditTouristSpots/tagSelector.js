import Tag from "@/components/Tag";
import style from "./tagSelector.module.css";

export default function TagSelector({ selectedTags, setSelectedTags, allTags }) {
    const toggleTag = (tag) => {
        setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
    };

    const availableTags = allTags.filter((tag) => !selectedTags.some((selectedTag) => selectedTag.id === tag.id));

    const tagElements = (tags) => (
        <div className={style.tags}>
            {tags.map((tag) => (
                <div key={tag.id} onClick={() => toggleTag(tag)} className={style.tag}>
                    <Tag name={tag.name} color={tag.color} />
                </div>
            ))}
        </div>
    );

    return (
        <div className={style.container}>
            <h2>タグ</h2>
            <div className={style.tagSelectorContainer}>
                <div className={style.tagsContainer}>
                    <p>選択されたタグ</p>
                    {tagElements(selectedTags)}
                </div>
                <div className={style.tagsContainer}>
                    <p>すべてのタグ</p>
                    {tagElements(availableTags)}
                </div>
            </div>
        </div>
    );
}
