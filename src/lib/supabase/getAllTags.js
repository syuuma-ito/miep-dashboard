"use client";

import { displayError } from "../error";
import { supabase } from "./client";

async function getAllTagsByLang(lang) {
    try {
        const { data, error } = await supabase.rpc("get_all_tags", {
            p_lang: lang,
        });

        if (error) {
            displayError("データの取得中にエラーが発生しました...時間をおいて再度お試しください。");
        }

        return data || [];
    } catch (err) {
        displayError("データの取得中にエラーが発生しました...時間をおいて再度お試しください。");
        return [];
    }
}

export { getAllTagsByLang };
