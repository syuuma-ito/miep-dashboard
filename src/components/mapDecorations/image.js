import style from "./image.module.css";

export default function ImagePin({ src, alt, onClick, preview }) {
    return (
        <div className={`${style.container} ${preview ? style.preview : ""}`} onClick={onClick}>
            <img src={src} alt={alt} className={style.image} />
        </div>
    );
}
