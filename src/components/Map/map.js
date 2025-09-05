"use client";

import Marker from "@/components/Marker";
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import MapControls from "../MapControls";
import ImagePin from "../mapDecorations/image";
import MaskingTape from "../mapDecorations/maskingTape";
import SpeechBubble1 from "../mapDecorations/speechBubble1";
import SpeechBubble2 from "../mapDecorations/speechBubble2";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import styles from "./map.module.css";

import { memo } from "react";

function getScale(zoom, baseZoom = 10) {
    return Math.min(Math.pow(2, zoom - baseZoom), 1);
}

const Map = ({ touristSpot = null, mapDecorations = [], onLoad, onMapInfoChange }) => {
    const lang = "ja";

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [touristSpotMarker, setTouristSpotMarker] = useState(null);
    const [mapDecorationsMarkers, setMapDecorationsMarkers] = useState([]);

    useEffect(() => {
        if (map.current) {
            return;
        }

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: "/style/map-style.json",
            center: [136.508588, 34.730283],
            zoom: 9,
            localIdeographFontFamily: false,
        });

        // マップの情報を更新
        const updateMapInfo = () => {
            const zoom = map.current.getZoom();
            const center = map.current.getCenter();
            onMapInfoChange({
                zoom: zoom,
                center: [center.lng, center.lat],
            });

            updateMarkerScale(zoom);
        };

        // マーカーの大きさを地図のズームレベルに応じて変更
        const updateMarkerScale = (zoom) => {
            const baseZoom = 10;
            const scale = Math.pow(1.2, zoom - baseZoom);
            const clampedScale = Math.max(0.3, Math.min(2.0, scale));

            document.documentElement.style.setProperty("--global-marker-scale", clampedScale);

            const actualMarkerScale = getScale(zoom);
            document.documentElement.style.setProperty("--actual-marker-scale", actualMarkerScale);
        };

        map.current.on("zoom", updateMapInfo);
        map.current.on("move", updateMapInfo);
        map.current.on("load", () => {
            updateMapInfo();
            onLoad();
        });
        return () => {
            if (map.current) {
                map.current.off("zoom", updateMapInfo);
                map.current.off("move", updateMapInfo);
                map.current.remove();
                map.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 観光スポットのマーカーを追加
    useEffect(() => {
        if (!map.current) return;

        const addTouristSpotMarkers = () => {
            if (!touristSpot) return;

            touristSpotMarker?.remove();
            setTouristSpotMarker(null);

            const spot = touristSpot;
            const markerElement = document.createElement("div");
            markerElement.className = "tourist-spot-marker";
            markerElement.style.pointerEvents = "none";

            const root = createRoot(markerElement);
            const renderMarker = () => {
                root.render(<Marker spot={spot} />);
            };

            renderMarker();
            spot.renderMarker = renderMarker;

            map.current.flyTo({ center: [spot.longitude, spot.latitude], zoom: 10 });

            const marker = new maplibregl.Marker({ element: markerElement }).setLngLat([spot.longitude, spot.latitude]).addTo(map.current);
            setTouristSpotMarker(marker);
        };

        if (map.current.loaded()) {
            addTouristSpotMarkers();
        } else {
            map.current.on("load", addTouristSpotMarkers);
        }

        return () => {
            if (map.current) {
                map.current.off("load", addTouristSpotMarkers);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [touristSpot, lang]);

    // 装飾マーカーを追加
    useEffect(() => {
        if (!map.current) return;

        const addMapDecorationsMarkers = () => {
            if (mapDecorations.length === 0) return;

            mapDecorationsMarkers.forEach((mapDecorationMarker) => mapDecorationMarker.remove());
            setMapDecorationsMarkers([]);

            mapDecorations.forEach((mapDecoration) => {
                const markerElement = document.createElement("div");
                markerElement.className = "map-pin";
                markerElement.style.pointerEvents = "none";

                const root = createRoot(markerElement);
                const renderMarker = () => {
                    if (mapDecoration.type === "MaskingTape") {
                        root.render(<MaskingTape text={mapDecoration.options.text} />);
                    } else if (mapDecoration.type === "SpeechBubble1") {
                        root.render(<SpeechBubble1 text={mapDecoration.options.text} arrowPosition={mapDecoration.options.arrowPosition} />);
                    } else if (mapDecoration.type === "SpeechBubble2") {
                        root.render(<SpeechBubble2 text={mapDecoration.options.text} />);
                    } else if (mapDecoration.type === "image") {
                        root.render(<ImagePin src={mapDecoration.options.src} alt={mapDecoration.options.alt} size={mapDecoration.options.size} />);
                    }
                };

                renderMarker();
                mapDecoration.renderMarker = renderMarker;

                const marker = new maplibregl.Marker({ element: markerElement }).setLngLat([mapDecoration.longitude, mapDecoration.latitude]).addTo(map.current);
                setMapDecorationsMarkers((prevMarkers) => [...prevMarkers, marker]);
            });
        };

        if (map.current.loaded()) {
            addMapDecorationsMarkers();
        } else {
            map.current.on("load", addMapDecorationsMarkers);
        }

        return () => {
            if (map.current) {
                map.current.off("load", addMapDecorationsMarkers);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mapDecorations, lang]);
    return (
        <>
            <div ref={mapContainer} className={styles.mapContainer} />
            <MapControls mapRef={map} />
        </>
    );
};

export default memo(Map);
