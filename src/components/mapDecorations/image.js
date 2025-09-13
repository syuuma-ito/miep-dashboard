import style from "./image.module.css";

export default function ImagePin({ src, onClick, preview }) {
    return (
        <div className={`${style.container} ${preview ? style.preview : ""}`} onClick={onClick}>
            <img src={src} alt="map pin" className={style.image} />
        </div>
    );
}
