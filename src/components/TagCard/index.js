import style from "./index.module.css";

const TagCard = ({ tag, className }) => {
    const tagName = tag.name ? tag.name.ja : "不明なタグ";

    return (
        <div className={`${style.tagCard} ${className}`}>
            <div style={{ backgroundColor: tag.color }} className={style.tagColor}></div>
            <span>{tagName}</span>
        </div>
    );
};

export default TagCard;
