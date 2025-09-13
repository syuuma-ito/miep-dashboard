import baseLayers from "./base";
import boundaryLayers from "./boundary";
import famousTrainsLabel from "./famousTrainsLabel";
import labelLayers from "./label";
import railLayers from "./rail";
import roadLayers from "./road";
const mapStyle = (lang) => ({
    version: 8,
    name: "miep map style",
    id: "miep-style",
    center: [0, 0],
    zoom: 1,
    bearing: 0,
    pitch: 0,
    sources: {
        openmaptiles: {
            type: "vector",
            url: "https://tile.openstreetmap.jp/data/planet.json",
        },
        famousTrains: {
            type: "geojson",
            data: `${process.env.NEXT_PUBLIC_URL}/geojson/famous_trains.geojson`,
        },
    },
    glyphs: "/glyphs/{fontstack}/{range}.pbf",
    sprite: [
        {
            id: "default",
            url: "https://tile.openstreetmap.jp/styles/openmaptiles/sprite",
        },
        {
            id: "train",
            url: `${process.env.NEXT_PUBLIC_URL}/sprite/train`,
        },
    ],
    layers: [...baseLayers, ...roadLayers, ...railLayers, ...labelLayers(lang), ...boundaryLayers, famousTrainsLabel(lang)],
});

export default mapStyle;
