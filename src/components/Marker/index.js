import style from "./marker.module.css";

export default function Marker({ spot, onClick }) {
    return (
        <div className={style.marker}>
            <div className={style.container}>
                <div className={style.callout}>
                    <div className={style.diagonal_line}></div>
                    <div className={style.circle}></div>
                    <div className={style.line}></div>
                </div>
                <div className={style.item} onClick={onClick}>
                    <img src={spot.icon} alt={spot.name} className={style.icon} />
                    <span className={`${style.text} ${spot.isActive ? style.active : ""}`}>{spot.name}</span>
                </div>
            </div>
        </div>
    );
}
