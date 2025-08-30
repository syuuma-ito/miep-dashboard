"use client";

import { supabase } from "./supabase";

async function getAllSpotsByLang(lang) {
    try {
        const { data, error } = await supabase.rpc("get_all_spots_by_lang", {
            p_lang: lang,
        });

        if (error) {
            console.error("Error fetching all spots:", error);
            alert("データの取得中にエラーが発生しました...時間をおいて再度お試しください。");
            throw error;
        }

        return data || [];
    } catch (err) {
        console.error("An unexpected error occurred:", err);
        alert("データの取得中にエラーが発生しました...時間をおいて再度お試しください。");
        return null;
    }
}

export { getAllSpotsByLang };
