import style from "./image.module.css";

export default function ImagePin({ src, alt, size }) {
    return (
        <div className={style.container} style={{ transform: `scale(${size})` }}>
            <img src={src} alt={alt} className={style.image} />
        </div>
    );
}
