"use client";

import { supabase } from "./supabase";

async function getAllTagsByLang(lang) {
    try {
        const { data, error } = await supabase.rpc("get_all_tags_by_lang", {
            p_lang: lang,
        });

        if (error) {
            alert("データの取得中にエラーが発生しました...時間をおいて再度お試しください。");
            throw error;
        }

        return data || [];
    } catch (err) {
        alert("データの取得中にエラーが発生しました...時間をおいて再度お試しください。");
        return null;
    }
}

export { getAllTagsByLang };
