import theme from "./theme";

const railLayers = [
    {
        id: "tunnel_major_rail",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        layout: {
            visibility: "visible",
        },
        paint: {
            "line-color": theme.rail.color,
            "line-width": {
                base: 1.4,
                stops: [
                    [8, 0.8],
                    [20, 5.4],
                ],
            },
            "line-opacity": {
                base: 1,
                stops: [
                    [8, 0],
                    [8.5, 1],
                ],
            },
        },
        metadata: {},
        filter: ["in", "class", "rail"],
    },
    {
        id: "rail_minor",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        layout: {
            visibility: "visible",
        },
        paint: {
            "line-color": theme.rail.color,
            "line-width": {
                base: 1.4,
                stops: [
                    [12, 0.8],
                    [15, 1.2],
                    [20, 4],
                ],
            },
        },
        metadata: {},
        filter: ["in", "subclass", "tram", "light_rail"],
    },
    {
        id: "rail_subway",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        layout: {
            visibility: "visible",
        },
        paint: {
            "line-color": theme.rail.subway,
            "line-width": {
                stops: [
                    [14, 1],
                    [18, 3],
                ],
            },
            "line-opacity": 1,
            "line-dasharray": [1, 1.2],
        },
        metadata: {},
        filter: ["all", ["==", "class", "transit"], ["==", "subclass", "subway"]],
    },
    {
        id: "cablecar",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        minzoom: 13,
        layout: {
            "line-cap": "round",
            visibility: "visible",
        },
        paint: {
            "line-color": theme.rail.other,
            "line-width": {
                base: 1,
                stops: [
                    [11, 1],
                    [19, 2.5],
                ],
            },
        },
        filter: ["==", "class", "aerialway"],
    },
];

export default railLayers;
