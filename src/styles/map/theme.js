import { fontFamily, textField } from "./utils";

const theme = {
    color: {
        background: "#FAF3E8",
        parkGreen: "#d9efb3",
        green: "#b4d8a8",
        farmland: "#FAF3E8",
        sand: "#f0e8b4",
        water: "#bbdced",
    },
    road: {
        motorway: "#fac3af",
        motorway_ramp: "#fac3af",
        trunk: "#f5dbb5",
        primary: "#ffffff",
        secondary: "#ffffff",
        tertiary: "#ffffff",
        minor: "#ffffff",
        other: "#cccccc",
    },
    rail: {
        color: "#4C7CA1",
        subway: "#81817f",
        other: "#81817f",
    },
    boundary: {
        color4: "#aaa",
        color6: "#bbb",
    },
    text: {
        fontFamily: fontFamily,
        textField: textField,
    },
    textColor: {
        default: "#333",
        water: "#0081C2",
    },
};

export default theme;
