import chroma from "chroma-js";

export function getTextColor(backgroundColor) {
    try {
        const color = chroma(backgroundColor);
        const luminance = color.luminance();

        // 輝度が0.5以上なら黒、それ以外は白
        return luminance > 0.5 ? "#000000" : "#FFFFFF";
    } catch (error) {
        console.warn("Invalid color format:", backgroundColor);
        return "#000000";
    }
}
