import theme from "./theme";

const famousTrainsLabel = (lang) => ({
    id: "famous-trains-label",
    type: "symbol",
    source: "famousTrains",
    minzoom: 10,
    maxzoom: 12,
    layout: {
        "icon-size": 0.03,
        "text-font": theme.text.fontFamily(lang),
        "text-size": 11,
        "icon-image": "train:train",
        "text-field": theme.text.textField(lang),
        visibility: "visible",
        "icon-anchor": "center",
        "text-anchor": "left",
        "text-offset": [1, 0],
        "text-padding": 2,
        "icon-text-fit": "none",
        "text-max-width": 12,
        "icon-allow-overlap": false,
        "text-allow-overlap": false,
        "icon-pitch-alignment": "viewport",
    },
    paint: {
        "text-color": "#4957ad",
        "icon-translate": [0, 0],
        "text-translate": [0, 1],
        "text-halo-color": "rgba(255, 255, 255, 1)",
        "text-halo-width": 0.8,
        "icon-translate-anchor": "map",
        "text-translate-anchor": "viewport",
    },
    metadata: {},
});

export default famousTrainsLabel;
