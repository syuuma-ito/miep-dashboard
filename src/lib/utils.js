import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export const PRESET_COLORS = [
    "#f28b82", // 赤: ソフトレッド（Soft Red）
    "#fbbd75", // オレンジ: アプリコット（Apricot）
    "#fff475", // 黄色: ソフトイエロー（Soft Yellow）
    "#e6ee9c", // 黄緑: ライトライム（Light Lime）
    "#b5e7a0", // 黄緑: ミントグリーン（Mint Green）
    "#81c995", // 緑: ソフトグリーン（Soft Green）
    "#a7ffeb", // 水色: ペールターコイズ（Pale Turquoise）
    "#90e0f3", // 青: ベビーブルー（Baby Blue）
    "#aecbfa", // 青: ソフトブルー（Soft Blue）
    "#c5b3f6", // 紫: ソフトバイオレット（Soft Violet）
    "#f3b0c3", // ピンク: ローズピンク（Rose Pink）

    "#f5f5f5", // グレー1: ごく淡いグレー（Very Light Gray）
    "#dcdcdc", // グレー2: ライトグレー（Light Gray）
    "#a9a9a9", // グレー3: ダークグレー（Dark Gray）
    "#696969", // グレー4: もっと暗いグレー（Darker Gray）
];
