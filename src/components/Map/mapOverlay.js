import styles from "./mapOverlay.module.css";

export default function MapOverlay({ mapInfo }) {
    return (
        <>
            \
            <div className={styles.mapInfo}>
                <div>デバッグ用</div>
                <div>ズーム: {mapInfo.zoom.toFixed(2)}</div>
                <div>緯度: {mapInfo.center[1].toFixed(6)}</div>
                <div>経度: {mapInfo.center[0].toFixed(6)}</div>
            </div>
        </>
    );
}
