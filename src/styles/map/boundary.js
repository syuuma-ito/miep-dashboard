import theme from "./theme";

const boundaryLayers = [
    {
        id: "boundary_4",
        type: "line",
        source: "openmaptiles",
        "source-layer": "boundary",
        minzoom: 3,
        layout: {
            "line-join": "round",
            visibility: "visible",
        },
        paint: {
            "line-color": theme.boundary.color4,
            "line-width": {
                base: 1,
                stops: [
                    [4, 0.4],
                    [5, 0.7],
                    [12, 1.6],
                ],
            },
            "line-opacity": {
                stops: [
                    [3, 0.5],
                    [10, 1],
                ],
            },
            "line-dasharray": [5, 3],
        },
        metadata: {},
        filter: ["all", ["in", "admin_level", 4], ["==", "maritime", 0]],
    },
    {
        id: "boundary_6",
        type: "line",
        source: "openmaptiles",
        "source-layer": "boundary",
        minzoom: 3,
        layout: {
            "line-join": "round",
            visibility: "visible",
        },
        paint: {
            "line-color": theme.boundary.color6,
            "line-width": {
                base: 1,
                stops: [
                    [4, 0.4],
                    [5, 0.7],
                    [12, 1.6],
                ],
            },
            "line-opacity": {
                stops: [
                    [3, 0.5],
                    [10, 1],
                ],
            },
            "line-dasharray": [5, 3],
        },
        metadata: {},
        filter: ["all", ["in", "admin_level", 6], ["==", "maritime", 0]],
    },
];

export default boundaryLayers;
