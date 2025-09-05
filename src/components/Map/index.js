"use client";

import styles from "./index.module.css";
import Map from "./map";
import MapOverlay from "./mapOverlay";

import { useCallback, useState } from "react";
import LoadingOverlay from "./loading";

import { memo } from "react";

const MapPreview = ({ touristSpot, mapDecorations }) => {
    const [loading, setLoading] = useState(true);
    const [mapInfo, setMapInfo] = useState({ zoom: 10, center: [0, 0] });

    const handleMapLoad = useCallback(() => {
        setLoading(false);
    }, []);

    const handleMapInfoChange = useCallback((info) => {
        setMapInfo(info);
    }, []);

    return (
        <div className={styles.container}>
            <LoadingOverlay loading={loading} />

            <Map touristSpot={touristSpot} mapDecorations={mapDecorations} onLoad={handleMapLoad} onMapInfoChange={handleMapInfoChange} />
            <MapOverlay mapInfo={mapInfo} />
        </div>
    );
};

export default memo(MapPreview);
