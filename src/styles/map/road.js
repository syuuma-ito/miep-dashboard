import theme from "./theme";

const roadLayers = [
    {
        id: "road_motorway",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        minzoom: 5,
        layout: {
            "line-cap": "round",
            "line-join": "round",
            visibility: "visible",
        },
        paint: {
            "line-color": theme.road.motorway,
            "line-width": {
                base: 1.2,
                stops: [
                    [5, 1],
                    [18, 10],
                ],
            },
        },
        metadata: {},
        filter: ["all", ["==", "class", "motorway"], ["!=", "ramp", 1]],
    },
    {
        id: "road_motorway_ramp",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        minzoom: 5,
        layout: {
            "line-cap": "round",
            "line-join": "round",
            visibility: "visible",
        },
        paint: {
            "line-color": theme.road.motorway_ramp,
            "line-width": {
                base: 1.2,
                stops: [
                    [5, 1],
                    [18, 5],
                ],
            },
        },
        metadata: {},
        filter: ["all", ["==", "class", "motorway"], ["==", "ramp", 1]],
    },
    {
        id: "road_trunk",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        minzoom: 7,
        layout: {
            "line-cap": "round",
            "line-join": "round",
            visibility: "visible",
        },
        paint: {
            "line-color": theme.road.trunk,
            "line-width": {
                base: 1.2,
                stops: [
                    [5, 0],
                    [18, 10],
                ],
            },
        },
        metadata: {},
        filter: ["all", ["in", "class", "trunk"]],
    },
    {
        id: "road_primary",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        minzoom: 7,
        layout: {
            "line-cap": "round",
            "line-join": "round",
            visibility: "visible",
        },
        paint: {
            "line-color": theme.road.primary,
            "line-width": {
                base: 1.2,
                stops: [
                    [5, 0],
                    [18, 8],
                ],
            },
        },
        metadata: {},
        filter: ["in", "class", "primary"],
    },
    {
        id: "road_secondary",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        minzoom: 7,
        layout: {
            "line-cap": "round",
            "line-join": "round",
            visibility: "visible",
        },
        paint: {
            "line-color": theme.road.secondary,
            "line-width": {
                base: 1.2,
                stops: [
                    [5, 0],
                    [18, 8],
                ],
            },
        },
        metadata: {},
        filter: ["in", "class", "secondary"],
    },
    {
        id: "road_tertiary",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        minzoom: 7,
        layout: {
            "line-cap": "round",
            "line-join": "round",
            visibility: "visible",
        },
        paint: {
            "line-color": theme.road.tertiary,
            "line-width": {
                base: 1.2,
                stops: [
                    [5, 0],
                    [18, 8],
                ],
            },
            "line-opacity": {
                base: 1,
                stops: [
                    [11, 0],
                    [11.5, 1],
                ],
            },
        },
        metadata: {},
        filter: ["in", "class", "tertiary"],
    },
    {
        id: "road_service_track",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        minzoom: 7,
        layout: {
            "line-cap": "round",
            "line-join": "round",
            visibility: "visible",
        },
        paint: {
            "line-color": theme.road.minor,
            "line-width": {
                base: 1.2,
                stops: [
                    [5, 0],
                    [18, 8],
                ],
            },
            "line-opacity": {
                base: 1,
                stops: [
                    [11, 0],
                    [11.5, 1],
                ],
            },
        },
        metadata: {},
        filter: ["in", "class", "service"],
    },
    {
        id: "road_minor",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        minzoom: 7,
        layout: {
            "line-cap": "round",
            "line-join": "round",
            visibility: "visible",
        },
        paint: {
            "line-color": theme.road.minor,
            "line-width": {
                base: 1.2,
                stops: [
                    [5, 0],
                    [18, 5],
                ],
            },
            "line-opacity": {
                base: 1,
                stops: [
                    [13, 0],
                    [13.5, 1],
                ],
            },
        },
        metadata: {},
        filter: ["in", "class", "minor", "track"],
    },

    //
    // その他の道路
    //

    {
        id: "aeroway_runway",
        type: "line",
        source: "openmaptiles",
        "source-layer": "aeroway",
        minzoom: 11,
        layout: {
            visibility: "visible",
        },
        paint: {
            "line-color": theme.road.other,
            "line-width": {
                base: 1.2,
                stops: [
                    [11, 3],
                    [20, 48],
                ],
            },
            "line-opacity": 1,
        },
        metadata: {},
        filter: ["all", ["==", "$type", "LineString"], ["==", "class", "runway"]],
    },
    {
        id: "aeroway_taxiway",
        type: "line",
        source: "openmaptiles",
        "source-layer": "aeroway",
        minzoom: 11,
        layout: {
            visibility: "visible",
        },
        paint: {
            "line-color": theme.road.other,
            "line-width": {
                base: 1.2,
                stops: [
                    [11, 1],
                    [20, 24],
                ],
            },
            "line-opacity": 1,
        },
        metadata: {},
        filter: ["all", ["==", "$type", "LineString"], ["==", "class", "taxiway"]],
    },
    {
        id: "road_raceway",
        type: "line",
        source: "openmaptiles",
        "source-layer": "transportation",
        minzoom: 9,
        layout: {
            "line-cap": "round",
            "line-join": "round",
            visibility: "visible",
        },
        paint: {
            "line-color": theme.road.other,
            "line-width": {
                base: 1.2,
                stops: [
                    [11, 0.7],
                    [18, 12.7],
                ],
            },
        },
        metadata: {},
        filter: ["all", ["in", "class", "raceway"]],
    },
    {
        id: "road_area_pedestrian",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "transportation",
        layout: {
            visibility: "visible",
        },
        paint: {
            "fill-color": "#dddde8",
        },
        metadata: {},
        filter: ["all", ["==", "$type", "Polygon"], ["!has", "brunnel"], ["!in", "class", "bridge", "pier"]],
    },
    {
        id: "road_area_platform",
        type: "fill",
        source: "openmaptiles",
        "source-layer": "transportation",
        layout: {
            visibility: "visible",
        },
        paint: {
            "fill-color": "#bababa",
        },
        metadata: {},
        filter: ["all", ["==", "$type", "Polygon"], ["!has", "brunnel"], ["==", "class", "path"], ["==", "subclass", "platform"]],
    },
];

// layerの順番を逆転させてからエクスポート
export default roadLayers.reverse();
