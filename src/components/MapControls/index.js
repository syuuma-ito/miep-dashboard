"use client";

import { FaMinus, FaPlus } from "react-icons/fa6";
import styles from "./MapControls.module.css";

import { memo } from "react";
import { TbNavigationNorth } from "react-icons/tb";

const MapControls = ({ mapRef, t }) => {
    const handleZoomIn = () => {
        if (mapRef.current) {
            mapRef.current.zoomIn();
        }
    };

    const handleZoomOut = () => {
        if (mapRef.current) {
            mapRef.current.zoomOut();
        }
    };

    const handleResetNorth = () => {
        if (mapRef.current) {
            mapRef.current.resetNorth();
        }
    };

    return (
        <div className={styles.customControls}>
            <button className={styles.controlButton} onClick={handleZoomIn} title="ズームイン" aria-label="ズームイン">
                <FaPlus />
            </button>
            <button className={styles.controlButton} onClick={handleZoomOut} title="ズームアウト" aria-label="ズームアウト">
                <FaMinus />
            </button>
            <button className={styles.controlButton} onClick={handleResetNorth} title="北をリセット" aria-label="北をリセット">
                <TbNavigationNorth className={styles.NorthIcon} />
            </button>
        </div>
    );
};

export default memo(MapControls);
